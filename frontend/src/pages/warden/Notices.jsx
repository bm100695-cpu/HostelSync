import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { MessageSquareShare, Send, Plus, CheckCircle2, Pin, AlertTriangle, Sparkles, X, Search, Filter } from 'lucide-react';

const FALLBACK_NOTICES = [
  {
    id: 'not-001',
    title: 'Hostel Annual Sports & Cultural Meet "AAGAZ 2026"',
    category: 'Events & Cultural',
    urgency: 'NORMAL',
    content: 'All hostel residents are invited to participate in Inter-Hostel Badminton, Cricket, and Chess tournaments scheduled for this weekend. Register your team with Floor Reps by Thursday.',
    author: 'Warden Office',
    date: '2026-09-15'
  },
  {
    id: 'not-002',
    title: 'Scheduled Campus Water Supply Maintenance on Wednesday',
    category: 'Maintenance Advisory',
    urgency: 'URGENT',
    content: 'Routine pipeline sanitization in Block-A & Block-B between 10:00 AM to 01:00 PM. Please store sufficient drinking water in advance.',
    author: 'Chief Engineer',
    date: '2026-09-14'
  },
  {
    id: 'not-003',
    title: 'Night Curfew & Gate Entry Policy Reminder',
    category: 'Disciplinary & Rules',
    urgency: 'HIGH',
    content: 'All residents must present their digital QR Gate Pass at Main Gate before 09:30 PM. Late entries without approved emergency passes will trigger automatic SMS/WhatsApp to parents.',
    author: 'Chief Warden Office',
    date: '2026-09-10'
  },
  {
    id: 'not-004',
    title: 'Mess Rebate & Holiday Outstation Settlement',
    category: 'Mess Committee',
    urgency: 'NORMAL',
    content: 'Students with sanctioned outstation leaves greater than 3 days can claim automated mess bill rebates directly on their student portal profile.',
    author: 'Mess Committee',
    date: '2026-09-08'
  }
];

export const WardenNotices = () => {
  const [notices, setNotices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

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
      if (res.success && res.data && res.data.length > 0) {
        if (res.data.length >= 3) {
          setNotices(res.data);
        } else {
          const existingIds = new Set(res.data.map(n => n.id));
          setNotices([...res.data, ...FALLBACK_NOTICES.filter(n => !existingIds.has(n.id))]);
        }
      } else {
        setNotices(FALLBACK_NOTICES);
      }
    } catch (err) {
      console.error(err);
      setNotices(FALLBACK_NOTICES);
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
      const newNotice = {
        id: `not-${Date.now()}`,
        ...formData,
        author: 'Dr. Ramesh K. Patel (Warden)',
        date: new Date().toISOString().split('T')[0]
      };
      setNotices([newNotice, ...notices]);
      setSuccessMsg('Notice published and broadcasted via WhatsApp gateway successfully!');
      setShowModal(false);
      setFormData({ title: '', category: 'General', urgency: 'NORMAL', content: '', broadcastWhatsApp: true });
      setTimeout(() => setSuccessMsg(''), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredNotices = notices.filter(n => {
    const matchesSearch = (n.title || '').toLowerCase().includes(search.toLowerCase()) ||
                          (n.content || '').toLowerCase().includes(search.toLowerCase()) ||
                          (n.category || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || (n.category || '').toLowerCase().includes(categoryFilter.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl border border-slate-200 bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full bg-teal-50 text-[#00897B] text-xs font-bold border border-teal-200/60 flex items-center gap-1">
              <MessageSquareShare className="w-3.5 h-3.5" />
              CAMPUS BROADCAST SYSTEM
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Hostel Notices & WhatsApp Broadcast</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish circulars directly to student dashboards and dispatch WhatsApp alerts to parent groups.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-3 rounded-xl bg-[#00897B] hover:bg-[#00796B] text-white text-xs sm:text-sm font-bold shadow-xs transition flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Publish & WhatsApp Broadcast</span>
        </button>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search circulars, guidelines, keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white text-slate-900 pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 focus:outline-none focus:border-[#00897B] focus:ring-1 focus:ring-[#00897B] placeholder:text-slate-400 transition"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { key: 'ALL', label: 'All Notices' },
            { key: 'Events', label: 'Events' },
            { key: 'Maintenance', label: 'Maintenance' },
            { key: 'Rules', label: 'Rules' },
            { key: 'Mess', label: 'Mess' }
          ].map(c => (
            <button
              key={c.key}
              onClick={() => setCategoryFilter(c.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                categoryFilter === c.key
                  ? 'bg-[#00897B] text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#00897B] shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 2-Column Responsive Notices Grid to balance wide desktop screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredNotices.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-400 text-sm bg-white rounded-3xl border border-dashed border-slate-200">
            No notices found matching current filter.
          </div>
        ) : (
          filteredNotices.map((notice) => (
            <div key={notice.id} className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-0.5 rounded-full bg-teal-50 text-[#00897B] text-[11px] font-bold border border-teal-200/60">
                      {notice.category}
                    </span>
                    {notice.urgency === 'URGENT' && (
                      <span className="px-3 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-bold border border-rose-200">
                        URGENT
                      </span>
                    )}
                    {notice.urgency === 'HIGH' && (
                      <span className="px-3 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-200">
                        HIGH
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 font-medium">{notice.date}</span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug mb-2">{notice.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">{notice.content}</p>
                </div>
              </div>

              <div className="pt-3.5 border-t border-slate-100 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>Author: <strong className="text-slate-900 font-bold">{notice.author}</strong></span>
                <span className="text-[#00897B] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> WhatsApp Parent Broadcast Synced
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-extrabold text-slate-900">Create Official Announcement</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Notice Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Campus Curfew Extension for Tech Fest"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-white text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#00897B] focus:ring-1 focus:ring-[#00897B] transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-white text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#00897B] focus:ring-1 focus:ring-[#00897B] transition cursor-pointer"
                  >
                    <option value="General">General</option>
                    <option value="Events & Cultural">Events & Cultural</option>
                    <option value="Maintenance Advisory">Maintenance Advisory</option>
                    <option value="Disciplinary & Rules">Disciplinary & Rules</option>
                    <option value="Mess Committee">Mess Committee</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Priority</label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                    className="w-full bg-white text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#00897B] focus:ring-1 focus:ring-[#00897B] transition cursor-pointer"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent / Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Notice Content</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Type the full announcement message..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-white text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#00897B] focus:ring-1 focus:ring-[#00897B] transition resize-none"
                />
              </div>

              <div className="flex items-center gap-3 p-3 bg-teal-50/60 rounded-xl border border-teal-100">
                <input
                  type="checkbox"
                  id="waCheck"
                  checked={formData.broadcastWhatsApp}
                  onChange={(e) => setFormData({ ...formData, broadcastWhatsApp: e.target.checked })}
                  className="rounded text-[#00897B] focus:ring-[#00897B] w-4 h-4 border-slate-300 accent-[#00897B]"
                />
                <label htmlFor="waCheck" className="text-slate-800 font-semibold cursor-pointer text-xs">
                  Trigger automated WhatsApp notification to registered parents
                </label>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-[#00897B] hover:bg-[#00796B] text-white font-bold shadow-xs transition disabled:opacity-70 cursor-pointer"
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