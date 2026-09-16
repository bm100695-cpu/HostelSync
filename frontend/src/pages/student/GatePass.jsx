import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { QRModal } from '../../components/common/QRModal';
import { 
  QrCode, 
  Plus, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Compass, 
  Calendar,
  Sparkles,
  ShieldCheck,
  Send
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Digital Gate Passes</h1>
          <p className="text-xs text-gray-400 mt-1">
            Apply for hostel outing passes, check status, and scan QR code at Main Gate.
          </p>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Gate Pass Request</span>
        </button>
      </div>

      {/* Pass Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {passes.map((pass) => {
          const isApproved = pass.status === 'APPROVED' || pass.status === 'CHECKED_OUT';
          return (
            <div
              key={pass.id}
              className={`glass-card p-5 rounded-3xl border transition flex flex-col justify-between ${
                isApproved
                  ? 'border-emerald-500/40 hover:border-emerald-400 bg-gradient-to-b from-emerald-950/20 via-gray-900 to-gray-900'
                  : pass.status === 'PENDING'
                  ? 'border-amber-500/30 bg-gray-900'
                  : 'border-gray-800 bg-gray-900'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-gray-400">#{pass.id}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                      pass.status === 'APPROVED'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : pass.status === 'CHECKED_OUT'
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        : pass.status === 'CHECKED_IN'
                        ? 'bg-gray-700/50 text-gray-300 border-gray-600'
                        : pass.status === 'REJECTED'
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {pass.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{pass.type}</h3>
                  <p className="text-xs text-brand-300 font-medium mt-0.5">{pass.destination}</p>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{pass.reason}</p>
                </div>

                <div className="p-3 rounded-2xl bg-gray-800/50 border border-gray-700/40 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Out Time:</span>
                    <span className="text-gray-200">
                      {pass.outTime ? new Date(pass.outTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'ASAP'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Expected Return:</span>
                    <span className="text-emerald-400 font-semibold">
                      {pass.expectedInTime ? new Date(pass.expectedInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'By Curfew'}
                    </span>
                  </div>
                </div>

                {pass.wardenRemark && (
                  <p className="text-[11px] text-gray-400 italic bg-gray-800/30 p-2 rounded-lg">
                    Warden: "{pass.wardenRemark}"
                  </p>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-gray-800">
                {isApproved ? (
                  <button
                    onClick={() => setSelectedPass(pass)}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition flex items-center justify-center gap-2"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Open Dynamic QR Pass</span>
                  </button>
                ) : pass.status === 'PENDING' ? (
                  <div className="flex items-center justify-center gap-1.5 text-xs text-amber-400 font-medium py-2">
                    <Clock className="w-4 h-4 animate-spin-slow" />
                    <span>Awaiting Warden Approval</span>
                  </div>
                ) : (
                  <div className="text-center text-xs text-gray-400 py-2">
                    Pass Completed
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Apply Gate Pass Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg glass-card bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-600/20 text-brand-400 flex items-center justify-center border border-brand-500/30">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Apply for Gate Pass</h3>
                  <p className="text-xs text-gray-400">Instant parent notification upon warden approval</p>
                </div>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Pass Category</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-gray-800 text-white px-3.5 py-2.5 rounded-xl border border-gray-700 focus:outline-none focus:border-brand-500"
                >
                  <option value="Local Outing">Local Outing (City / Mall / Books)</option>
                  <option value="Market Visit">Market Visit / Essentials (1-2 Hours)</option>
                  <option value="Weekend Outing">Weekend Outing (Day Trip)</option>
                  <option value="Medical Emergency">Medical Emergency / Clinic</option>
                  <option value="Academic Project">Academic / Hackathon Event</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Specific Destination</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Central Library, Phoenix Mall, Apollo Clinic"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full bg-gray-800 text-white px-3.5 py-2.5 rounded-xl border border-gray-700 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Reason for Visit</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Briefly state the reason for leaving campus..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full bg-gray-800 text-white px-3.5 py-2.5 rounded-xl border border-gray-700 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Out Time</label>
                  <input
                    type="time"
                    required
                    value={formData.outTime}
                    onChange={(e) => setFormData({ ...formData, outTime: e.target.value })}
                    className="w-full bg-gray-800 text-white px-3.5 py-2.5 rounded-xl border border-gray-700 focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Expected Return Time</label>
                  <input
                    type="time"
                    required
                    value={formData.expectedInTime}
                    onChange={(e) => setFormData({ ...formData, expectedInTime: e.target.value })}
                    className="w-full bg-gray-800 text-white px-3.5 py-2.5 rounded-xl border border-gray-700 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold transition shadow-lg shadow-brand-600/30"
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
