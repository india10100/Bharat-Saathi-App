import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PWAInstallButton } from './PWAInstallButton';
import { Bell, MapPin, Search, X, Check, Volume2 } from 'lucide-react';
import { STATES_LIST } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  onOpenStoreLaunch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenStoreLaunch }) => {
  const { lang, toggleLang, t, selectedState, setSelectedState, searchQuery, setSearchQuery } = useLanguage();
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  const notifications = [
    {
      id: 'notif-1',
      emoji: '🚂',
      titleEn: 'Train Jobs: Railway RRB 11,558 Posts Active!',
      titleHi: 'रेलवे में 11,558 नई नौकरियां: 10वीं व 12वीं पास छात्र भी पात्र!',
      time: '1h ago',
    },
    {
      id: 'notif-2',
      emoji: '🎒',
      titleEn: 'School Scholarship: ₹12,000/yr for Class 9-12 Students',
      titleHi: 'स्कूली छात्रवृत्ति: 9वीं से 12वीं के बच्चों को ₹12,000 सालाना!',
      time: '3h ago',
    },
    {
      id: 'notif-3',
      emoji: '🏆',
      titleEn: 'Khelo India: Sports Talent Grant of ₹5 Lakh',
      titleHi: 'खेलो इंडिया: युवा खिलाड़ियों को ₹5 लाख का खेल अनुदान!',
      time: 'Yesterday',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/98 backdrop-blur-md border-b border-slate-800 shadow-md">
      {/* India Tiranga Top Ribbon */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-500" />

      <div className="max-w-4xl mx-auto px-3.5 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-2">
          {/* Logo Brand with friendly emblem */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 p-1 flex items-center justify-center shadow-lg shadow-orange-500/20 text-slate-950 font-black text-lg">
              🇮🇳
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-1">
                  <span>भारत साथी</span>
                  <span className="text-[11px] font-black text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-full">
                    Bharat Saathi
                  </span>
                </h1>
              </div>
              <p className="text-[11px] text-amber-400 font-semibold leading-none mt-0.5">
                {t('Easy Jobs • School Scholarships • Simple News', 'सरल नौकरियां • छात्रवृत्ति • आसान खबरें')}
              </p>
            </div>
          </div>

          {/* Action buttons on right */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Install PWA Button */}
            <PWAInstallButton variant="pill" />

            {/* Launch to Stores Button */}
            {onOpenStoreLaunch && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                onClick={onOpenStoreLaunch}
                className="hidden xs:flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-black hover:bg-amber-500/30 transition cursor-pointer"
                title={t('Play Store & iOS Launch Hub', 'प्लेस्टोर व ऐप स्टोर लॉन्च हब')}
              >
                <span>🚀</span>
                <span className="hidden sm:inline">{t('Store Launch', 'स्टोर लॉन्च')}</span>
              </motion.button>
            )}

            {/* Big Friendly Bilingual Switch Toggle */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black shadow-md cursor-pointer transition"
              title={t('Switch to Hindi / English', 'हिंदी / अंग्रेजी भाषा बदलें')}
            >
              <span>{lang === 'hi' ? '🇮🇳 हिंदी' : '🇬🇧 English'}</span>
              <span className="text-[10px] bg-white/20 px-1 py-0.5 rounded font-bold">
                {lang === 'hi' ? 'ENG' : 'हिं'}
              </span>
            </motion.button>

            {/* Notifications Bell */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setShowNotificationsModal(true)}
              className="relative p-2 rounded-2xl bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-750 transition cursor-pointer"
              aria-label={t('Notifications & Alerts', 'सूचनाएं')}
            >
              <Bell className="w-4 h-4 text-amber-400" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                3
              </span>
            </motion.button>
          </div>
        </div>

        {/* Big Kid-Friendly Search Bar + State Filter */}
        <div className="mt-2.5 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t(
                'Search: 🚂 Railway, 👮 Police, 🎒 School, 💻 Jobs...',
                'सर्च करें: 🚂 रेलवे, 👮 पुलिस, 🎒 छात्रवृत्ति, 💻 नौकरी...'
              )}
              className="w-full pl-10 pr-8 py-2.5 rounded-2xl bg-slate-800/90 border border-slate-700 text-slate-100 placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-700 text-slate-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowStateDropdown(true)}
            className="flex items-center gap-1 px-3 py-2.5 rounded-2xl bg-slate-800 border border-slate-700 hover:border-amber-400 text-slate-200 text-xs font-bold whitespace-nowrap transition cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="max-w-[85px] sm:max-w-[120px] truncate">
              {selectedState.split(' ')[0]}
            </span>
          </button>
        </div>
      </div>

      {/* State Filter Modal */}
      <AnimatePresence>
        {showStateDropdown && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-2xl text-slate-100 max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <h3 className="font-bold text-sm text-slate-100">
                    {t('Choose Your State', 'अपना राज्य चुनें')}
                  </h3>
                </div>
                <button
                  onClick={() => setShowStateDropdown(false)}
                  className="p-1 rounded-full hover:bg-slate-800 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="my-3 overflow-y-auto no-scrollbar flex-1 space-y-1.5 pr-1">
                {STATES_LIST.map((st) => {
                  const isSelected = selectedState === st;
                  return (
                    <button
                      key={st}
                      onClick={() => {
                        setSelectedState(st);
                        setShowStateDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold text-left transition ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 font-black shadow'
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <span>{st}</span>
                      {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setShowStateDropdown(false)}
                className="w-full py-2.5 rounded-2xl bg-slate-800 text-slate-200 text-xs font-bold transition"
              >
                {t('Done', 'पूर्ण')}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Notifications Drawer Modal */}
      <AnimatePresence>
        {showNotificationsModal && (
          <div className="fixed inset-0 z-50 flex items-start justify-end p-3 sm:p-4 bg-black/65 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 80 }}
              className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-4 shadow-2xl text-slate-100 mt-12 sm:mt-8"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🔔</span>
                  <h3 className="text-sm font-black text-slate-100">
                    {t('Simple Alerts', 'सरल सूचनाएं')}
                  </h3>
                </div>
                <button
                  onClick={() => setShowNotificationsModal(false)}
                  className="p-1 rounded-full hover:bg-slate-800 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-3 space-y-2">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-start gap-2.5"
                  >
                    <span className="text-2xl shrink-0 mt-0.5">{notif.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-100 leading-snug">
                        {lang === 'hi' ? notif.titleHi : notif.titleEn}
                      </p>
                      <span className="text-[10px] text-amber-400 mt-1 block font-semibold">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowNotificationsModal(false)}
                className="mt-3 w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold"
              >
                {t('Close', 'बंद करें')}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};
