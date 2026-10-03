import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  Zap, 
  Droplet, 
  Wifi, 
  Inbox,
  AlertTriangle,
  Flame
} from 'lucide-react';

export const StudentComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Electrical',
    description: ''
  });

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await api.getComplaints();
      if (res?.success) setComplaints(res.data || []);
    } catch (err) {
      console.error('Failed to load complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.createComplaint(formData);
      if (res?.success) {
        setAiAnalysisResult(res.aiTriage);
        setShowModal(false);
        setFormData({ title: '', category: 'Electrical', description: '' });
        await fetchComplaints();
      }
    } catch (err) {
      alert(err.message || 'Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryIcon = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'electrical': return <Zap className="w-4 h-4 text-amber-600" />;
      case 'plumbing': return <Droplet className="w-4 h-4 text-blue-600" />;
      case 'wifi':
      case 'network': return <Wifi className="w-4 h-4 text-purple-600" />;
      default: return <Wrench className="w-4 h-4 text-emerald-600" />;
    }
  };

  const getPriorityBadge = (urgency) => {
    const level = urgency?.toLowerCase();
    if (level === 'high' || level === 'critical') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
          <Flame className="w-3 h-3 text-rose-600" /> High Priority
        </span>
      );
    }
    if (level === 'medium') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          Medium Priority
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-50 text-slate-600 border border-slate-200">
        Low Priority
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Maintenance & Complaints
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-medium border border-emerald-200">
              <Sparkles className="w-3 h-3 text-emerald-600" /> Smart Triage
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Log hostel maintenance requests. Issues are prioritized and routed to technicians automatically.
          </p>
        </div>

        <button
          onClick={() => { setShowModal(true); setAiAnalysisResult(null); }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-xs sm:text-sm font-semibold shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Complaint</span>
        </button>
      </div>

      {/* Instant AI Triage Feedback Banner */}
      {aiAnalysisResult && (
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3 transition">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-xs space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">Auto-Triage Complete</span>
              {getPriorityBadge(aiAnalysisResult.urgency)}
            </div>
            <p className="text-slate-600 leading-relaxed">{aiAnalysisResult.aiSummary}</p>
          </div>
        </div>
      )}

      {/* Quick Summary Counter */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/70 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Active Complaints</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {complaints.filter(c => c.status !== 'RESOLVED').length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/70 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Resolved Issues</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {complaints.filter(c => c.status === 'RESOLVED').length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/70 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Total Registered</span>
          <p className="text-2xl font-bold text-slate-700 mt-1">{complaints.length}</p>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="p-12 text-center text-sm text-slate-400">Loading complaints...</div>
      ) : complaints.length === 0 ? (
        /* Empty State */
        <div className="p-12 rounded-3xl bg-white border border-dashed border-slate-300 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
            <Inbox className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-slate-800">No active maintenance issues</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              Everything in your room is clear. Tap the button above if you face any issues with electricity, plumbing, or internet.
            </p>
          </div>
        </div>
      ) : (
        /* Complaints Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {complaints.map((comp) => (
            <div 
              key={comp.id} 
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 hover:border-slate-300 transition"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-100">
                    {getCategoryIcon(comp.category)}
                  </div>
                  <span className="text-xs font-semibold text-slate-700">{comp.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  {comp.urgency && getPriorityBadge(comp.urgency)}
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                      comp.status === 'RESOLVED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : comp.status === 'IN_PROGRESS'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {comp.status || 'PENDING'}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{comp.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{comp.description}</p>
              </div>

              {comp.aiSummary && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[10.5px]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI SUMMARY</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{comp.aiSummary}</p>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] pt-3 border-t border-slate-100 text-slate-500">
                <span>Assigned: <strong className="text-slate-800">{comp.assignedTo || 'Pending Triage'}</strong></span>
                <span>{new Date(comp.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* File Complaint Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Report an Issue</h3>
                  <p className="text-xs text-slate-500">Auto-routes to the right maintenance staff</p>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Issue Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-50 text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Electrical">Electrical (Fan, Light, Switch, Socket)</option>
                  <option value="Plumbing">Plumbing (Tap Leak, Flush, Geyser)</option>
                  <option value="Carpentry">Carpentry (Door, Bed, Cupboard Lock)</option>
                  <option value="WiFi / LAN">WiFi & Internet Connectivity</option>
                  <option value="Housekeeping">Housekeeping & Cleaning</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Issue Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Washbasin faucet leaking water continuously"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Detailed Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain when it started and what is affected..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold flex items-center justify-center gap-2 shadow-xs"
                >
                  {submitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Submit Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};