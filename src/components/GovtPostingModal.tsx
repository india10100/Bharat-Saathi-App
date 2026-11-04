import React, { useState } from 'react';
import { GovtPosting } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { X, Calendar, DollarSign, Users, Award, ExternalLink, Bookmark, CheckCircle, AlertTriangle, Share2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GovtPostingModalProps {
  posting: GovtPosting | null;
  onClose: () => void;
}

export const GovtPostingModal: React.FC<GovtPostingModalProps> = ({ posting, onClose }) => {
  const { lang, t, isItemSaved, toggleSaveItem } = useLanguage();
  const [userBirthYear, setUserBirthYear] = useState<string>('2000');
  const [userCategory, setUserCategory] = useState<'UR' | 'OBC' | 'SC_ST' | 'PwD'>('UR');
  const [eligibilityResult, setEligibilityResult] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!posting) return null;

  const isSaved = isItemSaved(posting.id);

  // Age Calculator
  const handleCheckAge = () => {
    const birthYear = parseInt(userBirthYear, 10);
    if (isNaN(birthYear) || birthYear < 1960 || birthYear > 2015) {
      setEligibilityResult(t('Please enter a valid birth year', 'कृपया सही जन्म वर्ष दर्ज करें'));
      return;
    }
    const currentYear = 2026;
    const calculatedAge = currentYear - birthYear;

    let maxAllowed = posting.ageMax;
    if (userCategory === 'OBC') maxAllowed += 3;
    if (userCategory === 'SC_ST') maxAllowed += 5;
    if (userCategory === 'PwD') maxAllowed += 10;

    if (calculatedAge < posting.ageMin) {
      setEligibilityResult(
        t(
          `You are ${calculatedAge} yrs old. Minimum age required is ${posting.ageMin} yrs.`,
          `आपकी आयु ${calculatedAge} वर्ष है। न्यूनतम आवश्यक आयु ${posting.ageMin} वर्ष है।`
        )
      );
    } else if (calculatedAge > maxAllowed) {
      setEligibilityResult(
        t(
          `You are ${calculatedAge} yrs old. Maximum allowed for your category is ${maxAllowed} yrs.`,
          `आपकी आयु ${calculatedAge} वर्ष है। आपकी श्रेणी के लिए अधिकतम आयु सीमा ${maxAllowed} वर्ष है।`
        )
      );
    } else {
      setEligibilityResult(
        t(
          `Eligible! Your age (${calculatedAge} yrs) is within the allowed limits (${posting.ageMin} - ${maxAllowed} yrs).`,
          `पात्र हैं! आपकी आयु (${calculatedAge} वर्ष) निर्धारित सीमा (${posting.ageMin} - ${maxAllowed} वर्ष) के भीतर है।`
        )
      );
    }
  };

  const handleShare = async () => {
    const title = lang === 'hi' ? posting.titleHi : posting.titleEn;
    const org = lang === 'hi' ? posting.organizationHi : posting.organizationEn;
    const shareText = `Govt Recruitment: ${title} at ${org} (${posting.totalVacancies} Vacancies, Last Date: ${posting.lastDate}, Pay Scale: ${posting.salaryPayScale})\nExplore on Bharat Saathi:`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: shareUrl,
        });
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          await navigator.clipboard.writeText(shareUrl);
          setCopiedLink(true);
          setTimeout(() => setCopiedLink(false), 2800);
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
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 150 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 150 }}
        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[92vh] overflow-y-auto no-scrollbar text-slate-100"
      >
        {/* Mobile Swipe handle */}
        <div className="w-12 h-1.5 rounded-full bg-slate-700 mx-auto mb-4 sm:hidden" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs">
                {posting.postCategory}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold text-xs flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {posting.totalVacancies.toLocaleString('en-IN')} {t('Vacancies', 'पद')}
              </span>
              {posting.state && (
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs">
                  {posting.state}
                </span>
              )}
            </div>

            <h2 className="text-base sm:text-xl font-black text-slate-100 leading-snug">
              {lang === 'hi' ? posting.titleHi : posting.titleEn}
            </h2>
            <p className="text-xs text-amber-400 font-semibold mt-0.5">
              {lang === 'hi' ? posting.organizationHi : posting.organizationEn}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                toggleSaveItem({
                  id: posting.id,
                  type: 'govt',
                  title: lang === 'hi' ? posting.titleHi : posting.titleEn,
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
                copiedLink
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:border-amber-500/50'
              }`}
              title={t('Share Posting / Copy Link', 'भर्ती शेयर करें / लिंक कॉपी करें')}
            >
              {copiedLink ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition"
              title={t('Close', 'बंद करें')}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {copiedLink && (
          <div className="my-2.5 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-center gap-2 font-bold animate-pulse">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{t('Job details link copied to clipboard! Ready to share.', 'भर्ती लिंक क्लिपबोर्ड पर कॉपी हो गया! शेयर करने के लिए तैयार।')}</span>
          </div>
        )}

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
          <div className="p-3 rounded-2xl bg-slate-800/70 border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block">{t('Monthly Pay Scale', 'मासिक वेतन')}</span>
            <span className="text-xs font-bold text-amber-300 mt-0.5 block leading-tight">
              {posting.salaryPayScale}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/70 border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block">{t('Last Date to Apply', 'आवेदन की अंतिम तिथि')}</span>
            <span className="text-xs font-bold text-rose-400 mt-0.5 block leading-tight flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 inline" />
              {posting.lastDate}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/70 border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block">{t('Age Limit', 'आयु सीमा')}</span>
            <span className="text-xs font-bold text-slate-200 mt-0.5 block leading-tight">
              {posting.ageMin} - {posting.ageMax} {t('Years', 'वर्ष')}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/70 border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block">{t('Application Fee', 'आवेदन शुल्क')}</span>
            <span className="text-xs font-bold text-slate-200 mt-0.5 block leading-tight">
              Gen/OBC: {posting.applicationFee.generalOBC}
            </span>
          </div>
        </div>

        {/* Qualifications Required */}
        <div className="mb-4 p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50">
          <h4 className="text-xs font-bold text-slate-200 mb-2 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            {t('Eligibility & Qualifications', 'शैक्षणिक योग्यता एवं पात्रता')}
          </h4>
          <div className="flex flex-wrap gap-2">
            {posting.qualifications.map((q, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-semibold"
              >
                {q}
              </span>
            ))}
          </div>
        </div>

        {/* Interactive Age Eligibility Check */}
        <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold text-slate-100">
              {t('Check Your Age Eligibility Instantly', 'अपनी आयु पात्रता तुरंत जांचें')}
            </h4>
          </div>
          <p className="text-[11px] text-slate-400 mb-2.5">
            {t('Relaxations included: OBC (+3 yrs), SC/ST (+5 yrs), PwD (+10 yrs)', 'आयु छूट: OBC (+3 वर्ष), SC/ST (+5 वर्ष), PwD (+10 वर्ष)')}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="number"
              value={userBirthYear}
              onChange={(e) => setUserBirthYear(e.target.value)}
              placeholder={t('Birth Year (e.g. 2000)', 'जन्म वर्ष (उदा. 2000)')}
              className="w-28 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-100 focus:outline-none focus:border-amber-400"
            />
            <select
              value={userCategory}
              onChange={(e) => setUserCategory(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-100 focus:outline-none"
            >
              <option value="UR">General / EWS</option>
              <option value="OBC">OBC (+3 Yrs)</option>
              <option value="SC_ST">SC / ST (+5 Yrs)</option>
              <option value="PwD">PwD (+10 Yrs)</option>
            </select>
            <button
              onClick={handleCheckAge}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition cursor-pointer"
            >
              {t('Check Age', 'जांचें')}
            </button>
          </div>

          {eligibilityResult && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-2.5 p-2.5 rounded-xl text-xs font-medium ${
                eligibilityResult.includes('Eligible!') || eligibilityResult.includes('पात्र हैं!')
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}
            >
              {eligibilityResult}
            </motion.div>
          )}
        </div>

        {/* Selection Stages */}
        <div className="mb-4">
          <h4 className="text-xs font-bold text-slate-200 mb-2">
            {t('Selection Process Stages', 'चयन प्रक्रिया के चरण')}
          </h4>
          <div className="space-y-1.5">
            {(lang === 'hi' ? posting.selectionStagesHi : posting.selectionStagesEn).map(
              (stage, sIdx) => (
                <div
                  key={sIdx}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs text-slate-300"
                >
                  <span className="w-5 h-5 rounded-full bg-slate-700 text-amber-400 text-[11px] font-bold flex items-center justify-center shrink-0">
                    {sIdx + 1}
                  </span>
                  <span>{stage}</span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="mb-5 text-xs text-slate-300 leading-relaxed p-3 rounded-2xl bg-slate-800/40">
          <p>{lang === 'hi' ? posting.summaryHi : posting.summaryEn}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-3 border-t border-slate-800">
          <a
            href={posting.officialPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold text-center shadow-lg transition flex items-center justify-center gap-2"
          >
            <span>{t('Apply on Official Portal', 'आधिकारिक पोर्टल पर आवेदन करें')}</span>
            <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
          </a>

          <button
            onClick={handleShare}
            className={`w-full sm:w-auto px-4 py-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
              copiedLink
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800 hover:bg-slate-750 border-amber-500/30 text-amber-300'
            }`}
            title={t('Share this job posting', 'यह भर्ती शेयर करें')}
          >
            {copiedLink ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedLink ? t('Link Copied!', 'लिंक कॉपी हुआ!') : t('Share Posting', 'भर्ती शेयर करें')}</span>
          </button>

          <a
            href={posting.notificationPdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-bold text-center transition flex items-center justify-center gap-2"
          >
            <span>{t('Notification PDF', 'विज्ञप्ति PDF')}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </motion.div>
    </div>
  );
};
