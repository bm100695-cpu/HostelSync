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
          <h1 className="text-2xl font-bold text-white">Hostel Blocks & Infrastructure</h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage residential buildings, floors, room capacities, assigned wardens and caretakers.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Hostel Block</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {hostels.map((hst) => (
          <div key={hst.id} className="glass-card p-6 rounded-3xl border border-gray-800 space-y-5">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                {hst.status}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">{hst.name}</h3>
              <p className="text-xs text-brand-300 font-medium mt-0.5">{hst.type} Residency</p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-gray-800/40 border border-gray-700/50 text-xs">
              <div>
                <span className="text-[10px] text-gray-400 block">TOTAL ROOMS</span>
                <span className="text-white font-bold">{hst.totalRooms} Rooms</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">OCCUPIED</span>
                <span className="text-emerald-400 font-bold">{hst.occupiedRooms} ({hst.totalRooms ? Math.round((hst.occupiedRooms/hst.totalRooms)*100) : 0}%)</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">FLOORS</span>
                <span className="text-white font-medium">{hst.floors} Floors</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">WARDEN</span>
                <span className="text-purple-300 font-medium truncate">{hst.warden || 'Unassigned'}</span>
              </div>
            </div>

            <div className="w-full h-2 rounded-full bg-gray-700 overflow-hidden">
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
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md glass-card bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-brand-400" />
                <span>Add New Hostel Block</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHostel} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Hostel Block Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Block-C (International Residency)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-800 text-white px-3.5 py-2.5 rounded-xl border border-gray-700 focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Residency Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-gray-800 text-white px-3.5 py-2.5 rounded-xl border border-gray-700 focus:border-brand-500"
                  >
                    <option value="Boys">Boys Hostel</option>
                    <option value="Girls">Girls Hostel</option>
                    <option value="Co-Ed">Co-Ed Hostel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Number of Floors</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    required
                    value={formData.floors}
                    onChange={(e) => setFormData({ ...formData, floors: e.target.value })}
                    className="w-full bg-gray-800 text-white px-3.5 py-2.5 rounded-xl border border-gray-700 focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Total Rooms Capacity</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.totalRooms}
                  onChange={(e) => setFormData({ ...formData, totalRooms: e.target.value })}
                  className="w-full bg-gray-800 text-white px-3.5 py-2.5 rounded-xl border border-gray-700 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Assigned Warden</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Ramesh K. Patel"
                  value={formData.warden}
                  onChange={(e) => setFormData({ ...formData, warden: e.target.value })}
                  className="w-full bg-gray-800 text-white px-3.5 py-2.5 rounded-xl border border-gray-700 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Caretaker Name</label>
                <input
                  type="text"
                  placeholder="e.g. Suresh Rana"
                  value={formData.caretaker}
                  onChange={(e) => setFormData({ ...formData, caretaker: e.target.value })}
                  className="w-full bg-gray-800 text-white px-3.5 py-2.5 rounded-xl border border-gray-700 focus:border-brand-500"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold transition"
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
