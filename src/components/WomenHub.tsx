import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Phone, Shield, Heart, Sparkles, ExternalLink, Volume2, VolumeX, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface WomenScheme {
  id: string;
  emoji: string;
  titleEn: string;
  titleHi: string;
  benefitEn: string;
  benefitHi: string;
  descriptionEn: string;
  descriptionHi: string;
  officialLink: string;
}

const WOMEN_SCHEMES: WomenScheme[] = [
  {
    id: 'lakhpati-didi',
    emoji: '🌸',
    titleEn: 'Lakhpati Didi Yojana (Self-Help Groups)',
    titleHi: 'लखपति दीदी योजना (स्वयं सहायता समूह)',
    benefitEn: 'Collateral-free loans up to ₹5 Lakh + business training for rural & urban women',
    benefitHi: 'बिना गारंटी ₹5 लाख तक का आसान ऋण + सिलाई, डेयरी व लघु उद्योग प्रशिक्षण',
    descriptionEn: 'Government initiative empowering 3 crore women in Self-Help Groups (SHGs) to earn at least ₹1,00,000 sustainable annual income through micro-enterprises.',
    descriptionHi: 'स्वयं सहायता समूहों की 3 करोड़ बहनों को सालाना कम से कम ₹1 लाख की निश्चित आय कमाने हेतु आर्थिक व तकनीकी सहायता।',
    officialLink: 'https://nrlm.gov.in',
  },
  {
    id: 'pmmvy-maternity',
    emoji: '🤱',
    titleEn: 'Pradhan Mantri Matru Vandana Yojana (PMMVY)',
    titleHi: 'प्रधानमंत्री मातृ वंदना योजना (PMMVY)',
    benefitEn: '₹5,000 to ₹6,000 Direct Cash Benefit into mother\'s bank account',
    benefitHi: 'गर्भवती व धात्री माताओं को ₹5,000 से ₹6,000 की सीधी बैंक सहायता',
    descriptionEn: 'Maternity financial support for nutrition, safe delivery in government hospitals, and child vaccinations directly credited in installments.',
    descriptionHi: 'गर्भावस्था के दौरान पौष्टिक आहार, अस्पताल में सुरक्षित प्रसव और नवजात के टीकाकरण हेतु सीधे बैंक खाते में सहायता।',
    officialLink: 'https://pmmvy.wcd.gov.in',
  },
  {
    id: 'mahila-samman',
    emoji: '💰',
    titleEn: 'Mahila Samman Savings Certificate (MSSC)',
    titleHi: 'महिला सम्मान बचत प्रमाण पत्र',
    benefitEn: 'Guaranteed 7.5% annual interest for 2-year deposit up to ₹2 Lakh',
    benefitHi: 'महिलाओं व बालिकाओं के लिए 7.5% वार्षिक निश्चित सरकारी ब्याज दर',
    descriptionEn: 'Safe sovereign deposit scheme at post offices and banks for any woman or girl child with partial withdrawal facility after 1 year.',
    descriptionHi: 'डाकघर और बैंकों में महिलाओं के नाम पर सुरक्षित बचत योजना, 1 वर्ष बाद 40% राशि निकालने की सुविधा।',
    officialLink: 'https://indiapost.gov.in',
  },
  {
    id: 'free-silai-machine',
    emoji: '🧵',
    titleEn: 'Free Sewing Machine Scheme (PM Vishwakarma Darzi)',
    titleHi: 'मुफ्त सिलाई मशीन योजना (पीएम विश्वकर्मा दर्जी)',
    benefitEn: '₹15,000 digital voucher for modern sewing machine + ₹500/day training stipend',
    benefitHi: 'आधुनिक सिलाई मशीन खरीदने हेतु ₹15,000 ई-वाउचर + ₹500 प्रतिदिन प्रशिक्षण वजीफा',
    descriptionEn: 'Helps women start home-based tailoring, embroidery, and boutique businesses with certificate and concessional loans at just 5% interest.',
    descriptionHi: 'महिलाओं को घर से सिलाई व बुटीक कार्य शुरू करने के लिए टूलकिट अनुदान और 5% रियायती ब्याज पर आसान ऋण।',
    officialLink: 'https://pmvishwakarma.gov.in',
  },
  {
    id: 'pm-ujjwala',
    emoji: '🔥',
    titleEn: 'PM Ujjwala Yojana 2.0 (Smoke-Free Kitchen)',
    titleHi: 'प्रधानमंत्री उज्ज्वला योजना 2.0 (धुआं-मुक्त रसोई)',
    benefitEn: 'Free gas cylinder + gas stove connection + ₹300 direct subsidy per refill',
    benefitHi: 'मुफ्त गैस कनेक्शन + भरा हुआ सिलेंडर व चूल्हा + प्रति रिफिल ₹300 सीधी सब्सिडी',
    descriptionEn: 'Guarantees clean cooking fuel for rural and poor women, protecting mothers and children from hazardous indoor smoke pollution.',
    descriptionHi: 'ग्रामीण व गरीब परिवारों की माताओं को चूल्हे के हानिकारक धुएं से मुक्ति और स्वच्छ रसोई गैस की सुविधा।',
    officialLink: 'https://pmuy.gov.in',
  },
];

