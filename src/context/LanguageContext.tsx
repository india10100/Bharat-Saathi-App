import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, SavedItem } from '../types';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (en: string, hi: string) => string;
  selectedState: string;
  setSelectedState: (state: string) => void;
  savedItems: SavedItem[];
  toggleSaveItem: (item: { id: string; type: SavedItem['type']; title: string }) => void;
  isItemSaved: (id: string) => boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('bharat_saathi_lang');
    return (saved === 'hi' || saved === 'en') ? saved : 'hi'; // Default Hindi for Indian mass accessibility
  });

  const [selectedState, setSelectedState] = useState<string>('All India (अखिल भारतीय)');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [savedItems, setSavedItems] = useState<SavedItem[]>(() => {
    try {
      const saved = localStorage.getItem('bharat_saathi_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('bharat_saathi_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('bharat_saathi_bookmarks', JSON.stringify(savedItems));
  }, [savedItems]);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
  };

  const toggleLang = () => {
    setLangState((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const t = (en: string, hi: string): string => {
    return lang === 'hi' ? hi : en;
  };

  const toggleSaveItem = (item: { id: string; type: SavedItem['type']; title: string }) => {
    setSavedItems((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      if (exists) {
        return prev.filter((i) => i.id !== item.id);
      } else {
        return [
          {
            id: item.id,
            type: item.type,
            title: item.title,
            savedAt: new Date().toISOString(),
          },
          ...prev,
        ];
      }
    });
  };

  const isItemSaved = (id: string): boolean => {
    return savedItems.some((item) => item.id === id);
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        t,
        selectedState,
        setSelectedState,
        savedItems,
        toggleSaveItem,
        isItemSaved,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
