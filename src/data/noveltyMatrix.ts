import { NoveltyBenchmark } from '../types';

export const NOVELTY_BENCHMARKS: NoveltyBenchmark[] = [
  {
    attribute: 'The Front-Desk Barrier ("The Sentence")',
    silentPass: 'Eliminates completely. Receptionist scans QR and sees ONLY "Preventive Men’s Consult, 20 min" (Zero medical disclosure).',
    telehealthApps: 'Irrelevant to in-clinic. Only offers mail-order pills or video calls; cannot perform Doppler scans or physical exams.',
    symptomCheckers: 'Zero protection. Gives user a PDF/score, but user still has to speak the embarrassing condition to the receptionist.',
    traditionalClinic: 'Severe barrier. Patient must announce reproductive/groin symptoms aloud in open waiting rooms to counter staff.',
    advantage: 'First-in-class Front-Desk Privacy Shield separating administrative check-in from clinical data.'
  },
  {
    attribute: 'Input Modality & Literacy Barrier',
    silentPass: '100% Voice-First in native Gulf Arabic (Khaliji) & English. Audio stays in local device RAM and never touches the cloud.',
    telehealthApps: 'Tedious 15-20 page typed forms with medical jargon and credit card requirements.',
    symptomCheckers: 'Endless branching decision trees requiring 10-15 minutes of intensive reading and tapping.',
    traditionalClinic: 'Paper clipboard in waiting room where peers, relatives, or neighbors can glance over your shoulder.',
    advantage: 'Accessible to non-typists, low literacy, construction/transit workers, and men sitting in their cars.'
  },
  {
    attribute: 'Clinical Safety Boundary',
    silentPass: 'Hardcoded, deterministic triage rule (Zero LLM hallucinations). Immediately halts pass and routes to ER for torsion/masses.',
    telehealthApps: 'Delayed asynchronous doctor review (takes 12-48 hours, dangerous for acute torsion).',
    symptomCheckers: 'Probabilistic AI outputs (e.g. "You might have Epididymitis 38%") which can lull acute torsion patients into waiting.',
    traditionalClinic: 'Untrained receptionists cannot triage surgical urgency and may schedule a visit 2 weeks away.',
    advantage: 'Zero-hallucination deterministic emergency cutoff reviewed by certified urologists.'
  },
  {
    attribute: 'Doctor Intake Efficiency',
    silentPass: 'Clinician receives a structured 1-page high-yield clinical brief with explainability links to exact spoken voice excerpts.',
    telehealthApps: 'Clinician reads unstructured patient chat messages or raw intake form fields.',
    symptomCheckers: 'Long confusing probabilistic printouts that doctors routinely ignore.',
    traditionalClinic: 'Doctor spends 12-15 minutes asking repetitive baseline questions while patient stutters nervously.',
    advantage: 'Saves 12 minutes per clinical encounter, cutting clinic wait times and consultation friction.'
  },
  {
    attribute: 'Closing the Loop',
    silentPass: 'Doctor marks "Consult Done". Patient app registers "Next step done" without storing sensitive diagnostic labels.',
    telehealthApps: 'Commercial upsell loops (monthly pill subscriptions).',
    symptomCheckers: 'Orphaned flow. App has no idea if the patient ever actually stepped inside a clinic.',
    traditionalClinic: 'High no-show rate (up to 46% drop-off between booking and physical arrival).',
    advantage: 'Measures true clinical referral completion with zero surveillance of final diagnosis.'
  }
];
