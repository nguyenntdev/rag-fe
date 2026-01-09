import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import vi from './locales/vi.json';
import en from './locales/en.json';
import zh from './locales/zh.json';
import km from './locales/km.json';

const resources = {
  vi: { translation: vi },
  en: { translation: en },
  zh: { translation: zh },
  km: { translation: km },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'vi',
    defaultNS: 'translation',

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    react: {
      useSuspense: false, // Disable suspense for better compatibility
    },
  });

export default i18n;

// Language configuration for use in components
export const languages = [
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳', dir: 'ltr' },
  { code: 'en', name: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'zh', name: '中文', flag: '🇨🇳', dir: 'ltr' },
  { code: 'km', name: 'ភាសាខ្មែរ', flag: '🇰🇭', dir: 'ltr' },
];

// Helper function to get current language info
export const getCurrentLanguage = () => {
  const currentCode = i18n.language || 'vi';
  return languages.find(lang => lang.code === currentCode) || languages[0];
};

// Helper function to change language
export const changeLanguage = (langCode) => {
  return i18n.changeLanguage(langCode);
};
