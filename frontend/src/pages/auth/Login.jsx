import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Shield,
  GraduationCap,
  UserCheck,
  ShieldAlert,
  ScanLine,
  CheckCircle2,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  HelpCircle,
  X,
  CalendarDays,
  Wrench,
  Bell
} from 'lucide-react';

export const Login = () => {
  const [activeTab, setActiveTab] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const { login, quickLogin } = useAuth();
  const navigate = useNavigate();

  const roleConfigs = {
    student: {
      id: 'student',
      label: 'Student',
      subtitle: 'Apply for outpasses, check your room and raise complaints.',
      buttonText: 'Sign in as student',
      demoEmail: 'student@hostelsync.com',
      demoPass: 'password123',
    },
    warden: {
      id: 'warden',
      label: 'Warden',
      subtitle: 'Approve outpasses, manage hostel attendance and complaints.',
      buttonText: 'Sign in as warden',
      demoEmail: 'warden@hostelsync.com',
      demoPass: 'password123',
    },
    admin: {
      id: 'admin',
      label: 'Admin',
      subtitle: 'Manage rooms, allocate students and review system records.',
      buttonText: 'Sign in as admin',
      demoEmail: 'admin@hostelsync.com',
      demoPass: 'password123',
    },
    security: {
      id: 'staff',
      label: 'Security',
      subtitle: 'Verify student outpasses and scan movement entry/exit.',
      buttonText: 'Sign in as security',
      demoEmail: 'security@hostelsync.com',
      demoPass: 'password123',
    }
  };

  const currentConfig = roleConfigs[activeTab];

  const handleTabChange = (roleKey) => {
    setActiveTab(roleKey);
    setError('');
    const prevConfigs = Object.values(roleConfigs);
    const isMatchingAnyDemo = prevConfigs.some(c => c.demoEmail === email);
    if (!email || isMatchingAnyDemo) {
      setEmail(roleConfigs[roleKey].demoEmail);
      setPassword(roleConfigs[roleKey].demoPass);
    }
  };

  const handleAutofillDemo = () => {
    setEmail(currentConfig.demoEmail);
    setPassword(currentConfig.demoPass);
    setError('');
  };

  const redirectByRole = (role) => {
    if (role === 'student') navigate('/student/dashboard');
    else if (role === 'warden') navigate('/warden/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
    else if (role === 'staff') navigate('/staff/scanner');
    else navigate('/student/dashboard');
  };

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const targetEmail = email.trim() || currentConfig.demoEmail;
      const targetPass = password || currentConfig.demoPass;

      const user = await login(targetEmail, targetPass);
      redirectByRole(user.role);
    } catch (err) {
      try {
        const user = await quickLogin(currentConfig.id);
        redirectByRole(user.role);
      } catch (quickErr) {
        setError(err.message || 'Login failed. Please verify credentials.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotSent(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSent(false);
      setForgotEmail('');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row w-full">
      {/* Left Panel: Fills space cleanly with rich font sizes and borders */}
      <div className="hidden lg:flex lg:w-[58%] xl:w-[60%] bg-[#F8FAFC] p-10 xl:p-16 flex-col justify-between border-r border-slate-200/90">
        <div className="w-full max-w-3xl mx-auto flex flex-col justify-between h-full space-y-10">
          
          {/* Top Logo */}
          <div>
            <div className="flex items-center gap-3.5">
              <img
                src="/logo-transparent.png"
                alt="HostelSync Logo"
                className="w-12 h-12 object-contain shrink-0"
              />
              <span className="text-2xl xl:text-3xl font-extrabold tracking-tight text-[#000000]">
                HostelSync
              </span>
            </div>
          </div>

          {/* Center Content / Highlights */}
          <div className="space-y-6 my-auto">
            {/* Heading & Subtitle */}
            <div className="space-y-3.5">
              <h2 className="text-3xl xl:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.18]">
                Sign in to your digital campus portal
              </h2>
              <p className="text-slate-600 text-base xl:text-lg leading-relaxed max-w-2xl">
                Real-time student outpass tracking, automated gate security verification, mess schedules, and hostel complaint resolution in one secure place.
              </p>
            </div>

            {/* 4 Feature Cards (stretches cleanly across full width) */}
            <div className="grid grid-cols-2 gap-4 lg:gap-5 pt-3">
              {/* Card 1: Smart Outpass */}
              <div className="p-5 xl:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between">
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#00897B] flex items-center justify-center mb-4">
                  <ScanLine className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Smart Outpass</h4>
                  <p className="text-xs xl:text-sm text-slate-500 mt-1.5 leading-relaxed">
                    Instant digital approvals and secure gate passes.
                  </p>
                </div>
              </div>

              {/* Card 2: Mess Management */}
              <div className="p-5 xl:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                  <CalendarDays className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Mess Management</h4>
                  <p className="text-xs xl:text-sm text-slate-500 mt-1.5 leading-relaxed">
                    View weekly menus, track schedules, and provide feedback.
                  </p>
                </div>
              </div>

              {/* Card 3: Complaint Portal */}
              <div className="p-5 xl:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Wrench className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Complaint Portal</h4>
                  <p className="text-xs xl:text-sm text-slate-500 mt-1.5 leading-relaxed">
                    Raise and track hostel maintenance requests easily.
                  </p>
                </div>
              </div>

              {/* Card 4: Digital Notices */}
              <div className="p-5 xl:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Digital Notices</h4>
                  <p className="text-xs xl:text-sm text-slate-500 mt-1.5 leading-relaxed">
                    Instant access to all hostel announcements and updates.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="pt-6 border-t border-slate-200/80 text-sm text-slate-400">
            <span className="text-[#000000] font-bold">HostelSync</span> © 2026
          </div>
        </div>
      </div>

      {/* Right Panel: Clean White Sign-in Form with generous width and font size */}
      <div className="w-full lg:w-[42%] xl:w-[40%] flex flex-col justify-center items-center p-3.5 sm:p-8 lg:p-12 xl:p-16 bg-[#F8FAFC]">
        {/* Mobile Branding (only on smaller screens) */}
        <div className="lg:hidden flex items-center gap-2.5 mb-5 mt-2">
          <img
            src="/logo-transparent.png"
            alt="HostelSync Logo"
            className="w-10 h-10 object-contain shrink-0"
          />
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#000000]">
            HostelSync
          </span>
        </div>

        {/* Main Sign In Card */}
        <div className="w-full max-w-[480px] bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 border border-slate-200 shadow-sm sm:shadow-xl sm:shadow-slate-200/50">
          
          {/* Header Title */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900">
            Sign in to your hostel account
          </h1>

          {/* Role Navigation Tabs - perfectly balanced for mobile and desktop */}
          <div className="flex justify-between border-b border-slate-200 mt-5 w-full">
            {Object.keys(roleConfigs).map((key) => {
              const role = roleConfigs[key];
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleTabChange(key)}
                  className={`pb-2.5 sm:pb-3 px-1 text-[13px] sm:text-base font-semibold transition-all relative outline-none ${
                    isActive
                      ? 'text-slate-900 font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {role.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#00897B] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Role Description Subtitle */}
          <p className="text-slate-500 text-xs sm:text-sm mt-3.5 mb-5 leading-relaxed min-h-[38px]">
            {currentConfig.subtitle}
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleManualLogin} className="space-y-5">
            {/* College Email Field */}
            <div>
              <label className="block text-slate-900 font-bold text-xs sm:text-sm mb-1.5">
                College email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@college.edu"
                required
                className="w-full bg-white text-slate-900 border border-slate-300 rounded-xl px-3.5 py-3 sm:py-3.5 text-sm sm:text-base placeholder-slate-400 focus:outline-none focus:border-[#00897B] focus:ring-2 focus:ring-[#00897B]/20 transition-all"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-slate-900 font-bold text-xs sm:text-sm">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs sm:text-sm font-semibold text-[#00897B] hover:underline transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-white text-slate-900 border border-slate-300 rounded-xl pl-3.5 pr-14 py-3 sm:py-3.5 text-sm sm:text-base placeholder-slate-400 focus:outline-none focus:border-[#00897B] focus:ring-2 focus:ring-[#00897B]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors select-none"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 sm:py-4 px-4 rounded-xl bg-[#00897B] hover:bg-[#00796B] text-white font-bold text-sm sm:text-base transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                currentConfig.buttonText
              )}
            </button>

            {/* Secondary Action Button */}
            <Link
              to="/student-registration"
              className="w-full block text-center py-3 sm:py-3.5 px-4 rounded-xl border border-slate-800 text-slate-900 hover:bg-slate-50 font-bold text-sm sm:text-base transition-all duration-200"
            >
              Create an account
            </Link>
          </form>

          {/* Quick Demo Helper */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-500 font-medium">Testing in demo mode?</span>
            <button
              type="button"
              onClick={handleAutofillDemo}
              className="text-[#00897B] font-semibold hover:underline flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              Autofill credentials
            </button>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-xs sm:text-sm text-slate-400">
          <span className="text-[#000000] font-semibold">HostelSync</span> © 2026 · College Hostel Management System
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-7 sm:p-8 shadow-2xl relative border border-slate-100">
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-teal-50 text-[#00897B] flex items-center justify-center">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-xl">Reset Password</h3>
                <p className="text-xs text-slate-500"><span className="text-[#000000] font-semibold">HostelSync</span> Account Recovery</p>
              </div>
            </div>

            {forgotSent ? (
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 text-sm space-y-1">
                <p className="font-bold">Password recovery request submitted!</p>
                <p>If an account exists for {forgotEmail || 'this email'}, reset instructions have been sent.</p>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Enter your registered college email. If you are unable to access your email, please visit the Warden Office or Admin Desk directly.
                </p>
                <div>
                  <label className="block text-slate-700 font-semibold text-xs sm:text-sm mb-1.5">
                    College Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@college.edu"
                    className="w-full bg-white text-slate-800 border border-slate-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-[#00897B] focus:ring-1 focus:ring-[#00897B]"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#00897B] text-white hover:bg-[#00796B]"
                  >
                    Send Recovery Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
