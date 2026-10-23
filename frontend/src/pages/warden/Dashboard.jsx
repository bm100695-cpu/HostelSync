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
  Shield,
  ShieldCheck,
  Building,
  UserCheck
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
      if (passRes.success) setPasses(passRes.data || []);
      if (leaveRes.success) setLeaves(leaveRes.data || []);
      if (compRes.success) setComplaints(compRes.data || []);
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
    <div className="w-full space-y-6">
      {/* Clean Light Hero Warden Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-teal-50 text-[#00897B] text-xs font-bold border border-teal-200/60 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              CHIEF WARDEN PORTAL
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-semibold text-slate-500">{user?.block || 'Block-B & Central Campus'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Warden Control Center: {user?.name || 'Dr. Ramesh K. Patel'}
          </h1>
          <p className="text-sm text-slate-500">
            Real-time hostel oversight: Gate approvals, night roll call, maintenance dispatch & WhatsApp parent alerts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/warden/attendance"
            className="px-5 py-3 rounded-xl bg-[#00897B] hover:bg-[#00796B] text-white text-xs sm:text-sm font-bold shadow-sm transition flex items-center gap-2"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Conduct Night Roll Call</span>
          </Link>
          <Link
            to="/warden/notices"
            className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold border border-slate-200 shadow-sm transition flex items-center gap-2"
          >
            <MessageSquareShare className="w-4 h-4 text-[#00897B]" />
            <span>Broadcast Notice</span>
          </Link>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#00897B] shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* 4 Minimal KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs hover:shadow-md transition-all flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Gate Passes</span>
            <p className="text-2xl xl:text-3xl font-extrabold text-slate-900 mt-1">{pendingPasses.length}</p>
            <span className="text-xs text-[#00897B] font-semibold mt-0.5 block">Action required</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#00897B] flex items-center justify-center">
            <FileCheck2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs hover:shadow-md transition-all flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Leave Slips</span>
            <p className="text-2xl xl:text-3xl font-extrabold text-slate-900 mt-1">{pendingLeaves.length}</p>
            <span className="text-xs text-amber-600 font-semibold mt-0.5 block">Parent sync pending</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <ClipboardList className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs hover:shadow-md transition-all flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Maintenance</span>
            <p className="text-2xl xl:text-3xl font-extrabold text-slate-900 mt-1">{activeComplaints.length}</p>
            <span className="text-xs text-slate-500 font-medium mt-0.5 block">Staff dispatched</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs hover:shadow-md transition-all flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Curfew Inflow</span>
            <p className="text-2xl xl:text-3xl font-extrabold text-slate-900 mt-1">94% Inside</p>
            <span className="text-xs text-emerald-600 font-semibold mt-0.5 block">North Gate verified</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Two Column Layout (fills the screen width) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Pending Gate Pass Approvals */}
        <div className="p-6 sm:p-7 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#00897B] flex items-center justify-center">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">Pending Gate Pass Approvals</h3>
                  <p className="text-xs text-slate-400">Live requests awaiting clearance</p>
                </div>
              </div>
              <Link to="/warden/passes" className="text-xs font-bold text-[#00897B] hover:underline">
                View All ({passes.length})
              </Link>
            </div>

            <div className="space-y-3.5">
              {pendingPasses.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  ✨ Zero pending gate pass requests in queue!
                </div>
              ) : (
                pendingPasses.map((pass) => (
                  <div key={pass.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 hover:border-slate-300 transition">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-base font-extrabold text-slate-900">{pass.studentName} ({pass.rollNo})</h4>
                        <p className="text-xs font-semibold text-[#00897B] mt-0.5">Room {pass.room} • {pass.type}</p>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                          <strong className="text-slate-800 font-semibold">Dest:</strong> {pass.destination} | <strong className="text-slate-800 font-semibold">Reason:</strong> {pass.reason}
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg">{pass.id}</span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-xs text-slate-500">
                        Parent: <strong className="text-slate-900 font-bold">{pass.parentPhone}</strong>
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePassAction(pass.id, 'REJECTED')}
                          className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-300 transition flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5 text-rose-500" />
                          <span>Reject</span>
                        </button>
                        <button
                          onClick={() => handlePassAction(pass.id, 'APPROVED')}
                          className="px-4 py-1.5 rounded-xl bg-[#00897B] hover:bg-[#00796B] text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & SMS</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Maintenance Complaints */}
        <div className="p-6 sm:p-7 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">Maintenance Dispatch</h3>
                  <p className="text-xs text-slate-400">Campus repair orders & technician tracking</p>
                </div>
              </div>
              <Link to="/warden/complaints" className="text-xs font-bold text-[#00897B] hover:underline">
                Manage SLA ({complaints.length})
              </Link>
            </div>

            <div className="space-y-3.5">
              {activeComplaints.slice(0, 3).map((comp) => (
                <div key={comp.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 hover:border-slate-300 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-slate-900">{comp.title}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      comp.urgency === 'URGENT' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      comp.urgency === 'HIGH' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                      'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {comp.urgency || 'MEDIUM'} PRIORITY
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Room {comp.room} • {comp.category}
                  </p>
                  {comp.description && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                      {comp.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span>Assigned: <strong className="text-slate-900 font-bold">{comp.assignedTo || 'Unassigned'}</strong></span>
                    <span className="text-amber-700 font-bold">{comp.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};