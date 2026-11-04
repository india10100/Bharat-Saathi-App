import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { BookOpen, Sparkles, Trophy, Clock, CheckCircle2, XCircle, RotateCcw, Volume2, VolumeX, ExternalLink, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuizQuestion {
  id: number;
  questionEn: string;
  questionHi: string;
  optionsEn: string[];
  optionsHi: string[];
  correctIndex: number;
  explanationEn: string;
  explanationHi: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    questionEn: 'Which is the largest river in India by volume and national river of India?',
    questionHi: 'भारत की राष्ट्रीय नदी और सबसे प्रमुख नदी कौन सी है?',
    optionsEn: ['Yamuna', 'Ganga', 'Godavari', 'Narmada'],
    optionsHi: ['यमुना', 'गंगा', 'गोदावरी', 'नर्मदा'],
    correctIndex: 1,
    explanationEn: 'The Ganga (2,525 km) is the national river of India and considered sacred across the country.',
    explanationHi: 'गंगा नदी (2,525 किमी) भारत की राष्ट्रीय नदी है और देश की सबसे पावन नदी मानी जाती है।',
  },
  {
    id: 2,
    questionEn: 'Who is known as the "Father of the Indian Constitution"?',
    questionHi: 'भारतीय संविधान के मुख्य निर्माता (जनक) के रूप में किन्हें जाना जाता है?',
    optionsEn: ['Mahatma Gandhi', 'Dr. B.R. Ambedkar', 'Jawaharlal Nehru', 'Sardar Patel'],
    optionsHi: ['महात्मा गांधी', 'डॉ. भीमराव आंबेडकर', 'जवाहरलाल नेहरू', 'सरदार वल्लभभाई पटेल'],
    correctIndex: 1,
    explanationEn: 'Dr. Bhimrao Ramji Ambedkar was the Chairman of the Drafting Committee of the Indian Constitution.',
    explanationHi: 'डॉ. भीमराव आंबेडकर संविधान प्रारूप समिति के अध्यक्ष थे और उन्होंने देश को समानता का संविधान दिया।',
  },
  {
    id: 3,
    questionEn: 'What is the full form of ISRO, India\'s premier space agency?',
    questionHi: 'भारत की शीर्ष अंतरिक्ष संस्था इसरो (ISRO) का पूरा नाम क्या है?',
    optionsEn: [
      'Indian Satellite Research Office',
      'Indian Space Research Organisation',
      'International Space Rocket Order',
      'Indian Scientific Rocket Operation',
    ],
    optionsHi: [
      'इंडियन सैटेलाइट रिसर्च ऑफिस',
      'इंडियन स्पेस रिसर्च ऑर्गनाइजेशन (भारतीय अंतरिक्ष अनुसंधान संगठन)',
      'इंटरनेशनल स्पेस रॉकेट ऑर्डर',
      'इंडियन साइंटिफिक रॉकेट ऑपरेशन',
    ],
    correctIndex: 1,
    explanationEn: 'ISRO stands for Indian Space Research Organisation, headquartered in Bengaluru.',
    explanationHi: 'इसरो का पूरा नाम इंडियन स्पेस रिसर्च ऑर्गनाइजेशन है, जिसका मुख्यालय बेंगलुरु में है।',
  },
  {
    id: 4,
    questionEn: 'How many spokes are there in the Ashoka Chakra on the Indian National Flag?',
    questionHi: 'भारतीय राष्ट्रीय ध्वज (तिरंगे) के अशोक चक्र में कितनी तीलियां होती हैं?',
    optionsEn: ['12', '18', '24', '36'],
    optionsHi: ['12', '18', '24', '36'],
    correctIndex: 2,
    explanationEn: 'The Ashoka Chakra has 24 spokes representing 24 hours of constant righteous motion and duty.',
    explanationHi: 'अशोक चक्र में 24 तीलियां होती हैं, जो दिन के 24 घंटे निरंतर प्रगति और कर्तव्य का प्रतीक हैं।',
  },
  {
    id: 5,
    questionEn: 'Which vitamin is synthesized in our body when skin is exposed to morning sunlight?',
    questionHi: 'सुबह की धूप में बैठने से हमारे शरीर को कौन-सा विटामिन प्राकृतिक रूप से मिलता है?',
    optionsEn: ['Vitamin A', 'Vitamin C', 'Vitamin D', 'Vitamin B12'],
    optionsHi: ['विटामिन ए', 'विटामिन सी', 'विटामिन डी', 'विटामिन बी12'],
    correctIndex: 2,
    explanationEn: 'Vitamin D is synthesized when sunlight interacts with skin cholesterol, strengthening bones and immunity.',
    explanationHi: 'धूप से शरीर में विटामिन डी का निर्माण होता है, जो हड्डियों और रोग प्रतिरोधक क्षमता को मजबूत बनाता है।',
  },
];

