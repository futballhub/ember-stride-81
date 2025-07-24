import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, Clock, FileText, TrendingUp, AlertTriangle, Plus, UserCog, CalendarCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export const AdminDashboard = () => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    role: 'EMPLOYEE'
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:8080/api/admin/employees', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      }
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  const updateEmployee = async (id: number, data: any) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8080/api/admin/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Employee Updated",
          description: "Employee profile has been updated successfully.",
        });
        fetchEmployees();
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update employee profile.",
        variant: "destructive",
      });
    }
  };

  const deleteEmployee = async (id: number) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8080/api/admin/employees/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Employee Deleted",
          description: "Employee has been deleted successfully.",
        });
        fetchEmployees();
      }
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete employee.",
        variant: "destructive",
      });
    }
  };

  const handleRegisterEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:8080/api/auth/register-employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to register employee');
      }

      toast({
        title: "Employee Registered",
        description: "Employee has been registered successfully. They will receive login credentials via email.",
      });

      setFormData({ email: '', username: '', role: 'EMPLOYEE' });
      setIsRegisterOpen(false);
      fetchEmployees();
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Failed to register employee. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalEmployees: 0,
      activeEmployees: 0,
      pendingLeaves: 0,
      totalWorkLogs: 0
    },
    recentActivities: [
      { id: 1, type: 'leave', message: 'John Smith applied for annual leave', time: '2 hours ago' },
      { id: 2, type: 'worklog', message: 'Sarah Johnson submitted work log', time: '3 hours ago' },
      { id: 3, type: 'employee', message: 'New employee Mike Davis onboarded', time: '1 day ago' },
      { id: 4, type: 'leave', message: 'Emma Wilson\'s leave request approved', time: '2 days ago' },
    ],
    topPerformers: []
  });

  const [allWorkLogs, setAllWorkLogs] = useState([]);

  const fetchWorkLogs = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:8080/api/admin/worklogs', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setAllWorkLogs(data);
        
        // Update dashboard stats
        setDashboardData(prev => ({
          ...prev,
          stats: {
            ...prev.stats,
            totalWorkLogs: data.length
          }
        }));
      }
    } catch (error) {
      console.error('Failed to fetch work logs:', error);
    }
  };

  const fetchLeaveRequests = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:8080/api/admin/leaves', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        const pendingLeaves = data.filter((leave: any) => leave.status === 'PENDING').length;
        
        // Update dashboard stats
        setDashboardData(prev => ({
          ...prev,
          stats: {
            ...prev.stats,
            pendingLeaves: pendingLeaves
          }
        }));
      }
    } catch (error) {
      console.error('Failed to fetch leave requests:', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchWorkLogs();
    fetchLeaveRequests();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of employee management system</p>
        </div>
        <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient" className="gap-2">
              <Plus className="h-4 w-4" />
              Register Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-glass border-glass backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle className="text-foreground">Register New Employee</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleRegisterEmployee} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="employee@company.com"
                  required
                  className="bg-secondary/50 border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="johndoe"
                  required
                  className="bg-secondary/50 border-border"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsRegisterOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="gradient"
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? 'Registering...' : 'Register'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Key Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-glass border-glass backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Employees</p>
                <p className="text-2xl font-bold text-foreground">{dashboardData.stats.totalEmployees}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-glass border-glass backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Today</p>
                <p className="text-2xl font-bold text-foreground">{dashboardData.stats.activeEmployees}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-glass border-glass backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Leaves</p>
                <p className="text-2xl font-bold text-foreground">{dashboardData.stats.pendingLeaves}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-glass border-glass backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Work Logs</p>
                <p className="text-2xl font-bold text-foreground">{dashboardData.stats.totalWorkLogs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-3">
        <Link to="/admin/employees">
          <Card className="bg-glass border-glass backdrop-blur-xl hover:bg-glass/80 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <UserCog className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Employee Management</h3>
                  <p className="text-sm text-muted-foreground">Manage employee records and information</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/leaves">
          <Card className="bg-glass border-glass backdrop-blur-xl hover:bg-glass/80 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                  <CalendarCheck className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Leave Management</h3>
                  <p className="text-sm text-muted-foreground">Review and approve leave requests</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/worklogs">
          <Card className="bg-glass border-glass backdrop-blur-xl hover:bg-glass/80 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Worklog Management</h3>
                  <p className="text-sm text-muted-foreground">Monitor employee work logs and productivity</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activities */}
        <Card className="bg-glass border-glass backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <FileText className="h-5 w-5 text-primary" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData.recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 bg-secondary/20 rounded-lg">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mt-0.5">
                  {activity.type === 'leave' && <Calendar className="h-4 w-4 text-primary" />}
                  {activity.type === 'worklog' && <Clock className="h-4 w-4 text-primary" />}
                  {activity.type === 'employee' && <Users className="h-4 w-4 text-primary" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

         {/* Work Logs Overview */}
        <Card className="bg-glass border-glass backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Clock className="h-5 w-5 text-accent" />
              Recent Work Logs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {allWorkLogs.slice(0, 5).map((log: any) => (
              <div key={log.id} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{log.employee?.fullName || 'Unknown Employee'}</p>
                  <p className="text-sm text-muted-foreground">{log.taskSummary}</p>
                  <p className="text-xs text-muted-foreground">{log.workDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-accent">{log.hoursWorked}h</p>
                  <p className="text-xs text-muted-foreground">Hours</p>
                </div>
              </div>
            ))}
            {allWorkLogs.length === 0 && (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No work logs submitted yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-glass border-glass backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Attention Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-yellow-500" />
                <span className="font-medium text-foreground">Pending Approvals</span>
              </div>
              <p className="text-2xl font-bold text-yellow-500">{dashboardData.stats.pendingLeaves}</p>
              <p className="text-xs text-muted-foreground">Leave requests awaiting approval</p>
            </div>

            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-red-500" />
                <span className="font-medium text-foreground">Inactive Employees</span>
              </div>
              <p className="text-2xl font-bold text-red-500">3</p>
              <p className="text-xs text-muted-foreground">Employees not logged in today</p>
            </div>

            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="font-medium text-foreground">Missing Reports</span>
              </div>
              <p className="text-2xl font-bold text-blue-500">5</p>
              <p className="text-xs text-muted-foreground">Employees haven't submitted work logs</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};