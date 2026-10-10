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
    <header className="h-16 bg-white border-b border-gray-300 sticky top-0 z-30 px-4 flex items-center justify-between">
      
      {/* Left section: Hamburger & Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 flex items-center justify-center text-white font-bold rounded">
            HS
          </div>
          <div className="hidden sm:block">
            <h1 className="font-bold text-xl text-gray-800 m-0">
              HostelSync
            </h1>
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3 sm:gap-4 text-sm">
        
        {/* AI Trigger Button */}
        <button
          onClick={openAIChat}
          className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 rounded font-medium"
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden md:inline">Ask SyncBot AI</span>
          <span className="md:hidden">AI</span>
        </button>

        {/* Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 border border-gray-300 text-gray-800 rounded font-medium hover:bg-gray-200"
          >
            <Shield className="w-4 h-4 text-gray-600" />
            <span className="capitalize">{user?.role === 'staff' ? 'Security' : user?.role}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-300 rounded shadow-md py-1 z-50">
              <div className="px-3 py-2 text-xs font-bold text-gray-500 border-b border-gray-200 uppercase">
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
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-gray-100 ${
                    user?.role === item.role ? 'bg-blue-50 font-bold text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <span>{item.label}</span>
                  {user?.role === item.role && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-300 rounded shadow-md p-3 z-50">
              <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-2">
                <span className="font-bold">Notifications</span>
                <span className="text-xs text-blue-600">WhatsApp Synced</span>
              </div>
              <div className="space-y-2">
                <div className="p-2 bg-gray-50 border border-gray-200 rounded">
                  <p className="font-semibold">Gate Pass #GP-901 Approved</p>
                  <p className="text-xs text-gray-600 mt-1">Parent WhatsApp SMS delivered.</p>
                </div>
                <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="font-semibold text-yellow-800 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" /> Water Maintenance
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">Block A & B (10 AM - 1 PM).</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Info */}
        <div className="flex items-center gap-2 pl-3 border-l border-gray-300">
          <img
            src={user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=E5E7EB&color=374151`}
            alt="Profile"
            className="w-8 h-8 rounded border border-gray-300 object-cover" 
          />
          <div className="hidden xl:block">
            <p className="font-bold text-gray-800 leading-none">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 mt-1">{user?.room || 'Campus'}</p>
          </div>
          <button
            onClick={logout}
            className="p-1.5 ml-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};