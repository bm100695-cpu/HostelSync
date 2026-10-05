import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Bed, Users, Plus, CheckCircle2, UserCheck } from 'lucide-react';

export const AdminRoomAllocation = () => {
  const [rooms, setRooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchData = async () => {
    try {
      const [roomRes, userRes] = await Promise.all([
        api.getRooms(),
        api.getAdminUsers()
      ]);
      if (roomRes.success) setRooms(roomRes.data);
      if (userRes.success) setStudents(userRes.data.filter(u => u.role === 'student'));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAllocate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.allocateRoom(selectedStudent, selectedRoom);
      if (res.success) {
        setSuccessMsg(res.message);
        setShowAllocateModal(false);
        await fetchData();
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      alert(err.message || 'Allocation failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Room Allocation Matrix</h1>
          <p className="text-sm text-gray-500 mt-1">
            Visual bed allotment, vacancy tracking, and roommate assignment.
          </p>
        </div>

        <button
          onClick={() => setShowAllocateModal(true)}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold shadow-md shadow-purple-600/20 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Allocate Student Bed</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rooms.map((rm) => (
          <div key={rm.id} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">Room {rm.roomNo}</span>
              
              <span
                className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                  rm.occupied >= rm.capacity
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : rm.occupied === 0
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                    : 'bg-amber-50 text-amber-600 border-amber-200'
                }`}
              >
                {rm.status} ({rm.occupied}/{rm.capacity})
              </span>
            </div>

            <p className="text-sm text-gray-600">{rm.block} • Floor {rm.floor} • {rm.type}</p>

            <div className="space-y-3 pt-4 border-t border-gray-100">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                Current Bed Allocations
              </span>
              {rm.occupants.length === 0 ? (
                <p className="text-sm text-gray-400 italic">Entire room is vacant</p>
              ) : (
                rm.occupants.map((occ, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-900">{occ.name}</span>
                    <span className="text-emerald-500 font-mono font-medium">{occ.bed}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Allocate Modal - Updated to Light Mode */}
      {showAllocateModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-gray-900">Allocate Room to Student</h3>
              <button onClick={() => setShowAllocateModal(false)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
            </div>

            <form onSubmit={handleAllocate} className="space-y-5 text-sm">
              <div>
                <label className="block text-gray-700 font-bold mb-1.5">Select Student</label>
                <select
                  required
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                >
                  <option value="">-- Choose Student --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.rollNo || s.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1.5">Select Available Room</label>
                <select
                  required
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                >
                  <option value="">-- Choose Room --</option>
                  {rooms.map(r => (
                    <option key={r.id} value={r.roomNo}>
                      {r.roomNo} - {r.block} ({r.occupied}/{r.capacity} filled)
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAllocateModal(false)}
                  className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-600/20 transition"
                >
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};