import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Bell, Pin, Calendar, User, Search, Tag, AlertTriangle } from 'lucide-react';

export const StudentNotices = () => {
  const [notices, setNotices] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await api.getNotices();
        if (res.success) setNotices(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotices();
  }, []);

  const filteredNotices = notices.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'ALL' || n.category.toUpperCase() === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Hostel Notice Board</h1>
          <p className="text-xs text-gray-400 mt-1">
            Official announcements, maintenance advisories, and campus cultural circulars.
          </p>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search circulars..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900 text-white pl-9 pr-4 py-2 rounded-xl text-xs border border-gray-700 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {['ALL', 'EVENTS', 'MAINTENANCE', 'RULES', 'GENERAL'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-full font-semibold transition ${
              filter === cat
                ? 'bg-brand-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.map((notice) => (
          <div
            key={notice.id}
            className={`glass-card p-6 rounded-3xl border transition ${
              notice.pinned
                ? 'border-brand-500/40 bg-gradient-to-r from-brand-950/20 via-gray-900 to-gray-900'
                : 'border-gray-800'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {notice.pinned && (
                    <span className="px-2 py-0.5 rounded-md bg-brand-500/20 text-brand-400 text-[10px] font-bold border border-brand-500/30 flex items-center gap-1">
                      <Pin className="w-3 h-3" /> PINNED CIRCULAR
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-md bg-gray-800 text-gray-300 text-[10px] font-medium border border-gray-700">
                    {notice.category}
                  </span>
                  {notice.urgency === 'URGENT' && (
                    <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 text-[10px] font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> URGENT
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white">{notice.title}</h3>
                <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">{notice.content}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Issued by: <strong className="text-gray-300">{notice.author}</strong>
              </span>
              <span>{notice.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
