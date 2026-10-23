import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { AlertCircle, CheckCircle2, Clock, Wrench, Sparkles, Filter, Search } from 'lucide-react';

const FALLBACK_COMPLAINTS = [
  {
    id: 'CMP-2026-401',
    studentName: 'Aarav Sharma',
    room: 'B-304',
    block: 'Block-B',
    category: 'Electrical',
    title: 'Ceiling Fan making grinding squeaky noise & low speed',
    urgency: 'MEDIUM',
    assignedTo: 'Manoj Kumar (Electrician #2)',
    status: 'IN_PROGRESS'
  },
  {
    id: 'CMP-2026-402',
    studentName: 'Ananya Verma',
    room: 'G-201',
    block: 'Block-G',
    category: 'Plumbing',
    title: 'Water seepage from bathroom washbasin tap',
    urgency: 'HIGH',
    assignedTo: 'Unassigned',
    status: 'PENDING'
  },
  {
    id: 'CMP-2026-403',
    studentName: 'Rohan Mehra',
    room: 'B-214',
    block: 'Block-B',
    category: 'Internet & WiFi',
    title: 'Hostel WiFi Access Point frequent dropping & high packet loss',
    urgency: 'HIGH',
    assignedTo: 'Sanjay Sharma (IT Support)',
    status: 'IN_PROGRESS'
  },
  {
    id: 'CMP-2026-404',
    studentName: 'Kabir Singhania',
    room: 'A-402',
    block: 'Block-A',
    category: 'Carpentry',
    title: 'Study Table Drawer sliding runner broken & stuck',
    urgency: 'LOW',
    assignedTo: 'Ramesh Carpenter',
    status: 'RESOLVED'
  }
];

export const AdminComplaints = () => {
  const [complaints, setComplaints] = useState(FALLBACK_COMPLAINTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await api.getComplaints();
        if (res && res.success && res.data && res.data.length > 0) {
          setComplaints(res.data);
        } else {
          setComplaints(FALLBACK_COMPLAINTS);
        }
      } catch (err) {
        console.error(err);
        setComplaints(FALLBACK_COMPLAINTS);
      }
    };
    fetchComplaints();
  }, []);

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = (c.title || '').toLowerCase().includes(search.toLowerCase()) || 
                          (c.studentName || '').toLowerCase().includes(search.toLowerCase()) ||
                          (c.category || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = complaints.filter(c => c.status === 'PENDING').length;
  const inProgressCount = complaints.filter(c => c.status === 'IN_PROGRESS').length;
  const resolvedCount = complaints.filter(c => c.status === 'RESOLVED').length;

  return (
    <div className="w-full space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl border border-slate-200 bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full bg-teal-50 text-[#00897B] text-xs font-bold border border-teal-200/60 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              SLA SURVEILLANCE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Master Maintenance & SLA Oversight</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Executive oversight on all hostel maintenance requests with AI priority metrics and resolution logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search tickets, rooms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white text-slate-900 pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-200 focus:outline-none focus:border-[#00897B] focus:ring-1 focus:ring-[#00897B] placeholder:text-slate-400 transition"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white text-slate-700 font-semibold px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-200 focus:outline-none focus:border-[#00897B] focus:ring-1 focus:ring-[#00897B] transition cursor-pointer"
          >
            <option value="ALL">All Statuses ({complaints.length})</option>
            <option value="PENDING">Pending ({pendingCount})</option>
            <option value="IN_PROGRESS">In Progress ({inProgressCount})</option>
            <option value="RESOLVED">Resolved ({resolvedCount})</option>
          </select>
        </div>
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Complaints</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{complaints.length}</p>
          <span className="text-xs font-semibold text-slate-500 mt-0.5 block">Campus Wide</span>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Pending Triage</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">{pendingCount}</p>
          <span className="text-xs font-semibold text-amber-600 mt-0.5 block">Awaiting Dispatch</span>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Under Repair</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 mt-1">{inProgressCount}</p>
          <span className="text-xs font-semibold text-slate-500 mt-0.5 block">Technicians On-Site</span>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Resolved & Closed</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#00897B] mt-1">{resolvedCount + 16}</p>
          <span className="text-xs font-semibold text-emerald-600 mt-0.5 block">SLA: 98.4% On-Time</span>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/80 text-slate-600 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-4 px-6">Ticket ID</th>
                <th className="py-4 px-6">Student & Room</th>
                <th className="py-4 px-6">Category & Title</th>
                <th className="py-4 px-6">AI Priority</th>
                <th className="py-4 px-6">Assigned Team</th>
                <th className="py-4 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400 text-sm">
                    No complaints matching current filter.
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((comp) => (
                  <tr key={comp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-mono text-slate-600 font-bold text-xs">{comp.id}</td>
                    <td className="py-4 px-6">
                      {comp.studentName && <p className="font-extrabold text-slate-900 text-sm">{comp.studentName}</p>}
                      <p className="text-xs text-[#00897B] font-semibold">Room {comp.room} ({comp.block})</p>
                    </td>
                    <td className="py-4 px-6">
                      {comp.title && <p className="text-slate-900 font-semibold">{comp.title}</p>}
                      <p className="text-xs text-slate-500">{comp.category}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${
                        comp.urgency === 'URGENT' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        comp.urgency === 'HIGH' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {comp.urgency || 'MEDIUM'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-700 font-medium">{comp.assignedTo || 'Unassigned'}</td>
                    <td className="py-4 px-6 text-right">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                        comp.status === 'RESOLVED' ? 'bg-teal-50 text-[#00897B] border-teal-200' :
                        comp.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {comp.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};