import { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { storage } from '../utils/helpers';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = storage.get('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      storage.set('theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      return newTheme;
    });
  }, []);

  const value = useMemo(() => ({
    theme,
    toggleTheme
  }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;