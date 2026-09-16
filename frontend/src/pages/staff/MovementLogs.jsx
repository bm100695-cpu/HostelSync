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
    l.studentName.toLowerCase().includes(search.toLowerCase()) ||
    l.rollNo.toLowerCase().includes(search.toLowerCase()) ||
    l.passId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Campus Gate Movement Audit Logs</h1>
          <p className="text-xs text-gray-400 mt-1">
            Real-time feed of all physical student check-ins and check-outs through security gates.
          </p>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search logs by student, roll no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900 text-white pl-9 pr-4 py-2 rounded-xl text-xs border border-gray-700"
          />
        </div>
      </div>

      <div className="glass-card rounded-3xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-900 text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-800">
              <tr>
                <th className="py-4 px-6">Timestamp</th>
                <th className="py-4 px-6">Action</th>
                <th className="py-4 px-6">Student</th>
                <th className="py-4 px-6">Pass Reference</th>
                <th className="py-4 px-6">Security Gate</th>
                <th className="py-4 px-6">Parent SMS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-800/40">
                  <td className="py-4 px-6 text-gray-400 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 border ${
                        log.action === 'EXIT'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}
                    >
                      {log.action === 'EXIT' ? <ArrowRight className="w-3 h-3" /> : <ArrowLeft className="w-3 h-3" />}
                      {log.action}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-white">{log.studentName}</p>
                    <p className="text-[11px] text-brand-400 font-mono">{log.rollNo}</p>
                  </td>
                  <td className="py-4 px-6 font-mono text-gray-400">{log.passId}</td>
                  <td className="py-4 px-6 text-gray-300">{log.gate} ({log.guardName})</td>
                  <td className="py-4 px-6">
                    <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5" /> Delivered
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
