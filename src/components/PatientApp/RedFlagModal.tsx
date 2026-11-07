import React from 'react';
import { AlertOctagon, PhoneCall, MapPin, ShieldAlert, ArrowLeft, Clock, CheckCircle } from 'lucide-react';
import { RedFlagRule, Language } from '../../types';

interface RedFlagModalProps {
  rule: RedFlagRule;
  language: Language;
  onReset: () => void;
}

export const RedFlagModal: React.FC<RedFlagModalProps> = ({
  rule,
  language,
  onReset
}) => {
  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col p-4 sm:p-6 ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-lg mx-auto w-full my-auto">
        {/* Critical Red Banner */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 rounded-3xl p-6 shadow-2xl shadow-red-900/40 text-white mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <AlertOctagon className="w-40 h-40" />
          </div>
          
          <div className="flex items-center space-x-2 rtl:space-x-reverse mb-3">
            <span className="px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-md text-red-200 text-xs font-mono font-bold tracking-wider">
              {rule.id} • {rule.severity}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black leading-tight mb-2">
            {language === 'ar' ? rule.emergencyTitleAr : rule.emergencyTitleEn}
          </h1>

          <p className="text-sm text-red-100/90 leading-relaxed font-medium">
            {language === 'ar' ? rule.nameAr : rule.nameEn}
          </p>
        </div>

        {/* Clinical Safety Boundary Explanation Card */}
        <div className="bg-slate-900/90 border border-red-500/30 rounded-2xl p-5 mb-4 shadow-xl">
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldAlert className="w-4 h-4" />
            <span>{language === 'ar' ? 'حاجز الأمان الطبي الإلزامي (بدون ذكاء اصطناعي)' : 'Deterministic Safety Boundary (Zero LLM)'}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
            {language === 'ar' ? rule.clinicalRationaleAr : rule.clinicalRationaleEn}
          </p>

          <div className="p-3 bg-red-950/40 border border-red-800/40 rounded-xl text-xs text-red-300 flex items-start space-x-2 rtl:space-x-reverse">
            <Clock className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
            <div>
              <span className="font-bold">
                {language === 'ar' ? 'تم تخطي بطاقة الدخول العادية فوراً: ' : 'Standard Silent Pass Ticket Overridden: '}
              </span>
              <span>
                {language === 'ar' 
                  ? 'هذه الحالة تتطلب فحصاً فورياً في قسم الطوارئ بالمستشفى وليس موعداً روتينياً في العيادة.' 
                  : 'This presentation mandates immediate emergency hospital evaluation, not a deferred routine clinic visit.'}
              </span>
            </div>
          </div>
        </div>

        {/* Immediate Instructions */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 mb-5 shadow-lg">
          <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-3">
            {language === 'ar' ? 'التعليمات الفورية الواجب اتباعها:' : 'Actionable Emergency Instructions:'}
          </h3>
          <div className="whitespace-pre-line text-xs sm:text-sm text-slate-200 leading-relaxed">
            {language === 'ar' ? rule.instructionAr : rule.instructionEn}
          </div>
        </div>

        {/* Direct Emergency Call Actions */}
        <div className="space-y-2.5 mb-6">
          {rule.phoneNumbers.map((phone, idx) => (
            <a
              key={idx}
              href={`tel:${phone.number}`}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm sm:text-base flex items-center justify-between shadow-xl shadow-red-600/30 active:scale-[0.98] transition-all"
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <PhoneCall className="w-5 h-5 animate-bounce" />
                <span>{phone.label}</span>
              </div>
              <span className="font-mono text-sm bg-black/20 px-3 py-1 rounded-lg">
                {phone.number}
              </span>
            </a>
          ))}
        </div>

        {/* Nearest Urology Emergency Center Preview */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between text-xs text-slate-400 mb-6">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <div>
              <div className="text-slate-200 font-medium">Rashid Hospital Emergency Trauma & Urology</div>
              <div className="text-[11px] text-slate-500">24/7 Doppler Ultrasound & On-call Urologist (2.8 km)</div>
            </div>
          </div>
          <span className="text-cyan-400 font-mono text-[11px]">~7 min</span>
        </div>

        {/* Reset / Return button */}
        <div className="text-center">
          <button
            onClick={onReset}
            className="text-xs text-slate-400 hover:text-white flex items-center justify-center space-x-1 rtl:space-x-reverse mx-auto py-2 px-4 rounded-xl hover:bg-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
            <span>{language === 'ar' ? 'العودة وبدء استبيان جديد' : 'Return and restart intake'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
