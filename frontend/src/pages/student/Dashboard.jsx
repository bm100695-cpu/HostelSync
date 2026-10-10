import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [passes, setPasses] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [messMenu, setMessMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [passRes, compRes, messRes] = await Promise.all([
        api.getPasses(),
        api.getComplaints(),
        api.getMessMenu()
      ]);
      
      if (passRes.success) setPasses(passRes.data);
      if (compRes.success) setComplaints(compRes.data);
      if (messRes.success) setMessMenu(messRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  const activePass = passes.find(p => p.status === 'APPROVED' || p.status === 'CHECKED_OUT');
  const openComplaintsCount = complaints.filter(c => c.status !== 'RESOLVED' && c.status !== 'CLOSED').length;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="border border-gray-300 p-4 mb-4 flex justify-between items-center bg-gray-50">
        <div>
          <h2 className="text-xl font-bold">Welcome, {user?.name || 'Student'}</h2>
          <p className="text-sm text-gray-600">Room: {user?.room || 'N/A'}</p>
        </div>
        <div className="space-x-2">
          <Link to="/student/gate-pass" className="bg-green-600 text-white px-3 py-1 text-sm border border-green-700 hover:bg-green-700">
            Apply Pass
          </Link>
          <Link to="/student/complaints" className="bg-blue-600 text-white px-3 py-1 text-sm border border-blue-700 hover:bg-blue-700">
            New Complaint
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="border border-gray-300 p-3 bg-white">
          <div className="text-sm text-gray-500">Gate Pass</div>
          <div className="font-bold">{activePass ? 'Active' : 'None'}</div>
        </div>
        <div className="border border-gray-300 p-3 bg-white">
          <div className="text-sm text-gray-500">Open Complaints</div>
          <div className="font-bold">{openComplaintsCount}</div>
        </div>
        <div className="border border-gray-300 p-3 bg-white">
          <div className="text-sm text-gray-500">Mess Rating</div>
          <div className="font-bold">4.8 / 5.0</div>
        </div>
        <div className="border border-gray-300 p-3 bg-white">
          <div className="text-sm text-gray-500">Attendance</div>
          <div className="font-bold">100%</div>
        </div>
      </div>

      <div className="flex gap-6">
        
        {/* Main Content Area */}
        <div className="w-2/3 flex flex-col gap-6">
          
          {/* Active Pass Section */}
          <div className="border border-gray-300 p-4 bg-white">
            <h3 className="font-bold border-b border-gray-200 pb-2 mb-3">Current Gate Pass</h3>
            {activePass ? (
              <div className="bg-green-50 border border-green-200 p-3 flex justify-between items-center">
                <div>
                  <strong>{activePass.type}</strong>
                  <br />
                  <span className="text-sm">To: {activePass.destination}</span>
                </div>
                <button className="bg-gray-800 text-white px-3 py-1 text-sm">
                  Show QR
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No active pass.</p>
            )}
          </div>

          {/* Complaints Section */}
          <div className="border border-gray-300 p-4 bg-white">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-3">
              <h3 className="font-bold">Recent Complaints</h3>
              <Link to="/student/complaints" className="text-sm text-blue-600 underline">View All</Link>
            </div>
            
            <ul className="space-y-2">
              {complaints.slice(0, 3).map((comp) => (
                <li key={comp.id} className="border border-gray-200 p-2 text-sm bg-gray-50 flex justify-between">
                  <span>{comp.title}</span>
                  <span className="text-gray-500">[{comp.status}]</span>
                </li>
              ))}
              {complaints.length === 0 && <li className="text-sm text-gray-500">No complaints.</li>}
            </ul>
          </div>
        </div>

        {/* Sidebar Area (Mess Menu) */}
        <div className="w-1/3 border border-gray-300 p-4 bg-white h-fit">
          <h3 className="font-bold border-b border-gray-200 pb-2 mb-3">Today's Mess Menu</h3>
          
          <div className="space-y-3 text-sm">
            <div>
              <div className="font-bold text-gray-600">Breakfast</div>
              <div>Masala Dosa, Sambar, Tea</div>
            </div>
            <hr className="border-gray-100" />
            <div>
              <div className="font-bold text-gray-600">Lunch</div>
              <div>Paneer Butter Masala, Dal, Rice, Roti</div>
            </div>
            <hr className="border-gray-100" />
            <div>
              <div className="font-bold text-gray-600">Snacks</div>
              <div>Veg Cutlet, Masala Chai</div>
            </div>
            <hr className="border-gray-100" />
            <div>
              <div className="font-bold text-gray-600">Dinner</div>
              <div>Kadhai Paneer, Jeera Rice</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};