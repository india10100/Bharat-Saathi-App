import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { X, Mail, Lock, User, MapPin, GraduationCap, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, KeyRound, Sparkles } from 'lucide-react';
import { STATES_LIST } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login, signup, resetPassword, updatePasswordWithToken, loginAsDemoUser } = useAuth();
  const { t } = useLanguage();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'reset-code'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [state, setState] = useState('Uttar Pradesh (उत्तर प्रदेश)');
  const [qualification, setQualification] = useState('Graduate');
  const [category, setCategory] = useState<'General' | 'OBC' | 'SC' | 'ST' | 'EWS'>('General');

  // Forgot password states
  const [otpToken, setOtpToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setIsSubmitting(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        setStatusMessage({ type: 'success', text: res.message });
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        setStatusMessage({ type: 'error', text: res.message });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (password !== confirmPassword) {
      setStatusMessage({ type: 'error', text: t('Passwords do not match.', 'पासवर्ड मेल नहीं खा रहे हैं।') });
      return;
    }

    if (password.length < 6) {
      setStatusMessage({ type: 'error', text: t('Password must be at least 6 characters.', 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।') });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await signup({
        name,
        email,
        password,
        state,
        qualification,
        category,
      });

      if (res.success) {
        setStatusMessage({ type: 'success', text: res.message });
        setTimeout(() => {
          onClose();
        }, 900);
      } else {
        setStatusMessage({ type: 'error', text: res.message });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Error creating account.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setIsSubmitting(true);

    try {
      const res = await resetPassword(email);
      if (res.success) {
        setStatusMessage({ type: 'success', text: res.message });
        setMode('reset-code');
      } else {
        setStatusMessage({ type: 'error', text: res.message });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Error initiating password reset.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (newPassword.length < 6) {
      setStatusMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await updatePasswordWithToken(email, otpToken, newPassword);
      if (res.success) {
        setStatusMessage({ type: 'success', text: res.message });
        setTimeout(() => {
          setMode('login');
          setPassword('');
        }, 1500);
      } else {
        setStatusMessage({ type: 'error', text: res.message });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Error completing password reset.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-2xl text-slate-100 max-h-[92vh] overflow-y-auto no-scrollbar"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black text-sm">
              BS
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                {mode === 'login' && t('Sign In to Bharat Saathi', 'भारत साथी में लॉगिन करें')}
                {mode === 'signup' && t('Create Citizen Account', 'नया नागरिक खाता बनाएं')}
                {(mode === 'forgot' || mode === 'reset-code') && t('Reset Your Password', 'पासवर्ड रीसेट करें')}
              </h3>
              <p className="text-[11px] text-slate-400">
                {t('Personalized job alerts & scheme tracker', 'कस्टमाइज्ड नौकरी अलर्ट व योजना ट्रैकर')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`my-3 p-3 rounded-2xl text-xs font-semibold flex items-start gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            )}
            <span className="leading-relaxed">{statusMessage.text}</span>
          </motion.div>
        )}

        {/* Mode Tabs (Login / Signup) */}
        {mode !== 'forgot' && mode !== 'reset-code' && (
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-800/80 my-3.5 border border-slate-700/60">
            <button
              onClick={() => {
                setMode('login');
                setStatusMessage(null);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                mode === 'login' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t('Sign In', 'लॉगिन')}
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setStatusMessage(null);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                mode === 'signup' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t('Sign Up', 'रजिस्टर')}
            </button>
          </div>
        )}

        {/* 1-Click Demo User Button for testing convenience */}
        {mode === 'login' && (
          <button
            onClick={() => {
              loginAsDemoUser();
              setStatusMessage({ type: 'success', text: t('Logged in as Rahul Sharma (Demo Citizen)!', 'राहुल शर्मा (डेमो नागरिक) के रूप में लॉगिन सफल!') });
              setTimeout(onClose, 600);
            }}
            className="w-full mb-3.5 p-2.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center justify-center gap-2 hover:bg-amber-500/25 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{t('1-Click Quick Demo Login (No typing needed)', '1-क्लिक त्वरित डेमो लॉगिन')}</span>
          </button>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-slate-300 mb-1 block">
                {t('Email Address', 'ईमेल पता')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-300">
                  {t('Password', 'पासवर्ड')}
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot');
                    setStatusMessage(null);
                  }}
                  className="text-[11px] text-amber-400 font-bold hover:underline"
                >
                  {t('Forgot Password?', 'पासवर्ड भूल गए?')}
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 mt-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? t('Signing In...', 'लॉगिन हो रहा है...') : t('Sign In', 'लॉगिन करें')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* SIGNUP FORM */}
        {mode === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-2.5">
            <div>
              <label className="text-[11px] font-bold text-slate-300 mb-1 block">
                {t('Full Name', 'पूरा नाम')}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 mb-1 block">
                {t('Email Address', 'ईमेल पता')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rahul@bharat.in"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-300 mb-1 block">
                  {t('Your State', 'राज्य')}
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-100 focus:outline-none"
                >
                  {STATES_LIST.slice(0, 10).map((st) => (
                    <option key={st} value={st}>
                      {st.split(' ')[0]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 mb-1 block">
                  {t('Category', 'श्रेणी')}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-2.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-100 focus:outline-none"
                >
                  <option value="General">General / UR</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-300 mb-1 block">
                  {t('Password', 'पासवर्ड')}
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-300 mb-1 block">
                  {t('Confirm Password', 'पुष्टि करें')}
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 mt-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? t('Creating Account...', 'खाता बन रहा है...') : t('Create Account', 'खाता बनाएं')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-3 my-2">
            <p className="text-xs text-slate-300 leading-relaxed">
              {t(
                'Enter your registered email address. We will generate an instant verification OTP code to reset your password.',
                'अपना पंजीकृत ईमेल पता दर्ज करें। पासवर्ड रीसेट करने के लिए तत्काल सत्यापन ओटीपी कोड प्रदान किया जाएगा।'
              )}
            </p>

            <div>
              <label className="text-[11px] font-bold text-slate-300 mb-1 block">
                {t('Registered Email', 'पंजीकृत ईमेल')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setStatusMessage(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold transition"
              >
                {t('Back to Login', 'लॉगिन पर वापस')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow"
              >
                {isSubmitting ? t('Sending...', 'भेज रहे हैं...') : t('Send OTP Code', 'ओटीपी भेजें')}
              </button>
            </div>
          </form>
        )}

        {/* ENTER OTP & SET NEW PASSWORD FORM */}
        {mode === 'reset-code' && (
          <form onSubmit={handleResetConfirmSubmit} className="space-y-3 my-2">
            <div>
              <label className="text-[11px] font-bold text-slate-300 mb-1 block">
                {t('Enter 6-Digit OTP Code', '6-अंकीय ओटीपी कोड दर्ज करें')}
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpToken}
                  onChange={(e) => setOtpToken(e.target.value)}
                  placeholder="123456"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800/80 border border-amber-500/40 text-xs font-bold text-amber-300 tracking-widest focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 mb-1 block">
                {t('Enter New Password', 'नया पासवर्ड दर्ज करें')}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold transition"
              >
                {t('Resend', 'पुनः भेजें')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow"
              >
                {t('Save New Password', 'नया पासवर्ड सहेजें')}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
