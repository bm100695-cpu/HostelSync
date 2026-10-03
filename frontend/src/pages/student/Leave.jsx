import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Plus, MapPin, X } from 'lucide-react';

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
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Hostel Leave Applications</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Apply for semester breaks, festival leaves, or home visits.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Leave Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {leaves.map((leave) => (
          <div key={leave.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-gray-500">#{leave.id}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                leave.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                leave.status === 'REJECTED' ? 'bg-red-50 text-red-700 border border-red-200' :
                'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {leave.status}
              </span>
            </div>

            <div>
              <div className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{leave.destination}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1 pl-5.5">{leave.reason}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100 text-xs">
              <div>
                <span className="text-[11px] font-medium text-gray-400 block uppercase">Dates</span>
                <span className="text-gray-800 font-medium">{leave.fromDate} → {leave.toDate}</span>
              </div>
              <div>
                <span className="text-[11px] font-medium text-gray-400 block uppercase">Duration</span>
                <span className="text-emerald-700 font-semibold">{leave.totalDays} Days</span>
              </div>
            </div>

            {leave.wardenRemarks && (
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 text-xs text-gray-600">
                <span className="font-semibold text-gray-800">Warden Remark:</span> {leave.wardenRemarks}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Apply Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-semibold text-gray-900">Apply for Leave</h3>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">From Date</label>
                  <input
                    type="date"
                    required
                    value={formData.fromDate}
                    onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                    className="w-full bg-white text-gray-900 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">To Date</label>
                  <input
                    type="date"
                    required
                    value={formData.toDate}
                    onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                    className="w-full bg-white text-gray-900 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Destination Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Home (Jaipur)"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full bg-white text-gray-900 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Reason for Leave</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Enter reason..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full bg-white text-gray-900 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Emergency Contact Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  className="w-full bg-white text-gray-900 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm transition disabled:opacity-50"
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