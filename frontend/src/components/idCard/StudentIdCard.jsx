import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, Sparkles, Building, Phone, Calendar } from 'lucide-react';

export const StudentIdCard = ({ user }) => {
  if (!user) return null;

  return (
    <div className="w-full max-w-sm rounded-3xl overflow-hidden p-0.5 bg-gradient-to-tr from-brand-500 via-indigo-500 to-purple-500 shadow-2xl relative">
      <div className="bg-gradient-to-b from-gray-900 via-[#0B0F19] to-gray-950 p-5 rounded-[23px] text-white flex flex-col justify-between h-[420px] relative">
        {/* Holographic Header */}
        <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center font-bold text-xs">
              HS
            </div>
            <div>
              <h4 className="text-xs font-black tracking-wider uppercase bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                HOSTEL DIGITAL PASS
              </h4>
              <p className="text-[9px] text-brand-400 font-semibold tracking-widest">SMART CAMPUS IDENTITY</p>
            </div>
          </div>
          <ShieldCheck className="w-5 h-5 text-brand-400" />
        </div>

        {/* Center Profile & QR */}
        <div className="flex gap-4 items-center my-3">
          <div className="relative">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt={user.name}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-brand-500/50 shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-emerald-500 text-[9px] font-bold text-white">
              ACTIVE
            </div>
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <h3 className="font-bold text-sm text-white truncate">{user.name}</h3>
            <p className="text-[11px] text-brand-400 font-mono font-semibold">{user.rollNo || '21BCE1042'}</p>
            <p className="text-[10px] text-gray-400 truncate">{user.branch || 'Computer Science & Eng'}</p>
            <span className="inline-block px-2 py-0.5 rounded-full bg-gray-800 text-gray-300 text-[9px] font-medium border border-gray-700">
              {user.year || '3rd Year'}
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-2 bg-gray-800/40 p-3 rounded-2xl border border-gray-800 text-[11px]">
          <div>
            <span className="text-gray-400 text-[9px] block">HOSTEL BLOCK</span>
            <span className="font-semibold text-gray-200">{user.block || 'Block-B'}</span>
          </div>
          <div>
            <span className="text-gray-400 text-[9px] block">ROOM NUMBER</span>
            <span className="font-semibold text-emerald-400">{user.room || 'B-304'}</span>
          </div>
          <div>
            <span className="text-gray-400 text-[9px] block">PARENT PHONE</span>
            <span className="font-medium text-gray-300">{user.parentPhone || '+91 98765 00001'}</span>
          </div>
          <div>
            <span className="text-gray-400 text-[9px] block">MESS PLAN</span>
            <span className="font-medium text-amber-400">{user.messPlan || 'Full Board'}</span>
          </div>
        </div>

        {/* Bottom QR Code & Barcode Signature */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-800/80">
          <div className="text-left">
            <span className="text-[9px] text-gray-400 block">HOSTEL RESIDENT ID</span>
            <span className="text-[10px] font-mono text-gray-300 font-semibold">{user.id}</span>
          </div>
          <div className="p-1 bg-white rounded-lg">
            <QRCodeSVG value={`HOSTELSYNC-ID-${user.id}-${user.rollNo}`} size={42} />
          </div>
        </div>
      </div>
    </div>
  );
};
