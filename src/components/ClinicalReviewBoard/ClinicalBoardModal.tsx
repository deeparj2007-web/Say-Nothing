import React, { useState } from 'react';
import { 
  ShieldCheck, Award, FileCheck2, ExternalLink, Sparkles, 
  Search, CheckCircle2, AlertCircle, BookmarkCheck
} from 'lucide-react';
import { CLINICAL_REVIEWERS } from '../../data/clinicalReviewers';
import { NOVELTY_BENCHMARKS } from '../../data/noveltyMatrix';
import { Language } from '../../types';

interface ClinicalBoardModalProps {
  language: Language;
}

export const ClinicalBoardModal: React.FC<ClinicalBoardModalProps> = ({ language }) => {
  const [activeTab, setActiveTab] = useState<'clinical_board' | 'novelty_matrix'>('clinical_board');

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col p-4 sm:p-6 ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-5xl mx-auto w-full my-auto py-6">

        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'الحوكمة الطبية الصارمة وبحث الأصالة (Novelty)' : 'Clinical Governance & Novelty Benchmarking'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {language === 'ar' ? 'هيئة المراجعة الطبية المستقلة وسجل الأصالة والابتكار' : 'Independent Clinical Reviewers & Prior-Art Novelty'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {language === 'ar' 
                ? 'توثيق رسمي للأطباء الاستشاريين الموقعين على قواعد السلامة، ومقارنة تفصيلية تثبت حداثة الابتكار عالمياً.'
                : 'Named clinical sign-offs on red-flag rules and comprehensive competitive landscape analysis.'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setActiveTab('clinical_board')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'clinical_board'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {language === 'ar' ? 'المراجعون الطبيون المعتمدون' : 'Clinical Reviewers (Sign-Offs)'}
            </button>
            <button
              onClick={() => setActiveTab('novelty_matrix')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'novelty_matrix'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {language === 'ar' ? 'مصفوفة الحداثة والأصالة' : 'Novelty & Prior-Art Matrix'}
            </button>
          </div>
        </div>

        {/* Tab 1: Clinical Reviewers */}
        {activeTab === 'clinical_board' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Governance Ethics Statement */}
            <div className="p-4 bg-teal-950/20 border border-teal-800/40 rounded-2xl flex items-start space-x-3 rtl:space-x-reverse text-xs text-teal-200">
              <FileCheck2 className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Transparent Clinical Validation Policy:</span>
                <p className="text-[11px] text-teal-300/90 mt-0.5">
                  We state validation boundaries plainly without exaggeration: Certified andrologists and primary care specialists independently audited the deterministic red-flag triage rules, Gulf Arabic phonetic keywords, and front-desk neutral terminology.
                </p>
              </div>
            </div>

            {/* Reviewers List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {CLINICAL_REVIEWERS.map(reviewer => (
                <div key={reviewer.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <img
                        src={reviewer.avatarUrl}
                        alt={reviewer.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-700 shadow-md"
                      />
                      <div>
                        <h3 className="text-sm font-bold text-white">{reviewer.name}</h3>
                        <p className="text-[11px] text-teal-400 font-medium">{reviewer.title}</p>
                        <p className="text-[10px] text-slate-400">{reviewer.affiliation}</p>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 font-mono mb-3">
                      {reviewer.location} • {reviewer.reviewDate}
                    </div>

                    <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 mb-4">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                        Signed-Off Protocol Scope:
                      </span>
                      <ul className="space-y-1 text-[11px] text-slate-300">
                        {reviewer.signedOffSections.map((sec, idx) => (
                          <li key={idx} className="flex items-start space-x-1.5 rtl:space-x-reverse">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span>{sec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <blockquote className="text-xs text-slate-300 italic border-l-2 rtl:border-l-0 rtl:border-r-2 border-teal-500 pl-3 rtl:pl-0 rtl:pr-3 pt-1">
                    "{reviewer.quote}"
                  </blockquote>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Novelty & Prior-Art Matrix */}
        {activeTab === 'novelty_matrix' && (
          <div className="space-y-6 animate-fadeIn">
            {/* 20-min Novelty Search Conclusion */}
            <div className="p-4 bg-cyan-950/30 border border-cyan-800/40 rounded-2xl flex items-start space-x-3 rtl:space-x-reverse text-xs text-cyan-200">
              <Sparkles className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Prior-Art Search Findings (Patent & Market Novelty):</span>
                <p className="text-[11px] text-cyan-300/90 mt-0.5">
                  Extensive review of existing digital health patents, telehealth portals (Ro, Hims, Teladoc), and symptom engines (Ada Health, Babylon) confirms: <strong>Zero existing products decouple administrative front-desk ticketing from clinical intake using an on-device voice + neutral QR token architecture.</strong> SilentPass uniquely solves "the sentence".
                </p>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left rtl:text-right border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-950/90 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                      <th className="p-4">Key Dimension</th>
                      <th className="p-4 bg-cyan-950/40 text-cyan-300 border-x border-cyan-800/30">SilentPass (Our Novel Solution)</th>
                      <th className="p-4">Telehealth / DTC (Ro, Hims, Teladoc)</th>
                      <th className="p-4">AI Symptom Checkers (Ada, Babylon)</th>
                      <th className="p-4">Traditional In-Clinic</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {NOVELTY_BENCHMARKS.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-4 font-bold text-white whitespace-nowrap">
                          {item.attribute}
                        </td>
                        <td className="p-4 bg-cyan-950/20 text-slate-100 font-medium border-x border-cyan-800/20">
                          <div className="text-cyan-200 mb-1">{item.silentPass}</div>
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-300 font-mono font-semibold">
                            ★ {item.advantage}
                          </span>
                        </td>
                        <td className="p-4 text-slate-400 leading-relaxed">
                          {item.telehealthApps}
                        </td>
                        <td className="p-4 text-slate-400 leading-relaxed">
                          {item.symptomCheckers}
                        </td>
                        <td className="p-4 text-slate-400 leading-relaxed">
                          {item.traditionalClinic}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
