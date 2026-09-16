import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  FileCheck2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  Sparkles,
  Phone,
  ArrowRight
} from 'lucide-react';

export const WardenGatePasses = () => {
  const [passes, setPasses] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchPasses = async () => {
    try {
      const res = await api.getPasses();
      if (res.success) setPasses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPasses();
  }, []);

  const handleAction = async (id, status) => {
    try {
      const res = await api.updatePassStatus(id, status, status === 'APPROVED' ? 'Approved by Warden Patel' : 'Denied by Warden');
      if (res.success) {
        setActionSuccess(`Pass #${id} ${status} successfully. Automated WhatsApp notice dispatched to parent.`);
        await fetchPasses();
        setTimeout(() => setActionSuccess(''), 4000);
      }
    } catch (err) {
      alert(err.message || 'Action failed');
    }
  };

  const filteredPasses = passes.filter(p => {
    const matchesFilter = filter === 'ALL' || p.status === filter;
    const matchesSearch = p.studentName.toLowerCase().includes(search.toLowerCase()) || 
                          p.rollNo.toLowerCase().includes(search.toLowerCase()) ||
                          p.destination.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gate Pass Approvals & Log</h1>
          <p className="text-xs text-gray-400 mt-1">
            Review student outings, verify parent contacts, and trigger real-time WhatsApp gate clearance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search passes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-900 text-white px-3.5 py-2 rounded-xl text-xs border border-gray-700"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-900 text-white px-3 py-2 rounded-xl text-xs border border-gray-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Only</option>
            <option value="APPROVED">Approved</option>
            <option value="CHECKED_OUT">Checked Out</option>
            <option value="CHECKED_IN">Returned / Checked In</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Passes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPasses.map((pass) => (
          <div
            key={pass.id}
            className={`glass-card p-5 rounded-3xl border flex flex-col justify-between space-y-4 ${
              pass.status === 'PENDING' ? 'border-amber-500/40 bg-gray-900' : 'border-gray-800'
            }`}
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-gray-400">#{pass.id}</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${
                    pass.status === 'APPROVED'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : pass.status === 'CHECKED_OUT'
                      ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                      : pass.status === 'CHECKED_IN'
                      ? 'bg-gray-800 text-gray-400 border-gray-700'
                      : pass.status === 'REJECTED'
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  }`}
                >
                  {pass.status}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{pass.studentName}</h3>
                <p className="text-xs text-brand-300 font-mono font-medium">{pass.rollNo} • Room {pass.room}</p>
                <p className="text-xs text-gray-300 mt-1">
                  <strong>Dest:</strong> {pass.destination}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  <strong>Reason:</strong> {pass.reason}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-gray-800/40 border border-gray-700/50 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">Expected In:</span>
                  <span className="text-emerald-400 font-semibold">
                    {pass.expectedInTime ? new Date(pass.expectedInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Curfew (09:30 PM)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Parent Phone:</span>
                  <span className="text-gray-200 font-mono">{pass.parentPhone}</span>
                </div>
              </div>
            </div>

            {pass.status === 'PENDING' ? (
              <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
                <button
                  onClick={() => handleAction(pass.id, 'REJECTED')}
                  className="flex-1 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs border border-rose-500/30 transition"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleAction(pass.id, 'APPROVED')}
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition"
                >
                  Approve & Alert
                </button>
              </div>
            ) : (
              <div className="text-[11px] text-gray-500 pt-2 border-t border-gray-800 text-center">
                Action handled by {pass.approvedBy || 'Warden Office'}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
