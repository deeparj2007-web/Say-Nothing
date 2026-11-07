import React, { useState } from 'react';
import { 
  CheckCircle2, AlertCircle, Info, ChevronDown, ChevronUp, 
  HelpCircle, Sparkles, ShieldCheck, QrCode, ArrowRight, Activity
} from 'lucide-react';
import { TriageAssessment, Language } from '../../types';

interface HonestResultCardProps {
  assessment: TriageAssessment;
  language: Language;
  onGeneratePass: () => void;
  onRetake: () => void;
}

export const HonestResultCard: React.FC<HonestResultCardProps> = ({
  assessment,
  language,
  onGeneratePass,
  onRetake
}) => {
  const [expandedFindingId, setExpandedFindingId] = useState<string | null>(
    assessment.findings[0]?.id || null
  );

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col p-4 sm:p-6 ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-xl mx-auto w-full my-auto py-6">
        
        {/* Top Header Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'تقرير المصارحة الطبية الشفافة' : 'Honest Result Card & Signal Analysis'}</span>
          </div>
          <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-xs text-slate-400">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'ar' ? 'نسبة الثقة بالتطابق:' : 'Signal Confidence:'}</span>
            <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
              {assessment.overallConfidence}%
            </span>
          </div>
        </div>

        {/* Clear Non-Diagnostic Disclaimer Banner */}
        <div className="bg-gradient-to-r from-amber-500/15 via-slate-900 to-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-6 shadow-lg">
          <div className="flex items-start space-x-2.5 rtl:space-x-reverse">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs uppercase tracking-wider font-bold text-amber-300 mb-1">
                {language === 'ar' ? 'تنبيه صريح: هذا مؤشر فحص توجيهي وليس تشخيصاً نهائياً' : 'Screening Signal Only — NOT a Medical Diagnosis'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'ar' ? assessment.disclaimerAr : assessment.disclaimerEn}
              </p>
            </div>
          </div>
        </div>

        {/* Section 1: What We Found (with Explainability Tracing) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm uppercase tracking-wider font-bold text-slate-300 flex items-center space-x-2 rtl:space-x-reverse">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{language === 'ar' ? '1. ما أظهره التقييم الصوتي (المؤشرات المستخلصة):' : '1. What We Identified (Screening Signals):'}</span>
            </h2>
            <span className="text-[11px] text-slate-500">
              {language === 'ar' ? 'اضغط لرؤية سبب الربط' : 'Tap to reveal why'}
            </span>
          </div>

          <div className="space-y-3">
            {assessment.findings.map(finding => {
              const isExpanded = expandedFindingId === finding.id;
              return (
                <div 
                  key={finding.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-md transition-all"
                >
                  <button
                    onClick={() => setExpandedFindingId(isExpanded ? null : finding.id)}
                    className="w-full p-4 text-left rtl:text-right flex items-center justify-between hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex-1 pr-3 rtl:pr-0 rtl:pl-3">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                        <span className="text-xs font-semibold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded">
                          {finding.category}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {finding.confidenceScore}% {language === 'ar' ? 'ثقة' : 'confidence'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">
                        {language === 'ar' ? finding.titleAr : finding.titleEn}
                      </h4>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    )}
                  </button>

                  {/* Explainability Drawer linking to verbatim voice excerpt */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-slate-800/70 bg-slate-950/60 space-y-2.5 text-xs animate-fadeIn">
                      <p className="text-slate-300 leading-relaxed">
                        {language === 'ar' ? finding.screeningSignalAr : finding.screeningSignalEn}
                      </p>

                      {/* The Exact Question & Spoken Excerpt Link */}
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-1">
                        <div className="text-slate-400 font-medium">
                          <span className="text-cyan-400 font-semibold">
                            {language === 'ar' ? 'السؤال المرتبط: ' : 'Triggered by question: '}
                          </span>
                          "{language === 'ar' ? finding.triggeringQuestionTextAr : finding.triggeringQuestionTextEn}"
                        </div>
                        <div className="text-emerald-300/90 italic font-mono bg-slate-950 p-2 rounded border border-slate-800/60">
                          "{finding.triggeringVoiceExcerpt}"
                        </div>
                        <div className="text-slate-400 text-[10px] pt-1">
                          <span className="text-amber-400 font-medium">
                            {language === 'ar' ? 'التوصية الطبية السريرية: ' : 'Recommended clinical action: '}
                          </span>
                          {language === 'ar' ? finding.clinicalSignificanceAr : finding.clinicalSignificanceEn}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: What We Could NOT Assess (Honest Boundary) */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 rtl:space-x-reverse mb-3">
            <Info className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm uppercase tracking-wider font-bold text-slate-300">
              {language === 'ar' ? '2. ما لم يستطع التطبيق تقييمه (حدود الصوت):' : '2. What We Could NOT Assess (Our Honest Boundaries):'}
            </h2>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 divide-y divide-slate-800">
            {assessment.unassessed.map(factor => (
              <div key={factor.id} className="py-2.5 first:pt-0 last:pb-0 text-xs">
                <div className="flex items-center justify-between text-slate-200 font-medium mb-1">
                  <span>{language === 'ar' ? factor.factorAr : factor.factorEn}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono">
                    {language === 'ar' ? 'فحص عيادي مطلوب' : 'In-Clinic Only'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-1">
                  {language === 'ar' ? factor.reasonAr : factor.reasonEn}
                </p>
                <p className="text-[10px] text-cyan-400/90 font-mono">
                  → {language === 'ar' ? factor.requiredTestAr : factor.requiredTestEn}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button: Generate The Silent Pass */}
        <div className="space-y-3">
          <button
            onClick={onGeneratePass}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-brand-600 via-cyan-600 to-teal-500 hover:from-brand-500 hover:to-teal-400 text-white font-bold text-base flex items-center justify-center space-x-2 rtl:space-x-reverse shadow-xl shadow-brand-500/25 active:scale-[0.98] transition-all"
          >
            <QrCode className="w-5 h-5" />
            <span>{language === 'ar' ? 'إصدار تصريح العيادة الصامت (Silent Pass)' : 'Generate Silent Pass (48h QR Code)'}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>

          <p className="text-center text-[11px] text-slate-500">
            {language === 'ar' 
              ? 'صالح لمدة 48 ساعة. يرى موظف الاستقبال فقط عبارة "استشارة وقائية" دون تفاصيل مرضية.' 
              : 'Valid for 48 hours. Receptionist will see only "Preventive Men’s Consult, 20 min" with zero medical details.'}
          </p>

          <div className="text-center pt-2">
            <button
              onClick={onRetake}
              className="text-xs text-slate-400 hover:text-white underline underline-offset-4"
            >
              {language === 'ar' ? 'إعادة الإجابة على الأسئلة' : 'Retake or adjust voice answers'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
