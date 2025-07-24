import React, { useState, useEffect } from 'react';
import { User, Mail, Building, Calendar, Badge, Edit2, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const EmployeeProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    fullName: '',
    phone: '',
    department: '',
    position: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:8080/api/profile/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setEditData({
          fullName: data.fullName || '',
          phone: data.phone || '',
          department: data.department || '',
          position: data.position || ''
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const updateProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:8080/api/profile/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
        setIsEditing(false);
        fetchProfile();
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
          <span className="text-white text-xl font-bold">
            {user?.username?.[0]?.toUpperCase()}
          </span>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground">View your account information</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-glass border-glass backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-foreground">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
                className="gap-2"
              >
                {isEditing ? (
                  <>
                    <X className="h-4 w-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </>
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Username</label>
              <p className="text-foreground font-medium">{user?.username}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-foreground font-medium">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Employee ID</label>
              <p className="text-foreground font-medium">{user?.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              {isEditing ? (
                <Input
                  value={editData.fullName}
                  onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                  className="bg-secondary/50 border-border"
                />
              ) : (
                <p className="text-foreground font-medium">{profile?.fullName || 'Not set'}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Phone</label>
              {isEditing ? (
                <Input
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  className="bg-secondary/50 border-border"
                />
              ) : (
                <p className="text-foreground font-medium">{profile?.phone || 'Not set'}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Department</label>
              {isEditing ? (
                <Input
                  value={editData.department}
                  onChange={(e) => setEditData({ ...editData, department: e.target.value })}
                  className="bg-secondary/50 border-border"
                />
              ) : (
                <p className="text-foreground font-medium">{profile?.department || 'Not set'}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Position</label>
              {isEditing ? (
                <Input
                  value={editData.position}
                  onChange={(e) => setEditData({ ...editData, position: e.target.value })}
                  className="bg-secondary/50 border-border"
                />
              ) : (
                <p className="text-foreground font-medium">{profile?.position || 'Not set'}</p>
              )}
            </div>
            {isEditing && (
              <Button
                onClick={updateProfile}
                variant="gradient"
                className="w-full gap-2"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="bg-glass border-glass backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Mail className="h-5 w-5 text-primary" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email Address</label>
              <p className="text-foreground font-medium">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Role</label>
              <div className="flex items-center gap-2">
                <Badge className="h-4 w-4 text-primary" />
                <span className="text-foreground font-medium capitalize">
                  {user?.role?.toLowerCase()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-glass border-glass backdrop-blur-xl md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Building className="h-5 w-5 text-primary" />
              Account Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-foreground font-medium">Active Account</span>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Last Login</p>
                <p className="text-foreground font-medium">Today, 9:30 AM</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};