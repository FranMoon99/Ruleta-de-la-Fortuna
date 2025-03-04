
import { useState, useEffect, createContext, useContext } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  soundSettings?: {
    masterVolume: number;
    clickSound: boolean;
  };
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{
  children: React.ReactNode;
  soundSettings?: {
    masterVolume: number;
    clickSound: boolean;
  };
}> = ({ children, soundSettings }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Verifica si hay un tema guardado en localStorage
    const savedTheme = localStorage.getItem('theme');
    
    // Verifica la preferencia del sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Usa el tema guardado o la preferencia del sistema
    return (savedTheme as Theme) || (prefersDark ? 'dark' : 'light');
  });
  
  useEffect(() => {
    // Guarda el tema en localStorage
    localStorage.setItem('theme', theme);
    
    // Actualiza la clase en el documento
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, soundSettings }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
