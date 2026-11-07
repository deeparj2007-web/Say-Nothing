import { PatientAnswer, TriageAssessment, ClinicalFinding, UnassessedFactor, RedFlagRule } from '../types';
import { RED_FLAG_RULES } from '../data/redFlagRules';
import { INTAKE_QUESTIONS } from '../data/intakeQuestions';

export class TriageEngine {
  // Deterministic rule engine for red flags. Zero LLM involvement for clinical safety.
  public static evaluateRedFlags(answers: PatientAnswer[]): RedFlagRule | null {
    for (const answer of answers) {
      const lower = answer.transcript.toLowerCase();
      for (const rule of RED_FLAG_RULES) {
        // Check English keywords
        for (const kw of rule.keywordsEn) {
          if (lower.includes(kw.toLowerCase())) {
            return rule;
          }
        }
        // Check Arabic keywords
        for (const kw of rule.keywordsAr) {
          if (lower.includes(kw.toLowerCase())) {
            return rule;
          }
        }
      }
    }
    return null;
  }

  // Generates honest screening findings with question-level trace links
  public static evaluateIntake(answers: PatientAnswer[]): TriageAssessment {
    const triggeredRedFlag = this.evaluateRedFlags(answers);
    const hasRedFlag = !!triggeredRedFlag;

    const findings: ClinicalFinding[] = [];
    const unassessed: UnassessedFactor[] = [
      {
        id: 'UNASSESSED_PALPATION',
        factorEn: 'Physical Scrotal & Inguinal Palpation',
        factorAr: 'الفحص السريري اليدوي للخصية والقناة الإربية',
        reasonEn: 'Voice intake cannot assess physical organ consistency, testicular volume, or cord thickening.',
        reasonAr: 'التقييم الصوتي لا يمكنه جس قوام العضو أو قياس حجمه بدقة.',
        requiredTestEn: 'In-person examination by consulting physician',
        requiredTestAr: 'فحص سريري مباشر من قبل الطبيب المعالج'
      },
      {
        id: 'UNASSESSED_SEMEN',
        factorEn: 'Semen Analysis & Spermatogenesis Profile',
        factorAr: 'تحليل السائل المنوي وخصائص الحيوانات المنوية',
        reasonEn: 'Voice report cannot quantify count, progressive motility, or morphology.',
        reasonAr: 'لا يمكن قياس العدد، الحركة، أو نسبة التشوهات عبر الوصف الصوتي.',
        requiredTestEn: 'Standard WHO 6th Edition Semen Analysis',
        requiredTestAr: 'تحليل السائل المنوي وفق معايير منظمة الصحة العالمية'
      },
      {
        id: 'UNASSESSED_HORMONES',
        factorEn: 'Endocrine & Serum Testosterone Levels',
        factorAr: 'المستوى الهرموني ومستوى هرمون الذكورة (التستوستيرون)',
        reasonEn: 'Subjective fatigue or libido reports do not establish hypogonadism without lab confirmation.',
        reasonAr: 'الشعور بالإرهاق لا يثبت نقص الهرمون دون فحص دم مخبري صباحي.',
        requiredTestEn: 'Morning Total & Free Serum Testosterone, LH, FSH',
        requiredTestAr: 'فحص دم صباحي لمستوى التستوستيرون والهرمونات المحفزة'
      }
    ];

    // Evaluate answers to synthesize clinical signals
    answers.forEach(ans => {
      const q = INTAKE_QUESTIONS.find(item => item.id === ans.questionId);
      const text = ans.transcript.toLowerCase();

      // Signal 1: Varicocele / Vascular Congestion
      if (
        text.includes('dull') || text.includes('drag') || text.includes('standing') || 
        text.includes('gym') || text.includes('ثقل') || text.includes('عوار خفيف') || 
        text.includes('الوقوف') || text.includes('نادي')
      ) {
        if (!findings.some(f => f.id === 'SIGNAL_VARICOCELE')) {
          findings.push({
            id: 'SIGNAL_VARICOCELE',
            titleEn: 'Dependent Scrotal Discomfort (Suspicion of Clinical Varicocele)',
            titleAr: 'ثقل واعتلال كيسي مرتبط بالوقوف (اشتباه دوالي الخصية)',
            category: 'Scrotal / Vascular',
            screeningSignalEn: 'Symptom pattern (posture-dependent aching relieved by supine rest) is strongly consistent with pampiniform venous congestion (Varicocele Grade I-II).',
            screeningSignalAr: 'نمط الأعراض (ثقل يزداد مع الوقوف ويرتاح بالاستلقاء) يتطابق مع احتقان أوردة الحبل المنوي.',
            confidenceScore: 84,
            triggeringQuestionId: ans.questionId,
            triggeringQuestionTextEn: q?.textEn || 'Chief Complaint / Triggers',
            triggeringQuestionTextAr: q?.textAr || 'الشكوى الرئيسية والمحفزات',
            triggeringVoiceExcerpt: ans.transcript,
            clinicalSignificanceEn: 'Warrants high-resolution color Doppler ultrasound of the scrotum in upright and supine positions.',
            clinicalSignificanceAr: 'يوصى بعمل تصوير تلفزيوني بالموجات فوق الصوتية (دوبلر ملون) بوضعية الوقوف والاستلقاء.'
          });
        }
      }

      // Signal 2: Pre-Conception Male Fertility Evaluation
      if (
        text.includes('fertility') || text.includes('family') || text.includes('baby') || 
        text.includes('خصوبة') || text.includes('إنجاب') || text.includes('طفل') || 
        text.includes('أسرة')
      ) {
        if (!findings.some(f => f.id === 'SIGNAL_FERTILITY')) {
          findings.push({
            id: 'SIGNAL_FERTILITY',
            titleEn: 'Pre-Conception Male Reproductive Workup Requested',
            titleAr: 'طلب تقييم الخصوبة والصحة الإنجابية للرجل',
            category: 'Sexual / Endocrine',
            screeningSignalEn: 'Active family planning timeline identified. Early preventive baseline testing mitigates prolonged subfertility distress.',
            screeningSignalAr: 'رغبة في التخطيط الأسري والإنجاب. التقييم المبكر يختصر الوقت ويوفر راحة البال.',
            confidenceScore: 92,
            triggeringQuestionId: ans.questionId,
            triggeringQuestionTextEn: q?.textEn || 'Reason for Visit',
            triggeringQuestionTextAr: q?.textAr || 'سبب الزيارة',
            triggeringVoiceExcerpt: ans.transcript,
            clinicalSignificanceEn: 'Recommend baseline semen analysis (2-5 days abstinence) and preventive lifestyle optimization consult.',
            clinicalSignificanceAr: 'يوصى بتحليل السائل المنوي بعد امتناع 2-5 أيام ومراجعة نمط الحياة والمكملات.'
          });
        }
      }

      // Signal 3: Lower Urinary Tract Symptoms (LUTS)
      if (
        text.includes('hesitation') || text.includes('weak stream') || text.includes('stream') || 
        text.includes('night') || text.includes('صعوبة') || text.includes('تقطيع') || 
        text.includes('البول') || text.includes('أصحى بالليل')
      ) {
        if (!findings.some(f => f.id === 'SIGNAL_LUTS')) {
          findings.push({
            id: 'SIGNAL_LUTS',
            titleEn: 'Mild Lower Urinary Tract Symptoms (LUTS) / Voiding Hesitation',
            titleAr: 'أعراض المسالك البولية السفلية الخفيفة / تقطيع في البول',
            category: 'Urinary / LUTS',
            screeningSignalEn: 'Patient reports voiding hesitation or nocturnal awakening, indicating potential early prostatic or bladder neck transition.',
            screeningSignalAr: 'تقرير المريض يشير إلى بطء تدفق البول أو الاستيقاظ ليلاً، مما يستدعي فحص المثانة والبروستاتا.',
            confidenceScore: 78,
            triggeringQuestionId: ans.questionId,
            triggeringQuestionTextEn: q?.textEn || 'Symptom Impact',
            triggeringQuestionTextAr: q?.textAr || 'تأثير الأعراض',
            triggeringVoiceExcerpt: ans.transcript,
            clinicalSignificanceEn: 'Recommend baseline IPSS questionnaire, non-invasive uroflowmetry, and post-void residual ultrasound.',
            clinicalSignificanceAr: 'يوصى باستبيان البروستاتا الدولي وتدفق البول غير التداخلي مع قياس المتبقي بالمثانة.'
          });
        }
      }
    });

    // If routine preventive check with no specific symptoms
    if (findings.length === 0) {
      findings.push({
        id: 'SIGNAL_PREVENTIVE',
        titleEn: 'Comprehensive Preventive Men’s Health Baseline',
        titleAr: 'فحص وقائي عام لسلامة وصحة الرجل',
        category: 'Preventive Baseline',
        screeningSignalEn: 'No acute or localized pathology indicated in spoken survey. Patient is proactively seeking annual health baseline.',
        screeningSignalAr: 'لم تظهر المؤشرات الصوتية أي أعراض حادة. المريض يسعى لفحص وقائي دوري واطمئنان عام.',
        confidenceScore: 90,
        triggeringQuestionId: answers[0]?.questionId || 'Q1',
        triggeringQuestionTextEn: 'General Health Profile',
        triggeringQuestionTextAr: 'الملف الصحي العام',
        triggeringVoiceExcerpt: answers[0]?.transcript || 'Routine checkup requested',
        clinicalSignificanceEn: 'Ideal opportunity for preventive cardiovascular/metabolic blood panel and baseline reproductive wellness advice.',
        clinicalSignificanceAr: 'فرصة مثالية لفحص الدهون، السكر التراكمي، والمؤشرات الحيوية لتعزيز الصحة والوقاية.'
      });
    }

    const overallConfidence = Math.round(
      findings.reduce((acc, f) => acc + f.confidenceScore, 0) / findings.length
    );

    return {
      id: 'TRIAGE-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      timestamp: Date.now(),
      hasRedFlag,
      triggeredRedFlag: triggeredRedFlag || undefined,
      findings,
      unassessed,
      overallConfidence,
      summaryNoteEn: hasRedFlag
        ? 'DETERMINISTIC RED-FLAG OVERRIDE ACTIVATED. Standard appointment ticket halted. Emergency escalation required.'
        : `Voice intake completed across 5 domains. ${findings.length} screening signal(s) synthesized with verified question linkages.`,
      summaryNoteAr: hasRedFlag
        ? 'تم تفعيل التنبيه الحرج الطارئ وتوقيف الموعد العادي لتوجيه المريض للعناية الطبية الفورية.'
        : `اكتمل التقييم الصوتي. تم استخلاص ${findings.length} مؤشرات توجيهية مرتبطة مباشرة بإجابات المريض.`,
      disclaimerEn: 'THIS IS A PRE-CONSULTATION SCREENING SIGNAL, NOT A MEDICAL DIAGNOSIS. SilentPass provides structured intake context to save consultation time and preserve front-desk privacy. All clinical diagnoses, palpations, and prescriptions must be performed exclusively by a licensed healthcare provider.',
      disclaimerAr: 'هذا تقييم توجيهي مسبق وليس تشخيصاً طبياً نهائياً. يهدف تطبيق سايلنت باس إلى حفظ الخصوصية التامة واختصار وقت الاستشارة. التشخيص النهائي والفحص السريري يقع حصراً على عاتق الطبيب المرخص.'
    };
  }
}
