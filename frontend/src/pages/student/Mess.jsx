import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Utensils, 
  Star, 
  Calendar, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  Sparkles,
  MessageSquareHeart,
  TrendingUp
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
      if (res.success) setMessData(res.data);
    } catch (err) {
      console.error(err);
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
      if (res.success) {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Mess & Dining Hub</h1>
          <p className="text-xs text-gray-400 mt-1">
            Weekly 4-course food schedule, daily meal rating, dietary preferences & rebate estimator.
          </p>
        </div>

        {/* Meal Timings Card */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl glass-card border border-gray-800 text-xs text-gray-300">
          <Clock className="w-4 h-4 text-brand-400" />
          <span>Dinner Serving: <strong className="text-white">07:45 - 09:45 PM</strong></span>
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {daysOfWeek.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-150 ${
              selectedDay === day
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30 scale-105'
                : 'bg-gray-900/80 text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Today's 4 Meals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-5 rounded-3xl border border-gray-800 flex flex-col justify-between space-y-3">
          <div>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/20">
              BREAKFAST
            </span>
            <h3 className="text-sm font-bold text-white mt-3">07:30 AM - 09:30 AM</h3>
            <p className="text-xs text-gray-300 mt-2 leading-relaxed">
              {currentMenu?.breakfast || 'Masala Dosa, Sambar, Coconut Chutney, Tea'}
            </p>
          </div>
          <span className="text-[10px] text-gray-500">Unlimited Filter Coffee / Milk</span>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-gray-800 flex flex-col justify-between space-y-3">
          <div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
              LUNCH
            </span>
            <h3 className="text-sm font-bold text-white mt-3">12:30 PM - 02:30 PM</h3>
            <p className="text-xs text-gray-300 mt-2 leading-relaxed">
              {currentMenu?.lunch || 'Paneer Butter Masala, Dal Tadka, Jeera Rice, Phulka'}
            </p>
          </div>
          <span className="text-[10px] text-gray-500">Fresh Salad & Boondi Raita</span>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-gray-800 flex flex-col justify-between space-y-3">
          <div>
            <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold border border-indigo-500/20">
              EVENING SNACKS
            </span>
            <h3 className="text-sm font-bold text-white mt-3">05:00 PM - 06:15 PM</h3>
            <p className="text-xs text-gray-300 mt-2 leading-relaxed">
              {currentMenu?.snacks || 'Veg Cutlet, Green Chutney, Masala Chai'}
            </p>
          </div>
          <span className="text-[10px] text-gray-500">Adrak Chai & Biscuits</span>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-gray-800 flex flex-col justify-between space-y-3">
          <div>
            <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-bold border border-purple-500/20">
              ROYAL DINNER
            </span>
            <h3 className="text-sm font-bold text-white mt-3">07:45 PM - 09:45 PM</h3>
            <p className="text-xs text-gray-300 mt-2 leading-relaxed">
              {currentMenu?.dinner || 'Kadhai Paneer / Chicken Dum, Roti, Gulab Jamun'}
            </p>
          </div>
          <span className="text-[10px] text-gray-500">Includes Special Sweet Dish</span>
        </div>
      </div>

      {/* Two Column: Meal Feedback & Skip Meal Rebate Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meal Rating & Feedback */}
        <div className="glass-card p-6 rounded-3xl border border-gray-800 space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquareHeart className="w-5 h-5 text-brand-400" />
            <h3 className="text-base font-bold text-white">Rate Today's Food Quality</h3>
          </div>
          <p className="text-xs text-gray-400">
            Hostel catering council reviews all ratings daily to maintain top culinary standards.
          </p>

          {feedbackSuccess && (
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Thank you! Your food review has been recorded.</span>
            </div>
          )}

          <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-300 font-semibold mb-2">Food Taste & Hygiene Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1.5 transition transform hover:scale-125"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 font-bold text-amber-400 text-sm">{rating}.0 / 5.0</span>
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Your Feedback / Suggestion</label>
              <textarea
                rows={2}
                required
                placeholder="What was great? Any suggestions for the chef?..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-gray-800 text-white px-3.5 py-2.5 rounded-xl border border-gray-700"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold transition shadow-lg shadow-brand-600/30"
            >
              Submit Food Rating
            </button>
          </form>
        </div>

        {/* Meal Skip Rebate Calculator */}
        <div className="glass-card p-6 rounded-3xl border border-gray-800 space-y-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Meal Skip Rebate Estimator</h3>
          </div>
          <p className="text-xs text-gray-400">
            Going home on sanctioned leave? HostelSync auto-credits ₹140/day to your hostel mess account.
          </p>

          <div className="p-4 rounded-2xl bg-gray-800/40 border border-gray-700/50 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-300">Days Away from Campus:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSkipDays(Math.max(1, skipDays - 1))}
                  className="w-7 h-7 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-bold"
                >
                  -
                </button>
                <span className="text-sm font-bold text-white w-6 text-center">{skipDays}</span>
                <button
                  type="button"
                  onClick={() => setSkipDays(skipDays + 1)}
                  className="w-7 h-7 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-700/60 text-xs">
              <span className="text-gray-400">Calculated Mess Refund:</span>
              <span className="text-xl font-extrabold text-emerald-400">₹{skipDays * 140}</span>
            </div>
            <p className="text-[10px] text-gray-500">
              *Automatic deduction applies directly to end-of-semester mess fee invoice upon approved leave slips.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
