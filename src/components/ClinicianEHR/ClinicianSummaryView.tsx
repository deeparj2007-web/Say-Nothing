import React, { useState } from 'react';
import { 
  Stethoscope, Lock, Unlock, CheckCircle2, AlertCircle, FileText, 
  Activity, AudioWaveform as Waveform, ShieldCheck, ClipboardCheck, ArrowRight, CheckCheck
} from 'lucide-react';
import { SilentPassToken, TriageAssessment, Language } from '../../types';

interface ClinicianSummaryViewProps {
  token: SilentPassToken | null;
  assessment: TriageAssessment | null;
  language: Language;
  onMarkCompleted: () => void;
  onSimulatePatientAuth: () => void;
}

export const ClinicianSummaryView: React.FC<ClinicianSummaryViewProps> = ({
  token,
  assessment,
  language,
  onMarkCompleted,
  onSimulatePatientAuth
}) => {
  const [examChecklist, setExamChecklist] = useState({
    palpationSupine: false,
    palpationUprightValsalva: false,
    dopplerUltrasoundOrdered: false,
    semenAnalysisRequisitioned: false,
  });

  const isLocked = !token?.isAuthorizedByPatient;
  const activeFindings = (token?.findings && token.findings.length > 0)
    ? token.findings
    : (assessment?.findings && assessment.findings.length > 0)
      ? assessment.findings
      : [];
  const confidenceScore = token?.overallConfidence || assessment?.overallConfidence || 88;

  const toggleCheck = (key: keyof typeof examChecklist) => {
    setExamChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Clinician EHR Header */}
      <header className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center font-bold text-white shadow-lg shadow-teal-600/20">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Dr. Zaid Al-Hamdani, MD, FEBU</span>
              <span className="text-xs px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-normal">
                Urology & Andrology Room 3B
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              SilentPass Clinical Intake Dashboard • Patient Encrypt Handshake Active
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono text-slate-400">
            Token: <strong className="text-cyan-400">{token?.passId || 'SP-8492-AE'}</strong>
          </span>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
            token?.consultStatus === 'consult_completed'
              ? 'bg-emerald-500/20 text-emerald-300'
              : 'bg-amber-500/20 text-amber-300'
          }`}>
            {token?.consultStatus === 'consult_completed' ? 'Consultation Completed ✓' : 'In Consultation'}
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-6">
        
        {/* Patient Authorization Gatekeeper Banner */}
        {isLocked ? (
          <div className="bg-slate-900 border-2 border-dashed border-amber-500/40 rounded-3xl p-8 text-center max-w-lg mx-auto my-12 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">
              Awaiting In-Room Patient Data Authorization
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              To protect reproductive health autonomy, this one-page summary remains cryptographically locked until the patient taps <strong>"Authorize Doctor"</strong> on their phone inside your consultation room.
            </p>

            <button
              onClick={onSimulatePatientAuth}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-semibold text-xs inline-flex items-center space-x-2 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all"
            >
              <Unlock className="w-4 h-4" />
              <span>Simulate Patient Tapping "Authorize Doctor"</span>
            </button>
          </div>
        ) : (
          /* One-Page Clinical Intake Summary (When Authorized) */
          <div className="space-y-6 animate-fadeIn">
            
            {/* Top Patient Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-600 to-teal-600 flex items-center justify-center font-bold text-white text-lg">
                  {token?.patientInitials || 'M.A.'}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-base font-bold text-white">Patient #{token?.passId}</h2>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-mono">
                      Decrypted via Patient Handshake
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    28 y/o Male • Modality: Voice-Only Mobile Intake (Arabic / Gulf Dialect + English)
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400">Intake Duration:</span>
                <span className="text-xs font-mono font-bold text-cyan-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                  1 min 48 sec
                </span>
              </div>
            </div>

            {/* Two-Column Clinical Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Left Column: Voice Findings & Verbatim Tracing */}
              <div className="md:col-span-7 space-y-4">
                {/* Spoken Symptoms Summary Card */}
                {token?.symptomsSummary && (
                  <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-5 shadow-lg">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 block mb-1">
                      Chief Complaint & Spoken Voice Symptoms (Transmitted via QR):
                    </span>
                    <p className="text-sm text-slate-100 font-semibold leading-relaxed">
                      "{token.symptomsSummary}"
                    </p>
                  </div>
                )}

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs uppercase font-bold tracking-wider text-slate-300 flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-cyan-400" />
                      <span>Synthesized Screening Signals ({activeFindings.length || 1})</span>
                    </h3>
                    <span className="text-[11px] font-mono text-emerald-400">
                      Overall Match: {confidenceScore}%
                    </span>
                  </div>

                  <div className="space-y-3">
                    {activeFindings.map(finding => (
                      <div key={finding.id} className="p-4 bg-slate-950/80 rounded-xl border border-slate-800/80">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-white">{finding.titleEn}</span>
                          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/30">
                            {finding.confidenceScore}% Confidence
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed mb-3">
                          {finding.screeningSignalEn}
                        </p>

                        {/* Verbatim Voice Excerpt Audit Trail */}
                        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                          <div className="flex items-center space-x-1.5 text-slate-500 text-[10px] uppercase font-semibold mb-1">
                            <Waveform className="w-3 h-3 text-cyan-400" />
                            <span>Verbatim Patient Voice Excerpt:</span>
                          </div>
                          <div className="text-slate-200 italic font-mono pl-2 border-l-2 border-cyan-500">
                            "{finding.triggeringVoiceExcerpt}"
                          </div>
                          <div className="text-teal-400 text-[10px] mt-1.5">
                            <strong>Recommended Action:</strong> {finding.clinicalSignificanceEn}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Explicit Unassessed Boundaries */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <h3 className="text-xs uppercase font-bold tracking-wider text-amber-400 flex items-center space-x-2 mb-3">
                    <AlertCircle className="w-4 h-4" />
                    <span>Unassessed Domains (Mandated Physical Exam)</span>
                  </h3>
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                      <span>Physical Scrotal Palpation (Grade & Volume)</span>
                      <span className="text-[10px] font-mono text-amber-400">Required Now</span>
                    </div>
                    <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                      <span>Semen Analysis (WHO 6th Ed)</span>
                      <span className="text-[10px] font-mono text-slate-400">Requisition Pending</span>
                    </div>
                    <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                      <span>Serum Testosterone & Gonadotropins</span>
                      <span className="text-[10px] font-mono text-slate-400">Optional Baseline</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: In-Clinic Examination Checklist & Close Loop */}
              <div className="md:col-span-5 space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                  <h3 className="text-xs uppercase font-bold tracking-wider text-slate-300 flex items-center space-x-2 mb-3">
                    <ClipboardCheck className="w-4 h-4 text-teal-400" />
                    <span>Physician Exam Checklist</span>
                  </h3>

                  <div className="space-y-2.5">
                    <label className="flex items-center space-x-2.5 text-xs text-slate-200 cursor-pointer p-2 rounded-lg hover:bg-slate-800/60 transition-colors">
                      <input
                        type="checkbox"
                        checked={examChecklist.palpationSupine}
                        onChange={() => toggleCheck('palpationSupine')}
                        className="rounded border-slate-700 text-teal-600 focus:ring-teal-500 bg-slate-950 w-4 h-4"
                      />
                      <span>Supine Scrotal & Inguinal Palpation</span>
                    </label>

                    <label className="flex items-center space-x-2.5 text-xs text-slate-200 cursor-pointer p-2 rounded-lg hover:bg-slate-800/60 transition-colors">
                      <input
                        type="checkbox"
                        checked={examChecklist.palpationUprightValsalva}
                        onChange={() => toggleCheck('palpationUprightValsalva')}
                        className="rounded border-slate-700 text-teal-600 focus:ring-teal-500 bg-slate-950 w-4 h-4"
                      />
                      <span>Upright Valsalva Maneuver (Venous reflux)</span>
                    </label>

                    <label className="flex items-center space-x-2.5 text-xs text-slate-200 cursor-pointer p-2 rounded-lg hover:bg-slate-800/60 transition-colors">
                      <input
                        type="checkbox"
                        checked={examChecklist.dopplerUltrasoundOrdered}
                        onChange={() => toggleCheck('dopplerUltrasoundOrdered')}
                        className="rounded border-slate-700 text-teal-600 focus:ring-teal-500 bg-slate-950 w-4 h-4"
                      />
                      <span>Order High-Res Scrotal Color Doppler Scan</span>
                    </label>

                    <label className="flex items-center space-x-2.5 text-xs text-slate-200 cursor-pointer p-2 rounded-lg hover:bg-slate-800/60 transition-colors">
                      <input
                        type="checkbox"
                        checked={examChecklist.semenAnalysisRequisitioned}
                        onChange={() => toggleCheck('semenAnalysisRequisitioned')}
                        className="rounded border-slate-700 text-teal-600 focus:ring-teal-500 bg-slate-950 w-4 h-4"
                      />
                      <span>Issue Semen Analysis Requisition Form</span>
                    </label>
                  </div>
                </div>

                {/* Closing the Loop Action */}
                <div className="bg-gradient-to-br from-slate-900 to-teal-950/40 border border-teal-500/30 rounded-2xl p-5 shadow-xl">
                  <div className="flex items-center space-x-2 text-xs font-bold text-teal-300 uppercase tracking-wider mb-2">
                    <CheckCheck className="w-4 h-4" />
                    <span>Closing The Referral Loop</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Marking this consult as completed updates the patient's phone to <strong>"Next step done ✓"</strong> without transmitting or storing any diagnosis to their phone.
                  </p>

                  <button
                    onClick={onMarkCompleted}
                    disabled={token?.consultStatus === 'consult_completed'}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
                      token?.consultStatus === 'consult_completed'
                        ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default'
                        : 'bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-600/30 active:scale-[0.98]'
                    }`}
                  >
                    {token?.consultStatus === 'consult_completed' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Consult Completed • Referral Loop Closed</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mark Consult Completed & Close Loop</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>
    </div>
  );
};
