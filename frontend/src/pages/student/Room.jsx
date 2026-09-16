import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Bed, 
  Users, 
  Wifi, 
  ShieldCheck, 
  Sparkles, 
  Phone, 
  Mail, 
  Wrench,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentRoom = () => {
  const { user } = useAuth();
  const [roomData, setRoomData] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await api.getMyRoom();
        if (res.success) setRoomData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRoom();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Room & Roommates</h1>
          <p className="text-xs text-gray-400 mt-1">
            Room allocation details, verified roommates, inventory checklist and amenities.
          </p>
        </div>

        <Link
          to="/student/complaints"
          className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold border border-gray-700 transition flex items-center gap-2"
        >
          <Wrench className="w-4 h-4 text-brand-400" />
          <span>Request Room Repair</span>
        </Link>
      </div>

      {/* Room Overview Card */}
      <div className="glass-card p-6 md:p-8 rounded-3xl border border-gray-800 bg-gradient-to-r from-gray-900 via-indigo-950/20 to-gray-900 flex flex-col md:flex-row justify-between gap-6">
        <div className="space-y-3">
          <span className="px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-bold border border-brand-500/20">
            {roomData?.status || 'Occupied'}
          </span>
          <h2 className="text-3xl font-extrabold text-white">
            Room {roomData?.roomNo || user?.room || 'B-304'}
          </h2>
          <p className="text-xs text-gray-300">
            {roomData?.block || user?.block || 'Block-B (Boys Hostel)'} • Floor {roomData?.floor || 3}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400 pt-2">
            <span>Type: <strong className="text-white">{roomData?.type || 'Double Sharing'}</strong></span>
            <span>Capacity: <strong className="text-emerald-400">{roomData?.occupied || 2} / {roomData?.capacity || 2} Occupied</strong></span>
          </div>
        </div>

        {/* Room Amenities List */}
        <div className="p-4 rounded-2xl bg-gray-800/50 border border-gray-700/50 space-y-2 min-w-[240px]">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Room Inventory & Amenities
          </span>
          <div className="space-y-1.5 text-xs text-gray-300">
            {(roomData?.amenities || ['Attached Balcony', 'High Speed LAN', 'Study Table', 'Air Cooler']).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Roommates Cards */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-brand-400" />
          <span>Roommates Directory</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(roomData?.occupants || [
            { id: 'usr-std-1', name: 'Aarav Sharma', rollNo: '21BCE1042', bed: 'Bed 1 (You)' },
            { id: 'usr-std-3', name: 'Kunal Singhania', rollNo: '21BCE1099', bed: 'Bed 2' }
          ]).map((mate, idx) => (
            <div key={idx} className="glass-card p-5 rounded-3xl border border-gray-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  {mate.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{mate.name}</h4>
                  <p className="text-[11px] text-brand-400 font-mono">{mate.rollNo}</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-gray-800/40 border border-gray-700/50 text-xs flex justify-between">
                <span className="text-gray-400">Bed Allocation:</span>
                <span className="text-white font-semibold">{mate.bed}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
