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
          {/* Changed from text-white to text-gray-900 for light theme visibility */}
          <h1 className="text-2xl font-bold text-gray-900">Campus Mess & Catering Management</h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure weekly 4-course food items, monitor dining ratings, and manage vendor feedback.
          </p>
        </div>

        <button
          onClick={handleSaveMenu}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Weekly Schedule</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs flex items-center gap-2">
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
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-150 ${
              selectedDay === day
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-700 text-white hover:bg-slate-600' // Matches the dark slate buttons in the screenshot
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Editable Meal Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Breakfast (07:30 - 09:30 AM)</span>
            <Edit3 className="w-4 h-4 text-gray-400" />
          </div>
          <textarea
            rows={3}
            value={currentDayMenu.breakfast || ''}
            onChange={(e) => handleFieldChange('breakfast', e.target.value)}
            className="w-full bg-gray-50 text-gray-800 p-3 rounded-2xl border border-gray-200 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none"
          />
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Lunch (12:30 - 02:30 PM)</span>
            <Edit3 className="w-4 h-4 text-gray-400" />
          </div>
          <textarea
            rows={3}
            value={currentDayMenu.lunch || ''}
            onChange={(e) => handleFieldChange('lunch', e.target.value)}
            className="w-full bg-gray-50 text-gray-800 p-3 rounded-2xl border border-gray-200 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none"
          />
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Evening Snacks (05:00 - 06:15 PM)</span>
            <Edit3 className="w-4 h-4 text-gray-400" />
          </div>
          <textarea
            rows={3}
            value={currentDayMenu.snacks || ''}
            onChange={(e) => handleFieldChange('snacks', e.target.value)}
            className="w-full bg-gray-50 text-gray-800 p-3 rounded-2xl border border-gray-200 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none"
          />
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-500 uppercase tracking-wider">Royal Dinner (07:45 - 09:45 PM)</span>
            <Edit3 className="w-4 h-4 text-gray-400" />
          </div>
          <textarea
            rows={3}
            value={currentDayMenu.dinner || ''}
            onChange={(e) => handleFieldChange('dinner', e.target.value)}
            className="w-full bg-gray-50 text-gray-800 p-3 rounded-2xl border border-gray-200 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none"
          />
        </div>
      </div>

      {/* Student Feedback Reviews */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>Recent Dining Ratings & Student Feedback</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(messData?.studentFeedback || []).map((fb) => (
            <div key={fb.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">{fb.studentName}</span>
                <span className="text-amber-500 font-bold flex items-center gap-1">
                   <Star className="w-3 h-3 fill-amber-500" />
                   {fb.rating}.0 / 5.0
                </span>
              </div>
              <p className="text-gray-600 italic">"{fb.comment}"</p>
              <span className="text-[11px] text-gray-400 block">{fb.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};