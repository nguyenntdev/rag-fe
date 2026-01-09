import { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n';

const LanguageContext = createContext(null);

const LANGUAGE_KEY = 'heritage-language';

const languages = [
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳', dir: 'ltr' },
  { code: 'en', name: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'zh', name: '中文', flag: '🇨🇳', dir: 'ltr' },
  { code: 'km', name: 'ភាសាខ្មែរ', flag: '🇰🇭', dir: 'ltr' },
];

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Try to get saved language from localStorage
    const saved = localStorage.getItem(LANGUAGE_KEY);
    if (saved && languages.find(l => l.code === saved)) {
      return saved;
    }
    // Try browser language
    const browserLang = navigator.language?.split('-')[0];
    if (languages.find(l => l.code === browserLang)) {
      return browserLang;
    }
    // Default to Vietnamese
    return 'vi';
  });

  useEffect(() => {
    // Update i18n language
    i18n.changeLanguage(currentLanguage);
    // Save to localStorage
    localStorage.setItem(LANGUAGE_KEY, currentLanguage);
    // Update document lang attribute
    document.documentElement.lang = currentLanguage;
    // Update text direction if needed
    const langConfig = languages.find(l => l.code === currentLanguage);
    document.documentElement.dir = langConfig?.dir || 'ltr';
  }, [currentLanguage]);

  const changeLanguage = (langCode) => {
    if (languages.find(l => l.code === langCode)) {
      setCurrentLanguage(langCode);
    }
  };

  const getCurrentLanguageInfo = () => {
    return languages.find(l => l.code === currentLanguage) || languages[0];
  };

  const value = {
    currentLanguage,
    changeLanguage,
    languages,
    getCurrentLanguageInfo,
    t: i18n.t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
