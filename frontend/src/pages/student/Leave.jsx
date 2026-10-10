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

  const getStatusStyles = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Applications</h1>
          <p className="text-sm text-gray-500 mt-1">
            Apply for semester breaks, festival leaves, or home visits.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Apply for Leave
        </button>
      </div>

      {/* Leave Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {leaves.map((leave) => (
          <div key={leave.id} className="bg-white p-4 rounded border border-gray-200 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-gray-500">#{leave.id}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusStyles(leave.status)}`}>
                  {leave.status}
                </span>
              </div>

              <div className="text-sm font-bold text-gray-900 flex items-start gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>{leave.destination}</span>
              </div>
              <p className="text-xs text-gray-600 mt-2 pl-5">{leave.reason}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 rounded bg-gray-50 border border-gray-200 text-xs">
              <div>
                <span className="text-gray-500 block mb-1">Dates</span>
                <span className="text-gray-900 font-medium">{leave.fromDate} <br/> {leave.toDate}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Duration</span>
                <span className="text-gray-900 font-bold">{leave.totalDays} Days</span>
              </div>
            </div>

            {leave.wardenRemarks && (
              <div className="p-2 rounded bg-gray-100 border border-gray-200 text-xs text-gray-700 italic">
                <span className="font-semibold not-italic">Warden:</span> "{leave.wardenRemarks}"
              </div>
            )}
          </div>
        ))}
        
        {leaves.length === 0 && (
          <div className="col-span-full p-8 text-center text-gray-500 bg-white border border-gray-200 rounded">
            No leave records found. Click "Apply for Leave" to create one.
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-white rounded border border-gray-300 p-6 shadow-lg">
            
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
              <h3 className="text-lg font-bold text-gray-900">Apply for Leave</h3>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-gray-400 hover:text-red-600 font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 font-medium mb-1">From Date</label>
                  <input
                    type="date"
                    required
                    value={formData.fromDate}
                    onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 font-medium mb-1">To Date</label>
                  <input
                    type="date"
                    required
                    value={formData.toDate}
                    onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 font-medium mb-1">Destination Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Home (Jaipur)"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 font-medium mb-1">Reason for Leave</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Enter reason..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 font-medium mb-1">Emergency Contact</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium border border-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition disabled:opacity-50"
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