import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Utensils, 
  Star, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  MessageSquareHeart,
  CalendarCheck,
  Coffee,
  Sun,
  Sunset,
  Moon
} from 'lucide-react';

export const StudentMess = () => {
  const [messData, setMessData] = useState(null);
  const [selectedDay, setSelectedDay] = useState('Friday');
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
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-[#00897B] bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60 flex items-center gap-1">
              <CalendarCheck className="w-3.5 h-3.5 text-[#00897B]" />
              Live Central Mess Schedule
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-semibold text-slate-500">
              Standard Full Board
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Mess & Dining Hub
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Weekly meal schedule, daily food feedback, and sanctioned leave mess rebate calculation.
          </p>
        </div>

        {/* Meal Timings Pill */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 shadow-2xs self-start sm:self-auto">
          <Clock className="w-4 h-4 text-[#00897B] shrink-0" />
          <span>Dinner Serving: <strong className="text-slate-900 font-bold">07:45 - 09:45 PM</strong></span>
        </div>
      </div>

      {/* Day Selector Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto p-2 bg-white rounded-2xl border border-slate-200 shadow-2xs no-scrollbar">
        {daysOfWeek.map((day) => {
          const isSelected = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#00897B] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* 4 Meals Grid (fills the full width) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Breakfast */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200 uppercase tracking-wider flex items-center gap-1.5">
                <Coffee className="w-3.5 h-3.5" />
                Breakfast
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 mt-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> 07:30 AM - 09:30 AM
            </p>
            <p className="text-base font-bold text-slate-900 mt-2 leading-relaxed">
              {currentMenu?.breakfast || 'Masala Dosa, Sambar, Coconut Chutney, Tea'}
            </p>
          </div>
          <p className="text-xs text-slate-400 border-t border-slate-100 pt-3">
            Unlimited Filter Coffee & Fresh Milk
          </p>
        </div>

        {/* Lunch */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5" />
                Lunch
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 mt-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> 12:30 PM - 02:30 PM
            </p>
            <p className="text-base font-bold text-slate-900 mt-2 leading-relaxed">
              {currentMenu?.lunch || 'Paneer Butter Masala, Dal Tadka, Jeera Rice, Phulka'}
            </p>
          </div>
          <p className="text-xs text-slate-400 border-t border-slate-100 pt-3">
            Fresh Salad & Cucumber Boondi Raita
          </p>
        </div>

        {/* Evening Snacks */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold border border-sky-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sunset className="w-3.5 h-3.5" />
                Evening Snacks
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 mt-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> 05:00 PM - 06:15 PM
            </p>
            <p className="text-base font-bold text-slate-900 mt-2 leading-relaxed">
              {currentMenu?.snacks || 'Veg Cutlet, Green Chutney, Masala Chai'}
            </p>
          </div>
          <p className="text-xs text-slate-400 border-t border-slate-100 pt-3">
            Adrak Chai & Assorted Biscuits
          </p>
        </div>

        {/* Dinner */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-bold border border-violet-200 uppercase tracking-wider flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5" />
                Dinner
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 mt-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> 07:45 PM - 09:45 PM
            </p>
            <p className="text-base font-bold text-slate-900 mt-2 leading-relaxed">
              {currentMenu?.dinner || 'Kadhai Paneer / Chicken Dum, Roti, Gulab Jamun'}
            </p>
          </div>
          <p className="text-xs text-slate-400 border-t border-slate-100 pt-3">
            Includes Warm Sweet Dish
          </p>
        </div>
      </div>

      {/* Feedback & Rebate Section (stretches side-by-side full width) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Card */}
        <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-50 text-[#00897B] flex items-center justify-center">
              <MessageSquareHeart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Today's Meal Feedback</h3>
              <p className="text-xs text-slate-400">Shared directly with the hostel mess committee</p>
            </div>
          </div>

          {feedbackSuccess && (
            <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 text-xs sm:text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#00897B]" />
              <span>Feedback submitted successfully. Thank you!</span>
            </div>
          )}

          <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block text-slate-800 font-bold mb-2">Food Quality Rating</label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 transition hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-3 font-extrabold text-slate-900 text-base">{rating}.0 / 5.0</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-800 font-bold mb-1.5">Remarks or Suggestions</label>
              <textarea
                rows={3}
                required
                placeholder="Mention specific dishes or feedback (e.g., rice quality, salt level, rotis freshness)..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-white text-slate-800 p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#00897B] focus:ring-1 focus:ring-[#00897B] placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#00897B] hover:bg-[#00796B] text-white font-bold text-sm transition shadow-sm"
            >
              Submit Feedback
            </button>
          </form>
        </div>

        {/* Rebate Estimator Card */}
        <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-teal-50 text-[#00897B] flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Mess Rebate Estimator</h3>
                <p className="text-xs text-slate-400">Calculate automatic credit refund for approved leave days</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-5">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-700 font-bold">Days away on sanctioned leave:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSkipDays(Math.max(1, skipDays - 1))}
                    className="w-9 h-9 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold flex items-center justify-center transition"
                  >
                    -
                  </button>
                  <span className="text-base font-extrabold text-slate-900 w-10 text-center">{skipDays}</span>
                  <button
                    type="button"
                    onClick={() => setSkipDays(skipDays + 1)}
                    className="w-9 h-9 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold flex items-center justify-center transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-baseline pt-4 border-t border-slate-200 text-xs sm:text-sm">
                <span className="text-slate-600 font-bold">Estimated Mess Credit Refund:</span>
                <span className="text-3xl font-extrabold text-[#00897B]">₹{skipDays * 140}</span>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-slate-500 leading-relaxed bg-teal-50/50 p-3.5 rounded-2xl border border-teal-100 text-slate-600">
            ℹ️ Daily mess meal rate is ₹140. Deductions are automatically credited back to your college mess balance upon approval of your digital gate pass / leave application.
          </p>
        </div>
      </div>
    </div>
  );
};