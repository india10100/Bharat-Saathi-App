import React, { useState } from 'react';
import { JobPosting } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { X, Building2, MapPin, DollarSign, Calendar, Bookmark, ExternalLink, Share2, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface JobPostingModalProps {
  job: JobPosting | null;
  onClose: () => void;
}

export const JobPostingModal: React.FC<JobPostingModalProps> = ({ job, onClose }) => {
  const { lang, t, isItemSaved, toggleSaveItem } = useLanguage();
  const [copied, setCopied] = useState(false);

  if (!job) return null;

  const isSaved = isItemSaved(job.id);
  const currentTitle = lang === 'hi' ? job.titleHi : job.titleEn;
  const currentDescription = lang === 'hi' ? job.descriptionHi : job.descriptionEn;

  const handleShare = async () => {
    const shareText = `Job Opening: ${currentTitle} at ${job.company} (${job.salaryRange}, ${job.location}, Deadline: ${job.deadline})\nApply via Bharat Saathi:`;
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

        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              {job.isFeaturedGovtApprentice && (
                <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  PM Scheme
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 font-bold text-xs border border-blue-500/30">
                {job.type}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold text-xs">
                {job.workMode}
              </span>
            </div>

            <h2 className="text-base sm:text-xl font-black text-slate-100 leading-snug">
              {currentTitle}
            </h2>
            <p className="text-xs text-amber-400 font-bold mt-1 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>{job.company}</span>
            </p>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                toggleSaveItem({
                  id: job.id,
                  type: 'job',
                  title: currentTitle,
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
              title={t('Share Job Opening / Copy Link', 'नौकरी शेयर करें / लिंक कॉपी करें')}
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
            <span>{t('Job link copied to clipboard! Ready to share.', 'नौकरी लिंक कॉपी हो गया! शेयर करने के लिए तैयार।')}</span>
          </div>
        )}

        {/* Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-4">
          <div className="p-3 rounded-2xl bg-slate-800/70 border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block">{t('Salary / Stipend', 'वेतन / वजीफा')}</span>
            <span className="text-xs font-bold text-amber-300 mt-0.5 block">{job.salaryRange}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/70 border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block">{t('Experience', 'अनुभव')}</span>
            <span className="text-xs font-bold text-slate-200 mt-0.5 block">{job.experienceRequired}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/70 border border-slate-700/60 col-span-2 sm:col-span-1">
            <span className="text-[11px] text-slate-400 block">{t('Application Deadline', 'अंतिम तिथि')}</span>
            <span className="text-xs font-bold text-rose-400 mt-0.5 block flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 inline" />
              {job.deadline}
            </span>
          </div>
        </div>

        {/* Location & Min Qualification */}
        <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 space-y-2 mb-4 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span><strong>{t('Location:', 'स्थान:')}</strong> {job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span><strong>{t('Minimum Qualification:', 'न्यूनतम योग्यता:')}</strong> {job.minQualification}</span>
          </div>
        </div>

        {/* Skills Required */}
        <div className="mb-4">
          <h4 className="text-xs font-bold text-slate-200 mb-2">{t('Skills & Attributes', 'वांछित कौशल')}</h4>
          <div className="flex flex-wrap gap-1.5">
            {job.skills.map((skill, sIdx) => (
              <span
                key={sIdx}
                className="px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Job Description */}
        <div className="mb-5 p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 text-xs text-slate-300 leading-relaxed">
          <h4 className="font-bold text-slate-100 mb-1">{t('Role Overview', 'कार्य विवरण')}</h4>
          <p>{currentDescription}</p>
        </div>

        {/* Apply and Share CTA */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-2.5">
          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold text-center shadow-lg transition flex items-center justify-center gap-2"
          >
            <span>{t('Apply for Opening Now', 'अब आवेदन करें')}</span>
            <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
          </a>

          <button
            onClick={handleShare}
            className={`w-full sm:w-auto px-5 py-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
              copied
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800 hover:bg-slate-750 border-amber-500/30 text-amber-300'
            }`}
            title={t('Share this job posting', 'यह नौकरी शेयर करें')}
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? t('Link Copied!', 'लिंक कॉपी हुआ!') : t('Share Job', 'शेयर करें')}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
