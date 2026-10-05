import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { BarChart3, TrendingUp, Users, Activity, Utensils, ShieldCheck } from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.getAnalytics();
        if (res.success) setAnalytics(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAnalytics();
  }, []);

  const passesData = analytics?.passesByDay || [];
  const complaintsData = analytics?.complaintsByCategory || [];

  return (
    <div className="space-y-6">
      <div>
        {/* Updated to text-gray-900 for light theme */}
        <h1 className="text-2xl font-bold text-gray-900">Campus Business Intelligence & Analytics</h1>
        <p className="text-xs text-gray-500 mt-1">
          In-depth statistics on resident movements, maintenance turnaround times, and dining satisfaction.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Updated chart container to white cards */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-gray-900">Weekly Gate Outing Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={passesData}>
                <XAxis dataKey="day" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} />
                {/* Updated Tooltip to light mode styles */}
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderColor: '#e5e7eb', 
                    borderRadius: '12px', 
                    fontSize: '12px',
                    color: '#111827'
                  }} 
                  itemStyle={{ color: '#111827' }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Updated chart container to white cards */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-gray-900">Maintenance Issues by Department</h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={complaintsData}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {complaintsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill || '#10b981'} />
                  ))}
                </Pie>
                {/* Updated Tooltip to light mode styles */}
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderColor: '#e5e7eb', 
                    borderRadius: '12px', 
                    fontSize: '12px',
                    color: '#111827'
                  }} 
                  itemStyle={{ color: '#111827' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};