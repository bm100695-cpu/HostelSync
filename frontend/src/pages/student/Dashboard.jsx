import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { QRModal } from '../../components/common/QRModal';
import {
  QrCode,
  AlertCircle,
  UtensilsCrossed,
  CalendarCheck,
  ArrowRight,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Phone,
  Sparkles,
  Plus,
  Building
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [passes, setPasses] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [messMenu, setMessMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPassForQR, setSelectedPassForQR] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [passRes, compRes, messRes] = await Promise.all([
        api.getPasses(),
        api.getComplaints(),
        api.getMessMenu()
      ]);
      
      if (passRes.success) setPasses(passRes.data || []);
      if (compRes.success) setComplaints(compRes.data || []);
      if (messRes.success) setMessMenu(messRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-teal-200 border-t-[#00897B] rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500">Loading student workspace...</p>
        </div>
      </div>
    );
  }

  const activePass = passes.find(p => p.status === 'APPROVED' || p.status === 'CHECKED_OUT') || (passes.length > 0 ? passes[0] : null);
  const openComplaintsCount = complaints.filter(c => c.status !== 'RESOLVED' && c.status !== 'CLOSED').length;

  return (
    <div className="w-full space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-[#00897B] bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60">
              Student Portal
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-semibold text-slate-500">
              Roll No: {user?.rollNo || '21BCE1042'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome, {user?.name || 'Aarav Sharma'}
          </h2>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
            <Building className="w-4 h-4 text-slate-400" />
            <span>Room {user?.room || 'B-304'} · {user?.block || 'Block-B (Boys Hostel)'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            to="/student/gate-pass"
            className="flex-1 sm:flex-none justify-center bg-[#00897B] hover:bg-[#00796B] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-sm hover:shadow transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Apply Pass</span>
          </Link>
          <Link
            to="/student/complaints"
            className="flex-1 sm:flex-none justify-center bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 px-5 py-3 rounded-xl font-bold text-sm transition flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-slate-500" />
            <span>New Complaint</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Stat 1: Gate Pass */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gate Pass</span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
              {activePass ? (activePass.status === 'CHECKED_OUT' ? 'Out Campus' : 'Active') : 'None'}
            </h3>
            <span className="text-xs text-emerald-600 font-semibold mt-0.5 block">
              {activePass ? 'Verified digital pass' : 'Ready to request'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#00897B] flex items-center justify-center">
            <QrCode className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 2: Open Complaints */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Open Complaints</span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{openComplaintsCount}</h3>
            <span className="text-xs text-slate-500 font-medium mt-0.5 block">
              {openComplaintsCount > 0 ? 'Assigned to warden' : 'All resolved'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 3: Mess Rating */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mess Rating</span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">4.8 / 5.0</h3>
            <span className="text-xs text-slate-500 font-medium mt-0.5 block">Standard Full Board</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 4: Attendance */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attendance</span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">100%</h3>
            <span className="text-xs text-emerald-600 font-semibold mt-0.5 block">Night Roll Call OK</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CalendarCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main 2-Column Dashboard Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Current Gate Pass Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#00897B] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">Current Gate Pass</h3>
                  <p className="text-xs text-slate-400">Campus Entry & Exit Authorization</p>
                </div>
              </div>
              <Link
                to="/student/gate-pass"
                className="text-xs font-bold text-[#00897B] hover:underline flex items-center gap-1"
              >
                <span>Pass History</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {activePass ? (
              <div className="p-5 bg-gradient-to-br from-teal-50/50 via-white to-slate-50 rounded-2xl border border-teal-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-slate-900">
                      {activePass.type || 'Local Outing'}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                      {activePass.status || 'APPROVED'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>To: <strong>{activePass.destination || 'Central City Library & Medical Store'}</strong></span>
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Expected In: {activePass.expectedInTime ? new Date(activePass.expectedInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '08:30 PM'}</span>
                  </p>
                </div>

                <button
                  onClick={() => setSelectedPassForQR(activePass)}
                  className="px-5 py-2.5 bg-[#00897B] hover:bg-[#00796B] text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition flex items-center gap-2 shrink-0"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Show QR Code</span>
                </button>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <QrCode className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">No Active Gate Pass</p>
                <p className="text-xs text-slate-400 mt-1">Need to leave campus? Request a gate pass from your warden.</p>
                <Link
                  to="/student/gate-pass"
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00897B] text-white text-xs font-bold shadow-xs hover:bg-[#00796B] transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Apply Gate Pass</span>
                </Link>
              </div>
            )}
          </div>

          {/* Recent Complaints Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">Recent Complaints</h3>
                  <p className="text-xs text-slate-400">Hostel Maintenance & Room Issues</p>
                </div>
              </div>
              <Link
                to="/student/complaints"
                className="text-xs font-bold text-[#00897B] hover:underline flex items-center gap-1"
              >
                <span>View All ({complaints.length})</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {complaints.length > 0 ? (
                complaints.slice(0, 4).map((comp) => (
                  <div
                    key={comp.id}
                    className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition flex items-center justify-between gap-3"
                  >
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-slate-800 truncate">{comp.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{comp.category || 'Maintenance'} · Room {user?.room || 'B-304'}</p>
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                      comp.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : comp.status === 'IN_PROGRESS'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {comp.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-slate-400 text-xs">
                  No registered complaints. Everything looks good!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (1/3 width): Today's Mess Menu & Hostel Desk */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Today's Mess Menu Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">Today's Mess Menu</h3>
                  <p className="text-xs text-slate-400">Hostel Central Dining Hall</p>
                </div>
              </div>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800">Breakfast</span>
                  <span className="text-[11px] text-slate-400">07:30 - 09:30 AM</span>
                </div>
                <p className="text-slate-600">Masala Dosa, Sambar, Coconut Chutney, Tea / Coffee</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800">Lunch</span>
                  <span className="text-[11px] text-slate-400">12:30 - 02:30 PM</span>
                </div>
                <p className="text-slate-600">Paneer Butter Masala, Dal Tadka, Steam Rice, Hot Rotis, Salad</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800">Evening Snacks</span>
                  <span className="text-[11px] text-slate-400">05:00 - 06:15 PM</span>
                </div>
                <p className="text-slate-600">Crispy Veg Cutlet, Green Chutney, Special Masala Chai</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800">Dinner</span>
                  <span className="text-[11px] text-slate-400">08:00 - 09:45 PM</span>
                </div>
                <p className="text-slate-600">Kadhai Paneer, Jeera Rice, Tawa Roti, Gulab Jamun</p>
              </div>
            </div>

            <Link
              to="/student/mess"
              className="mt-4 w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <span>View Full Week Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Quick Help Desk Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
              <Phone className="w-4 h-4" />
              <span>Campus Emergency Desk</span>
            </div>
            <h4 className="font-extrabold text-base text-white">Need Quick Assistance?</h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between border-b border-white/10 pb-1.5">
                <span>Warden Office (Block B):</span>
                <span className="text-white font-mono font-bold">+91 94231 55667</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1.5">
                <span>North Gate Security:</span>
                <span className="text-white font-mono font-bold">Ext: 001</span>
              </div>
              <div className="flex justify-between">
                <span>Hostel Ambulance:</span>
                <span className="text-emerald-400 font-mono font-bold">108 / Ext: 911</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* QR Code Modal Popup */}
      {selectedPassForQR && (
        <QRModal
          pass={selectedPassForQR}
          onClose={() => setSelectedPassForQR(null)}
        />
      )}

    </div>
  );
};