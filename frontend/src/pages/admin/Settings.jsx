import React, { useState } from 'react';
import { api } from '../../services/api';
import { Sliders, MessageSquare, Sparkles, Clock, ShieldCheck, CheckCircle2, Send } from 'lucide-react';

export const AdminSettings = () => {
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastGroup, setBroadcastGroup] = useState('ALL RESIDENTS');
  const [success, setSuccess] = useState('');

  const handleBroadcast = async (e) => {
    e.preventDefault();
    try {
      const res = await api.broadcastWhatsApp(broadcastMsg, broadcastGroup);
      if (res.success) {
        setSuccess('WhatsApp broadcast message queued and sent via Cloud API gateway!');
        setBroadcastMsg('');
        setTimeout(() => setSuccess(''), 4000);
      }
    } catch (err) {
      alert(err.message || 'Broadcast failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">System Settings & Integrations</h1>
        <p className="text-xs text-gray-400 mt-1">
          WhatsApp Gateway credentials, Gemini AI models, Curfew timings and Academic Session config.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* WhatsApp Manual Broadcaster */}
        <div className="glass-card p-6 rounded-3xl border border-gray-800 space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Instant WhatsApp Broadcast Console</h3>
          </div>
          <p className="text-xs text-gray-400">
            Dispatch urgent SMS notifications directly to registered parent phones and student WhatsApp chats.
          </p>

          <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Recipient Group</label>
              <select
                value={broadcastGroup}
                onChange={(e) => setBroadcastGroup(e.target.value)}
                className="w-full bg-gray-800 text-white px-3.5 py-2.5 rounded-xl border border-gray-700"
              >
                <option value="ALL RESIDENTS">All Students & Parents (Campus-wide)</option>
                <option value="BLOCK-B PARENTS">Block-B Boys Hostel Parents Only</option>
                <option value="BLOCK-G PARENTS">Block-G Girls Residency Parents Only</option>
                <option value="ALL SECURITY STAFF">All Gate Security Guards</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Message Content</label>
              <textarea
                rows={4}
                required
                placeholder="Type the message to send via WhatsApp Cloud API..."
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
                className="w-full bg-gray-800 text-white px-3.5 py-2.5 rounded-xl border border-gray-700"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
            >
              <Send className="w-4 h-4" />
              <span>Dispatch WhatsApp Alert</span>
            </button>
          </form>
        </div>

        {/* Integration Statuses */}
        <div className="glass-card p-6 rounded-3xl border border-gray-800 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white">Cloud Integration Statuses</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-gray-800/40 border border-gray-700/50 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Gemini 1.5 Flash AI</span>
                <span className="text-[10px] text-gray-400">Automated Complaint Triage & Chatbot</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 text-[10px]">
                ACTIVE
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-gray-800/40 border border-gray-700/50 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">WhatsApp Cloud API Gateway</span>
                <span className="text-[10px] text-gray-400">Parent Entry/Exit Instant SMS</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 text-[10px]">
                CONNECTED
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-gray-800/40 border border-gray-700/50 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Main Gate QR Camera Scanner</span>
                <span className="text-[10px] text-gray-400">HTML5 Web Camera & Scanner Engine</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 text-[10px]">
                OPERATIONAL
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-gray-800/40 border border-gray-700/50 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Night Curfew Threshold</span>
                <span className="text-[10px] text-gray-400">Auto SMS Parent Alert Time</span>
              </div>
              <span className="font-mono font-bold text-amber-400">09:30 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
