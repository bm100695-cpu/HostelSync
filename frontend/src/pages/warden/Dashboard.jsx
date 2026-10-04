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
      {/* Clean Light Hero Warden Banner */}
      <div className="p-6 md:p-8 rounded-3xl border border-gray-200 bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold border border-green-200">
              CHIEF WARDEN PORTAL
            </span>
            <span className="text-xs text-gray-500">• {user?.block || 'Block-B & Central Campus'}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            Warden Control Center: {user?.name}
          </h1>
          <p className="text-xs text-gray-500">
            Real-time hostel oversight: Gate approvals, night roll call, maintenance dispatch & WhatsApp parent alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/warden/attendance"
            className="px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-2"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Conduct Night Roll Call</span>
          </Link>
          <Link
            to="/warden/notices"
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold border border-gray-300 shadow-sm transition flex items-center gap-2"
          >
            <MessageSquareShare className="w-4 h-4 text-green-600" />
            <span>Broadcast Notice</span>
          </Link>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-700 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Minimal KPI Stats (White Cards with Green Icons) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-gray-200 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Pending Gate Passes</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{pendingPasses.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-green-50 text-green-600 border border-green-100">
            <FileCheck2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-gray-200 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Pending Leave Slips</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{pendingLeaves.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-green-50 text-green-600 border border-green-100">
            <ClipboardList className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-gray-200 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Active Maintenance</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{activeComplaints.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-green-50 text-green-600 border border-green-100">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-gray-200 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Curfew Inflow</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">94% Inside</p>
          </div>
          <div className="p-3 rounded-xl bg-green-50 text-green-600 border border-green-100">
            <Shield className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Pending Gate Pass Approvals */}
        <div className="p-6 rounded-3xl border border-gray-200 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-green-600" />
              <h3 className="text-base font-bold text-gray-900">Pending Gate Pass Approvals</h3>
            </div>
            <Link to="/warden/passes" className="text-xs text-green-600 font-medium hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {pendingPasses.length === 0 ? (
              <p className="text-xs text-gray-500 py-4 text-center">
                ✨ Zero pending gate pass requests in queue!
              </p>
            ) : (
              pendingPasses.map((pass) => (
                <div key={pass.id} className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{pass.studentName} ({pass.rollNo})</h4>
                      <p className="text-xs text-gray-500 font-medium">Room {pass.room} • {pass.type}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        <strong className="text-gray-700">Dest:</strong> {pass.destination} | <strong className="text-gray-700">Reason:</strong> {pass.reason}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-gray-400">{pass.id}</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-[11px] text-gray-500">
                      Parent: <strong className="text-gray-900">{pass.parentPhone}</strong>
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePassAction(pass.id, 'REJECTED')}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold border border-gray-300 transition flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => handlePassAction(pass.id, 'APPROVED')}
                        className="px-3 py-1.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-1"
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

        {/* Right: Maintenance Complaints */}
        <div className="p-6 rounded-3xl border border-gray-200 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-green-600" />
              <h3 className="text-base font-bold text-gray-900">Maintenance Dispatch</h3>
            </div>
            <Link to="/warden/complaints" className="text-xs text-green-600 font-medium hover:underline">
              Manage SLA
            </Link>
          </div>

          <div className="space-y-3">
            {activeComplaints.slice(0, 3).map((comp) => (
              <div key={comp.id} className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900">{comp.title}</span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    comp.urgency === 'URGENT' ? 'bg-red-100 text-red-700' :
                    comp.urgency === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-50 text-blue-700'
                  }`}>
                    {comp.urgency} PRIORITY
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Room {comp.room} • {comp.category}
                </p>
                {comp.description && (
                  <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100 leading-relaxed">
                    {comp.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                  <span>Assigned: <strong className="text-gray-900">{comp.assignedTo}</strong></span>
                  <span className="text-gray-700 font-semibold">{comp.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};