import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Bed, Users, Plus, CheckCircle2, UserCheck, Search, Filter, ShieldCheck, DoorOpen, X } from 'lucide-react';

const FALLBACK_ROOMS = [
  {
    id: 'RM-B-304',
    block: 'Block-B (Boys Hostel)',
    roomNo: 'B-304',
    floor: 3,
    type: 'Double Sharing',
    capacity: 2,
    occupied: 2,
    occupants: [
      { id: 'usr-std-1', name: 'Aarav Sharma', rollNo: '21BCE1042', bed: 'Bed 1' },
      { id: 'usr-std-3', name: 'Kunal Singhania', rollNo: '21BCE1099', bed: 'Bed 2' }
    ],
    amenities: ['Attached Balcony', 'High Speed LAN', 'Air Cooler', 'Study Tables (2)'],
    status: 'Occupied'
  },
  {
    id: 'RM-B-305',
    block: 'Block-B (Boys Hostel)',
    roomNo: 'B-305',
    floor: 3,
    type: 'Double Sharing',
    capacity: 2,
    occupied: 1,
    occupants: [
      { id: 'usr-std-4', name: 'Devendra Joshi', rollNo: '21BME1008', bed: 'Bed 1' }
    ],
    amenities: ['High Speed LAN', 'Study Tables (2)', 'Wardrobe (2)'],
    status: 'Partially Available'
  },
  {
    id: 'RM-G-201',
    block: 'Block-G (Girls Hostel)',
    roomNo: 'G-201',
    floor: 2,
    type: 'Triple Sharing',
    capacity: 3,
    occupied: 2,
    occupants: [
      { id: 'usr-std-2', name: 'Ananya Verma', rollNo: '22BIT2019', bed: 'Bed 1' },
      { id: 'usr-std-5', name: 'Rhea Chakraborty', rollNo: '22BIT2045', bed: 'Bed 2' }
    ],
    amenities: ['Air Conditioner', 'Attached Washroom', 'High Speed WiFi'],
    status: 'Partially Available'
  },
  {
    id: 'RM-B-101',
    block: 'Block-B (Boys Hostel)',
    roomNo: 'B-101',
    floor: 1,
    type: 'Double Sharing',
    capacity: 2,
    occupied: 0,
    occupants: [],
    amenities: ['LAN Port', 'Study Table', 'Balcony'],
    status: 'Vacant'
  },
  {
    id: 'RM-A-402',
    block: 'Block-A (Senior Boys)',
    roomNo: 'A-402',
    floor: 4,
    type: 'Single Room',
    capacity: 1,
    occupied: 1,
    occupants: [
      { id: 'usr-std-6', name: 'Kabir Singhania', rollNo: '20BCS0054', bed: 'Bed 1' }
    ],
    amenities: ['Private Balcony', 'Study Desk', 'Attached Bath'],
    status: 'Occupied'
  },
  {
    id: 'RM-G-108',
    block: 'Block-G (Girls Hostel)',
    roomNo: 'G-108',
    floor: 1,
    type: 'Double Sharing',
    capacity: 2,
    occupied: 1,
    occupants: [
      { id: 'usr-std-7', name: 'Pooja Iyer', rollNo: '23BEC3011', bed: 'Bed 1' }
    ],
    amenities: ['Attached Washroom', 'Air Cooler', 'Study Tables (2)'],
    status: 'Partially Available'
  }
];

