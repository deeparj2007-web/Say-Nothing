import QRCode from 'qrcode';
import { SilentPassToken, TriageAssessment } from '../types';

export class TokenService {
  public static async generateSilentPass(
    assessment: TriageAssessment,
    patientInitials: string = 'M.A.',
    clinicName: string = 'Al-Noor Premier Medical Centre, Dubai'
  ): Promise<SilentPassToken> {
    const passId = 'SP-' + Math.floor(1000 + Math.random() * 9000) + '-AE';
    const createdAt = Date.now();
    const expiresAt = createdAt + 48 * 60 * 60 * 1000; // 48 Hours

    // Concise symptoms summary
    const symptomsSummary = assessment.findings.length > 0
      ? assessment.findings.map(f => f.titleEn).join(' • ')
      : "Routine preventive men's wellness intake";
    
    const clinicalSignals = assessment.findings.map(
      f => `${f.titleEn} (${f.confidenceScore}% conf)`
    );

    const verbatimExcerpt = assessment.findings[0]?.triggeringVoiceExcerpt || "Voice intake completed";

    // ULTRA-OPTIMIZED QR PAYLOAD (Under 300 bytes for instant mobile camera detection)
    const compactQRObj = {
      passId,
      code: 'PMC-20',
      label: "Preventive Men's Consult (20 min)",
      patient: patientInitials,
      slot: 'Today, 14:30',
      clinic: 'Al-Noor Premier Medical Centre',
      symptoms: symptomsSummary.slice(0, 160),
      signals: clinicalSignals.slice(0, 3),
      conf: assessment.overallConfidence,
      exp: expiresAt
    };

    const qrPayload = JSON.stringify(compactQRObj);

    let qrDataUrl = '';
    try {
      // Level 'L' error correction gives largest module pixels and fastest scanning on mobile
      qrDataUrl = await QRCode.toDataURL(qrPayload, {
        errorCorrectionLevel: 'L',
        margin: 2,
        width: 320,
        color: {
          dark: '#0369a1',
          light: '#ffffff'
        }
      });
    } catch (err) {
      console.warn('Initial QR generation error, trying minimal payload', err);
      try {
        const minimalPayload = JSON.stringify({ passId, code: 'PMC-20', patient: patientInitials });
        qrDataUrl = await QRCode.toDataURL(minimalPayload, { margin: 2, width: 320 });
      } catch (e) {
        console.error('Fatal QR generation error', e);
      }
    }

    return {
      passId,
      qrPayload,
      qrDataUrl,
      neutralLabel: "Preventive Men's Consult (20 min)",
      serviceCategory: 'PMC-20 General Men’s Wellness',
      patientInitials,
      timeSlot: 'Today, 14:30 (20 min slot)',
      clinicName,
      clinicAddress: 'Building 64, Healthcare City, District 1',
      createdAt,
      expiresAt,
      isAuthorizedByPatient: false,
      consultStatus: 'pass_generated',
      symptomsSummary,
      clinicalSignals,
      findings: assessment.findings,
      unassessed: assessment.unassessed,
      overallConfidence: assessment.overallConfidence,
      verbatimExcerpt
    };
  }

  // Parse QR Payload safely from any scanned string
  public static parseQRPayload(rawText: string): Partial<SilentPassToken> | null {
    try {
      const parsed = JSON.parse(rawText);
      return {
        passId: parsed.passId || parsed.token || ('SP-' + Math.floor(1000 + Math.random() * 9000) + '-AE'),
        neutralLabel: parsed.label || parsed.neutralLabel || "Preventive Men's Consult (20 min)",
        patientInitials: parsed.patient || parsed.patientInitials || parsed.patientRef || 'M.A.',
        timeSlot: parsed.slot || parsed.timeSlot || 'Today, 14:30 (20 min slot)',
        clinicName: parsed.clinic || parsed.clinicName || 'Al-Noor Premier Medical Centre, Dubai',
        clinicAddress: 'Building 64, Healthcare City, District 1',
        createdAt: parsed.createdAt || Date.now(),
        expiresAt: parsed.exp || parsed.expiresAt || (Date.now() + 48 * 3600 * 1000),
        symptomsSummary: parsed.symptoms || parsed.symptomsSummary || 'Scanned intake report from mobile pass',
        clinicalSignals: parsed.signals || parsed.clinicalSignals || ["Preventive Men's Consult (PMC-20)"],
        findings: parsed.findings || [],
        unassessed: parsed.unassessed || [],
        overallConfidence: parsed.conf || parsed.overallConfidence || 88,
        verbatimExcerpt: parsed.verbatimExcerpt || 'Scanned via Reception Terminal',
        consultStatus: 'checked_in_reception'
      };
    } catch (e) {
      if (rawText && rawText.trim().length > 0) {
        return {
          passId: rawText.length < 20 ? rawText.trim() : ('SP-' + Math.floor(1000 + Math.random() * 9000) + '-AE'),
          neutralLabel: "Preventive Men's Consult (20 min)",
          patientInitials: 'M.A.',
          timeSlot: 'Today, 14:30 (20 min slot)',
          clinicName: 'Al-Noor Premier Medical Centre, Dubai',
          clinicAddress: 'Building 64, Healthcare City, District 1',
          createdAt: Date.now(),
          expiresAt: Date.now() + 48 * 3600 * 1000,
          symptomsSummary: rawText.substring(0, 100),
          clinicalSignals: ["Preventive Men's Consult (PMC-20)"],
          overallConfidence: 85,
          consultStatus: 'checked_in_reception'
        };
      }
      return null;
    }
  }

  public static formatRemainingTime(expiresAt: number): { hours: number; minutes: number; seconds: number; isExpired: boolean } {
    const diff = expiresAt - Date.now();
    if (diff <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { hours, minutes, seconds, isExpired: false };
  }
}
