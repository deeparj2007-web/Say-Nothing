import { IntakeQuestion } from '../types';

export const INTAKE_QUESTIONS: IntakeQuestion[] = [
  {
    id: 'Q1_CHIEF_COMPLAINT',
    order: 1,
    category: 'chief_complaint',
    promptAudioTextEn: "Welcome. Speak naturally. What made you decide to get checked today?",
    promptAudioTextAr: "أهلاً بك. تكلم براحتك بدون ما تكتب. شو اللي خلاك تفكر تسوي فحص اليوم؟",
    textEn: "What is the primary reason you are seeking a check-up today?",
    textAr: "ما هو السبب الرئيسي لطلب الفحص اليوم؟",
    helpTextEn: "Speak about any symptoms, discomfort, fertility planning, or general preventive health.",
    helpTextAr: "تحدث عن أي ألم، ثقل، تخطيط للإنجاب، أو مجرد فحص وقائي عام.",
    quickVoiceChipsEn: [
      "Dull ache or dragging feeling",
      "Planning for fertility & checkup",
      "Urinary hesitation or weak stream",
      "Just want a routine preventive check"
    ],
    quickVoiceChipsAr: [
      "ثقل أو عوار خفيف في الخصية",
      "فحص خصوبة وتخطيط إنجاب",
      "صعوبة أو تقطيع في البول",
      "فحص وقائي شامل للرجال"
    ]
  },
  {
    id: 'Q2_DURATION',
    order: 2,
    category: 'duration',
    promptAudioTextEn: "How long has this been going on, or is this a long-term preventive decision?",
    promptAudioTextAr: "من متى تلاحظ هذا الشي؟ هل هو من أيام أو أسابيع أو شهور؟",
    textEn: "How long have you noticed these sensations or had this goal?",
    textAr: "منذ متى تلاحظ هذه الأعراض أو تفكر بهذا الفحص؟",
    helpTextEn: "E.g., few hours, 2 weeks, several months, or ongoing for years.",
    helpTextAr: "مثال: من ساعات، من أسبوعين، من عدة أشهر، أو مجرد رغبة حالية.",
    quickVoiceChipsEn: [
      "Gradual over past few months",
      "Noticed it about 2 weeks ago",
      "Only when standing for long hours",
      "No symptoms, just routine planning"
    ],
    quickVoiceChipsAr: [
      "ملاحظة تدريجية من عدة شهور",
      "بدأ قبل أسبوعين تقريباً",
      "يزيد مع الوقوف لساعات طويلة",
      "لا توجد أعراض، مجرد فحص روتيني"
    ]
  },
  {
    id: 'Q3_SAFETY_REDFLAGS',
    order: 3,
    category: 'red_flag_check',
    isRedFlagCheck: true,
    promptAudioTextEn: "Important safety check: Have you experienced any sudden severe agonizing pain, a rock-hard lump, or visible blood in your urine?",
    promptAudioTextAr: "سؤال مهم جداً لسلامتك: هل تحس بألم حاد مفاجئ وشديد جداً؟ أو لمست كتلة يابسة مثل الحجر؟ أو شفت دم في البول؟",
    textEn: "Safety Check: Any sudden agonizing pain, rock-hard lump, or blood in urine?",
    textAr: "فحص السلامة الحرج: هل يوجد ألم شديد مفاجئ، كتلة صلبة كالحجر، أو دم بالبول؟",
    helpTextEn: "This deterministic safety rule immediately identifies conditions requiring the ER over routine clinic consults.",
    helpTextAr: "هذا الفحص المباشر يحدد الحالات التي تتطلب تدخلاً إسعافياً عاجلاً فورياً.",
    quickVoiceChipsEn: [
      "No sudden pain, no hard lump, no blood",
      "Sudden severe pain that started hours ago (URGENT)",
      "Found a hard painless lump like a marble",
      "Noticed reddish blood in my urine"
    ],
    quickVoiceChipsAr: [
      "لا يوجد ألم مفاجئ ولا كتل صلبة ولا دم",
      "ألم شديد مفاجئ بدأ قبل ساعات (طوارئ)",
      "لقيت كتلة صلبة يابسة مثل الحبة بدون ألم",
      "لاحظت لون دم بالبول"
    ]
  },
  {
    id: 'Q4_ASSOCIATED_SIGNS',
    order: 4,
    category: 'associated_signs',
    promptAudioTextEn: "Does the discomfort change with temperature, sitting, or physical gym workouts?",
    promptAudioTextAr: "هل العوار أو الثقل يزيد مع الجيم، الجو الحار، أو بعد الوقوف بالدوام؟",
    textEn: "Do your symptoms worsen with prolonged standing, heat, or gym workouts?",
    textAr: "هل تزيد الأعراض مع الوقوف الطويل أو الحرارة أو الرياضة؟",
    helpTextEn: "Helps differentiate vascular pooling (varicocele) from musculoskeletal or pelvic tension.",
    helpTextAr: "يساعد في التمييز بين احتقان الأوردة (الدوالي) والشد العضلي أو الحوضي.",
    quickVoiceChipsEn: [
      "Heavier by the evening and after gym",
      "Relieved when lying down flat",
      "Wakes me up at night to urinate",
      "No change with posture or exercise"
    ],
    quickVoiceChipsAr: [
      "يزيد الثقل بنهاية اليوم وبعد النادي",
      "يرتاح لما أنسدح على ظهري",
      "أصحى بالليل كذا مرة عشان أتبول",
      "ما يتأثر بالوقوف أو التمرين"
    ]
  },
  {
    id: 'Q5_PRIOR_HISTORY',
    order: 5,
    category: 'symptom_nature',
    promptAudioTextEn: "Lastly, any previous groin surgeries, childhood mumps, or specific fertility timelines you want addressed?",
    promptAudioTextAr: "أخيراً، هل سويت أي عملية فتاق سابقاً، أو عندك موعد إنجاب قريب تحب نركز عليه؟",
    textEn: "Any history of hernia repair, groin surgeries, or timeline for family planning?",
    textAr: "هل لديك تاريخ لعملية فتق، أو جدول زمني لتأسيس أسرة؟",
    helpTextEn: "Provides the consulting physician with concise surgical and lifestyle baseline context.",
    helpTextAr: "يزود الطبيب المعالج بسياق جراحي وخلفية طبية مختصرة ومباشرة.",
    quickVoiceChipsEn: [
      "No previous surgeries, planning family within 6-12 months",
      "Past inguinal hernia repair as a child",
      "Taking gym supplements / protein",
      "No past surgical history, purely preventive"
    ],
    quickVoiceChipsAr: [
      "ما عندي عمليات سابقة، ونخطط للإنجاب خلال 6-12 شهر",
      "سويت عملية فتاق بالصغر",
      "استخدم مكملات وبروتين رياضي",
      "سليم تماماً وبدون أي عمليات سابقة"
    ]
  }
];
