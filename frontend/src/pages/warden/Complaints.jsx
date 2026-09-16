import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Sparkles, CheckCircle2, Clock, Wrench, UserCheck, Zap, Droplet } from 'lucide-react';

export const WardenComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchComplaints = async () => {
    try {
      const res = await api.getComplaints();
      if (res.success) setComplaints(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleUpdateStatus = async (id, status, assignedTo) => {
    try {
      const res = await api.updateComplaint(id, { status, assignedTo });
      if (res.success) {
        setActionSuccess(`Ticket #${id} updated to ${status}.`);
        await fetchComplaints();
        setTimeout(() => setActionSuccess(''), 4000);
      }
    } catch (err) {
      alert(err.message || 'Update failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Maintenance & Complaint SLA</h1>
          <p className="text-xs text-gray-400 mt-1">
            Monitor AI triage priority scores, assign maintenance staff, and track turnaround time.
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {complaints.map((comp) => (
          <div key={comp.id} className="glass-card p-6 rounded-3xl border border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-gray-400">#{comp.id}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                comp.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                comp.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                {comp.status}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white">{comp.title}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  comp.urgency === 'URGENT' ? 'bg-rose-500/20 text-rose-400' :
                  comp.urgency === 'HIGH' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {comp.urgency}
                </span>
              </div>
              <p className="text-xs text-brand-300 mt-1">Student: {comp.studentName} • Room {comp.room}</p>
              <p className="text-xs text-gray-300 mt-1">{comp.description}</p>
            </div>

            {comp.aiSummary && (
              <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-xs space-y-1">
                <span className="text-[10px] font-bold text-indigo-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> GEMINI AI RECOMMENDATION
                </span>
                <p className="text-gray-300 text-[11px]">{comp.aiSummary}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-gray-800 text-xs">
              <span className="text-gray-400">Staff: <strong className="text-gray-200">{comp.assignedTo}</strong></span>
              
              <div className="flex items-center gap-2">
                {comp.status === 'PENDING' && (
                  <button
                    onClick={() => handleUpdateStatus(comp.id, 'IN_PROGRESS', 'Manoj Kumar (Electrician)')}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
                  >
                    Assign Staff
                  </button>
                )}
                {comp.status !== 'RESOLVED' && (
                  <button
                    onClick={() => handleUpdateStatus(comp.id, 'RESOLVED', comp.assignedTo)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"
                  >
                    Mark Fixed
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
