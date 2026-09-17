import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [email, setEmail] = useState('student@hostelsync.com');
  const [password, setPassword] = useState('password123');
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
      desc: 'Gate passes, Leave, AI complaints & Mess',
      icon: GraduationCap,
      color: 'bg-emerald-50/80 hover:bg-emerald-100/70 border-emerald-200 text-emerald-800',
      iconBg: 'bg-emerald-100 text-emerald-700',
    },
    {
      role: 'warden',
      title: 'Warden Portal',
      user: 'Brijsh Maurya',
      desc: 'Approvals, Roll-call & WhatsApp alerts',
      icon: UserCheck,
      color: 'bg-indigo-50/80 hover:bg-indigo-100/70 border-indigo-200 text-indigo-800',
      iconBg: 'bg-indigo-100 text-indigo-700',
    },
    {
      role: 'admin',
      title: 'Admin Portal',
      user: 'Dean Student Affairs',
      desc: 'Rooms, Users, Mess & BI Analytics',
      icon: ShieldAlert,
      color: 'bg-purple-50/80 hover:bg-purple-100/70 border-purple-200 text-purple-800',
      iconBg: 'bg-purple-100 text-purple-700',
    },
    {
      role: 'staff',
      title: 'Security / Staff',
      user: 'Vikram Singh (Guard)',
      desc: 'Camera QR Code Pass Scanner & Logs',
      icon: ScanLine,
      color: 'bg-amber-50/80 hover:bg-amber-100/70 border-amber-200 text-amber-800',
      iconBg: 'bg-amber-100 text-amber-700',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background soft ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-100/60 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-100/60 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-5xl z-10 space-y-8">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Next-Gen Smart Campus Hostel Platform</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            HOSTEL<span className="text-brand-600">SYNC</span>
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Unified hostel operations with AI triage, digital QR passes, WhatsApp alerts, and attendance management.
          </p>
        </div>

        {/* 1-Click Role Login Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              🚀 1-Click Instant Demo Login
            </span>
            <span className="text-[11px] text-brand-600 font-semibold">Select any persona to test live</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {quickRoles.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.role}
                  onClick={() => handleQuickDemoLogin(item.role)}
                  disabled={submitting}
                  className={`p-4 rounded-3xl ${item.color} border text-left transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between group relative shadow-sm`}
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
        <div className="max-w-md mx-auto glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl relative bg-white">
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
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="student@hostelsync.com"
                  className="w-full bg-slate-50 text-slate-900 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-brand-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 text-slate-900 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-brand-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-500 hover:to-emerald-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-brand-500/25 transition duration-200"
            >
              {submitting ? 'Authenticating...' : 'Sign In to Portal'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
            <span>Powered by Node.js, Express, React, Vite & Gemini AI</span>
          </div>
        </div>
      </div>
    </div>
  );
};
