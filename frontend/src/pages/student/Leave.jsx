import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Plus, 
  MapPin, 
  X, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Phone, 
  FileText,
  AlertCircle
} from 'lucide-react';

export const StudentLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filterTab, setFilterTab] = useState('ALL');

  const [formData, setFormData] = useState({
    fromDate: '',
    toDate: '',
    destination: '',
    reason: '',
    emergencyContact: ''
  });

  const fetchLeaves = async () => {
    try {
      const res = await api.getLeaves();
      if (res.success) setLeaves(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.createLeave(formData);
      if (res.success) {
        setShowModal(false);
        setFormData({ fromDate: '', toDate: '', destination: '', reason: '', emergencyContact: '' });
        await fetchLeaves();
      }
    } catch (err) {
      alert(err.message || 'Failed to submit leave');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredLeaves = leaves.filter(leave => {
    if (filterTab === 'APPROVED') return leave.status === 'APPROVED';
    if (filterTab === 'PENDING') return leave.status === 'PENDING';
    if (filterTab === 'REJECTED') return leave.status === 'REJECTED';
    return true;
  });

  const approvedCount = leaves.filter(l => l.status === 'APPROVED').length;
  const pendingCount = leaves.filter(l => l.status === 'PENDING').length;
  const rejectedCount = leaves.filter(l => l.status === 'REJECTED').length;

  return (
    <div className="w-full space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-[#00897B] bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60">
              Extended Leave
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-semibold text-slate-500">
              Warden & Parent SMS Sync
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Leave Applications
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Apply for semester breaks, festival holidays, or emergency home visits.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-[#00897B] hover:bg-[#00796B] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-sm hover:shadow transition flex items-center gap-2 shrink-0 w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs">
        <button
          onClick={() => setFilterTab('ALL')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            filterTab === 'ALL'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span>All Applications</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] ${filterTab === 'ALL' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
            {leaves.length}
          </span>
        </button>

        <button
          onClick={() => setFilterTab('APPROVED')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            filterTab === 'APPROVED'
              ? 'bg-[#00897B] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span>Approved</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] ${filterTab === 'APPROVED' ? 'bg-[#00796B] text-white' : 'bg-teal-50 text-[#00897B]'}`}>
            {approvedCount}
          </span>
        </button>

        <button
          onClick={() => setFilterTab('PENDING')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            filterTab === 'PENDING'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span>Pending</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] ${filterTab === 'PENDING' ? 'bg-amber-700 text-white' : 'bg-amber-50 text-amber-700'}`}>
            {pendingCount}
          </span>
        </button>

        <button
          onClick={() => setFilterTab('REJECTED')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            filterTab === 'REJECTED'
              ? 'bg-rose-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span>Rejected</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] ${filterTab === 'REJECTED' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700'}`}>
            {rejectedCount}
          </span>
        </button>
      </div>

      {/* Leave Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
        {filteredLeaves.map((leave) => {
          const isApproved = leave.status === 'APPROVED';
          const isPending = leave.status === 'PENDING';
          
          return (
            <div
              key={leave.id}
              className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between shadow-xs hover:shadow-md ${
                isApproved
                  ? 'border-teal-200/90 ring-1 ring-teal-100/80 bg-gradient-to-b from-teal-50/20 to-white'
                  : isPending
                  ? 'border-amber-200/90 ring-1 ring-amber-100/80 bg-gradient-to-b from-amber-50/20 to-white'
                  : 'border-slate-200'
              }`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                    #{leave.id}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    isApproved
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : isPending
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {leave.status}
                  </span>
                </div>

                {/* Destination & Reason */}
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#00897B] shrink-0" />
                    <span>{leave.destination}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                    {leave.reason}
                  </p>
                </div>

                {/* Dates & Duration Box */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50/90 border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold block mb-1">Leave Window</span>
                    <span className="text-slate-800 font-bold leading-tight block">
                      {leave.fromDate} <br />
                      <span className="text-slate-500 font-normal">to</span> {leave.toDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block mb-1">Total Duration</span>
                    <span className="text-[#00897B] font-extrabold text-base block mt-0.5">
                      {leave.totalDays} Days
                    </span>
                  </div>
                </div>

                {/* Emergency Contact */}
                {leave.emergencyContact && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 px-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Emergency: <strong>{leave.emergencyContact}</strong></span>
                  </div>
                )}

                {/* Warden Remarks */}
                {leave.wardenRemarks && (
                  <div className="text-xs bg-teal-50/60 p-3 rounded-2xl border border-teal-100 text-slate-700 leading-relaxed">
                    <span className="font-bold text-[#00897B]">Warden Note: </span>
                    <span>"{leave.wardenRemarks}"</span>
                  </div>
                )}
              </div>

              {/* Status Note Footer */}
              <div className="mt-5 pt-4 border-t border-slate-100 text-center">
                {isApproved ? (
                  <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-700 font-bold py-2 bg-emerald-50 rounded-xl">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Approved · Parent SMS Notified</span>
                  </div>
                ) : isPending ? (
                  <div className="flex items-center justify-center gap-1.5 text-xs text-amber-700 font-bold py-2 bg-amber-50 rounded-xl">
                    <Clock className="w-4 h-4" />
                    <span>Review Pending with Warden</span>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 font-semibold py-2 bg-slate-50 rounded-xl">
                    Leave Application Rejected
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredLeaves.length === 0 && (
          <div className="col-span-full p-12 text-center text-slate-500 bg-white border border-dashed border-slate-300 rounded-3xl">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">No Leave Records Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              There are no leave requests under this filter. Click "Apply for Leave" to create a new application.
            </p>
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Apply for Leave</h3>
                <p className="text-xs text-slate-400 mt-0.5">Formal hostel leave approval request</p>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm text-slate-800 font-bold mb-1.5">From Date</label>
                  <input
                    type="date"
                    required
                    value={formData.fromDate}
                    onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00897B] focus:ring-1 focus:ring-[#00897B]"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm text-slate-800 font-bold mb-1.5">To Date</label>
                  <input
                    type="date"
                    required
                    value={formData.toDate}
                    onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00897B] focus:ring-1 focus:ring-[#00897B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-slate-800 font-bold mb-1.5">Destination Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Home (Flat 402, Green Park, Jaipur)"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00897B] focus:ring-1 focus:ring-[#00897B]"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-slate-800 font-bold mb-1.5">Reason for Leave</label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Attending sister's wedding / Diwali festival break"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00897B] focus:ring-1 focus:ring-[#00897B]"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-slate-800 font-bold mb-1.5">Emergency Parent Phone</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00897B] focus:ring-1 focus:ring-[#00897B]"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 rounded-xl bg-[#00897B] hover:bg-[#00796B] text-white text-sm font-bold shadow-sm transition disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};