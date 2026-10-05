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
        <h1 className="text-2xl font-bold text-gray-900">Leave Sanction Requests</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review outstation leave applications, verify parent consent, and issue digital leave slips.
        </p>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {leaves.map((leave) => (
          <div key={leave.id} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-gray-500">#{leave.id}</span>
              
              <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                leave.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                leave.status === 'REJECTED' ? 'bg-rose-50 text-rose-600 border-rose-200' :
                'bg-amber-50 text-amber-600 border-amber-200'
              }`}>
                {leave.status}
              </span>
            </div>

            <div>
              {leave.studentName && <h3 className="text-lg font-bold text-gray-900">{leave.studentName} ({leave.rollNo})</h3>}
              <p className="text-sm text-emerald-500 font-medium mt-0.5">Room {leave.room} • {leave.block}</p>
              
              <div className="mt-4 space-y-1.5">
                <p className="text-sm text-gray-600 leading-relaxed"><strong className="text-gray-900 font-semibold">Destination:</strong> {leave.destination}</p>
                <p className="text-sm text-gray-600 leading-relaxed"><strong className="text-gray-900 font-semibold">Reason:</strong> {leave.reason}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div>
                <span className="text-[10px] text-gray-500 font-bold tracking-wider block mb-1">DATES</span>
                <span className="text-sm text-gray-900 font-medium">{leave.fromDate} → {leave.toDate}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 font-bold tracking-wider block mb-1">DURATION</span>
                <span className="text-sm text-emerald-600 font-bold">{leave.totalDays} Days</span>
              </div>
            </div>

            {leave.status === 'PENDING' && (
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleAction(leave.id, 'REJECTED')}
                  className="flex-1 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-sm border border-rose-200 transition"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleAction(leave.id, 'APPROVED')}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition"
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