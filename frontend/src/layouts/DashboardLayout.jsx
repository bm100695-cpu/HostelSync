import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/common/Navbar';
import { Sidebar } from '../components/common/Sidebar';
import { AIChatWidget } from '../components/common/AIChatWidget';

export const DashboardLayout = () => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <img
            src="/logo-transparent.png"
            alt="HostelSync Logo"
            className="w-14 h-14 object-contain animate-pulse"
          />
          <p className="text-xs font-semibold tracking-wide">
            <span className="text-[#000000]">HostelSync</span>
            <span className="text-slate-400 font-normal"> · Loading Workspace...</span>
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col w-full max-w-full overflow-x-hidden">
      <Navbar
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        openAIChat={() => setAiChatOpen(true)}
      />

      <div className="flex flex-1 pt-0 w-full max-w-full overflow-x-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 flex flex-col transition-all duration-300 min-w-0 w-full max-w-full overflow-x-hidden">
          <div className="p-3.5 sm:p-6 lg:p-8 max-w-[1550px] w-full mx-auto space-y-5 sm:space-y-6 flex-1 min-w-0">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Floating Gemini AI Chatbot */}
      <AIChatWidget
        isOpen={aiChatOpen}
        onClose={() => setAiChatOpen(false)}
      />
    </div>
  );
};