const EMERGENCY_HELPLINES = [
  {
    number: '181',
    labelEn: 'Women Helpline (24x7 Toll-Free)',
    labelHi: 'महिला हेल्पलाइन (24 घंटे निशुल्क)',
    descEn: 'Support for domestic issues, legal advice, harassment & emergency shelter.',
    descHi: 'घरेलू समस्या, कानूनी सलाह, उत्पीड़न निवारण व सुरक्षित आश्रय सहायता।',
    color: 'from-rose-500 to-pink-600',
  },
  {
    number: '1091',
    labelEn: 'Women in Distress (Police)',
    labelHi: 'संकटग्रस्त महिला पुलिस हेल्पलाइन',
    descEn: 'Immediate police patrol response in emergencies or safety concerns.',
    descHi: 'आपातकालीन स्थिति में तुरंत पुलिस सहायता व पीसीआर वैन सहायता।',
    color: 'from-purple-600 to-indigo-600',
  },
  {
    number: '112',
    labelEn: 'All-in-One National Emergency',
    labelHi: 'अखिल भारतीय आपातकालीन नंबर',
    descEn: 'Instant connect to Police, Fire, Ambulance, and Disaster response.',
    descHi: 'पुलिस, अग्निशमन और एम्बुलेंस के लिए देशव्यापी एकीकृत नंबर।',
    color: 'from-blue-600 to-cyan-600',
  },
  {
    number: '1098',
    labelEn: 'Childline Helpline',
    labelHi: 'चाइल्डलाइन (बच्चों की सहायता)',
    descEn: 'Protection, care, and medical aid for children & teenagers in need.',
    descHi: 'संकटग्रस्त बच्चों की सुरक्षा, पोषण व स्वास्थ्य संबंधी तत्काल मदद।',
    color: 'from-amber-500 to-orange-500',
  },
];

