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
          <h1 className="text-2xl font-bold text-gray-900">Maintenance & Complaint SLA</h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor AI triage priority scores, assign maintenance staff, and track turnaround time.
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {complaints.map((comp) => (
          <div key={comp.id} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between space-y-4">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-gray-500">#{comp.id}</span>
                
                <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                  comp.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                  comp.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                  'bg-amber-50 text-amber-600 border-amber-200'
                }`}>
                  {comp.status}
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between gap-2">
                  {comp.title && <span className="text-lg font-bold text-gray-900">{comp.title}</span>}
                  
                  {comp.urgency && (
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${
                      comp.urgency === 'URGENT' ? 'bg-rose-50 text-rose-600 border-rose-200' :
                      comp.urgency === 'HIGH' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                      'bg-indigo-50 text-indigo-600 border-indigo-200'
                    }`}>
                      {comp.urgency}
                    </span>
                  )}
                </div>
                <p className="text-sm text-emerald-500 font-medium mt-1.5">Student: {comp.studentName} • Room {comp.room}</p>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{comp.description}</p>
              </div>

              {comp.aiSummary && (
                <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 text-sm space-y-1.5">
                  <span className="text-[11px] font-bold text-indigo-600 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> GEMINI AI RECOMMENDATION
                  </span>
                  <p className="text-indigo-900/80 text-xs leading-relaxed">{comp.aiSummary}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-sm">
              <span className="text-gray-500">Staff: <strong className="text-gray-900">{comp.assignedTo || 'Unassigned'}</strong></span>
              
              <div className="flex items-center gap-3">
                {comp.status === 'PENDING' && (
                  <button
                    onClick={() => handleUpdateStatus(comp.id, 'IN_PROGRESS', 'Manoj Kumar (Electrician)')}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition"
                  >
                    Assign Staff
                  </button>
                )}
                {comp.status !== 'RESOLVED' && (
                  <button
                    onClick={() => handleUpdateStatus(comp.id, 'RESOLVED', comp.assignedTo)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
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