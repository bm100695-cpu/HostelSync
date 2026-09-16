import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { AlertCircle, CheckCircle2, Clock, Wrench, Sparkles, Filter, Search } from 'lucide-react';

export const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await api.getComplaints();
        if (res.success) setComplaints(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchComplaints();
  }, []);

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || 
                          c.studentName.toLowerCase().includes(search.toLowerCase()) ||
                          c.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Master Maintenance & SLA Oversight</h1>
          <p className="text-xs text-gray-400 mt-1">
            Executive oversight on all hostel maintenance requests with AI priority metrics and resolution logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-900 text-white px-3.5 py-2 rounded-xl text-xs border border-gray-700"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-900 text-white px-3 py-2 rounded-xl text-xs border border-gray-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      <div className="glass-card rounded-3xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-900 text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-800">
              <tr>
                <th className="py-4 px-6">Ticket ID</th>
                <th className="py-4 px-6">Student & Room</th>
                <th className="py-4 px-6">Category & Title</th>
                <th className="py-4 px-6">AI Priority</th>
                <th className="py-4 px-6">Assigned Team</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              {filteredComplaints.map((comp) => (
                <tr key={comp.id} className="hover:bg-gray-800/40">
                  <td className="py-4 px-6 font-mono text-gray-400 font-bold">{comp.id}</td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-white">{comp.studentName}</p>
                    <p className="text-[11px] text-brand-400">Room {comp.room} ({comp.block})</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-white font-medium">{comp.title}</p>
                    <p className="text-[11px] text-gray-500">{comp.category}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      comp.urgency === 'URGENT' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                      comp.urgency === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                      'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    }`}>
                      {comp.urgency}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-300">{comp.assignedTo}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      comp.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                      comp.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                      'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}>
                      {comp.status}
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
