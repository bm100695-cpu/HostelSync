import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { CalendarCheck, CheckCircle2, XCircle, Clock, MapPin, Phone, ShieldCheck } from 'lucide-react';

export const WardenLeaveRequests = () => {
  const [leaves, setLeaves] = useState([]);
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchLeaves = async () => {
    try {
      const res = await api.getLeaves();
      if (res.success) setLeaves(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleAction = async (id, status) => {
    try {
      const res = await api.updateLeaveStatus(id, status, status === 'APPROVED' ? 'Sanctioned by Warden Office' : 'Leave Request Refused');
      if (res.success) {
        setActionSuccess(`Leave #${id} ${status} successfully.`);
        await fetchLeaves();
        setTimeout(() => setActionSuccess(''), 4000);
      }
    } catch (err) {
      alert(err.message || 'Action failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Leave Sanction Requests</h1>
        <p className="text-xs text-gray-400 mt-1">
          Review outstation leave applications, verify parent consent, and issue digital leave slips.
        </p>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {leaves.map((leave) => (
          <div key={leave.id} className="glass-card p-6 rounded-3xl border border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-gray-400">#{leave.id}</span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                leave.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                leave.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                {leave.status}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{leave.studentName} ({leave.rollNo})</h3>
              <p className="text-xs text-brand-400 font-medium">Room {leave.room} • {leave.block}</p>
              <p className="text-xs text-gray-300 mt-2"><strong>Destination:</strong> {leave.destination}</p>
              <p className="text-xs text-gray-400 mt-0.5"><strong>Reason:</strong> {leave.reason}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-gray-800/40 border border-gray-700/50 text-xs">
              <div>
                <span className="text-[10px] text-gray-400 block">DATES</span>
                <span className="text-white font-medium">{leave.fromDate} → {leave.toDate}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">DURATION</span>
                <span className="text-emerald-400 font-bold">{leave.totalDays} Days</span>
              </div>
            </div>

            {leave.status === 'PENDING' && (
              <div className="flex gap-2 pt-2 border-t border-gray-800">
                <button
                  onClick={() => handleAction(leave.id, 'REJECTED')}
                  className="flex-1 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs border border-rose-500/30 transition"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleAction(leave.id, 'APPROVED')}
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                >
                  Approve Leave
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
