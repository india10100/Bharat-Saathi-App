import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Heart, Droplets, Apple, Users, MessageSquare, Volume2, VolumeX, CheckCircle2, Plus, Minus, RotateCcw, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface RoutineExercise {
  id: string;
  nameEn: string;
  nameHi: string;
  emoji: string;
  duration: string;
  benefitEn: string;
  benefitHi: string;
  instructionsEn: string;
  instructionsHi: string;
}

const DAILY_EXERCISES: RoutineExercise[] = [
  {
    id: 'ex-1',
    nameEn: 'Tadasana (Palm Tree Stretch)',
    nameHi: 'ताड़ासन (शरीर खिंचाव व रीढ़ स्वास्थ्य)',
    emoji: '🧘',
    duration: '2 Minutes',
    benefitEn: 'Improves posture, helps kids grow taller, relieves back stiffness',
    benefitHi: 'मुद्रा सुधरती है, बच्चों की लंबाई बढ़ाने में सहायक, पीठ का दर्द दूर होता है',
    instructionsEn: 'Stand straight, interlock fingers, turn palms upward, inhale and slowly rise on your toes. Hold for 20 seconds, repeat 3 times.',
    instructionsHi: 'सीधे खड़े हों, उंगलियों को फंसाकर हथेलियां ऊपर की ओर करें, सांस लेते हुए पंजों के बल उठें। 20 सेकंड रुकें और 3 बार दोहराएं।',
  },
  {
    id: 'ex-2',
    nameEn: 'Anulom-Vilom (Alternate Nostril Breathing)',
    nameHi: 'अनुलोम-विलोम प्राणायाम',
    emoji: '🌬️',
    duration: '3 Minutes',
    benefitEn: 'Calms mind, reduces stress, cleanses respiratory channels',
    benefitHi: 'मानसिक तनाव कम करता है, फेफड़ों को स्वच्छ हवा देता है, एकाग्रता बढ़ती है',
    instructionsEn: 'Sit cross-legged. Close right nostril with thumb, inhale deeply from left. Close left, exhale through right. Repeat rhythmically.',
    instructionsHi: 'सुखासन में बैठें। दाएं अंगूठे से दायां नथुना बंद करें, बाएं से गहरी सांस लें। फिर बाएं को बंद कर दाएं से छोड़ें।',
  },
  {
    id: 'ex-3',
    nameEn: '30-Minute Daily Walk (दैनिक पैदल चलना)',
    nameHi: '30 मिनट नियमित सुबह/शाम की सैर',
    emoji: '🚶',
    duration: '30 Minutes',
    benefitEn: 'Controls blood sugar, heart health, improves digestion for all ages',
    benefitHi: 'ब्लड शुगर नियंत्रित रहता है, दिल मजबूत होता है, सभी आयु वर्ग के लिए सर्वोत्तम',
    instructionsEn: 'Walk at a comfortable, brisk pace in the morning or 20 minutes after dinner. Drink a glass of warm water before walking.',
    instructionsHi: 'सुबह ताजी हवा में या रात के भोजन के 20 मिनट बाद मध्यम गति से चलें। चलने से पहले एक गिलास पानी अवश्य पिएं।',
  },
  {
    id: 'ex-4',
    nameEn: 'Bhujangasana (Cobra Pose)',
    nameHi: 'भुजंगासन (पीठ व गर्दन मजबूती)',
    emoji: '🐍',
    duration: '2 Minutes',
    benefitEn: 'Strengthens spine, relieves neck pain from mobile/desk work',
    benefitHi: 'रीढ़ की हड्डी लचीली बनती है, मोबाइल व पढ़ाई से गर्दन के दर्द में राहत',
    instructionsEn: 'Lie on your stomach, place palms near chest, inhale and gently lift chest upward while keeping elbows slightly bent. Hold 15 seconds.',
    instructionsHi: 'पेट के बल लेटें, हथेलियां छाती के पास रखें, सांस लेते हुए धीरे-धीरे धड़ को ऊपर उठाएं। 15 सेकंड रुकें।',
  },
];

