import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useLanguage } from '../context/LanguageContext';
import { Download, Smartphone, Share2, PlusSquare, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PWAInstallButtonProps {
  variant?: 'compact' | 'banner' | 'pill';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'pill' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { t } = useLanguage();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>{t('App Installed', 'ऐप इंस्टॉल है')}</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 4000);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // General instructions modal
      setShowIOSModal(true);
    }
  };

  return (
    <>
      {variant === 'pill' && (
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 hover:brightness-110 transition cursor-pointer"
          title={t('Install Bharat Saathi App', 'भारत साथी ऐप इंस्टॉल करें')}
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{t('Install App', 'ऐप डाउनलोड')}</span>
        </motion.button>
      )}

      {variant === 'compact' && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleInstallClick}
          className="p-2 rounded-xl bg-slate-800 border border-slate-700/80 text-amber-400 hover:bg-slate-750 transition"
          aria-label={t('Install App', 'ऐप डाउनलोड करें')}
        >
          <Download className="w-4 h-4" />
        </motion.button>
      )}

      {variant === 'banner' && (
        <div className="mx-4 my-3 p-3.5 rounded-2xl bg-gradient-to-r from-slate-800/90 via-slate-850 to-slate-800 border border-amber-500/30 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">
                {t('Get Bharat Saathi on Home Screen', 'भारत साथी ऐप अपने फोन पर लगाएं')}
              </h4>
              <p className="text-xs text-slate-400">
                {t('Play Store & iOS ready • Fast & offline access', 'प्लेस्टोर व iOS रेडी • बिना रुकावट तेज चलेगा')}
              </p>
            </div>
          </div>
          <button
            onClick={handleInstallClick}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition cursor-pointer shadow"
          >
            {t('Install Now', 'इंस्टॉल करें')}
          </button>
        </div>
      )}

      {/* iOS & Browser Installation Modal */}
      <AnimatePresence>
        {showIOSModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-2xl text-slate-100"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black text-sm">
                    BS
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100">
                      {t('Install Bharat Saathi App', 'भारत साथी ऐप इंस्टॉल करें')}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {isIOS ? t('iPhone / iPad Safari Guide', 'आईफोन / आईपैड सफारी गाइड') : t('Quick Mobile Setup', 'त्वरित मोबाइल सेटअप')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIOSModal(false)}
                  className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3.5 text-xs text-slate-300">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50">
                  <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-100">
                      {isIOS
                        ? t('Tap the Share button in Safari toolbar', 'सफारी टूलबार में शेयर (Share) आइकन पर टैप करें')
                        : t('Tap browser menu (3 dots) or Install button', 'ब्राउज़र मेन्यू (3 डॉट्स) या इंस्टॉल बटन पर टैप करें')}
                    </p>
                    <p className="text-slate-400 text-[11px] mt-0.5 flex items-center gap-1">
                      <Share2 className="w-3.5 h-3.5 text-blue-400 inline" />
                      {t('Usually located at the bottom or top of your screen', 'आमतौर पर स्क्रीन के नीचे या ऊपर स्थित होता है')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50">
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-100">
                      {t('Select "Add to Home Screen"', '"होम स्क्रीन में जोड़ें" (Add to Home Screen) चुनें')}
                    </p>
                    <p className="text-slate-400 text-[11px] mt-0.5 flex items-center gap-1">
                      <PlusSquare className="w-3.5 h-3.5 text-amber-400 inline" />
                      {t('Scroll down the menu list and tap "Add"', 'सूची में नीचे स्क्रॉल करें और "जोड़ें / Add" पर टैप करें')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-emerald-200">
                      {t('Ready to launch like a native Play Store / App Store app!', 'प्लेस्टोर/एप स्टोर ऐप की तरह तुरंत होम स्क्रीन से चलेगा!')}
                    </p>
                    <p className="text-[11px] text-emerald-400/80 mt-0.5">
                      {t('Fast loading, works with slow 2G/3G network, and offline bookmarking.', 'धीमे इंटरनेट पर भी तेज, कम डेटा खपत, और ऑफलाइन सुविधा।')}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSModal(false)}
                className="mt-5 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold transition"
              >
                {t('Got It, Close', 'समझ गया, बंद करें')}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t('Bharat Saathi added to your device!', 'भारत साथी आपके डिवाइस में जुड़ गया है!')}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
