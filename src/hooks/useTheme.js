import { useState, useEffect } from 'react';

// Define available themes
export const AVAILABLE_THEMES = {
  'dark': {
    name: 'Dark',
    type: 'dark',
    colors: {
      bg: {
        primary: '#1e1e1e',
        secondary: '#252526',
        toolbar: '#2d2d30',
        sidebar: '#1f1f1f',
        accent: '#007acc'
      },
      text: {
        primary: '#cccccc',
        secondary: '#9ca3af',
        accent: '#60a5fa'
      },
      border: {
        primary: '#374151',
        secondary: '#4b5563'
      },
      code: {
        bg: '#1f2937',
        border: '#374151',
        text: '#e5e7eb'
      }
    }
  },
  'light': {
    name: 'Light',
    type: 'light',
    colors: {
      bg: {
        primary: '#ffffff',
        secondary: '#f5f5f5',
        toolbar: '#e5e5e5',
        sidebar: '#f8f9fa',
        accent: '#0066cc'
      },
      text: {
        primary: '#333333',
        secondary: '#666666',
        accent: '#0066cc'
      },
      border: {
        primary: '#e5e5e5',
        secondary: '#d1d5db'
      },
      code: {
        bg: '#f8f9fa',
        border: '#e9ecef',
        text: '#212529'
      }
    }
  },
  'dark-blue': {
    name: 'Dark Blue',
    type: 'dark',
    colors: {
      bg: {
        primary: '#0f1419',
        secondary: '#1a1f29',
        toolbar: '#232834',
        sidebar: '#151a21',
        accent: '#39a7ff'
      },
      text: {
        primary: '#e6e6e6',
        secondary: '#b3b3b3',
        accent: '#39a7ff'
      },
      border: {
        primary: '#2d3748',
        secondary: '#4a5568'
      },
      code: {
        bg: '#1a1f29',
        border: '#2d3748',
        text: '#e6e6e6'
      }
    }
  },
  'monokai': {
    name: 'Monokai',
    type: 'dark',
    colors: {
      bg: {
        primary: '#2d2a2e',
        secondary: '#403e41',
        toolbar: '#4a474b',
        sidebar: '#2c292d',
        accent: '#fd9353'
      },
      text: {
        primary: '#fcfcfa',
        secondary: '#b5b3aa',
        accent: '#fd9353'
      },
      border: {
        primary: '#5b595c',
        secondary: '#6d6b6e'
      },
      code: {
        bg: '#403e41',
        border: '#5b595c',
        text: '#fcfcfa'
      }
    }
  },
  'solarized-light': {
    name: 'Solarized Light',
    type: 'light',
    colors: {
      bg: {
        primary: '#fdf6e3',
        secondary: '#eee8d5',
        toolbar: '#e3dbbc',
        sidebar: '#f7f1e0',
        accent: '#268bd2'
      },
      text: {
        primary: '#657b83',
        secondary: '#93a1a1',
        accent: '#268bd2'
      },
      border: {
        primary: '#d3cbb7',
        secondary: '#c9c0a7'
      },
      code: {
        bg: '#eee8d5',
        border: '#d3cbb7',
        text: '#657b83'
      }
    }
  },
  'high-contrast': {
    name: 'High Contrast',
    type: 'dark',
    colors: {
      bg: {
        primary: '#000000',
        secondary: '#1c1c1c',
        toolbar: '#262626',
        sidebar: '#0d0d0d',
        accent: '#00ff00'
      },
      text: {
        primary: '#ffffff',
        secondary: '#cccccc',
        accent: '#00ff00'
      },
      border: {
        primary: '#666666',
        secondary: '#999999'
      },
      code: {
        bg: '#1c1c1c',
        border: '#666666',
        text: '#ffffff'
      }
    }
  }
};

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [isLoading, setIsLoading] = useState(true);

  // Load theme preference on startup
  useEffect(() => {
    try {
      // First check if there's a theme in the main settings
      const savedSettings = localStorage.getItem('markdown-editor-settings');
      let themeToLoad = 'dark'; // default
      
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed.theme && AVAILABLE_THEMES[parsed.theme]) {
          themeToLoad = parsed.theme;
        }
      } else {
        // Fallback to old theme storage
        const savedTheme = localStorage.getItem('markdown-editor-theme');
        if (savedTheme && AVAILABLE_THEMES[savedTheme]) {
          themeToLoad = savedTheme;
        }
      }
      
      setCurrentTheme(themeToLoad);
      setIsLoading(false);
    } catch (error) {
      console.log('Could not load theme:', error);
      setIsLoading(false);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    const theme = AVAILABLE_THEMES[currentTheme];
    if (!theme) return;

    // Update document class for global theme styling
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme.type);

    // Apply CSS custom properties for dynamic theming
    const root = document.documentElement;
    const colors = theme.colors;

    root.style.setProperty('--color-bg-primary', colors.bg.primary);
    root.style.setProperty('--color-bg-secondary', colors.bg.secondary);
    root.style.setProperty('--color-bg-toolbar', colors.bg.toolbar);
    root.style.setProperty('--color-bg-sidebar', colors.bg.sidebar);
    root.style.setProperty('--color-bg-accent', colors.bg.accent);
    
    root.style.setProperty('--color-text-primary', colors.text.primary);
    root.style.setProperty('--color-text-secondary', colors.text.secondary);
    root.style.setProperty('--color-text-accent', colors.text.accent);
    
    root.style.setProperty('--color-border-primary', colors.border.primary);
    root.style.setProperty('--color-border-secondary', colors.border.secondary);
    
    root.style.setProperty('--color-code-bg', colors.code.bg);
    root.style.setProperty('--color-code-border', colors.code.border);
    root.style.setProperty('--color-code-text', colors.code.text);

    // Save theme preference to main settings
    try {
      const savedSettings = localStorage.getItem('markdown-editor-settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        parsed.theme = currentTheme;
        localStorage.setItem('markdown-editor-settings', JSON.stringify(parsed));
      } else {
        // Create new settings object with theme
        const newSettings = { theme: currentTheme };
        localStorage.setItem('markdown-editor-settings', JSON.stringify(newSettings));
      }
      
      // Also save to old location for backward compatibility
      localStorage.setItem('markdown-editor-theme', currentTheme);
    } catch (error) {
      console.log('Could not save theme:', error);
    }
  }, [currentTheme]);

  const setTheme = (themeName) => {
    if (AVAILABLE_THEMES[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  const toggleTheme = () => {
    const currentType = AVAILABLE_THEMES[currentTheme].type;
    // Toggle between first light and first dark theme
    const firstLight = Object.keys(AVAILABLE_THEMES).find(key => 
      AVAILABLE_THEMES[key].type === 'light'
    );
    const firstDark = Object.keys(AVAILABLE_THEMES).find(key => 
      AVAILABLE_THEMES[key].type === 'dark'
    );
    
    setCurrentTheme(currentType === 'dark' ? firstLight : firstDark);
  };

  const theme = AVAILABLE_THEMES[currentTheme];
  const isDarkMode = theme.type === 'dark';

  return {
    currentTheme,
    theme,
    isDarkMode,
    isLoading,
    setTheme,
    toggleTheme,
    availableThemes: AVAILABLE_THEMES
  };
};