const NUTRITION_TIPS = [
  {
    id: 'nut-1',
    emoji: '🌾',
    titleEn: 'Shree Anna (Millets / बाजरा, ज्वार, रागी)',
    titleHi: 'श्री अन्न: बाजरा, ज्वार, रागी व कोदो',
    descEn: 'Ragi has 10x more calcium than polished rice. Bajra is rich in iron, preventing anemia in mothers and children.',
    descHi: 'रागी में चावल से 10 गुना अधिक कैल्शियम होता है। बाजरा खून की कमी (एनीमिया) दूर करता है और पाचन ठीक रखता है।',
  },
  {
    id: 'nut-2',
    emoji: '🌱',
    titleEn: 'Sprouts & Sattu (अंकुरित चना व सत्तू)',
    titleHi: 'अंकुरित चना, मूंग व देसी सत्तू',
    descEn: 'Affordable natural protein bomb costing less than ₹10/serving. Provides sustained physical energy for students and working citizens.',
    descHi: 'सस्ता और प्राकृतिक प्रोटीन। सुबह एक कटोरी अंकुरित मूंग या सत्तू का शरबत दिनभर ऊर्जा और पेट को ठंडक देता है।',
  },
  {
    id: 'nut-3',
    emoji: '🫚',
    titleEn: 'Grandma’s Remedy: Haldi & Tulsi (हल्दी-तुलसी)',
    titleHi: 'दादी माँ के नुस्खे: हल्दी दूध व तुलसी काढ़ा',
    descEn: 'Natural antiseptic for cough, seasonal flu, and joint pain without side-effects.',
    descHi: 'रात को गुनगुने दूध में चुटकीभर हल्दी और सुबह तुलसी-अदरक का पानी मौसमी जुकाम से शरीर की रक्षा करता है।',
  },
];

const FAMILY_TALK_PROMPTS = [
  {
    id: 'prompt-1',
    emoji: '❤️',
    titleEn: 'Family Conversation of the Day',
    titleHi: 'आज की पारिवारिक चौपाल चर्चा',
    questionEn: 'Tonight at dinner, ask everyone: "What was one kind thing someone did for you this week?"',
    questionHi: 'आज रात भोजन के समय परिवार में पूछें: "इस हफ्ते किसी ने आपके साथ क्या अच्छा काम किया?"',
  },
  {
    id: 'prompt-2',
    emoji: '💡',
    titleEn: 'Household Savings Tip',
    titleHi: 'घर का बजट बचत नुस्खा',
    questionEn: 'Switch off room lights and fans when leaving; turning off standby switches saves up to 10% on monthly electricity bills.',
    questionHi: 'कमरे से बाहर निकलते समय पंखा-बत्ती बंद करने और प्लग ऑफ रखने से बिजली के बिल में 10% तक बचत होती है।',
  },
  {
    id: 'prompt-3',
    emoji: '🤝',
    titleEn: 'Neighbor & Community Unity',
    titleHi: 'पड़ोसी व सामाजिक भाईचारा',
    questionEn: 'Greet one neighbor with a warm smile today and check on an elderly person living nearby.',
    questionHi: 'आज अपने पड़ोस में किसी बुजुर्ग का हालचाल पूछें और मुस्कुराकर "नमस्ते" कहें।',
  },
];

