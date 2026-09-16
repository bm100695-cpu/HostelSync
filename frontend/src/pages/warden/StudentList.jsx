import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Users, Search, Phone, Mail, MapPin, Building, ShieldCheck, Filter, Eye, X, User } from 'lucide-react';

export const WardenStudentList = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [blockFilter, setBlockFilter] = useState('ALL');
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.getAdminUsers();
        if (res.success) setUsers(res.data.filter(u => u.role === 'student'));
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  const filteredStudents = users.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          (s.rollNo && s.rollNo.toLowerCase().includes(search.toLowerCase())) ||
                          (s.room && s.room.toLowerCase().includes(search.toLowerCase()));
    const matchesBlock = blockFilter === 'ALL' || (s.block && s.block.includes(blockFilter));
    return matchesSearch && matchesBlock;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Student Hostel Directory</h1>
          <p className="text-xs text-gray-400 mt-1">
            Search student records, room allocations, branch, and guardian emergency contact numbers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by name, roll no, room..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-900 text-white pl-9 pr-4 py-2 rounded-xl text-xs border border-gray-700"
            />
          </div>

          <select
            value={blockFilter}
            onChange={(e) => setBlockFilter(e.target.value)}
            className="bg-gray-900 text-white px-3 py-2 rounded-xl text-xs border border-gray-700"
          >
            <option value="ALL">All Blocks</option>
            <option value="Block-B">Block-B (Boys)</option>
            <option value="Block-G">Block-G (Girls)</option>
            <option value="Block-A">Block-A (Boys)</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="glass-card rounded-3xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-900/80 text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-800">
              <tr>
                <th className="py-4 px-6">Student</th>
                <th className="py-4 px-6">Roll No</th>
                <th className="py-4 px-6">Room & Block</th>
                <th className="py-4 px-6">Branch & Year</th>
                <th className="py-4 px-6">Student Phone</th>
                <th className="py-4 px-6">Parent Contact</th>
                <th className="py-4 px-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              {filteredStudents.map((std) => (
                <tr key={std.id} className="hover:bg-gray-800/40 transition">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={std.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                        alt={std.name}
                        className="w-9 h-9 rounded-xl object-cover ring-1 ring-white/10"
                      />
                      <div>
                        <p className="font-bold text-white text-xs">{std.name}</p>
                        <p className="text-[11px] text-gray-500">{std.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono text-brand-400 font-semibold">{std.rollNo || 'N/A'}</td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-white">{std.room || 'B-304'}</span>
                    <span className="block text-[10px] text-gray-500">{std.block || 'Block-B'}</span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-gray-200">{std.branch || 'Engineering'}</p>
                    <p className="text-[10px] text-gray-500">{std.year || '3rd Year'}</p>
                  </td>
                  <td className="py-4 px-6 text-gray-300 font-mono">{std.phone || '+91 98765 43210'}</td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-white">{std.parentName || 'Guardian'}</p>
                    <p className="text-emerald-400 font-mono text-[11px]">{std.parentPhone || '+91 98765 00001'}</p>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => setSelectedStudent(std)}
                      className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-brand-500/20 text-brand-400 border border-gray-700 hover:border-brand-500/40 text-[11px] font-semibold transition flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md glass-card bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-brand-400" />
                <span>Student Resident Card</span>
              </h3>
              <button onClick={() => setSelectedStudent(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={selectedStudent.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                alt={selectedStudent.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-500/30"
              />
              <div>
                <h4 className="text-base font-bold text-white">{selectedStudent.name}</h4>
                <p className="text-xs font-mono text-brand-400">{selectedStudent.rollNo}</p>
                <p className="text-xs text-gray-400">{selectedStudent.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-gray-800/40 border border-gray-700/50 text-xs">
              <div>
                <span className="text-[10px] text-gray-400 block">ROOM & BLOCK</span>
                <span className="text-white font-bold">{selectedStudent.room} ({selectedStudent.block})</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">BRANCH</span>
                <span className="text-white font-medium">{selectedStudent.branch}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">ACADEMIC YEAR</span>
                <span className="text-white font-medium">{selectedStudent.year}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">STATUS</span>
                <span className="text-emerald-400 font-bold">Resident Active</span>
              </div>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-gray-800/40 border border-gray-700/50 text-xs">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Emergency & Parent Contact
              </span>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Parent/Guardian:</span>
                <span className="text-white font-bold">{selectedStudent.parentName || 'Guardian'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Parent Phone:</span>
                <a href={`tel:${selectedStudent.parentPhone}`} className="text-emerald-400 font-mono font-bold hover:underline flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>{selectedStudent.parentPhone || '+91 98765 00001'}</span>
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Student Phone:</span>
                <a href={`tel:${selectedStudent.phone}`} className="text-brand-400 font-mono font-bold hover:underline flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>{selectedStudent.phone || '+91 98765 43210'}</span>
                </a>
              </div>
            </div>

            <button
              onClick={() => setSelectedStudent(null)}
              className="w-full py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold text-xs transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
