import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { QRModal } from '../../components/common/QRModal';
import { 
  QrCode, 
  Plus, 
  Clock 
} from 'lucide-react';

export const StudentGatePass = () => {
  const [passes, setPasses] = useState([]);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedPass, setSelectedPass] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    type: 'Local Outing',
    destination: '',
    reason: '',
    outTime: '',
    expectedInTime: ''
  });

  const fetchPasses = async () => {
    try {
      const res = await api.getPasses();
      if (res.success) setPasses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPasses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.createPass(formData);
      if (res.success) {
        setShowApplyModal(false);
        setFormData({
          type: 'Local Outing',
          destination: '',
          reason: '',
          outTime: '',
          expectedInTime: ''
        });
        await fetchPasses();
      }
    } catch (err) {
      alert(err.message || 'Failed to apply for pass');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CHECKED_OUT':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CHECKED_IN':
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
          <h1 className="text-2xl font-bold text-gray-900">Gate Passes</h1>
          <p className="text-sm text-gray-500 mt-1">
            Apply for hostel outing passes and manage active requests.
          </p>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Pass Request
        </button>
      </div>

      {/* Pass Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {passes.map((pass) => {
          const isApproved = pass.status === 'APPROVED' || pass.status === 'CHECKED_OUT';
          
          return (
            <div
              key={pass.id}
              className={`bg-white p-4 rounded border ${
                isApproved ? 'border-green-300' : 'border-gray-200'
              } shadow-sm flex flex-col justify-between`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-500">#{pass.id}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusStyles(pass.status)}`}>
                    {pass.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900">{pass.type}</h3>
                  <p className="text-xs text-gray-700 font-medium mt-0.5">{pass.destination}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{pass.reason}</p>
                </div>

                <div className="p-3 rounded bg-gray-50 border border-gray-200 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Out Time:</span>
                    <span className="text-gray-900 font-medium">
                      {pass.outTime ? new Date(pass.outTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'ASAP'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Expected Return:</span>
                    <span className="text-gray-900 font-medium">
                      {pass.expectedInTime ? new Date(pass.expectedInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'By Curfew'}
                    </span>
                  </div>
                </div>

                {pass.wardenRemark && (
                  <p className="text-xs text-gray-700 italic bg-gray-100 p-2 rounded border border-gray-200">
                    Warden: "{pass.wardenRemark}"
                  </p>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                {isApproved ? (
                  <button
                    onClick={() => setSelectedPass(pass)}
                    className="w-full py-2 rounded bg-green-600 hover:bg-green-700 text-white font-medium text-sm transition flex items-center justify-center gap-2"
                  >
                    <QrCode className="w-4 h-4" />
                    Open QR Pass
                  </button>
                ) : pass.status === 'PENDING' ? (
                  <div className="flex items-center justify-center gap-1.5 text-xs text-yellow-600 font-medium py-2">
                    <Clock className="w-4 h-4" />
                    Awaiting Approval
                  </div>
                ) : (
                  <div className="text-center text-xs text-gray-500 font-medium py-2">
                    Request Closed
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
        {passes.length === 0 && (
          <div className="col-span-full p-8 text-center text-gray-500 bg-white border border-gray-200 rounded">
            No gate passes found. Click "New Pass Request" to apply.
          </div>
        )}
      </div>

      {/* Apply Gate Pass Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-white rounded border border-gray-300 p-6 shadow-lg">
            
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
              <h3 className="text-lg font-bold text-gray-900">Apply for Gate Pass</h3>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-gray-400 hover:text-red-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 font-medium mb-1">Pass Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Local Outing">Local Outing (City / Mall)</option>
                  <option value="Market">Market / Essentials</option>
                  <option value="Weekend Outing">Weekend Outing (Day Trip)</option>
                  <option value="Medical Emergency">Medical Emergency</option>
                  <option value="Academic Project">Academic Event</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 font-medium mb-1">Specific Destination</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Central Library, City Mall"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 font-medium mb-1">Reason for Visit</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Briefly state the reason..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 font-medium mb-1">Out Time</label>
                  <input
                    type="time"
                    required
                    value={formData.outTime}
                    onChange={(e) => setFormData({ ...formData, outTime: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 font-medium mb-1">Expected Return</label>
                  <input
                    type="time"
                    required
                    value={formData.expectedInTime}
                    onChange={(e) => setFormData({ ...formData, expectedInTime: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium border border-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dynamic QR Pass Modal */}
      {selectedPass && (
        <QRModal pass={selectedPass} onClose={() => setSelectedPass(null)} />
      )}
    </div>
  );
};