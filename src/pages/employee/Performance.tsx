import React from 'react';
import { BarChart3, TrendingUp, Calendar, Clock, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export const EmployeePerformance = () => {
  const performanceData = {
    monthlyHours: [
      { month: 'Jan', hours: 168 },
      { month: 'Feb', hours: 152 },
      { month: 'Mar', hours: 176 },
      { month: 'Apr', hours: 164 },
      { month: 'May', hours: 180 },
      { month: 'Jun', hours: 172 },
      { month: 'Jul', hours: 156 }
    ],
    metrics: {
      totalHours: 1268,
      avgDailyHours: 7.8,
      attendanceRate: 95,
      tasksCompleted: 47,
      leavesTaken: 8
    }
  };

  const maxHours = Math.max(...performanceData.monthlyHours.map(m => m.hours));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Performance Dashboard</h1>
        <p className="text-muted-foreground">Track your work performance and attendance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-glass border-glass backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Hours</p>
                <p className="text-2xl font-bold text-foreground">{performanceData.metrics.totalHours}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-glass border-glass backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Daily</p>
                <p className="text-2xl font-bold text-foreground">{performanceData.metrics.avgDailyHours}h</p>
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
                <p className="text-sm text-muted-foreground">Attendance</p>
                <p className="text-2xl font-bold text-foreground">{performanceData.metrics.attendanceRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-glass border-glass backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tasks Done</p>
                <p className="text-2xl font-bold text-foreground">{performanceData.metrics.tasksCompleted}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Hours Chart */}
      <Card className="bg-glass border-glass backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <BarChart3 className="h-5 w-5 text-primary" />
            Monthly Work Hours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performanceData.monthlyHours.map((month) => (
              <div key={month.month} className="flex items-center gap-4">
                <div className="w-12 text-sm font-medium text-muted-foreground">
                  {month.month}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-foreground">{month.hours}h</span>
                    <span className="text-xs text-muted-foreground">
                      {Math.round((month.hours / maxHours) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(month.hours / maxHours) * 100} 
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-glass border-glass backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Calendar className="h-5 w-5 text-primary" />
              Attendance Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Present Days</span>
              <span className="font-semibold text-foreground">22 / 23</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Leave Days</span>
              <span className="font-semibold text-foreground">{performanceData.metrics.leavesTaken}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Attendance Rate</span>
              <span className="font-semibold text-green-500">{performanceData.metrics.attendanceRate}%</span>
            </div>
            <Progress value={performanceData.metrics.attendanceRate} className="h-2" />
          </CardContent>
        </Card>

        <Card className="bg-glass border-glass backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Award className="h-5 w-5 text-primary" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
              <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <Award className="h-4 w-4 text-yellow-500" />
              </div>
              <div>
                <p className="font-medium text-foreground">Perfect Attendance</p>
                <p className="text-xs text-muted-foreground">Last month</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">High Performer</p>
                <p className="text-xs text-muted-foreground">Q2 2024</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};