import React from 'react';
import { StudentRegistration } from "./pages/auth/StudentRegistration";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Login } from './pages/auth/Login';

// Student Pages
import { StudentDashboard } from './pages/student/Dashboard';
import { StudentGatePass } from './pages/student/GatePass';
import { StudentLeave } from './pages/student/Leave';
import { StudentComplaints } from './pages/student/Complaints';
import { StudentMess } from './pages/student/Mess';
import { StudentRoom } from './pages/student/Room';
import { StudentNotices } from './pages/student/Notices';
import { StudentProfile } from './pages/student/Profile';

// Warden Pages
import { WardenDashboard } from './pages/warden/Dashboard';
import { WardenStudentList } from './pages/warden/StudentList';
import { WardenGatePasses } from './pages/warden/GatePasses';
import { WardenLeaveRequests } from './pages/warden/LeaveRequests';
import { WardenComplaints } from './pages/warden/Complaints';
import { WardenAttendance } from './pages/warden/Attendance';
import { WardenNotices } from './pages/warden/Notices';
import { WardenReports } from './pages/warden/Reports';

// Admin Pages
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminUserManagement } from './pages/admin/UserManagement';
import { AdminHostels } from './pages/admin/Hostels';
import { AdminRoomAllocation } from './pages/admin/RoomAllocation';
import { AdminMessManagement } from './pages/admin/MessManagement';
import { AdminComplaints } from './pages/admin/Complaints';
import { AdminAnalytics } from './pages/admin/Analytics';
import { AdminSettings } from './pages/admin/Settings';

// Staff & Security Pages
import { SecurityScanner } from './pages/staff/SecurityScanner';
import { SecurityMovementLogs } from './pages/staff/MovementLogs';
import { StaffWorkOrders } from './pages/staff/WorkOrders';

const RoleBasedRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'student') return <Navigate to="/student/dashboard" replace />;
  if (user.role === 'warden') return <Navigate to="/warden/dashboard" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'staff') return <Navigate to="/staff/scanner" replace />;
  return <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Authentication Route */}
          <Route path="/login" element={<Login />} />
           {/* Student Registration */}
            <Route
            path="/student-registration"
            element={<StudentRegistration />}
         />
          {/* Root Redirect based on logged in role */}
          <Route path="/" element={<RoleBasedRedirect />} />

          {/* Authenticated Dashboard Shell Layout */}
          <Route element={<DashboardLayout />}>
            {/* Student Routes */}
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/gate-pass" element={<StudentGatePass />} />
            <Route path="/student/leave" element={<StudentLeave />} />
            <Route path="/student/complaints" element={<StudentComplaints />} />
            <Route path="/student/mess" element={<StudentMess />} />
            <Route path="/student/room" element={<StudentRoom />} />
            <Route path="/student/notices" element={<StudentNotices />} />
            <Route path="/student/profile" element={<StudentProfile />} />

            {/* Warden Routes */}
            <Route path="/warden/dashboard" element={<WardenDashboard />} />
            <Route path="/warden/students" element={<WardenStudentList />} />
            <Route path="/warden/passes" element={<WardenGatePasses />} />
            <Route path="/warden/leaves" element={<WardenLeaveRequests />} />
            <Route path="/warden/complaints" element={<WardenComplaints />} />
            <Route path="/warden/attendance" element={<WardenAttendance />} />
            <Route path="/warden/notices" element={<WardenNotices />} />
            <Route path="/warden/reports" element={<WardenReports />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUserManagement />} />
            <Route path="/admin/hostels" element={<AdminHostels />} />
            <Route path="/admin/rooms" element={<AdminRoomAllocation />} />
            <Route path="/admin/mess" element={<AdminMessManagement />} />
            <Route path="/admin/complaints" element={<AdminComplaints />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/settings" element={<AdminSettings />} />

            {/* Staff / Security Routes */}
            <Route path="/staff/scanner" element={<SecurityScanner />} />
            <Route path="/staff/logs" element={<SecurityMovementLogs />} />
            <Route path="/staff/work-orders" element={<StaffWorkOrders />} />
            <Route path="/staff/notices" element={<StudentNotices />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
