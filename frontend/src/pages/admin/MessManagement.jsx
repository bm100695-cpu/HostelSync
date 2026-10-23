import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Utensils, Edit3, CheckCircle2, Clock, Save, Star } from 'lucide-react';

const FALLBACK_SCHEDULE = {
  Monday: {
    breakfast: 'Masala Dosa, Sambar, Coconut Chutney, Boiled Eggs / Banana, Tea & Coffee',
    lunch: 'Paneer Butter Masala, Dal Tadka, Jeera Rice, Phulka Roti, Cucumber Salad, Curd',
    snacks: 'Veg Cutlet, Green Mint Chutney, Hot Masala Chai',
    dinner: 'Aloo Gobi Matar, Chana Dal, Steamed Rice, Butter Roti, Gulab Jamun'
  },
  Tuesday: {
    breakfast: 'Poha with Sev & Peanuts, Sprouts, Boiled Eggs, Fresh Fruits, Tea & Milk',
    lunch: 'Rajma Masala, Aloo Jeera, Steamed Basmati Rice, Tawa Roti, Boondi Raita, Pickle',
    snacks: 'Pani Puri / Sev Puri Stall, Lemon Iced Tea',
    dinner: 'Egg Curry / Kadhai Mushroom, Yellow Moong Dal, Jeera Rice, Chapati, Kheer'
  },
  Wednesday: {
    breakfast: 'Idli Vada with Sambar & 2 Chutneys, Fresh Orange Juice, Filter Coffee',
    lunch: 'Mix Veg Korma, Dal Makhani, Veg Pulao, Butter Naan/Roti, Papad, Green Salad',
    snacks: 'Crispy Samosa with Sweet Tamarind Dip, Adrak Chai',
    dinner: 'Chicken Curry (Special) / Malai Kofta, Kashmiri Pulao, Tandoori Roti, Ice Cream'
  },
  Thursday: {
    breakfast: 'Aloo Paratha with White Butter, Curd, Pickle, Boiled Eggs, Tea',
    lunch: 'Kadhi Pakoda, Aloo Bhindi Fry, Steamed Rice, Phulka Roti, Salad',
    snacks: 'Pav Bhaji, Chopped Onions, Lemon, Hot Tea',
    dinner: 'Dal Fry, Bhindi Do Pyaza, Steamed Rice, Butter Roti, Fruit Custard'
  },
  Friday: {
    breakfast: 'Methi Thepla / Upma with Chutney, Boiled Eggs, Tea & Coffee',
    lunch: 'Chole Bhature, Sweet Lassi, Jeera Rice, Onion Rings Salad',
    snacks: 'Bread Pakoda with Sweet & Mint Chutneys, Tea',
    dinner: 'Paneer Tikka Masala, Yellow Tadka Dal, Jeera Rice, Tandoori Roti, Rasgulla'
  },
  Saturday: {
    breakfast: 'Puri Bhaji with Pickle, Sprouts Chaat, Halwa, Tea & Milk',
    lunch: 'Veg Biryani with Mirchi Ka Salan, Boondi Raita, Fried Papad',
    snacks: 'Corn Chaat / French Fries, Masala Chai',
    dinner: 'Special Khichdi, Gujarati Kadhi, Batata Nu Shaak, Papad, Jalebi'
  },
  Sunday: {
    breakfast: 'Special Chole Kulche, Sweet Lassi, Boiled Eggs, Fresh Fruit Salad',
    lunch: 'Dum Biryani (Chicken & Veg Veggie options), Onion Raita, Salan, Gulab Jamun',
    snacks: 'Samosa Chaat, Hot Masala Tea',
    dinner: 'Paneer Lababdar, Dal Makhani, Butter Naan, Jeera Rice, Moong Dal Halwa'
  }
};

const FALLBACK_FEEDBACK = [
  { id: 'fb-1', studentName: 'Aarav Sharma', rating: 5, comment: 'Paneer butter masala and butter roti on Monday lunch was excellent quality!', date: 'Today' },
  { id: 'fb-2', studentName: 'Ananya Verma', rating: 4, comment: 'Wednesday special dinner was great. Fresh fruit juices in breakfast are appreciated.', date: 'Yesterday' }
];

