import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, ShieldCheck, Clock, Download, Share2, CheckCircle2 } from 'lucide-react';

export const QRModal = ({ pass, onClose }) => {
  if (!pass) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="w-full max-w-sm glass-card bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl relative flex flex-col items-center text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Security Tag */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-4">
          <ShieldCheck className="w-4 h-4" />
          <span>VERIFIED DIGITAL PASS</span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 tracking-tight">{pass.type || 'Gate Pass'}</h3>
        <p className="text-xs text-slate-400 mt-0.5 font-mono">Pass #{pass.id}</p>

        {/* QR Code Container */}
        <div className="my-5 p-4 bg-white rounded-2xl shadow-md border border-slate-200 ring-4 ring-emerald-50 relative">
          <QRCodeSVG
            value={pass.qrCodeData || pass.id}
            size={190}
            level="H"
            includeMargin={true}
          />
          <div className="absolute inset-0 border-2 border-dashed border-emerald-400/40 rounded-2xl pointer-events-none animate-pulse"></div>
        </div>

        {/* Pass Details */}
        <div className="w-full space-y-2 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-left">
          <div className="flex justify-between">
            <span className="text-slate-500">Student:</span>
            <span className="text-slate-800 font-bold">{pass.studentName} ({pass.rollNo})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Room:</span>
            <span className="text-slate-800 font-medium">{pass.room} ({pass.block})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Destination:</span>
            <span className="text-slate-800 font-medium truncate max-w-[170px]">{pass.destination}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Expected In:</span>
            <span className="text-emerald-600 font-bold">
              {new Date(pass.expectedInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Action Tip */}
        <p className="text-[11px] text-slate-500 mt-4 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Present this QR Code to Main Security Guard at gate.</span>
        </p>

        <button
          onClick={onClose}
          className="mt-5 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-600/25"
        >
          Done / Close
        </button>
      </div>
    </div>
  );
};
