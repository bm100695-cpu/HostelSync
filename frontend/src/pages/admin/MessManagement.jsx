import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Utensils, Edit3, CheckCircle2, Clock, Save, Star } from 'lucide-react';

export const AdminMessManagement = () => {
  const [messData, setMessData] = useState(null);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [editingSchedule, setEditingSchedule] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const fetchMess = async () => {
    try {
      const res = await api.getMessMenu();
      if (res.success) {
        setMessData(res.data);
        setEditingSchedule(res.data.weekDaySchedule || {});
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMess();
  }, []);

  const handleFieldChange = (mealType, value) => {
    setEditingSchedule(prev => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        [mealType]: value
      }
    }));
  };

  const handleSaveMenu = async () => {
    try {
      const res = await api.updateMessMenu({
        weekDaySchedule: editingSchedule,
        mealTimes: messData?.mealTimes
      });
      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err) {
      alert(err.message || 'Failed to update menu');
    }
  };

  const currentDayMenu = editingSchedule?.[selectedDay] || {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Campus Mess & Catering Management</h1>
          <p className="text-xs text-gray-400 mt-1">
            Configure weekly 4-course food items, monitor dining ratings, and manage vendor feedback.
          </p>
        </div>

        <button
          onClick={handleSaveMenu}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Weekly Schedule</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Weekly meal changes updated and synced across all student apps!</span>
        </div>
      )}

      {/* Day Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {daysOfWeek.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-150 ${
              selectedDay === day
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 scale-105'
                : 'bg-gray-900/80 text-gray-400 hover:text-white border border-gray-800'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Editable Meal Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="glass-card p-6 rounded-3xl border border-gray-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Breakfast (07:30 - 09:30 AM)</span>
            <Edit3 className="w-4 h-4 text-gray-500" />
          </div>
          <textarea
            rows={3}
            value={currentDayMenu.breakfast || ''}
            onChange={(e) => handleFieldChange('breakfast', e.target.value)}
            className="w-full bg-gray-800 text-white p-3 rounded-2xl border border-gray-700 text-xs focus:border-purple-500"
          />
        </div>

        <div className="glass-card p-6 rounded-3xl border border-gray-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Lunch (12:30 - 02:30 PM)</span>
            <Edit3 className="w-4 h-4 text-gray-500" />
          </div>
          <textarea
            rows={3}
            value={currentDayMenu.lunch || ''}
            onChange={(e) => handleFieldChange('lunch', e.target.value)}
            className="w-full bg-gray-800 text-white p-3 rounded-2xl border border-gray-700 text-xs focus:border-purple-500"
          />
        </div>

        <div className="glass-card p-6 rounded-3xl border border-gray-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Evening Snacks (05:00 - 06:15 PM)</span>
            <Edit3 className="w-4 h-4 text-gray-500" />
          </div>
          <textarea
            rows={3}
            value={currentDayMenu.snacks || ''}
            onChange={(e) => handleFieldChange('snacks', e.target.value)}
            className="w-full bg-gray-800 text-white p-3 rounded-2xl border border-gray-700 text-xs focus:border-purple-500"
          />
        </div>

        <div className="glass-card p-6 rounded-3xl border border-gray-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Royal Dinner (07:45 - 09:45 PM)</span>
            <Edit3 className="w-4 h-4 text-gray-500" />
          </div>
          <textarea
            rows={3}
            value={currentDayMenu.dinner || ''}
            onChange={(e) => handleFieldChange('dinner', e.target.value)}
            className="w-full bg-gray-800 text-white p-3 rounded-2xl border border-gray-700 text-xs focus:border-purple-500"
          />
        </div>
      </div>

      {/* Student Feedback Reviews */}
      <div className="glass-card p-6 rounded-3xl border border-gray-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>Recent Dining Ratings & Student Feedback</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(messData?.studentFeedback || []).map((fb) => (
            <div key={fb.id} className="p-3.5 rounded-2xl bg-gray-800/40 border border-gray-700/50 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{fb.studentName}</span>
                <span className="text-amber-400 font-bold">⭐ {fb.rating}.0 / 5.0</span>
              </div>
              <p className="text-gray-300 italic">"{fb.comment}"</p>
              <span className="text-[10px] text-gray-500 block">{fb.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
