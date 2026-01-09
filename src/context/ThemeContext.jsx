import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

const THEME_KEY = 'heritage-theme';
const FONT_SIZE_KEY = 'heritage-font-size';

// Font size options
export const fontSizes = [
  { id: 'small', label: 'Nhỏ', scale: 0.875, labelEn: 'Small' },
  { id: 'normal', label: 'Bình thường', scale: 1, labelEn: 'Normal' },
  { id: 'large', label: 'Lớn', scale: 1.125, labelEn: 'Large' },
  { id: 'xlarge', label: 'Rất lớn', scale: 1.25, labelEn: 'Extra Large' },
];

export function ThemeProvider({ children }) {
  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved !== null) {
      return saved === 'dark';
    }
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Font size state
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem(FONT_SIZE_KEY);
    if (saved && fontSizes.find(f => f.id === saved)) {
      return saved;
    }
    return 'normal';
  });

  // Apply dark mode class to document
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Apply font size to document
  useEffect(() => {
    const fontConfig = fontSizes.find(f => f.id === fontSize) || fontSizes[1];
    document.documentElement.style.fontSize = `${fontConfig.scale * 16}px`;
    localStorage.setItem(FONT_SIZE_KEY, fontSize);
  }, [fontSize]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // Only auto-switch if user hasn't manually set a preference
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === null) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const changeFontSize = (sizeId) => {
    if (fontSizes.find(f => f.id === sizeId)) {
      setFontSize(sizeId);
    }
  };

  const increaseFontSize = () => {
    const currentIndex = fontSizes.findIndex(f => f.id === fontSize);
    if (currentIndex < fontSizes.length - 1) {
      setFontSize(fontSizes[currentIndex + 1].id);
    }
  };

  const decreaseFontSize = () => {
    const currentIndex = fontSizes.findIndex(f => f.id === fontSize);
    if (currentIndex > 0) {
      setFontSize(fontSizes[currentIndex - 1].id);
    }
  };

  const getCurrentFontSize = () => {
    return fontSizes.find(f => f.id === fontSize) || fontSizes[1];
  };

  const resetToDefaults = () => {
    setIsDarkMode(false);
    setFontSize('normal');
  };

  const value = {
    // Dark mode
    isDarkMode,
    toggleDarkMode,
    setDarkMode: setIsDarkMode,

    // Font size
    fontSize,
    fontSizes,
    changeFontSize,
    increaseFontSize,
    decreaseFontSize,
    getCurrentFontSize,

    // Reset
    resetToDefaults,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeContext;
