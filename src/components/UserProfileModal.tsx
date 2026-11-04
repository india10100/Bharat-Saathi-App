import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';
import { X, User, Bell, LogOut, Shield, MapPin, Check, Bookmark, Sparkles, Send, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { STATES_LIST } from '../data/mockData';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSavedTab: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, onOpenSavedTab }) => {
  const { user, logout, notificationPreferences, updateNotificationPreferences, updateProfile } = useAuth();
  const { t, savedItems } = useLanguage();
  const { simulateTriggerByCategory } = useNotifications();

  const [activeTab, setActiveTab] = useState<'profile' | 'preferences'>('profile');
  const [editedState, setEditedState] = useState(user?.state || 'All India (अखिल भारतीय)');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen || !user) return null;

  const handleSaveState = () => {
    updateProfile({ state: editedState });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-2xl text-slate-100 max-h-[92vh] overflow-y-auto no-scrollbar"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${user.avatarColor} flex items-center justify-center text-white font-extrabold text-base shadow-md`}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">{user.name}</h3>
              <p className="text-[11px] text-amber-400 font-medium">{user.email}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-800/80 my-3.5 border border-slate-700/60">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              activeTab === 'profile' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('Citizen Profile', 'नागरिक प्रोफाइल')}
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'preferences' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{t('Alert Preferences', 'अलर्ट प्राथमिकताएं')}</span>
          </button>
        </div>

        {/* TAB 1: PROFILE DETAILS */}
        {activeTab === 'profile' && (
          <div className="space-y-3.5">
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2.5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700/40">
                <span className="text-slate-400">{t('Category / Reservation', 'आरक्षण श्रेणी')}</span>
                <span className="font-bold text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-lg border border-amber-500/30">
                  {user.category}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-700/40">
                <span className="text-slate-400">{t('Highest Qualification', 'उच्चतम योग्यता')}</span>
                <span className="font-bold text-slate-200">{user.highestQualification}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">{t('Saved Bookmarks', 'सहेजे गए पद व योजनाएं')}</span>
                <button
                  onClick={() => {
                    onClose();
                    onOpenSavedTab();
                  }}
                  className="font-bold text-amber-400 hover:underline flex items-center gap-1"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{savedItems.length} {t('Items', 'आइटम')}</span>
                </button>
              </div>
            </div>

            {/* Editable State */}
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <label className="text-[11px] font-bold text-slate-300 mb-1.5 block flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('Default Region / State for Job Alerts', 'जॉब अलर्ट हेतु गृह राज्य')}</span>
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={editedState}
                  onChange={(e) => setEditedState(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-850 border border-slate-700 text-xs font-semibold text-slate-100 focus:outline-none focus:border-amber-400"
                >
                  {STATES_LIST.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleSaveState}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow cursor-pointer"
                >
                  {t('Save', 'सहेजें')}
                </button>
              </div>
              {saveSuccess && (
                <p className="text-[11px] text-emerald-400 font-bold mt-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t('Saved successfully!', 'सफलतापूर्वक सहेजा गया!')}</span>
                </p>
              )}
            </div>

            {/* Logout button */}
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('Log Out of Account', 'खाते से लॉग आउट करें')}</span>
            </button>
          </div>
        )}

        {/* TAB 2: NOTIFICATION PREFERENCES */}
        {activeTab === 'preferences' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-300">
              {t(
                'Customize which notifications trigger on your device based on your career interests and eligibility.',
                'अपनी रुचि के अनुसार चुनें कि आपको किन-किन भर्तियों, योजनाओं और खबरों के नोटिफिकेशन प्राप्त हों।'
              )}
            </p>

            {/* Toggles list */}
            <div className="space-y-2 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <label className="flex items-center justify-between cursor-pointer py-1">
                <div>
                  <span className="text-xs font-bold text-slate-100 block">
                    {t('Government Postings & Openings', 'सरकारी नौकरी एवं भर्तियां')}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {t('SSC, Railways, Defense, Bank PO, State PSCs', 'एसएससी, रेलवे, सेना, बैंक, राज्य लोक सेवा आयोग')}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notificationPreferences.govtPostings}
                  onChange={(e) => updateNotificationPreferences({ govtPostings: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-0 cursor-pointer accent-amber-500"
                />
              </label>

              <div className="h-px bg-slate-700/40" />

              <label className="flex items-center justify-between cursor-pointer py-1">
                <div>
                  <span className="text-xs font-bold text-slate-100 block">
                    {t('Private Jobs & PM Internship', 'प्राइवेट नौकरियां व पीएम इंटर्नशिप')}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {t('Top 500 corporate openings & freshers stipend', 'शीर्ष कंपनियां, फ्रेशर्स व स्टाइपेंड अवसर')}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notificationPreferences.privateJobs}
                  onChange={(e) => updateNotificationPreferences({ privateJobs: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-0 cursor-pointer accent-amber-500"
                />
              </label>

              <div className="h-px bg-slate-700/40" />

              <label className="flex items-center justify-between cursor-pointer py-1">
                <div>
                  <span className="text-xs font-bold text-slate-100 block">
                    {t('Breaking News & Policy Updates', 'ताजा समाचार एवं नीतियां')}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {t('Verified PIB fact checks in Hindi & English', 'सत्यापित हिंदी एवं अंग्रेजी खबरें')}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notificationPreferences.breakingNews}
                  onChange={(e) => updateNotificationPreferences({ breakingNews: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-0 cursor-pointer accent-amber-500"
                />
              </label>

              <div className="h-px bg-slate-700/40" />

              <label className="flex items-center justify-between cursor-pointer py-1">
                <div>
                  <span className="text-xs font-bold text-slate-100 block">
                    {t('Admit Cards & Result Announcements', 'प्रवेश पत्र एवं परिणाम अलर्ट')}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {t('Never miss an exam date or answer key link', 'परीक्षा तिथि या उत्तर कुंजी कभी न छूटे')}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notificationPreferences.admitCardsAndResults}
                  onChange={(e) => updateNotificationPreferences({ admitCardsAndResults: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-0 cursor-pointer accent-amber-500"
                />
              </label>

              <div className="h-px bg-slate-700/40" />

              <label className="flex items-center justify-between cursor-pointer py-1">
                <div>
                  <span className="text-xs font-bold text-slate-100 block">
                    {t('Sarkari Yojana & Citizen Deadlines', 'सरकारी योजनाएं व आवेदन समय-सीमा')}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {t('PM-Kisan, Ayushman Bharat, PMAY updates', 'पीएम किसान, आयुष्मान भारत, आवास योजना')}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notificationPreferences.welfareYojana}
                  onChange={(e) => updateNotificationPreferences({ welfareYojana: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-0 cursor-pointer accent-amber-500"
                />
              </label>
            </div>

            {/* Test Notification Simulator */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25">
              <span className="text-[11px] font-bold text-amber-300 block mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('Simulate Live Notification Alerts (Test Now)', 'लाइव नोटिफिकेशन टेस्ट करें')}</span>
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => simulateTriggerByCategory('govt')}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-[11px] font-semibold border border-slate-700 flex items-center justify-center gap-1"
                >
                  <Send className="w-3 h-3 text-amber-400" />
                  <span>+ {t('Govt Job Alert', 'सरकारी नौकरी')}</span>
                </button>
                <button
                  onClick={() => simulateTriggerByCategory('news')}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-[11px] font-semibold border border-slate-700 flex items-center justify-center gap-1"
                >
                  <Send className="w-3 h-3 text-amber-400" />
                  <span>+ {t('Breaking News', 'ताजा समाचार')}</span>
                </button>
                <button
                  onClick={() => simulateTriggerByCategory('job')}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-[11px] font-semibold border border-slate-700 flex items-center justify-center gap-1"
                >
                  <Send className="w-3 h-3 text-amber-400" />
                  <span>+ {t('Private Job', 'प्राइवेट जॉब')}</span>
                </button>
                <button
                  onClick={() => simulateTriggerByCategory('admitCard')}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-[11px] font-semibold border border-slate-700 flex items-center justify-center gap-1"
                >
                  <Send className="w-3 h-3 text-amber-400" />
                  <span>+ {t('Admit Card', 'एडमिट कार्ड')}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
