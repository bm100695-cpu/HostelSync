import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { QRModal } from '../../components/common/QRModal';
import { 
  QrCode, 
  Plus, 
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Calendar,
  X,
  FileText,
  Filter
} from 'lucide-react';

export const StudentGatePass = () => {
  const [passes, setPasses] = useState([]);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedPass, setSelectedPass] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [filterTab, setFilterTab] = useState('ALL');
  
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
      if (res.success) setPasses(res.data || []);
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

  const filteredPasses = passes.filter(pass => {
    if (filterTab === 'ACTIVE') return pass.status === 'APPROVED' || pass.status === 'CHECKED_OUT';
    if (filterTab === 'PENDING') return pass.status === 'PENDING';
    if (filterTab === 'COMPLETED') return pass.status === 'CHECKED_IN' || pass.status === 'REJECTED';
    return true;
  });

  const activeCount = passes.filter(p => p.status === 'APPROVED' || p.status === 'CHECKED_OUT').length;
  const pendingCount = passes.filter(p => p.status === 'PENDING').length;
  const completedCount = passes.filter(p => p.status === 'CHECKED_IN' || p.status === 'REJECTED').length;

  return (
    <div className="w-full space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-[#00897B] bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60">
              Campus Movement Pass
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-semibold text-slate-500">
              Biometric & QR Verified
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Gate Passes
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Apply for hostel outing passes, check live warden approval, and show your gate entry QR pass.
          </p>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="bg-[#00897B] hover:bg-[#00796B] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-sm hover:shadow transition flex items-center gap-2 shrink-0 w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>New Pass Request</span>
        </button>
      </div>

      {/* Filter Tabs & Quick Metrics Bar */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs">
        <button
          onClick={() => setFilterTab('ALL')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            filterTab === 'ALL'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span>All Passes</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] ${filterTab === 'ALL' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
            {passes.length}
          </span>
        </button>

        <button
          onClick={() => setFilterTab('ACTIVE')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            filterTab === 'ACTIVE'
              ? 'bg-[#00897B] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span>Active & Approved</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] ${filterTab === 'ACTIVE' ? 'bg-[#00796B] text-white' : 'bg-teal-50 text-[#00897B]'}`}>
            {activeCount}
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
          onClick={() => setFilterTab('COMPLETED')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            filterTab === 'COMPLETED'
              ? 'bg-slate-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span>Past / Checked-In</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] ${filterTab === 'COMPLETED' ? 'bg-slate-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
            {completedCount}
          </span>
        </button>
      </div>

      {/* Pass Cards Grid (fills the whole page naturally) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
        {filteredPasses.map((pass) => {
          const isApproved = pass.status === 'APPROVED' || pass.status === 'CHECKED_OUT';
          const isPending = pass.status === 'PENDING';
          const isCheckedIn = pass.status === 'CHECKED_IN';
          
          return (
            <div
              key={pass.id}
              className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between shadow-xs hover:shadow-md ${
                isApproved 
                  ? 'border-teal-200/90 ring-1 ring-teal-100/80 bg-gradient-to-b from-teal-50/20 to-white' 
                  : isPending
                  ? 'border-amber-200/90 ring-1 ring-amber-100/80 bg-gradient-to-b from-amber-50/20 to-white'
                  : 'border-slate-200'
              }`}
            >
              <div className="space-y-4">
                {/* Card Top: Pass ID & Status Badge */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                    #{pass.id}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    isApproved
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : isPending
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : isCheckedIn
                      ? 'bg-slate-100 text-slate-600 border-slate-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {pass.status}
                  </span>
                </div>

                {/* Details */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#00897B] uppercase tracking-wider">
                      {pass.type}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{pass.destination}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                    {pass.reason}
                  </p>
                </div>

                {/* Timings Box */}
                <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-100 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> Out Time:
                    </span>
                    <span className="text-slate-800 font-bold">
                      {pass.outTime ? new Date(pass.outTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Immediate / ASAP'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> Expected Return:
                    </span>
                    <span className="text-slate-800 font-bold">
                      {pass.expectedInTime ? new Date(pass.expectedInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Before Curfew'}
                    </span>
                  </div>
                </div>

                {/* Warden Remark */}
                {pass.wardenRemark && (
                  <div className="text-xs bg-teal-50/60 p-3 rounded-2xl border border-teal-100 text-slate-700 leading-relaxed">
                    <span className="font-bold text-[#00897B]">Warden Note: </span>
                    <span>"{pass.wardenRemark}"</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                {isApproved ? (
                  <button
                    onClick={() => setSelectedPass(pass)}
                    className="w-full py-3 rounded-xl bg-[#00897B] hover:bg-[#00796B] text-white font-bold text-sm transition shadow-sm hover:shadow flex items-center justify-center gap-2"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Open QR Pass</span>
                  </button>
                ) : isPending ? (
                  <div className="flex items-center justify-center gap-2 text-xs text-amber-700 font-bold py-2.5 bg-amber-50 rounded-xl border border-amber-200/60">
                    <Clock className="w-4 h-4" />
                    <span>Awaiting Warden Approval</span>
                  </div>
                ) : (
                  <div className="text-center text-xs text-slate-400 font-semibold py-2.5 bg-slate-50 rounded-xl">
                    Request Completed & Closed
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
        {filteredPasses.length === 0 && (
          <div className="col-span-full p-12 text-center text-slate-500 bg-white border border-dashed border-slate-300 rounded-3xl">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">No Passes Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              There are no gate passes in this filter view. Click "New Pass Request" to submit an application.
            </p>
          </div>
        )}
      </div>

      {/* Apply Gate Pass Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Apply for Gate Pass</h3>
                <p className="text-xs text-slate-400 mt-0.5">Submit outpass request for warden approval</p>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm text-slate-800 font-bold mb-1.5">Pass Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00897B] focus:ring-1 focus:ring-[#00897B]"
                >
                  <option value="Local Outing">Local Outing (City / Mall / Market)</option>
                  <option value="Market">Market / Stationery / Essentials</option>
                  <option value="Weekend Outing">Weekend Outing (Day Trip)</option>
                  <option value="Medical Emergency">Medical Clinic / Pharmacy</option>
                  <option value="Academic Project">Academic Library / Project Meet</option>
                  <option value="Other">Other Personal Work</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-slate-800 font-bold mb-1.5">Destination</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Central Library, City Mall, Apollo Clinic"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00897B] focus:ring-1 focus:ring-[#00897B]"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-slate-800 font-bold mb-1.5">Reason for Visit</label>
                <textarea
                  required
                  rows={2}
                  placeholder="State the purpose of your visit briefly..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00897B] focus:ring-1 focus:ring-[#00897B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm text-slate-800 font-bold mb-1.5">Out Time</label>
                  <input
                    type="time"
                    required
                    value={formData.outTime}
                    onChange={(e) => setFormData({ ...formData, outTime: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00897B] focus:ring-1 focus:ring-[#00897B]"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm text-slate-800 font-bold mb-1.5">Expected Return</label>
                  <input
                    type="time"
                    required
                    value={formData.expectedInTime}
                    onChange={(e) => setFormData({ ...formData, expectedInTime: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00897B] focus:ring-1 focus:ring-[#00897B]"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 rounded-xl bg-[#00897B] hover:bg-[#00796B] text-white text-sm font-bold shadow-sm transition disabled:opacity-50"
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