import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Volume2, VolumeX, Shield, AlertTriangle, ArrowRight, 
  RotateCcw, Sparkles, CheckCircle2, Globe2, EyeOff
} from 'lucide-react';
import { INTAKE_QUESTIONS } from '../../data/intakeQuestions';
import { IntakeQuestion, PatientAnswer, Language, TriageAssessment } from '../../types';
import { speechService } from '../../services/speechService';
import { TriageEngine } from '../../services/triageEngine';

interface VoiceIntakeProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onComplete: (assessment: TriageAssessment, answers: PatientAnswer[]) => void;
  onTriggerDiscretion: () => void;
}

export const VoiceIntake: React.FC<VoiceIntakeProps> = ({
  language,
  onLanguageChange,
  onComplete,
  onTriggerDiscretion
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<PatientAnswer[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [presetActive, setPresetActive] = useState<string | null>(null);

  const currentQ: IntakeQuestion = INTAKE_QUESTIONS[currentQuestionIndex];
  const timerRef = useRef<any>(null);

  // Timer for 2-minute total intake tracking
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Speak prompt when question changes unless muted
  useEffect(() => {
    if (!isMuted && currentQ) {
      const text = language === 'ar' ? currentQ.promptAudioTextAr : currentQ.promptAudioTextEn;
      speechService.speakPrompt(text, language);
    }
    setCurrentTranscript('');
  }, [currentQuestionIndex, language, isMuted]);

  const toggleRecording = () => {
    if (isRecording) {
      speechService.stopListening();
      setIsRecording(false);
    } else {
      const started = speechService.startListening(
        language,
        (text, isFinal) => {
          setCurrentTranscript(text);
          // Wave animation simulation
          setAudioLevel(Math.floor(Math.random() * 60) + 30);
        },
        (err) => {
          console.warn('Speech recognition fallback', err);
          setIsRecording(false);
        }
      );
      if (started) {
        setIsRecording(true);
        speechService.startMicrophoneAnalyser(level => setAudioLevel(level));
      }
    }
  };

  const submitAnswer = (textToSubmit?: string) => {
    const finalAnswerText = textToSubmit || currentTranscript.trim();
    if (!finalAnswerText) return;

    if (isRecording) {
      speechService.stopListening();
      setIsRecording(false);
    }

    const newAnswer: PatientAnswer = {
      questionId: currentQ.id,
      transcript: finalAnswerText,
      language,
      timestamp: Date.now(),
      detectedKeywords: []
    };

    const updatedAnswers = [...answers.filter(a => a.questionId !== currentQ.id), newAnswer];
    setAnswers(updatedAnswers);
    setCurrentTranscript('');

    // Check immediate Red Flag Rule right now!
    const redFlag = TriageEngine.evaluateRedFlags(updatedAnswers);
    if (redFlag) {
      // Deterministic Red Flag triggered! Skip to immediate emergency
      const immediateAssessment = TriageEngine.evaluateIntake(updatedAnswers);
      onComplete(immediateAssessment, updatedAnswers);
      return;
    }

    if (currentQuestionIndex < INTAKE_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Completed all questions
      const finalAssessment = TriageEngine.evaluateIntake(updatedAnswers);
      onComplete(finalAssessment, updatedAnswers);
    }
  };

  // Instant Presets for seamless demonstrations
  const loadDemoScenario = (scenarioKey: 'varicocele' | 'redflag' | 'routine') => {
    setPresetActive(scenarioKey);
    let sampleAnswers: PatientAnswer[] = [];

    if (scenarioKey === 'varicocele') {
      sampleAnswers = [
        {
          questionId: 'Q1_CHIEF_COMPLAINT',
          transcript: language === 'ar' ? "عندي ثقل وعوار خفيف في الخصية اليسار، ونخطط أنا وزوجتي للإنجاب قريب" : "Dull ache and dragging heaviness in left scrotum, also planning family fertility check",
          language,
          timestamp: Date.now(),
          detectedKeywords: ['dull ache', 'heaviness', 'fertility']
        },
        {
          questionId: 'Q2_DURATION',
          transcript: language === 'ar' ? "ملاحظه من شهرين، ويزيد بعد الوقوف الطويل بالدوام" : "Gradual onset over past 2-3 months, gets heavier after standing all day at work",
          language,
          timestamp: Date.now(),
          detectedKeywords: ['standing', '2-3 months']
        },
        {
          questionId: 'Q3_SAFETY_REDFLAGS',
          transcript: language === 'ar' ? "الحمد لله لا يوجد ألم حاد فجائي ولا كتل صلبة ولا دم" : "No sudden agonizing pain, no hard rock lump, and no blood in urine",
          language,
          timestamp: Date.now(),
          detectedKeywords: ['no sudden pain']
        },
        {
          questionId: 'Q4_ASSOCIATED_SIGNS',
          transcript: language === 'ar' ? "يزيد العوار بعد الجيم والتمرين، ويرتاح تماماً لما أنسدح" : "Worse after gym workouts and in hot weather, relieved when lying flat",
          language,
          timestamp: Date.now(),
          detectedKeywords: ['gym', 'relieved']
        },
        {
          questionId: 'Q5_PRIOR_HISTORY',
          transcript: language === 'ar' ? "لا توجد عمليات سابقة، بصحة جيدة" : "No previous groin or hernia surgeries, generally healthy",
          language,
          timestamp: Date.now(),
          detectedKeywords: ['no surgeries']
        }
      ];
    } else if (scenarioKey === 'redflag') {
      sampleAnswers = [
        {
          questionId: 'Q1_CHIEF_COMPLAINT',
          transcript: language === 'ar' ? "ألم فجائي شديد جداً وعوار حاد بدأ قبل 3 ساعات بالخصية" : "Sudden agonizing pain started 3 hours ago in testicle, very severe pain and nausea",
          language,
          timestamp: Date.now(),
          detectedKeywords: ['sudden pain', 'severe']
        },
        {
          questionId: 'Q3_SAFETY_REDFLAGS',
          transcript: language === 'ar' ? "ألم فجائي شديد بدأ قبل ساعات ما أقدر أتحمله" : "Sudden severe pain that started hours ago, acute agony",
          language,
          timestamp: Date.now(),
          detectedKeywords: ['acute pain']
        }
      ];
    } else {
      sampleAnswers = [
        {
          questionId: 'Q1_CHIEF_COMPLAINT',
          transcript: language === 'ar' ? "فحص وقائي سنوي شامل للرجال، واطمئنان عام" : "Routine annual preventive men's wellness and baseline screen",
          language,
          timestamp: Date.now(),
          detectedKeywords: ['routine']
        },
        {
          questionId: 'Q2_DURATION',
          transcript: language === 'ar' ? "لا توجد أعراض، مجرد فحص دوري" : "No active symptoms, regular preventive schedule",
          language,
          timestamp: Date.now(),
          detectedKeywords: ['routine']
        },
        {
          questionId: 'Q3_SAFETY_REDFLAGS',
          transcript: language === 'ar' ? "لا يوجد أي ألم حاد أو كتل صلبة" : "No pain, no lumps, no hematuria",
          language,
          timestamp: Date.now(),
          detectedKeywords: ['no pain']
        },
        {
          questionId: 'Q4_ASSOCIATED_SIGNS',
          transcript: language === 'ar' ? "كل شيء طبيعي ولله الحمد" : "Normal function, no voiding difficulty",
          language,
          timestamp: Date.now(),
          detectedKeywords: ['normal']
        },
        {
          questionId: 'Q5_PRIOR_HISTORY',
          transcript: language === 'ar' ? "سليم وبدون أي عمليات جراحية" : "No prior urological or groin surgeries",
          language,
          timestamp: Date.now(),
          detectedKeywords: ['healthy']
        }
      ];
    }

    const assessment = TriageEngine.evaluateIntake(sampleAnswers);
    onComplete(assessment, sampleAnswers);
  };

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const progressPercent = Math.round(((currentQuestionIndex + 1) / INTAKE_QUESTIONS.length) * 100);

  return (
    <div className={`flex flex-col min-h-screen bg-slate-950 text-slate-100 ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Status Bar with Privacy Guard & Camouflage */}
      <header className="px-4 py-3 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <span className="font-bold text-white text-sm">SP</span>
          </div>
          <div>
            <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
              <h1 className="text-sm font-semibold tracking-tight text-white">SilentPass</h1>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-brand-500/20 text-brand-300 font-mono">
                {language === 'ar' ? 'صوتك بصمت' : 'Voice-First'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {language === 'ar' ? 'استشارة وقائية بلا حرج في الاستقبال' : 'Intake without the awkward receptionist sentence'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
          {/* Discretion Camouflage Trigger */}
          <button
            onClick={onTriggerDiscretion}
            title={language === 'ar' ? 'وضع التمويه السريع (آلة حاسبة)' : 'Instant Camouflage Mode (Discretion Shield)'}
            className="flex items-center space-x-1 rtl:space-x-reverse px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs transition-colors border border-slate-700/60"
          >
            <EyeOff className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-medium hidden sm:inline">
              {language === 'ar' ? 'تمويه' : 'Camouflage'}
            </span>
          </button>

          {/* Mute Voice Prompts Toggle */}
          <button
            onClick={() => {
              if (!isMuted) speechService.stopSpeaking();
              setIsMuted(!isMuted);
            }}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700/60"
            title={isMuted ? 'Unmute voice reader' : 'Mute voice reader'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Bilingual Toggle */}
          <button
            onClick={() => onLanguageChange(language === 'en' ? 'ar' : 'en')}
            className="flex items-center space-x-1 rtl:space-x-reverse px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs transition-colors border border-slate-700/60 font-medium"
          >
            <Globe2 className="w-3.5 h-3.5 text-brand-400" />
            <span>{language === 'en' ? 'العربية (خليجي)' : 'English'}</span>
          </button>
        </div>
      </header>

      {/* Zero-Cloud Privacy Guarantee Banner */}
      <div className="bg-slate-900/40 border-b border-slate-800/50 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
          <Shield className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span>
            {language === 'ar' 
              ? 'معالجة صوتية على الجهاز فقط — لا يتم تسجيل أو إرسال الصوت للسحابة' 
              : 'On-device voice processing: Audio stays in RAM; zero cloud recordings'}
          </span>
        </div>
        <div className="font-mono text-slate-500 text-[10px]">
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds} / 2:00
        </div>
      </div>

      {/* Main Voice Interactive Content */}
      <main className="flex-1 max-w-lg mx-auto w-full p-4 flex flex-col justify-between">
        {/* Progress Bar & Question Step */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>
              {language === 'ar' ? `السؤال ${currentQuestionIndex + 1} من ${INTAKE_QUESTIONS.length}` : `Question ${currentQuestionIndex + 1} of ${INTAKE_QUESTIONS.length}`}
            </span>
            <span className="font-mono text-cyan-400">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mb-6">
            <div 
              className="bg-gradient-to-r from-brand-500 to-cyan-400 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Question Card */}
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-xl relative overflow-hidden backdrop-blur-sm">
            {currentQ.isRedFlagCheck && (
              <div className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-3">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'فحص السلامة الصارم المباشر' : 'Clinical Safety Rule Check'}</span>
              </div>
            )}

            <h2 className="text-lg font-bold text-white leading-snug mb-2">
              {language === 'ar' ? currentQ.textAr : currentQ.textEn}
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              {language === 'ar' ? currentQ.helpTextAr : currentQ.helpTextEn}
            </p>

            {/* Spoken Dialect Hint */}
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-cyan-300/90 flex items-center space-x-2 rtl:space-x-reverse">
              <span className="text-base">🎙️</span>
              <span className="italic">
                {language === 'ar' ? currentQ.promptAudioTextAr : currentQ.promptAudioTextEn}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Voice Recording Wave Area */}
        <div className="my-6 flex flex-col items-center justify-center">
          {/* Animated Microphone Ring */}
          <div className="relative flex items-center justify-center mb-4">
            {isRecording && (
              <>
                <div className="absolute w-28 h-28 rounded-full bg-cyan-500/20 animate-ping" />
                <div className="absolute w-24 h-24 rounded-full bg-brand-500/30 animate-pulse" />
              </>
            )}
            <button
              onClick={toggleRecording}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
                isRecording 
                  ? 'bg-gradient-to-tr from-rose-600 to-red-500 text-white scale-105 shadow-red-500/40' 
                  : 'bg-gradient-to-tr from-brand-600 to-cyan-500 text-white hover:scale-105 shadow-brand-500/30'
              }`}
            >
              {isRecording ? <Mic className="w-8 h-8 animate-bounce" /> : <Mic className="w-8 h-8" />}
            </button>
          </div>

          <div className="text-center mb-3">
            <span className="text-xs font-semibold tracking-wide uppercase text-slate-300">
              {isRecording 
                ? (language === 'ar' ? 'جارِ الاستماع... تحدث بالعامية أو الفصحى' : 'Listening... Speak naturally in Arabic or English') 
                : (language === 'ar' ? 'اضغط وتحدث بدون كتابة' : 'Tap to speak your answer')}
            </span>
          </div>

          {/* Sound Wave Frequency Bars (Simulated / Audio Reactive) */}
          <div className="h-8 flex items-center space-x-1 rtl:space-x-reverse justify-center w-full max-w-xs mb-3">
            {[...Array(16)].map((_, i) => {
              const height = isRecording 
                ? Math.min(32, Math.max(6, Math.sin(i + audioLevel) * 28 + (audioLevel % 12)))
                : 4;
              return (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-75 ${
                    isRecording ? 'bg-gradient-to-t from-cyan-400 to-brand-400' : 'bg-slate-800'
                  }`}
                  style={{ height: `${height}px` }}
                />
              );
            })}
          </div>

          {/* Live Transcript / Response Box */}
          <div className="w-full bg-slate-900/70 border border-slate-800/80 rounded-xl p-3 min-h-[64px] flex flex-col justify-center">
            {currentTranscript ? (
              <p className="text-sm text-slate-100 font-medium italic">
                "{currentTranscript}"
              </p>
            ) : (
              <p className="text-xs text-slate-500 text-center">
                {language === 'ar' ? 'سيظهر صوتك المكتوب هنا لحظياً...' : 'Spoken words will appear here instantly...'}
              </p>
            )}
          </div>
        </div>

        {/* Quick Voice Chips (Hands-free / Discretion options) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              {language === 'ar' ? 'خيارات إجابة سريعة بصوتك أو بنقرة واحدة:' : 'Quick Spoken Chips (or one-tap fill):'}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {(language === 'ar' ? currentQ.quickVoiceChipsAr : currentQ.quickVoiceChipsEn).map((chip, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentTranscript(chip);
                  submitAnswer(chip);
                }}
                className="text-left rtl:text-right p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-brand-500/40 text-xs text-slate-300 transition-all flex items-center justify-between group active:scale-[0.98]"
              >
                <span className="line-clamp-1">{chip}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 flex-shrink-0 ml-1 rtl:mr-1 rtl:rotate-180" />
              </button>
            ))}
          </div>

          {/* Action Buttons: Next / Submit */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse pt-2">
            {currentTranscript && (
              <button
                onClick={() => submitAnswer()}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-medium text-sm flex items-center justify-center space-x-2 rtl:space-x-reverse shadow-lg shadow-brand-500/20 active:scale-[0.98] transition-all"
              >
                <span>{language === 'ar' ? 'تأكيد ومتابعة' : 'Confirm & Continue'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Demo Scenario Fast Jump (Crucial for Competition Judges & Live Presentations) */}
          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
              <span className="flex items-center space-x-1 rtl:space-x-reverse text-amber-300 font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'سيناريوهات تجريبية جاهزة للعرض:' : 'Instant Demo Scenarios for Judges:'}</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => loadDemoScenario('varicocele')}
                className="px-2.5 py-1 rounded-lg bg-brand-950/60 hover:bg-brand-900/80 border border-brand-800 text-[11px] text-brand-300 font-medium transition-colors"
              >
                {language === 'ar' ? '1. سيناريو أحمد (دوالي وفحص خصوبة)' : '1. Ahmed (Varicocele & Fertility)'}
              </button>
              <button
                onClick={() => loadDemoScenario('redflag')}
                className="px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-800 text-[11px] text-red-300 font-medium transition-colors"
              >
                {language === 'ar' ? '2. سيناريو طارق (طوارئ ألم حاد - انفتال)' : '2. Tariq (Red Flag Emergency - Torsion)'}
              </button>
              <button
                onClick={() => loadDemoScenario('routine')}
                className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800 text-[11px] text-emerald-300 font-medium transition-colors"
              >
                {language === 'ar' ? '3. سيناريو خالد (فحص وقائي دوري)' : '3. Khalid (Routine Preventive)'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
