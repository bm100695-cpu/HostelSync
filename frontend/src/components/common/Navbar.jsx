import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Bell, 
  Sparkles, 
  LogOut, 
  Menu,
  AlertTriangle,
  Shield
} from 'lucide-react';

export const Navbar = ({ toggleSidebar, openAIChat }) => {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-2.5 sm:px-6 flex items-center justify-between w-full max-w-full">
      
      {/* Left section: Hamburger & Logo */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <button
          onClick={toggleSidebar}
          className="p-1.5 sm:p-2 text-slate-600 hover:bg-slate-100 rounded-xl lg:hidden transition"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <img
            src="/logo-transparent.png"
            alt="HostelSync Logo"
            className="w-8 h-8 sm:w-9 sm:h-9 object-contain shrink-0"
          />
          <span className="font-extrabold text-lg sm:text-xl tracking-tight hidden sm:inline-block text-[#000000]">
            HostelSync
          </span>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-1 sm:gap-3 text-sm shrink-0">
        
        {/* AI Trigger Button */}
        <button
          onClick={openAIChat}
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3.5 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 rounded-xl font-semibold transition text-xs sm:text-sm shrink-0"
          title="Ask SyncBot AI"
        >
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF9900]" />
          <span className="hidden md:inline">Ask SyncBot AI</span>
          <span className="md:hidden font-bold">AI</span>
        </button>

        {/* Current Role Badge */}
        <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl font-semibold text-xs sm:text-sm shrink-0">
          <Shield className="w-3.5 h-3.5 text-[#FF9900]" />
          <span className="capitalize max-w-[50px] sm:max-w-none truncate">
            {user?.role === 'staff' ? 'Security' : user?.role || 'User'}
          </span>
        </div>

        {/* Notifications */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 sm:p-2 text-slate-600 hover:bg-slate-100 rounded-xl relative transition"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute top-1 sm:top-1.5 right-1 sm:right-1.5 w-2 h-2 bg-emerald-500 rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 animate-in fade-in duration-150">
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
        <div className="flex items-center gap-1 sm:gap-2.5 pl-1.5 sm:pl-3 border-l border-slate-200 shrink-0">
          <img
            src={user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=00897B&color=ffffff`}
            alt="Profile"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-200 object-cover shadow-xs shrink-0" 
          />
          <div className="hidden xl:block">
            <p className="font-bold text-slate-900 leading-none text-xs">{user?.name || 'User'}</p>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{user?.room || 'Campus'}</p>
          </div>
          <button
            onClick={logout}
            className="p-1 sm:p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition shrink-0"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};