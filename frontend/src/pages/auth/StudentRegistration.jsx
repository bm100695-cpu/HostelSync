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

  // Simple white + green input design
  const inputClass = `
    w-full h-12 px-4 rounded-lg
    bg-white
    border border-gray-300
    text-gray-900
    placeholder-gray-400
    outline-none
    transition-all duration-200
    focus:border-emerald-500
    focus:ring-2 focus:ring-emerald-100
    hover:border-emerald-300
  `;

  const labelClass = `
    block text-sm font-semibold
    text-gray-700 mb-2
  `;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-5xl">

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">

          {/* Green Top Border */}
          <div className="h-1.5 bg-emerald-500"></div>

          <div className="p-6 sm:p-8 md:p-10">

            {/* Header */}
            <div className="text-center mb-8">

              {/* Logo */}
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 mb-4">
                <span className="text-2xl">🏠</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Student Registration
              </h1>

              <p className="text-gray-500 mt-2">
                Create your{' '}
                <span className="text-emerald-600 font-semibold">
                  HostelSync
                </span>{' '}
                account
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                ⚠️ {error}
              </div>
            )}

            {/* Success */}
            {message && (
              <div className="mb-6 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm">
                ✓ {message}
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5"
            >

              {/* Full Name */}
              <div>
                <label className={labelClass}>
                  Full Name
                </label>

                <input
                  className={inputClass}
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Roll Number */}
              <div>
                <label className={labelClass}>
                  Roll Number
                </label>

                <input
                  className={inputClass}
                  name="rollNo"
                  placeholder="Enter roll number"
                  value={formData.rollNo}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className={labelClass}>
                  Email Address
                </label>

                <input
                  className={inputClass}
                  type="email"
                  name="email"
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className={labelClass}>
                  Phone Number
                </label>

                <input
                  className={inputClass}
                  type="tel"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Branch */}
              <div>
                <label className={labelClass}>
                  Branch
                </label>

                <select
                  className={inputClass}
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Branch</option>
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="ECE">ECE</option>
                  <option value="ME">ME</option>
                </select>
              </div>

              {/* Year */}
              <div>
                <label className={labelClass}>
                  Academic Year
                </label>

                <select
                  className={inputClass}
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>

              {/* Hostel */}
              <div>
                <label className={labelClass}>
                  Hostel
                </label>

                <select
                  className={inputClass}
                  name="block"
                  value={formData.block}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Hostel</option>
                  <option value="Hostel 1">Hostel 1</option>
                  <option value="Hostel 2">Hostel 2</option>
                  <option value="Hostel 3">Hostel 3</option>
                  <option value="Hostel 4">Hostel 4</option>
                </select>
              </div>

              {/* Room */}
              <div>
                <label className={labelClass}>
                  Room Number
                </label>

                <select
                  className={inputClass}
                  name="room"
                  value={formData.room}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Room Number
                  </option>

                  {Array.from(
                    { length: 60 },
                    (_, i) => (
                      <option
                        key={i + 1}
                        value={i + 1}
                      >
                        Room {i + 1}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Password */}
              <div>
                <label className={labelClass}>
                  Password
                </label>

                <input
                  className={inputClass}
                  type="password"
                  name="password"
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className={labelClass}>
                  Confirm Password
                </label>

                <input
                  className={inputClass}
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Button */}
              <div className="md:col-span-2 pt-3">

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    w-full h-12
                    rounded-lg
                    bg-emerald-500
                    hover:bg-emerald-600
                    text-white
                    font-semibold
                    transition-all duration-200
                    shadow-md
                    hover:shadow-lg
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >
                  {loading
                    ? 'Creating Account...'
                    : 'Create Student Account'}
                </button>

              </div>

            </form>

            {/* Login */}
            <div className="text-center mt-7 pt-6 border-t border-gray-200">

              <p className="text-gray-500 text-sm">
                Already have an account?{' '}

                <Link
                  to="/login"
                  className="
                    text-emerald-600
                    font-semibold
                    hover:text-emerald-700
                    hover:underline
                  "
                >
                  Login
                </Link>
              </p>

            </div>

          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-xs mt-5">
          © {new Date().getFullYear()} HostelSync. All rights reserved.
        </p>

      </div>
    </div>
  );
};

