import { useState, useEffect, useCallback } from 'react';

const THEME_KEY = 'interviewer-theme';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      const saved = localStorage.getItem(THEME_KEY);
      if (!saved) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    document.documentElement.classList.add('theme-transition');
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 300);
  }, []);

  return { theme, toggleTheme };
}
