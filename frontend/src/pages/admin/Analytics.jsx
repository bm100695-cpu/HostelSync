import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { BarChart3, TrendingUp, Users, Activity, Utensils, ShieldCheck, Download } from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const FALLBACK_PASSES = [
  { day: 'Mon', count: 18 },
  { day: 'Tue', count: 24 },
  { day: 'Wed', count: 32 },
  { day: 'Thu', count: 28 },
  { day: 'Fri', count: 65 },
  { day: 'Sat', count: 110 },
  { day: 'Sun', count: 95 }
];

const FALLBACK_COMPLAINTS = [
  { category: 'Electrical', count: 14, fill: '#00897B' },
  { category: 'Plumbing', count: 11, fill: '#0ea5e9' },
  { category: 'WiFi/Network', count: 6, fill: '#6366f1' },
  { category: 'Carpentry', count: 5, fill: '#f59e0b' },
  { category: 'Mess/Hygiene', count: 4, fill: '#10b981' }
];

export const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.getAnalytics();
        if (res && res.success && res.data) setAnalytics(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAnalytics();
  }, []);

  const passesData = (analytics?.passesByDay && analytics.passesByDay.length > 0) ? analytics.passesByDay : FALLBACK_PASSES;
  const complaintsData = (analytics?.complaintsByCategory && analytics.complaintsByCategory.length > 0) ? analytics.complaintsByCategory : FALLBACK_COMPLAINTS;

  return (
    <div className="w-full space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl border border-slate-200 bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full bg-teal-50 text-[#00897B] text-xs font-bold border border-teal-200/60 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              EXECUTIVE INTELLIGENCE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Campus Business Intelligence & Analytics</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            In-depth statistics on resident movements, maintenance turnaround times, and dining satisfaction.
          </p>
        </div>
      </div>

      {/* 3 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Weekly Gate Outings</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">372 Passes</p>
          <span className="text-xs font-semibold text-[#00897B] mt-0.5 block">Saturday Peak at 110 Passes</span>
        </div>
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Average Resolution SLA</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#00897B] mt-1">2.4 Hours</p>
          <span className="text-xs font-semibold text-emerald-600 mt-0.5 block">98.4% Within Target</span>
        </div>
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Parent WhatsApp Sync</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#00897B] mt-1">99.8%</p>
          <span className="text-xs font-semibold text-slate-500 mt-0.5 block">Live Cloud API Gateway</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-900">Weekly Gate Outing Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={passesData}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderColor: '#e2e8f0', 
                    borderRadius: '12px', 
                    fontSize: '12px',
                    color: '#0f172a',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }} 
                  itemStyle={{ color: '#0f172a' }}
                />
                <Bar dataKey="count" fill="#00897B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-900">Maintenance Issues by Department</h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={complaintsData}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {complaintsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill || '#00897B'} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderColor: '#e2e8f0', 
                    borderRadius: '12px', 
                    fontSize: '12px',
                    color: '#0f172a',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }} 
                  itemStyle={{ color: '#0f172a' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};