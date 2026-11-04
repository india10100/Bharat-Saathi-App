import React, { useState } from 'react';
import { GovtScheme } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { X, Landmark, DollarSign, CheckCircle2, FileText, Phone, ExternalLink, Bookmark, Share2 } from 'lucide-react';
import { motion } from 'motion/react';

interface GovtSchemeModalProps {
  scheme: GovtScheme | null;
  onClose: () => void;
}

export const GovtSchemeModal: React.FC<GovtSchemeModalProps> = ({ scheme, onClose }) => {
  const { lang, t, isItemSaved, toggleSaveItem } = useLanguage();
  const [copied, setCopied] = useState(false);

  if (!scheme) return null;

  const isSaved = isItemSaved(scheme.id);
  const currentName = lang === 'hi' ? scheme.nameHi : scheme.nameEn;
  const currentMinistry = lang === 'hi' ? scheme.ministryHi : scheme.ministryEn;
  const currentEligibility = lang === 'hi' ? scheme.eligibilityHi : scheme.eligibilityEn;
  const currentBenefits = lang === 'hi' ? scheme.keyBenefitsHi : scheme.keyBenefitsEn;
  const currentDocuments = lang === 'hi' ? scheme.documentsRequiredHi : scheme.documentsRequiredEn;

  const handleShare = async () => {
    const shareText = `Govt Scheme: ${currentName} (${currentMinistry})\nDirect Benefit: ${scheme.financialBenefit}\nDetails on Bharat Saathi:`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: currentName,
          text: shareText,
          url: shareUrl,
        });
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          await navigator.clipboard.writeText(shareUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2800);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
      } catch {
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

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 150 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 150 }}
        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
        className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[92vh] overflow-y-auto no-scrollbar text-slate-100"
      >
        <div className="w-12 h-1.5 rounded-full bg-slate-700 mx-auto mb-4 sm:hidden" />

        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold text-xs border border-emerald-500/30">
              {lang === 'hi' ? scheme.categoryHi : scheme.category}
            </span>
            <h2 className="text-base sm:text-xl font-black text-slate-100 leading-snug mt-1.5">
              {currentName}
            </h2>
            <p className="text-xs text-amber-400 font-bold mt-0.5">{currentMinistry}</p>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                toggleSaveItem({
                  id: scheme.id,
                  type: 'scheme',
                  title: currentName,
                })
              }
              className={`p-2 rounded-full border transition ${
                isSaved
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title={t('Save / Bookmark', 'सहेजें')}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={handleShare}
              className={`p-2 rounded-full border transition ${
                copied
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:border-amber-500/50'
              }`}
              title={t('Share Scheme / Copy Link', 'योजना शेयर करें / लिंक कॉपी करें')}
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-white"
              title={t('Close', 'बंद करें')}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {copied && (
          <div className="my-2.5 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-center gap-2 font-bold animate-pulse">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{t('Scheme link copied to clipboard! Ready to share.', 'योजना लिंक कॉपी हो गया! शेयर करने के लिए तैयार।')}</span>
          </div>
        )}

        {/* Financial Benefit Callout */}
        <div className="my-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/15 border border-emerald-500/40">
          <span className="text-[11px] font-bold text-emerald-300 block mb-0.5">
            {t('Direct Financial Benefit', 'सीधा आर्थिक लाभ')}
          </span>
          <span className="text-sm sm:text-base font-extrabold text-white">
            {scheme.financialBenefit}
          </span>
        </div>

        {/* Key Benefits */}
        <div className="mb-4">
          <h4 className="text-xs font-bold text-slate-200 mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {t('Key Scheme Benefits', 'योजना के मुख्य लाभ')}
          </h4>
          <div className="space-y-1.5">
            {currentBenefits.map((b, bIdx) => (
              <div
                key={bIdx}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs text-slate-200"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Eligibility Criteria */}
        <div className="mb-4">
          <h4 className="text-xs font-bold text-slate-200 mb-2 flex items-center gap-1.5">
            <Landmark className="w-4 h-4 text-amber-400" />
            {t('Eligibility Criteria', 'पात्रता की शर्तें')}
          </h4>
          <div className="space-y-1.5">
            {currentEligibility.map((el, eIdx) => (
              <div
                key={eIdx}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs text-slate-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span>{el}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Documents Required */}
        <div className="mb-5 p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 text-xs text-slate-300">
          <h4 className="font-bold text-slate-200 mb-2 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-blue-400" />
            {t('Required Documents', 'आवश्यक दस्तावेज')}
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {currentDocuments.map((doc, dIdx) => (
              <span
                key={dIdx}
                className="px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-medium text-xs"
              >
                {doc}
              </span>
            ))}
          </div>
        </div>

        {/* Helpline + Official Apply + Share */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Phone className="w-4 h-4 text-amber-400" />
            <span>Toll-Free: <strong className="text-slate-200">{scheme.tollFreeNumber}</strong></span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleShare}
              className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                copied
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 hover:bg-slate-750 border-amber-500/30 text-amber-300'
              }`}
              title={t('Share Scheme', 'योजना शेयर करें')}
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? t('Link Copied!', 'लिंक कॉपी हुआ!') : t('Share Scheme', 'शेयर करें')}</span>
            </button>

            <a
              href={scheme.applyPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold shadow-lg transition flex items-center justify-center gap-2"
            >
              <span>{t('Apply on Portal', 'पोर्टल पर आवेदन करें')}</span>
              <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