const STUDY_FLASHCARDS = [
  {
    id: 'f-1',
    emoji: '📐',
    titleEn: 'Math Shortcut: Area of Circle',
    titleHi: 'गणित सूत्र: वृत्त का क्षेत्रफल',
    contentEn: 'Area = π × r² (where π ≈ 22/7 or 3.14, and r is radius). Circumference = 2 × π × r.',
    contentHi: 'क्षेत्रफल = π × r² (जहां π = 22/7 या 3.14, r = त्रिज्या)। परिधि = 2 × π × r।',
  },
  {
    id: 'f-2',
    emoji: '🇮🇳',
    titleEn: 'Civics: Fundamental Rights',
    titleHi: 'नागरिक शास्त्र: मूल अधिकार',
    contentEn: 'Part III of Indian Constitution guarantees 6 Fundamental Rights to all citizens: Equality, Freedom, Against Exploitation, Religion, Culture & Education, and Constitutional Remedies.',
    contentHi: 'भारतीय संविधान का भाग 3 सभी नागरिकों को 6 मूल अधिकार देता है: समानता, स्वतंत्रता, शोषण के विरुद्ध अधिकार, धार्मिक स्वतंत्रता, संस्कृति व शिक्षा, और संवैधानिक उपचार।',
  },
  {
    id: 'f-3',
    emoji: '🔬',
    titleEn: 'Science: States of Matter',
    titleHi: 'विज्ञान: पदार्थ की 3 मुख्य अवस्थाएं',
    contentEn: 'Solid (fixed shape & volume), Liquid (fixed volume, takes shape of container), Gas (no fixed shape or volume, fills space).',
    contentHi: 'ठोस (निश्चित आकार व आयतन), द्रव (निश्चित आयतन, बर्तन का आकार लेता है), गैस (कोई निश्चित आकार या आयतन नहीं)।',
  },
  {
    id: 'f-4',
    emoji: '🌍',
    titleEn: 'Geography: 7 Continents of Earth',
    titleHi: 'भूगोल: पृथ्वी के 7 महाद्वीप',
    contentEn: 'Asia (Largest), Africa, North America, South America, Antarctica, Europe, and Australia (Smallest). India is in Asia.',
    contentHi: 'एशिया (सबसे बड़ा), अफ्रीका, उत्तरी अमेरिका, दक्षिणी अमेरिका, अंटार्कटिका, यूरोप, और ऑस्ट्रेलिया (सबसे छोटा)। भारत एशिया में है।',
  },
];

