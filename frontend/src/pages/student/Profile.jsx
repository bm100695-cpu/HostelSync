import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { StudentIdCard } from '../../components/idCard/StudentIdCard';
import { Phone, Download } from 'lucide-react';
import { ProfileUpload } from '../../components/ProfileUpload'; 

export const StudentProfile = () => {
  const { user } = useAuth();

  // Automatic Name Avatar
  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Student')}&background=F3F4F6&color=374151`;

  // 👇 NAYA CODE: Image link fix karne ka logic 👇
  // IMPORTANT: Agar aapka backend kisi aur port par hai (e.g. 8000), toh isko uske hisaab se change karein.
  const backendBaseUrl = 'http://localhost:5000'; 
  
  // Check karte hain ki user ke paas photo hai ya nahi, aur proper link banate hain
  const getProfileImageUrl = () => {
    if (!user?.profileImage) return defaultAvatar;
    if (user.profileImage.startsWith('http')) return user.profileImage; // Agar pehle se pura URL hai
    
    // Agar relative path hai (/uploads/...) toh backend ka URL jod dein
    const formattedPath = user.profileImage.startsWith('/') ? user.profileImage : `/${user.profileImage}`;
    return `${backendBaseUrl}${formattedPath}`;
  };

  const finalProfileImage = getProfileImageUrl();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Profile & Digital ID</h1>
        <p className="text-sm text-gray-500 mt-1">
          Registered campus credentials, hostel record, and verified emergency guardian contacts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Digital ID Card Preview & Actions */}
        <div className="space-y-4 flex flex-col items-center">
          <StudentIdCard user={user} />
          
          <button
            onClick={() => window.print()}
            className="w-full max-w-sm py-2.5 rounded-xl bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium border border-gray-300 flex items-center justify-center gap-2 transition shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download / Print Digital Pass</span>
          </button>

          <div className="w-full max-w-sm">
            <ProfileUpload />
          </div>
        </div>

        {/* Right 2 Columns: Full Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            
            {/* Profile Info Header */}
              <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                <img
                  src={user?.profileImage || defaultAvatar}
                  alt={user?.name || 'Profile'}
                  onError={(e) => { e.target.src = defaultAvatar; e.target.onerror = null; }}
                  // 👇 FIX: Yahan 'w-20 h-20 rounded-full object-cover' lagana sabse zaroori hai 👇
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 bg-gray-50 flex-shrink-0" 
                />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                  <p className="text-sm text-green-600 font-medium mt-0.5">{user?.rollNo}</p>
                </div>
              </div>

            {/* Academic & Room Information (Outlined Boxes) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-xl border border-gray-200 space-y-1">
                <span className="text-gray-500 block text-xs">Academic Department</span>
                <p className="text-gray-900 font-medium">{user?.branch}</p>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 space-y-1">
                <span className="text-gray-500 block text-xs">Academic Year</span>
                <p className="text-gray-900 font-medium">{user?.year}</p>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 space-y-1">
                <span className="text-gray-500 block text-xs">Hostel Block & Room</span>
                <p className="text-gray-900 font-medium">
                  {user?.room} {user?.block ? `(${user.block})` : ''}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 space-y-1">
                <span className="text-gray-500 block text-xs">Dietary & Mess Type</span>
                <p className="text-amber-600 font-medium">
                  {user?.diet} {user?.messPlan ? `(${user.messPlan})` : ''}
                </p>
              </div>
            </div>

            {/* Contact & Parent Information (Filled Gray Boxes) */}
            <div className="pt-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-4">
                <Phone className="w-4 h-4 text-green-500" />
                <span>Contact & Guardian Emergency Registry</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-4 rounded-xl bg-gray-100 border border-gray-200/60">
                  <span className="text-gray-500 text-xs block mb-1">Student Phone</span>
                  <span className="text-gray-800 font-medium">{user?.phone}</span>
                </div>

                <div className="p-4 rounded-xl bg-gray-100 border border-gray-200/60">
                  <span className="text-gray-500 text-xs block mb-1">Campus Email</span>
                  <span className="text-gray-800 font-medium">{user?.email}</span>
                </div>

                <div className="p-4 rounded-xl bg-gray-100 border border-gray-200/60">
                  <span className="text-gray-500 text-xs block mb-1">Parent / Guardian Name</span>
                  <span className="text-gray-800 font-medium">{user?.parentName}</span>
                </div>

                <div className="p-4 rounded-xl bg-gray-100 border border-gray-200/60">
                  <span className="text-gray-500 text-xs block mb-1">Parent WhatsApp Contact</span>
                  <span className="text-green-600 font-medium">
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