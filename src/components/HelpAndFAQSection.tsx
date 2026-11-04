import React, { useState } from 'react';
import { FAQ_DATA, FAQItem } from '../data/faqData';
import { useLanguage } from '../context/LanguageContext';
import { Search, ChevronDown, ChevronUp, Volume2, VolumeX, ExternalLink, HelpCircle, CheckCircle2, Lightbulb, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const HelpAndFAQSection: React.FC = () => {
  const { lang, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(FAQ_DATA[0].id);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const categories = [
    { id: 'all', emoji: '🌟', labelEn: 'All Help', labelHi: 'सभी सवाल' },
    { id: 'jobs', emoji: '🎯', labelEn: 'Job Procedures', labelHi: 'नौकरी आवेदन' },
    { id: 'schemes', emoji: '🎁', labelEn: 'Govt Schemes', labelHi: 'सरकारी योजनाएं' },
    { id: 'students', emoji: '🎒', labelEn: 'Students & Kids', labelHi: 'छात्र व बच्चे' },
    { id: 'documents', emoji: '📄', labelEn: 'Aadhaar & Documents', labelHi: 'कार्ड व दस्तावेज' },
  ];

  const filteredFaqs = FAQ_DATA.filter((item) => {
    if (activeCategory !== 'all' && item.category !== activeCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchEn =
        item.questionEn.toLowerCase().includes(q) ||
        item.simpleAnswerEn.toLowerCase().includes(q) ||
        item.stepsEn.some((s) => s.toLowerCase().includes(q));
      const matchHi =
        item.questionHi.toLowerCase().includes(q) ||
        item.simpleAnswerHi.toLowerCase().includes(q) ||
        item.stepsHi.some((s) => s.toLowerCase().includes(q));
      if (!matchEn && !matchHi) return false;
    }
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleSpeakAnswer = (e: React.MouseEvent, item: FAQItem) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) return;

    if (speakingId === item.id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = lang === 'hi'
      ? `${item.questionHi}. ${item.simpleAnswerHi}. मुख्य कदम: ${item.stepsHi.join('. ')}`
      : `${item.questionEn}. ${item.simpleAnswerEn}. Key steps: ${item.stepsEn.join('. ')}`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    window.speechSynthesis.speak(utterance);
    setSpeakingId(item.id);
  };

  return (
    <div className="space-y-4">
      {/* Top Friendly Header Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-500/30 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-300 border border-blue-500/40 text-2xl">
            ❓
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>{t('Simple Citizen Help & FAQ', 'सरल नागरिक सहायता एवं सवाल-जवाब')}</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                {t('Easy for All', 'सबके लिए सरल')}
              </span>
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              {t(
                'Simple answers for students, job applicants, and families. Tap 🔊 to listen aloud!',
                'नौकरी, योजना और पहचान पत्र से जुड़े आम सवालों के आसान जवाब। 🔊 दबाकर सुनें!'
              )}
            </p>
          </div>
        </div>

        {/* Quick Question Count */}
        <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-bold text-amber-400">
          {filteredFaqs.length} {t('Help Guides Available', 'सरल समाधान उपलब्ध')}
        </div>
      </div>

      {/* Search Input for Help */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t(
            'Search help: e.g. Ayushman card, 10th marksheet, PM Internship, e-PAN...',
            'सर्च करें: जैसे आयुष्मान कार्ड, 10वीं मार्कशीट, पीएम इंटर्नशिप, ई-पैन...'
          )}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-800/90 border border-slate-700 text-slate-100 placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-400 shadow-inner"
        />
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition cursor-pointer ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-105'
                  : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{t(cat.labelEn, cat.labelHi)}</span>
            </button>
          );
        })}
      </div>

      {/* Accordion Questions List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <HelpCircle className="w-10 h-10 mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-semibold">{t('No matching question found.', 'कोई प्रश्न नहीं मिला।')}</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="mt-3 px-4 py-1.5 rounded-xl bg-slate-800 text-amber-400 text-xs font-bold"
            >
              {t('Show All Questions', 'सभी सवाल देखें')}
            </button>
          </div>
        ) : (
          filteredFaqs.map((item) => {
            const isExpanded = expandedId === item.id;
            const isSpeaking = speakingId === item.id;
            const question = lang === 'hi' ? item.questionHi : item.questionEn;
            const answer = lang === 'hi' ? item.simpleAnswerHi : item.simpleAnswerEn;
            const steps = lang === 'hi' ? item.stepsHi : item.stepsEn;
            const proTip = lang === 'hi' ? item.proTipHi : item.proTipEn;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-3xl border-2 transition-all overflow-hidden ${
                  isExpanded
                    ? 'bg-slate-850 border-amber-400/80 shadow-xl'
                    : 'bg-slate-800/80 border-slate-700/80 hover:border-slate-600'
                }`}
              >
                {/* Question Header */}
                <div
                  onClick={() => toggleExpand(item.id)}
                  className="p-4 flex items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl shrink-0">{item.emoji}</span>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-0.5">
                        {t(item.categoryLabelEn, item.categoryLabelHi)}
                      </span>
                      <h3 className="text-sm sm:text-base font-black text-white leading-snug">
                        {question}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Speak Button */}
                    <button
                      onClick={(e) => handleSpeakAnswer(e, item)}
                      className={`p-2 rounded-xl border transition cursor-pointer ${
                        isSpeaking
                          ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse'
                          : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-amber-400'
                      }`}
                      title={t('Listen answer aloud', 'आवाज में सुनें')}
                    >
                      {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Answer Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-4 pb-4 pt-1 border-t border-slate-700/60 space-y-3.5 text-xs text-slate-200"
                    >
                      {/* Simple Summary */}
                      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-slate-100 font-medium leading-relaxed">
                        <p>{answer}</p>
                      </div>

                      {/* Numbered Steps */}
                      <div>
                        <h4 className="font-bold text-xs text-amber-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>{t('Step-by-Step Procedure', 'आसान चरणबद्ध प्रक्रिया')}</span>
                        </h4>
                        <div className="space-y-2">
                          {steps.map((step, sIdx) => (
                            <div
                              key={sIdx}
                              className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50"
                            >
                              <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 text-xs font-black flex items-center justify-center shrink-0 mt-0.5 border border-slate-700">
                                {sIdx + 1}
                              </span>
                              <span className="leading-relaxed text-slate-300">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pro-Tip Card */}
                      <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-2.5">
                        <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-emerald-300 font-bold block mb-0.5">
                            {t('Important Tip to Remember:', 'जरूरी बात याद रखें:')}
                          </strong>
                          <span className="text-[11px] text-slate-300 leading-relaxed">{proTip}</span>
                        </div>
                      </div>

                      {/* Official Link */}
                      {item.officialLink && (
                        <div className="pt-2 flex justify-end">
                          <a
                            href={item.officialLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-slate-950 font-black text-xs shadow transition flex items-center gap-1.5"
                          >
                            <span>{t('Go to Official Government Portal', 'सीधे आधिकारिक पोर्टल खोलें')}</span>
                            <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                          </a>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
