import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Login } from "@/pages/Login";
import { EmployeeProfile } from "@/pages/employee/Profile";
import { EmployeeLeaveRequests } from "@/pages/employee/LeaveRequests";
import { EmployeeWorkLogs } from "@/pages/employee/WorkLogs";
import { EmployeePerformance } from "@/pages/employee/Performance";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { AdminEmployeeManagement } from "@/pages/admin/EmployeeManagement";
import { AdminLeaveManagement } from "@/pages/admin/LeaveManagement";
import { AdminWorklogManagement } from "@/pages/admin/WorklogManagement";
import { ProfileSetup } from "@/pages/employee/ProfileSetup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const DashboardRedirect = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  
  if (user.role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  } else {
    // Check if employee needs to setup profile
    if (user.role === 'EMPLOYEE' && !user.setProfileSetup) {
      return <Navigate to="/employee/profile-setup" replace />;
    }
    return <Navigate to="/employee/profile" replace />;
  }
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<DashboardRedirect />} />
            <Route path="/dashboard" element={<DashboardRedirect />} />
            
            {/* Profile Setup Route */}
            <Route path="/employee/profile-setup" element={
              <ProtectedRoute requiredRole="EMPLOYEE">
                <ProfileSetup />
              </ProtectedRoute>
            } />
            
            {/* Employee Routes */}
            <Route path="/employee" element={
              <ProtectedRoute requiredRole="EMPLOYEE">
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route path="profile" element={<EmployeeProfile />} />
              <Route path="leave" element={<EmployeeLeaveRequests />} />
              <Route path="worklogs" element={<EmployeeWorkLogs />} />
              <Route path="performance" element={<EmployeePerformance />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="ADMIN">
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="employees" element={<AdminEmployeeManagement />} />
              <Route path="leaves" element={<AdminLeaveManagement />} />
              <Route path="worklogs" element={<AdminWorklogManagement />} />
              <Route path="reports" element={<div>Reports Coming Soon</div>} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
