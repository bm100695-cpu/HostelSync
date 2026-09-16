import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { BarChart3, Download, TrendingUp, Users, FileCheck2, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

export const WardenReports = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.getAnalytics();
        if (res.success) setAnalytics(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAnalytics();
  }, []);

  const downloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,Day,GatePassOutings\nMon,18\nTue,24\nWed,32\nThu,28\nFri,65\nSat,110\nSun,95";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `HostelSync_Gate_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const passesData = analytics?.passesByDay || [
    { day: 'Mon', count: 18 },
    { day: 'Tue', count: 24 },
    { day: 'Wed', count: 32 },
    { day: 'Thu', count: 28 },
    { day: 'Fri', count: 65 },
    { day: 'Sat', count: 110 },
    { day: 'Sun', count: 95 }
  ];

  const complaintsData = analytics?.complaintsByCategory || [
    { category: 'Electrical', count: 14, fill: '#3b82f6' },
    { category: 'Plumbing', count: 11, fill: '#06b6d4' },
    { category: 'WiFi/Network', count: 6, fill: '#8b5cf6' },
    { category: 'Carpentry', count: 5, fill: '#f59e0b' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports & Export Center</h1>
          <p className="text-xs text-gray-400 mt-1">
            Gate pass traffic trends, complaint resolution SLAs, and exportable campus compliance logs.
          </p>
        </div>

        <button
          onClick={downloadCSV}
          className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold border border-gray-700 transition flex items-center gap-2"
        >
          <Download className="w-4 h-4 text-brand-400" />
          <span>Export Pass Logs (CSV)</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="glass-card p-5 rounded-2xl border border-gray-800">
          <span className="text-gray-400 font-medium">Weekly Total Gate Outings</span>
          <p className="text-2xl font-bold text-white mt-1">372 Passes</p>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-gray-800">
          <span className="text-gray-400 font-medium">Avg Maintenance SLA</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1">2.4 Hours</p>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-gray-800">
          <span className="text-gray-400 font-medium">Parent WhatsApp Delivery Rate</span>
          <p className="text-2xl font-bold text-brand-400 mt-1">99.8%</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-3xl border border-gray-800 space-y-4">
          <h3 className="text-base font-bold text-white">Gate Pass Outings by Day</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={passesData}>
                <XAxis dataKey="day" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-gray-800 space-y-4">
          <h3 className="text-base font-bold text-white">Complaints by Discipline</h3>
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
                    <Cell key={`cell-${index}`} fill={entry.fill || '#10b981'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
