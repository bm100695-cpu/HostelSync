import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Upload, Loader } from 'lucide-react';

export const ProfileUpload = () => {
  // 👇 FIX: Yahan user ke sath setUser add kar diya hai
  const { user, setUser } = useAuth();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Pehle ek photo select karein!");
    setUploading(true);

    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const response = await fetch(`http://localhost:5000/api/update-photo/${user?._id || user?.id || 'usr-std-1'}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Profile photo successfully update ho gayi!");
        setFile(null);

        // NAYA LOGIC: Bina refresh kiye photo update hogi
        const newImageUrl = data.profileImage || data.user?.profileImage;

        if (setUser) {
          const updatedUser = { ...user, profileImage: newImageUrl };
          setUser(updatedUser); // Context update ho jayega
          localStorage.setItem('hostelsync_user', JSON.stringify(updatedUser)); // Storage update ho jayega
        } else {
          window.location.reload(); // Fallback agar setUser miss ho jaye
        }

      } else {
        alert("Upload fail ho gaya: " + (data.message || 'Error'));
      }
    } catch (error) {
      console.error("Frontend Error:", error);
      alert("Error aayi hai. Kripya F12 dabakar Console check karein.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-4 p-5 border border-gray-200 rounded-2xl bg-gray-50 shadow-sm">
      <h3 className="text-sm font-bold text-gray-700 mb-4">Update Profile Photo</h3>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="text-xs text-gray-600 w-full file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200 cursor-pointer transition"
        />
        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white transition min-w-[140px] ${
            uploading || !file
              ? 'bg-gray-300 cursor-not-allowed text-gray-500'
              : 'bg-green-600 hover:bg-green-500 shadow-md shadow-green-500/20'
          }`}
        >
          {uploading ? <Loader className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? 'Uploading...' : 'Save Photo'}
        </button>
      </div>
    </div>
  );
};