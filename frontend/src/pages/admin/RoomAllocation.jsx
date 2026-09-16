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
          <h1 className="text-2xl font-bold text-white">Room Allocation Matrix</h1>
          <p className="text-xs text-gray-400 mt-1">
            Visual bed allotment, vacancy tracking, and roommate assignment.
          </p>
        </div>

        <button
          onClick={() => setShowAllocateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Allocate Student Bed</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rooms.map((rm) => (
          <div key={rm.id} className="glass-card p-6 rounded-3xl border border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-white">Room {rm.roomNo}</span>
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                  rm.occupied >= rm.capacity
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    : rm.occupied === 0
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}
              >
                {rm.status} ({rm.occupied}/{rm.capacity})
              </span>
            </div>

            <p className="text-xs text-gray-400">{rm.block} • Floor {rm.floor} • {rm.type}</p>

            {/* Occupants List */}
            <div className="space-y-2 pt-2 border-t border-gray-800">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Current Bed Allocations
              </span>
              {rm.occupants.length === 0 ? (
                <p className="text-xs text-gray-500 italic">Entire room is vacant</p>
              ) : (
                rm.occupants.map((occ, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-gray-800/40 border border-gray-700/50 flex items-center justify-between text-xs">
                    <span className="font-medium text-white">{occ.name}</span>
                    <span className="text-brand-400 font-mono text-[11px]">{occ.bed}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Allocate Modal */}
      {showAllocateModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md glass-card bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <h3 className="text-lg font-bold text-white">Allocate Room to Student</h3>
              <button onClick={() => setShowAllocateModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAllocate} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Select Student</label>
                <select
                  required
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full bg-gray-800 text-white px-3.5 py-2.5 rounded-xl border border-gray-700"
                >
                  <option value="">-- Choose Student --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.rollNo || s.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Select Available Room</label>
                <select
                  required
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  className="w-full bg-gray-800 text-white px-3.5 py-2.5 rounded-xl border border-gray-700"
                >
                  <option value="">-- Choose Room --</option>
                  {rooms.map(r => (
                    <option key={r.id} value={r.roomNo}>
                      {r.roomNo} - {r.block} ({r.occupied}/{r.capacity} filled)
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAllocateModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
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
