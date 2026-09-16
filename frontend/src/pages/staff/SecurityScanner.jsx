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
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Main Gate QR Scanner</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
              GATE #1 ACTIVE
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Scan student digital QR gate pass for instant entry/exit clearance & parent WhatsApp dispatch.
          </p>
        </div>

        {/* Action Toggle (EXIT vs ENTRY) */}
        <div className="flex items-center p-1 rounded-2xl bg-gray-900 border border-gray-800">
          <button
            onClick={() => setAction('EXIT')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              action === 'EXIT'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Gate Outflow (EXIT)
          </button>
          <button
            onClick={() => setAction('ENTRY')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              action === 'ENTRY'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Gate Return (ENTRY)
          </button>
        </div>
      </div>

      {/* Main Scanner & Manual Lookup Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Camera & Manual Pass Input */}
        <div className="glass-card p-6 md:p-8 rounded-3xl border border-gray-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ScanLine className="w-5 h-5 text-amber-400" />
              <span>Gate Verification Terminal</span>
            </h3>
            <button
              onClick={() => setScanning(!scanning)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                scanning
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                  : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/30'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>{scanning ? 'Stop Camera' : 'Start Camera Scanner'}</span>
            </button>
          </div>

          {/* Camera Feed Target Div */}
          {scanning && (
            <div className="p-4 rounded-2xl bg-black/80 border border-indigo-500/30 overflow-hidden">
              <div id="qr-reader" className="w-full text-white"></div>
            </div>
          )}

          {/* 1-Click Demo Pass Scanner Buttons */}
          <div className="p-4 rounded-2xl bg-gray-800/40 border border-gray-700/50 space-y-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              💡 1-Click Demo Scanner Test:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleVerifyPass('GP-2026-901')}
                className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-brand-500/20 text-brand-400 border border-gray-700 hover:border-brand-500/40 text-xs font-mono transition"
              >
                Scan Pass #GP-2026-901 (Approved)
              </button>
              <button
                onClick={() => handleVerifyPass('GP-2026-902')}
                className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-amber-500/20 text-amber-400 border border-gray-700 hover:border-amber-500/40 text-xs font-mono transition"
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
            <label className="block text-xs text-gray-300 font-semibold">
              Or Enter Gate Pass ID Manually:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. GP-2026-901"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="flex-1 bg-gray-900 text-white px-4 py-2.5 rounded-xl border border-gray-700 text-xs font-mono focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 transition"
              >
                {loading ? 'Verifying...' : 'Validate Pass'}
              </button>
            </div>
          </form>

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <XCircle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Right: Validation Result Card */}
        <div className="glass-card p-6 md:p-8 rounded-3xl border border-gray-800 flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <h3 className="text-base font-bold text-white">Live Verification Feed</h3>
            <span className="text-xs text-gray-400">Security: Vikram Singh</span>
          </div>

          {scanResult ? (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white">GATE CLEARANCE GRANTED</h4>
                  <p className="text-xs text-emerald-300 mt-0.5">{scanResult.message}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gray-800/50 border border-gray-700/60 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Student Name:</span>
                  <span className="text-white font-bold">{scanResult.pass.studentName} ({scanResult.pass.rollNo})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Hostel Room:</span>
                  <span className="text-white">{scanResult.pass.room} ({scanResult.pass.block})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Outing Destination:</span>
                  <span className="text-white font-medium">{scanResult.pass.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Expected Curfew In:</span>
                  <span className="text-amber-400 font-semibold">
                    {new Date(scanResult.pass.expectedInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Parent WhatsApp SMS dispatched to {scanResult.pass.parentPhone}</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 space-y-2">
              <ScanLine className="w-12 h-12 text-gray-600 animate-pulse" />
              <p className="text-xs">Scan a QR Code or click a Demo test button to validate passes</p>
            </div>
          )}

          <div className="text-[11px] text-gray-500 pt-3 border-t border-gray-800 text-center">
            HostelSync Security Scanner v2.0 • Real-time DB Sync
          </div>
        </div>
      </div>
    </div>
  );
};
