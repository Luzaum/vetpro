import React, { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Theme, getStoredTheme, setStoredTheme, applyTheme, getSystemTheme } from '../lib/theme';

interface ThemeToggleProps {
  className?: string;
  showLabels?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  showLabels = false 
}) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>('system');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setCurrentTheme(getStoredTheme());
  }, []);

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
    setStoredTheme(theme);
    applyTheme(theme);
    setIsOpen(false);
  };

  const getThemeIcon = (theme: Theme) => {
    switch (theme) {
      case 'light':
        return <Sun size={16} />;
      case 'dark':
        return <Moon size={16} />;
      case 'system':
        return <Monitor size={16} />;
      default:
        return <Monitor size={16} />;
    }
  };

  const getThemeLabel = (theme: Theme) => {
    switch (theme) {
      case 'light':
        return 'Claro';
      case 'dark':
        return 'Escuro';
      case 'system':
        return 'Sistema';
      default:
        return 'Sistema';
    }
  };

  const getCurrentIcon = () => {
    if (currentTheme === 'system') {
      const systemTheme = getSystemTheme();
      return systemTheme === 'dark' ? <Moon size={16} /> : <Sun size={16} />;
    }
    return getThemeIcon(currentTheme);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center justify-center
          w-10 h-10 rounded-full
          bg-surface border border-border
          hover:bg-surface-raised
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          transition-all duration-200
          interactive
        "
        aria-label="Alternar tema"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {getCurrentIcon()}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="
            absolute right-0 top-12 z-20
            w-48 rounded-lg
            bg-surface-raised border border-border
            shadow-lg
            py-2
          ">
            {(['light', 'dark', 'system'] as Theme[]).map((theme) => (
              <button
                key={theme}
                onClick={() => handleThemeChange(theme)}
                className={`
                  w-full px-4 py-2
                  flex items-center gap-3
                  text-left
                  hover:bg-surface
                  focus:outline-none focus:bg-surface
                  transition-colors duration-150
                  ${currentTheme === theme ? 'text-primary' : 'text-text'}
                `}
                aria-label={`Mudar para tema ${getThemeLabel(theme)}`}
              >
                <span className="text-muted">
                  {getThemeIcon(theme)}
                </span>
                {showLabels && (
                  <span className="text-sm font-medium">
                    {getThemeLabel(theme)}
                  </span>
                )}
                {currentTheme === theme && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeToggle;
