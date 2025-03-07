import React, { createContext, useState, useContext, useEffect } from 'react';

// Define default settings
const defaultSettings = {
  theme: 'light', // light, dark, system
  textSize: 'medium', // small, medium, large, xl
  uiScale: 'medium', // small, medium, large
  enableWordCount: true, // show word count in content areas
  highContrast: false, // higher contrast for better readability
  reduceMotion: false, // reduce animations
  customAccentColor: '#0071e3', // default accent color
};

// Define scale factors for different text sizes
export const TEXT_SIZES = {
  small: {
    base: '14px',
    lg: '16px',
    xl: '18px',
    xxl: '22px',
    heading: '28px',
  },
  medium: {
    base: '16px',
    lg: '18px',
    xl: '20px', 
    xxl: '24px',
    heading: '32px',
  },
  large: {
    base: '18px',
    lg: '20px',
    xl: '24px',
    xxl: '28px',
    heading: '38px',
  },
  xl: {
    base: '20px',
    lg: '24px',
    xl: '28px',
    xxl: '32px',
    heading: '44px',
  },
};

// Define scale factors for UI sizes
export const UI_SCALES = {
  small: {
    spacing: 0.85,
    borderRadius: 0.85,
  },
  medium: {
    spacing: 1,
    borderRadius: 1,
  },
  large: {
    spacing: 1.25,
    borderRadius: 1.15,
  },
};

// Create the context
const SettingsContext = createContext();

// Custom hook to use the settings
export const useSettings = () => {
  return useContext(SettingsContext);
};

// Provider component
export const SettingsProvider = ({ children }) => {
  // Try to load settings from local storage
  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem('appSettings');
      return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    } catch (error) {
      console.error('Failed to load settings:', error);
      return defaultSettings;
    }
  };
  
  const [settings, setSettings] = useState(loadSettings());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Save settings to local storage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('appSettings', JSON.stringify(settings));
      
      // Apply theme changes immediately
      if (settings.theme === 'dark') {
        document.documentElement.classList.add('dark-theme');
      } else {
        document.documentElement.classList.remove('dark-theme');
      }
      
      // Apply text size changes
      const textSizes = TEXT_SIZES[settings.textSize];
      Object.entries(textSizes).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--font-size-${key}`, value);
      });
      
      // Apply UI scale changes
      const uiScale = UI_SCALES[settings.uiScale];
      document.documentElement.style.setProperty('--ui-scale', uiScale.spacing);
      document.documentElement.style.setProperty('--border-radius-scale', uiScale.borderRadius);
      
      // Apply custom accent color
      document.documentElement.style.setProperty('--primary-color', settings.customAccentColor);
      
      // Apply high contrast if enabled
      if (settings.highContrast) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
      
      // Apply reduced motion if enabled
      if (settings.reduceMotion) {
        document.documentElement.classList.add('reduce-motion');
      } else {
        document.documentElement.classList.remove('reduce-motion');
      }
      
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }, [settings]);
  
  // Update specific settings
  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  // Toggle settings panel
  const toggleSettings = () => {
    setIsSettingsOpen(prev => !prev);
  };
  
  // Reset to default settings
  const resetSettings = () => {
    setSettings(defaultSettings);
  };
  
  // Count words in text content
  const countWords = (text) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).length;
  };
  
  const value = {
    settings,
    updateSettings,
    isSettingsOpen,
    toggleSettings,
    resetSettings,
    countWords,
  };
  
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;