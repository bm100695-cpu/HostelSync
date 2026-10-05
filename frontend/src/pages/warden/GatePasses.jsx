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
    const matchesSearch = p.studentName?.toLowerCase().includes(search.toLowerCase()) || 
                          p.rollNo?.toLowerCase().includes(search.toLowerCase()) ||
                          p.destination?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {/* Changed header to dark gray */}
          <h1 className="text-2xl font-bold text-gray-900">Gate Pass Approvals & Log</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review student outings, verify parent contacts, and trigger real-time WhatsApp gate clearance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Inputs changed to white background with light borders and dark text */}
          <input
            type="text"
            placeholder="Search passes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white text-gray-900 px-4 py-2.5 rounded-xl text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white text-gray-900 px-4 py-2.5 rounded-xl text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
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
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Passes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPasses.map((pass) => (
          <div
            key={pass.id}
            /* Cards updated to solid white background with light gray borders */
            className={`bg-white p-6 rounded-3xl border shadow-sm flex flex-col justify-between space-y-4 ${
              pass.status === 'PENDING' ? 'border-amber-200 shadow-amber-100' : 'border-gray-200'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-gray-500">#{pass.id}</span>
                
                {/* Badges updated to light mode standard opacities (-50 for bg, -600 for text) */}
                <span
                  className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                    pass.status === 'APPROVED'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                      : pass.status === 'CHECKED_OUT'
                      ? 'bg-blue-50 text-blue-600 border-blue-200'
                      : pass.status === 'CHECKED_IN'
                      ? 'bg-gray-100 text-gray-600 border-gray-200'
                      : pass.status === 'REJECTED'
                      ? 'bg-rose-50 text-rose-600 border-rose-200'
                      : 'bg-amber-50 text-amber-600 border-amber-200'
                  }`}
                >
                  {pass.status}
                </span>
              </div>

              <div>
                {/* Student name to dark gray, Roll/Room to emerald green */}
                {pass.studentName && <h3 className="text-lg font-bold text-gray-900">{pass.studentName}</h3>}
                <p className="text-sm text-emerald-500 font-mono font-medium">{pass.rollNo} • Room {pass.room}</p>
                
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  <strong className="text-gray-900">Dest:</strong> {pass.destination}
                </p>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  <strong className="text-gray-900">Reason:</strong> {pass.reason}
                </p>
              </div>

              {/* Inner info block updated to light gray */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Expected In:</span>
                  <span className="text-emerald-600 font-bold">
                    {pass.expectedInTime ? new Date(pass.expectedInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Curfew (09:30 PM)'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Parent Phone:</span>
                  <span className="text-gray-900 font-mono font-medium">{pass.parentPhone}</span>
                </div>
              </div>
            </div>

            {pass.status === 'PENDING' ? (
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleAction(pass.id, 'REJECTED')}
                  className="flex-1 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-sm border border-rose-200 transition"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleAction(pass.id, 'APPROVED')}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition"
                >
                  Approve & Alert
                </button>
              </div>
            ) : (
              <div className="text-xs text-gray-400 pt-4 border-t border-gray-100 text-center font-medium">
                Action handled by {pass.approvedBy || 'Warden Office'}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};