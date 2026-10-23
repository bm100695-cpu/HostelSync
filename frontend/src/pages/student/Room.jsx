import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  Wrench,
  CheckCircle2,
  Building2,
  Layers,
  BedDouble,
  ShieldCheck,
  Phone,
  Mail,
  FileText,
  KeyRound,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentRoom = () => {
  const { user } = useAuth();
  const [roomData, setRoomData] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await api.getMyRoom();
        if (res?.success) setRoomData(res.data);
      } catch (err) {
        console.error('Failed to load room details:', err);
      }
    };
    fetchRoom();
  }, []);

  const occupantsList = roomData?.occupants || [
    { id: 'usr-std-1', name: 'Aarav Sharma', rollNo: '21BCE1042', bed: 'Bed 1 (You)', branch: 'Computer Science & Engineering', phone: '+91 98765 43210' },
    { id: 'usr-std-3', name: 'Kunal Singhania', rollNo: '21BCE1099', bed: 'Bed 2', branch: 'Information Technology', phone: '+91 98111 22334' }
  ];

  return (
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-[#00897B] bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-[#00897B]" />
              Hostel Accommodation
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-semibold text-slate-500">
              Verified Resident Record
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Room & Roommates
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Room allocation details, verified roommates, and allocated inventory.
          </p>
        </div>

        <Link
          to="/student/complaints"
          className="bg-[#00897B] hover:bg-[#00796B] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-sm hover:shadow transition flex items-center gap-2 shrink-0 w-full sm:w-auto justify-center"
        >
          <Wrench className="w-4 h-4" />
          <span>Request Room Repair</span>
        </Link>
      </div>

      {/* Room Overview Card (Full Width) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              {roomData?.status || 'Occupied'}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
              {roomData?.type || 'Double Sharing Air-Cooled'}
            </span>
          </div>

          <div>
            <h2 className="text-3xl xl:text-4xl font-extrabold text-slate-900 tracking-tight">
              Room {roomData?.roomNo || user?.room || 'B-304'}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 mt-2.5">
              <span className="flex items-center gap-1.5 font-bold text-slate-700">
                <Building2 className="w-4 h-4 text-slate-400" />
                {roomData?.block || user?.block || 'Block-B (Boys Hostel)'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-bold text-slate-700">
                <Layers className="w-4 h-4 text-slate-400" />
                Floor {roomData?.floor || 3}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-bold text-[#00897B]">
                <BedDouble className="w-4 h-4 text-[#00897B]" />
                {roomData?.occupied || 2} / {roomData?.capacity || 2} Occupied
              </span>
            </div>
          </div>
        </div>

        {/* Room Amenities / Inventory */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 w-full lg:w-auto lg:min-w-[320px]">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Room Inventory & Amenities
          </span>
          <div className="grid grid-cols-2 gap-2.5 text-xs text-slate-800">
            {(roomData?.amenities || ['Attached Balcony', 'High Speed LAN', 'Study Tables (2)', 'Air Cooler', 'Geyser', 'Wardrobes (2)']).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00897B] shrink-0" />
                <span className="font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Roommates Directory Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#00897B]" />
            <span>Roommates Directory</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">Allocated for Academic Year 2026-27</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {occupantsList.map((mate, idx) => {
            const initials = mate.name
              ? mate.name.split(' ').map(n => n[0]).join('')
              : 'ST';

            return (
              <div key={mate.id || idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#00897B] text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-xs">
                        {initials}
                      </div>
                      <div>
                        <h4 className="text-base font-extrabold text-slate-900">{mate.name}</h4>
                        <p className="text-xs text-slate-500 font-mono font-semibold">{mate.rollNo}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500">{mate.branch || 'Computer Science & Engineering'}</p>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs flex justify-between items-center">
                    <span className="text-slate-500">Bed Allocation</span>
                    <span className="text-[#00897B] font-bold">{mate.bed}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{mate.phone || '+91 98765 00000'}</span>
                  </span>
                  <span className="text-emerald-600 font-bold">Active Resident</span>
                </div>
              </div>
            );
          })}

          {/* Third Card to fill space: Room Rules & Guidelines */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl text-white shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Hostel Code of Conduct</span>
              </div>
              <h4 className="text-base font-extrabold text-white">Room Guidelines</h4>
              <ul className="text-xs text-slate-300 space-y-2 mt-3 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-teal-400 font-bold">•</span>
                  <span>Quiet study hours observed from 10:30 PM to 06:00 AM daily.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-400 font-bold">•</span>
                  <span>Keep room keys safe. Report lock issues to warden office immediately.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-400 font-bold">•</span>
                  <span>Electrical appliances exceeding 500W must be pre-sanctioned.</span>
                </li>
              </ul>
            </div>
            <div className="pt-3 border-t border-white/10 text-xs text-slate-400 flex items-center justify-between">
              <span>Warden Office Extension:</span>
              <span className="text-white font-mono font-bold">Ext: 104</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};