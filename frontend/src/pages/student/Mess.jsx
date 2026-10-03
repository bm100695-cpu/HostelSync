import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Utensils, 
  Star, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  MessageSquareHeart,
  CalendarCheck
} from 'lucide-react';

export const StudentMess = () => {
  const [messData, setMessData] = useState(null);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [skipDays, setSkipDays] = useState(2);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const fetchMessData = async () => {
    try {
      const res = await api.getMessMenu();
      if (res?.success) setMessData(res.data);
    } catch (err) {
      console.error('Failed to fetch mess menu:', err);
    }
  };

  useEffect(() => {
    const todayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
    if (daysOfWeek.includes(todayName)) setSelectedDay(todayName);
    fetchMessData();
  }, []);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.submitMessFeedback({ rating, comment });
      if (res?.success) {
        setFeedbackSuccess(true);
        setComment('');
        await fetchMessData();
        setTimeout(() => setFeedbackSuccess(false), 4000);
      }
    } catch (err) {
      alert(err.message || 'Feedback failed');
    }
  };

  const currentMenu = messData?.weekDaySchedule?.[selectedDay];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mess & Dining Hub</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
              <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" /> Live Schedule
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Weekly meal schedule, daily food feedback, and sanctioned leave mess rebate calculation.
          </p>
        </div>

        {/* Meal Timings Pill */}
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 shadow-xs self-start sm:self-auto">
          <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Dinner Serving: <strong className="text-slate-900 font-semibold">07:45 - 09:45 PM</strong></span>
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {daysOfWeek.map((day) => {
          const isSelected = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* 4 Meals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Breakfast */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200 uppercase tracking-wider">
              Breakfast
            </span>
            <p className="text-xs font-semibold text-slate-700 mt-2.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> 07:30 AM - 09:30 AM
            </p>
            <p className="text-sm font-semibold text-slate-900 mt-2 leading-relaxed">
              {currentMenu?.breakfast || 'Masala Dosa, Sambar, Coconut Chutney, Tea'}
            </p>
          </div>
          <p className="text-[11px] text-slate-400 border-t border-slate-100 pt-2.5">
            Unlimited Filter Coffee / Milk
          </p>
        </div>

        {/* Lunch */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 uppercase tracking-wider">
              Lunch
            </span>
            <p className="text-xs font-semibold text-slate-700 mt-2.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> 12:30 PM - 02:30 PM
            </p>
            <p className="text-sm font-semibold text-slate-900 mt-2 leading-relaxed">
              {currentMenu?.lunch || 'Paneer Butter Masala, Dal Tadka, Jeera Rice, Phulka'}
            </p>
          </div>
          <p className="text-[11px] text-slate-400 border-t border-slate-100 pt-2.5">
            Fresh Salad & Boondi Raita
          </p>
        </div>

        {/* Snacks */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <span className="px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 text-[10px] font-bold border border-sky-200 uppercase tracking-wider">
              Evening Snacks
            </span>
            <p className="text-xs font-semibold text-slate-700 mt-2.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> 05:00 PM - 06:15 PM
            </p>
            <p className="text-sm font-semibold text-slate-900 mt-2 leading-relaxed">
              {currentMenu?.snacks || 'Veg Cutlet, Green Chutney, Masala Chai'}
            </p>
          </div>
          <p className="text-[11px] text-slate-400 border-t border-slate-100 pt-2.5">
            Adrak Chai & Biscuits
          </p>
        </div>

        {/* Dinner */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200 uppercase tracking-wider">
              Dinner
            </span>
            <p className="text-xs font-semibold text-slate-700 mt-2.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> 07:45 PM - 09:45 PM
            </p>
            <p className="text-sm font-semibold text-slate-900 mt-2 leading-relaxed">
              {currentMenu?.dinner || 'Kadhai Paneer / Chicken Dum, Roti, Gulab Jamun'}
            </p>
          </div>
          <p className="text-[11px] text-slate-400 border-t border-slate-100 pt-2.5">
            Includes Sweet Dish
          </p>
        </div>
      </div>

      {/* Feedback & Rebate Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Rating Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Today's Meal Feedback</h3>
              <p className="text-xs text-slate-500">Shared directly with the hostel mess committee</p>
            </div>
          </div>

          {feedbackSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Feedback submitted successfully. Thank you!</span>
            </div>
          )}

          <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-2">Food Quality Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 transition hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-3 font-bold text-slate-800 text-sm">{rating}.0 / 5.0</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Remarks or Suggestions</label>
              <textarea
                rows={3}
                required
                placeholder="Mention specific dishes or issues (e.g. rice quality, salt level)..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-slate-50 text-slate-800 p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition shadow-xs"
            >
              Submit Feedback
            </button>
          </form>
        </div>

        {/* Rebate Estimator Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Mess Rebate Estimator</h3>
              <p className="text-xs text-slate-500">Calculate refund for approved leave days</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-700 font-medium">Days away on leave:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSkipDays(Math.max(1, skipDays - 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold flex items-center justify-center transition"
                >
                  -
                </button>
                <span className="text-sm font-bold text-slate-900 w-8 text-center">{skipDays}</span>
                <button
                  type="button"
                  onClick={() => setSkipDays(skipDays + 1)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold flex items-center justify-center transition"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex justify-between items-baseline pt-3 border-t border-slate-200 text-xs">
              <span className="text-slate-600 font-medium">Estimated Mess Refund:</span>
              <span className="text-2xl font-extrabold text-emerald-600">₹{skipDays * 140}</span>
            </div>
            
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Deductions are automatically credited upon approval of your digital gate pass / leave application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};