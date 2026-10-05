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
          {/* Header text updated to dark gray */}
          <h1 className="text-2xl font-bold text-gray-900">Hostel Notices & WhatsApp Broadcast</h1>
          <p className="text-sm text-gray-500 mt-1">
            Publish circulars directly to student dashboards and dispatch WhatsApp alerts to parent groups.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Publish & WhatsApp Broadcast</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Notices List */}
      <div className="space-y-5">
        {notices.map((notice) => (
          <div key={notice.id} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            {/* Card background changed to solid white with light border */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Badges updated to standard light mode opacities */}
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold border border-emerald-100">
                  {notice.category}
                </span>
                {notice.urgency === 'URGENT' && (
                  <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-[11px] font-bold border border-rose-100">
                    URGENT
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-400 font-medium">{notice.date}</span>
            </div>

            <div>
              {/* Title updated to dark gray, content to medium gray */}
              <h3 className="text-lg font-bold text-gray-900 mb-2">{notice.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{notice.content}</p>
            </div>

            <div className="pt-4 mt-2 text-xs text-gray-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-gray-100">
              <span>Author: <strong className="text-gray-900">{notice.author}</strong></span>
              <span className="text-emerald-500 font-medium flex items-center gap-1">
                ✓ WhatsApp Parent Broadcast Synced
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal - Updated to Light Mode */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-xl bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-gray-900">Create Official Announcement</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-sm">
              <div>
                <label className="block text-gray-700 font-bold mb-1.5">Notice Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Campus Curfew Extension for Tech Fest"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-1.5">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                  >
                    <option value="General">General</option>
                    <option value="Events">Events & Cultural</option>
                    <option value="Maintenance">Maintenance Advisory</option>
                    <option value="Rules">Disciplinary & Rules</option>
                    <option value="Mess">Mess Committee</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1.5">Priority</label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                    className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent / Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1.5">Notice Content</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Type the full announcement message..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                <input
                  type="checkbox"
                  id="waCheck"
                  checked={formData.broadcastWhatsApp}
                  onChange={(e) => setFormData({ ...formData, broadcastWhatsApp: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 border-gray-300"
                />
                <label htmlFor="waCheck" className="text-gray-700 font-medium cursor-pointer text-xs">
                  Trigger automated WhatsApp notification to registered parents
                </label>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20 transition disabled:opacity-70"
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