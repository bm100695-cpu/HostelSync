import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Sparkles, 
  Plus, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  Zap, 
  Droplet, 
  Wifi, 
  ShieldAlert,
  Bot
} from 'lucide-react';

export const StudentComplaints = () => {
  const [complaints, setComplaints] = useState([]);
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
      const res = await api.getComplaints();
      if (res.success) setComplaints(res.data);
    } catch (err) {
      console.error(err);
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
      if (res.success) {
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
      case 'electrical': return <Zap className="w-4 h-4 text-amber-400" />;
      case 'plumbing': return <Droplet className="w-4 h-4 text-blue-400" />;
      case 'wifi':
      case 'network': return <Wifi className="w-4 h-4 text-purple-400" />;
      default: return <Wrench className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Maintenance & Complaints</h1>
            <span className="px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 text-[10px] font-bold border border-brand-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI Triage Powered
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Submit room or floor issues. Gemini AI auto-determines severity and dispatches technicians.
          </p>
        </div>

        <button
          onClick={() => { setShowModal(true); setAiAnalysisResult(null); }}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>File AI Complaint</span>
        </button>
      </div>

      {/* AI Success Notification Pill */}
      {aiAnalysisResult && (
        <div className="p-4 rounded-2xl glass-card border border-brand-500/40 bg-gradient-to-r from-brand-950/30 via-gray-900 to-gray-900 flex items-start gap-3">
          <Bot className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-white flex items-center gap-2">
              Gemini AI Auto-Triage Result: <span className="text-brand-400">{aiAnalysisResult.urgency} Priority</span>
            </p>
            <p className="text-gray-300">{aiAnalysisResult.aiSummary}</p>
          </div>
        </div>
      )}

      {/* Complaint Tickets List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {complaints.map((comp) => (
          <div key={comp.id} className="glass-card p-6 rounded-3xl border border-gray-800 space-y-4 hover:border-gray-700 transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getCategoryIcon(comp.category)}
                <span className="text-xs font-bold text-gray-300">{comp.category}</span>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                  comp.status === 'RESOLVED'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : comp.status === 'IN_PROGRESS'
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}
              >
                {comp.status}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{comp.title}</h3>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">{comp.description}</p>
            </div>

            {/* AI Summary Banner */}
            {comp.aiSummary && (
              <div className="p-3 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-[10.5px]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI TRIAGE ANALYSIS</span>
                </div>
                <p className="text-gray-300 text-[11px]">{comp.aiSummary}</p>
              </div>
            )}

            <div className="flex items-center justify-between text-xs pt-3 border-t border-gray-800 text-gray-400">
              <span>Assigned: <strong className="text-gray-200">{comp.assignedTo}</strong></span>
              <span>{new Date(comp.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* File Complaint Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg glass-card bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Submit Maintenance Issue</h3>
                  <p className="text-xs text-gray-400">Gemini AI will automatically predict severity</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Issue Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-gray-800 text-white px-3.5 py-2.5 rounded-xl border border-gray-700"
                >
                  <option value="Electrical">Electrical (Fan, Light, Switch, Power Socket)</option>
                  <option value="Plumbing">Plumbing (Tap Leak, Flush, Drainage, Geyser)</option>
                  <option value="Carpentry">Carpentry (Door, Bed, Lock, Cupboard)</option>
                  <option value="WiFi / LAN">WiFi & Internet Network Connectivity</option>
                  <option value="Housekeeping">Housekeeping & Sanitization</option>
                  <option value="Mess / Food">Mess & Water Cooler Hygiene</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Problem Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Washbasin faucet leaking water continuously"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-gray-800 text-white px-3.5 py-2.5 rounded-xl border border-gray-700"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Detailed Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain when it started and how severe it is..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{submitting ? 'Analyzing with AI...' : 'Submit & AI Triage'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
