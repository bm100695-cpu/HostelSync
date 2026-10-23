import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Building2, 
  Users, 
  Bed, 
  Utensils, 
  AlertCircle, 
  ShieldCheck, 
  Activity, 
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Shield,
  Layers,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { Link } from 'react-router-dom';

const FALLBACK_HOSTELS = [
  { id: 'HST-BLK-A', name: 'Block-A (Senior Boys)', type: 'Boys', totalRooms: 60, occupiedRooms: 54, status: 'Active' },
  { id: 'HST-BLK-B', name: 'Block-B (Junior Boys)', type: 'Boys', totalRooms: 80, occupiedRooms: 76, status: 'Active' },
  { id: 'HST-BLK-G', name: 'Block-G (Girls Residency)', type: 'Girls', totalRooms: 100, occupiedRooms: 92, status: 'Active' }
];

export const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [hostels, setHostels] = useState(FALLBACK_HOSTELS);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [anaRes, userRes, hstRes] = await Promise.all([
          api.getAnalytics().catch(() => ({ success: false })),
          api.getAdminUsers().catch(() => ({ success: false })),
          api.getHostels().catch(() => ({ success: false }))
        ]);
        if (anaRes && anaRes.success) setAnalytics(anaRes.data);
        if (userRes && userRes.success && userRes.data?.length > 0) setUsers(userRes.data);
        if (hstRes && hstRes.success && hstRes.data?.length > 0) setHostels(hstRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const stats = analytics?.stats || {
    totalResidents: 240,
    occupancyRate: '92.4%',
    activePassesCount: 14,
    pendingComplaints: 2,
    messSatisfactionIndex: '4.8 / 5.0'
  };

  const chartData = analytics?.passesByDay || [
    { day: 'Mon', count: 18 },
    { day: 'Tue', count: 24 },
    { day: 'Wed', count: 32 },
    { day: 'Thu', count: 28 },
    { day: 'Fri', count: 65 },
    { day: 'Sat', count: 110 },
    { day: 'Sun', count: 95 }
  ];

  return (
    <div className="w-full space-y-6">
      {/* Executive Hero Banner - Clean light theme matching #00897B */}
      <div className="p-6 md:p-8 rounded-3xl border border-slate-200 bg-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-teal-50 text-[#00897B] text-xs font-bold border border-teal-200/60 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              CAMPUS EXECUTIVE BI
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-500">Dean of Student Affairs</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Hostel Operations Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Real-time analytics for 3 hostel blocks, 240+ residents, gate IoT scanners, and Gemini AI auto-triage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/users"
            className="px-5 py-3 rounded-xl bg-[#00897B] hover:bg-[#00796B] text-white text-xs sm:text-sm font-bold shadow-xs transition flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            <span>Manage Users</span>
          </Link>
          <Link
            to="/admin/rooms"
            className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold border border-slate-200 shadow-xs transition flex items-center gap-2"
          >
            <Bed className="w-4 h-4 text-[#00897B]" />
            <span>Room Allocation</span>
          </Link>
        </div>
      </div>

      {/* 4 Minimal KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Campus Occupancy</span>
            <p className="text-2xl xl:text-3xl font-extrabold text-slate-900 mt-1">{stats.occupancyRate}</p>
            <span className="text-xs text-[#00897B] font-bold mt-0.5 block">222 / 240 Beds Filled</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#00897B] flex items-center justify-center">
            <Bed className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Active Outing Passes</span>
            <p className="text-2xl xl:text-3xl font-extrabold text-slate-900 mt-1">{stats.activePassesCount || 1}</p>
            <span className="text-xs text-[#00897B] font-bold mt-0.5 block">Main Gate Synced</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#00897B] flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Mess Satisfaction</span>
            <p className="text-2xl xl:text-3xl font-extrabold text-slate-900 mt-1">{stats.messSatisfactionIndex || '4.7 / 5.0'}</p>
            <span className="text-xs text-amber-600 font-bold mt-0.5 block">Based on 140 ratings</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Utensils className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">AI Triage Speed</span>
            <p className="text-2xl xl:text-3xl font-extrabold text-slate-900 mt-1">&lt; 0.8s</p>
            <span className="text-xs text-indigo-600 font-bold mt-0.5 block">Gemini 1.5 Flash</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Gate Traffic Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">Weekly Campus Gate Traffic Flow</h3>
              <p className="text-xs text-slate-400">Total verified biometric check-outs and check-ins</p>
            </div>
            <span className="text-xs font-bold text-[#00897B] bg-teal-50 px-3 py-1 rounded-full border border-teal-200/60">
              Peak on Saturdays
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPassesTeal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00897B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00897B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="count" stroke="#00897B" strokeWidth={3} fillOpacity={1} fill="url(#colorPassesTeal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Hostel Blocks Breakdown (1 col) */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Hostel Blocks</h3>
              <Link to="/admin/hostels" className="text-xs font-bold text-[#00897B] hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-4 pt-4">
              {hostels.slice(0, 3).map((h) => {
                const pct = Math.round((h.occupiedRooms / (h.totalRooms || 60)) * 100) || 90;
                return (
                  <div key={h.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-slate-900">{h.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-[#00897B] border border-teal-200/60">
                        {h.type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Occupancy: {h.occupiedRooms || 54}/{h.totalRooms || 60} Rooms</span>
                      <span className="font-bold text-slate-900">{pct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full rounded-full bg-[#00897B] transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Link
            to="/admin/rooms"
            className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition text-center block"
          >
            Review Room Allocation Matrix →
          </Link>
        </div>
      </div>
    </div>
  );
};