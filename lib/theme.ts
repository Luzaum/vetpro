export type Theme = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  theme: Theme;
  systemTheme: 'light' | 'dark';
}

// Theme detection and management
export const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const getStoredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'system';
  return (localStorage.getItem('theme') as Theme) || 'system';
};

export const setStoredTheme = (theme: Theme): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('theme', theme);
};

export const applyTheme = (theme: Theme): void => {
  if (typeof window === 'undefined') return;
  
  const root = document.documentElement;
  const systemTheme = getSystemTheme();
  
  // Remove existing theme classes
  root.classList.remove('light', 'dark');
  root.removeAttribute('data-theme');
  
  // Apply new theme
  if (theme === 'system') {
    root.setAttribute('data-theme', systemTheme);
    root.classList.add(systemTheme);
  } else {
    root.setAttribute('data-theme', theme);
    root.classList.add(theme);
  }
};

export const initializeTheme = (): void => {
  const theme = getStoredTheme();
  applyTheme(theme);
  
  // Listen for system theme changes
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
      if (getStoredTheme() === 'system') {
        applyTheme('system');
      }
    });
  }
};

// Theme utilities for components
export const getCurrentTheme = (): 'light' | 'dark' => {
  const theme = getStoredTheme();
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
};

export const isDarkMode = (): boolean => {
  return getCurrentTheme() === 'dark';
};

// CSS Variable helpers
export const getCSSVariable = (variable: string): string => {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
};

export const setCSSVariable = (variable: string, value: string): void => {
  if (typeof window === 'undefined') return;
  document.documentElement.style.setProperty(variable, value);
};
