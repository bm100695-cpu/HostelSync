import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Bell, 
  Sparkles, 
  LogOut, 
  User, 
  Shield, 
  KeyRound, 
  Menu,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  QrCode
} from 'lucide-react';

export const Navbar = ({ toggleSidebar, openAIChat }) => {
  const { user, logout, quickLogin } = useAuth();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const roleColors = {
    student: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warden: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    admin: 'bg-purple-50 text-purple-700 border-purple-200',
    staff: 'bg-amber-50 text-amber-700 border-amber-200',
  };

  const handleRoleSwitch = async (role) => {
    setShowRoleDropdown(false);
    await quickLogin(role);
  };

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between shadow-sm">
      {/* Left section: Hamburger & Breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-500 flex items-center justify-center shadow-md shadow-brand-500/20">
            <span className="font-bold text-white text-base tracking-wider">HS</span>
          </div>
          <div className="hidden sm:block">
            <span className="font-extrabold text-lg tracking-tight text-slate-900">
              HOSTEL<span className="text-brand-600">SYNC</span>
            </span>
            <span className="text-[10px] text-slate-400 block tracking-widest uppercase font-semibold">
              Smart Campus Living
            </span>
          </div>
        </div>
      </div>

      {/* Right section: AI Button, Role Switcher, Notifications, User */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Gemini AI Trigger Button */}
        <button
          onClick={openAIChat}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-50 via-purple-50 to-emerald-50 hover:from-indigo-100 hover:to-emerald-100 text-brand-700 text-xs font-semibold border border-brand-200 transition shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-600 animate-pulse" />
          <span className="hidden md:inline">Ask SyncBot AI</span>
          <span className="md:hidden">AI</span>
        </button>

        {/* Demo Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${roleColors[user?.role] || roleColors.student}`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="capitalize">{user?.role === 'staff' ? 'Security / Staff' : user?.role}</span>
            <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-56 glass-dropdown rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Switch Demo Persona
              </div>
              {[
                { role: 'student', label: 'Student Portal (Aarav)', desc: 'Passes, Leave, Mess, AI Complaints' },
                { role: 'warden', label: 'Warden Portal (Dr. Ramesh)', desc: 'Approvals, Roll-Call, Reports' },
                { role: 'admin', label: 'Admin Portal (Dean)', desc: 'Rooms, Users, Analytics, Mess' },
                { role: 'staff', label: 'Security & Staff (Vikram)', desc: 'Live QR Scanner, Gate In/Out' },
              ].map((item) => (
                <button
                  key={item.role}
                  onClick={() => handleRoleSwitch(item.role)}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex flex-col transition ${user?.role === item.role ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-700'}`}
                >
                  <span className="font-medium flex items-center justify-between">
                    {item.label}
                    {user?.role === item.role && <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />}
                  </span>
                  <span className="text-[10px] text-slate-400">{item.desc}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 glass-dropdown rounded-2xl shadow-xl p-3.5 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">Live Hostel Broadcasts</span>
                <span className="text-[10px] text-brand-600 font-semibold">WhatsApp Synced</span>
              </div>
              <div className="mt-2 space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <p className="font-semibold text-slate-800">Gate Pass #GP-2026-901 Approved</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Parent WhatsApp SMS delivered successfully.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80">
                  <p className="font-semibold text-amber-800 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Scheduled Water Maintenance
                  </p>
                  <p className="text-[11px] text-amber-700/80 mt-0.5">Block A & B water supply sanitized 10 AM - 1 PM.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Logout */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
            alt={user?.name}
            className="w-8 h-8 rounded-full ring-2 ring-brand-500/30 object-cover"
          />
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold text-slate-800 truncate max-w-[120px]">{user?.name}</p>
            <p className="text-[10px] text-slate-400">{user?.room || user?.block || 'Campus'}</p>
          </div>
          <button
            onClick={logout}
            title="Logout"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
