import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Shield, 
  Sparkles, 
  GraduationCap, 
  UserCheck, 
  ShieldAlert, 
  ScanLine, 
  ArrowRight,
  Lock,
  Mail,
  CheckCircle2,
  Building,
  KeyRound
} from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, quickLogin } = useAuth();
  const navigate = useNavigate();

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login(email, password);
      redirectByRole(user.role);
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemoLogin = async (role) => {
    setError('');
    setSubmitting(true);
    try {
      const user = await quickLogin(role);
      redirectByRole(user.role);
    } catch (err) {
      setError('Could not complete quick login.');
    } finally {
      setSubmitting(false);
    }
  };

  const redirectByRole = (role) => {
    if (role === 'student') navigate('/student/dashboard');
    else if (role === 'warden') navigate('/warden/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
    else if (role === 'staff') navigate('/staff/scanner');
    else navigate('/student/dashboard');
  };

  const quickRoles = [
    {
      role: 'student',
      title: 'Student Portal',
      user: 'Brijesh',
      desc: 'Leave requests and mess details',
      icon: GraduationCap,
      color: 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800',
      iconBg: 'bg-emerald-50 text-emerald-700',
    },
    {
      role: 'warden',
      title: 'Warden Portal',
      user: 'Brijsh Maurya',
      desc: 'Approve leave requests and manage attendance',
      icon: UserCheck,
      color: 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800',
      iconBg: 'bg-emerald-50 text-emerald-700',
    },
    {
      role: 'admin',
      title: 'Admin Portal',
      user: 'Dean Student Affairs',
      desc: 'Manage rooms, students and hostel records',
      icon: ShieldAlert,
      color: 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800',
      iconBg: 'bg-emerald-50 text-emerald-700',
    },
    {
      role: 'staff',
      title: 'Security / Staff',
      user: 'Vikram  (Guard)',
      desc: 'Verify gate passes and view entry logs',
      icon: ScanLine,
      color: 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800',
      iconBg: 'bg-emerald-50 text-emerald-700',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      
      <div className="w-full max-w-5xl z-10 space-y-8">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          
         <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
             Hostel<span className="text-emerald-700">Sync</span>
         </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
              College hostel management portal
          </p>
        </div>

        {/* 1-Click Role Login Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Choose a demo account
            </span>
           <span className="text-[11px] text-slate-500 font-medium">
                    Select a role to explore the portal
           </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {quickRoles.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.role}
                  onClick={() => handleQuickDemoLogin(item.role)}
                  disabled={submitting}
                  className={`p-4 rounded-xl ${item.color} border text-left transition-colors flex flex-col justify-between group hover:border-emerald-300`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-2xl ${item.iconBg}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm transition">
                      {item.title}
                    </h3>
                    <p className="text-[11px] font-semibold mt-0.5 opacity-90">{item.user}</p>
                    <p className="text-[10px] opacity-75 mt-1 line-clamp-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Manual Login Card */}
        <div className="max-w-md mx-auto rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm bg-white">
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-slate-900">Manual Sign In</h2>
            <p className="text-xs text-slate-500 mt-1">Or enter registered campus credentials</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleManualLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Campus Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="student@hostelsync.com"
                  className="w-full bg-white text-slate-900 pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                 className="w-full bg-white text-slate-900 pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-slate-400 focus:ring-0 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm transition-colors disabled:opacity-60"
            >
              {submitting ? 'Authenticating...' : 'Sign In to Portal'}
            </button>
            <p className="text-center text-gray-500 mt-6">
              Don't have an account?{' '}
              <Link
                 to="/student-registration"
                 className="text-emerald-600 font-semibold hover:underline"
                 >
                Create Account
              </Link>
            </p>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
                HostelSync · College Hostel Management
          </div>
        </div>
      </div>
    </div>
  );
};