export const StudentLearningHub: React.FC = () => {
  const { lang, t } = useLanguage();

  // Quiz States
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Study Timer (Pomodoro 25 mins)
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Audio Speech state
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (index: number) => {
    if (selectedOption !== null) return; // already answered
    setSelectedOption(index);
    setShowExplanation(true);
    if (index === QUIZ_QUESTIONS[currentQIndex].correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setQuizFinished(false);
  };

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

  const currentQ = QUIZ_QUESTIONS[currentQIndex];

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border-2 border-blue-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-300 border border-blue-500/40 text-2xl shadow">
            🎒
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase">
                Section 7
              </span>
              <span className="text-xs font-bold text-emerald-400">
                {t('For All Students & Kids', 'सभी विद्यार्थियों व बच्चों हेतु')}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white mt-0.5">
              {t('Student Learning & Quiz Hub', 'छात्र शिक्षा व अध्ययन केंद्र')}
            </h2>
            <p className="text-xs text-slate-300">
              {t(
                'Fun 60-second quiz, digital school textbooks, GK flashcards, and a 25-minute study timer.',
                'मजेदार 60-सेकंड सामान्य ज्ञान क्विज, मुफ्त डिजिटल किताबें, और 25 मिनट का पढ़ाई टाइमर।'
              )}
            </p>
          </div>
        </div>

        {/* 25-Min Study Focus Timer */}
        <div className="w-full sm:w-auto p-3 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-center justify-between sm:justify-start gap-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-[10px] font-bold text-slate-400 block">{t('Focus Study Timer', 'पढ़ाई टाइमर')}</span>
              <span className="text-sm font-black text-amber-400 font-mono">{formatTimer(timerSeconds)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              title={isTimerRunning ? 'Pause' : 'Start'}
            >
              {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
            </button>
            <button
              onClick={() => {
                setIsTimerRunning(false);
                setTimerSeconds(25 * 60);
              }}
              className="p-1.5 rounded-xl bg-slate-700 text-slate-300 hover:text-white"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* FEATURE 1: 60-SECOND STUDENT PRACTICE QUIZ */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-850 border-2 border-amber-500/40 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm sm:text-base font-black text-white">
              {t('Daily Student GK Quiz (Test Your Knowledge)', 'दैनिक छात्र सामान्य ज्ञान क्विज')}
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black">
            {t(`Question ${currentQIndex + 1} of ${QUIZ_QUESTIONS.length}`, `प्रश्न ${currentQIndex + 1} / ${QUIZ_QUESTIONS.length}`)}
          </span>
        </div>

        {!quizFinished ? (
          <div className="space-y-3">
            {/* Question Card */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-700 flex items-start justify-between gap-2">
              <h4 className="text-sm sm:text-base font-black text-white leading-snug">
                {lang === 'hi' ? currentQ.questionHi : currentQ.questionEn}
              </h4>
              <button
                onClick={() =>
                  handleSpeak(
                    lang === 'hi' ? currentQ.questionHi : currentQ.questionEn,
                    `quiz-q-${currentQ.id}`
                  )
                }
                className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-amber-400 shrink-0"
              >
                {speakingId === `quiz-q-${currentQ.id}` ? (
                  <VolumeX className="w-4 h-4 text-amber-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* 4 Multiple Choice Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(lang === 'hi' ? currentQ.optionsHi : currentQ.optionsEn).map((opt, idx) => {
                let btnStyle = 'bg-slate-800/90 border-slate-700 text-slate-200 hover:border-amber-400';
                if (selectedOption !== null) {
                  if (idx === currentQ.correctIndex) {
                    btnStyle = 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-black';
                  } else if (selectedOption === idx) {
                    btnStyle = 'bg-rose-500/20 border-rose-400 text-rose-300 font-bold';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={selectedOption !== null}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-3 rounded-2xl border-2 text-left text-xs font-bold transition flex items-center justify-between gap-2 cursor-pointer ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {selectedOption !== null && idx === currentQ.correctIndex && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    {selectedOption === idx && idx !== currentQ.correctIndex && (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation card after answering */}
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-200 flex items-start gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <strong className="text-amber-300 block mb-0.5">
                    {selectedOption === currentQ.correctIndex ? t('Correct! शाबाश!', 'सही उत्तर! शाबाश!') : t('Nice try!', 'कोई बात नहीं, सीखें!')}
                  </strong>
                  <p>{lang === 'hi' ? currentQ.explanationHi : currentQ.explanationEn}</p>
                </div>
              </motion.div>
            )}

            {/* Next Button */}
            {selectedOption !== null && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition cursor-pointer"
                >
                  {currentQIndex < QUIZ_QUESTIONS.length - 1 ? t('Next Question', 'अगला प्रश्न') : t('See Score', 'स्कोर देखें')}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Finished Card */
          <div className="py-6 text-center space-y-3">
            <span className="text-4xl block">🎉 🏆</span>
            <h4 className="text-lg font-black text-white">
              {t('Quiz Completed!', 'क्विज पूरा हुआ!')}
            </h4>
            <p className="text-sm font-bold text-amber-400">
              {t(`You scored ${score} out of ${QUIZ_QUESTIONS.length}!`, `आपका स्कोर: ${score} में से ${QUIZ_QUESTIONS.length} अंक!`)}
            </p>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              {score >= 4
                ? t('Outstanding knowledge! Keep shining in your school & exams.', 'शानदार ज्ञान! अपनी पढ़ाई और परीक्षाओं में ऐसे ही चमकते रहें।')
                : t('Good effort! Practice makes perfect. Try again anytime.', 'अच्छा प्रयास! अभ्यास से सब आसान हो जाता है। पुनः प्रयास करें।')}
            </p>
            <button
              onClick={handleRestartQuiz}
              className="px-5 py-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow cursor-pointer"
            >
              {t('Play Again', 'दोबारा खेलें')}
            </button>
          </div>
        )}
      </div>

      {/* FEATURE 2: STUDY FLASHCARDS & SHORTCUTS */}
      <div className="space-y-3">
        <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
          <span>📚</span>
          <span>{t('Daily Knowledge Flashcards & Formulas', 'दैनिक ज्ञान व फॉर्मूला कार्ड')}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {STUDY_FLASHCARDS.map((card) => (
            <div
              key={card.id}
              className="p-3.5 rounded-3xl bg-slate-800/80 border border-slate-700/80 hover:border-blue-400/50 shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-2xl">{card.emoji}</span>
                  <button
                    onClick={() =>
                      handleSpeak(
                        lang === 'hi' ? `${card.titleHi}. ${card.contentHi}` : `${card.titleEn}. ${card.contentEn}`,
                        card.id
                      )
                    }
                    className="p-1.5 rounded-xl bg-slate-900 text-slate-300 hover:text-amber-400"
                  >
                    {speakingId === card.id ? <VolumeX className="w-3.5 h-3.5 text-amber-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <h4 className="text-xs sm:text-sm font-black text-amber-300">
                  {lang === 'hi' ? card.titleHi : card.titleEn}
                </h4>
                <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                  {lang === 'hi' ? card.contentHi : card.contentEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURE 3: OFFICIAL FREE DIGITAL EDUCATION PORTALS */}
      <div className="p-4 rounded-3xl bg-slate-850 border border-slate-800 space-y-2.5">
        <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
          <span>🏛️</span>
          <span>{t('Free Government Student Portals (Textbooks & Classes)', 'मुफ्त सरकारी डिजिटल शिक्षा पोर्टल')}</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <a
            href="https://diksha.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-between group"
          >
            <div>
              <span className="font-black text-blue-300 block">DIKSHA Portal</span>
              <span className="text-[10px] text-slate-400 block">{t('Class 1 to 12 Video Lessons', '1 से 12वीं तक वीडियो पाठ')}</span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-400 shrink-0" />
          </a>

          <a
            href="https://epathshala.nic.in"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-between group"
          >
            <div>
              <span className="font-black text-emerald-300 block">e-Pathshala</span>
              <span className="text-[10px] text-slate-400 block">{t('Free NCERT Digital Books', 'मुफ्त एनसीईआरटी पाठ्यपुस्तकें')}</span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 shrink-0" />
          </a>

          <a
            href="https://swayam.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-between group"
          >
            <div>
              <span className="font-black text-amber-300 block">SWAYAM</span>
              <span className="text-[10px] text-slate-400 block">{t('Free College & Skill Courses', 'मुफ्त कॉलेज व कौशल कोर्स')}</span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-amber-400 shrink-0" />
          </a>
        </div>
      </div>
    </div>
  );
};
