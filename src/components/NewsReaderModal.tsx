import React, { useState, useEffect } from 'react';
import { NewsArticle } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { X, Volume2, VolumeX, Pause, Play, Share2, CheckCircle2, Check, Bookmark, ExternalLink, Type, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface NewsReaderModalProps {
  article: NewsArticle | null;
  onClose: () => void;
}

export const NewsReaderModal: React.FC<NewsReaderModalProps> = ({ article, onClose }) => {
  const { lang, setLang, t, isItemSaved, toggleSaveItem } = useLanguage();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [copied, setCopied] = useState(false);

  // Stop speech when closed or article changes
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [article]);

  if (!article) return null;

  const isSaved = isItemSaved(article.id);
  const currentTitle = lang === 'hi' ? article.titleHi : article.titleEn;
  const currentSummary = lang === 'hi' ? article.summaryHi : article.summaryEn;
  const currentParagraphs = lang === 'hi' ? article.contentHi : article.contentEn;
  const currentImpactPoints = lang === 'hi' ? article.impactPointsHi : article.impactPointsEn;

  // Text to speech audio handler
  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech audio is not supported in this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToRead = `${currentTitle}. ${currentSummary}. ${currentParagraphs.join('. ')}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);

    utterance.rate = speechRate;
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';

    // Try finding matching voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => (lang === 'hi' ? v.lang.includes('hi') : v.lang.includes('en-IN') || v.lang.includes('en-GB'))
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const handleShare = async () => {
    const shareText = `${currentTitle} - ${article.source} (${article.publishedAt})\nRead on Bharat Saathi:`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: currentTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          // Fallback to clipboard if share sheet fails
          await navigator.clipboard.writeText(shareUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2800);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
      } catch {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2800);
    }
  };

  const fontSizeClasses = {
    normal: 'text-sm leading-relaxed',
    large: 'text-base leading-relaxed',
    xlarge: 'text-lg leading-loose',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 150 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 150 }}
        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl max-h-[92vh] overflow-y-auto no-scrollbar text-slate-100"
      >
        {/* Mobile Swipe handle */}
        <div className="w-12 h-1.5 rounded-full bg-slate-700 mx-auto mb-4 sm:hidden" />

        {/* Top Control Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs">
              {lang === 'hi' ? article.categoryHi : article.category}
            </span>
            {article.isFactChecked && (
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>PIB Verified</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Inline Language Switcher inside reader */}
            <button
              onClick={() => {
                if (isPlayingAudio) {
                  window.speechSynthesis.cancel();
                  setIsPlayingAudio(false);
                }
                setLang(lang === 'hi' ? 'en' : 'hi');
              }}
              className="px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 hover:border-amber-400 text-xs font-bold text-amber-400 transition"
              title={t('Read in Hindi / English', 'हिंदी / अंग्रेजी में पढ़ें')}
            >
              {lang === 'hi' ? 'Read in English' : 'हिंदी में पढ़ें'}
            </button>

            {/* Font size toggle */}
            <button
              onClick={() => {
                if (fontSize === 'normal') setFontSize('large');
                else if (fontSize === 'large') setFontSize('xlarge');
                else setFontSize('normal');
              }}
              className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition"
              title={t('Adjust Text Size', 'अक्षर आकार')}
            >
              <Type className="w-4 h-4" />
            </button>

            {/* Bookmark */}
            <button
              onClick={() =>
                toggleSaveItem({
                  id: article.id,
                  type: 'news',
                  title: currentTitle,
                })
              }
              className={`p-2 rounded-xl border transition ${
                isSaved
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className={`p-2 rounded-xl border transition ${
                copied
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:border-amber-500/50'
              }`}
              title={t('Share Article / Copy Link', 'समाचार शेयर करें / लिंक कॉपी करें')}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={() => {
                if (isPlayingAudio) window.speechSynthesis.cancel();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition"
              title={t('Close', 'बंद करें')}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {copied && (
          <div className="my-2.5 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-center gap-2 font-bold animate-pulse">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{t('Link copied to clipboard! Ready to share.', 'समाचार लिंक कॉपी हो गया! शेयर करने के लिए तैयार।')}</span>
          </div>
        )}

        {/* Audio Listen Bar (Accessible for rural & visually focused readers) */}
        <div className="my-3.5 p-3 rounded-2xl bg-gradient-to-r from-slate-850 to-slate-800 border border-amber-500/30 flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleAudio}
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition shadow ${
                isPlayingAudio
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 animate-pulse'
                  : 'bg-slate-750 text-amber-400 border border-amber-500/40 hover:bg-slate-700'
              }`}
            >
              {isPlayingAudio ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <div>
              <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                {isPlayingAudio ? t('Playing Voice News...', 'समाचार सुन रहे हैं...') : t('Listen to Full News (Audio)', 'पूरा समाचार सुनें (ऑडियो)')}
              </span>
              <p className="text-[11px] text-slate-400">
                {t('Natural Devanagari Hindi & Indian English voice', 'स्पष्ट हिंदी एवं अंग्रेजी आवाज में')}
              </p>
            </div>
          </div>

          {/* Equalizer animation & speed selector */}
          <div className="flex items-center gap-2">
            {isPlayingAudio && (
              <div className="flex items-end gap-0.5 h-4">
                <span className="w-1 bg-amber-400 rounded-full animate-bounce h-3" />
                <span className="w-1 bg-amber-400 rounded-full animate-bounce h-4 delay-100" />
                <span className="w-1 bg-amber-400 rounded-full animate-bounce h-2 delay-200" />
              </div>
            )}
            <button
              onClick={() => {
                const nextRate = speechRate === 1 ? 1.25 : speechRate === 1.25 ? 1.5 : 1;
                setSpeechRate(nextRate);
                if (isPlayingAudio) {
                  window.speechSynthesis.cancel();
                  setIsPlayingAudio(false);
                }
              }}
              className="px-2 py-1 rounded-lg bg-slate-800 text-[10px] font-bold text-slate-300 border border-slate-700 hover:text-amber-400"
            >
              {speechRate}x
            </button>
          </div>
        </div>

        {/* Title & Metadata */}
        <div className="my-3">
          <h2 className="text-lg sm:text-2xl font-black text-slate-100 leading-snug">
            {currentTitle}
          </h2>
          <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
            <span>{article.publishedAt}</span>
            <span>•</span>
            <span className="text-amber-400/90 font-medium">{article.source}</span>
            <span>•</span>
            <span>{article.readTimeMinutes} {t('min read', 'मिनट')}</span>
          </div>
        </div>

        {/* Key Impact / Summary Takeaways */}
        <div className="my-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25">
          <h4 className="text-xs font-bold text-amber-300 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            {t('Quick Takeaways & Citizen Impact', 'मुख्य बिंदु व नागरिक लाभ')}
          </h4>
          <ul className="space-y-1.5">
            {currentImpactPoints.map((point, pIdx) => (
              <li key={pIdx} className="text-xs text-slate-200 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Article Body */}
        <div className={`space-y-3.5 text-slate-300 ${fontSizeClasses[fontSize]} ${lang === 'hi' ? 'font-devanagari' : ''}`}>
          {currentParagraphs.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        {/* Bottom Actions Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
          <button
            onClick={handleShare}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition border ${
              copied
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/40 text-amber-300'
            }`}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? t('Link Copied!', 'लिंक कॉपी हो गया!') : t('Share Article', 'समाचार शेयर करें')}</span>
          </button>

          {article.officialLink && (
            <a
              href={article.officialLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-bold border border-slate-700 transition"
            >
              <span>{t('Visit Official Portal', 'आधिकारिक पोर्टल खोलें')}</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );
};
