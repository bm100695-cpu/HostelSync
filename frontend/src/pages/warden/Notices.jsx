import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { MessageSquareShare, Send, Plus, CheckCircle2, Pin, AlertTriangle, Sparkles } from 'lucide-react';

export const WardenNotices = () => {
  const [notices, setNotices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: 'General',
    urgency: 'NORMAL',
    content: '',
    broadcastWhatsApp: true
  });

  const fetchNotices = async () => {
    try {
      const res = await api.getNotices();
      if (res.success) setNotices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.createNotice(formData);
      if (res.success) {
        setSuccessMsg('Notice published and broadcasted via WhatsApp gateway successfully!');
        setShowModal(false);
        setFormData({ title: '', category: 'General', urgency: 'NORMAL', content: '', broadcastWhatsApp: true });
        await fetchNotices();
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      alert(err.message || 'Failed to post notice');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Hostel Notices & WhatsApp Broadcast</h1>
          <p className="text-xs text-gray-400 mt-1">
            Publish circulars directly to student dashboards and dispatch WhatsApp alerts to parent groups.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Publish & WhatsApp Broadcast</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Notices List */}
      <div className="space-y-4">
        {notices.map((notice) => (
          <div key={notice.id} className="glass-card p-6 rounded-3xl border border-gray-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  {notice.category}
                </span>
                {notice.urgency === 'URGENT' && (
                  <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 text-[10px] font-bold">
                    URGENT
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500">{notice.date}</span>
            </div>

            <h3 className="text-base font-bold text-white">{notice.title}</h3>
            <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">{notice.content}</p>

            <div className="pt-2 text-[11px] text-gray-500 flex items-center justify-between border-t border-gray-800">
              <span>Author: <strong className="text-gray-300">{notice.author}</strong></span>
              <span className="text-emerald-400">✓ WhatsApp Parent Broadcast Synced</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg glass-card bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <h3 className="text-lg font-bold text-white">Create Official Announcement</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Notice Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Campus Curfew Extension for Tech Fest"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-gray-800 text-white px-3.5 py-2.5 rounded-xl border border-gray-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-gray-800 text-white px-3.5 py-2.5 rounded-xl border border-gray-700"
                  >
                    <option value="General">General</option>
                    <option value="Events">Events & Cultural</option>
                    <option value="Maintenance">Maintenance Advisory</option>
                    <option value="Rules">Disciplinary & Rules</option>
                    <option value="Mess">Mess Committee</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Priority</label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                    className="w-full bg-gray-800 text-white px-3.5 py-2.5 rounded-xl border border-gray-700"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent / Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Notice Content</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Type the full announcement message..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-gray-800 text-white px-3.5 py-2.5 rounded-xl border border-gray-700"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="waCheck"
                  checked={formData.broadcastWhatsApp}
                  onChange={(e) => setFormData({ ...formData, broadcastWhatsApp: e.target.checked })}
                  className="rounded text-brand-500 focus:ring-brand-500 w-4 h-4 bg-gray-800 border-gray-700"
                />
                <label htmlFor="waCheck" className="text-gray-300 font-medium cursor-pointer">
                  Trigger automated WhatsApp notification to registered parents
                </label>
              </div>

              <div className="pt-3 flex gap-3">
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
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  {submitting ? 'Broadcasting...' : 'Publish & Broadcast'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
