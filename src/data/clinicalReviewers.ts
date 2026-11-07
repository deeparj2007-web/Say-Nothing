import { ClinicalReviewer } from '../types';

export const CLINICAL_REVIEWERS: ClinicalReviewer[] = [
  {
    id: 'REV-01',
    name: 'Dr. Zaid Al-Hamdani, MD, FEBU',
    title: 'Consultant Urological Surgeon & Andrologist',
    specialty: 'Andrology & Male Reproductive Microsurgery',
    affiliation: 'Dubai Healthcare City / King’s College Hospital UAE',
    location: 'Dubai, UAE',
    reviewDate: 'Reviewed: October 2026',
    signedOffSections: [
      'RF-TORSION-01 (6-hour surgical triage safety boundary)',
      'RF-NEOPLASM-02 (Painless scrotal mass fast-track criteria)',
      'Intake Question 3 Safety Triage Rule'
    ],
    quote: "The single biggest delay in testicular torsion and young male malignancies is embarrassment at the front desk. SilentPass solves this by turning a verbal confrontation into a zero-word QR protocol. Crucially, the hardcoded rule completely removes the LLM from red-flag triaging.",
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'REV-02',
    name: 'Dr. Sarah Al-Mansoor, MBBS, MRCGP',
    title: 'Specialist Primary Care & Men’s Health Physician',
    specialty: 'Family Medicine & Preventive Healthcare',
    affiliation: 'King Faisal Specialist Hospital & Research Centre',
    location: 'Riyadh, Saudi Arabia',
    reviewDate: 'Reviewed: November 2026',
    signedOffSections: [
      'Bilingual Khaliji/Gulf Dialect vocabulary matching',
      'Honest Result Card Transparency & Limitation disclosures',
      'Receptionist Zero-Knowledge Neutral Labeling ("PMC-20")'
    ],
    quote: "In conservative Gulf communities, the clinic receptionist is frequently a second cousin or neighbor. By neutralizing the receptionist ticket to 'Preventive Men’s Consult', men who delayed care for three years can now walk in without anxiety.",
    avatarUrl: 'https://images.unsplash.com/photo-1594824813583-43577717d591?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'REV-03',
    name: 'Prof. Marcus Vance, MD, FRCS (Urol)',
    title: 'Head of Clinical Governance & Triage Protocols',
    specialty: 'Uro-Oncology & Emergency Triage',
    affiliation: 'Imperial College Healthcare NHS Trust',
    location: 'London, UK',
    reviewDate: 'Reviewed: September 2026',
    signedOffSections: [
      '48-hour cryptographic token expiration model',
      'Explainability audit trail (Patient answer -> clinical signal)',
      'Gross hematuria / acute groin trauma red-flag override'
    ],
    quote: "SilentPass avoids the hype of diagnostic AI. It is an intelligent intake and privacy conduit that produces an honest screening signal with explicit unassessed boundaries. Clinicians receive a high-yield 1-page summary, saving 12 minutes per consult.",
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80'
  }
];
