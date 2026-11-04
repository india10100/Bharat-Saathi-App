import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';

export type NavTab =
  | 'home'
  | 'govt'
  | 'students'
  | 'women'
  | 'swasth'
  | 'schemes'
  | 'news'
  | 'private'
  | 'faq';

interface BottomNavProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useLanguage();
  const activeTabRef = React.useRef<HTMLButtonElement | null>(null);

  // Auto-center the active tab (especially on mobile viewport)
  React.useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [activeTab]);

  // Arranged so: Normal tabs on sides (left: FAQ, Swasth; right: Students, Women)
  // and Most Important Core tabs in the CENTRE (News, Govt Jobs, Home [Dead Center], Yojanas, Private Jobs)
  const tabs: {
    id: NavTab;
    labelEn: string;
    labelHi: string;
    emoji: string;
    isPrimary?: boolean;
    isCenter?: boolean;
    badge?: string;
  }[] = [
    // --- SIDE (LEFT: Normal / Support & Lifestyle Tabs) ---
    {
      id: 'faq',
      labelEn: 'Help & FAQ',
      labelHi: 'सहायता',
      emoji: '❓',
    },
    {
      id: 'swasth',
      labelEn: 'Swasth & Home',
      labelHi: 'स्वास्थ्य-घर',
      emoji: '🧘',
    },

    // --- CENTRE (MOST IMPORTANT CORE PILLARS OF BHARAT SAATHI) ---
    {
      id: 'news',
      labelEn: 'News',
      labelHi: 'समाचार',
      emoji: '📰',
      isPrimary: true,
    },
    {
      id: 'govt',
      labelEn: 'Govt Jobs',
      labelHi: 'सरकारी',
      emoji: '🎯',
      isPrimary: true,
      badge: 'Core',
    },
    {
      id: 'home',
      labelEn: 'Home',
      labelHi: 'होम',
      emoji: '🏠',
      isPrimary: true,
      isCenter: true,
    },
    {
      id: 'schemes',
      labelEn: 'Yojanas',
      labelHi: 'योजनाएं',
      emoji: '🎁',
      isPrimary: true,
      badge: 'Core',
    },
    {
      id: 'private',
      labelEn: 'Private Jobs',
      labelHi: 'प्राइवेट',
      emoji: '💼',
      isPrimary: true,
    },

    // --- SIDE (RIGHT: Normal / Specialized Community Hubs) ---
    {
      id: 'students',
      labelEn: 'Students',
      labelHi: 'छात्र मंच',
      emoji: '🎒',
    },
    {
      id: 'women',
      labelEn: 'Women',
      labelHi: 'महिला मंच',
      emoji: '🌸',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 pb-safe shadow-[0_-10px_25px_rgba(0,0,0,0.5)]">
      <div className="max-w-4xl mx-auto overflow-x-auto no-scrollbar py-1 px-1.5 flex items-center justify-between sm:justify-around gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              ref={isActive ? activeTabRef : null}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-2 min-w-[58px] sm:min-w-[68px] rounded-2xl transition cursor-pointer shrink-0 select-none ${
                tab.isCenter ? 'sm:min-w-[76px]' : ''
              }`}
              title={
                tab.isCenter
                  ? t('Main Home Hub', 'मुख्य केंद्र')
                  : tab.isPrimary
                  ? t(`Core Service: ${tab.labelEn}`, `मुख्य सेवा: ${tab.labelHi}`)
                  : t(tab.labelEn, tab.labelHi)
              }
            >
              {/* Active Tab Highlight Indicator */}
              {isActive && (
                <motion.div
                  layoutId="kidBottomNavIndicator"
                  className={`absolute inset-0 rounded-2xl border ${
                    tab.isCenter
                      ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/20'
                      : tab.isPrimary
                      ? 'bg-amber-500/15 border-amber-500/40'
                      : 'bg-slate-800/80 border-slate-600'
                  }`}
                  transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                />
              )}

              {/* Center Elevated Master Button Styling */}
              {tab.isCenter ? (
                <div
                  className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-transform shadow ${
                    isActive
                      ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 scale-110 -translate-y-0.5'
                      : 'bg-slate-800 border border-amber-500/40 text-amber-300 hover:scale-105'
                  }`}
                >
                  <span className="text-base">{tab.emoji}</span>
                  {/* Subtle pulsing indicator ring for the central home */}
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 animate-ping opacity-60" />
                </div>
              ) : (
                <span
                  className={`text-lg transition-transform ${
                    isActive ? 'scale-115' : tab.isPrimary ? 'opacity-90' : 'opacity-70'
                  }`}
                >
                  {tab.emoji}
                </span>
              )}

              {/* Label */}
              <span
                className={`relative z-10 text-[10px] font-bold mt-0.5 tracking-tight text-center whitespace-nowrap leading-tight ${
                  isActive
                    ? 'text-amber-400 font-black'
                    : tab.isPrimary
                    ? 'text-slate-200'
                    : 'text-slate-400'
                }`}
              >
                {t(tab.labelEn, tab.labelHi)}
              </span>

              {/* Tiny Dot Indicator */}
              {isActive && (
                <motion.span
                  layoutId="bottomDotKid"
                  className={`w-1.5 h-1.5 rounded-full mt-0.5 shadow-sm ${
                    tab.isCenter
                      ? 'bg-amber-300 shadow-amber-300/80'
                      : 'bg-amber-400 shadow-amber-400/80'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
