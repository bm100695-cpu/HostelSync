import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  ClipboardList, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Users, 
  Send, 
  ShieldCheck,
  AlertTriangle,
  Download
} from 'lucide-react';

export const WardenAttendance = () => {
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.getAdminUsers();
        if (res.success) {
          const stdList = res.data.filter(u => u.role === 'student');
          setStudents(stdList);
          const initial = {};
          stdList.forEach(s => {
            initial[s.id] = 'PRESENT';
          });
          setRecords(initial);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleStatusChange = (studentId, status) => {
    setRecords(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmitRollCall = async () => {
    const payloadRecords = students.map(s => ({
      studentId: s.id,
      name: s.name,
      room: s.room || 'B-304',
      status: records[s.id] || 'PRESENT'
    }));

    try {
      const res = await api.submitAttendance({
        block: 'Block-B (Boys Hostel)',
        records: payloadRecords
      });
      if (res.success) {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (err) {
      alert(err.message || 'Submission failed');
    }
  };

  const presentCount = Object.values(records).filter(r => r === 'PRESENT').length;
  const absentCount = Object.values(records).filter(r => r === 'ABSENT').length;
  const leaveCount = Object.values(records).filter(r => r === 'ON_LEAVE').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Night Roll Call Attendance</h1>
          <p className="text-xs text-gray-400 mt-1">
            Daily 09:30 PM curfew physical verification checklist with instant absentee parent broadcast.
          </p>
        </div>

        <button
          onClick={handleSubmitRollCall}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>Lock & Submit Roll Call</span>
        </button>
      </div>

      {submitted && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Night roll call registered. Absentee alerts automatically sent to parents!</span>
        </div>
      )}

      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div className="glass-card p-4 rounded-2xl border border-gray-800">
          <span className="text-gray-400 font-medium">Total Registered</span>
          <p className="text-2xl font-bold text-white mt-1">{students.length}</p>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20">
          <span className="text-emerald-400 font-medium">Present in Room</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{presentCount}</p>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-rose-500/30 bg-rose-950/20">
          <span className="text-rose-400 font-medium">Unaccounted Absent</span>
          <p className="text-2xl font-bold text-rose-400 mt-1">{absentCount}</p>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-amber-500/30 bg-amber-950/20">
          <span className="text-amber-400 font-medium">Sanctioned Leave</span>
          <p className="text-2xl font-bold text-amber-400 mt-1">{leaveCount}</p>
        </div>
      </div>

      {/* Student Checklist Table */}
      <div className="glass-card rounded-3xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-900 text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-800">
              <tr>
                <th className="py-4 px-6">Room</th>
                <th className="py-4 px-6">Student Name</th>
                <th className="py-4 px-6">Roll No</th>
                <th className="py-4 px-6 text-center">Mark Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              {students.map((std) => (
                <tr key={std.id} className="hover:bg-gray-800/40">
                  <td className="py-4 px-6 font-bold text-white">{std.room || 'B-304'}</td>
                  <td className="py-4 px-6 font-medium text-white">{std.name}</td>
                  <td className="py-4 px-6 font-mono text-brand-400">{std.rollNo || '21BCE1042'}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleStatusChange(std.id, 'PRESENT')}
                        className={`px-3 py-1.5 rounded-xl font-bold transition text-[11px] ${
                          records[std.id] === 'PRESENT'
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                            : 'bg-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        ✓ Present
                      </button>
                      <button
                        onClick={() => handleStatusChange(std.id, 'ABSENT')}
                        className={`px-3 py-1.5 rounded-xl font-bold transition text-[11px] ${
                          records[std.id] === 'ABSENT'
                            ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                            : 'bg-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        ✗ Absent
                      </button>
                      <button
                        onClick={() => handleStatusChange(std.id, 'ON_LEAVE')}
                        className={`px-3 py-1.5 rounded-xl font-bold transition text-[11px] ${
                          records[std.id] === 'ON_LEAVE'
                            ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                            : 'bg-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        ✈ On Leave
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
