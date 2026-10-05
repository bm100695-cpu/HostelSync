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
      {/* Executive Hero Banner - Updated to Light Purple Gradient */}
      <div className="p-6 md:p-8 rounded-3xl border border-purple-100 bg-gradient-to-r from-purple-50 to-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200">
              CAMPUS EXECUTIVE BI
            </span>
            <span className="text-xs text-gray-500">• Dean of Student Affairs</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            Hostel Operations Intelligence
          </h1>
          <p className="text-xs text-gray-600">
            Real-time analytics for 3 hostel blocks, 240+ residents, gate IoT scanners, and Gemini AI auto-triage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/users"
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            <span>Manage Users</span>
          </Link>
          <Link
            to="/admin/rooms"
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold border border-gray-200 shadow-sm transition flex items-center gap-2"
          >
            <Bed className="w-4 h-4 text-purple-600" />
            <span>Room Allocation</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards - Updated to Light Theme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-medium">Campus Occupancy</span>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.occupancyRate}</p>
            <span className="text-[11px] text-emerald-600 font-semibold">222 / 240 Beds Filled</span>
          </div>
          <div className="p-3 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100">
            <Bed className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-medium">Active Outing Passes</span>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.activePassesCount}</p>
            <span className="text-[11px] text-gray-500">Main Gate Synced</span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-medium">Mess Satisfaction</span>
            <p className="text-2xl font-bold text-amber-500 mt-1">{stats.messSatisfactionIndex}</p>
            <span className="text-[11px] text-amber-600">Based on 140 ratings</span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
            <Utensils className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-medium">AI Triage Speed</span>
            <p className="text-2xl font-bold text-indigo-600 mt-1">&lt; 0.8s</p>
            <span className="text-[11px] text-indigo-500">Gemini 1.5 Flash</span>
          </div>
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytics Chart & Hostel Blocks Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">Weekly Campus Gate Traffic Flow</h3>
            <span className="text-xs text-purple-600 font-medium">Peak on Saturdays</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} />
                {/* Updated Tooltip for light mode visibility */}
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderRadius: '12px', fontSize: '12px', color: '#111827' }} 
                  itemStyle={{ color: '#111827' }}
                />
                <Area type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorTraffic)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hostel Blocks Overview */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">Hostel Blocks</h3>
            <Link to="/admin/hostels" className="text-xs text-purple-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {hostels.map((hst) => (
              <div key={hst.id} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-2 hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-900">{hst.name}</h4>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100">
                    {hst.type}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-gray-500">
                  <span>Occupancy: {hst.occupiedRooms}/{hst.totalRooms} Rooms</span>
                  <span className="text-gray-900 font-bold">{Math.round((hst.occupiedRooms / hst.totalRooms) * 100)}%</span>
                </div>
                {/* Progress bar updated for light theme */}
                <div className="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
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