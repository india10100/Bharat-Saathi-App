import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { GOVT_SCHEMES } from '../data/mockData';
import { GovtScheme } from '../types';
import { X, Sparkles, CheckCircle2, ArrowRight, RotateCcw, Calculator, Landmark } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface YojanaCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScheme: (scheme: GovtScheme) => void;
}

export const YojanaCalculatorModal: React.FC<YojanaCalculatorModalProps> = ({
  isOpen,
  onClose,
  onSelectScheme,
}) => {
  const { lang, t } = useLanguage();

  const [step, setStep] = useState<number>(1);
  const [age, setAge] = useState<number>(28);
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [occupation, setOccupation] = useState<'farmer' | 'unorganized' | 'artisan' | 'student' | 'business' | 'other'>('farmer');
  const [incomeRange, setIncomeRange] = useState<'low' | 'medium' | 'high'>('low'); // < 2.5L, 2.5-6L, > 6L
  const [hasPuccaHouse, setHasPuccaHouse] = useState<boolean>(false);
  const [hasGirlChild, setHasGirlChild] = useState<boolean>(false);

  if (!isOpen) return null;

  // Compute matched schemes based on inputs
  const calculateMatchedSchemes = (): GovtScheme[] => {
    return GOVT_SCHEMES.filter((scheme) => {
      if (scheme.id === 'pm-kisan') {
        return occupation === 'farmer' && incomeRange !== 'high';
      }
      if (scheme.id === 'ayushman-bharat-pmjay') {
        return incomeRange === 'low' || age >= 70 || occupation === 'unorganized';
      }
      if (scheme.id === 'pm-awas-yojana') {
        return !hasPuccaHouse && incomeRange !== 'high';
      }
      if (scheme.id === 'pm-vishwakarma') {
        return occupation === 'artisan' || occupation === 'unorganized';
      }
      if (scheme.id === 'sukanya-samriddhi') {
        return hasGirlChild || gender === 'Female';
      }
      if (scheme.id === 'national-scholarship-nsp') {
        return (occupation === 'student' || age <= 22) && incomeRange !== 'high';
      }
      if (scheme.id === 'khelo-india-sports') {
        return age <= 21 || occupation === 'student';
      }
      return true;
    });
  };

  const matched = calculateMatchedSchemes();

  const handleReset = () => {
    setStep(1);
    setOccupation('farmer');
    setIncomeRange('low');
    setHasPuccaHouse(false);
    setHasGirlChild(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto no-scrollbar"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-slate-950 font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                {t('Sarkari Yojana Eligibility Checker', 'सरकारी योजना पात्रता कैलकुलेटर')}
              </h3>
              <p className="text-[11px] text-slate-400">
                {t('Find benefits you qualify for in 60 seconds', '60 सेकंड में जानें अपने लिए पात्र योजनाएं')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Steps */}
        {step === 1 && (
          <div className="my-4 space-y-4 text-xs">
            {/* Age & Gender */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 mb-1 block">
                  {t('Your Age (Years)', 'आपकी आयु (वर्ष)')}
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value, 10) || 18)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 mb-1 block">
                  {t('Gender', 'लिंग')}
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => setGender('Male')}
                    className={`py-2 rounded-xl font-bold border transition ${
                      gender === 'Male'
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    {t('Male', 'पुरुष')}
                  </button>
                  <button
                    onClick={() => setGender('Female')}
                    className={`py-2 rounded-xl font-bold border transition ${
                      gender === 'Female'
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    {t('Female', 'महिला')}
                  </button>
                </div>
              </div>
            </div>

            {/* Occupation */}
            <div>
              <label className="text-[11px] font-bold text-slate-300 mb-1.5 block">
                {t('Primary Occupation / Livelihood', 'मुख्य व्यवसाय / कार्य')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'farmer', labelEn: 'Farmer (किसान)', labelHi: 'किसान / काश्तकार' },
                  { id: 'artisan', labelEn: 'Artisan / Craftsman', labelHi: 'दस्तकार / कारीगर (विश्वकर्मा)' },
                  { id: 'unorganized', labelEn: 'Labor / Daily Wage', labelHi: 'मजदूर / असंगठित श्रमिक' },
                  { id: 'business', labelEn: 'Small Business / Shop', labelHi: 'दुकानदार / छोटा व्यापारी' },
                  { id: 'student', labelEn: 'Student / Youth', labelHi: 'छात्र / युवा' },
                  { id: 'other', labelEn: 'Private / Salaried', labelHi: 'नौकरीपेशा / अन्य' },
                ].map((occ) => (
                  <button
                    key={occ.id}
                    onClick={() => setOccupation(occ.id as any)}
                    className={`p-2.5 rounded-xl text-left border font-semibold transition ${
                      occupation === occ.id
                        ? 'bg-amber-500/20 text-amber-300 border-amber-400 font-bold'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    {t(occ.labelEn, occ.labelHi)}
                  </button>
                ))}
              </div>
            </div>

            {/* Annual Income */}
            <div>
              <label className="text-[11px] font-bold text-slate-300 mb-1.5 block">
                {t('Annual Household Income', 'वार्षिक पारिवारिक आय')}
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'low', label: '< ₹2.5 Lakh' },
                  { id: 'medium', label: '₹2.5L - ₹6L' },
                  { id: 'high', label: '> ₹6 Lakh' },
                ].map((inc) => (
                  <button
                    key={inc.id}
                    onClick={() => setIncomeRange(inc.id as any)}
                    className={`py-2 rounded-xl text-center font-bold border transition ${
                      incomeRange === inc.id
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    {inc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Extra toggles */}
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-300">{t('Do you already own a permanent pucca house?', 'क्या आपके पास पक्का मकान है?')}</span>
                <input
                  type="checkbox"
                  checked={hasPuccaHouse}
                  onChange={(e) => setHasPuccaHouse(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 accent-amber-500"
                />
              </label>
              <div className="h-px bg-slate-700/50" />
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-300">{t('Do you have a daughter below 10 years of age?', 'क्या आपके 10 वर्ष से कम आयु की बेटी है?')}</span>
                <input
                  type="checkbox"
                  checked={hasGirlChild}
                  onChange={(e) => setHasGirlChild(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 accent-amber-500"
                />
              </label>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t('Calculate Eligible Schemes', 'पात्र योजनाएं खोजें')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: RESULTS */}
        {step === 2 && (
          <div className="my-4 space-y-3">
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-300">
                    {t('Eligibility Match Complete!', 'पात्रता मिलान पूर्ण!')}
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    {t(
                      `You qualify for ${matched.length} major Central & State schemes.`,
                      `आप ${matched.length} प्रमुख सरकारी योजनाओं हेतु पात्र पाए गए हैं।`
                    )}
                  </p>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                title={t('Recalculate', 'पुनः जांचें')}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-[50vh] overflow-y-auto no-scrollbar pr-0.5">
              {matched.map((scheme) => (
                <div
                  key={scheme.id}
                  onClick={() => {
                    onClose();
                    onSelectScheme(scheme);
                  }}
                  className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/40 transition cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                        {lang === 'hi' ? scheme.categoryHi : scheme.category}
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-100 truncate mt-1 group-hover:text-amber-300">
                      {lang === 'hi' ? scheme.nameHi : scheme.nameEn}
                    </h5>
                    <p className="text-[11px] text-emerald-400 font-semibold truncate mt-0.5">
                      {scheme.financialBenefit}
                    </p>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-0.5 transition shrink-0" />
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold transition"
            >
              {t('Done', 'पूर्ण')}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
