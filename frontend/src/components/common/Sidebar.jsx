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
  Sliders,
  Shield
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
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-white border-r border-slate-200 z-50 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-slate-200 bg-white">
          <img
            src="/logo-transparent.png"
            alt="HostelSync Logo"
            className="w-8 h-8 object-contain shrink-0"
          />
          <span className="font-extrabold text-lg tracking-tight text-[#000000]">
            HostelSync
          </span>
        </div>

        {/* Current User Snapshot Card */}
        <div className="p-3 mx-4 my-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3">
          <img
            src={user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Student')}&background=00897B&color=ffffff`}
            alt={user?.name || 'Profile'}
            onError={(e) => { 
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Student')}&background=00897B&color=ffffff`; 
              e.target.onerror = null; 
            }}
            className="w-10 h-10 rounded-xl border border-slate-200 object-cover bg-white shadow-xs" 
          />
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-900 truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-500 capitalize font-medium">
              {user?.role === 'staff' ? 'Gate Security' : user?.role}
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
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
                  `flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                    isActive
                      ? 'bg-teal-50 text-[#00897B] shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
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