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
          {/* Text changed to dark gray */}
          <h1 className="text-2xl font-bold text-gray-900">Night Roll Call Attendance</h1>
          <p className="text-sm text-gray-500 mt-1">
            Daily 09:30 PM curfew physical verification checklist with instant absentee parent broadcast.
          </p>
        </div>

        <button
          onClick={handleSubmitRollCall}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-600/20 transition flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>Lock & Submit Roll Call</span>
        </button>
      </div>

      {submitted && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Night roll call registered. Absentee alerts automatically sent to parents!</span>
        </div>
      )}

      {/* Attendance Stats Cards - Updated to solid white background with light borders */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-gray-500 font-medium text-xs uppercase tracking-wider block">Total Registered</span>
          <p className="text-3xl font-bold text-gray-900 mt-2">{students.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
          <span className="text-emerald-500 font-medium text-xs uppercase tracking-wider block">Present in Room</span>
          <p className="text-3xl font-bold text-emerald-600 mt-2">{presentCount}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm">
          <span className="text-rose-500 font-medium text-xs uppercase tracking-wider block">Unaccounted Absent</span>
          <p className="text-3xl font-bold text-rose-600 mt-2">{absentCount}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm">
          <span className="text-amber-500 font-medium text-xs uppercase tracking-wider block">Sanctioned Leave</span>
          <p className="text-3xl font-bold text-amber-600 mt-2">{leaveCount}</p>
        </div>
      </div>

      {/* Student Checklist Table - Changed to white background with light borders */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-gray-500 uppercase text-[11px] font-bold tracking-wider border-b border-gray-100 bg-gray-50/50">
              <tr>
                <th className="py-4 px-6">Room</th>
                <th className="py-4 px-6">Student Name</th>
                <th className="py-4 px-6">Roll No</th>
                <th className="py-4 px-6 text-center">Mark Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-600">
              {students.map((std) => (
                <tr key={std.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-gray-900">{std.room || 'B-304'}</td>
                  <td className="py-4 px-6 font-medium text-gray-900">{std.name}</td>
                  {/* Roll number set to emerald green to match the screenshot */}
                  <td className="py-4 px-6 font-mono text-emerald-500 font-medium">{std.rollNo || '21BCE1042'}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleStatusChange(std.id, 'PRESENT')}
                        className={`px-4 py-2 rounded-xl font-bold transition text-xs ${
                          records[std.id] === 'PRESENT'
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900'
                        }`}
                      >
                        ✓ Present
                      </button>
                      <button
                        onClick={() => handleStatusChange(std.id, 'ABSENT')}
                        className={`px-4 py-2 rounded-xl font-bold transition text-xs ${
                          records[std.id] === 'ABSENT'
                            ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900'
                        }`}
                      >
                        ✗ Absent
                      </button>
                      <button
                        onClick={() => handleStatusChange(std.id, 'ON_LEAVE')}
                        className={`px-4 py-2 rounded-xl font-bold transition text-xs ${
                          records[std.id] === 'ON_LEAVE'
                            ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900'
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