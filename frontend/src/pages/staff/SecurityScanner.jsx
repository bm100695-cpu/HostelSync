import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  ScanLine, 
  CheckCircle2, 
  XCircle, 
  Camera, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRightLeft,
  User,
  Clock,
  Sparkles
} from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export const SecurityScanner = () => {
  const { user } = useAuth();
  const [scanResult, setScanResult] = useState(null);
  const [manualCode, setManualCode] = useState('');
  const [action, setAction] = useState('EXIT');
  const [scanning, setScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyPass = async (codeToVerify) => {
    const code = codeToVerify || manualCode;
    if (!code) return;

    setErrorMsg('');
    setLoading(true);
    try {
      const res = await api.scanQR(code, action);
      if (res.success) {
        setScanResult(res);
        setManualCode('');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Pass validation failed.');
      setScanResult(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let scanner = null;
    if (scanning) {
      scanner = new Html5QrcodeScanner(
        'qr-reader',
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );
      scanner.render(
        (decodedText) => {
          scanner.clear();
          setScanning(false);
          handleVerifyPass(decodedText);
        },
        (error) => {
          // ignore stream scan ticks
        }
      );
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(e => console.warn(e));
      }
    };
  }, [scanning, action]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">Main Gate QR Scanner</h1>
            <span className="px-3 py-1 rounded-full bg-teal-50 text-[#00897B] text-xs font-bold border border-teal-200/80">
              GATE #1 ACTIVE
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Scan student digital QR gate pass for instant entry/exit clearance & parent WhatsApp dispatch.
          </p>
        </div>

        {/* Action Toggle (EXIT vs ENTRY) */}
        <div className="flex items-center p-1.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <button
            onClick={() => setAction('EXIT')}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition ${
              action === 'EXIT'
                ? 'bg-[#00897B] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Gate Outflow (EXIT)
          </button>
          <button
            onClick={() => setAction('ENTRY')}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition ${
              action === 'ENTRY'
                ? 'bg-[#00897B] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Gate Return (ENTRY)
          </button>
        </div>
      </div>

      {/* Main Scanner & Manual Lookup Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Camera & Manual Pass Input */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <ScanLine className="w-6 h-6 text-[#00897B]" />
            
            <button
              onClick={() => setScanning(!scanning)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition flex items-center gap-2 ${
                scanning
                  ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
                  : 'bg-teal-50 text-[#00897B] border-teal-200 hover:bg-teal-100'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>{scanning ? 'Stop Camera' : 'Start Camera Scanner'}</span>
            </button>
          </div>

          {/* Camera Feed Target Div */}
          {scanning && (
            <div className="p-4 rounded-2xl bg-black border border-slate-200 overflow-hidden">
              <div id="qr-reader" className="w-full text-white"></div>
            </div>
          )}

          {/* 1-Click Demo Pass Scanner Buttons */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              💡 1-Click Demo Scanner Test:
            </span>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleVerifyPass('GP-2026-901')}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white hover:bg-teal-50 text-[#00897B] border border-teal-200 text-xs font-mono font-medium transition shadow-2xs"
              >
                Scan Pass #GP-2026-901 (Approved)
              </button>
              <button
                onClick={() => handleVerifyPass('GP-2026-902')}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white hover:bg-amber-50 text-amber-700 border border-amber-200 text-xs font-mono font-medium transition shadow-2xs"
              >
                Scan Pass #GP-2026-902 (Pending)
              </button>
            </div>
          </div>

          {/* Manual Pass ID input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerifyPass();
            }}
            className="space-y-3"
          >
            <label className="block text-sm text-slate-700 font-semibold">
              Or Enter Gate Pass ID Manually:
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="e.g. GP-2026-901"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="flex-1 bg-white text-slate-900 px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-[#00897B] transition"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-[#00897B] hover:bg-[#00796B] text-white font-bold text-sm shadow-xs transition disabled:opacity-70 cursor-pointer"
              >
                {loading ? 'Verifying...' : 'Validate Pass'}
              </button>
            </div>
          </form>

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-sm flex items-center gap-2">
              <XCircle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Right: Validation Result Card */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gate Checkpoint</span>
            <span className="text-sm font-semibold text-slate-600">Officer: Vikram Singh</span>
          </div>

          {scanResult ? (
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-4">
                <CheckCircle2 className="w-10 h-10 text-[#00897B] shrink-0" />
                <div>
                  <h4 className="text-base font-bold text-slate-900">GATE CLEARANCE GRANTED</h4>
                  <p className="text-sm text-teal-800 mt-1 font-medium">{scanResult.message}</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Student Name:</span>
                  <span className="text-slate-900 font-bold">{scanResult.pass.studentName} ({scanResult.pass.rollNo})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Hostel Room:</span>
                  <span className="text-slate-700 font-medium">{scanResult.pass.room} ({scanResult.pass.block})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Outing Destination:</span>
                  <span className="text-slate-700 font-medium">{scanResult.pass.destination}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Expected Curfew In:</span>
                  <span className="text-[#00897B] font-bold">
                    {new Date(scanResult.pass.expectedInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-sm font-medium text-teal-800 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#00897B] shrink-0" />
                <span>Parent WhatsApp SMS dispatched to {scanResult.pass.parentPhone}</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 space-y-3 flex-1">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <ScanLine className="w-8 h-8" />
              </div>
              <p className="text-sm font-medium text-slate-500">Scan a QR Code or click a Demo test button to validate passes</p>
            </div>
          )}

          <div className="text-xs text-slate-400 pt-4 border-t border-slate-100 text-center font-medium">
            HostelSync Security Scanner v2.0 • Real-time DB Sync
          </div>
        </div>
      </div>
    </div>
  );
};