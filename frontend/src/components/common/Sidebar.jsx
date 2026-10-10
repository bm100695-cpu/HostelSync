import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  QrCode,
  CalendarCheck,
  AlertCircle,
  UtensilsCrossed,
  Bed,
  Bell,
  User,
  Users,
  FileCheck2,
  ClipboardList,
  BarChart3,
  MessageSquareShare,
  ScanLine,
  Activity,
  Wrench,
  Building2,
  Sliders
} from 'lucide-react';

export const Sidebar = ({ isOpen, closeSidebar }) => {
  const { user } = useAuth();
  const role = user?.role || 'student';

  const menuConfig = {
    student: [
      { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/student/gate-pass', icon: QrCode, label: 'Gate Pass' },
      { to: '/student/leave', icon: CalendarCheck, label: 'Leave Apply' },
      { to: '/student/complaints', icon: AlertCircle, label: 'AI Complaints' },
      { to: '/student/mess', icon: UtensilsCrossed, label: 'Mess & Food' },
      { to: '/student/room', icon: Bed, label: 'My Room & Roommates' },
      { to: '/student/notices', icon: Bell, label: 'Notices' },
      { to: '/student/profile', icon: User, label: 'Profile & ID Card' },
    ],
    warden: [
      { to: '/warden/dashboard', icon: LayoutDashboard, label: 'Warden Dashboard' },
      { to: '/warden/students', icon: Users, label: 'Student Directory' },
      { to: '/warden/passes', icon: FileCheck2, label: 'Pass Approvals' },
      { to: '/warden/leaves', icon: CalendarCheck, label: 'Leave Requests' },
      { to: '/warden/complaints', icon: AlertCircle, label: 'Complaints & SLA' },
      { to: '/warden/attendance', icon: ClipboardList, label: 'Night Roll Call' },
      { to: '/warden/notices', icon: MessageSquareShare, label: 'Notices' },
      { to: '/warden/reports', icon: BarChart3, label: 'Reports & Export' },
    ],
    admin: [
      { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/admin/users', icon: Users, label: 'User Management' },
      { to: '/admin/hostels', icon: Building2, label: 'Hostel Blocks' },
      { to: '/admin/rooms', icon: Bed, label: 'Room Allocation' },
      { to: '/admin/mess', icon: UtensilsCrossed, label: 'Mess & Menus' },
      { to: '/admin/complaints', icon: AlertCircle, label: 'Complaints' },
      { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
      { to: '/admin/settings', icon: Sliders, label: 'Settings' },
    ],
    staff: [
      { to: '/staff/scanner', icon: ScanLine, label: 'QR Scanner' },
      { to: '/staff/logs', icon: Activity, label: 'Movement Logs' },
      { to: '/staff/work-orders', icon: Wrench, label: 'Maintenance' },
      { to: '/staff/notices', icon: Bell, label: 'Notices' },
    ],
  };

  const navItems = menuConfig[role] || menuConfig.student;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-white border-r border-gray-300 z-50 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-gray-300 bg-gray-50">
          <div className="w-8 h-8 bg-blue-600 flex items-center justify-center font-bold text-white rounded">
            HS
          </div>
          <span className="font-bold text-lg text-gray-900">HostelSync</span>
        </div>

        {/* Current User Snapshot */}
        <div className="p-3 mx-4 my-4 bg-gray-50 border border-gray-300 flex items-center gap-3">
          <img
            src={user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Student')}&background=E5E7EB&color=374151`}
            alt={user?.name || 'Profile'}
            onError={(e) => { 
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Student')}&background=E5E7EB&color=374151`; 
              e.target.onerror = null; 
            }}
            className="w-10 h-10 rounded border border-gray-300 object-cover bg-white" 
          />
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-gray-900 truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-600 capitalize">
              {user?.role === 'staff' ? 'Gate Security' : user?.role}
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-2 overflow-y-auto">
          <div className="px-4 pb-2 text-xs font-bold text-gray-500 uppercase tracking-wide">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gray-100 text-green-700 border-l-4 border-green-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};