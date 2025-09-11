'use client';

import { Palette } from 'lucide-react';
import { useEffect } from 'react';
import { useTheme } from 'next-themes';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  // On initial load, set the theme based on localStorage
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme || 'light');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      className={`cursor-pointer fixed top-4 right-4 p-2 rounded-full w-8 h-8 justify-center items-center transition-colors ${
        theme === 'light'
          ? 'text-gray-600 bg-gray-200 hover:bg-gray-300 hover:text-gray-800'
          : 'text-gray-200 bg-gray-600 hover:bg-gray-600 hover:text-white'
      }`}
      aria-label="Toggle Theme"
      data-theme={theme}
      onClick={toggleTheme}
      title="Toggle Theme"
    >
      <Palette className="h-4 w-4" />
    </button>
  );
}
