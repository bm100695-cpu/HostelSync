import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Wrench, CheckCircle2, Clock, Zap, Droplet } from 'lucide-react';

export const StaffWorkOrders = () => {
  const [complaints, setComplaints] = useState([]);
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchOrders = async () => {
    try {
      const res = await api.getComplaints();
      if (res.success) setComplaints(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleMarkDone = async (id) => {
    try {
      const res = await api.updateComplaint(id, {
        status: 'RESOLVED',
        resolutionNotes: 'Fixed and verified by maintenance staff.'
      });
      if (res.success) {
        setActionSuccess(`Work Order #${id} marked as RESOLVED.`);
        await fetchOrders();
        setTimeout(() => setActionSuccess(''), 4000);
      }
    } catch (err) {
      alert(err.message || 'Action failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Maintenance Staff Work Orders</h1>
        <p className="text-xs text-gray-400 mt-1">
          Assigned field repair tickets: electrical, plumbing, carpentry, and sanitization tasks.
        </p>
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
                'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                {comp.status}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{comp.title}</h3>
              <p className="text-xs text-brand-400 mt-1">Location: Room {comp.room} ({comp.block})</p>
              <p className="text-xs text-gray-300 mt-2">{comp.description}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-800 text-xs">
              <span className="text-gray-400">Assigned: <strong className="text-gray-200">{comp.assignedTo}</strong></span>

              {comp.status !== 'RESOLVED' && (
                <button
                  onClick={() => handleMarkDone(comp.id)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                >
                  Mark as Fixed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