export const WomenHub: React.FC = () => {
  const { lang, t } = useLanguage();
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const handleSpeak = (text: string, id: string) => {
    if (!('speechSynthesis' in window)) return;
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    window.speechSynthesis.speak(utterance);
    setSpeakingId(id);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-pink-950/50 via-rose-900/30 to-slate-900 border-2 border-pink-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-pink-500/20 text-pink-300 border border-pink-500/40 text-2xl shadow">
            🌸
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-black uppercase">
                Section 8
              </span>
              <span className="text-xs font-bold text-amber-300">
                {t('Nari Shakti & Mahila Kalyan', 'नारी शक्ति व महिला कल्याण')}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white mt-0.5">
              {t('Women’s Empowerment & Welfare Hub', 'महिला सशक्तिकरण व कल्याण केंद्र')}
            </h2>
            <p className="text-xs text-slate-300">
              {t(
                'Lakhpati Didi self-help groups, maternity grants, 1-tap safety helplines, and home business loans.',
                'लखपति दीदी, मातृ वंदना, सिलाई मशीन अनुदान, 24 घंटे सुरक्षा हेल्पलाइन और स्वरोजगार सहायता।'
              )}
            </p>
          </div>
        </div>

        {/* Quick Helpline Pill */}
        <div className="px-3.5 py-2 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-black flex items-center gap-2">
          <Phone className="w-4 h-4 text-rose-400" />
          <span>{t('Emergency Helpline: 181', 'महिला हेल्पलाइन: 181')}</span>
        </div>
      </div>

      {/* FEATURE 1: 1-TAP EMERGENCY WOMEN SAFETY HELPLINES */}
      <div className="space-y-2.5">
        <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-rose-400" />
          <span>{t('1-Tap 24x7 Safety & Emergency Helplines', '24 घंटे निशुल्क महिला सुरक्षा हेल्पलाइन')}</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {EMERGENCY_HELPLINES.map((hl) => (
            <a
              key={hl.number}
              href={`tel:${hl.number}`}
              className="p-3 rounded-2xl bg-slate-800/85 hover:bg-slate-800 border-2 border-slate-700/80 hover:border-pink-400 transition shadow-md flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-lg font-black text-white bg-gradient-to-r px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    📞 {hl.number}
                  </span>
                </div>
                <h4 className="text-xs font-black text-white group-hover:text-pink-300 leading-snug mt-1.5">
                  {lang === 'hi' ? hl.labelHi : hl.labelEn}
                </h4>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {lang === 'hi' ? hl.descHi : hl.descEn}
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-700/60 text-[10px] font-black text-emerald-400 flex items-center gap-1">
                <span>{t('Tap to Call', 'कॉल करें')}</span>
                <Phone className="w-3 h-3" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* FEATURE 2: WOMEN WELFARE & LIVELIHOOD SCHEMES */}
      <div className="space-y-3">
        <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-400" />
          <span>{t('Top Welfare & Cash Benefit Schemes for Women', 'महिलाओं हेतु प्रमुख योजनाएं व आर्थिक लाभ')}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {WOMEN_SCHEMES.map((scheme) => (
            <div
              key={scheme.id}
              className="p-4 rounded-3xl bg-slate-800/85 border-2 border-slate-700/80 hover:border-pink-400 shadow-xl transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-2xl">{scheme.emoji}</span>
                  <button
                    onClick={() =>
                      handleSpeak(
                        lang === 'hi'
                          ? `${scheme.titleHi}. लाभ: ${scheme.benefitHi}. ${scheme.descriptionHi}`
                          : `${scheme.titleEn}. Benefit: ${scheme.benefitEn}. ${scheme.descriptionEn}`,
                        scheme.id
                      )
                    }
                    className="p-1.5 rounded-xl bg-slate-900 text-slate-300 hover:text-pink-400"
                  >
                    {speakingId === scheme.id ? (
                      <VolumeX className="w-4 h-4 text-pink-400" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <h4 className="text-sm sm:text-base font-black text-white leading-snug">
                  {lang === 'hi' ? scheme.titleHi : scheme.titleEn}
                </h4>

                <div className="my-2.5 p-2.5 rounded-2xl bg-pink-500/10 border border-pink-500/25">
                  <span className="text-[10px] font-bold text-pink-400 block mb-0.5">
                    {t('Direct Benefit', 'सीधा लाभ')}
                  </span>
                  <span className="text-xs font-black text-white block">
                    {lang === 'hi' ? scheme.benefitHi : scheme.benefitEn}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'hi' ? scheme.descriptionHi : scheme.descriptionEn}
                </p>
              </div>

              <div className="mt-3.5 pt-2 border-t border-slate-700/60 flex items-center justify-end">
                <a
                  href={scheme.officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 text-slate-950 text-xs font-black shadow transition flex items-center gap-1.5"
                >
                  <span>{t('Apply on Portal', 'पोर्टल पर आवेदन करें')}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURE 3: HOME BUSINESS & SELF-HELP GROUP (SHG) TIPS */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-850 border border-slate-800 space-y-3">
        <h4 className="text-sm font-black text-white flex items-center gap-2">
          <span>🛍️</span>
          <span>{t('Home Business & Micro-Enterprise Ideas for Women', 'महिलाओं के लिए घर से शुरू होने वाले स्वरोजगार')}</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-lg block mb-1">🧵 👗</span>
            <strong className="text-pink-300 block mb-0.5">{t('Tailoring & Boutique', 'सिलाई व बुटीक')}</strong>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {t('Free machine with ₹15,000 Vishwakarma grant + orders from local neighborhood.', '₹15,000 टूलकिट अनुदान से मशीन और आसपास के कपड़ों की सिलाई।')}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-lg block mb-1">🍲 🌾</span>
            <strong className="text-amber-300 block mb-0.5">{t('Spices, Papad & Pickles', 'मसाले, पापड़ व अचार')}</strong>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {t('SHG group production with FSSAI registration and local grocery store tie-ups.', 'स्वयं सहायता समूह से पैकेजिंग और नजदीकी किराना दुकानों में बिक्री।')}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-lg block mb-1">🐄 🥛</span>
            <strong className="text-emerald-300 block mb-0.5">{t('Dairy & Livestock', 'डेयरी व पशुपालन')}</strong>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {t('Subsidized Kisan Credit Card loan at 4% interest for 2 cows/buffaloes.', '4% रियायती ब्याज पर पशुपालन केसीसी और दुग्ध संघों को सीधी आपूर्ति।')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
