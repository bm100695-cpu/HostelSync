import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Users, Plus, Search, Shield, Trash2, CheckCircle2, UserCheck, Key } from 'lucide-react';

export const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'student',
    rollNo: '',
    room: '',
    block: 'Block-B (Boys Hostel)',
    phone: '',
    parentName: '',
    parentPhone: '',
    branch: 'Computer Science & Engineering',
    year: '1st Year'
  });

  const fetchUsers = async () => {
    try {
      const res = await api.getAdminUsers();
      if (res.success) setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.createAdminUser(formData);
      if (res.success) {
        setSuccessMsg(`User ${formData.name} created successfully!`);
        setShowModal(false);
        setFormData({
          name: '',
          email: '',
          role: 'student',
          rollNo: '',
          room: '',
          block: 'Block-B (Boys Hostel)',
          phone: '',
          parentName: '',
          parentPhone: '',
          branch: 'Computer Science & Engineering',
          year: '1st Year'
        });
        await fetchUsers();
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      alert(err.message || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                          u.email.toLowerCase().includes(search.toLowerCase()) ||
                          (u.rollNo && u.rollNo.toLowerCase().includes(search.toLowerCase()));
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Campus User & Role Management</h1>
          <p className="text-xs text-gray-400 mt-1">
            Provision Students, Wardens, Security Staff, and System Administrators with RBAC privileges.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New User</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by name, email, roll no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900 text-white pl-9 pr-4 py-2 rounded-xl text-xs border border-gray-700"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-gray-900 text-white px-3.5 py-2 rounded-xl text-xs border border-gray-700"
        >
          <option value="ALL">All Roles</option>
          <option value="student">Students</option>
          <option value="warden">Wardens</option>
          <option value="staff">Staff / Security</option>
          <option value="admin">Administrators</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="glass-card rounded-3xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-900 text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-800">
              <tr>
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Room / Department</th>
                <th className="py-4 px-6">Contact Number</th>
                <th className="py-4 px-6">Security Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-800/40">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                        alt={u.name}
                        className="w-9 h-9 rounded-xl object-cover ring-1 ring-white/10"
                      />
                      <div>
                        <p className="font-bold text-white">{u.name}</p>
                        <p className="text-[11px] text-gray-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                        u.role === 'admin'
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                          : u.role === 'warden'
                          ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                          : u.role === 'staff'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-300">
                    {u.room ? `${u.room} (${u.block})` : u.designation || u.gate || 'Campus Admin'}
                  </td>
                  <td className="py-4 px-6 font-mono text-gray-400">{u.phone || '+91 98765 43210'}</td>
                  <td className="py-4 px-6">
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5" /> Active JWT
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg glass-card bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <h3 className="text-lg font-bold text-white">Create New Campus User</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Rohan Gupta"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-800 text-white px-3.5 py-2.5 rounded-xl border border-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Campus Email</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g., rohan@hostelsync.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-gray-800 text-white px-3.5 py-2.5 rounded-xl border border-gray-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-gray-800 text-white px-3.5 py-2.5 rounded-xl border border-gray-700"
                  >
                    <option value="student">Student</option>
                    <option value="warden">Warden</option>
                    <option value="staff">Staff / Guard</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-gray-800 text-white px-3.5 py-2.5 rounded-xl border border-gray-700"
                  />
                </div>
              </div>

              {formData.role === 'student' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">Roll Number</label>
                      <input
                        type="text"
                        placeholder="22BCE1090"
                        value={formData.rollNo}
                        onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                        className="w-full bg-gray-800 text-white px-3.5 py-2.5 rounded-xl border border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">Room No</label>
                      <input
                        type="text"
                        placeholder="B-305"
                        value={formData.room}
                        onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                        className="w-full bg-gray-800 text-white px-3.5 py-2.5 rounded-xl border border-gray-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">Parent Name</label>
                      <input
                        type="text"
                        placeholder="Guardian Name"
                        value={formData.parentName}
                        onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                        className="w-full bg-gray-800 text-white px-3.5 py-2.5 rounded-xl border border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">Parent WhatsApp</label>
                      <input
                        type="tel"
                        placeholder="+91 98765 00000"
                        value={formData.parentPhone}
                        onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                        className="w-full bg-gray-800 text-white px-3.5 py-2.5 rounded-xl border border-gray-700"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  {submitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
