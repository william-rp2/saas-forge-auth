/**
 * Theme Provider
 * 
 * Global theme management using React Context.
 * Handles light/dark/system theme switching with localStorage persistence.
 * Prevents FOUC (Flash of Unstyled Content) by reading theme on initialization.
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'light' | 'dark'; // The resolved theme (system resolves to light/dark)
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

/**
 * Get the system's preferred color scheme
 */
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

/**
 * Get the stored theme from localStorage or return default
 */
const getStoredTheme = (defaultTheme: Theme = 'system'): Theme => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('theme') as Theme;
    return stored || defaultTheme;
  }
  return defaultTheme;
};

/**
 * ThemeProvider component
 * 
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <ThemeProvider defaultTheme="system">
 *       <YourApp />
 *     </ThemeProvider>
 *   );
 * }
 * ```
 */
export const ThemeProvider = ({ children, defaultTheme = 'system' }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<Theme>(() => getStoredTheme(defaultTheme));
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>(() => {
    const storedTheme = getStoredTheme(defaultTheme);
    return storedTheme === 'system' ? getSystemTheme() : storedTheme;
  });

  /**
   * Update theme and persist to localStorage
   */
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  /**
   * Apply theme to document root
   */
  const applyTheme = (resolvedTheme: 'light' | 'dark') => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
    setActualTheme(resolvedTheme);
  };

  /**
   * Handle theme changes and system theme changes
   */
  useEffect(() => {
    const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;
    applyTheme(resolvedTheme);

    // Listen for system theme changes when using 'system'
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        const systemTheme = e.matches ? 'dark' : 'light';
        applyTheme(systemTheme);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const value: ThemeContextType = {
    theme,
    setTheme,
    actualTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * useTheme hook
 * 
 * @returns ThemeContextType object with theme state and controls
 * 
 * @example
 * ```tsx
 * function ThemeToggle() {
 *   const { theme, setTheme, actualTheme } = useTheme();
 *   
 *   return (
 *     <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
 *       Current: {actualTheme}
 *     </button>
 *   );
 * }
 * ```
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};