export const SwasthAndHomeHub: React.FC = () => {
  const { lang, t } = useLanguage();

  // Water Tracker State
  const [waterGlasses, setWaterGlasses] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('bharat_saathi_water_glasses');
      return saved ? parseInt(saved, 10) : 4;
    } catch {
      return 4;
    }
  });

  const [activeTab, setActiveTab] = useState<'routine' | 'food' | 'water' | 'hometalks'>('routine');
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('bharat_saathi_water_glasses', waterGlasses.toString());
  }, [waterGlasses]);

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
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-950/50 via-teal-900/30 to-slate-900 border-2 border-emerald-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-2xl shadow">
            🧘
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase">
                Section 9
              </span>
              <span className="text-xs font-bold text-amber-300">
                {t('For Every Home & Citizen', 'हर घर व हर नागरिक हेतु')}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white mt-0.5">
              {t('Swasth Bharat & Ghar-Parivaar Hub', 'स्वस्थ भारत व घर-परिवार केंद्र')}
            </h2>
            <p className="text-xs text-slate-300">
              {t(
                'Simple daily exercise, water reminder, nutritious Indian food, and uplifting family talks.',
                'दैनिक व्यायाम व योग, पानी मीटर, पौष्टिक आहार (श्री अन्न), और पारिवारिक चौपाल चर्चा।'
              )}
            </p>
          </div>
        </div>

        {/* Quick Water Status Pill */}
        <div className="px-3.5 py-2 rounded-2xl bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-black flex items-center gap-2">
          <Droplets className="w-4 h-4 text-blue-400" />
          <span>{waterGlasses} / 8 {t('Glasses Water Today', 'गिलास पानी आज')}</span>
        </div>
      </div>

      {/* UNIVERSAL EQUALITY & INCLUSION CHARTER */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-emerald-500/15 border border-amber-500/30 text-xs text-slate-200 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xl shrink-0">🤝 🇮🇳</span>
          <div>
            <strong className="text-amber-300 font-black block">
              {t('Universal Equality Charter (सर्वजन समभाव व समानता)', 'सर्वजन समभाव, समानता व सम्मान')}
            </strong>
            <span className="text-[11px] text-slate-300 leading-relaxed block mt-0.5">
              {t(
                'Open to everyone regardless of age, caste, gender, economic status or background. Equal access for all citizens.',
                'जाति, धर्म, लिंग, आयु या आर्थिक स्थिति के भेद बिना सभी के लिए समान अवसर व सम्मान।'
              )}
            </span>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-xl bg-slate-900 text-emerald-400 font-black text-[10px] border border-emerald-500/30 shrink-0">
          समान अधिकार
        </span>
      </div>

      {/* 4 Feature Switcher Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        {[
          { id: 'routine', emoji: '🧘', labelEn: 'Daily Exercise', labelHi: 'दैनिक व्यायाम' },
          { id: 'water', emoji: '💧', labelEn: 'Water Tracker', labelHi: 'पानी मीटर' },
          { id: 'food', emoji: '🥗', labelEn: 'Food & Nutrition', labelHi: 'पौष्टिक आहार' },
          { id: 'hometalks', emoji: '🏡', labelEn: 'Home Talks', labelHi: 'घर-परिवार चौपाल' },
        ].map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition cursor-pointer ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 scale-105 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
              }`}
            >
              <span>{tab.emoji}</span>
              <span>{t(tab.labelEn, tab.labelHi)}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: DAILY EXERCISE & YOGA ROUTINES */}
      {activeTab === 'routine' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
              <span>🧘</span>
              <span>{t('10-Minute Morning Routine for All Ages', 'सभी उम्र के लिए 10 मिनट का सुबह का व्यायाम')}</span>
            </h3>
            <span className="text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              {t('Zero Equipment Needed', 'बिना किसी साधन के')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {DAILY_EXERCISES.map((ex) => (
              <div
                key={ex.id}
                className="p-4 rounded-3xl bg-slate-800/85 border-2 border-slate-700/80 hover:border-emerald-400 transition shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{ex.emoji}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-400 font-bold text-xs border border-slate-700">
                        ⏱️ {ex.duration}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        handleSpeak(
                          lang === 'hi'
                            ? `${ex.nameHi}. लाभ: ${ex.benefitHi}. विधि: ${ex.instructionsHi}`
                            : `${ex.nameEn}. Benefit: ${ex.benefitEn}. Instructions: ${ex.instructionsEn}`,
                          ex.id
                        )
                      }
                      className="p-1.5 rounded-xl bg-slate-900 text-slate-300 hover:text-amber-400"
                    >
                      {speakingId === ex.id ? (
                        <VolumeX className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <h4 className="text-sm sm:text-base font-black text-white leading-snug">
                    {lang === 'hi' ? ex.nameHi : ex.nameEn}
                  </h4>

                  <div className="my-2 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                    <strong className="text-emerald-300 block text-[10px] uppercase">{t('Benefit', 'स्वास्थ्य लाभ')}</strong>
                    <span className="text-slate-200">{lang === 'hi' ? ex.benefitHi : ex.benefitEn}</span>
                  </div>

                  <p className="text-xs text-slate-300/90 leading-relaxed">
                    <strong>{t('How to do:', 'करने की विधि:')}</strong> {lang === 'hi' ? ex.instructionsHi : ex.instructionsEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE WATER INTAKE TRACKER */}
      {activeTab === 'water' && (
        <div className="p-5 rounded-3xl bg-slate-850 border-2 border-blue-500/40 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm sm:text-base font-black text-white">
                {t('Daily Water Tracker (जल ही जीवन है)', 'दैनिक पानी मीटर (स्वस्थ जीवन)')}
              </h3>
            </div>
            <button
              onClick={() => setWaterGlasses(0)}
              className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-bold"
            >
              {t('Reset Today', 'रीसेट करें')}
            </button>
          </div>

          <div className="text-center py-2 space-y-2">
            <span className="text-4xl sm:text-5xl font-black text-blue-400 font-mono block">
              {waterGlasses} / 8 <span className="text-sm text-slate-400">{t('Glasses', 'गिलास')}</span>
            </span>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              {waterGlasses >= 8
                ? t('🎉 Goal reached! Fantastic hydration for healthy skin, digestion & energy.', '🎉 बधाई! 8 गिलास का लक्ष्य पूरा हुआ। शरीर ऊर्जावान व स्वस्थ रहेगा।')
                : t('Drinking 8 glasses (≈ 2 Litres) daily prevents kidney stones, fatigue, and headaches.', 'प्रतिदिन 8 गिलास (लगभग 2 लीटर) पानी पीने से सिरदर्द, थकावट और पेट की समस्याएं दूर रहती हैं।')}
            </p>
          </div>

          {/* Visual 8-Glass Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {Array.from({ length: 8 }).map((_, idx) => {
              const isFilled = idx < waterGlasses;
              return (
                <button
                  key={idx}
                  onClick={() => setWaterGlasses(idx + 1)}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition cursor-pointer ${
                    isFilled
                      ? 'bg-blue-500/20 border-blue-400 text-blue-300 shadow-md'
                      : 'bg-slate-900 border-slate-700 text-slate-600'
                  }`}
                >
                  <span className="text-2xl">{isFilled ? '💧' : '⚪'}</span>
                  <span className="text-[10px] font-bold mt-1">#{idx + 1}</span>
                </button>
              );
            })}
          </div>

          {/* Increment / Decrement Controls */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setWaterGlasses((prev) => Math.max(0, prev - 1))}
              className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition cursor-pointer"
            >
              <Minus className="w-5 h-5" />
            </button>
            <button
              onClick={() => setWaterGlasses((prev) => Math.min(12, prev + 1))}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 text-white font-black text-xs shadow-lg transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{t('Drank 1 Glass (+1)', '1 गिलास पिया (+1)')}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: FOOD & NUTRITION (DESI SUPERFOODS & SHREE ANNA) */}
      {activeTab === 'food' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
              <span>🥗</span>
              <span>{t('Desi Nutrition: Millets (Shree Anna) & Remedies', 'देसी पोषण: श्री अन्न (मोटे अनाज) व घरेलू नुस्खे')}</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {NUTRITION_TIPS.map((tip) => (
              <div
                key={tip.id}
                className="p-4 rounded-3xl bg-slate-800/85 border border-slate-700 hover:border-amber-400/50 shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{tip.emoji}</span>
                    <button
                      onClick={() =>
                        handleSpeak(
                          lang === 'hi' ? `${tip.titleHi}. ${tip.descHi}` : `${tip.titleEn}. ${tip.descEn}`,
                          tip.id
                        )
                      }
                      className="p-1.5 rounded-xl bg-slate-900 text-slate-300 hover:text-amber-400"
                    >
                      {speakingId === tip.id ? <VolumeX className="w-3.5 h-3.5 text-amber-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <h4 className="text-xs sm:text-sm font-black text-amber-300">
                    {lang === 'hi' ? tip.titleHi : tip.titleEn}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {lang === 'hi' ? tip.descHi : tip.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: GHAR-PARIVAAR & HOME TALKS (SOCIAL FEATURES) */}
      {activeTab === 'hometalks' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
              <span>🏡</span>
              <span>{t('Ghar-Parivaar Community & Family Talks', 'घर-परिवार चौपाल व आपसी संवाद')}</span>
            </h3>
          </div>

          <div className="space-y-3">
            {FAMILY_TALK_PROMPTS.map((prompt) => (
              <div
                key={prompt.id}
                className="p-4 rounded-3xl bg-slate-800/85 border-2 border-slate-700/80 hover:border-amber-400 shadow-md transition flex items-start gap-3"
              >
                <span className="text-2xl shrink-0 mt-0.5">{prompt.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h4 className="text-xs sm:text-sm font-black text-amber-300">
                      {lang === 'hi' ? prompt.titleHi : prompt.titleEn}
                    </h4>
                    <button
                      onClick={() =>
                        handleSpeak(
                          lang === 'hi' ? `${prompt.titleHi}. ${prompt.questionHi}` : `${prompt.titleEn}. ${prompt.questionEn}`,
                          prompt.id
                        )
                      }
                      className="p-1 rounded-lg text-slate-400 hover:text-white"
                    >
                      {speakingId === prompt.id ? <VolumeX className="w-3.5 h-3.5 text-amber-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {lang === 'hi' ? prompt.questionHi : prompt.questionEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
