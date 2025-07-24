import React, { useState, useEffect } from 'react';
import { Plus, Clock, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface WorkLog {
  id: number;
  workDate: string;
  taskSummary: string;
  hoursWorked: number;
  comments: string;
  submittedAt: string;
}

export const EmployeeWorkLogs = () => {
  const [showForm, setShowForm] = useState(false);
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    taskSummary: '',
    comments: '',
    workDate: new Date().toISOString().split('T')[0],
    hoursWorked: 8
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchWorkLogs();
  }, []);

  const fetchWorkLogs = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:8080/api/employee/worklogs', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setWorkLogs(data);
      }
    } catch (error) {
      console.error('Failed to fetch work logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:8080/api/employee/worklogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchWorkLogs(); // Refresh the list
        setFormData({ 
          taskSummary: '', 
          comments: '', 
          workDate: new Date().toISOString().split('T')[0], 
          hoursWorked: 8 
        });
        setShowForm(false);
        
        toast({
          title: "Work Log Submitted",
          description: "Your work log has been recorded successfully.",
        });
      } else {
        throw new Error('Failed to submit work log');
      }
    } catch (error) {
      console.error('Error submitting work log:', error);
      toast({
        title: "Error",
        description: "Failed to submit work log. Please try again.",
        variant: "destructive",
      });
    }
  };

  const totalHoursThisWeek = workLogs
    .filter(log => {
      const logDate = new Date(log.workDate);
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      return logDate >= weekStart;
    })
    .reduce((total, log) => total + log.hoursWorked, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Work Logs</h1>
          <p className="text-muted-foreground">Track and manage your daily work activities</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          variant="gradient"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Work Log
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-glass border-glass backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold text-foreground">{totalHoursThisWeek}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-glass border-glass backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Logs</p>
                <p className="text-2xl font-bold text-foreground">{workLogs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-glass border-glass backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Daily</p>
                <p className="text-2xl font-bold text-foreground">7.5h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <Card className="bg-glass border-glass backdrop-blur-xl animate-scale-in">
          <CardHeader>
            <CardTitle className="text-foreground">New Work Log</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="taskSummary">Task Summary</Label>
                  <Input
                    id="taskSummary"
                    value={formData.taskSummary}
                    onChange={(e) => setFormData({...formData, taskSummary: e.target.value})}
                    placeholder="Enter task summary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workDate">Work Date</Label>
                  <Input
                    id="workDate"
                    type="date"
                    value={formData.workDate}
                    onChange={(e) => setFormData({...formData, workDate: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hoursWorked">Hours Worked</Label>
                  <Input
                    id="hoursWorked"
                    type="number"
                    min="0.5"
                    max="24"
                    step="0.5"
                    value={formData.hoursWorked}
                    onChange={(e) => setFormData({...formData, hoursWorked: parseFloat(e.target.value)})}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="comments">Comments</Label>
                <Textarea
                  id="comments"
                  value={formData.comments}
                  onChange={(e) => setFormData({...formData, comments: e.target.value})}
                  placeholder="Additional comments about the work performed"
                  rows={4}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" variant="gradient">Submit Log</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Recent Work Logs</h2>
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading work logs...</p>
          </div>
        ) : workLogs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No work logs found. Add your first work log!</p>
          </div>
        ) : (
          workLogs.map((log) => (
            <Card key={log.id} className="bg-glass border-glass backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold text-foreground">{log.taskSummary}</h3>
                    </div>
                    <p className="text-muted-foreground">{log.comments}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {log.workDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {log.hoursWorked} hours
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">{log.hoursWorked}h</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};