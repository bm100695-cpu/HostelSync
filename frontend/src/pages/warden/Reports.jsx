import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  Users, 
  FileCheck2, 
  AlertCircle, 
  FileSpreadsheet, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  ArrowUpRight 
} from 'lucide-react';
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
    const csvContent = "data:text/csv;charset=utf-8,Day,GatePassOutings,TurnaroundHours,ParentSyncRate\nMon,18,2.1,100%\nTue,24,2.3,99.8%\nWed,32,2.0,100%\nThu,28,2.4,99.5%\nFri,65,2.2,99.9%\nSat,110,2.5,99.8%\nSun,95,2.4,100%";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `HostelSync_Audit_Report_${new Date().toISOString().split('T')[0]}.csv`);
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
    { category: 'Electrical', count: 14, fill: '#00897B' },
    { category: 'Plumbing', count: 11, fill: '#0ea5e9' },
    { category: 'WiFi/Network', count: 6, fill: '#6366f1' },
    { category: 'Carpentry', count: 5, fill: '#f59e0b' }
  ];

  const recentAudits = [
    { id: 'AUD-901', event: 'Daily Night Curfew Roll Call Closed', block: 'Block-B & G', time: 'Yesterday 09:45 PM', status: 'COMPLETED', warden: 'Dr. Ramesh K. Patel' },
    { id: 'AUD-902', event: 'Emergency Late Gate Entry Authorization', block: 'Main North Gate', time: 'Yesterday 10:15 PM', status: 'VERIFIED', warden: 'Vikram Singh (Security)' },
    { id: 'AUD-903', event: 'WhatsApp Broadcast: Inter-Hostel Meet circular', block: 'All Residents', time: '21 Oct 04:30 PM', status: 'DISPATCHED', warden: 'Chief Warden Office' },
    { id: 'AUD-904', event: 'Electrical Preventive Maintenance Sign-off', block: 'Block-B Floor 3', time: '20 Oct 02:00 PM', status: 'COMPLETED', warden: 'Manoj Kumar (Staff)' }
  ];

  return (
    <div className="w-full space-y-6">
      {/* Header Banner - High contrast text with clean slate border */}
      <div className="p-6 sm:p-7 rounded-3xl border border-slate-200 bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full bg-teal-50 text-[#00897B] text-xs font-bold border border-teal-200/60 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              CAMPUS AUDIT & COMPLIANCE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Reports & Export Center</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gate pass traffic trends, complaint resolution SLAs, and exportable campus compliance logs.
          </p>
        </div>

        <button
          onClick={downloadCSV}
          className="px-5 py-3 rounded-xl bg-[#00897B] hover:bg-[#00796B] text-white text-xs sm:text-sm font-bold shadow-xs transition flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Pass Logs (CSV)</span>
        </button>
      </div>

      {/* 3 KPI Cards - Bold dark numbers and clear labels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Weekly Gate Outings</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">372 Passes</p>
          <span className="text-xs font-semibold text-[#00897B] mt-0.5 block">Peak Saturday (110 Outings)</span>
        </div>
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Avg Maintenance SLA</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#00897B] mt-1">2.4 Hours</p>
          <span className="text-xs font-semibold text-emerald-600 mt-0.5 block">Within 4-Hour Target SLA</span>
        </div>
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Parent WhatsApp Delivery</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#00897B] mt-1">99.8%</p>
          <span className="text-xs font-semibold text-slate-500 mt-0.5 block">Meta Business Cloud API</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 sm:p-7 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">Gate Pass Outings by Day</h3>
            <span className="text-xs font-bold text-[#00897B] bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60">Last 7 Days</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={passesData}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#00897B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 sm:p-7 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">Complaints by Discipline</h3>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">36 Total Tickets</span>
          </div>
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
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Audit Log Table - Fills screen space and provides official institutional oversight */}
      <div className="p-6 sm:p-7 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Recent Institutional Compliance Events</h3>
            <p className="text-xs text-slate-500">Live timestamped warden, security gate, and broadcast actions</p>
          </div>
          <button onClick={downloadCSV} className="text-xs font-bold text-[#00897B] hover:underline flex items-center gap-1">
            <span>Download Full Log</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Audit ID</th>
                <th className="py-3 px-4">Event Description</th>
                <th className="py-3 px-4">Location / Target</th>
                <th className="py-3 px-4">Handled By</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {recentAudits.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-500 text-xs">#{a.id}</td>
                  <td className="py-3 px-4 font-extrabold text-slate-900">{a.event}</td>
                  <td className="py-3 px-4 text-slate-600">{a.block}</td>
                  <td className="py-3 px-4 text-slate-700 font-semibold">{a.warden}</td>
                  <td className="py-3 px-4 text-slate-500 text-xs">{a.time}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-[#00897B] border border-teal-200/60">
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
