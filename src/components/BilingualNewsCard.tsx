import React, { useState } from 'react';
import { NewsArticle } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Volume2, VolumeX, CheckCircle2, Bookmark, Clock, ArrowRight, Share2 } from 'lucide-react';
import { motion } from 'motion/react';

interface BilingualNewsCardProps {
  article: NewsArticle;
  onOpen: () => void;
}

export const BilingualNewsCard: React.FC<BilingualNewsCardProps> = ({ article, onOpen }) => {
  const { lang, t, isItemSaved, toggleSaveItem } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);

  const isSaved = isItemSaved(article.id);
  const currentTitle = lang === 'hi' ? article.titleHi : article.titleEn;
  const currentSummary = lang === 'hi' ? article.summaryHi : article.summaryEn;

  // Quick 1-click audio listen from card
  const handleCardAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`${currentTitle}. ${currentSummary}`);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={onOpen}
      className="p-4 rounded-3xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 hover:border-amber-500/40 shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-400 font-bold text-[11px] border border-amber-500/30">
              {lang === 'hi' ? article.categoryHi : article.category}
            </span>
            {article.isFactChecked && (
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" />
                <span>PIB Verified</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Quick Audio Play Button */}
            <button
              onClick={handleCardAudio}
              className={`p-1.5 rounded-xl border transition ${
                isPlaying
                  ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse'
                  : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:text-amber-400'
              }`}
              title={isPlaying ? t('Stop Audio', 'ऑडियो रोकें') : t('Listen with voice', 'आवाज में सुनें')}
            >
              {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {/* Bookmark */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSaveItem({
                  id: article.id,
                  type: 'news',
                  title: currentTitle,
                });
              }}
              className={`p-1.5 rounded-xl border transition ${
                isSaved
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-900/60 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        </div>

        {/* Headline */}
        <h3 className="text-sm sm:text-base font-bold text-slate-100 group-hover:text-amber-300 transition line-clamp-2 leading-snug">
          {currentTitle}
        </h3>

        {/* Short Summary */}
        <p className="text-xs text-slate-300/90 mt-1.5 line-clamp-2 leading-relaxed">
          {currentSummary}
        </p>
      </div>

      {/* Footer Info */}
      <div className="mt-3.5 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-500" />
          <span>{article.readTimeMinutes} {t('min read', 'मिनट')}</span>
          <span>•</span>
          <span className="text-amber-400/80 font-medium truncate max-w-[120px]">{article.source}</span>
        </span>

        <span className="flex items-center gap-1 font-bold text-amber-400 group-hover:text-amber-300 transition">
          <span>{t('Read Full', 'विस्तार से')}</span>
          <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </motion.div>
  );
};
