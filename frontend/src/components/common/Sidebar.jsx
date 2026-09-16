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
  Sparkles,
  ShieldCheck
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
      { to: '/warden/notices', icon: MessageSquareShare, label: 'Notices & WhatsApp' },
      { to: '/warden/reports', icon: BarChart3, label: 'Reports & Export' },
    ],
    admin: [
      { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Executive BI' },
      { to: '/admin/users', icon: Users, label: 'User Management' },
      { to: '/admin/hostels', icon: Building2, label: 'Hostel Blocks' },
      { to: '/admin/rooms', icon: Bed, label: 'Room Allocation' },
      { to: '/admin/mess', icon: UtensilsCrossed, label: 'Mess & Menus' },
      { to: '/admin/complaints', icon: AlertCircle, label: 'Master Complaints' },
      { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
      { to: '/admin/settings', icon: Sliders, label: 'Settings & WhatsApp' },
    ],
    staff: [
      { to: '/staff/scanner', icon: ScanLine, label: 'QR Gate Scanner' },
      { to: '/staff/logs', icon: Activity, label: 'Movement Logs' },
      { to: '/staff/work-orders', icon: Wrench, label: 'Maintenance Tasks' },
      { to: '/staff/notices', icon: Bell, label: 'Campus Bulletins' },
    ],
  };

  const navItems = menuConfig[role] || menuConfig.student;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-white border-r border-slate-200 z-50 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-emerald-500 flex items-center justify-center font-bold text-white shadow-md shadow-brand-500/20">
              HS
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">HostelSync</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200 font-bold uppercase tracking-widest">
            v2.0
          </span>
        </div>

        {/* Current User Snapshot */}
        <div className="p-3.5 mx-3 my-3 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
              alt={user?.name}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-200"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></span>
                <span className="text-[10px] text-slate-500 capitalize font-medium">
                  {user?.role === 'staff' ? 'Gate Security' : user?.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Main Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition duration-150 ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 border-l-4 border-brand-600 font-bold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Security / System Footer Pill */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="truncate">
              <p className="text-slate-900 font-semibold text-[11px]">System Status: Online</p>
              <p className="text-[10px] text-slate-500">Gemini & WhatsApp Ready</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
