import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { BioDataProfile } from '../types';
import { Printer, Download, Plus, Trash2, CheckCircle2, User, FileText, Sparkles, X } from 'lucide-react';
import { motion } from 'motion/react';

interface BioDataBuilderProps {
  onClose?: () => void;
}

export const BioDataBuilder: React.FC<BioDataBuilderProps> = ({ onClose }) => {
  const { lang, t } = useLanguage();
  const { user } = useAuth();

  const [profile, setProfile] = useState<BioDataProfile>({
    fullName: user?.name || 'Rahul Sharma',
    fatherName: 'Shri Ram Sharma',
    dateOfBirth: '1998-05-15',
    gender: 'Male',
    category: (user?.category as any) || 'OBC',
    mobileNumber: user?.phone || '+91 98765 43210',
    email: user?.email || 'rahul.sharma@bharat.in',
    address: 'House No. 42, Civil Lines, Near Railway Station',
    state: user?.state || 'Uttar Pradesh (उत्तर प्रदेश)',
    pinCode: '226001',
    highestQualification: 'Bachelor of Science (B.Sc)',
    qualifications: [
      { course: '10th (High School)', boardOrUniversity: 'UP State Board', passingYear: '2014', percentage: '78.5%' },
      { course: '12th (Intermediate)', boardOrUniversity: 'UP State Board', passingYear: '2016', percentage: '76.0%' },
      { course: 'Graduation (B.Sc)', boardOrUniversity: 'University of Lucknow', passingYear: '2019', percentage: '71.2%' },
    ],
    skills: 'Computer Operations (MS Office, Tally, Basic Internet), Typing Speed (Hindi 30 WPM, English 40 WPM), Public Communication',
    experience: '2 Years Experience as Office Assistant & Data Entry Operator in Regional Logistics Firm',
    languagesKnown: 'Hindi (Fluent), English (Working proficiency)',
    declarationAgreed: true,
  });

  const [previewMode, setPreviewMode] = useState<boolean>(false);

  const loadStudentPreset = () => {
    setProfile({
      fullName: 'Aarav Kumar (आरव कुमार)',
      fatherName: 'Shri Manoj Kumar',
      dateOfBirth: '2008-08-12',
      gender: 'Male',
      category: 'General / UR',
      mobileNumber: '+91 98123 45678',
      email: 'aarav.student@school.in',
      address: 'Plot 12, Vikas Nagar, Sector 4',
      state: 'Uttar Pradesh (उत्तर प्रदेश)',
      pinCode: '226022',
      highestQualification: 'Class 10th (High School)',
      qualifications: [
        { course: 'Class 10th (High School)', boardOrUniversity: 'CBSE Board', passingYear: '2024', percentage: '86.4%' },
        { course: 'Class 11th (Science & Math)', boardOrUniversity: 'Kendriya Vidyalaya', passingYear: '2025', percentage: 'Pursuing' },
      ],
      skills: 'Basic Computer, Painting & Drawing, Cricket Team Captain, Hindi & English Quiz Winner',
      experience: 'School Sports Leader, Active Participant in National Science Exhibition',
      languagesKnown: 'Hindi & English',
      declarationAgreed: true,
    });
    setPreviewMode(true);
  };

  const addQualificationRow = () => {
    setProfile((prev) => ({
      ...prev,
      qualifications: [
        ...prev.qualifications,
        { course: '', boardOrUniversity: '', passingYear: '', percentage: '' },
      ],
    }));
  };

  const removeQualificationRow = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index),
    }));
  };

  const updateQualificationRow = (index: number, field: string, value: string) => {
    setProfile((prev) => {
      const updated = [...prev.qualifications];
      (updated[index] as any)[field] = value;
      return { ...prev, qualifications: updated };
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-slate-850 to-slate-800 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
              <span>{t('Instant Indian Bio-data / Resume Maker', 'भारतीय मानक बायोडाटा एवं रिज्यूमे मेकर')}</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                Free PDF
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {t(
                'Generate standard format bio-data for Sarkari & Private job walk-in interviews',
                'सरकारी और प्राइवेट नौकरियों के लिए मानक प्रारूप में बायोडाटा बनाएं'
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={loadStudentPreset}
            className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold hover:brightness-110 transition shadow flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>🎒</span>
            <span>{t('Student / Kid Bio-data', 'छात्र बायोडाटा')}</span>
          </button>
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold border border-slate-700 transition"
          >
            {previewMode ? t('Edit Form', 'संपादित करें') : t('Preview Sheet', 'बायोडाटा देखें')}
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-slate-950 text-xs font-black shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4 stroke-[2.5]" />
            <span>{t('Print / PDF', 'प्रिंट / PDF')}</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white border border-slate-700 transition cursor-pointer"
              title={t('Close', 'बंद करें')}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* FORM MODE */}
      {!previewMode ? (
        <div className="p-4 sm:p-6 rounded-3xl bg-slate-850 border border-slate-800 space-y-4 no-print text-xs">
          <h4 className="font-bold text-sm text-amber-400 pb-2 border-b border-slate-700/60 flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{t('1. Personal & Contact Information', '1. व्यक्तिगत एवं संपर्क विवरण')}</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-300 mb-1 block">{t('Full Name', 'पूरा नाम')}</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 font-semibold focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 mb-1 block">{t('Father\'s / Husband\'s Name', 'पिता / पति का नाम')}</label>
              <input
                type="text"
                value={profile.fatherName}
                onChange={(e) => setProfile({ ...profile, fatherName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 font-semibold focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 mb-1 block">{t('Date of Birth', 'जन्म तिथि')}</label>
              <input
                type="date"
                value={profile.dateOfBirth}
                onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 font-semibold focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-300 mb-1 block">{t('Gender', 'लिंग')}</label>
                <select
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value as any })}
                  className="w-full px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 font-semibold focus:outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 mb-1 block">{t('Category', 'श्रेणी')}</label>
                <select
                  value={profile.category}
                  onChange={(e) => setProfile({ ...profile, category: e.target.value as any })}
                  className="w-full px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 font-semibold focus:outline-none"
                >
                  <option value="General / UR">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 mb-1 block">{t('Mobile Number', 'मोबाइल नंबर')}</label>
              <input
                type="text"
                value={profile.mobileNumber}
                onChange={(e) => setProfile({ ...profile, mobileNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 font-semibold focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 mb-1 block">{t('Email Address', 'ईमेल पता')}</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 font-semibold focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-300 mb-1 block">{t('Complete Postal Address', 'स्थायी डाक पता')}</label>
              <input
                type="text"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 font-semibold focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Education Table */}
          <div className="pt-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-700/60 mb-2">
              <h4 className="font-bold text-sm text-amber-400">
                {t('2. Academic Qualifications', '2. शैक्षणिक योग्यता')}
              </h4>
              <button
                onClick={addQualificationRow}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center gap-1 hover:bg-amber-500/30"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('Add Course', 'जोड़ें')}</span>
              </button>
            </div>

            <div className="space-y-2">
              {profile.qualifications.map((q, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-slate-800/60 p-2 rounded-xl">
                  <input
                    type="text"
                    placeholder="Exam / Course (e.g. 10th)"
                    value={q.course}
                    onChange={(e) => updateQualificationRow(idx, 'course', e.target.value)}
                    className="col-span-3 px-2.5 py-1.5 rounded-lg bg-slate-850 border border-slate-700 text-slate-100 text-xs font-semibold"
                  />
                  <input
                    type="text"
                    placeholder="Board / University"
                    value={q.boardOrUniversity}
                    onChange={(e) => updateQualificationRow(idx, 'boardOrUniversity', e.target.value)}
                    className="col-span-4 px-2.5 py-1.5 rounded-lg bg-slate-850 border border-slate-700 text-slate-100 text-xs font-semibold"
                  />
                  <input
                    type="text"
                    placeholder="Year"
                    value={q.passingYear}
                    onChange={(e) => updateQualificationRow(idx, 'passingYear', e.target.value)}
                    className="col-span-2 px-2.5 py-1.5 rounded-lg bg-slate-850 border border-slate-700 text-slate-100 text-xs font-semibold"
                  />
                  <input
                    type="text"
                    placeholder="%"
                    value={q.percentage}
                    onChange={(e) => updateQualificationRow(idx, 'percentage', e.target.value)}
                    className="col-span-2 px-2.5 py-1.5 rounded-lg bg-slate-850 border border-slate-700 text-slate-100 text-xs font-semibold"
                  />
                  <button
                    onClick={() => removeQualificationRow(idx)}
                    className="col-span-1 p-1.5 text-slate-400 hover:text-rose-400 text-center"
                  >
                    <Trash2 className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Skills & Experience */}
          <div className="pt-2 space-y-3">
            <div>
              <label className="text-[11px] font-bold text-slate-300 mb-1 block">
                {t('Technical / Computer Skills', 'कंप्यूटर एवं तकनीकी कौशल')}
              </label>
              <textarea
                rows={2}
                value={profile.skills}
                onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs font-semibold focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 mb-1 block">
                {t('Work Experience (if any)', 'कार्य अनुभव (यदि कोई हो)')}
              </label>
              <textarea
                rows={2}
                value={profile.experience}
                onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs font-semibold focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-700/60 flex items-center justify-end gap-2">
            <button
              onClick={() => setPreviewMode(true)}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition"
            >
              {t('Preview Formatted Bio-data Sheet', 'बायोडाटा शीट तैयार देखें')}
            </button>
          </div>
        </div>
      ) : null}

      {/* PRINTABLE STANDARD BIO-DATA SHEET (Indian Standard Format) */}
      <div
        className={`bg-white text-slate-950 p-6 sm:p-10 rounded-2xl shadow-2xl max-w-2xl mx-auto border border-slate-300 font-sans print:shadow-none print:border-none print:p-0 ${
          previewMode ? 'block' : 'hidden print:block'
        }`}
      >
        <div className="border-b-2 border-slate-900 pb-3 mb-4 text-center">
          <h2 className="text-2xl font-black tracking-wider uppercase text-slate-900">
            BIO-DATA
          </h2>
          <p className="text-xs font-semibold text-slate-600 mt-0.5">
            (CURRICULUM VITAE / FOR EMPLOYMENT & INTERVIEW)
          </p>
        </div>

        {/* Personal Details Table */}
        <div className="space-y-1.5 text-xs border-b pb-4 mb-4">
          <div className="grid grid-cols-3 py-1 border-b border-slate-100">
            <span className="font-bold text-slate-700">1. Name of Applicant:</span>
            <span className="col-span-2 font-bold text-slate-950 uppercase">{profile.fullName}</span>
          </div>
          <div className="grid grid-cols-3 py-1 border-b border-slate-100">
            <span className="font-bold text-slate-700">2. Father\'s / Husband\'s Name:</span>
            <span className="col-span-2 text-slate-900">{profile.fatherName}</span>
          </div>
          <div className="grid grid-cols-3 py-1 border-b border-slate-100">
            <span className="font-bold text-slate-700">3. Date of Birth:</span>
            <span className="col-span-2 text-slate-900">{profile.dateOfBirth}</span>
          </div>
          <div className="grid grid-cols-3 py-1 border-b border-slate-100">
            <span className="font-bold text-slate-700">4. Gender / Category:</span>
            <span className="col-span-2 text-slate-900">{profile.gender} &nbsp;|&nbsp; Category: {profile.category}</span>
          </div>
          <div className="grid grid-cols-3 py-1 border-b border-slate-100">
            <span className="font-bold text-slate-700">5. Contact Details:</span>
            <span className="col-span-2 text-slate-900">Mob: {profile.mobileNumber} &nbsp;|&nbsp; Email: {profile.email}</span>
          </div>
          <div className="grid grid-cols-3 py-1 border-b border-slate-100">
            <span className="font-bold text-slate-700">6. Permanent Address:</span>
            <span className="col-span-2 text-slate-900">{profile.address}, {profile.state} - {profile.pinCode}</span>
          </div>
        </div>

        {/* Academic Records Table */}
        <div className="mb-4">
          <h4 className="font-bold text-xs uppercase text-slate-900 mb-2">
            7. Educational Qualifications:
          </h4>
          <table className="w-full text-xs border-collapse border border-slate-400">
            <thead>
              <tr className="bg-slate-100 text-slate-800">
                <th className="border border-slate-400 p-1.5 text-left">Exam / Degree</th>
                <th className="border border-slate-400 p-1.5 text-left">Board / University</th>
                <th className="border border-slate-400 p-1.5 text-center">Year</th>
                <th className="border border-slate-400 p-1.5 text-center">Marks %</th>
              </tr>
            </thead>
            <tbody>
              {profile.qualifications.map((q, idx) => (
                <tr key={idx}>
                  <td className="border border-slate-400 p-1.5 font-semibold">{q.course}</td>
                  <td className="border border-slate-400 p-1.5">{q.boardOrUniversity}</td>
                  <td className="border border-slate-400 p-1.5 text-center">{q.passingYear}</td>
                  <td className="border border-slate-400 p-1.5 text-center font-bold">{q.percentage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Skills & Experience */}
        <div className="space-y-3 text-xs mb-6">
          <div>
            <h4 className="font-bold text-slate-900 uppercase">8. Computer & Technical Skills:</h4>
            <p className="text-slate-800 mt-0.5">{profile.skills}</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 uppercase">9. Work Experience:</h4>
            <p className="text-slate-800 mt-0.5">{profile.experience}</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 uppercase">10. Languages Known:</h4>
            <p className="text-slate-800 mt-0.5">{profile.languagesKnown}</p>
          </div>
        </div>

        {/* Self Declaration & Signature */}
        <div className="pt-4 border-t border-slate-300 text-[11px] text-slate-700">
          <p className="italic">
            <strong>Declaration:</strong> I hereby declare that all the information given above is true and correct to the best of my knowledge and belief.
          </p>

          <div className="flex justify-between items-end mt-8 pt-2">
            <div>
              <p>Place: .............................</p>
              <p className="mt-1">Date: {new Date().toLocaleDateString('en-IN')}</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-900 uppercase mt-4">({profile.fullName})</p>
              <p className="text-[10px] text-slate-500">Signature of Applicant</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
