import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Pin, Calendar, User, Search, AlertCircle, FileText } from 'lucide-react';

export const StudentNotices = () => {
  const [notices, setNotices] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await api.getNotices();
        if (res?.success) setNotices(res.data || []);
      } catch (err) {
        console.error('Failed to load notices:', err);
      }
    };
    fetchNotices();
  }, []);

  const categories = ['ALL', 'EVENTS', 'MAINTENANCE', 'RULES', 'GENERAL'];

  const filteredNotices = notices.filter((n) => {
    const query = search.toLowerCase();
    const matchesSearch = 
      (n.title && n.title.toLowerCase().includes(query)) || 
      (n.content && n.content.toLowerCase().includes(query));
    const matchesFilter = filter === 'ALL' || n.category?.toUpperCase() === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Hostel Notice Board</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official hostel announcements, administration orders, and event circulars.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search notices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white text-slate-800 text-xs sm:text-sm pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
          />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {categories.map((cat) => {
          const active = filter === cat;
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition ${
                active
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat === 'ALL' ? 'All Notices' : cat.charAt(0) + cat.slice(1).toLowerCase()}
            </button>
          );
        })}
      </div>

      {/* Notices Feed */}
      <div className="space-y-4">
        {filteredNotices.length === 0 ? (
          <div className="p-12 rounded-2xl bg-white border border-dashed border-slate-300 text-center">
            <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No notices found</p>
            <p className="text-xs text-slate-500 mt-0.5">Try searching with different keywords or filters.</p>
          </div>
        ) : (
          filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className={`bg-white rounded-2xl p-5 sm:p-6 border transition shadow-xs ${
                notice.pinned
                  ? 'border-emerald-300 bg-emerald-50/20'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              {/* Notice Metadata Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-2.5">
                {notice.pinned && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                    <Pin className="w-3 h-3 text-emerald-700" /> Pinned
                  </span>
                )}
                
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                  {notice.category}
                </span>

                {notice.urgency === 'URGENT' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[11px] font-semibold border border-rose-200">
                    <AlertCircle className="w-3 h-3 text-rose-600" /> Urgent
                  </span>
                )}
              </div>

              {/* Title & Body */}
              <div className="space-y-1.5">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {notice.title || 'Official Circular'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {notice.content}
                </p>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Issued by:</span>
                  <strong className="text-slate-700 font-semibold">{notice.author || 'Hostel Administration'}</strong>
                </span>

                <span className="flex items-center gap-1.5 font-mono text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {notice.date}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};