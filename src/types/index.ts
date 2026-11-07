export type Language = 'en' | 'ar';

export type ActiveRole = 'patient' | 'receptionist' | 'clinician' | 'analytics' | 'clinical_board';

export interface IntakeQuestion {
  id: string;
  order: number;
  category: 'chief_complaint' | 'symptom_nature' | 'duration' | 'associated_signs' | 'red_flag_check';
  promptAudioTextEn: string;
  promptAudioTextAr: string;
  textEn: string;
  textAr: string;
  helpTextEn: string;
  helpTextAr: string;
  quickVoiceChipsEn: string[];
  quickVoiceChipsAr: string[];
  isRedFlagCheck?: boolean;
}

export interface PatientAnswer {
  questionId: string;
  transcript: string;
  language: Language;
  timestamp: number;
  detectedKeywords: string[];
}

export interface RedFlagRule {
  id: string;
  nameEn: string;
  nameAr: string;
  medicalCategory: 'Testicular Torsion' | 'Testicular Neoplasm' | 'Acute Scrotal Infection' | 'Gross Hematuria / Trauma';
  keywordsEn: string[];
  keywordsAr: string[];
  severity: 'CRITICAL_IMMEDIATE' | 'URGENT_SAME_DAY';
  emergencyTitleEn: string;
  emergencyTitleAr: string;
  clinicalRationaleEn: string;
  clinicalRationaleAr: string;
  instructionEn: string;
  instructionAr: string;
  phoneNumbers: {
    label: string;
    number: string;
  }[];
}

export interface ClinicalFinding {
  id: string;
  titleEn: string;
  titleAr: string;
  category: 'Scrotal / Vascular' | 'Urinary / LUTS' | 'Sexual / Endocrine' | 'Preventive Baseline';
  screeningSignalEn: string;
  screeningSignalAr: string;
  confidenceScore: number; // 0 - 100
  triggeringQuestionId: string;
  triggeringQuestionTextEn: string;
  triggeringQuestionTextAr: string;
  triggeringVoiceExcerpt: string;
  clinicalSignificanceEn: string;
  clinicalSignificanceAr: string;
}

export interface UnassessedFactor {
  id: string;
  factorEn: string;
  factorAr: string;
  reasonEn: string;
  reasonAr: string;
  requiredTestEn: string;
  requiredTestAr: string;
}

export interface TriageAssessment {
  id: string;
  timestamp: number;
  hasRedFlag: boolean;
  triggeredRedFlag?: RedFlagRule;
  findings: ClinicalFinding[];
  unassessed: UnassessedFactor[];
  overallConfidence: number;
  summaryNoteEn: string;
  summaryNoteAr: string;
  disclaimerEn: string;
  disclaimerAr: string;
}

export type ConsultStatus = 'pass_generated' | 'checked_in_reception' | 'in_consultation' | 'consult_completed';

export interface SilentPassToken {
  passId: string;
  qrPayload: string;
  qrDataUrl?: string;
  neutralLabel: string;
  serviceCategory: string;
  patientInitials: string;
  timeSlot: string;
  clinicName: string;
  clinicAddress: string;
  createdAt: number;
  expiresAt: number;
  isAuthorizedByPatient: boolean;
  consultStatus: ConsultStatus;
  completedAt?: number;
  symptomsSummary?: string;
  clinicalSignals?: string[];
  findings?: ClinicalFinding[];
  unassessed?: UnassessedFactor[];
  overallConfidence?: number;
  verbatimExcerpt?: string;
}

export interface ClinicalReviewer {
  id: string;
  name: string;
  title: string;
  specialty: string;
  affiliation: string;
  location: string;
  reviewDate: string;
  signedOffSections: string[];
  quote: string;
  avatarUrl: string;
}

export interface NoveltyBenchmark {
  attribute: string;
  silentPass: string;
  telehealthApps: string; // e.g. Ro, Hims, Teladoc
  symptomCheckers: string; // e.g. Ada Health, Babylon
  traditionalClinic: string;
  advantage: string;
}
