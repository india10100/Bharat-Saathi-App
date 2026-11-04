import React, { useState } from 'react';
import { GovtPosting } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Volume2, VolumeX, Bookmark, ArrowRight, Calendar, Users } from 'lucide-react';
import { motion } from 'motion/react';

interface GovtPostingCardProps {
  posting: GovtPosting;
  onClick: () => void;
}

export const GovtPostingCard: React.FC<GovtPostingCardProps> = ({ posting, onClick }) => {
  const { lang, t, isItemSaved, toggleSaveItem } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const isSaved = isItemSaved(posting.id);

  const getEmoji = (cat: string) => {
    switch (cat) {
      case 'Railways':
        return '🚂';
      case 'Defense':
        return '🎖️';
      case 'Police':
        return '👮';
      case 'Banking':
        return '🏦';
      case 'Teaching':
        return '🏫';
      case 'PSU':
        return '🔬';
      case 'SSC':
        return '🏛️';
      case 'UPSC/PSC':
        return '🇮🇳';
      default:
        return '🎯';
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
      ? `${posting.titleHi}. कुल पद: ${posting.totalVacancies}. वेतन: ${posting.salaryPayScale}. योग्यता: ${posting.qualifications.join(', ')}`
      : `${posting.titleEn}. Total vacancies: ${posting.totalVacancies}. Salary: ${posting.salaryPayScale}. Required: ${posting.qualifications.join(', ')}`;

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
      onClick={onClick}
      className="p-4 rounded-3xl bg-slate-800/85 hover:bg-slate-800 border-2 border-slate-700/80 hover:border-amber-400 shadow-xl transition-all cursor-pointer flex flex-col justify-between group"
    >
      <div>
        {/* Top Header with Big Emoji & Badge */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getEmoji(posting.postCategory)}</span>
            <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-black text-xs border border-amber-500/40">
              {posting.postCategory}
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs">
              {posting.totalVacancies.toLocaleString('en-IN')} {t('Seats', 'पद')}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Listen Audio Button */}
            <button
              onClick={handleSpeak}
              className={`p-2 rounded-xl border transition ${
                isPlaying
                  ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-amber-400'
              }`}
              title={t('Listen out loud', 'आवाज में सुनें')}
            >
              {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Bookmark */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSaveItem({
                  id: posting.id,
                  type: 'govt',
                  title: lang === 'hi' ? posting.titleHi : posting.titleEn,
                });
              }}
              className={`p-2 rounded-xl border transition ${
                isSaved
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>

        {/* Big Readable Title */}
        <h3 className="text-sm sm:text-base font-black text-white group-hover:text-amber-300 transition line-clamp-2 leading-snug">
          {lang === 'hi' ? posting.titleHi : posting.titleEn}
        </h3>

        {/* Organization */}
        <p className="text-xs text-slate-400 font-medium mt-1 truncate">
          {lang === 'hi' ? posting.organizationHi : posting.organizationEn}
        </p>

        {/* Clear Key Badges */}
        <div className="grid grid-cols-2 gap-2 mt-3 p-2.5 rounded-2xl bg-slate-900/60 border border-slate-700/60 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block">{t('Monthly Salary', 'महीने का वेतन')}</span>
            <span className="font-black text-amber-400 truncate block">
              {posting.salaryPayScale.split('/')[0]}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block">{t('Last Date', 'अंतिम तारीख')}</span>
            <span className="font-black text-rose-400 truncate block flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {posting.lastDate}
            </span>
          </div>
        </div>

        {/* Qualifications Required */}
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {posting.qualifications.map((q, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-xl bg-blue-500/20 text-blue-300 text-[11px] font-bold border border-blue-500/30"
            >
              🎒 {q}
            </span>
          ))}
          <span className="px-2.5 py-1 rounded-xl bg-slate-900 text-slate-300 text-[11px] font-semibold border border-slate-700">
            🎂 {posting.ageMin}-{posting.ageMax} {t('Years', 'वर्ष')}
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-3.5 pt-2 flex items-center justify-between border-t border-slate-700/60 text-xs font-bold text-amber-400">
        <span>{posting.state || t('All India', 'अखिल भारतीय')}</span>
        <span className="flex items-center gap-1 group-hover:translate-x-1 transition">
          <span>{t('View & Apply', 'विवरण व आवेदन')}</span>
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </motion.div>
  );
};