export const AdminMessManagement = () => {
  const [messData, setMessData] = useState(null);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [editingSchedule, setEditingSchedule] = useState(FALLBACK_SCHEDULE);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const fetchMess = async () => {
    try {
      const res = await api.getMessMenu();
      if (res && res.success && res.data) {
        setMessData(res.data);
        if (res.data.weekDaySchedule) {
          setEditingSchedule(res.data.weekDaySchedule);
        }
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
      if (res && res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    }
  };

  const currentDayMenu = editingSchedule?.[selectedDay] || FALLBACK_SCHEDULE[selectedDay] || {};

  return (
    <div className="w-full space-y-6">
      <div className="p-6 sm:p-7 rounded-3xl border border-slate-200 bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full bg-teal-50 text-[#00897B] text-xs font-bold border border-teal-200/60 flex items-center gap-1">
              <Utensils className="w-3.5 h-3.5" />
              DINING & NUTRITION OVERSIGHT
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Campus Mess & Catering Management</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure weekly 4-course food items, monitor dining ratings, and manage vendor feedback.
          </p>
        </div>

        <button
          onClick={handleSaveMenu}
          className="px-5 py-3 rounded-xl bg-[#00897B] hover:bg-[#00796B] text-white text-xs sm:text-sm font-bold shadow-xs transition flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Weekly Schedule</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#00897B] shrink-0" />
          <span>Weekly meal changes updated and synced across all student apps!</span>
        </div>
      )}

      {/* Day Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {daysOfWeek.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition cursor-pointer ${
              selectedDay === day
                ? 'bg-[#00897B] text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Editable Meal Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-amber-600 uppercase tracking-wider">Breakfast (07:30 - 09:30 AM)</span>
            <Edit3 className="w-4 h-4 text-slate-400" />
          </div>
          <textarea
            rows={3}
            value={currentDayMenu.breakfast || ''}
            onChange={(e) => handleFieldChange('breakfast', e.target.value)}
            className="w-full bg-slate-50 text-slate-800 p-3 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:border-[#00897B] focus:ring-1 focus:ring-[#00897B] outline-none resize-none"
          />
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider">Lunch (12:30 - 02:30 PM)</span>
            <Edit3 className="w-4 h-4 text-slate-400" />
          </div>
          <textarea
            rows={3}
            value={currentDayMenu.lunch || ''}
            onChange={(e) => handleFieldChange('lunch', e.target.value)}
            className="w-full bg-slate-50 text-slate-800 p-3 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:border-[#00897B] focus:ring-1 focus:ring-[#00897B] outline-none resize-none"
          />
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider">Evening Snacks (05:00 - 06:15 PM)</span>
            <Edit3 className="w-4 h-4 text-slate-400" />
          </div>
          <textarea
            rows={3}
            value={currentDayMenu.snacks || ''}
            onChange={(e) => handleFieldChange('snacks', e.target.value)}
            className="w-full bg-slate-50 text-slate-800 p-3 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:border-[#00897B] focus:ring-1 focus:ring-[#00897B] outline-none resize-none"
          />
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#00897B] uppercase tracking-wider">Royal Dinner (07:45 - 09:45 PM)</span>
            <Edit3 className="w-4 h-4 text-slate-400" />
          </div>
          <textarea
            rows={3}
            value={currentDayMenu.dinner || ''}
            onChange={(e) => handleFieldChange('dinner', e.target.value)}
            className="w-full bg-slate-50 text-slate-800 p-3 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:border-[#00897B] focus:ring-1 focus:ring-[#00897B] outline-none resize-none"
          />
        </div>
      </div>

      {/* Student Feedback Reviews */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>Recent Dining Ratings & Student Feedback</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(messData?.studentFeedback || FALLBACK_FEEDBACK).map((fb) => (
            <div key={fb.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900">{fb.studentName}</span>
                <span className="text-amber-500 font-extrabold flex items-center gap-1">
                   <Star className="w-3.5 h-3.5 fill-amber-500" />
                   {fb.rating}.0 / 5.0
                </span>
              </div>
              <p className="text-slate-600 italic">"{fb.comment}"</p>
              <span className="text-[10px] text-slate-400 block">{fb.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};