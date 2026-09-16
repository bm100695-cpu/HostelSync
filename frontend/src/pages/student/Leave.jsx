import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { CalendarCheck, Plus, CheckCircle2, Clock, AlertCircle, MapPin, Phone, ShieldCheck } from 'lucide-react';

export const StudentLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
      if (res.success) setLeaves(res.data);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Hostel Leave Applications</h1>
          <p className="text-xs text-gray-400 mt-1">
            Apply for semester breaks, festival leaves, or home visits with parent verification.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Leave Cards Grid */}
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
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-400" />
                <span>{leave.destination}</span>
              </h3>
              <p className="text-xs text-gray-300 mt-1">{leave.reason}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-gray-800/40 border border-gray-700/50 text-xs">
              <div>
                <span className="text-[10px] text-gray-400 block">DATES</span>
                <span className="text-white font-medium">{leave.fromDate} → {leave.toDate}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">TOTAL DURATION</span>
                <span className="text-brand-400 font-bold">{leave.totalDays} Days</span>
              </div>
            </div>

            {leave.wardenRemarks && (
              <div className="p-2.5 rounded-xl bg-gray-800/30 text-xs text-gray-400">
                <span className="text-white font-semibold">Warden Remark:</span> {leave.wardenRemarks}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Apply Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg glass-card bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <h3 className="text-lg font-bold text-white">Apply for Multi-Day Leave</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">From Date</label>
                  <input
                    type="date"
                    required
                    value={formData.fromDate}
                    onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                    className="w-full bg-gray-800 text-white px-3.5 py-2.5 rounded-xl border border-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">To Date</label>
                  <input
                    type="date"
                    required
                    value={formData.toDate}
                    onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                    className="w-full bg-gray-800 text-white px-3.5 py-2.5 rounded-xl border border-gray-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Travel Destination / Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Hometown (Jaipur), Relative Residence (Delhi)"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full bg-gray-800 text-white px-3.5 py-2.5 rounded-xl border border-gray-700"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Reason for Leave</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Describe festival, family event, medical, or holiday reason..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full bg-gray-800 text-white px-3.5 py-2.5 rounded-xl border border-gray-700"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Parent / Emergency Contact Phone</label>
                <input
                  type="tel"
                  placeholder="+91 98765 00001"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  className="w-full bg-gray-800 text-white px-3.5 py-2.5 rounded-xl border border-gray-700"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold"
                >
                  {submitting ? 'Submitting...' : 'Submit Leave Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
