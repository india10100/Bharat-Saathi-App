import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Filter, RotateCcw, Globe, SlidersHorizontal, X } from 'lucide-react';
import { STATES_LIST } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';

export interface FilterState {
  languageFilter: 'all' | 'hi' | 'en';
  govtCategory: string;
  jobCategory: string;
  newsCategory: string;
  state: string;
  qualification: string;
  statusFilter: string;
}

interface FilterBarProps {
  currentTab: 'home' | 'govt' | 'news' | 'private' | 'schemes' | 'biodata';
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  currentTab,
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  const { t } = useLanguage();

  const update = (partial: Partial<FilterState>) => {
    onFilterChange({ ...filters, ...partial });
  };

  const isFiltered =
    filters.govtCategory !== 'All' ||
    filters.jobCategory !== 'All' ||
    filters.newsCategory !== 'All' ||
    filters.qualification !== 'All';

  // Fast 1-tap browsing pills designed for kids, parents & citizens
  const getChips = () => {
    if (currentTab === 'govt') {
      return [
        { id: 'All', emoji: '🌟', labelEn: 'All Jobs', labelHi: 'सभी नौकरियां' },
        { id: '10th', emoji: '🎒', labelEn: '10th Pass', labelHi: '10वीं पास' },
        { id: '12th', emoji: '🎓', labelEn: '12th Pass', labelHi: '12वीं पास' },
        { id: 'Railways', emoji: '🚂', labelEn: 'Railways', labelHi: 'रेलवे' },
        { id: 'Police', emoji: '👮', labelEn: 'Police', labelHi: 'पुलिस' },
        { id: 'Defense', emoji: '🎖️', labelEn: 'Defense', labelHi: 'सेना भर्ती' },
        { id: 'Banking', emoji: '🏦', labelEn: 'Bank', labelHi: 'बैंक' },
      ];
    }
    if (currentTab === 'news') {
      return [
        { id: 'All', emoji: '🌟', labelEn: 'All News', labelHi: 'सभी खबरें' },
        { id: 'Yojana & Policy', emoji: '🎁', labelEn: 'Schemes', labelHi: 'योजनाएं' },
        { id: 'Exams & Education', emoji: '🎒', labelEn: 'Exams', labelHi: 'स्कूल-परीक्षा' },
        { id: 'National', emoji: '🇮🇳', labelEn: 'National', labelHi: 'राष्ट्रीय' },
        { id: 'Jobs & Economy', emoji: '💼', labelEn: 'Jobs', labelHi: 'रोजगार' },
      ];
    }
    if (currentTab === 'private') {
      return [
        { id: 'All', emoji: '🌟', labelEn: 'All Openings', labelHi: 'सभी अवसर' },
        { id: 'PM Internship', emoji: '🎁', labelEn: 'PM Internship (₹5k)', labelHi: 'पीएम इंटर्नशिप' },
        { id: '10th', emoji: '🎒', labelEn: '10th/12th Pass', labelHi: '10वीं/12वीं' },
        { id: 'Work From Home', emoji: '🏡', labelEn: 'Work From Home', labelHi: 'घर से काम' },
        { id: 'Tech', emoji: '💻', labelEn: 'Computer/IT', labelHi: 'कंप्यूटर' },
      ];
    }
    return [];
  };

  const chips = getChips();
  if (chips.length === 0) return null;

  return (
    <div className="py-1">
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {/* Reset Chip if filtered */}
        {isFiltered && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold shrink-0 transition hover:bg-amber-500/30 cursor-pointer"
            title={t('Clear filters', 'फिल्टर हटाएं')}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('Reset', 'रीसेट')}</span>
          </button>
        )}

        {chips.map((chip) => {
          let isSelected = false;
          if (chip.id === '10th') isSelected = filters.qualification === '10th Pass';
          else if (chip.id === '12th') isSelected = filters.qualification === '12th Pass';
          else if (chip.id === 'All') {
            isSelected = !isFiltered;
          } else if (currentTab === 'govt') isSelected = filters.govtCategory === chip.id;
          else if (currentTab === 'news') isSelected = filters.newsCategory === chip.id;
          else if (currentTab === 'private') isSelected = filters.jobCategory === chip.id;

          return (
            <button
              key={chip.id}
              onClick={() => {
                if (chip.id === 'All') {
                  onResetFilters();
                } else if (chip.id === '10th') {
                  update({ qualification: '10th Pass', govtCategory: 'All', jobCategory: 'All' });
                } else if (chip.id === '12th') {
                  update({ qualification: '12th Pass', govtCategory: 'All', jobCategory: 'All' });
                } else if (currentTab === 'govt') {
                  update({ govtCategory: chip.id, qualification: 'All' });
                } else if (currentTab === 'news') {
                  update({ newsCategory: chip.id });
                } else if (currentTab === 'private') {
                  update({ jobCategory: chip.id, qualification: 'All' });
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 select-none ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/90 hover:bg-slate-750 text-slate-200 border border-slate-700/80'
              }`}
            >
              <span className="text-sm">{chip.emoji}</span>
              <span>{t(chip.labelEn, chip.labelHi)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
