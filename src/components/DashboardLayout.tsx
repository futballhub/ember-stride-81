import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  User, 
  Calendar, 
  Clock, 
  BarChart3, 
  Users, 
  FileText, 
  Settings,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';

const employeeNavItems = [
  { title: 'Profile', icon: User, path: '/employee/profile' },
  { title: 'Leave Requests', icon: Calendar, path: '/employee/leave' },
  { title: 'Work Logs', icon: Clock, path: '/employee/worklogs' },
  { title: 'Performance', icon: BarChart3, path: '/employee/performance' },
];

const adminNavItems = [
  { title: 'Dashboard', icon: BarChart3, path: '/admin' },
  { title: 'Employees', icon: Users, path: '/admin/employees' },
  { title: 'Leave Requests', icon: Calendar, path: '/admin/leave' },
  { title: 'Work Logs', icon: Clock, path: '/admin/worklogs' },
  { title: 'Reports', icon: FileText, path: '/admin/reports' },
];

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = user?.role === 'ADMIN' ? adminNavItems : employeeNavItems;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-background">
        <Sidebar className="bg-glass border-glass backdrop-blur-xl">
          <SidebarHeader className="p-6 border-b border-glass">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">EMS</h2>
                <p className="text-xs text-muted-foreground">
                  {user?.role === 'ADMIN' ? 'Admin Panel' : 'Employee Portal'}
                </p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="flex-1 p-4">
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    className="w-full justify-start gap-3 p-3 rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-200"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <div className="p-4 border-t border-glass">
            <div className="mb-4 p-3 bg-secondary/30 rounded-lg">
              <p className="text-sm font-medium text-foreground">{user?.username}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="h-16 bg-glass/30 border-b border-glass backdrop-blur-xl flex items-center justify-between px-6">
            <SidebarTrigger />
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{user?.username}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user?.role?.toLowerCase()}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {user?.username?.[0]?.toUpperCase()}
                </span>
              </div>
            </div>
          </header>

          <div className="flex-1 p-6 overflow-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};