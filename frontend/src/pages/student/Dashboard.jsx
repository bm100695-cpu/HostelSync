import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { QRModal } from '../../components/common/QRModal';
import { 
  QrCode, 
  Calendar, 
  Utensils, 
  AlertCircle, 
  Clock, 
  ArrowUpRight, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [passes, setPasses] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [messMenu, setMessMenu] = useState(null);
  const [selectedPass, setSelectedPass] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [passRes, compRes, messRes] = await Promise.all([
          api.getPasses(),
          api.getComplaints(),
          api.getMessMenu()
        ]);
        if (passRes.success) setPasses(passRes.data);
        if (compRes.success) setComplaints(compRes.data);
        if (messRes.success) setMessMenu(messRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activePass = passes.find(p => p.status === 'APPROVED' || p.status === 'CHECKED_OUT');
  const todayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
  const todayMeals = messMenu?.weekDaySchedule?.[todayName] || messMenu?.weekDaySchedule?.['Monday'];

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-card bg-gradient-to-r from-gray-900 via-indigo-950/40 to-gray-900 border border-brand-500/20 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-400 text-xs font-semibold border border-brand-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
                Hostel Active Resident
              </span>
              <span className="text-xs text-gray-400">• Room {user?.room || 'B-304'} ({user?.block || 'Block-B'})</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-xs md:text-sm text-gray-300 max-w-xl leading-relaxed">
              Curfew tonight is at <span className="text-brand-400 font-semibold">09:30 PM</span>. All passes must be scanned at Main Gate #1.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/student/gate-pass"
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 transition flex items-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              <span>Apply Gate Pass</span>
            </Link>
            <Link
              to="/student/complaints"
              className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold border border-gray-700 transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span>AI Complaint</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Gate Pass Status</p>
            <p className="text-lg font-bold text-white mt-1">
              {activePass ? (
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Approved
                </span>
              ) : (
                <span className="text-gray-400">No Active Pass</span>
              )}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <QrCode className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Open Complaints</p>
            <p className="text-lg font-bold text-white mt-1">
              {complaints.filter(c => c.status !== 'RESOLVED' && c.status !== 'CLOSED').length} Active
            </p>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Mess Rating</p>
            <p className="text-lg font-bold text-amber-400 mt-1">4.8 / 5.0 ⭐</p>
          </div>
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Utensils className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Roll Call Attendance</p>
            <p className="text-lg font-bold text-emerald-400 mt-1">100% Present</p>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Active Pass & Today's Mess Menu */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Digital Pass & Recent Activities */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Pass Banner */}
          {activePass ? (
            <div className="glass-card p-6 rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/20 via-gray-900 to-gray-900 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                    🟢 READY AT GATE
                  </span>
                  <h3 className="text-lg font-bold text-white">{activePass.type}</h3>
                  <p className="text-xs text-gray-300">
                    Destination: <span className="text-white font-medium">{activePass.destination}</span>
                  </p>
                  <p className="text-xs text-emerald-300">
                    Expected In: {new Date(activePass.expectedInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedPass(activePass)}
                  className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-lg shadow-emerald-500/30 transition flex items-center gap-2 shrink-0"
                >
                  <QrCode className="w-5 h-5" />
                  <span>Show Gate QR Pass</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-card p-6 rounded-3xl border border-gray-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">No active gate pass</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Planning an outing? Apply easily in 30 seconds.
                </p>
              </div>
              <Link
                to="/student/gate-pass"
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition"
              >
                Apply Now
              </Link>
            </div>
          )}

          {/* Recent Maintenance Complaints */}
          <div className="glass-card p-6 rounded-3xl border border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">My Maintenance Requests</h3>
              <Link to="/student/complaints" className="text-xs text-brand-400 hover:underline flex items-center gap-1">
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {complaints.slice(0, 3).map((comp) => (
                <div key={comp.id} className="p-3.5 rounded-2xl bg-gray-800/40 border border-gray-700/60 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{comp.title}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        comp.urgency === 'URGENT' ? 'bg-rose-500/20 text-rose-400' :
                        comp.urgency === 'HIGH' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {comp.urgency}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-1">{comp.description}</p>
                    <p className="text-[11px] text-gray-500">Assigned: {comp.assignedTo}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${
                    comp.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                    comp.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                    'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    {comp.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Today's Mess Menu Card */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-gray-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Today's Mess Menu</h3>
              </div>
              <span className="text-xs text-gray-400">{todayName}</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-gray-800/40 border border-gray-700/50">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  Breakfast (07:30 - 09:30 AM)
                </span>
                <p className="text-gray-200">{todayMeals?.breakfast || 'Masala Dosa, Sambar, Tea'}</p>
              </div>

              <div className="p-3 rounded-xl bg-gray-800/40 border border-gray-700/50">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  Lunch (12:30 - 02:30 PM)
                </span>
                <p className="text-gray-200">{todayMeals?.lunch || 'Paneer Butter Masala, Dal, Rice, Roti'}</p>
              </div>

              <div className="p-3 rounded-xl bg-gray-800/40 border border-gray-700/50">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                  Snacks (05:00 - 06:15 PM)
                </span>
                <p className="text-gray-200">{todayMeals?.snacks || 'Veg Cutlet, Masala Chai'}</p>
              </div>

              <div className="p-3 rounded-xl bg-gray-800/40 border border-gray-700/50">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block mb-1">
                  Dinner (07:45 - 09:45 PM)
                </span>
                <p className="text-gray-200">{todayMeals?.dinner || 'Kadhai Paneer / Chicken, Jeera Rice'}</p>
              </div>
            </div>

            <Link
              to="/student/mess"
              className="block text-center py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold border border-gray-700 transition"
            >
              Full Weekly Menu & Feedback
            </Link>
          </div>
        </div>
      </div>

      {/* QR Modal when pass clicked */}
      {selectedPass && (
        <QRModal pass={selectedPass} onClose={() => setSelectedPass(null)} />
      )}
    </div>
  );
};
