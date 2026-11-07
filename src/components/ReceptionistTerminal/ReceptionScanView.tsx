import React, { useState } from 'react';
import { 
  Scan, CheckCircle2, ShieldCheck, UserCheck, Clock, 
  Building2, AlertCircle, ArrowRight, Printer, BellRing, 
  Send, RefreshCw, FileText, Activity, Stethoscope, Lock
} from 'lucide-react';
import { SilentPassToken, Language } from '../../types';
import { TokenService } from '../../services/tokenService';
import { QRScanner } from './QRScanner';

interface ReceptionScanViewProps {
  token: SilentPassToken | null;
  language: Language;
  onCheckInPatient: (scannedToken?: SilentPassToken) => void;
  onSendToDoctor?: (token: SilentPassToken) => void;
}

export const ReceptionScanView: React.FC<ReceptionScanViewProps> = ({
  token,
  language,
  onCheckInPatient,
  onSendToDoctor
}) => {
  // State for whether QR scanner is active or report is shown
  const [activeToken, setActiveToken] = useState<SilentPassToken | null>(token);
  const [hasScannedSuccessfully, setHasScannedSuccessfully] = useState<boolean>(
    !!(token && token.consultStatus !== 'pass_generated')
  );
  const [isSentToDoctor, setIsSentToDoctor] = useState<boolean>(
    token?.consultStatus === 'checked_in_reception' || token?.consultStatus === 'in_consultation' || token?.consultStatus === 'consult_completed'
  );
  const [scanMode, setScanMode] = useState<'camera' | 'report'>(
    token && token.consultStatus !== 'pass_generated' ? 'report' : 'camera'
  );

  // Handle successful QR code decode from camera or image upload
  const handleQRDecoded = (decodedText: string) => {
    console.log('Decoded QR Payload:', decodedText);
    const parsed = TokenService.parseQRPayload(decodedText);

    if (parsed) {
      const mergedToken: SilentPassToken = {
        passId: parsed.passId || token?.passId || ('SP-' + Math.floor(1000 + Math.random() * 9000) + '-AE'),
        qrPayload: decodedText,
        qrDataUrl: token?.qrDataUrl || '',
        neutralLabel: parsed.neutralLabel || "Preventive Men's Consult (20 min)",
        serviceCategory: 'PMC-20 General Men’s Wellness',
        patientInitials: parsed.patientInitials || token?.patientInitials || 'M.A.',
        timeSlot: parsed.timeSlot || 'Today, 14:30 (20 min slot)',
        clinicName: parsed.clinicName || 'Al-Noor Premier Medical Centre, Dubai',
        clinicAddress: 'Building 64, Healthcare City, District 1',
        createdAt: parsed.createdAt || Date.now(),
        expiresAt: parsed.expiresAt || (Date.now() + 48 * 3600 * 1000),
        isAuthorizedByPatient: token?.isAuthorizedByPatient || false,
        consultStatus: 'checked_in_reception',
        symptomsSummary: parsed.symptomsSummary || token?.symptomsSummary || 'Scanned intake report from mobile pass',
        clinicalSignals: parsed.clinicalSignals || token?.clinicalSignals || ["Preventive Men's Consult (PMC-20)"],
        findings: parsed.findings || token?.findings || [],
        unassessed: parsed.unassessed || token?.unassessed || [],
        overallConfidence: parsed.overallConfidence || token?.overallConfidence || 88,
        verbatimExcerpt: parsed.verbatimExcerpt || token?.verbatimExcerpt || 'Scanned via Reception Terminal'
      };

      setActiveToken(mergedToken);
      setHasScannedSuccessfully(true);
      setScanMode('report');
      onCheckInPatient(mergedToken);
    }
  };

  // Quick simulate using current patient's generated token
  const handleQuickSimulateScan = () => {
    if (token) {
      handleQRDecoded(token.qrPayload);
    } else {
      // Create a realistic sample token if none exists yet
      const dummyPayload = JSON.stringify({
        passId: 'SP-8492-AE',
        neutralLabel: "Preventive Men's Consult (20 min)",
        patientInitials: 'M.A.',
        timeSlot: 'Today, 14:30 (20 min slot)',
        symptomsSummary: 'Dull ache and dragging heaviness in left scrotum for 2-3 months; pre-conception fertility workup',
        clinicalSignals: [
          'Dependent Scrotal Discomfort (Suspicion of Clinical Varicocele) (84% confidence)',
          'Pre-Conception Male Reproductive Workup Requested (92% confidence)'
        ],
        overallConfidence: 88,
        verbatimExcerpt: 'Dull ache and dragging heaviness in left scrotum, also planning family fertility check'
      });
      handleQRDecoded(dummyPayload);
    }
  };

  // Primary Action: Receptionist sends the scanned intake report to the doctor
  const handleSendToDoctor = () => {
    if (!activeToken) return;
    setIsSentToDoctor(true);
    if (onSendToDoctor) {
      onSendToDoctor(activeToken);
    } else {
      onCheckInPatient(activeToken);
    }
  };

  const currentPass = activeToken || token;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Front Desk Terminal Header */}
      <header className="px-4 sm:px-6 py-3.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
            PMS
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white flex items-center space-x-2">
              <span>Al-Noor Premier Medical Centre</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                Terminal 04 (Front Desk)
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              Live QR Optical Scanner & Patient Routing • Operator: Fatima K. (Intake Supervisor)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {scanMode === 'report' && (
            <button
              onClick={() => {
                setScanMode('camera');
                setHasScannedSuccessfully(false);
                setIsSentToDoctor(false);
              }}
              className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center space-x-1.5 border border-slate-700 transition-colors"
            >
              <Scan className="w-3.5 h-3.5 text-cyan-400" />
              <span>Scan Next Patient</span>
            </button>
          )}
          <div className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </header>

      {/* Main Terminal View */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Live Optical Camera Scanner */}
        <div className="md:col-span-5 bg-slate-950/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-300 flex items-center space-x-1.5">
              <Scan className="w-4 h-4 text-cyan-400" />
              <span>Optical QR Code Scanner</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
              Ready for Mobile
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-3 text-center leading-relaxed">
            Patient holds up phone with SilentPass QR code. The camera will automatically detect and decode symptoms instantly.
          </p>

          {/* Real Live Camera Scanner with jsQR */}
          <QRScanner
            onScan={handleQRDecoded}
            onQuickSimulate={handleQuickSimulateScan}
            isScanningActive={scanMode === 'camera'}
          />
        </div>

        {/* Right Column: Scanned Report & Doctor Routing */}
        <div className="md:col-span-7 bg-slate-950/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
          {hasScannedSuccessfully && currentPass ? (
            /* Scanned Report View Ready to Send to Doctor */
            <div className="space-y-5 animate-fadeIn">
              
              {/* Header Badge */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold text-emerald-300 font-mono uppercase tracking-wider">
                    QR Decoded Successfully • Patient In-Clinic
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/40 px-2.5 py-1 rounded-lg border border-cyan-800/40">
                  {currentPass.passId}
                </span>
              </div>

              {/* Status Notice */}
              {isSentToDoctor ? (
                <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl flex items-center space-x-3 text-xs text-emerald-200">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-white">Intake Sent to Doctor's Screen</h4>
                    <p className="text-[11px] text-emerald-300/90 mt-0.5">
                      Dr. Zaid Al-Hamdani (Room 3B) has received this patient's intake summary packet. Waiting room pager issued.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 bg-blue-950/30 border border-blue-800/40 rounded-2xl flex items-start space-x-2.5 text-xs text-blue-200">
                  <ShieldCheck className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Front-Desk Zero-Knowledge Privacy Guarantee:</span>
                    <p className="text-[11px] text-blue-300/90 mt-0.5">
                      The patient spoke zero embarrassing words at the counter. The administrative appointment label is neutral. Click below to route this report directly to the doctor's EHR.
                    </p>
                  </div>
                </div>
              )}

              {/* Neutral Administrative Section */}
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                  Scheduled Service (Neutral Label for Waiting Room)
                </span>
                <div className="text-lg font-extrabold text-white">
                  {currentPass.neutralLabel}
                </div>
                <div className="text-xs font-mono text-cyan-400 mt-1">
                  Billing Code: PMC-20 • {currentPass.timeSlot}
                </div>
              </div>

              {/* Patient Intake Data Decoded from QR */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold tracking-wider text-slate-300 flex items-center space-x-1.5">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Decoded Patient Symptoms & Screening Signals</span>
                </h3>

                {/* Symptoms Summary */}
                <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs">
                  <div className="text-slate-400 text-[11px] uppercase font-semibold mb-1">
                    Spoken Symptoms Summary (From Voice Survey):
                  </div>
                  <p className="text-slate-100 font-medium leading-relaxed">
                    "{currentPass.symptomsSummary || 'Dull ache and dragging heaviness in left scrotum for 2-3 months; pre-conception fertility workup'}"
                  </p>

                  {/* Extracted Clinical Signals */}
                  {currentPass.clinicalSignals && currentPass.clinicalSignals.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-800 space-y-1.5">
                      <div className="text-[10px] uppercase font-semibold text-cyan-400">
                        Synthesized Screening Signals:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {currentPass.clinicalSignals.map((sig, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-950 rounded text-[11px] text-slate-300 border border-slate-800">
                            • {sig}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Confidence Score */}
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Intake Match Confidence:</span>
                    <span className="font-mono font-bold text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {currentPass.overallConfidence || 88}%
                    </span>
                  </div>
                </div>

                {/* Consultation Routing Details */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block mb-0.5">Assigned Consulting Doctor</span>
                    <span className="text-sm font-bold text-slate-100">Dr. Zaid Al-Hamdani</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block mb-0.5">Assigned Room</span>
                    <span className="text-sm font-bold text-slate-100">Room 3B (Andrology)</span>
                  </div>
                </div>
              </div>

              {/* PRIMARY ACTION: SEND TO DOCTOR FOR CONSULTATION */}
              <div className="pt-2">
                <button
                  onClick={handleSendToDoctor}
                  disabled={isSentToDoctor}
                  className={`w-full py-4 px-5 rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 shadow-xl transition-all ${
                    isSentToDoctor
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default'
                      : 'bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white shadow-cyan-600/25 active:scale-[0.98]'
                  }`}
                >
                  {isSentToDoctor ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>Report Sent to Dr. Zaid Al-Hamdani (Room 3B) ✓</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Scanned Report to Doctor for Consultation ➔</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-slate-400 text-center mt-2">
                  Transfers the patient's decoded intake report directly to the Doctor's EHR workstation.
                </p>
              </div>

            </div>
          ) : (
            /* Standby State (Waiting for Scanner) */
            <div className="py-12 px-4 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 shadow-inner">
                <Scan className="w-10 h-10 animate-pulse text-cyan-500" />
              </div>
              <h3 className="text-base font-bold text-white">
                Awaiting Patient QR Code Scan
              </h3>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Aim the camera scanner at the patient's mobile phone screen, or upload an image of the QR code. As soon as the code is decoded, the report will display here and can be sent to the doctor.
              </p>
              <div className="pt-2">
                <button
                  onClick={handleQuickSimulateScan}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-semibold text-xs transition-colors flex items-center space-x-2"
                >
                  <span>⚡ Quick-Load Active Patient Intake</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </main>
    </div>
  );
};
