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
          <div className="w-12 h-12 rounded-2xl bg-brand-500 animate-pulse flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-brand-500/20">
            HS
          </div>
          <p className="text-xs text-slate-500 font-medium">Loading HostelSync Workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col">
      <Navbar
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        openAIChat={() => setAiChatOpen(true)}
      />

      <div className="flex flex-1 pt-0">
        <Sidebar
          isOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 flex flex-col transition-all duration-300 min-w-0">
          <div className="p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6 flex-1">
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
