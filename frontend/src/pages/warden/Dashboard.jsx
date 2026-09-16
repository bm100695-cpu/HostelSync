import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  FileCheck2, 
  AlertCircle, 
  ClipboardList, 
  CheckCircle2, 
  XCircle, 
  ArrowUpRight, 
  Sparkles, 
  MessageSquareShare,
  Clock,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const WardenDashboard = () => {
  const { user } = useAuth();
  const [passes, setPasses] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchData = async () => {
    try {
      const [passRes, leaveRes, compRes] = await Promise.all([
        api.getPasses(),
        api.getLeaves(),
        api.getComplaints()
      ]);
      if (passRes.success) setPasses(passRes.data);
      if (leaveRes.success) setLeaves(leaveRes.data);
      if (compRes.success) setComplaints(compRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePassAction = async (id, status) => {
    try {
      const res = await api.updatePassStatus(id, status, status === 'APPROVED' ? 'Approved by Warden Patel' : 'Denied by Warden');
      if (res.success) {
        setActionSuccess(`Pass #${id} was ${status.toLowerCase()} with automatic WhatsApp parent alert.`);
        await fetchData();
        setTimeout(() => setActionSuccess(''), 4000);
      }
    } catch (err) {
      alert(err.message || 'Action failed');
    }
  };

  const pendingPasses = passes.filter(p => p.status === 'PENDING');
  const pendingLeaves = leaves.filter(l => l.status === 'PENDING');
  const activeComplaints = complaints.filter(c => c.status === 'PENDING' || c.status === 'IN_PROGRESS');

  return (
    <div className="space-y-6">
      {/* Hero Warden Banner */}
      <div className="glass-card p-6 md:p-8 rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-gray-900 via-indigo-950/40 to-gray-900 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold border border-indigo-500/30">
              CHIEF WARDEN PORTAL
            </span>
            <span className="text-xs text-gray-400">• {user?.block || 'Block-B & Central Campus'}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Warden Control Center: {user?.name}
          </h1>
          <p className="text-xs text-gray-300">
            Real-time hostel oversight: Gate approvals, night roll call, maintenance dispatch & WhatsApp parent alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/warden/attendance"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Conduct Night Roll Call</span>
          </Link>
          <Link
            to="/warden/notices"
            className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold border border-gray-700 transition flex items-center gap-2"
          >
            <MessageSquareShare className="w-4 h-4 text-emerald-400" />
            <span>Broadcast Notice</span>
          </Link>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Pending Gate Passes</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{pendingPasses.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <FileCheck2 className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Pending Leave Slips</p>
            <p className="text-2xl font-bold text-indigo-400 mt-1">{pendingLeaves.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <ClipboardList className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Active Maintenance</p>
            <p className="text-2xl font-bold text-rose-400 mt-1">{activeComplaints.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Curfew Inflow</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">94% Inside</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Shield className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Fast Approval Queue & Recent AI Triage Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Pending Gate Pass Approvals */}
        <div className="glass-card p-6 rounded-3xl border border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Pending Gate Pass Approvals</h3>
            </div>
            <Link to="/warden/passes" className="text-xs text-brand-400 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {pendingPasses.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">
                ✨ Zero pending gate pass requests in queue!
              </p>
            ) : (
              pendingPasses.map((pass) => (
                <div key={pass.id} className="p-4 rounded-2xl bg-gray-800/50 border border-gray-700/60 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{pass.studentName} ({pass.rollNo})</h4>
                      <p className="text-xs text-brand-300 font-medium">Room {pass.room} • {pass.type}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        <strong>Dest:</strong> {pass.destination} | <strong>Reason:</strong> {pass.reason}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-gray-500">{pass.id}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-700/50">
                    <span className="text-[11px] text-gray-400">
                      Parent: <strong className="text-gray-200">{pass.parentPhone}</strong>
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePassAction(pass.id, 'REJECTED')}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/30 transition flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => handlePassAction(pass.id, 'APPROVED')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve & SMS Parent</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: AI Prioritized Maintenance Dispatch */}
        <div className="glass-card p-6 rounded-3xl border border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">AI Maintenance Dispatch</h3>
            </div>
            <Link to="/warden/complaints" className="text-xs text-brand-400 hover:underline">
              Manage SLA
            </Link>
          </div>

          <div className="space-y-3">
            {activeComplaints.slice(0, 3).map((comp) => (
              <div key={comp.id} className="p-4 rounded-2xl bg-gray-800/50 border border-gray-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{comp.title}</span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    comp.urgency === 'URGENT' ? 'bg-rose-500/20 text-rose-400' :
                    comp.urgency === 'HIGH' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {comp.urgency} PRIORITY
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Room {comp.room} • {comp.category}
                </p>
                {comp.aiSummary && (
                  <p className="text-[11px] text-indigo-300 bg-indigo-950/40 p-2 rounded-lg border border-indigo-500/20">
                    🤖 {comp.aiSummary}
                  </p>
                )}
                <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                  <span>Assigned: <strong className="text-gray-300">{comp.assignedTo}</strong></span>
                  <span className="text-amber-400 font-semibold">{comp.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
