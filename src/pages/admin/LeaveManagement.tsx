import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, XCircle, Clock, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface LeaveRequest {
  id: number;
  employee: {
    id: number;
    fullName: string;
    department: string;
    position: string;
  };
  startDate: string;
  endDate: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
}

export const AdminLeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

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
        setLeaveRequests(data);
      }
    } catch (error) {
      console.error('Failed to fetch leave requests:', error);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8080/api/admin/leaves/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Leave Request Approved",
          description: "The leave request has been approved successfully.",
        });
        fetchLeaveRequests();
      }
    } catch (error) {
      toast({
        title: "Approval Failed",
        description: "Failed to approve leave request.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: number) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8080/api/admin/leaves/${id}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Leave Request Rejected",
          description: "The leave request has been rejected.",
        });
        fetchLeaveRequests();
      }
    } catch (error) {
      toast({
        title: "Rejection Failed",
        description: "Failed to reject leave request.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      APPROVED: 'bg-green-500/20 text-green-500 border-green-500/30',
      REJECTED: 'bg-red-500/20 text-red-500 border-red-500/30',
      PENDING: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
    };
    
    return variants[status as keyof typeof variants] || variants.PENDING;
  };

  const pendingRequests = leaveRequests.filter(req => req.status === 'PENDING');
  const processedRequests = leaveRequests.filter(req => req.status !== 'PENDING');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Leave Management</h1>
          <p className="text-muted-foreground">Review and manage employee leave requests</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-glass border-glass backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Requests</p>
                <p className="text-2xl font-bold text-foreground">{pendingRequests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-glass border-glass backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-foreground">
                  {leaveRequests.filter(req => req.status === 'APPROVED').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-glass border-glass backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold text-foreground">
                  {leaveRequests.filter(req => req.status === 'REJECTED').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Pending Approvals</h2>
          {pendingRequests.map((request) => (
            <Card key={request.id} className="bg-glass border-glass backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold text-foreground">{request.employee.fullName}</h3>
                      <Badge className={`border ${getStatusBadge(request.status)}`}>
                        {getStatusIcon(request.status)}
                        <span className="ml-1">{request.status}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{request.employee.department} - {request.employee.position}</p>
                    <p className="text-muted-foreground">{request.reason}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>From: {request.startDate}</span>
                      <span>To: {request.endDate}</span>
                      <span>Applied: {new Date(request.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleReject(request.id)}
                      className="gap-2 text-red-500 hover:text-red-600"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      variant="gradient"
                      onClick={() => handleApprove(request.id)}
                      className="gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* All Requests */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">All Leave Requests</h2>
        {leaveRequests.map((request) => (
          <Card key={request.id} className="bg-glass border-glass backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">{request.employee.fullName}</h3>
                    <Badge className={`border ${getStatusBadge(request.status)}`}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1">{request.status}</span>
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{request.employee.department} - {request.employee.position}</p>
                  <p className="text-muted-foreground">{request.reason}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>From: {request.startDate}</span>
                    <span>To: {request.endDate}</span>
                    <span>Applied: {new Date(request.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                {request.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleReject(request.id)}
                      className="gap-2 text-red-500 hover:text-red-600"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      variant="gradient"
                      onClick={() => handleApprove(request.id)}
                      className="gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};