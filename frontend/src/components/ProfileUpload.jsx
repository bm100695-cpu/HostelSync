import React, { useState } from 'react';
// 👇 YAHAN PATH THEEK KAR DIYA HAI (Sirf ek bar ../ hai) 👇
import { useAuth } from '../context/AuthContext'; 
import { Upload, Loader } from 'lucide-react';

export const ProfileUpload = () => {
  const { user, setUser } = useAuth();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // File select karne par ye function chalta hai
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Photo save karne wala function (Frontend Logic)
  const handleUpload = async () => {
    if (!file) return alert("Pehle ek photo select karein!");

    // Photo file bhejne ke liye FormData dabbi banana zaroori hai
    const formData = new FormData();
    // 'profileImage' naam backend ke API code (.single('profileImage')) se match hona chahiye
    formData.append('profileImage', file); 

   try {
      setUploading(true);
      
      const response = await fetch(`http://localhost:5000/api/update-photo/${user?._id || user?.id}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Profile photo successfully update ho gayi!");
        setFile(null);
        // Is line se page turant refresh ho jayega aur nayi photo dikh jayegi
        window.location.reload(); 
      } else {
        alert("Upload fail ho gaya: " + data.message);
      }
    } catch (error) {
      console.error("Frontend Error:", error);
      // F12 dabane par Console me asli error dikhega
      alert("Error aayi hai. Kripya F12 dabakar Console check karein.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-6 p-5 border border-gray-800 rounded-2xl bg-gray-800/40">
      <h3 className="text-sm font-bold text-white mb-4">Update Profile Photo</h3>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="text-xs text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/10 file:text-emerald-400 hover:file:bg-emerald-500/20 cursor-pointer"
        />
        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition ${
            uploading || !file 
              ? 'bg-gray-700 cursor-not-allowed text-gray-400' 
              : 'bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/20'
          }`}
        >
          {uploading ? <Loader className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? 'Uploading...' : 'Save Photo'}
        </button>
      </div>
    </div>
  );
};