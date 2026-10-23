import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Bell, 
  Sparkles, 
  LogOut, 
  Menu,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Shield
} from 'lucide-react';

export const Navbar = ({ toggleSidebar, openAIChat }) => {
  const { user, logout, quickLogin } = useAuth();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleRoleSwitch = async (role) => {
    setShowRoleDropdown(false);
    await quickLogin(role);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
      
      {/* Left section: Hamburger & Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl lg:hidden transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#00897B] flex items-center justify-center text-white shadow-xs">
            <Shield className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="font-extrabold text-xl text-slate-900 tracking-tight hidden sm:inline-block">
            HostelSync
          </span>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2.5 sm:gap-3 text-sm">
        
        {/* AI Trigger Button */}
        <button
          onClick={openAIChat}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-teal-50 text-[#00897B] border border-teal-200 hover:bg-teal-100 rounded-xl font-semibold transition text-xs sm:text-sm"
        >
          <Sparkles className="w-4 h-4 text-[#00897B]" />
          <span className="hidden md:inline">Ask SyncBot AI</span>
          <span className="md:hidden">AI</span>
        </button>

        {/* Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl font-semibold hover:bg-slate-100 transition text-xs sm:text-sm"
          >
            <Shield className="w-4 h-4 text-[#00897B]" />
            <span className="capitalize">{user?.role === 'staff' ? 'Security' : user?.role}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-60 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in duration-150">
              <div className="px-3.5 py-2 text-[11px] font-bold text-slate-400 border-b border-slate-100 uppercase tracking-wider">
                Switch Demo Persona
              </div>
              {[
                { role: 'student', label: 'Student (Aarav)' },
                { role: 'warden', label: 'Warden (Dr. Ramesh)' },
                { role: 'admin', label: 'Admin (Dean)' },
                { role: 'staff', label: 'Security (Vikram)' },
              ].map((item) => (
                <button
                  key={item.role}
                  onClick={() => handleRoleSwitch(item.role)}
                  className={`w-full text-left px-3.5 py-2 flex items-center justify-between text-xs sm:text-sm hover:bg-slate-50 transition ${
                    user?.role === item.role ? 'bg-teal-50 font-bold text-[#00897B]' : 'text-slate-700'
                  }`}
                >
                  <span>{item.label}</span>
                  {user?.role === item.role && <CheckCircle2 className="w-4 h-4 text-[#00897B]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl relative transition"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 animate-in fade-in duration-150">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2.5 mb-3">
                <span className="font-bold text-slate-900 text-sm">Notifications</span>
                <span className="text-[11px] font-semibold text-[#00897B] bg-teal-50 px-2 py-0.5 rounded-full">WhatsApp Synced</span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <p className="font-bold text-slate-900">Gate Pass #GP-901 Approved</p>
                  <p className="text-slate-500 mt-0.5">Parent WhatsApp SMS delivered.</p>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200/60 rounded-xl">
                  <p className="font-bold text-amber-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Water Maintenance
                  </p>
                  <p className="text-amber-700 mt-0.5">Block A & B (10 AM - 1 PM).</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Info */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <img
            src={user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=00897B&color=ffffff`}
            alt="Profile"
            className="w-8 h-8 rounded-full border border-slate-200 object-cover shadow-xs" 
          />
          <div className="hidden xl:block">
            <p className="font-bold text-slate-900 leading-none text-xs">{user?.name || 'User'}</p>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{user?.room || 'Campus'}</p>
          </div>
          <button
            onClick={logout}
            className="p-1.5 ml-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};