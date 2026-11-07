import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  ShieldCheck, Clock, Lock, Unlock, CheckCircle2, 
  MapPin, Share2, Sparkles, AlertCircle, EyeOff, Building2, User
} from 'lucide-react';
import { SilentPassToken, Language, ConsultStatus } from '../../types';
import { TokenService } from '../../services/tokenService';

interface SilentPassCardProps {
  token: SilentPassToken;
  language: Language;
  onAuthorizeClinician: () => void;
  onTriggerDiscretion: () => void;
  onSimulateReceptionCheckin?: () => void;
}

export const SilentPassCard: React.FC<SilentPassCardProps> = ({
  token,
  language,
  onAuthorizeClinician,
  onTriggerDiscretion
}) => {
  const [timeLeft, setTimeLeft] = useState(TokenService.formatRemainingTime(token.expiresAt));
  const [localQrUrl, setLocalQrUrl] = useState<string>(token.qrDataUrl || '');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Dynamic QR Code generation & canvas fallback guarantee
  useEffect(() => {
    let isMounted = true;
    if (token.qrDataUrl) {
      setLocalQrUrl(token.qrDataUrl);
    }

    const payload = token.qrPayload || JSON.stringify({
      passId: token.passId,
      code: 'PMC-20',
      label: token.neutralLabel,
      patient: token.patientInitials
    });

    // Render directly to canvas as an immediate visual guarantee
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, payload, {
        margin: 2,
        width: 192,
        color: { dark: '#0369a1', light: '#ffffff' }
      }).catch(err => console.warn('Canvas render fallback', err));
    }

    // Also generate data URL if not present
    if (!token.qrDataUrl) {
      QRCode.toDataURL(payload, {
        margin: 2,
        width: 320,
        color: { dark: '#0369a1', light: '#ffffff' }
      }).then(url => {
        if (isMounted) setLocalQrUrl(url);
      }).catch(err => console.warn('DataURL render fallback', err));
    }

    return () => { isMounted = false; };
  }, [token]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(TokenService.formatRemainingTime(token.expiresAt));
    }, 1000);
    return () => clearInterval(timer);
  }, [token.expiresAt]);

  const getStatusBadge = (status: ConsultStatus) => {
    switch (status) {
      case 'pass_generated':
        return {
          labelEn: 'Pass Active • Ready to Walk In',
          labelAr: 'التصريح جاهز ومفعل للدخول',
          color: 'bg-brand-500/20 text-brand-300 border-brand-500/40'
        };
      case 'checked_in_reception':
        return {
          labelEn: 'Arrived • Reception Checked In',
          labelAr: 'تم تسجيل الوصول بالاستقبال بنجاح',
          color: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
        };
      case 'in_consultation':
        return {
          labelEn: 'In Consultation with Doctor',
          labelAr: 'جلسة الاستشارة الطبية جارية الآن',
          color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
        };
      case 'consult_completed':
        return {
          labelEn: 'Next Step Done ✓ (Loop Closed)',
          labelAr: 'تم إنجاز الخطوة القادمة ✓ (اكتملت الزيارة)',
          color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
        };
    }
  };

  const statusBadge = getStatusBadge(token.consultStatus);

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col p-4 sm:p-6 ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-md mx-auto w-full my-auto py-4">

        {/* Top Header with Discretion Camouflage */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
              {language === 'ar' ? 'البطاقة الصامتة المعتمدة' : 'Official Silent Pass'}
            </span>
            <h1 className="text-lg font-bold text-white">
              {language === 'ar' ? 'تصريح الدخول الرقمي' : 'Digital Clinic Pass'}
            </h1>
          </div>
          <button
            onClick={onTriggerDiscretion}
            title="Instant Camouflage Mode"
            className="flex items-center space-x-1 rtl:space-x-reverse px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs text-amber-400 transition-colors"
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium hidden sm:inline">
              {language === 'ar' ? 'تمويه سريع' : 'Discretion'}
            </span>
          </button>
        </div>

        {/* Digital Pass Card (Apple Wallet Style) */}
        <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl mb-5">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Top Pass Bar: Clinic & Status */}
          <div className="flex items-start justify-between border-b border-slate-800/80 pb-4 mb-4">
            <div>
              <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-xs text-slate-400 mb-0.5">
                <Building2 className="w-3.5 h-3.5 text-brand-400" />
                <span>{token.clinicName}</span>
              </div>
              <div className="text-[11px] text-slate-500">{token.clinicAddress}</div>
            </div>
            <div className="text-right rtl:text-left">
              <span className="text-[10px] font-mono text-slate-400 block">{token.passId}</span>
              <span className="text-xs font-bold text-cyan-400">{token.patientInitials}</span>
            </div>
          </div>

          {/* Neutral Front-Desk Label (What the Receptionist Sees) */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center mb-5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block mb-1">
              {language === 'ar' ? 'الاسم الظاهر لشاشة الاستقبال:' : 'Receptionist Screen View:'}
            </span>
            <div className="text-lg font-extrabold text-white tracking-wide">
              {token.neutralLabel}
            </div>
            <div className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-slate-800 text-[11px] text-slate-300 font-mono">
              {token.timeSlot}
            </div>
          </div>

          {/* The Dynamic QR Code */}
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-inner mb-4">
            {localQrUrl ? (
              <img 
                src={localQrUrl} 
                alt="SilentPass QR" 
                className="w-48 h-48 rounded-lg shadow-sm"
              />
            ) : (
              <canvas 
                ref={canvasRef} 
                className="w-48 h-48 rounded-lg shadow-sm" 
              />
            )}
            <div className="mt-2 text-[10px] font-mono text-slate-600 text-center tracking-tight">
              SCAN AT CLINIC FRONT DESK • NO WORDS REQUIRED
            </div>
          </div>

          {/* 48-Hour Expiration Countdown */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs mb-4">
            <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-slate-400">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{language === 'ar' ? 'صلاحية التصريح:' : 'Pass Expires In:'}</span>
            </div>
            <div className="font-mono font-bold text-amber-300">
              {timeLeft.isExpired ? (
                <span className="text-red-400">{language === 'ar' ? 'منتهي الصلاحية' : 'Expired'}</span>
              ) : (
                `${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`
              )}
            </div>
          </div>

          {/* Live Status Pill ("Closing the loop") */}
          <div className={`p-3 rounded-xl border text-center text-xs font-semibold ${statusBadge.color}`}>
            {language === 'ar' ? statusBadge.labelAr : statusBadge.labelEn}
          </div>
        </div>

        {/* Clinician Data Lock / Authorization Control */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 mb-5 shadow-lg">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs font-bold text-slate-200">
                {token.isAuthorizedByPatient ? (
                  <Unlock className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Lock className="w-4 h-4 text-amber-400" />
                )}
                <span>
                  {language === 'ar' ? 'تصريح مشاركة الملف مع الطبيب المعالج' : 'Clinician Summary Data Authorization'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                {language === 'ar' 
                  ? 'لا يمكن للطبيب فتح الملخص الطبي الصوتي إلا بعد موافقتك الصريحة داخل غرفة الكشف.' 
                  : 'The doctor’s screen remains locked until you tap authorize when you enter the consultation room.'}
              </p>
            </div>
          </div>

          <button
            onClick={onAuthorizeClinician}
            className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 rtl:space-x-reverse transition-all ${
              token.isAuthorizedByPatient
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/20 active:scale-[0.98]'
            }`}
          >
            {token.isAuthorizedByPatient ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{language === 'ar' ? 'تم منح الطبيب تصريح المشاهدة ✓' : 'Clinician Authorized to View Summary ✓'}</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>{language === 'ar' ? 'اضغط للسماح للطبيب بفتح الملخص' : 'Tap to Authorize Doctor’s Screen'}</span>
              </>
            )}
          </button>
        </div>

        {/* Walk-in Clinic Instructions */}
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 text-xs text-slate-400 space-y-1.5">
          <div className="font-semibold text-slate-300">
            {language === 'ar' ? 'كيف تستخدم البطاقة عند الوصول:' : 'How to use this pass at the clinic:'}
          </div>
          <p>1. {language === 'ar' ? 'توجه لكاونتر الاستقبال وأظهر شاشة الهاتف لموظف الاستقبال دون أن تتكلم.' : 'Walk up to reception, show this QR code, and say nothing.'}</p>
          <p>2. {language === 'ar' ? 'يمسح الموظف الكود فيرى فقط "استشارة وقائية للرجال - 20 دقيقة".' : 'The receptionist scans it and sees only "Preventive men’s consult, 20 min".'}</p>
          <p>3. {language === 'ar' ? 'عند دخولك لغرفة الطبيب، اضغط على زر "السماح للطبيب" ليفتح ملخصك على شاشته.' : 'When entering the doctor’s office, tap authorize above so the doctor sees your full intake.'}</p>
        </div>

      </div>
    </div>
  );
};