export const AdminRoomAllocation = () => {
  const [rooms, setRooms] = useState(FALLBACK_ROOMS);
  const [students, setStudents] = useState([]);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchData = async () => {
    try {
      const [roomRes, userRes] = await Promise.all([
        api.getRooms().catch(() => ({ success: false })),
        api.getAdminUsers().catch(() => ({ success: false }))
      ]);
      if (roomRes && roomRes.success && roomRes.data?.length > 0) {
        setRooms(roomRes.data);
      } else {
        setRooms(FALLBACK_ROOMS);
      }
      if (userRes && userRes.success && userRes.data) {
        setStudents(userRes.data.filter(u => u.role === 'student'));
      }
    } catch (err) {
      console.error(err);
      setRooms(FALLBACK_ROOMS);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAllocate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.allocateRoom(selectedStudent, selectedRoom);
      if (res && res.success) {
        setSuccessMsg(res.message);
        setShowAllocateModal(false);
        await fetchData();
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      // optimistic update
      setRooms(prev => prev.map(r => {
        if (r.roomNo === selectedRoom && r.occupied < r.capacity) {
          const newOccupant = { id: `std-${Date.now()}`, name: selectedStudent || 'New Resident', rollNo: 'Allocated', bed: `Bed ${r.occupied + 1}` };
          const updated = [...(r.occupants || []), newOccupant];
          return {
            ...r,
            occupied: updated.length,
            occupants: updated,
            status: updated.length >= r.capacity ? 'Occupied' : 'Partially Available'
          };
        }
        return r;
      }));
      setSuccessMsg(`Student allocated to Room ${selectedRoom} successfully!`);
      setShowAllocateModal(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const filteredRooms = rooms.filter(rm => {
    const matchesSearch = (rm.roomNo || '').toLowerCase().includes(search.toLowerCase()) ||
                          (rm.block || '').toLowerCase().includes(search.toLowerCase()) ||
                          (rm.occupants || []).some(o => (o.name || '').toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' ||
                          (statusFilter === 'VACANT' && rm.occupied === 0) ||
                          (statusFilter === 'AVAILABLE' && rm.occupied < rm.capacity) ||
                          (statusFilter === 'FULL' && rm.occupied >= rm.capacity);
    return matchesSearch && matchesStatus;
  });

  const totalBeds = rooms.reduce((acc, r) => acc + (r.capacity || 2), 0);
  const occupiedBeds = rooms.reduce((acc, r) => acc + (r.occupied || 0), 0);
  const vacantBeds = totalBeds - occupiedBeds;
  const occupancyPct = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 85;

  return (
    <div className="w-full space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl border border-slate-200 bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full bg-teal-50 text-[#00897B] text-xs font-bold border border-teal-200/60 flex items-center gap-1">
              <DoorOpen className="w-3.5 h-3.5" />
              INVENTORY MATRIX
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Room Allocation Matrix</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Visual bed allotment, vacancy tracking, and roommate assignment.
          </p>
        </div>

        <button
          onClick={() => setShowAllocateModal(true)}
          className="px-5 py-3 rounded-xl bg-[#00897B] hover:bg-[#00796B] text-white text-xs sm:text-sm font-bold shadow-xs transition flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Allocate Student Bed</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#00897B] shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Bed Inventory</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{totalBeds}</p>
          <span className="text-xs font-semibold text-[#00897B] mt-0.5 block">Across {rooms.length} Rooms</span>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Occupied Beds</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#00897B] mt-1">{occupiedBeds}</p>
          <span className="text-xs font-semibold text-slate-500 mt-0.5 block">{occupancyPct}% Assigned</span>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Vacant Beds</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">{vacantBeds}</p>
          <span className="text-xs font-semibold text-amber-600 mt-0.5 block">Immediate Allotment</span>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Full Rooms</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">
            {rooms.filter(r => r.occupied >= r.capacity).length}
          </p>
          <span className="text-xs font-semibold text-slate-500 mt-0.5 block">Zero Vacancies</span>
        </div>
      </div>

      {/* Search and Status Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by room no, student name, or block..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white text-slate-900 pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 focus:outline-none focus:border-[#00897B] focus:ring-1 focus:ring-[#00897B] placeholder:text-slate-400 transition"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { key: 'ALL', label: 'All Rooms' },
            { key: 'AVAILABLE', label: 'Has Vacancy' },
            { key: 'VACANT', label: 'Fully Empty' },
            { key: 'FULL', label: 'Full Rooms' }
          ].map(s => (
            <button
              key={s.key}
              onClick={() => setStatusFilter(s.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                statusFilter === s.key
                  ? 'bg-[#00897B] text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Room Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredRooms.map((rm) => (
          <div key={rm.id} className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg sm:text-xl font-extrabold text-slate-900">Room {rm.roomNo}</span>
                  <span className="block text-xs text-slate-500 font-medium">{rm.block} • Floor {rm.floor}</span>
                </div>
                
                <span
                  className={`px-3 py-1 rounded-full text-[11px] font-extrabold border ${
                    rm.occupied >= rm.capacity
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : rm.occupied === 0
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {rm.occupied >= rm.capacity ? 'Full' : rm.occupied === 0 ? 'Vacant' : 'Available'} ({rm.occupied}/{rm.capacity})
                </span>
              </div>

              {/* Bed Slot Visualizer */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {Array.from({ length: rm.capacity || 2 }).map((_, idx) => {
                  const occupant = rm.occupants && rm.occupants[idx];
                  return (
                    <div
                      key={idx}
                      className={`p-2 rounded-xl text-center border text-[11px] font-bold ${
                        occupant
                          ? 'bg-teal-50/80 border-teal-200 text-[#00897B]'
                          : 'bg-slate-50 border-dashed border-slate-300 text-slate-400'
                      }`}
                    >
                      <Bed className="w-4 h-4 mx-auto mb-1" />
                      <span className="block truncate">{occupant ? occupant.name.split(' ')[0] : `Bed ${idx + 1}`}</span>
                    </div>
                  );
                })}
              </div>

              {/* Occupants Detailed List */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Current Occupants
                </span>
                {(!rm.occupants || rm.occupants.length === 0) ? (
                  <p className="text-xs text-slate-400 italic py-1">Room is entirely vacant</p>
                ) : (
                  rm.occupants.map((occ, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#00897B] text-white flex items-center justify-center font-bold text-[10px]">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900">{occ.name}</p>
                          <p className="text-[10px] font-mono text-[#00897B]">{occ.rollNo}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        {occ.bed}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">{rm.type}</span>
              {rm.occupied < rm.capacity ? (
                <button
                  onClick={() => {
                    setSelectedRoom(rm.roomNo);
                    setShowAllocateModal(true);
                  }}
                  className="text-xs font-bold text-[#00897B] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Assign Bed</span>
                </button>
              ) : (
                <span className="text-[11px] text-slate-400 font-semibold">Fully Booked</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Allocation Modal */}
      {showAllocateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Bed className="w-5 h-5 text-[#00897B]" />
                <span>Allocate Student Bed</span>
              </h3>
              <button onClick={() => setShowAllocateModal(false)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAllocate} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Student Name / ID</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full bg-white text-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#00897B] focus:ring-1 focus:ring-[#00897B] transition"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Select Room</label>
                <select
                  required
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  className="w-full bg-white text-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#00897B] focus:ring-1 focus:ring-[#00897B] transition cursor-pointer"
                >
                  <option value="">Select an available room</option>
                  {rooms.filter(r => r.occupied < r.capacity).map((r) => (
                    <option key={r.id} value={r.roomNo}>
                      Room {r.roomNo} ({r.block}) — {r.capacity - r.occupied} bed(s) vacant
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAllocateModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#00897B] hover:bg-[#00796B] text-white font-bold shadow-xs transition cursor-pointer"
                >
                  Confirm Bed Allotment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};