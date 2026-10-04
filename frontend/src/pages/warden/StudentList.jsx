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
          <h1 className="text-2xl font-bold text-black">Student Hostel Directory</h1>
          <p className="text-xs text-black mt-1 opacity-80">
            Search student records, room allocations, branch, and guardian emergency contact numbers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-green-600 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, roll no, room..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white text-black pl-9 pr-4 py-2 rounded-xl text-xs border border-green-300 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 placeholder:text-gray-500"
            />
          </div>

          <select
            value={blockFilter}
            onChange={(e) => setBlockFilter(e.target.value)}
            className="bg-white text-black px-3 py-2 rounded-xl text-xs border border-green-300 focus:outline-none focus:border-green-600"
          >
            <option value="ALL">All Blocks</option>
            <option value="Block-B">Block-B (BH-1)</option>
            <option value="Block-G">Block-G (BH-2)</option>
            <option value="Block-A">Block-A (BH-3)</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-3xl border border-green-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-green-50 text-black uppercase text-[10px] tracking-wider border-b border-green-200">
              <tr>
                <th className="py-4 px-6 font-bold">Student</th>
                <th className="py-4 px-6 font-bold">Roll No</th>
                <th className="py-4 px-6 font-bold">Room & Floor</th>
                <th className="py-4 px-6 font-bold">Branch & Year</th>
                <th className="py-4 px-6 font-bold">Student Phone</th>
                <th className="py-4 px-6 font-bold">Parent Contact</th>
                <th className="py-4 px-6 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-100 text-black">
              {filteredStudents.map((std) => (
                <tr key={std.id} className="hover:bg-green-50 transition">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={std.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                        alt={std.name}
                        className="w-9 h-9 rounded-xl object-cover ring-1 ring-green-200"
                      />
                      <div>
                        <p className="font-bold text-black text-xs">{std.name}</p>
                        <p className="text-[11px] text-gray-600">{std.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono text-green-700 font-bold">{std.rollNo || 'N/A'}</td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-black">{std.room || 'B-304'}</span>
                    <span className="block text-[10px] text-gray-600">{std.block || 'Block-B'}</span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-black font-medium">{std.branch || 'Engineering'}</p>
                    <p className="text-[10px] text-gray-600">{std.year || '3rd Year'}</p>
                  </td>
                  <td className="py-4 px-6 text-black font-mono font-medium">{std.phone || '+91 98765 43210'}</td>
                  <td className="py-4 px-6">
                    <p className="text-black font-medium">{std.parentName || 'Guardian'}</p>
                    <p className="text-green-700 font-mono text-[11px] font-bold">{std.parentPhone || '+91 98765 00001'}</p>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => setSelectedStudent(std)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-green-100 text-black border border-green-300 text-[11px] font-bold transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5 text-green-600" />
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-white border border-green-300 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-green-100 pb-4">
              <h3 className="text-lg font-bold text-black flex items-center gap-2">
                <User className="w-5 h-5 text-green-600" />
                <span>Student Resident Card</span>
              </h3>
              <button onClick={() => setSelectedStudent(null)} className="text-black hover:text-green-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={selectedStudent.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                alt={selectedStudent.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-green-300"
              />
              <div>
                <h4 className="text-base font-bold text-black">{selectedStudent.name}</h4>
                <p className="text-xs font-mono font-bold text-green-700">{selectedStudent.rollNo}</p>
                <p className="text-xs text-gray-600">{selectedStudent.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-green-50 border border-green-200 text-xs">
              <div>
                <span className="text-[10px] text-black font-semibold block">ROOM & BLOCK</span>
                <span className="text-black font-bold">{selectedStudent.room} ({selectedStudent.block})</span>
              </div>
              <div>
                <span className="text-[10px] text-black font-semibold block">BRANCH</span>
                <span className="text-black font-bold">{selectedStudent.branch}</span>
              </div>
              <div>
                <span className="text-[10px] text-black font-semibold block">ACADEMIC YEAR</span>
                <span className="text-black font-bold">{selectedStudent.year}</span>
              </div>
              <div>
                <span className="text-[10px] text-black font-semibold block">STATUS</span>
                <span className="text-green-700 font-bold">Resident Active</span>
              </div>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-green-50 border border-green-200 text-xs">
              <span className="text-[10px] font-bold text-black uppercase tracking-wider block">
                Emergency & Parent Contact
              </span>
              <div className="flex items-center justify-between">
                <span className="text-black font-medium">Parent/Guardian:</span>
                <span className="text-black font-bold">{selectedStudent.parentName || 'Guardian'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-black font-medium">Parent Phone:</span>
                <a href={`tel:${selectedStudent.parentPhone}`} className="text-green-700 font-mono font-bold hover:underline flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>{selectedStudent.parentPhone || '+91 7905607956'}</span>
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-black font-medium">Student Phone:</span>
                <a href={`tel:${selectedStudent.phone}`} className="text-green-700 font-mono font-bold hover:underline flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>{selectedStudent.phone || '+91 7905607956'}</span>
                </a>
              </div>
            </div>

            <button
              onClick={() => setSelectedStudent(null)}
              className="w-full py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs transition shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};