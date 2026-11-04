import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useLanguage } from '../context/LanguageContext';
import { WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-14 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/90 text-slate-950 text-xs font-bold shadow-lg backdrop-blur-sm"
        >
          <WifiOff className="w-3.5 h-3.5 animate-pulse" />
          <span>{t('Offline Mode — Showing Saved & Cached Info', 'ऑफलाइन मोड — सहेजी गई जानकारी उपलब्ध')}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
