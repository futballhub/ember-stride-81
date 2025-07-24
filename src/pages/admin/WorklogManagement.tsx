import React, { useState, useEffect } from 'react';
import { FileText, Clock, Calendar, User, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface WorkLog {
  id: number;
  employee: {
    id: number;
    fullName: string;
    department: string;
    position: string;
  };
  workDate: string;
  taskSummary: string;
  hoursWorked: number;
  comments: string;
  submittedAt: string;
}

export const AdminWorklogManagement = () => {
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<WorkLog[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    employeeName: '',
    department: '',
    startDate: '',
    endDate: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchWorkLogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [workLogs, filters]);

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
        setWorkLogs(data);
      }
    } catch (error) {
      console.error('Failed to fetch work logs:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...workLogs];

    if (filters.employeeName) {
      filtered = filtered.filter(log => 
        log.employee.fullName.toLowerCase().includes(filters.employeeName.toLowerCase())
      );
    }

    if (filters.department) {
      filtered = filtered.filter(log => 
        log.employee.department.toLowerCase().includes(filters.department.toLowerCase())
      );
    }

    if (filters.startDate) {
      filtered = filtered.filter(log => 
        new Date(log.workDate) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(log => 
        new Date(log.workDate) <= new Date(filters.endDate)
      );
    }

    setFilteredLogs(filtered);
  };

  const clearFilters = () => {
    setFilters({
      employeeName: '',
      department: '',
      startDate: '',
      endDate: ''
    });
  };

  const totalHours = filteredLogs.reduce((sum, log) => sum + log.hoursWorked, 0);
  const averageHours = filteredLogs.length > 0 ? (totalHours / filteredLogs.length).toFixed(1) : 0;
  
  const departments = [...new Set(workLogs.map(log => log.employee.department))];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Worklog Management</h1>
          <p className="text-muted-foreground">Monitor and analyze employee work logs</p>
        </div>
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="outline"
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-glass border-glass backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Logs</p>
                <p className="text-2xl font-bold text-foreground">{filteredLogs.length}</p>
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
                <p className="text-sm text-muted-foreground">Total Hours</p>
                <p className="text-2xl font-bold text-foreground">{totalHours}h</p>
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
                <p className="text-sm text-muted-foreground">Avg. Hours</p>
                <p className="text-2xl font-bold text-foreground">{averageHours}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-glass border-glass backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <User className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Employees</p>
                <p className="text-2xl font-bold text-foreground">
                  {new Set(filteredLogs.map(log => log.employee.id)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="bg-glass border-glass backdrop-blur-xl animate-scale-in">
          <CardHeader>
            <CardTitle className="text-foreground">Filter Work Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="employeeName">Employee Name</Label>
                <Input
                  id="employeeName"
                  placeholder="Search by name"
                  value={filters.employeeName}
                  onChange={(e) => setFilters({...filters, employeeName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={filters.department}
                  onValueChange={(value) => setFilters({...filters, department: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Work Logs */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">
          Work Logs {filteredLogs.length !== workLogs.length && `(${filteredLogs.length} of ${workLogs.length})`}
        </h2>
        {filteredLogs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No work logs found matching your criteria.</p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <Card key={log.id} className="bg-glass border-glass backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold text-foreground">{log.employee.fullName}</h3>
                      <span className="text-sm text-muted-foreground">
                        {log.employee.department} - {log.employee.position}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-accent" />
                      <h4 className="font-medium text-foreground">{log.taskSummary}</h4>
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
                      <span>Submitted: {new Date(log.submittedAt).toLocaleDateString()}</span>
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