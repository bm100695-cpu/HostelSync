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
  Flame,
  Phone,
  ShieldCheck,
  ChevronRight,
  X
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
      case 'electrical': return <Zap className="w-5 h-5 text-amber-600" />;
      case 'plumbing': return <Droplet className="w-5 h-5 text-blue-600" />;
      case 'wifi':
      case 'network':
      case 'wifi / lan': return <Wifi className="w-5 h-5 text-purple-600" />;
      default: return <Wrench className="w-5 h-5 text-[#00897B]" />;
    }
  };

  const getPriorityBadge = (urgency) => {
    const level = urgency?.toLowerCase();
    if (level === 'high' || level === 'critical') {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-rose-600" /> High Priority
        </span>
      );
    }
    if (level === 'medium') {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
          Medium Priority
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
        Standard Priority
      </span>
    );
  };

  const quickCategories = [
    { label: 'Electrical', desc: 'Fan, Light, Switch, Socket', icon: Zap, bg: 'bg-amber-50', text: 'text-amber-600' },
    { label: 'Plumbing', desc: 'Tap Leak, Flush, Geyser', icon: Droplet, bg: 'bg-blue-50', text: 'text-blue-600' },
    { label: 'WiFi / LAN', desc: 'No signal, Slow speed, Port', icon: Wifi, bg: 'bg-purple-50', text: 'text-purple-600' },
    { label: 'Carpentry', desc: 'Bed, Cupboard, Door lock', icon: Wrench, bg: 'bg-teal-50', text: 'text-[#00897B]' },
  ];

  const handleQuickCategoryClick = (catName) => {
    setFormData({
      ...formData,
      category: catName,
      title: `${catName} issue in room`
    });
    setShowModal(true);
  };

  const activeCount = complaints.filter(c => c.status !== 'RESOLVED' && c.status !== 'CLOSED').length;
  const resolvedCount = complaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length;

  return (
    <div className="w-full space-y-6">
      
      {/* Header Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-[#00897B] bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#00897B]" />
              AI Smart Triage
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-semibold text-slate-500">
              Hostel Facility Management
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Maintenance & Complaints
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Log room issues with automatic urgency triage and technician routing.
          </p>
        </div>

        <button
          onClick={() => { setShowModal(true); setAiAnalysisResult(null); }}
          className="bg-[#00897B] hover:bg-[#00796B] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-sm hover:shadow transition flex items-center gap-2 shrink-0 w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>New Complaint</span>
        </button>
      </div>

      {/* Instant AI Triage Feedback Banner */}
      {aiAnalysisResult && (
        <div className="p-5 rounded-2xl bg-teal-50/70 border border-teal-200/80 flex items-start gap-3.5 transition animate-in fade-in duration-200">
          <div className="p-2.5 rounded-xl bg-teal-100 text-[#00897B] shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-xs sm:text-sm space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900">Auto-Triage Complete</span>
              {getPriorityBadge(aiAnalysisResult.urgency)}
            </div>
            <p className="text-slate-600 leading-relaxed">{aiAnalysisResult.aiSummary}</p>
          </div>
        </div>
      )}

      {/* Quick Summary Counter */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Complaints</span>
            <p className="text-2xl xl:text-3xl font-extrabold text-slate-900 mt-1">
              {activeCount}
            </p>
            <span className="text-xs text-amber-600 font-semibold mt-0.5 block">Under technical repair</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resolved Issues</span>
            <p className="text-2xl xl:text-3xl font-extrabold text-[#00897B] mt-1">
              {resolvedCount}
            </p>
            <span className="text-xs text-emerald-600 font-semibold mt-0.5 block">Successfully fixed</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#00897B] flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Registered</span>
            <p className="text-2xl xl:text-3xl font-extrabold text-slate-700 mt-1">{complaints.length}</p>
            <span className="text-xs text-slate-500 font-medium mt-0.5 block">Recorded this semester</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Launch Issue Categories */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900">Quick Issue Categories</h3>
            <p className="text-xs text-slate-500">Tap any category to auto-populate complaint form</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickCategories.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickCategoryClick(item.label)}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-teal-50/50 border border-slate-200 hover:border-teal-200 transition-all text-left flex flex-col justify-between group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${item.bg} ${item.text} flex items-center justify-center shadow-2xs`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#00897B] group-hover:translate-x-0.5 transition" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-[#00897B] transition">{item.label}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area: Complaints Grid or Friendly State */}
      {loading ? (
        <div className="p-16 text-center text-sm text-slate-400">Loading complaints...</div>
      ) : complaints.length === 0 ? (
        /* Empty State with Maintenance Desk Contacts */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-10 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-teal-50 text-[#00897B] flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1.5 max-w-md">
              <h3 className="text-lg font-extrabold text-slate-900">No Active Maintenance Issues</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Everything in your room is clear. Tap <strong>New Complaint</strong> above if you face any issues with electricity, plumbing, or internet.
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="mt-2 px-5 py-2.5 rounded-xl bg-[#00897B] text-white text-xs sm:text-sm font-bold shadow-xs hover:bg-[#00796B] transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Report a Problem</span>
            </button>
          </div>

          <div className="lg:col-span-1 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
                <Wrench className="w-4 h-4" />
                <span>Hostel Maintenance SLA</span>
              </div>
              <h4 className="font-extrabold text-lg text-white">Average Resolution Times</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                All requests logged via HostelSync are tracked with time-bound SLA.
              </p>
            </div>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>⚡ Electrical & Switchboard:</span>
                <span className="text-emerald-400 font-bold">&lt; 2 Hours</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>💧 Plumbing & Tap Leak:</span>
                <span className="text-emerald-400 font-bold">&lt; 3 Hours</span>
              </div>
              <div className="flex justify-between">
                <span>📶 WiFi & Internet Hub:</span>
                <span className="text-teal-400 font-bold">&lt; 4 Hours</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Complaints Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {complaints.map((comp) => (
            <div 
              key={comp.id} 
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 hover:border-slate-300 hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-100">
                      {getCategoryIcon(comp.category)}
                    </div>
                    <span className="text-xs font-bold text-slate-700">{comp.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {comp.urgency && getPriorityBadge(comp.urgency)}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        comp.status === 'RESOLVED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : comp.status === 'IN_PROGRESS'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {comp.status || 'PENDING'}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{comp.title}</h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{comp.description}</p>
                </div>

                {comp.aiSummary && (
                  <div className="p-3.5 rounded-2xl bg-teal-50/50 border border-teal-100 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-[#00897B] font-bold text-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI SUMMARY</span>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed">{comp.aiSummary}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs pt-3.5 border-t border-slate-100 text-slate-500">
                <span>Assigned: <strong className="text-slate-800">{comp.assignedTo || 'Technician Desk'}</strong></span>
                <span>{new Date(comp.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* File Complaint Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#00897B] flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Report an Issue</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Auto-routes to the right maintenance technician</p>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-800 font-bold mb-1.5">Issue Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-white text-slate-800 px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#00897B] focus:ring-1 focus:ring-[#00897B]"
                >
                  <option value="Electrical">Electrical (Fan, Light, Switch, Socket)</option>
                  <option value="Plumbing">Plumbing (Tap Leak, Flush, Geyser)</option>
                  <option value="Carpentry">Carpentry (Door, Bed, Cupboard Lock)</option>
                  <option value="WiFi / LAN">WiFi & Internet Connectivity</option>
                  <option value="Housekeeping">Housekeeping & Cleaning</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1.5">Issue Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Washbasin faucet leaking water continuously"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-white text-slate-800 px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#00897B] focus:ring-1 focus:ring-[#00897B]"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1.5">Detailed Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain when it started and what is affected..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white text-slate-800 px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#00897B] focus:ring-1 focus:ring-[#00897B]"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 rounded-xl bg-[#00897B] hover:bg-[#00796B] disabled:opacity-50 text-white font-bold flex items-center justify-center gap-2 shadow-sm transition"
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