import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

export const StudentRegistration = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    email: '',
    phone: '',
    branch: '',
    year: '',
    block: '',
    room: '',
    parentName: '',
    parentPhone: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setMessage('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      setLoading(true);

      const {
        confirmPassword,
        ...studentData
      } = formData;

      const res = await api.registerStudent(studentData);

      if (!res.success) {
        setError(res.message || 'Registration failed');
        return;
      }

      localStorage.setItem(
        'hostelsync_token',
        res.token
      );

      localStorage.setItem(
        'hostelsync_user',
        JSON.stringify(res.user)
      );

      setMessage('Registration successful!');

      setTimeout(() => {
        navigate('/');
      }, 1000);

    } catch (err) {
      console.error(err);
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">

      <div className="w-full max-w-4xl">

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">

          <h1 className="text-3xl font-bold text-white text-center">
            Student Registration
          </h1>

          <p className="text-gray-400 text-center mt-2">
            Create your HostelSync account
          </p>

          {error && (
            <div className="mt-5 p-3 rounded-lg bg-red-500/10 border border-red-500 text-red-400">
              {error}
            </div>
          )}

          {message && (
            <div className="mt-5 p-3 rounded-lg bg-green-500/10 border border-green-500 text-green-400">
              {message}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8"
          >

            <input
              className="input"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              className="input"
              name="rollNo"
              placeholder="Roll Number"
              value={formData.rollNo}
              onChange={handleChange}
              required
            />

            <input
              className="input"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              className="input"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <input
              className="input"
              name="branch"
              placeholder="Branch"
              value={formData.branch}
              onChange={handleChange}
              required
            />

            <input
              className="input"
              name="year"
              placeholder="Year"
              value={formData.year}
              onChange={handleChange}
              required
            />

            <input
              className="input"
              name="block"
              placeholder="Hostel Block"
              value={formData.block}
              onChange={handleChange}
            />

            <input
              className="input"
              name="room"
              placeholder="Room Number"
              value={formData.room}
              onChange={handleChange}
            />

            <input
              className="input"
              name="parentName"
              placeholder="Parent Name"
              value={formData.parentName}
              onChange={handleChange}
              required
            />

            <input
              className="input"
              name="parentPhone"
              placeholder="Parent Phone"
              value={formData.parentPhone}
              onChange={handleChange}
              required
            />

            <input
              className="input"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <input
              className="input"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="md:col-span-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold disabled:opacity-50"
            >
              {loading
                ? 'Creating Account...'
                : 'Create Student Account'}
            </button>

          </form>

          <p className="text-center text-gray-400 mt-6">
            Already have an account?{' '}

            <Link
              to="/login"
              className="text-emerald-400 hover:underline"
            >
              Login
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
};