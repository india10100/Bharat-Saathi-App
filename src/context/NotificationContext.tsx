import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';

export interface AppNotification {
  id: string;
  type: 'govt' | 'job' | 'news' | 'scheme' | 'admitCard';
  titleEn: string;
  titleHi: string;
  bodyEn: string;
  bodyHi: string;
  timestamp: string;
  read: boolean;
  priority: 'high' | 'normal' | 'urgent';
  targetId?: string; // e.g. 'ssc-cgl-2026'
  linkUrl?: string;
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  triggerNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  simulateTriggerByCategory: (category: 'govt' | 'job' | 'news' | 'admitCard') => void;
  activeToast: AppNotification | null;
  dismissToast: () => void;
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n-1',
    type: 'govt',
    titleEn: 'SSC CGL 2026: 17,727 Vacancies Active',
    titleHi: 'एसएससी सीजीएल 2026: 17,727 पदों पर आवेदन जारी',
    bodyEn: 'Staff Selection Commission is inviting online applications for Group B & C Inspectors & Assistants.',
    bodyHi: 'कर्मचारी चयन आयोग द्वारा ग्रुप बी एवं सी इंस्पेक्टर एवं सहायकों हेतु ऑनलाइन आवेदन आमंत्रित।',
    timestamp: '15 mins ago',
    read: false,
    priority: 'high',
    targetId: 'ssc-cgl-2026',
  },
  {
    id: 'n-2',
    type: 'job',
    titleEn: 'PM Internship Phase-2 Window Open',
    titleHi: 'पीएम इंटर्नशिप चरण-2 पंजीकरण शुरू',
    bodyEn: 'Top 500 corporations offering 1.25 Lakh paid internships with ₹5,000 monthly stipend.',
    bodyHi: 'शीर्ष 500 कंपनियों में ₹5,000 मासिक वजीफे के साथ 1.25 लाख पेड इंटर्नशिप स्लॉट।',
    timestamp: '1 hour ago',
    read: false,
    priority: 'urgent',
    targetId: 'pm-internship-tata-2026',
  },
  {
    id: 'n-3',
    type: 'news',
    titleEn: 'Cabinet Expands PM Surya Ghar Solar Subsidy',
    titleHi: 'मंत्रिमंडल ने पीएम सूर्य घर योजना बढ़ाई: ₹78,000 सब्सिडी',
    bodyEn: 'Direct transfer of up to ₹78,000 for rooftop solar with 300 free monthly electricity units.',
    bodyHi: '300 यूनिट मुफ्त बिजली के साथ रूफटॉप सोलर पर ₹78,000 तक सीधी बैंक सब्सिडी।',
    timestamp: '3 hours ago',
    read: false,
    priority: 'normal',
    targetId: 'news-pm-surya-ghar-2026',
  },
  {
    id: 'n-4',
    type: 'admitCard',
    titleEn: 'SBI PO Preliminary Admit Card Released',
    titleHi: 'भारतीय स्टेट बैंक (SBI) पीओ एडमिट कार्ड जारी',
    bodyEn: 'Download preliminary hall ticket with exam slot & venue details.',
    bodyHi: 'रोल नंबर व परीक्षा केंद्र विवरण के साथ प्रारंभिक प्रवेश पत्र डाउनलोड करें।',
    timestamp: 'Yesterday',
    read: true,
    priority: 'high',
    targetId: 'sbi-po-clerk-2026',
  },
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { notificationPreferences } = useAuth();
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem('bharat_saathi_notifs');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [activeToast, setActiveToast] = useState<AppNotification | null>(null);

  useEffect(() => {
    localStorage.setItem('bharat_saathi_notifs', JSON.stringify(notifications));
  }, [notifications]);

  // Audio chime using Web Audio API
  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch {
      // Audio not permitted or unsupported
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const dismissToast = () => {
    setActiveToast(null);
  };

  const triggerNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    // Check user preferences
    if (notif.type === 'govt' && !notificationPreferences.govtPostings) return;
    if (notif.type === 'job' && !notificationPreferences.privateJobs) return;
    if (notif.type === 'news' && !notificationPreferences.breakingNews) return;
    if (notif.type === 'admitCard' && !notificationPreferences.admitCardsAndResults) return;
    if (notif.type === 'scheme' && !notificationPreferences.welfareYojana) return;

    const newNotification: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);
    setActiveToast(newNotification);
    playChime();

    // Auto dismiss toast after 6 seconds
    setTimeout(() => {
      setActiveToast((current) => (current?.id === newNotification.id ? null : current));
    }, 6000);
  };

  const simulateTriggerByCategory = (category: 'govt' | 'job' | 'news' | 'admitCard') => {
    if (category === 'govt') {
      triggerNotification({
        type: 'govt',
        priority: 'urgent',
        titleEn: 'Railway RRB Technician 2026: Form Closing in 48 Hours!',
        titleHi: 'रेलवे आरआरबी तकनीशियन भर्ती: आवेदन में अंतिम 48 घंटे शेष!',
        bodyEn: 'Over 11,558 positions across 21 railway zones. Apply now to avoid server downtime.',
        bodyHi: 'सभी 21 रेलवे मंडलों में 11,558 पद। सर्वर लोड से बचने के लिए तुरंत आवेदन करें।',
        targetId: 'rrb-ntpc-2026',
      });
    } else if (category === 'job') {
      triggerNotification({
        type: 'job',
        priority: 'high',
        titleEn: 'New Opening: TCS National Qualifier Test (NQT) Freshers',
        titleHi: 'नया रोजगार: टीसीएस (TCS) फ्रेशर्स भर्ती 2026',
        bodyEn: '18,000 vacancies for Graduates & Engineering students. Package up to ₹7.2 LPA.',
        bodyHi: 'स्नातक एवं इंजीनियरिंग छात्रों हेतु 18,000 पद। ₹7.2 लाख तक का वार्षिक पैकेज।',
        targetId: 'tcs-nqt-freshers-2026',
      });
    } else if (category === 'news') {
      triggerNotification({
        type: 'news',
        priority: 'urgent',
        titleEn: 'Breaking: DigiLocker QR Made Legally Binding for Driving Licenses',
        titleHi: 'बड़ी खबर: डिजिलॉकर क्यूआर सत्यापन अब ड्राइविंग लाइसेंस के लिए कानूनी रूप से मान्य',
        bodyEn: 'No official or traffic authority can insist on physical laminated cards under IT Act Rule 9A.',
        bodyHi: 'आईटी एक्ट नियम 9A के तहत कोई भी पुलिसकर्मी या टीटीई डिजिटल दस्तावेज अस्वीकार नहीं कर सकता।',
        targetId: 'news-digilocker-qr-verification',
      });
    } else {
      triggerNotification({
        type: 'admitCard',
        priority: 'high',
        titleEn: 'CTET July 2026 City Intimation Slip Released',
        titleHi: 'सीटेट (CTET) परीक्षा शहर आवंटन पर्ची जारी',
        bodyEn: 'Check your examination city and exam date on ctet.nic.in official server.',
        bodyHi: 'ctet.nic.in पर अपने परीक्षा शहर एवं तिथि की जानकारी ऑनलाइन देखें।',
        targetId: 'ctet-teaching-2026',
      });
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotification,
        triggerNotification,
        simulateTriggerByCategory,
        activeToast,
        dismissToast,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
