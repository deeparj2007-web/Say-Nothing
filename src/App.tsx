import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DiscretionShield } from './components/DiscretionShield';
import { VoiceIntake } from './components/PatientApp/VoiceIntake';
import { HonestResultCard } from './components/PatientApp/HonestResultCard';
import { SilentPassCard } from './components/PatientApp/SilentPassCard';
import { RedFlagModal } from './components/PatientApp/RedFlagModal';
import { ReceptionScanView } from './components/ReceptionistTerminal/ReceptionScanView';
import { ClinicianSummaryView } from './components/ClinicianEHR/ClinicianSummaryView';
import { DropoffFunnelSimulator } from './components/Analytics/DropoffFunnelSimulator';
import { ClinicalBoardModal } from './components/ClinicalReviewBoard/ClinicalBoardModal';

import { ActiveRole, Language, PatientAnswer, TriageAssessment, SilentPassToken } from './types';
import { TokenService } from './services/tokenService';
import { TriageEngine } from './services/triageEngine';
import { Smartphone, Maximize2, Minimize2, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [activeRole, setActiveRole] = useState<ActiveRole>('patient');
  const [isDiscretionActive, setIsDiscretionActive] = useState(false);
  const [useDeviceFrame, setUseDeviceFrame] = useState(true);

  // Patient App Flow States
  const [patientStep, setPatientStep] = useState<'voice_intake' | 'honest_card' | 'silent_pass' | 'red_flag'>('voice_intake');
  const [answers, setAnswers] = useState<PatientAnswer[]>([]);
  const [assessment, setAssessment] = useState<TriageAssessment | null>(null);
  const [token, setToken] = useState<SilentPassToken | null>(null);

  // Initialize with a default prepared scenario for instant testing if needed
  useEffect(() => {
    const initDefaultScenario = async () => {
      const defaultAnswers: PatientAnswer[] = [
        {
          questionId: 'Q1_CHIEF_COMPLAINT',
          transcript: "Dull ache and dragging heaviness in left scrotum, also planning family fertility check",
          language: 'en',
          timestamp: Date.now() - 3600000,
          detectedKeywords: ['dull ache', 'fertility']
        },
        {
          questionId: 'Q2_DURATION',
          transcript: "Gradual onset over past 2-3 months, gets heavier after standing all day at work",
          language: 'en',
          timestamp: Date.now() - 3600000,
          detectedKeywords: ['standing', '2-3 months']
        },
        {
          questionId: 'Q3_SAFETY_REDFLAGS',
          transcript: "No sudden agonizing pain, no hard rock lump, and no blood in urine",
          language: 'en',
          timestamp: Date.now() - 3600000,
          detectedKeywords: ['no sudden pain']
        },
        {
          questionId: 'Q4_ASSOCIATED_SIGNS',
          transcript: "Worse after gym workouts and in hot weather, relieved when lying flat",
          language: 'en',
          timestamp: Date.now() - 3600000,
          detectedKeywords: ['gym', 'relieved']
        },
        {
          questionId: 'Q5_PRIOR_HISTORY',
          transcript: "No previous groin or hernia surgeries, generally healthy",
          language: 'en',
          timestamp: Date.now() - 3600000,
          detectedKeywords: ['no surgeries']
        }
      ];

      const initialAssessment = TriageEngine.evaluateIntake(defaultAnswers);
      const initialToken = await TokenService.generateSilentPass(initialAssessment, 'M.A.');

      setAnswers(defaultAnswers);
      setAssessment(initialAssessment);
      setToken(initialToken);
    };

    initDefaultScenario();
  }, []);

  // Handle Voice Intake Completion
  const handleIntakeComplete = async (newAssessment: TriageAssessment, newAnswers: PatientAnswer[]) => {
    setAssessment(newAssessment);
    setAnswers(newAnswers);

    if (newAssessment.hasRedFlag && newAssessment.triggeredRedFlag) {
      setPatientStep('red_flag');
    } else {
      setPatientStep('honest_card');
    }
  };

  // Generate Silent Pass QR
  const handleGeneratePass = async () => {
    if (!assessment) return;
    const newToken = await TokenService.generateSilentPass(assessment, 'M.A.');
    setToken(newToken);
    setPatientStep('silent_pass');
  };

  // Authorize Clinician (Secondary Cryptographic Handshake)
  const handleAuthorizeClinician = () => {
    if (!token) return;
    setToken({
      ...token,
      isAuthorizedByPatient: !token.isAuthorizedByPatient,
      consultStatus: token.consultStatus === 'pass_generated' ? 'in_consultation' : token.consultStatus
    });
  };

  // Receptionist Scan & Check-in
  const handleReceptionCheckIn = (scannedToken?: SilentPassToken) => {
    if (scannedToken) {
      setToken(scannedToken);
      if (scannedToken.findings && scannedToken.findings.length > 0) {
        setAssessment(prev => prev ? {
          ...prev,
          findings: scannedToken.findings || prev.findings,
          overallConfidence: scannedToken.overallConfidence || prev.overallConfidence
        } : null);
      }
    } else if (token) {
      setToken({
        ...token,
        consultStatus: 'checked_in_reception'
      });
    }
  };

  const handleSendToDoctor = (scannedToken: SilentPassToken) => {
    const updated = {
      ...scannedToken,
      consultStatus: 'checked_in_reception' as const
    };
    setToken(updated);
    if (updated.findings && updated.findings.length > 0) {
      setAssessment(prev => prev ? {
        ...prev,
        findings: updated.findings || prev.findings,
        overallConfidence: updated.overallConfidence || prev.overallConfidence
      } : null);
    }
  };

  // Clinician Complete Consult (Close Loop)
  const handleClinicianComplete = () => {
    if (!token) return;
    setToken({
      ...token,
      consultStatus: 'consult_completed',
      completedAt: Date.now()
    });
  };

  // Keyboard shortcut for Discretion Mode (Esc key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDiscretionActive(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <DiscretionShield
      isActive={isDiscretionActive}
      onToggle={() => setIsDiscretionActive(!isDiscretionActive)}
    >
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
        
        {/* Global Navigation Bar */}
        <Navbar
          activeRole={activeRole}
          onRoleChange={setActiveRole}
          language={language}
          onLanguageChange={setLanguage}
          onTriggerDiscretion={() => setIsDiscretionActive(true)}
          hasPass={!!token}
        />

        {/* Role Content Renderers */}
        <div className="flex-1 flex flex-col">
          
          {/* ROLE 1: PATIENT MOBILE APP */}
          {activeRole === 'patient' && (
            <div className="flex-1 flex flex-col items-center justify-center p-0 sm:p-4 bg-slate-950">
              
              {/* Device Frame Wrapper for Mobile App realism */}
              <div className="w-full flex flex-col items-center">
                {/* Frame Mode Toggle Pill */}
                <div className="hidden sm:flex items-center space-x-2 mb-3 bg-slate-900 border border-slate-800 rounded-full px-3 py-1 text-xs text-slate-400">
                  <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{language === 'ar' ? 'إطار الهاتف الذكي:' : 'Mobile Frame Preview:'}</span>
                  <button
                    onClick={() => setUseDeviceFrame(!useDeviceFrame)}
                    className="font-medium text-white hover:text-cyan-400 flex items-center space-x-1 transition-colors"
                  >
                    <span>{useDeviceFrame ? 'Phone Frame (iPhone 16)' : 'Full Window'}</span>
                    {useDeviceFrame ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                  </button>
                </div>

                <div className={`w-full transition-all duration-300 ${
                  useDeviceFrame
                    ? 'max-w-[430px] rounded-[48px] border-[10px] border-slate-800 bg-slate-950 shadow-2xl shadow-cyan-950/30 overflow-hidden ring-1 ring-slate-700/50 min-h-[820px] flex flex-col'
                    : 'max-w-2xl'
                }`}>
                  {/* Dynamic Island Notch (When in frame mode) */}
                  {useDeviceFrame && (
                    <div className="w-full bg-slate-950 pt-3 pb-1 flex justify-center z-50">
                      <div className="w-28 h-6 bg-black rounded-full flex items-center justify-between px-3 text-[10px] text-slate-400 font-mono">
                        <div className="w-2 h-2 rounded-full bg-cyan-500/80 animate-pulse" />
                        <span className="text-[9px] text-slate-400">SilentPass</span>
                      </div>
                    </div>
                  )}

                  {/* Patient Sub-Views */}
                  <div className="flex-1 flex flex-col">
                    {patientStep === 'voice_intake' && (
                      <VoiceIntake
                        language={language}
                        onLanguageChange={setLanguage}
                        onComplete={handleIntakeComplete}
                        onTriggerDiscretion={() => setIsDiscretionActive(true)}
                      />
                    )}

                    {patientStep === 'honest_card' && assessment && (
                      <HonestResultCard
                        assessment={assessment}
                        language={language}
                        onGeneratePass={handleGeneratePass}
                        onRetake={() => setPatientStep('voice_intake')}
                      />
                    )}

                    {patientStep === 'silent_pass' && token && (
                      <SilentPassCard
                        token={token}
                        language={language}
                        onAuthorizeClinician={handleAuthorizeClinician}
                        onTriggerDiscretion={() => setIsDiscretionActive(true)}
                      />
                    )}

                    {patientStep === 'red_flag' && assessment?.triggeredRedFlag && (
                      <RedFlagModal
                        rule={assessment.triggeredRedFlag}
                        language={language}
                        onReset={() => setPatientStep('voice_intake')}
                      />
                    )}
                  </div>

                  {/* Quick Bottom Navigation inside Patient App */}
                  <div className="p-3 bg-slate-900/90 border-t border-slate-800/80 flex items-center justify-around text-xs">
                    <button
                      onClick={() => setPatientStep('voice_intake')}
                      className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                        patientStep === 'voice_intake' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {language === 'ar' ? '1. فحص صوتي' : '1. Voice Intake'}
                    </button>
                    <button
                      onClick={() => assessment && setPatientStep('honest_card')}
                      disabled={!assessment}
                      className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                        patientStep === 'honest_card' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {language === 'ar' ? '2. بطاقة المصارحة' : '2. Honest Card'}
                    </button>
                    <button
                      onClick={() => token && setPatientStep('silent_pass')}
                      disabled={!token}
                      className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                        patientStep === 'silent_pass' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {language === 'ar' ? '3. التصريح (QR)' : '3. Silent Pass'}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ROLE 2: RECEPTIONIST DESK TERMINAL */}
          {activeRole === 'receptionist' && (
            <ReceptionScanView
              token={token}
              language={language}
              onCheckInPatient={handleReceptionCheckIn}
              onSendToDoctor={handleSendToDoctor}
            />
          )}

          {/* ROLE 3: CLINICIAN SECURE EHR */}
          {activeRole === 'clinician' && (
            <ClinicianSummaryView
              token={token}
              assessment={assessment}
              language={language}
              onMarkCompleted={handleClinicianComplete}
              onSimulatePatientAuth={handleAuthorizeClinician}
            />
          )}

          {/* ROLE 4: DROP-OFF FUNNEL SIMULATOR */}
          {activeRole === 'analytics' && (
            <DropoffFunnelSimulator language={language} />
          )}

          {/* ROLE 5: CLINICAL REVIEW BOARD & NOVELTY */}
          {activeRole === 'clinical_board' && (
            <ClinicalBoardModal language={language} />
          )}

        </div>

      </div>
    </DiscretionShield>
  );
}
