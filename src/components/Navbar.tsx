import React from 'react';
import { 
  Smartphone, Monitor, Stethoscope, BarChart3, ShieldCheck, 
  Globe2, EyeOff, Sparkles, CheckCircle2
} from 'lucide-react';
import { ActiveRole, Language } from '../types';

interface NavbarProps {
  activeRole: ActiveRole;
  onRoleChange: (role: ActiveRole) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onTriggerDiscretion: () => void;
  hasPass: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeRole,
  onRoleChange,
  language,
  onLanguageChange,
  onTriggerDiscretion,
  hasPass
}) => {
  const roles: { id: ActiveRole; labelEn: string; labelAr: string; icon: any; badge?: string }[] = [
    {
      id: 'patient',
      labelEn: 'Patient Mobile App',
      labelAr: 'تطبيق المريض (صوتي)',
      icon: Smartphone,
      badge: hasPass ? 'Pass Active' : 'Intake'
    },
    {
      id: 'receptionist',
      labelEn: 'Receptionist Terminal',
      labelAr: 'شاشة الاستقبال (محايدة)',
      icon: Monitor,
      badge: 'Zero-Leak'
    },
    {
      id: 'clinician',
      labelEn: 'Clinician Secure EHR',
      labelAr: 'شاشة الطبيب (ملخص كامل)',
      icon: Stethoscope,
      badge: 'Encrypted'
    },
    {
      id: 'analytics',
      labelEn: 'Drop-off Funnel (1,000 Cohort)',
      labelAr: 'محاكي مسار التسرب',
      icon: BarChart3,
      badge: 'Key Metric'
    },
    {
      id: 'clinical_board',
      labelEn: 'Clinical Board & Novelty',
      labelAr: 'الأطباء والابتكار',
      icon: ShieldCheck,
      badge: 'Sign-Offs'
    }
  ];

  return (
    <nav className="bg-slate-950/95 border-b border-slate-800/80 sticky top-0 z-40 backdrop-blur-md px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand & Concept Tagline */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 via-cyan-500 to-teal-400 flex items-center justify-center shadow-lg shadow-brand-500/25">
            <span className="font-black text-white text-sm">SP</span>
          </div>
          <div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <span className="font-extrabold text-white text-sm sm:text-base tracking-tight">SilentPass</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 font-mono">
                صوتك بصمت
              </span>
            </div>
            <div className="text-[11px] text-slate-400 hidden md:block">
              Overcoming the sentence. Men’s reproductive intake without the receptionist barrier.
            </div>
          </div>
        </div>

        {/* Role Selector Tabs (Crucial for Demoing the 3-minute Video Flow) */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto max-w-full">
          {roles.map(r => {
            const Icon = r.icon;
            const isActive = activeRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => onRoleChange(r.id)}
                className={`flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-600 to-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? r.labelAr : r.labelEn}</span>
                {r.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-black/30 text-cyan-200' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {r.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Global Quick Utility Actions */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {/* Discretion Panic Shield */}
          <button
            onClick={onTriggerDiscretion}
            title={language === 'ar' ? 'وضع التمويه السريع (آلة حاسبة)' : 'Instant Camouflage Mode (Discretion Shield)'}
            className="flex items-center space-x-1 rtl:space-x-reverse px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-400 text-xs font-medium transition-all"
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[11px]">
              {language === 'ar' ? 'تمويه' : 'Discretion'}
            </span>
          </button>

          {/* Bilingual Switch */}
          <button
            onClick={() => onLanguageChange(language === 'en' ? 'ar' : 'en')}
            className="flex items-center space-x-1 rtl:space-x-reverse px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium transition-all"
          >
            <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px]">{language === 'en' ? 'العربية' : 'English'}</span>
          </button>
        </div>

      </div>
    </nav>
  );
};
