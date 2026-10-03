import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { StudentIdCard } from '../../components/idCard/StudentIdCard';
import { Phone, Download } from 'lucide-react';
// 👇 NAYA CODE: Import add kiya 👇
import { ProfileUpload } from '../../components/ProfileUpload'; 
// 👆 👆 👆

export const StudentProfile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Student Profile & Digital ID</h1>
        <p className="text-xs text-gray-400 mt-1">
          Registered campus credentials, hostel record, and verified emergency guardian contacts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Digital ID Card Preview */}
        <div className="space-y-4 flex flex-col items-center">
          <StudentIdCard user={user} />
          <button
            onClick={() => window.print()}
            className="w-full max-w-sm py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold border border-gray-700 flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>Download / Print Digital Pass</span>
          </button>

          {/* 👇 NAYA CODE: Upload Button yahan add kiya 👇 */}
          <div className="w-full max-w-sm">
            <ProfileUpload />
          </div>
          {/* 👆 👆 👆 */}

        </div>

        {/* Right 2 Columns: Full Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-gray-800 space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-800">
              <img
                src={user?.profileImage || '/default-avatar.png'}
                alt={user?.name || 'Profile'}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-500/40"
              />
              <div>
                <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                <p className="text-xs text-brand-400 font-mono font-medium">{user?.rollNo}</p>
                {/* Dynamic Badge Verification */}
                {user?.isHostelResident && (
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                    VERIFIED HOSTEL RESIDENT
                  </span>
                )}
              </div>
            </div>

            {/* Academic & Room Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-gray-800/40 border border-gray-700/50 space-y-1">
                <span className="text-gray-400 font-medium">Academic Department</span>
                <p className="text-white font-semibold">{user?.branch}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-gray-800/40 border border-gray-700/50 space-y-1">
                <span className="text-gray-400 font-medium">Academic Year</span>
                <p className="text-white font-semibold">{user?.year}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-gray-800/40 border border-gray-700/50 space-y-1">
                <span className="text-gray-400 font-medium">Hostel Block & Room</span>
                <p className="text-white font-semibold">
                  {user?.room} {user?.block ? `(${user.block})` : ''}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-gray-800/40 border border-gray-700/50 space-y-1">
                <span className="text-gray-400 font-medium">Dietary & Mess Type</span>
                <p className="text-amber-400 font-semibold">
                  {user?.diet} {user?.messPlan ? `(${user.messPlan})` : ''}
                </p>
              </div>
            </div>

            {/* Contact & Parent Information */}
            <div className="pt-4 border-t border-gray-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-400" />
                <span>Contact & Guardian Emergency Registry</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-gray-800/30 border border-gray-700/40">
                  <span className="text-gray-400 text-[11px] block">Student Phone</span>
                  <span className="text-gray-200 font-medium">{user?.phone}</span>
                </div>

                <div className="p-3 rounded-xl bg-gray-800/30 border border-gray-700/40">
                  <span className="text-gray-400 text-[11px] block">Campus Email</span>
                  <span className="text-gray-200 font-medium">{user?.email}</span>
                </div>

                <div className="p-3 rounded-xl bg-gray-800/30 border border-gray-700/40">
                  <span className="text-gray-400 text-[11px] block">Parent / Guardian Name</span>
                  <span className="text-gray-200 font-medium">{user?.parentName}</span>
                </div>

                <div className="p-3 rounded-xl bg-gray-800/30 border border-gray-700/40">
                  <span className="text-gray-400 text-[11px] block">Parent WhatsApp Contact</span>
                  <span className="text-emerald-400 font-medium">
                    {user?.parentPhone} {user?.parentPhone && '(Verified)'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};