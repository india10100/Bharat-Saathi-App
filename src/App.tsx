import React, { useState, useMemo } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider, useNotifications } from './context/NotificationContext';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { FilterBar, FilterState } from './components/FilterBar';
import { GovtPostingCard } from './components/GovtPostingCard';
import { GovtPostingModal } from './components/GovtPostingModal';
import { BilingualNewsCard } from './components/BilingualNewsCard';
import { NewsReaderModal } from './components/NewsReaderModal';
import { JobPostingCard } from './components/JobPostingCard';
import { JobPostingModal } from './components/JobPostingModal';
import { GovtSchemeCard } from './components/GovtSchemeCard';
import { GovtSchemeModal } from './components/GovtSchemeModal';
import { YojanaCalculatorModal } from './components/YojanaCalculatorModal';
import { CitizenPortalsSection } from './components/CitizenPortalsSection';
import { BioDataBuilder } from './components/BioDataBuilder';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { HelpAndFAQSection } from './components/HelpAndFAQSection';
import { StudentLearningHub } from './components/StudentLearningHub';
import { WomenHub } from './components/WomenHub';
import { SwasthAndHomeHub } from './components/SwasthAndHomeHub';
import { StoreLaunchModal } from './components/StoreLaunchModal';
import { GOVT_POSTINGS, BILINGUAL_NEWS, JOB_POSTINGS, GOVT_SCHEMES } from './data/mockData';
import { GovtPosting, NewsArticle, JobPosting, GovtScheme } from './types';
import { Sparkles, Award, Newspaper, Briefcase, Landmark, ShieldCheck, ChevronRight, User, Bell, Download, Search, CheckCircle2, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DEFAULT_FILTERS: FilterState = {
  languageFilter: 'all',
  govtCategory: 'All',
  jobCategory: 'All',
  newsCategory: 'All',
  state: 'All India (अखिल भारतीय)',
  qualification: 'All',
  statusFilter: 'All',
};

function MainAppContent() {
  const { lang, t, searchQuery, setSearchQuery, savedItems } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const { unreadCount, simulateTriggerByCategory } = useNotifications();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // Selected item modal states
  const [selectedGovtPosting, setSelectedGovtPosting] = useState<GovtPosting | null>(null);
  const [selectedNewsArticle, setSelectedNewsArticle] = useState<NewsArticle | null>(null);
  const [selectedJobPosting, setSelectedJobPosting] = useState<JobPosting | null>(null);
  const [selectedGovtScheme, setSelectedGovtScheme] = useState<GovtScheme | null>(null);

  // Utility modals
  const [showYojanaCalculator, setShowYojanaCalculator] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showBookmarksView, setShowBookmarksView] = useState(false);
  const [showStoreLaunchModal, setShowStoreLaunchModal] = useState(false);
  const [showBioDataModal, setShowBioDataModal] = useState(false);

  // Content Filtering logic
  const filteredGovtPostings = useMemo(() => {
    return GOVT_POSTINGS.filter((posting) => {
      // Category filter
      if (filters.govtCategory !== 'All' && posting.postCategory !== filters.govtCategory) {
        return false;
      }
      // State filter
      if (
        filters.state !== 'All India (अखिल भारतीय)' &&
        posting.state &&
        !filters.state.includes(posting.state)
      ) {
        return false;
      }
      // Qualification filter
      if (
        filters.qualification !== 'All' &&
        !posting.qualifications.some((q) => q.toLowerCase().includes(filters.qualification.toLowerCase()))
      ) {
        return false;
      }
      // Status filter
      if (filters.statusFilter !== 'All' && posting.status !== filters.statusFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesEn = posting.titleEn.toLowerCase().includes(q) || posting.organizationEn.toLowerCase().includes(q);
        const matchesHi = posting.titleHi.toLowerCase().includes(q) || posting.organizationHi.toLowerCase().includes(q);
        if (!matchesEn && !matchesHi) return false;
      }
      return true;
    });
  }, [filters, searchQuery]);

  const filteredNews = useMemo(() => {
    return BILINGUAL_NEWS.filter((article) => {
      if (filters.newsCategory !== 'All' && article.category !== filters.newsCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesEn = article.titleEn.toLowerCase().includes(q) || article.summaryEn.toLowerCase().includes(q);
        const matchesHi = article.titleHi.toLowerCase().includes(q) || article.summaryHi.toLowerCase().includes(q);
        if (!matchesEn && !matchesHi) return false;
      }
      return true;
    });
  }, [filters, searchQuery]);

  const filteredJobs = useMemo(() => {
    return JOB_POSTINGS.filter((job) => {
      if (filters.jobCategory !== 'All') {
        if (filters.jobCategory === 'PM Internship' && job.type !== 'PM Internship') return false;
        if (filters.jobCategory === 'Work From Home' && job.workMode !== 'Remote') return false;
        if (filters.jobCategory !== 'PM Internship' && filters.jobCategory !== 'Work From Home' && job.category !== filters.jobCategory) {
          return false;
        }
      }
      if (
        filters.qualification !== 'All' &&
        !job.minQualification.toLowerCase().includes(filters.qualification.toLowerCase())
      ) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesEn = job.titleEn.toLowerCase().includes(q) || job.company.toLowerCase().includes(q);
        const matchesHi = job.titleHi.toLowerCase().includes(q);
        if (!matchesEn && !matchesHi) return false;
      }
      return true;
    });
  }, [filters, searchQuery]);

  const filteredSchemes = useMemo(() => {
    return GOVT_SCHEMES.filter((scheme) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesEn = scheme.nameEn.toLowerCase().includes(q) || scheme.ministryEn.toLowerCase().includes(q);
        const matchesHi = scheme.nameHi.toLowerCase().includes(q);
        if (!matchesEn && !matchesHi) return false;
      }
      return true;
    });
  }, [searchQuery]);

  // Handle opening notification target item
  const handleOpenNotificationItem = (item: { type: string; id: string }) => {
    if (item.type === 'govt' || item.type === 'admitCard') {
      const found = GOVT_POSTINGS.find((p) => p.id === item.id) || GOVT_POSTINGS[0];
      setSelectedGovtPosting(found);
    } else if (item.type === 'job') {
      const found = JOB_POSTINGS.find((j) => j.id === item.id) || JOB_POSTINGS[0];
      setSelectedJobPosting(found);
    } else if (item.type === 'news') {
      const found = BILINGUAL_NEWS.find((n) => n.id === item.id) || BILINGUAL_NEWS[0];
      setSelectedNewsArticle(found);
    } else if (item.type === 'scheme') {
      const found = GOVT_SCHEMES.find((s) => s.id === item.id) || GOVT_SCHEMES[0];
      setSelectedGovtScheme(found);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-24 selection:bg-amber-500 selection:text-slate-950">
      {/* Offline mode indicator */}
      <OfflineIndicator />

      {/* Main Top Header */}
      <Header onOpenStoreLaunch={() => setShowStoreLaunchModal(true)} />

      {/* Sub-header User Account & Quick Saved Bar */}
      <div className="bg-slate-900 border-b border-slate-800/80 px-3.5 sm:px-6 py-2">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          {/* User Sign In / Profile Button */}
          {isAuthenticated && user ? (
            <button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-amber-500/50 transition cursor-pointer"
            >
              <div className={`w-5 h-5 rounded-lg bg-gradient-to-br ${user.avatarColor} text-white font-bold text-xs flex items-center justify-center`}>
                {user.name.charAt(0)}
              </div>
              <span className="text-xs font-bold text-slate-200 truncate max-w-[120px] sm:max-w-[160px]">
                {user.name.split(' ')[0]}
              </span>
              <span className="text-[10px] text-amber-400 bg-amber-500/15 px-1.5 py-0.5 rounded font-semibold">
                {user.category}
              </span>
            </button>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('Citizen Sign In', 'नागरिक लॉगिन')}</span>
            </button>
          )}

          {/* Quick Tools: Bio-Data & Bookmarks */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBioDataModal(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer"
              title={t('Build Simple 1-Page Bio-Data', 'सरल बायोडाटा बनाएं')}
            >
              <span>📄</span>
              <span>{t('Bio-Data', 'बायोडाटा')}</span>
            </button>

            <button
              onClick={() => setShowBookmarksView(!showBookmarksView)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                showBookmarksView
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title={t('Saved Items', 'सहेजी गई सूची')}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current text-amber-400" />
              <span>{t('Saved', 'सहेजे')} ({savedItems.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3.5 sm:px-6 pt-2 pb-6 space-y-4">
        {/* Bookmarks Drawer Overlay View if open */}
        {showBookmarksView && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-3xl bg-slate-850 border border-amber-500/40 shadow-xl space-y-2.5"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-400 fill-current" />
                <h3 className="text-sm font-bold text-slate-100">
                  {t('Your Bookmarked Items & Postings', 'आपकी सहेजी गई नौकरियां व योजनाएं')}
                </h3>
              </div>
              <button
                onClick={() => setShowBookmarksView(false)}
                className="text-xs text-slate-400 hover:text-white font-bold"
              >
                {t('Close', 'बंद करें')}
              </button>
            </div>

            {savedItems.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                {t(
                  'No items bookmarked yet. Tap the bookmark icon on any job, scheme or news to save for offline access.',
                  'कोई भी आइटम सहेजा नहीं गया है। किसी भी नौकरी या योजना पर बुकमार्क आइकन दबाकर सहेजें।'
                )}
              </p>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar">
                {savedItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      handleOpenNotificationItem({ type: item.type, id: item.id });
                      setShowBookmarksView(false);
                    }}
                    className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 flex items-center justify-between cursor-pointer group"
                  >
                    <div className="min-w-0 pr-2">
                      <span className="text-[10px] uppercase font-bold text-amber-400 block">{item.type}</span>
                      <p className="text-xs font-semibold text-slate-100 truncate group-hover:text-amber-300">
                        {item.title}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Content Filter Bar (for govt, news, private tabs) */}
        {(activeTab === 'govt' || activeTab === 'news' || activeTab === 'private') && (
          <FilterBar
            currentTab={activeTab}
            filters={filters}
            onFilterChange={setFilters}
            onResetFilters={() => setFilters(DEFAULT_FILTERS)}
          />
        )}

        {/* ===================== TAB 1: HOME (समग्र) ===================== */}
        {activeTab === 'home' && (
          <div className="space-y-4">
            {/* Friendly Citizen Welcome Hero Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-5 sm:p-6 shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 text-xs font-black flex items-center gap-1 shadow">
                    🇮🇳 {t('Bharat Saathi', 'भारत साथी')}
                  </span>
                  <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {t('100% Free • No Ads', '100% निशुल्क • बिना विज्ञापन')}
                  </span>
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    {lang === 'hi'
                      ? 'नमस्ते! सरकारी नौकरियां, छात्रवृत्ति व सरल खबरें'
                      : 'Namaste! Govt Jobs, School Scholarships & Simple News'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
                    {t(
                      'Clear information for students, kids, youth & parents. Tap below to browse immediately:',
                      'छात्रों, युवाओं और परिजनों के लिए सरल जानकारी। नीचे सीधे टैप करके देखें:'
                    )}
                  </p>
                </div>

                {/* 3 Core Primary Jump Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                  <button
                    onClick={() => {
                      setActiveTab('govt');
                      setFilters({ ...filters, qualification: 'All' });
                    }}
                    className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/15 border border-amber-500/40 hover:border-amber-400 text-left transition flex items-center gap-3 cursor-pointer group shadow"
                  >
                    <span className="text-3xl shrink-0 group-hover:scale-110 transition-transform">🎯</span>
                    <div>
                      <span className="text-xs font-black text-amber-300 block leading-tight">
                        {t('Govt & Train Jobs', 'सरकारी नौकरियां')}
                      </span>
                      <span className="text-[10px] text-slate-300 mt-0.5 block">
                        {t('58,000+ Active Openings', '58,000+ सत्यापित पद')}
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('schemes')}
                    className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/15 border border-emerald-500/40 hover:border-emerald-400 text-left transition flex items-center gap-3 cursor-pointer group shadow"
                  >
                    <span className="text-3xl shrink-0 group-hover:scale-110 transition-transform">🎁</span>
                    <div>
                      <span className="text-xs font-black text-emerald-300 block leading-tight">
                        {t('Sarkari Yojanas', 'सरकारी योजनाएं')}
                      </span>
                      <span className="text-[10px] text-slate-300 mt-0.5 block">
                        {t('Direct Financial Benefits', 'सीधे बैंक खाते में लाभ')}
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('news')}
                    className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/15 border border-blue-500/40 hover:border-blue-400 text-left transition flex items-center gap-3 cursor-pointer group shadow"
                  >
                    <span className="text-3xl shrink-0 group-hover:scale-110 transition-transform">📰</span>
                    <div>
                      <span className="text-xs font-black text-blue-300 block leading-tight">
                        {t('Voice Audio News', 'बोलते समाचार')}
                      </span>
                      <span className="text-[10px] text-slate-300 mt-0.5 block">
                        {t('Verified Hindi & English', 'सत्यापित खबरें आवाज में')}
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Citizen Specialized Hubs: Fast Taps for Everyone */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => setActiveTab('students')}
                  className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-indigo-400 text-left transition cursor-pointer"
                >
                  <span className="text-xl block mb-1">🎒</span>
                  <span className="text-xs font-bold text-slate-100 block truncate">
                    {t('Student Hub', 'छात्र मंच')}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {t('Daily GK & Books', 'क्विज व पुस्तकें')}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('women')}
                  className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-pink-400 text-left transition cursor-pointer"
                >
                  <span className="text-xl block mb-1">🌸</span>
                  <span className="text-xs font-bold text-slate-100 block truncate">
                    {t('Women Hub', 'महिला मंच')}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {t('Lakhpati & 181', 'लखपति दीदी व 181')}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('swasth')}
                  className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-teal-400 text-left transition cursor-pointer"
                >
                  <span className="text-xl block mb-1">🧘</span>
                  <span className="text-xs font-bold text-slate-100 block truncate">
                    {t('Swasth & Home', 'स्वास्थ्य-घर')}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {t('10-Min Yoga & Water', 'व्यायाम व दिनचर्या')}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('private')}
                  className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-amber-400 text-left transition cursor-pointer"
                >
                  <span className="text-xl block mb-1">💼</span>
                  <span className="text-xs font-bold text-slate-100 block truncate">
                    {t('Private Jobs', 'प्राइवेट नौकरी')}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {t('PM Internship ₹5k', 'पीएम इंटर्नशिप ₹5k')}
                  </span>
                </button>
              </div>

              {/* Universal Accessibility Charter */}
              <div className="mt-3.5 p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-2.5">
                <span className="text-xl shrink-0">🤝</span>
                <p className="text-[11px] text-slate-400 leading-snug">
                  <strong className="text-amber-300 font-bold">{t('Equal for all citizens: ', 'सभी नागरिकों के लिए समान: ')}</strong>
                  {t(
                    'No logins required to read, no AI, no ads, open and accessible to all.',
                    'बिना किसी रुकावट, बिना AI और विज्ञापनों के सभी के लिए खुली व निशुल्क सेवा।'
                  )}
                </p>
              </div>
            </div>

            {/* Trending Govt Postings */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm sm:text-base font-bold text-slate-100">
                    {t('Top Government Postings (Closing Soon)', 'प्रमुख सरकारी नौकरियां (अंतिम तिथियां)')}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('govt')}
                  className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>{t('View All', 'सभी देखें')}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {GOVT_POSTINGS.slice(0, 4).map((posting) => (
                  <GovtPostingCard
                    key={posting.id}
                    posting={posting}
                    onClick={() => setSelectedGovtPosting(posting)}
                  />
                ))}
              </div>
            </div>

            {/* Breaking Bilingual News with Audio Spotlight */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Newspaper className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm sm:text-base font-bold text-slate-100">
                    {t('Verified Bilingual News (Listen & Read)', 'सत्यापित समाचार (पढ़ें व सुनें)')}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('news')}
                  className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>{t('View All News', 'सभी समाचार')}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {BILINGUAL_NEWS.slice(0, 2).map((article) => (
                  <BilingualNewsCard
                    key={article.id}
                    article={article}
                    onOpen={() => setSelectedNewsArticle(article)}
                  />
                ))}
              </div>
            </div>

            {/* Direct Citizen Portals Directory */}
            <CitizenPortalsSection />
          </div>
        )}

        {/* ===================== TAB 2: GOVT POSTINGS (सरकारी नौकरी) ===================== */}
        {activeTab === 'govt' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-100 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span>{t('Government Openings & Sarkari Naukri', 'सरकारी नौकरियां एवं भर्तियां')}</span>
                </h2>
                <p className="text-xs text-slate-400">
                  {t(
                    `Showing ${filteredGovtPostings.length} verified postings with syllabus & age calculators`,
                    `${filteredGovtPostings.length} सत्यापित सरकारी भर्तियां उपलब्ध`
                  )}
                </p>
              </div>
            </div>

            {filteredGovtPostings.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <Award className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                <p className="text-sm font-semibold">{t('No government postings match your filters.', 'आपके फिल्टर के अनुसार कोई भर्ती नहीं मिली।')}</p>
                <button
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                  className="mt-3 px-4 py-2 rounded-xl bg-slate-800 text-amber-400 text-xs font-bold"
                >
                  {t('Reset Filters', 'फिल्टर रीसेट करें')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {filteredGovtPostings.map((posting) => (
                  <GovtPostingCard
                    key={posting.id}
                    posting={posting}
                    onClick={() => setSelectedGovtPosting(posting)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 3: BILINGUAL NEWS (समाचार) ===================== */}
        {activeTab === 'news' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-100 flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-emerald-400" />
                  <span>{t('Bilingual Citizen News & Policy Gazettes', 'द्विभाषी समाचार एवं सरकारी नीतियां')}</span>
                </h2>
                <p className="text-xs text-slate-400">
                  {t('Instant Hindi & English text with voice narration', 'स्पष्ट हिंदी व अंग्रेजी टेक्स्ट एवं ऑडियो वाचन')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredNews.map((article) => (
                <BilingualNewsCard
                  key={article.id}
                  article={article}
                  onOpen={() => setSelectedNewsArticle(article)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 4: PRIVATE JOBS & INTERNSHIPS ===================== */}
        {activeTab === 'private' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-100 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                  <span>{t('Private Openings & Apprenticeships', 'प्राइवेट नौकरियां व राष्ट्रीय शिक्षुता')}</span>
                </h2>
                <p className="text-xs text-slate-400">
                  {t('Top corporate companies, freshers openings, and work-from-home roles', 'शीर्ष कंपनियां, फ्रेशर्स व घर से काम करने के अवसर')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredJobs.map((job) => (
                <JobPostingCard
                  key={job.id}
                  job={job}
                  onClick={() => setSelectedJobPosting(job)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 5: SCHEMES & PORTALS (योजनाएं) ===================== */}
        {activeTab === 'schemes' && (
          <div className="space-y-5">
            {/* Yojana Eligibility Quiz Banner */}
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-slate-900 border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] uppercase">
                  {t('Eligibility Wizard', 'पात्रता कैलकुलेटर')}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-100 mt-1.5">
                  {t('Find Schemes You Qualify For in 4 Quick Steps', '4 सरल प्रश्नों में जानें अपने लिए पात्र योजनाएं')}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  {t('Calculate exact cash transfers, subsidized loans and insurance benefits.', 'सीधे बैंक ट्रांसफर, रियायती ऋण और स्वास्थ्य सुरक्षा का संपूर्ण विवरण।')}
                </p>
              </div>
              <button
                onClick={() => setShowYojanaCalculator(true)}
                className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow cursor-pointer whitespace-nowrap"
              >
                {t('Launch Calculator', 'कैलकुलेटर शुरू करें')}
              </button>
            </div>

            {/* Sarkari Yojana List */}
            <div className="space-y-3">
              <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                <Landmark className="w-4 h-4 text-emerald-400" />
                <span>{t('Major Welfare Schemes (Direct Benefit Transfers)', 'प्रमुख सरकारी कल्याणकारी योजनाएं')}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {filteredSchemes.map((scheme) => (
                  <GovtSchemeCard
                    key={scheme.id}
                    scheme={scheme}
                    onClick={() => setSelectedGovtScheme(scheme)}
                  />
                ))}
              </div>
            </div>

            {/* Portals Section */}
            <CitizenPortalsSection />
          </div>
        )}

        {/* ===================== TAB 6: HELP & FAQ (सरल सवाल-जवाब) ===================== */}
        {activeTab === 'faq' && <HelpAndFAQSection />}

        {/* ===================== TAB 7: STUDENTS LEARNING HUB (छात्र मंच) ===================== */}
        {activeTab === 'students' && <StudentLearningHub />}

        {/* ===================== TAB 8: WOMEN HUB (महिला सशक्तिकरण) ===================== */}
        {activeTab === 'women' && <WomenHub />}

        {/* ===================== TAB 9: SWASTH & HOME HUB (स्वास्थ्य व घर-परिवार) ===================== */}
        {activeTab === 'swasth' && <SwasthAndHomeHub />}
      </main>

      {/* Detail Modals */}
      <GovtPostingModal
        posting={selectedGovtPosting}
        onClose={() => setSelectedGovtPosting(null)}
      />

      <NewsReaderModal
        article={selectedNewsArticle}
        onClose={() => setSelectedNewsArticle(null)}
      />

      <JobPostingModal
        job={selectedJobPosting}
        onClose={() => setSelectedJobPosting(null)}
      />

      <GovtSchemeModal
        scheme={selectedGovtScheme}
        onClose={() => setSelectedGovtScheme(null)}
      />

      <YojanaCalculatorModal
        isOpen={showYojanaCalculator}
        onClose={() => setShowYojanaCalculator(false)}
        onSelectScheme={(scheme) => setSelectedGovtScheme(scheme)}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <UserProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onOpenSavedTab={() => setShowBookmarksView(true)}
      />

      <NotificationCenterModal
        isOpen={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
        onSelectItem={handleOpenNotificationItem}
      />

      <StoreLaunchModal
        isOpen={showStoreLaunchModal}
        onClose={() => setShowStoreLaunchModal(false)}
      />

      {showBioDataModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-slate-900 rounded-3xl border border-slate-700 p-4 sm:p-6 my-auto max-h-[95vh] overflow-y-auto no-scrollbar shadow-2xl">
            <BioDataBuilder onClose={() => setShowBioDataModal(false)} />
          </div>
        </div>
      )}

      {/* Bottom Navigation Dock */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <NotificationProvider>
          <MainAppContent />
        </NotificationProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
