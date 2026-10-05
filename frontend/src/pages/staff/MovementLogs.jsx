import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Activity, Search, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

export const SecurityMovementLogs = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.getSecurityLogs();
        if (res.success) setLogs(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(l => 
    l.studentName?.toLowerCase().includes(search.toLowerCase()) ||
    l.rollNo?.toLowerCase().includes(search.toLowerCase()) ||
    l.passId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {/* Header text changed to dark gray for light mode */}
          <h1 className="text-2xl font-bold text-gray-900">Campus Gate Movement Audit Logs</h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time feed of all physical student check-ins and check-outs through security gates.
          </p>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          {/* Search input changed to white background with light border */}
          <input
            type="text"
            placeholder="Search logs by student, roll no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white text-gray-900 pl-9 pr-4 py-2 rounded-xl text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      {/* Table container changed to white background with light border */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            {/* Table header updated to light gray text and no background */}
            <thead className="text-gray-500 uppercase text-[11px] font-bold tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-4 px-6">Timestamp</th>
                <th className="py-4 px-6">Action</th>
                <th className="py-4 px-6">Student</th>
                <th className="py-4 px-6">Pass Reference</th>
                <th className="py-4 px-6">Security Gate</th>
                <th className="py-4 px-6">Parent SMS</th>
              </tr>
            </thead>
            {/* Dividers updated to light gray */}
            <tbody className="divide-y divide-gray-100 text-gray-600">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-gray-500 font-mono text-xs">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="py-4 px-6">
                    {/* Action badges updated to standard light mode opacities */}
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 border ${
                        log.action === 'EXIT'
                          ? 'bg-amber-50 text-amber-500 border-amber-200'
                          : 'bg-emerald-50 text-emerald-500 border-emerald-200'
                      }`}
                    >
                      {log.action === 'EXIT' ? <ArrowRight className="w-3 h-3" /> : <ArrowLeft className="w-3 h-3" />}
                      {log.action}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {log.studentName && <p className="font-semibold text-gray-900">{log.studentName}</p>}
                    {/* Roll number set to emerald green to match your screenshot */}
                    <p className="text-xs text-emerald-500 font-medium">{log.rollNo}</p>
                  </td>
                  <td className="py-4 px-6 font-mono text-gray-500 text-xs">{log.passId}</td>
                  <td className="py-4 px-6 text-gray-500 text-sm">{log.gate} ({log.guardName})</td>
                  <td className="py-4 px-6">
                    <span className="text-emerald-500 font-medium flex items-center gap-1.5 text-xs">
                      <ShieldCheck className="w-4 h-4" /> Delivered
                    </span>
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