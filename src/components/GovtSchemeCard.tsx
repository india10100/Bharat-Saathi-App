import React, { useState } from 'react';
import { GovtScheme } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Landmark, ArrowRight, Bookmark, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';

interface GovtSchemeCardProps {
  scheme: GovtScheme;
  onClick: () => void;
}

export const GovtSchemeCard: React.FC<GovtSchemeCardProps> = ({ scheme, onClick }) => {
  const { lang, t, isItemSaved, toggleSaveItem } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const isSaved = isItemSaved(scheme.id);
  const currentName = lang === 'hi' ? scheme.nameHi : scheme.nameEn;
  const currentMinistry = lang === 'hi' ? scheme.ministryHi : scheme.ministryEn;

  const getEmoji = (cat: string) => {
    switch (cat) {
      case 'Farmers':
        return '🌾';
      case 'Youth & Students':
        return '🎒';
      case 'Health':
        return '🩺';
      case 'Housing':
        return '🏠';
      case 'Women & Child':
        return '👧';
      case 'Entrepreneurs & MSME':
        return '🛍️';
      default:
        return '🎁';
    }
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    const text = lang === 'hi'
      ? `${scheme.nameHi}. लाभ: ${scheme.financialBenefit}. लाभार्थी: ${scheme.targetAudience}`
      : `${scheme.nameEn}. Benefit: ${scheme.financialBenefit}. Target: ${scheme.targetAudience}`;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="p-4 rounded-3xl bg-slate-800/85 hover:bg-slate-800 border-2 border-slate-700/80 hover:border-emerald-400 shadow-xl transition-all flex flex-col justify-between group cursor-pointer"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-2xl">{getEmoji(scheme.category)}</span>
            <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-black text-xs border border-emerald-500/40">
              {lang === 'hi' ? scheme.categoryHi : scheme.category}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleSpeak}
              className={`p-1.5 rounded-xl border transition ${
                isPlaying
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 animate-pulse'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-emerald-400'
              }`}
              title={t('Listen out loud', 'आवाज में सुनें')}
            >
              {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSaveItem({
                  id: scheme.id,
                  type: 'scheme',
                  title: currentName,
                });
              }}
              className={`p-1.5 rounded-xl border transition cursor-pointer ${
                isSaved
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm sm:text-base font-black text-white group-hover:text-emerald-300 transition line-clamp-2 leading-snug">
          {currentName}
        </h3>

        {/* Ministry */}
        <p className="text-xs text-slate-400 mt-1 font-semibold truncate">
          {currentMinistry}
        </p>

        {/* Financial Benefit Badge */}
        <div className="mt-3 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-xs">
          <span className="text-[10px] text-emerald-400 font-bold block">{t('Direct Benefit / Grant', 'सीधी सरकारी मदद')}</span>
          <span className="font-black text-white line-clamp-1 mt-0.5 text-xs sm:text-sm">
            {scheme.financialBenefit}
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-3.5 pt-2 flex items-center justify-between text-xs font-bold border-t border-slate-700/60 text-emerald-400">
        <span className="text-slate-400 truncate max-w-[170px]">{scheme.targetAudience}</span>

        <span className="flex items-center gap-1 group-hover:translate-x-1 transition">
          <span>{t('Eligibility & Apply', 'पात्रता व आवेदन')}</span>
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </motion.div>
  );
};
