import { RedFlagRule } from '../types';

export const RED_FLAG_RULES: RedFlagRule[] = [
  {
    id: 'RF-TORSION-01',
    nameEn: 'Suspected Acute Testicular Torsion',
    nameAr: 'اشتباه انفتال الخصية الحاد (حالة طوارئ قصوى)',
    medicalCategory: 'Testicular Torsion',
    keywordsEn: [
      'sudden pain', 'acute pain', 'started hours ago', 'sharp pain', 'severe pain', 
      'woke up with pain', 'scrotal pain', 'vomiting with pain', 'sudden swelling', 
      'twisted', 'high-riding testicle', 'agony', 'intense pain'
    ],
    keywordsAr: [
      'ألم فجائي', 'عوار شديد', 'ألم حاد', 'فجأة', 'بدأ قبل ساعات', 'انتفاخ سريع', 
      'لوعة مع ألم', 'استفراغ', 'مغص بالخصية', 'عوار قوي', 'ما أقدر ألمسها', 'مفاجئ'
    ],
    severity: 'CRITICAL_IMMEDIATE',
    emergencyTitleEn: 'EMERGENCY: Immediate Hospital Evaluation Required',
    emergencyTitleAr: 'طوارئ طبية: توجه فوراً إلى أقرب قسم طوارئ بالمستشفى',
    clinicalRationaleEn: 'Sudden onset severe testicular pain is a surgical emergency until proven otherwise. Testicular ischemia from torsion causes irreversible necrosis within 6 hours. Do NOT wait for a clinic appointment.',
    clinicalRationaleAr: 'الألم الشديد المفاجئ في الخصية يُعد حالة طوارئ جراحية تتطلب فحصاً فورياً بالموجات فوق الصوتية (الدوبلر). التأخر لأكثر من 6 ساعات يهدد حيوية العضو. لا تنتظر موعداً عادياً.',
    instructionEn: '1. Cease physical activity immediately.\n2. Do NOT eat or drink in case emergency exploratory surgery is indicated.\n3. Call emergency services or have someone drive you to the nearest ER with 24/7 Urology coverage immediately.',
    instructionAr: '1. توقف عن أي حركة أو مجهود بدني فوراً.\n2. امتنع عن الأكل والشرب تحسباً لاحتمال التدخل الجراحي الطارئ.\n3. اتصل برقم الإسعاف فوراً أو اطلب من مرافق نقلك إلى أقرب مستشفى به قسم طوارئ ومسالك بولية.',
    phoneNumbers: [
      { label: 'Emergency Ambulance (UAE / Gulf: 999)', number: '999' },
      { label: 'Saudi Arabia Red Crescent (997)', number: '997' },
      { label: 'International / Universal Emergency (112)', number: '112' }
    ]
  },
  {
    id: 'RF-NEOPLASM-02',
    nameEn: 'Suspected Testicular Neoplasm / Hard Mass',
    nameAr: 'كتلة صلبة غير مؤلمة في الخصية (اشتباه ورم)',
    medicalCategory: 'Testicular Neoplasm',
    keywordsEn: [
      'hard lump', 'painless lump', 'firm mass', 'solid bump', 'marble feeling', 
      'testicular lump', 'hard spot', 'heaviness with lump', 'not painful but hard'
    ],
    keywordsAr: [
      'كتلة يابسة', 'حبة صلبة', 'ورم بدون ألم', 'كتلة قاسية', 'ثقل مع حبة', 
      'مثل الحجر', 'بدون عوار بس يابسة', 'كتلة غريبة'
    ],
    severity: 'URGENT_SAME_DAY',
    emergencyTitleEn: 'URGENT: Expedited Specialist Ultrasound Required',
    emergencyTitleAr: 'تنبيه عاجل: يلزم فحص متخصص وتصوير تلفزيوني خلال 24-48 ساعة',
    clinicalRationaleEn: 'Any new, firm, painless mass within the testicular parenchyma mandates high-priority scrotal ultrasonography (urgent 2-week fast-track pathway) to rule out testicular malignancy, which has >95% cure rate when detected early.',
    clinicalRationaleAr: 'أي كتلة صلبة غير مؤلمة داخل نسيج الخصية تتطلب تصويراً عاجلاً بالموجات الصوتية لاستبعاد الأورام، والتي تصل نسبة الشفاء التام منها لأكثر من 95% عند الكشف المبكر.',
    instructionEn: 'Standard screening pass is overridden. We have linked you directly with the Urgent Uro-Oncology Intake Coordinator for prioritized same-day imaging.',
    instructionAr: 'تم تعليق بطاقة الفحص الروتيني، وتوجيه بياناتك مباشرة إلى منسق المسالك البولية والأورام لحجز موعد تصوير عاجل وسريع.',
    phoneNumbers: [
      { label: 'Urgent Uro-Oncology Direct Line', number: '+971-4-800-URO' },
      { label: 'Health Authority Rapid Care Line', number: '800-342' }
    ]
  },
  {
    id: 'RF-HEMATURIA-TRAUMA-03',
    nameEn: 'Gross Hematuria or Severe Genital Trauma',
    nameAr: 'دم مرئي بالبول أو إصابة مباشرة حادة',
    medicalCategory: 'Gross Hematuria / Trauma',
    keywordsEn: [
      'blood in urine', 'red urine', 'peeing blood', 'kicked in groin with swelling', 
      'straddle injury', 'severe hit', 'inability to urinate', 'retaining urine'
    ],
    keywordsAr: [
      'دم مع البول', 'بول أحمر', 'نزيف', 'ضربة قوية', 'إصابة بالمنطقة', 
      'انحباس البول', 'ما أقدر أتبول'
    ],
    severity: 'CRITICAL_IMMEDIATE',
    emergencyTitleEn: 'EMERGENCY: Urgent Urological Assessment',
    emergencyTitleAr: 'طوارئ: تقييم عاجل لإصابات الجهاز البولي والتناسلي',
    clinicalRationaleEn: 'Frank blood in urine or post-traumatic inability to void suggests urethral or bladder disruption, or active renal/bladder bleeding requiring catheterization or urgent imaging.',
    clinicalRationaleAr: 'وجود دم مرئي صريح بالبول أو عدم القدرة على التبول بعد إصابة يشير لاحتمال تمزق أو نزيف يستوجب تدخلاً طبياً عاجلاً.',
    instructionEn: 'Proceed immediately to emergency urgent care. Avoid attempting forceful urination or vigorous movement.',
    instructionAr: 'توجه فوراً إلى أقرب طوارئ وتجنب الضغط لمحاولة التبول.',
    phoneNumbers: [
      { label: 'National Ambulance (999 / 911)', number: '999' }
    ]
  }
];
