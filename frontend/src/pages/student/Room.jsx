import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  Wrench,
  CheckCircle2,
  Building2,
  Layers,
  BedDouble
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
    { id: 'usr-std-1', name: 'Aarav Sharma', rollNo: '21BCE1042', bed: 'Bed 1 (You)' },
    { id: 'usr-std-3', name: 'Kunal Singhania', rollNo: '21BCE1099', bed: 'Bed 2' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Room & Roommates</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Room allocation details, verified roommates, and allocated inventory.
          </p>
        </div>

        <Link
          to="/student/complaints"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold border border-slate-200 shadow-xs transition"
        >
          <Wrench className="w-4 h-4 text-emerald-600" />
          <span>Request Room Repair</span>
        </Link>
      </div>

      {/* Room Overview Card */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
              {roomData?.status || 'Occupied'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
              {roomData?.type || 'Double Sharing'}
            </span>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Room {roomData?.roomNo || user?.room || 'B-304'}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <Building2 className="w-4 h-4 text-slate-400" />
                {roomData?.block || user?.block || 'Block-B (Boys Hostel)'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <Layers className="w-4 h-4 text-slate-400" />
                Floor {roomData?.floor || 3}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-medium text-emerald-700">
                <BedDouble className="w-4 h-4 text-emerald-600" />
                {roomData?.occupied || 2} / {roomData?.capacity || 2} Occupied
              </span>
            </div>
          </div>
        </div>

        {/* Room Amenities / Inventory */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2.5 min-w-[260px] self-start md:self-center">
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
            Room Inventory & Amenities
          </span>
          <div className="space-y-2 text-xs text-slate-700">
            {(roomData?.amenities || ['Attached Balcony', 'High Speed LAN', 'Study Tables (2)', 'Air Cooler']).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Roommates Directory */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-600" />
          <span>Roommates Directory</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {occupantsList.map((mate, idx) => {
            const initials = mate.name
              ? mate.name.split(' ').map(n => n[0]).join('')
              : 'ST';

            return (
              <div key={mate.id || idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                    {initials}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{mate.name}</h4>
                    <p className="text-xs text-slate-500 font-mono">{mate.rollNo}</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs flex justify-between items-center">
                  <span className="text-slate-500">Bed Allocation</span>
                  <span className="text-slate-900 font-semibold">{mate.bed}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};