import React, { useState } from 'react';
import { JobPosting } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Building2, MapPin, ArrowRight, Bookmark, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';

interface JobPostingCardProps {
  job: JobPosting;
  onClick: () => void;
}

export const JobPostingCard: React.FC<JobPostingCardProps> = ({ job, onClick }) => {
  const { lang, t, isItemSaved, toggleSaveItem } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const isSaved = isItemSaved(job.id);
  const currentTitle = lang === 'hi' ? job.titleHi : job.titleEn;

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
      ? `${job.titleHi}. कंपनी: ${job.company}. वेतन: ${job.salaryRange}. स्थान: ${job.location}`
      : `${job.titleEn}. Company: ${job.company}. Salary: ${job.salaryRange}. Location: ${job.location}`;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const getEmoji = () => {
    if (job.isFeaturedGovtApprentice) return '🎁';
    if (job.category === 'Tech') return '💻';
    if (job.category === 'Logistics & Retail') return '📦';
    if (job.category === 'Banking/Finance') return '🏦';
    return '💼';
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`p-4 rounded-3xl border-2 shadow-xl transition-all flex flex-col justify-between group cursor-pointer ${
        job.isFeaturedGovtApprentice
          ? 'bg-gradient-to-b from-amber-500/15 via-slate-800 to-slate-800 border-amber-400 hover:border-amber-300'
          : 'bg-slate-800/85 hover:bg-slate-800 border-slate-700/80 hover:border-blue-400'
      }`}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-2xl">{getEmoji()}</span>
            {job.isFeaturedGovtApprentice && (
              <span className="px-2.5 py-0.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                PM Scheme
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-xl bg-blue-500/20 text-blue-300 font-bold text-xs border border-blue-500/30">
              {job.type}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleSpeak}
              className={`p-1.5 rounded-xl border transition ${
                isPlaying
                  ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-amber-400'
              }`}
              title={t('Listen out loud', 'आवाज में सुनें')}
            >
              {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSaveItem({
                  id: job.id,
                  type: 'job',
                  title: currentTitle,
                });
              }}
              className={`p-1.5 rounded-xl border transition ${
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
        <h3 className="text-sm sm:text-base font-black text-white group-hover:text-amber-300 transition line-clamp-2 leading-snug">
          {currentTitle}
        </h3>

        {/* Company */}
        <p className="text-xs text-amber-400 mt-1 font-bold flex items-center gap-1">
          <Building2 className="w-3.5 h-3.5" />
          <span className="truncate">{job.company}</span>
        </p>

        {/* Salary & Qualification Badges */}
        <div className="grid grid-cols-2 gap-2 mt-3 p-2.5 rounded-2xl bg-slate-900/60 border border-slate-700/60 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block">{t('Stipend / Salary', 'वेतन / वजीफा')}</span>
            <span className="font-black text-emerald-400 truncate block">{job.salaryRange.split('+')[0]}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block">{t('Min Qualification', 'न्यूनतम कक्षा')}</span>
            <span className="font-black text-slate-200 truncate block">🎒 {job.minQualification.split('/')[0]}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-3.5 pt-2 flex items-center justify-between text-xs font-bold border-t border-slate-700/60 text-amber-400">
        <span className="text-slate-400 flex items-center gap-1 truncate max-w-[150px]">
          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="truncate">{job.location.split('(')[0]}</span>
        </span>

        <span className="flex items-center gap-1 group-hover:translate-x-1 transition">
          <span>{t('View & Apply', 'आवेदन करें')}</span>
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </motion.div>
  );
};
