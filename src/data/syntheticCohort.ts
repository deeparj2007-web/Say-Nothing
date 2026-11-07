export interface FunnelStepMetric {
  stepId: string;
  stepNameEn: string;
  stepNameAr: string;
  traditionalCount: number;
  traditionalDropoffPercent: number;
  silentPassCount: number;
  silentPassDropoffPercent: number;
  deltaGain: string;
  barrierExplanationEn: string;
  barrierExplanationAr: string;
}

export const SYNTHETIC_COHORT_DATA: FunnelStepMetric[] = [
  {
    stepId: 'INTENT_STARTED',
    stepNameEn: '1. Started Intake / Recognized Need',
    stepNameAr: '1. بدء الفحص / إدراك الحاجة',
    traditionalCount: 1000,
    traditionalDropoffPercent: 0,
    silentPassCount: 1000,
    silentPassDropoffPercent: 0,
    deltaGain: 'Baseline',
    barrierExplanationEn: 'Both cohorts begin with 1,000 men seeking men’s reproductive or preventive evaluation.',
    barrierExplanationAr: 'يبدأ كلا المسارين بـ 1000 رجل يبحثون عن تقييم وقائي أو إنجابي.'
  },
  {
    stepId: 'INTAKE_ENGAGEMENT',
    stepNameEn: '2. Intake Completion (Voice vs. 15-page Paper)',
    stepNameAr: '2. استكمال الاستبيان (صوتي دقيقتين مقابل أوراق)',
    traditionalCount: 780,
    traditionalDropoffPercent: 22,
    silentPassCount: 940,
    silentPassDropoffPercent: 6,
    deltaGain: '+160 completed',
    barrierExplanationEn: 'Paper/web forms cause fatigue and typing hesitation; 2-minute voice in car or private room has 94% retention.',
    barrierExplanationAr: 'الاستمارات المكتوبة تسبب مللاً وتردداً؛ بينما التسجيل الصوتي لمدة دقيقتين يحقق 94% استجابة.'
  },
  {
    stepId: 'FRONT_DESK_CONFRONTATION',
    stepNameEn: '3. The Front-Desk Barrier ("The Sentence")',
    stepNameAr: '3. حاجز الاستقبال ("جملة الإحراج")',
    traditionalCount: 310,
    traditionalDropoffPercent: 60.2,
    silentPassCount: 885,
    silentPassDropoffPercent: 5.8,
    deltaGain: '+575 preserved (5.1x gain)',
    barrierExplanationEn: 'CRITICAL CHOKEPOINT: 60% of traditional patients abort rather than speak reproductive issues to counter staff. SilentPass requires zero words.',
    barrierExplanationAr: 'أكبر نقطة انسحاب: 60% يتراجعون خوفاً من التحدث لموظف الاستقبال. سايلنت باس يحذف الكلمة تماماً.'
  },
  {
    stepId: 'CLINIC_ARRIVAL',
    stepNameEn: '4. Physical Clinic Arrival & QR Scan',
    stepNameAr: '4. الحضور للعيادة ومسح الباركود',
    traditionalCount: 220,
    traditionalDropoffPercent: 29,
    silentPassCount: 840,
    silentPassDropoffPercent: 5.1,
    deltaGain: '+620 present',
    barrierExplanationEn: 'Men arrive confident that the receptionist screen will only display "Preventive Men’s Consult, 20 min".',
    barrierExplanationAr: 'يحضر المريض وهو مطمئن أن شاشة الاستقبال لن تعرض سوى عبارة محايدة: استشارة وقائية للرجال.'
  },
  {
    stepId: 'CONSULT_COMPLETED',
    stepNameEn: '5. Doctor Consult Completed ("Loop Closed")',
    stepNameAr: '5. إتمام الاستشارة مع الطبيب وإغلاق الحلقة',
    traditionalCount: 190,
    traditionalDropoffPercent: 13.6,
    silentPassCount: 810,
    silentPassDropoffPercent: 3.5,
    deltaGain: '+620 net completed (4.26x)',
    barrierExplanationEn: 'Final completed consultations rise from 19% (traditional) to 81% with SilentPass, closing the referral loop cleanly.',
    barrierExplanationAr: 'ترتفع نسبة إتمام الفحص من 19% بالطريقة التقليدية إلى 81% عبر سايلنت باس.'
  }
];
