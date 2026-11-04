import React from 'react';
import { CITIZEN_PORTALS } from '../data/mockData';
import { CitizenPortal } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { ExternalLink, ShieldCheck, Layers, Fingerprint, CreditCard, Vote, Globe, Car, HardHat } from 'lucide-react';
import { motion } from 'motion/react';

export const CitizenPortalsSection: React.FC = () => {
  const { lang, t } = useLanguage();

  const getPortalIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-blue-400" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-amber-400" />;
      case 'Fingerprint':
        return <Fingerprint className="w-5 h-5 text-emerald-400" />;
      case 'CreditCard':
        return <CreditCard className="w-5 h-5 text-purple-400" />;
      case 'Vote':
        return <Vote className="w-5 h-5 text-rose-400" />;
      case 'Car':
        return <Car className="w-5 h-5 text-cyan-400" />;
      case 'HardHat':
        return <HardHat className="w-5 h-5 text-orange-400" />;
      default:
        return <Globe className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-100">
            {t('Digital Citizen Portals & Services', 'डिजिटल नागरिक सेवाएं एवं सरकारी पोर्टल')}
          </h3>
          <p className="text-[11px] text-slate-400">
            {t('Direct verified access without cyber-cafe fees', 'बिना किसी शुल्क आधिकारिक सरकारी सेवाएं')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CITIZEN_PORTALS.map((portal) => (
          <motion.a
            key={portal.id}
            href={portal.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.99 }}
            className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 hover:border-amber-500/40 shadow-md transition flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-700/80">
                    {getPortalIcon(portal.iconName)}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-amber-300 transition">
                      {lang === 'hi' ? portal.nameHi : portal.nameEn}
                    </h4>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {lang === 'hi' ? portal.categoryHi : portal.category}
                    </span>
                  </div>
                </div>

                <div className="p-1 rounded-lg text-slate-400 group-hover:text-amber-400 transition">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>

              <p className="text-[11px] text-slate-300/90 leading-relaxed mb-2.5">
                {lang === 'hi' ? portal.descHi : portal.descEn}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-700/50 flex flex-wrap gap-1">
              {portal.topServices.slice(0, 2).map((srv, sIdx) => (
                <span
                  key={sIdx}
                  className="px-2 py-0.5 rounded-md bg-slate-900/60 text-slate-300 text-[10px] border border-slate-700/40"
                >
                  {srv}
                </span>
              ))}
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
};
