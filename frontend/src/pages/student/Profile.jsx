import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { StudentIdCard } from '../../components/idCard/StudentIdCard';
import { Phone, Download, UserCheck, Shield, GraduationCap, Building2, UtensilsCrossed, Mail } from 'lucide-react';
import { ProfileUpload } from '../../components/ProfileUpload'; 

export const StudentProfile = () => {
  const { user } = useAuth();

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Student')}&background=00897B&color=ffffff`;
  const backendBaseUrl = 'http://localhost:5000'; 
  
  const getProfileImageUrl = () => {
    if (!user?.profileImage) return defaultAvatar;
    if (user.profileImage.startsWith('http')) return user.profileImage;
    const formattedPath = user.profileImage.startsWith('/') ? user.profileImage : `/${user.profileImage}`;
    return `${backendBaseUrl}${formattedPath}`;
  };

  const finalProfileImage = getProfileImageUrl();

  return (
    <div className="w-full space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-[#00897B] bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-[#00897B]" />
              Digital Identity
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-semibold text-slate-500">
              HostelSync Verified Resident
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Student Profile & Digital ID
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Registered campus credentials, hostel record, and verified emergency guardian contacts.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="bg-[#00897B] hover:bg-[#00796B] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-sm hover:shadow transition flex items-center gap-2 shrink-0 w-full sm:w-auto justify-center"
        >
          <Download className="w-4 h-4" />
          <span>Print Digital Pass</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column: Digital ID Card Preview & Actions */}
        <div className="space-y-5 flex flex-col items-center">
          <div className="w-full flex justify-center">
            <StudentIdCard user={user} />
          </div>
          
          <div className="w-full max-w-sm">
            <ProfileUpload />
          </div>
        </div>

        {/* Right 2 Columns: Full Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            
            {/* Profile Info Header */}
            <div className="flex items-center gap-4 sm:gap-5 pb-6 border-b border-slate-100">
              <img
                src={finalProfileImage}
                alt={user?.name || 'Profile'}
                onError={(e) => { e.target.src = defaultAvatar; e.target.onerror = null; }}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200 bg-slate-50 shrink-0 shadow-xs" 
              />
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">{user?.name}</h2>
                <p className="text-sm text-[#00897B] font-bold mt-0.5 font-mono">{user?.rollNo || '21BCE1042'}</p>
                <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  Active Resident Status
                </span>
              </div>
            </div>

            {/* Academic & Room Information */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Academic & Allocation Record
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-1">
                  <span className="text-slate-500 block text-xs font-medium">Academic Department</span>
                  <p className="text-slate-900 font-bold">{user?.branch || 'Computer Science & Engineering'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-1">
                  <span className="text-slate-500 block text-xs font-medium">Academic Year</span>
                  <p className="text-slate-900 font-bold">{user?.year || '3rd Year'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-1">
                  <span className="text-slate-500 block text-xs font-medium">Hostel Block & Room</span>
                  <p className="text-slate-900 font-bold">
                    Room {user?.room || 'B-304'} {user?.block ? `(${user.block})` : '(Block-B)'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-1">
                  <span className="text-slate-500 block text-xs font-medium">Dietary & Mess Type</span>
                  <p className="text-[#00897B] font-bold">
                    {user?.diet || 'Vegetarian'} {user?.messPlan ? `(${user.messPlan})` : '(Standard Full Board)'}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact & Parent Information */}
            <div className="pt-2 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#00897B]" />
                <span>Contact & Guardian Emergency Registry</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-xs block mb-1 font-medium">Student Phone</span>
                  <span className="text-slate-900 font-bold">{user?.phone || '+91 98765 43210'}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-xs block mb-1 font-medium">Campus Email</span>
                  <span className="text-slate-900 font-bold truncate block">{user?.email || 'student@hostelsync.com'}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-xs block mb-1 font-medium">Parent / Guardian Name</span>
                  <span className="text-slate-900 font-bold">{user?.parentName || 'Rajesh Sharma'}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-xs block mb-1 font-medium">Parent WhatsApp Contact</span>
                  <span className="text-emerald-700 font-bold">
                    {user?.parentPhone || '+91 98765 00001'} (Verified)
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