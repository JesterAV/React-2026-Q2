'use client';

import { createContext, useEffect, useState, type ReactNode } from 'react';
import { localStorageService } from '../services/localStorage';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const themeKey = 'theme';

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const saved = localStorageService.get(themeKey);

    if (saved === 'light' || saved === 'dark') {
      setTheme(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle(
      'dark-theme',
      theme === 'dark'
    );

    localStorageService.set(themeKey, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme =>
      prevTheme === 'light' ? 'dark' : 'light'
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}