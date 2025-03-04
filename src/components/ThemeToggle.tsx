
import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { playClickSound } from '@/utils/animations';

const ThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
  const { theme, toggleTheme, soundSettings } = useTheme();
  
  const handleToggle = () => {
    if (soundSettings?.clickSound) {
      playClickSound(soundSettings.masterVolume);
    }
    toggleTheme();
  };
  
  return (
    <Button 
      variant="outline" 
      size="icon"
      onClick={handleToggle}
      className={`rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-white/90 dark:hover:bg-slate-800/90 shadow-md transition-all duration-300 ${className}`}
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4 text-yellow-500 transition-transform duration-300 rotate-0 scale-100" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700 transition-transform duration-300 rotate-0 scale-100" />
      )}
    </Button>
  );
};

export default ThemeToggle;
