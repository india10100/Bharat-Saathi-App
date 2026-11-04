import React, { useState } from 'react';
import { useNotifications, AppNotification } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';
import { X, Bell, Check, Trash2, ArrowRight, Award, Briefcase, Newspaper, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectItem: (item: { type: string; id: string }) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  onSelectItem,
}) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification, activeToast, dismissToast } = useNotifications();
  const { lang, t } = useLanguage();
  const [filterType, setFilterType] = useState<string>('all');

  const filteredNotifications = notifications.filter((notif) => {
    if (filterType === 'all') return true;
    if (filterType === 'unread') return !notif.read;
    return notif.type === filterType;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'govt':
        return <Award className="w-4 h-4 text-amber-400" />;
      case 'job':
        return <Briefcase className="w-4 h-4 text-blue-400" />;
      case 'news':
        return <Newspaper className="w-4 h-4 text-emerald-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <>
      {/* In-app Instant Notification Toast Banner */}
      <AnimatePresence>
        {activeToast && (
          <motion.div
            initial={{ opacity: 0, y: -60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -60, scale: 0.95 }}
            className="fixed top-3 left-3 right-3 sm:left-auto sm:right-6 sm:w-96 z-50 p-3.5 rounded-2xl bg-slate-900/95 border border-amber-500/50 shadow-2xl backdrop-blur-md text-slate-100 flex items-start gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
              {getIcon(activeToast.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  {t('New Alert', 'नई सूचना')}
                </span>
                <span className="text-[10px] text-slate-400">{activeToast.timestamp}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-100 truncate mt-0.5">
                {lang === 'hi' ? activeToast.titleHi : activeToast.titleEn}
              </h4>
              <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5">
                {lang === 'hi' ? activeToast.bodyHi : activeToast.bodyEn}
              </p>
              {activeToast.targetId && (
                <button
                  onClick={() => {
                    markAsRead(activeToast.id);
                    dismissToast();
                    onSelectItem({ type: activeToast.type, id: activeToast.targetId! });
                  }}
                  className="mt-1.5 text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>{t('View Posting', 'विवरण देखें')}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            <button
              onClick={dismissToast}
              className="p-1 rounded-full text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Notification Drawer / Center Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 120 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 120 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-2xl text-slate-100 max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                      <span>{t('Notification Center', 'सूचना केंद्र')}</span>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px]">
                          {unreadCount} {t('New', 'नई')}
                        </span>
                      )}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {t('Filtered by your career preferences', 'आपकी प्राथमिकताओं के आधार पर')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-amber-400 text-xs font-semibold border border-slate-700 transition"
                      title={t('Mark all as read', 'सभी पढ़ी हुई मार्क करें')}
                    >
                      {t('Mark Read', 'पढ़ा')}
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 my-3 overflow-x-auto no-scrollbar py-0.5">
                {[
                  { id: 'all', labelEn: 'All', labelHi: 'सभी' },
                  { id: 'unread', labelEn: 'Unread', labelHi: 'अपठित' },
                  { id: 'govt', labelEn: 'Govt Postings', labelHi: 'सरकारी' },
                  { id: 'job', labelEn: 'Private Jobs', labelHi: 'प्राइवेट' },
                  { id: 'news', labelEn: 'Breaking News', labelHi: 'समाचार' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFilterType(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                      filterType === tab.id
                        ? 'bg-amber-500 text-slate-950 shadow'
                        : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t(tab.labelEn, tab.labelHi)}
                  </button>
                ))}
              </div>

              {/* Notification Items List */}
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pr-0.5">
                {filteredNotifications.length === 0 ? (
                  <div className="py-12 text-center text-slate-400">
                    <Bell className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                    <p className="text-xs font-semibold">
                      {t('No notifications found in this filter.', 'इस श्रेणी में कोई सूचना नहीं है।')}
                    </p>
                  </div>
                ) : (
                  filteredNotifications.map((notif) => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3.5 rounded-2xl border transition flex items-start gap-3 ${
                        !notif.read
                          ? 'bg-slate-850/90 border-amber-500/40 shadow-sm'
                          : 'bg-slate-800/40 border-slate-700/50 opacity-80'
                      }`}
                    >
                      <div className="p-2 rounded-xl bg-slate-800 border border-slate-700/80 shrink-0">
                        {getIcon(notif.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[11px] font-bold text-slate-100 flex items-center gap-1.5 truncate">
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 inline-block" />
                            )}
                            <span className="truncate">
                              {lang === 'hi' ? notif.titleHi : notif.titleEn}
                            </span>
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {notif.timestamp}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          {lang === 'hi' ? notif.bodyHi : notif.bodyEn}
                        </p>

                        <div className="mt-2 flex items-center justify-between pt-1">
                          {notif.targetId ? (
                            <button
                              onClick={() => {
                                markAsRead(notif.id);
                                onClose();
                                onSelectItem({ type: notif.type, id: notif.targetId! });
                              }}
                              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                            >
                              <span>{t('Open Details', 'विवरण खोलें')}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <div />
                          )}

                          <button
                            onClick={() => clearNotification(notif.id)}
                            className="p-1 rounded-lg text-slate-500 hover:text-rose-400 transition"
                            title={t('Delete notification', 'हटाएं')}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
