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
    const matchesSearch = c.title?.toLowerCase().includes(search.toLowerCase()) || 
                          c.studentName?.toLowerCase().includes(search.toLowerCase()) ||
                          c.category?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {/* Changed text-white to text-gray-900 so the title is visible */}
          <h1 className="text-2xl font-bold text-gray-900">Master Maintenance & SLA Oversight</h1>
          <p className="text-xs text-gray-500 mt-1">
            Executive oversight on all hostel maintenance requests with AI priority metrics and resolution logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white text-gray-900 placeholder-gray-400 px-3.5 py-2 rounded-xl text-xs border border-gray-200 shadow-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white text-gray-900 px-3 py-2 rounded-xl text-xs border border-gray-200 shadow-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Changed to white background with light borders */}
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-4 px-6">Ticket ID</th>
                <th className="py-4 px-6">Student & Room</th>
                <th className="py-4 px-6">Category & Title</th>
                <th className="py-4 px-6">AI Priority</th>
                <th className="py-4 px-6">Assigned Team</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-600">
              {filteredComplaints.map((comp) => (
                <tr key={comp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 font-mono text-gray-700 font-bold">{comp.id}</td>
                  <td className="py-4 px-6">
                    {comp.studentName && <p className="font-bold text-gray-900">{comp.studentName}</p>}
                    {/* Kept the room text green as shown in your screenshot */}
                    <p className="text-[11px] text-emerald-500">Room {comp.room} ({comp.block})</p>
                  </td>
                  <td className="py-4 px-6">
                    {comp.title && <p className="text-gray-900 font-medium">{comp.title}</p>}
                    <p className="text-[11px] text-gray-500">{comp.category}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                      comp.urgency === 'URGENT' ? 'bg-rose-50 text-rose-600 border-rose-200' :
                      comp.urgency === 'HIGH' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                      'bg-blue-50 text-blue-500 border-blue-200'
                    }`}>
                      {comp.urgency}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{comp.assignedTo || 'Unassigned'}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                      comp.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                      comp.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-500 border-blue-200' :
                      'bg-amber-50 text-amber-600 border-amber-200'
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