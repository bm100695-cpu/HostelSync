import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { QRModal } from '../../components/common/QRModal';
import { 
  QrCode, 
  Utensils, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  PlusCircle,
  ChevronRight
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
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Hostel Active Resident
              </span>
              <span className="text-xs text-slate-500">• Room {user?.room || 'B-304'} ({user?.block || 'Block-B'})</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-xs md:text-sm text-slate-600 max-w-xl leading-relaxed">
              Curfew tonight is at <span className="text-slate-900 font-semibold">09:30 PM</span>. All passes must be scanned at Main Gate #1.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/student/gate-pass"
              className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-sm transition flex items-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              <span>Apply Gate Pass</span>
            </Link>
            <Link
              to="/student/complaints"
              className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-sm transition flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register Complaint</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Gate Pass Status</p>
            <div className="text-lg font-bold text-slate-800 mt-1">
              {activePass ? (
                <span className="text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Approved
                </span>
              ) : (
                <span className="text-slate-500">No Active Pass</span>
              )}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <QrCode className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Open Complaints</p>
            <p className="text-lg font-bold text-slate-800 mt-1">
              {complaints.filter(c => c.status !== 'RESOLVED' && c.status !== 'CLOSED').length} Active
            </p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Mess Rating</p>
            <p className="text-lg font-bold text-amber-600 mt-1">4.8 / 5.0 ⭐</p>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Utensils className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Roll Call Attendance</p>
            <p className="text-lg font-bold text-emerald-700 mt-1">100% Present</p>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Active Pass & Today's Mess Menu */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Pass Banner */}
          {activePass ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 inline-block">
                    READY AT GATE
                  </span>
                  <h3 className="text-lg font-bold text-slate-800">{activePass.type}</h3>
                  <p className="text-xs text-slate-600">
                    Destination: <span className="text-slate-900 font-semibold">{activePass.destination}</span>
                  </p>
                  <p className="text-xs text-emerald-700 font-medium">
                    Expected In: {new Date(activePass.expectedInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedPass(activePass)}
                  className="px-5 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-xs shadow-sm transition flex items-center gap-2 shrink-0"
                >
                  <QrCode className="w-5 h-5" />
                  <span>Show Gate QR Pass</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800">No active gate pass</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Planning an outing? Apply easily in 30 seconds.
                </p>
              </div>
              <Link
                to="/student/gate-pass"
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-medium transition"
              >
                Apply Now
              </Link>
            </div>
          )}

          {/* Recent Maintenance Complaints */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">Recent Complaints</h3>
              <Link to="/student/complaints" className="text-xs text-emerald-700 hover:underline flex items-center gap-1 font-medium">
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {complaints.length === 0 ? (
                <p className="text-xs text-slate-500">No recent complaints found.</p>
              ) : (
                complaints.slice(0, 3).map((comp) => (
                  <div key={comp.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">{comp.title}</span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          comp.urgency === 'URGENT' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                          comp.urgency === 'HIGH' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {comp.urgency}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-1">{comp.description}</p>
                      <p className="text-[11px] text-slate-500">Assigned: {comp.assignedTo || 'Unassigned'}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${
                      comp.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      comp.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {comp.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Today's Mess Menu Card */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-800">Weekly Menu ({todayName})</h3>
              </div>
              <span className="text-xs text-slate-500">{todayName}</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Breakfast (07:30 - 09:30 AM)
                </span>
                <p className="text-slate-800 font-medium">{todayMeals?.breakfast || 'Masala Dosa, Sambar, Tea'}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Lunch (12:30 - 02:30 PM)
                </span>
                <p className="text-slate-800 font-medium">{todayMeals?.lunch || 'Paneer Butter Masala, Dal, Rice, Roti'}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Snacks (05:00 - 06:15 PM)
                </span>
                <p className="text-slate-800 font-medium">{todayMeals?.snacks || 'Veg Cutlet, Masala Chai'}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Dinner (07:45 - 09:45 PM)
                </span>
                <p className="text-slate-800 font-medium">{todayMeals?.dinner || 'Kadhai Paneer / Chicken, Jeera Rice'}</p>
              </div>
            </div>

            <Link
              to="/student/mess"
              className="block text-center py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-300 transition"
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