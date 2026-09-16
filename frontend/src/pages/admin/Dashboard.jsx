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
  ArrowUpRight
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [hostels, setHostels] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [anaRes, userRes, hstRes] = await Promise.all([
          api.getAnalytics(),
          api.getAdminUsers(),
          api.getHostels()
        ]);
        if (anaRes.success) setAnalytics(anaRes.data);
        if (userRes.success) setUsers(userRes.data);
        if (hstRes.success) setHostels(hstRes.data);
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
    <div className="space-y-6">
      {/* Executive Hero Banner */}
      <div className="glass-card p-6 md:p-8 rounded-3xl border border-purple-500/30 bg-gradient-to-r from-gray-900 via-purple-950/30 to-gray-900 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold border border-purple-500/30">
              CAMPUS EXECUTIVE BI
            </span>
            <span className="text-xs text-gray-400">• Dean of Student Affairs</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Hostel Operations Intelligence
          </h1>
          <p className="text-xs text-gray-300">
            Real-time analytics for 3 hostel blocks, 240+ residents, gate IoT scanners, and Gemini AI auto-triage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/users"
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            <span>Manage Users</span>
          </Link>
          <Link
            to="/admin/rooms"
            className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold border border-gray-700 transition flex items-center gap-2"
          >
            <Bed className="w-4 h-4 text-brand-400" />
            <span>Room Allocation</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-3xl border border-gray-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-medium">Campus Occupancy</span>
            <p className="text-2xl font-bold text-white mt-1">{stats.occupancyRate}</p>
            <span className="text-[11px] text-emerald-400 font-semibold">222 / 240 Beds Filled</span>
          </div>
          <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
            <Bed className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-gray-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-medium">Active Outing Passes</span>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{stats.activePassesCount}</p>
            <span className="text-[11px] text-gray-400">Main Gate Synced</span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-gray-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-medium">Mess Satisfaction</span>
            <p className="text-2xl font-bold text-amber-400 mt-1">{stats.messSatisfactionIndex}</p>
            <span className="text-[11px] text-amber-300">Based on 140 ratings</span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Utensils className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-gray-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-medium">AI Triage Speed</span>
            <p className="text-2xl font-bold text-indigo-400 mt-1">&lt; 0.8s</p>
            <span className="text-[11px] text-indigo-300">Gemini 1.5 Flash</span>
          </div>
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytics Chart & Hostel Blocks Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Weekly Campus Gate Traffic Flow</h3>
            <span className="text-xs text-brand-400 font-medium">Peak on Saturdays</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '12px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="count" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorTraffic)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hostel Blocks Overview */}
        <div className="glass-card p-6 rounded-3xl border border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Hostel Blocks</h3>
            <Link to="/admin/hostels" className="text-xs text-brand-400 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {hostels.map((hst) => (
              <div key={hst.id} className="p-3.5 rounded-2xl bg-gray-800/40 border border-gray-700/50 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{hst.name}</h4>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                    {hst.type}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-gray-400">
                  <span>Occupancy: {hst.occupiedRooms}/{hst.totalRooms} Rooms</span>
                  <span className="text-white font-semibold">{Math.round((hst.occupiedRooms / hst.totalRooms) * 100)}%</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-gray-700 overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full"
                    style={{ width: `${(hst.occupiedRooms / hst.totalRooms) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
