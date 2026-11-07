import React, { useState } from 'react';
import { 
  TrendingUp, Users, AlertTriangle, CheckCircle2, ArrowRight, 
  BarChart3, ShieldCheck, Zap, HeartPulse, Sparkles
} from 'lucide-react';
import { SYNTHETIC_COHORT_DATA, FunnelStepMetric } from '../../data/syntheticCohort';
import { Language } from '../../types';

interface DropoffFunnelSimulatorProps {
  language: Language;
}

export const DropoffFunnelSimulator: React.FC<DropoffFunnelSimulatorProps> = ({ language }) => {
  const [cohortSize, setCohortSize] = useState<number>(1000);
  const [selectedStep, setSelectedStep] = useState<FunnelStepMetric>(SYNTHETIC_COHORT_DATA[2]); // The Front-Desk Barrier step

  const scaleFactor = cohortSize / 1000;

  // Key outcomes
  const traditionalCompleted = Math.round(190 * scaleFactor);
  const silentPassCompleted = Math.round(810 * scaleFactor);
  const netMenRescued = silentPassCompleted - traditionalCompleted;
  const earlyDetectedMalignancies = Math.round(netMenRescued * 0.018); // ~1.8% of screened men with palpable abnormalities

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col p-4 sm:p-6 ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-5xl mx-auto w-full my-auto py-6">

        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'المقياس الحاسم للفوز: محاكي مسار التسرب (Funnel)' : 'The One Metric That Matters: Drop-off Funnel Simulator'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              {language === 'ar' ? 'مقارنة نسبة إتمام الفحص: التقليدي مقابل SilentPass' : 'Drop-off Rate at Each Step: Traditional vs. SilentPass'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {language === 'ar' 
                ? 'اختبار مع مجتمع مستخدمين اصطناعي (Synthetic Cohort) لإثبات أين يقع التسرب ولماذا تنهار نسبة الحضور في الطرق التقليدية.'
                : 'Synthetic user cohort proof showing exactly where the 60% traditional drop-off occurs and how SilentPass overcomes it.'}
            </p>
          </div>

          {/* Interactive Cohort Size Slider */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 min-w-[260px]">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span>{language === 'ar' ? 'حجم الفئة التجريبية:' : 'Synthetic Cohort Size:'}</span>
              <span className="font-mono font-bold text-cyan-400">{cohortSize.toLocaleString()} men</span>
            </div>
            <input
              type="range"
              min="200"
              max="10000"
              step="100"
              value={cohortSize}
              onChange={(e) => setCohortSize(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>200</span>
              <span>5,000</span>
              <span>10,000</span>
            </div>
          </div>
        </div>

        {/* Top Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">
              {language === 'ar' ? 'العيادات التقليدية (معدل الإتمام)' : 'Traditional Clinic Completion'}
            </span>
            <div className="text-2xl font-black text-rose-400">
              19% <span className="text-xs font-normal text-slate-400">({traditionalCompleted.toLocaleString()} men)</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              81% drop out primarily at the front-desk verbal inquiry.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-4 shadow-lg">
            <span className="text-[11px] text-cyan-400 uppercase font-semibold block mb-1">
              {language === 'ar' ? 'مع SilentPass (معدل الإتمام)' : 'SilentPass Completion'}
            </span>
            <div className="text-2xl font-black text-emerald-400">
              81% <span className="text-xs font-normal text-slate-400">({silentPassCompleted.toLocaleString()} men)</span>
            </div>
            <p className="text-[11px] text-emerald-400/80 mt-1">
              4.26x higher completed consultations and referral closure.
            </p>
          </div>

          <div className="bg-gradient-to-br from-brand-950 to-cyan-950 border border-brand-500/30 rounded-2xl p-4 shadow-lg">
            <span className="text-[11px] text-brand-300 uppercase font-semibold block mb-1">
              {language === 'ar' ? 'رجال حصلوا على الرعاية (صافي الزيادة)' : 'Net Additional Consultations'}
            </span>
            <div className="text-2xl font-black text-white">
              +{netMenRescued.toLocaleString()} <span className="text-xs font-normal text-brand-300">men</span>
            </div>
            <p className="text-[11px] text-brand-200/80 mt-1">
              Est. ~{earlyDetectedMalignancies} early curable pathologies identified.
            </p>
          </div>
        </div>

        {/* Visual Funnel Comparison Rows */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl mb-8">
          <h2 className="text-sm uppercase tracking-wider font-bold text-slate-300 mb-4 flex items-center justify-between">
            <span>{language === 'ar' ? 'مسار الفحص خطوة بخطوة:' : 'Step-by-Step Funnel Retention Analysis:'}</span>
            <span className="text-xs text-slate-400 font-normal">
              {language === 'ar' ? 'اضغط على أي خطوة لرؤية تفاصيل العائق' : 'Click any step to inspect clinical barrier'}
            </span>
          </h2>

          <div className="space-y-4">
            {SYNTHETIC_COHORT_DATA.map((step, idx) => {
              const tradScaled = Math.round(step.traditionalCount * scaleFactor);
              const silentScaled = Math.round(step.silentPassCount * scaleFactor);
              const tradPercent = (step.traditionalCount / 1000) * 100;
              const silentPercent = (step.silentPassCount / 1000) * 100;
              const isSelected = selectedStep.stepId === step.stepId;

              return (
                <div
                  key={step.stepId}
                  onClick={() => setSelectedStep(step)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-slate-800/80 border-cyan-400 shadow-md' 
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs sm:text-sm font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
                      <span>{language === 'ar' ? step.stepNameAr : step.stepNameEn}</span>
                      {step.stepId === 'FRONT_DESK_CONFRONTATION' && (
                        <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-mono">
                          Primary Barrier: "The Sentence"
                        </span>
                      )}
                    </span>
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {step.deltaGain}
                    </span>
                  </div>

                  {/* Dual Comparison Bars */}
                  <div className="space-y-2">
                    {/* SilentPass Bar */}
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span className="text-cyan-300 font-semibold">SilentPass:</span>
                        <span className="font-mono text-slate-200">{silentScaled.toLocaleString()} ({silentPercent.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-brand-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${silentPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Traditional Bar */}
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span className="text-rose-300 font-semibold">Traditional Clinic:</span>
                        <span className="font-mono text-slate-200">{tradScaled.toLocaleString()} ({tradPercent.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-rose-600 to-red-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${tradPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Step Deep Dive Card */}
        <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>{language === 'ar' ? 'تحليل العائق السلوكي للخطوة المختارة:' : 'Behavioral Chokepoint Breakdown:'}</span>
          </div>
          <h3 className="text-base font-bold text-white mb-2">
            {language === 'ar' ? selectedStep.stepNameAr : selectedStep.stepNameEn}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
            {language === 'ar' ? selectedStep.barrierExplanationAr : selectedStep.barrierExplanationEn}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-red-950/30 border border-red-800/40 rounded-xl">
              <span className="text-red-400 font-bold block mb-1">Traditional Drop-off:</span>
              <span className="text-slate-300">
                {selectedStep.traditionalDropoffPercent}% of candidates abandon at this specific touchpoint.
              </span>
            </div>
            <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-xl">
              <span className="text-emerald-400 font-bold block mb-1">SilentPass Retention:</span>
              <span className="text-slate-300">
                Only {selectedStep.silentPassDropoffPercent}% drop-off, preserving {selectedStep.deltaGain}.
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
