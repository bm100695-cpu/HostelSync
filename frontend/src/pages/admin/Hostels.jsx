import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Building2, Plus, Bed, Users, ShieldCheck, MapPin, CheckCircle2, X } from 'lucide-react';

export const AdminHostels = () => {
  const [hostels, setHostels] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Boys',
    floors: 4,
    totalRooms: 60,
    warden: '',
    caretaker: ''
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchHostels = async () => {
    try {
      const res = await api.getHostels();
      if (res.success) setHostels(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  const handleCreateHostel = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.createHostel(formData);
      if (res.success) {
        setSuccessMsg(`Hostel "${formData.name}" added successfully!`);
        setShowAddModal(false);
        setFormData({
          name: '',
          type: 'Boys',
          floors: 4,
          totalRooms: 60,
          warden: '',
          caretaker: ''
        });
        await fetchHostels();
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      alert(err.message || 'Failed to add hostel block');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hostel Blocks & Infrastructure</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage residential buildings, floors, room capacities, assigned wardens and caretakers.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Hostel Block</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {hostels.map((hst) => (
          <div key={hst.id} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                <Building2 className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-200">
                {hst.status}
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900">{hst.name}</h3>
              <p className="text-sm text-emerald-500 font-medium mt-0.5">{hst.type} Residency</p>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm">
              <div>
                <span className="text-[10px] text-gray-400 font-bold tracking-wider block mb-0.5">TOTAL ROOMS</span>
                <span className="text-gray-900 font-bold">{hst.totalRooms} Rooms</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold tracking-wider block mb-0.5">OCCUPIED</span>
                <span className="text-emerald-600 font-bold">{hst.occupiedRooms} ({hst.totalRooms ? Math.round((hst.occupiedRooms/hst.totalRooms)*100) : 0}%)</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold tracking-wider block mb-0.5">FLOORS</span>
                <span className="text-gray-700 font-medium">{hst.floors} Floors</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold tracking-wider block mb-0.5">WARDEN</span>
                <span className="text-purple-600 font-medium truncate">{hst.warden || 'Unassigned'}</span>
              </div>
            </div>

            <div className="w-full h-2.5 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all"
                style={{ width: `${hst.totalRooms ? (hst.occupiedRooms / hst.totalRooms) * 100 : 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add Hostel Block Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-emerald-500" />
                <span>Add New Hostel Block</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 text-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHostel} className="space-y-5 text-sm">
              <div>
                <label className="block text-gray-700 font-bold mb-1.5">Hostel Block Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Block-C (International Residency)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-1.5">Residency Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                  >
                    <option value="Boys">Boys Hostel</option>
                    <option value="Girls">Girls Hostel</option>
                    <option value="Co-Ed">Co-Ed Hostel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1.5">Number of Floors</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    required
                    value={formData.floors}
                    onChange={(e) => setFormData({ ...formData, floors: e.target.value })}
                    className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1.5">Total Rooms Capacity</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.totalRooms}
                  onChange={(e) => setFormData({ ...formData, totalRooms: e.target.value })}
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1.5">Assigned Warden</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Ramesh K. Patel"
                  value={formData.warden}
                  onChange={(e) => setFormData({ ...formData, warden: e.target.value })}
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1.5">Caretaker Name</label>
                <input
                  type="text"
                  placeholder="e.g. Suresh Rana"
                  value={formData.caretaker}
                  onChange={(e) => setFormData({ ...formData, caretaker: e.target.value })}
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20 transition disabled:opacity-70"
                >
                  {loading ? 'Creating...' : 'Create Block'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};