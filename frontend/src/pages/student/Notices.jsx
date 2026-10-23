import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Pin, Calendar, User, Search, AlertCircle, FileText, Bell, Sparkles } from 'lucide-react';

export const StudentNotices = () => {
  const [notices, setNotices] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  const defaultNotices = [
    {
      id: 'not-01',
      title: 'Upcoming Semester Break & Festival Outpass Guidelines',
      content: 'All residents planning to leave for Diwali / Mid-term break must submit their Leave Application at least 24 hours in advance. Gate pass verification requires parent WhatsApp SMS acknowledgment.',
      category: 'EVENTS',
      urgency: 'STANDARD',
      pinned: true,
      author: 'Office of Chief Warden',
      date: 'Oct 22, 2026'
    },
    {
      id: 'not-02',
      title: 'North Block Solar Geyser & Water Tank Maintenance Schedule',
      content: 'Routine cleaning and maintenance of overhead solar geysers will take place this Saturday between 10:00 AM and 01:00 PM. Hot water supply will resume normally by 02:00 PM.',
      category: 'MAINTENANCE',
      urgency: 'URGENT',
      pinned: true,
      author: 'Hostel Maintenance Supervisor',
      date: 'Oct 21, 2026'
    },
    {
      id: 'not-03',
      title: 'Night Attendance Roll-Call & Gate Curfew Timing Advisory',
      content: 'Strict compliance with hostel gate closure at 09:30 PM is required for all residents. Attendance is logged digitally by wardens during the 10:00 PM floor roll-call.',
      category: 'RULES',
      urgency: 'STANDARD',
      pinned: false,
      author: 'Dean of Student Affairs',
      date: 'Oct 19, 2026'
    },
    {
      id: 'not-04',
      title: 'Annual Inter-Hostel Badminton & Table Tennis Tournament',
      content: 'Registrations are now open for the Inter-Block Sports Trophy. Interested students can sign up at the Common Room desk or submit team entries before Wednesday.',
      category: 'EVENTS',
      urgency: 'STANDARD',
      pinned: false,
      author: 'Sports Secretary',
      date: 'Oct 18, 2026'
    }
  ];

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await api.getNotices();
        if (res?.success && res.data && res.data.length > 0) {
          setNotices(res.data);
        } else {
          setNotices(defaultNotices);
        }
      } catch (err) {
        setNotices(defaultNotices);
      }
    };
    fetchNotices();
  }, []);

  const categories = ['ALL', 'EVENTS', 'MAINTENANCE', 'RULES', 'GENERAL'];

  const displayList = notices.length > 0 ? notices : defaultNotices;

  const filteredNotices = displayList.filter((n) => {
    const query = search.toLowerCase();
    const matchesSearch = 
      (n.title && n.title.toLowerCase().includes(query)) || 
      (n.content && n.content.toLowerCase().includes(query));
    const matchesFilter = filter === 'ALL' || n.category?.toUpperCase() === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-full space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-[#00897B] bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60 flex items-center gap-1">
              <Bell className="w-3.5 h-3.5 text-[#00897B]" />
              Official Circulars
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-semibold text-slate-500">
              Campus Administration Desk
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Hostel Notice Board
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Official announcements, administration orders, maintenance notices, and event schedules.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search circulars..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 text-slate-800 text-sm pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#00897B] focus:ring-1 focus:ring-[#00897B] transition"
          />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto p-2 bg-white rounded-2xl border border-slate-200 shadow-2xs no-scrollbar">
        {categories.map((cat) => {
          const active = filter === cat;
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
                active
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat === 'ALL' ? 'All Notices' : cat.charAt(0) + cat.slice(1).toLowerCase()}
            </button>
          );
        })}
      </div>

      {/* Notices Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {filteredNotices.map((notice) => (
          <div
            key={notice.id}
            className={`bg-white rounded-3xl p-6 sm:p-7 border transition-all shadow-xs hover:shadow-md flex flex-col justify-between space-y-4 ${
              notice.pinned
                ? 'border-teal-200 bg-gradient-to-b from-teal-50/20 to-white ring-1 ring-teal-100/80'
                : 'border-slate-200'
            }`}
          >
            <div className="space-y-3">
              {/* Notice Metadata Badges */}
              <div className="flex flex-wrap items-center gap-2">
                {notice.pinned && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-teal-50 text-[#00897B] text-xs font-bold border border-teal-200">
                    <Pin className="w-3.5 h-3.5 text-[#00897B]" /> Pinned
                  </span>
                )}
                
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                  {notice.category}
                </span>

                {notice.urgency === 'URGENT' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> Urgent
                  </span>
                )}
              </div>

              {/* Title & Body */}
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                  {notice.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {notice.content}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Issued by:</span>
                <strong className="text-slate-800 font-bold">{notice.author || 'Hostel Administration'}</strong>
              </span>

              <span className="flex items-center gap-1.5 font-mono text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                {notice.date}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};