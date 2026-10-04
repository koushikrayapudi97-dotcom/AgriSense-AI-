import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Translations, TRANSLATIONS, SUPPORTED_LANGUAGES, LanguageOption } from './translations.js';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  supportedLanguages: LanguageOption[];
  getCropName: (cropKey: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('agrisense_language') as Language;
      if (saved && ['en', 'te', 'hi', 'ta'].includes(saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('agrisense_language', lang);
    } catch {
      // ignore
    }
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const getCropName = (cropKey: string): string => {
    switch (cropKey) {
      case 'Rice': return t.cropRice;
      case 'Wheat': return t.cropWheat;
      case 'Cotton': return t.cropCotton;
      case 'Maize': return t.cropMaize;
      case 'Sugarcane': return t.cropSugarcane;
      case 'Groundnut': return t.cropGroundnut;
      case 'Chickpea': return t.cropChickpea;
      case 'Mustard': return t.cropMustard;
      default: return cropKey;
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        supportedLanguages: SUPPORTED_LANGUAGES,
        getCropName,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
