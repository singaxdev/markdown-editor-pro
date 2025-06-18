import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark theme

  // Load theme preference on startup
  useEffect(() => {
    // In a real app, you'd save this to localStorage or electron-store
    // For now, we'll use in-memory storage for Electron compatibility
    console.log('Theme loaded:', isDarkMode ? 'dark' : 'light');
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = {
    // Background colors
    bg: {
      primary: isDarkMode ? '#1e1e1e' : '#ffffff',
      secondary: isDarkMode ? '#252526' : '#f5f5f5',
      toolbar: isDarkMode ? '#2d2d30' : '#e5e5e5',
      accent: isDarkMode ? '#007acc' : '#0066cc'
    },
    // Text colors
    text: {
      primary: isDarkMode ? '#cccccc' : '#333333',
      secondary: isDarkMode ? '#9ca3af' : '#666666',
      accent: isDarkMode ? '#60a5fa' : '#0066cc'
    },
    // Border colors
    border: {
      primary: isDarkMode ? '#374151' : '#e5e5e5',
      secondary: isDarkMode ? '#4b5563' : '#d1d5db'
    },
    // Code block colors
    code: {
      bg: isDarkMode ? '#1f2937' : '#f8f9fa',
      border: isDarkMode ? '#374151' : '#e9ecef',
      text: isDarkMode ? '#e5e7eb' : '#212529'
    }
  };

  return {
    isDarkMode,
    theme,
    toggleTheme
  };
};