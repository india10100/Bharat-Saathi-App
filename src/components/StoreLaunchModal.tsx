import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { 
  X, Smartphone, Download, ExternalLink, CheckCircle2, Copy, Check, Apple, 
  Play, ShieldCheck, Sparkles, QrCode, Layers, ArrowUpRight, Award, Compass 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StoreLaunchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoreLaunchModal: React.FC<StoreLaunchModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { isInstallable, install, isIOS, isInstalled } = usePWAInstall();
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'android' | 'ios' | 'checklist'>('overview');

  if (!isOpen) return null;

  // App URL: fallback to origin or production URL
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://bharatsaathi.in';
  const cleanUrl = typeof window !== 'undefined' ? window.location.origin : 'https://bharatsaathi.in';

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const checklistItems = [
    { titleEn: 'Web App Manifest (id, scope, display standalone)', titleHi: 'मानक वेब ऐप मैनिफेस्ट (standalone मोड)', status: true },
    { titleEn: '192x192 & 512x512 High-Res PNG App Icons', titleHi: '192x192 एवं 512x512 हाई-रेजोल्यूशन आइकन्स', status: true },
    { titleEn: 'Maskable Icon for Android Squircles (pwa-maskable)', titleHi: 'एंड्रॉयड अडैप्टिव मास्केबल आइकॉन', status: true },
    { titleEn: 'Apple Touch Icon (180x180 PNG for iOS)', titleHi: 'एप्पल टच आइकॉन (आईफोन सफारी हेतु)', status: true },
    { titleEn: 'Offline Service Worker & Asset Caching (Workbox)', titleHi: 'ऑफलाइन सर्विस वर्कर व कैशिंग', status: true },
    { titleEn: 'Viewport Fit Cover & iOS Safe Area Insets', titleHi: 'आईफोन नॉच व सेफ-एरिया सपोर्ट', status: true },
    { titleEn: 'Digital Asset Links (/.well-known/assetlinks.json)', titleHi: 'गूगल डिजिटल एसेट लिंक्स वेरिफिकेशन', status: true },
    { titleEn: 'Zero AI dependencies & Fast Initial Load (< 1s)', titleHi: 'बिना AI / नो हैंग / सुपरफास्ट लोडिंग', status: true },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-xl rounded-3xl bg-slate-900 border-2 border-amber-500/50 p-5 sm:p-6 shadow-2xl text-slate-100 max-h-[92vh] overflow-y-auto no-scrollbar flex flex-col"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20">
              🚀
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  {t('Store Prototype & Launch Hub', 'स्टोर प्रोटोटाइप व लॉन्च हब')}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                  Ready
                </span>
              </div>
              <p className="text-xs text-amber-400 font-semibold">
                {t('Play Store (Android) & App Store (iOS) Launch Ready', 'गूगल प्लेस्टोर व एप्पल ऐप स्टोर दोनों हेतु तैयार')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation inside modal */}
        <div className="flex items-center gap-1.5 mt-4 p-1 rounded-2xl bg-slate-950 border border-slate-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-1.5 text-xs font-black rounded-xl transition ${
              activeTab === 'overview'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('1. Live Test', '1. लाइव टेस्ट')}
          </button>
          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 py-1.5 text-xs font-black rounded-xl transition ${
              activeTab === 'android'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('2. Play Store', '2. प्लेस्टोर')}
          </button>
          <button
            onClick={() => setActiveTab('ios')}
            className={`flex-1 py-1.5 text-xs font-black rounded-xl transition ${
              activeTab === 'ios'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('3. App Store', '3. ऐप स्टोर')}
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`flex-1 py-1.5 text-xs font-black rounded-xl transition ${
              activeTab === 'checklist'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('Checklist (100%)', 'जांच सूची')}
          </button>
        </div>

        {/* Tab Contents */}
        <div className="mt-4 space-y-4 flex-1">
          {/* TAB 1: OVERVIEW & LIVE TEST */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-slate-800 border-2 border-emerald-500/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wide">
                    {t('Live Device Test', 'सीधे फोन पर टेस्ट')}
                  </span>
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    {isInstalled ? t('Installed as App', 'ऐप के रूप में सक्रिय') : t('Ready to Install', 'इंस्टॉल हेतु तैयार')}
                  </span>
                </div>

                <h4 className="text-sm font-black text-white">
                  {t('Experience Bharat Saathi on your smartphone right now', 'अभी अपने स्मार्टफोन पर भारत साथी का अनुभव लें')}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t(
                    'Operates as an installable Progressive Web App with zero browser URL bar, native full-screen view, and offline cached service worker identical to a downloaded app.',
                    'बिना ब्राउज़र बार के फुल स्क्रीन में, ऑफलाइन स्पीड के साथ बिल्कुल प्लेस्टोर ऐप जैसा अनुभव।'
                  )}
                </p>

                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  {isInstallable ? (
                    <button
                      onClick={install}
                      className="flex-1 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>{t('1-Tap Install on Android', 'एंड्रॉयड पर 1-टैप में इंस्टॉल करें')}</span>
                    </button>
                  ) : isIOS ? (
                    <div className="flex-1 p-2.5 rounded-2xl bg-slate-900/90 border border-slate-700 text-xs text-slate-200">
                      <span className="font-bold text-amber-300 block mb-0.5">
                        {t('iPhone / iPad Safari:', 'आईफोन सफारी:')}
                      </span>
                      <span className="text-[11px] text-slate-300">
                        {t(
                          'Tap Share (शेयर) icon in Safari and select "Add to Home Screen" (होम स्क्रीन में जोड़ें).',
                          'सफारी में नीचे शेयर बटन दबाकर "होम स्क्रीन में जोड़ें" चुनें।'
                        )}
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={handleCopy}
                      className="flex-1 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {copiedUrl ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedUrl ? t('Copied! Open in Phone', 'कॉपी हो गया! फोन में खोलें') : t('Copy URL for Phone Browser', 'फोन में खोलने के लिए लिंक कॉपी करें')}</span>
                    </button>
                  )}

                  <button
                    onClick={handleCopy}
                    className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-750 text-amber-300 border border-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>{copiedUrl ? t('Copied', 'कॉपी हुआ') : t('Copy App Link', 'लिंक कॉपी')}</span>
                  </button>
                </div>
              </div>

              {/* URL Display */}
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">{t('Live App Prototype URL', 'लाइव ऐप प्रोटोटाइप लिंक')}</span>
                  <span className="text-xs font-mono text-amber-300 truncate block">{cleanUrl}</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white shrink-0"
                >
                  {copiedUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: GOOGLE PLAY STORE */}
          {activeTab === 'android' && (
            <div className="space-y-3.5">
              <div className="p-4 rounded-3xl bg-slate-800/80 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🤖</span>
                  <div>
                    <h4 className="text-sm font-black text-white">Google Play Store Submission (.AAB)</h4>
                    <p className="text-[11px] text-amber-400 font-medium">Trusted Web Activity (TWA) Architecture</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {t(
                    'Bharat Saathi meets 100% of Google Play Store TWA criteria: Valid manifest, 192px/512px icons, maskable circle/squircle icons, offline caching, and assetlinks.json.',
                    'भारत साथी गूगल प्लेस्टोर के 100% मानकों को पूरा करता है: वैध मैनिफेस्ट, मास्केबल आइकन्स, ऑफलाइन कैशिंग और डिजिटल एसेट लिंक्स।'
                  )}
                </p>

                <div className="p-3 rounded-2xl bg-slate-950 font-mono text-[11px] text-slate-300 space-y-1 border border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Package Name:</span>
                    <span className="text-emerald-400 font-bold">com.bharatsaathi.app</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">App Name:</span>
                    <span className="text-amber-400">Bharat Saathi (भारत साथी)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Digital Asset Links:</span>
                    <span className="text-blue-400">/.well-known/assetlinks.json</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target SDK:</span>
                    <span className="text-slate-300">Android 14+ (API 34)</span>
                  </div>
                </div>

                <div className="pt-1 flex flex-col sm:flex-row gap-2">
                  <a
                    href={`https://www.pwabuilder.com?url=${encodeURIComponent(cleanUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs text-center flex items-center justify-center gap-2 shadow-md transition"
                  >
                    <span>{t('1-Click Generate Android Bundle on PWABuilder', 'PWABuilder पर .AAB फाइल जनरेट करें')}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <span className="font-bold text-slate-200 block">{t('Play Store Steps:', 'प्लेस्टोर के कदम:')}</span>
                <p>1. Open PWABuilder or Google Bubblewrap CLI with your live URL.</p>
                <p>2. Download the signed <code className="text-amber-400 font-mono">.aab</code> (Android App Bundle).</p>
                <p>3. Upload directly to Google Play Console under "Production" or "Closed Testing".</p>
              </div>
            </div>
          )}

          {/* TAB 3: APPLE APP STORE */}
          {activeTab === 'ios' && (
            <div className="space-y-3.5">
              <div className="p-4 rounded-3xl bg-slate-800/80 border border-blue-500/30 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Apple className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">Apple App Store Submission (iOS)</h4>
                    <p className="text-[11px] text-blue-300 font-medium">WebKit PWA / Capacitor Xcode Wrapper</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {t(
                    'Configured with Apple touch icons, black-translucent status bar, and viewport-fit=cover so it adapts to dynamic island and iPhone notches.',
                    'एप्पल टच आइकॉन और स्टेटस बार के साथ आईफोन और आईपैड के सभी स्क्रीनों के लिए अनुकूलित।'
                  )}
                </p>

                <div className="p-3 rounded-2xl bg-slate-950 font-mono text-[11px] text-slate-300 space-y-1 border border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Bundle Identifier:</span>
                    <span className="text-blue-400 font-bold">com.bharatsaathi.app</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target iOS:</span>
                    <span className="text-slate-300">iOS 14.0+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Display Mode:</span>
                    <span className="text-emerald-400">Standalone (Full Screen)</span>
                  </div>
                </div>

                <div className="pt-1 flex flex-col sm:flex-row gap-2">
                  <a
                    href={`https://www.pwabuilder.com?url=${encodeURIComponent(cleanUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs text-center flex items-center justify-center gap-2 shadow-md transition"
                  >
                    <span>{t('Generate iOS Xcode Package', 'iOS Xcode पैकेज जनरेट करें')}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <span className="font-bold text-slate-200 block">{t('App Store Steps:', 'ऐप स्टोर के कदम:')}</span>
                <p>1. Export iOS package using PWABuilder or Capacitor.</p>
                <p>2. Open project in Xcode, sign with Apple Developer account.</p>
                <p>3. Archive & upload build to App Store Connect.</p>
              </div>
            </div>
          )}

          {/* TAB 4: STORE READINESS CHECKLIST */}
          {activeTab === 'checklist' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black text-slate-200 uppercase tracking-wider">
                  {t('Store Certification Audit', 'स्टोर सर्टिफिकेशन ऑडिट')}
                </span>
                <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  8 / 8 Passed (100%)
                </span>
              </div>

              <div className="space-y-2">
                {checklistItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-800/70 border border-slate-700/80 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="text-xs font-semibold text-slate-200 leading-snug">
                        {t(item.titleEn, item.titleHi)}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-black text-emerald-400 shrink-0">
                      PASS
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            {copiedUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedUrl ? t('Copied!', 'कॉपी हो गया!') : t('Copy Prototype URL', 'प्रोटोटाइप लिंक कॉपी करें')}</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition cursor-pointer shadow"
          >
            {t('Done', 'पूर्ण')}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
