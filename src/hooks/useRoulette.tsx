
import { useState, useCallback, useEffect, useRef } from 'react';
import { Prize, defaultPrizes, generateRandomAngle, calculatePrizeIndex, loadCustomPrizes, saveSpinResult, loadSpinHistory } from '../utils/prizes';
import { playSpinSound, playWinSound, getRandomSpinDuration } from '../utils/animations';
import { supabase } from '@/integrations/supabase/client';

export interface SpinResult {
  prize: Prize;
  timestamp: Date;
}

export interface SoundSettings {
  masterVolume: number;
  spinSound: boolean;
  winSound: boolean;
  clickSound: boolean;
}

export interface RouletteState {
  prizes: Prize[];
  spinning: boolean;
  currentResult: SpinResult | null;
  history: SpinResult[];
  spinAngle: number;
  spinDuration: number;
  user: any | null;
  statistics: Record<string, number>;
  soundSettings: SoundSettings;
  customMode: boolean;
}

const DEFAULT_SOUND_SETTINGS: SoundSettings = {
  masterVolume: 0.5,
  spinSound: true,
  winSound: true,
  clickSound: true
};

export const useRoulette = () => {
  const [prizes, setPrizes] = useState<Prize[]>(() => defaultPrizes);
  const [spinning, setSpinning] = useState(false);
  const [currentResult, setCurrentResult] = useState<SpinResult | null>(null);
  const [history, setHistory] = useState<SpinResult[]>([]);
  const [spinAngle, setSpinAngle] = useState(0);
  const [spinDuration, setSpinDuration] = useState(5);
  const [user, setUser] = useState<any | null>(null);
  const [statistics, setStatistics] = useState<Record<string, number>>({});
  const [soundSettings, setSoundSettings] = useState<SoundSettings>(() => {
    const saved = localStorage.getItem('roulette-sound-settings');
    return saved ? JSON.parse(saved) : DEFAULT_SOUND_SETTINGS;
  });
  const [customMode, setCustomMode] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const resultTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Cargar premios al inicio y cuando cambia el usuario
  useEffect(() => {
    const loadPrizes = async () => {
      const customPrizes = await loadCustomPrizes();
      if (customPrizes) {
        setPrizes(customPrizes);
      } else {
        setPrizes(defaultPrizes);
      }
    };
    
    loadPrizes();
  }, [user?.id]);
  
  // Escuchar cambios en la autenticación
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      }
    );
    
    // Verificar sesión actual al montar
    const checkCurrentSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      }
    };
    
    checkCurrentSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Cargar estadísticas desde localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('roulette-statistics');
    if (savedStats) {
      setStatistics(JSON.parse(savedStats));
    }
  }, []);
  
  // Guardar configuración de sonido en localStorage
  useEffect(() => {
    localStorage.setItem('roulette-sound-settings', JSON.stringify(soundSettings));
  }, [soundSettings]);
  
  const spin = useCallback(async () => {
    if (spinning) return;
    
    // Stop previous audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    // Clear any pending timeout
    if (resultTimeoutRef.current) {
      clearTimeout(resultTimeoutRef.current);
    }
    
    // Start spinning
    setSpinning(true);
    
    // Generate random angle
    const angle = generateRandomAngle(prizes.length);
    setSpinAngle(angle);
    
    // Set random duration
    const duration = getRandomSpinDuration();
    setSpinDuration(duration);
    
    // Play spin sound if enabled
    if (soundSettings.spinSound) {
      audioRef.current = playSpinSound();
      if (audioRef.current) {
        audioRef.current.volume = soundSettings.masterVolume;
      }
    }
    
    // Determine result after spinning
    resultTimeoutRef.current = setTimeout(async () => {
      const resultIndex = calculatePrizeIndex(angle, prizes.length);
      const prize = prizes[resultIndex];
      
      const result: SpinResult = {
        prize,
        timestamp: new Date()
      };
      
      // Actualizar estadísticas
      setStatistics(prevStats => {
        const newStats = { ...prevStats };
        newStats[prize.id] = (newStats[prize.id] || 0) + 1;
        
        // Guardar en localStorage
        localStorage.setItem('roulette-statistics', JSON.stringify(newStats));
        
        return newStats;
      });
      
      setCurrentResult(result);
      setHistory(prev => [result, ...prev].slice(0, 10)); // Keep only 10 most recent
      setSpinning(false);
      
      // Play win sound if enabled
      if (soundSettings.winSound) {
        const winAudio = new Audio();
        winAudio.src = 'https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3';
        winAudio.volume = soundSettings.masterVolume;
        winAudio.play();
      }
      
      // Si el usuario está autenticado, guardar el resultado en Supabase
      if (user) {
        try {
          await saveSpinResult(prize.id, user.id);
        } catch (error) {
          console.error("Error guardando el resultado:", error);
        }
      }
    }, duration * 1000 + 500); // Add a little buffer for the animation
  }, [prizes, spinning, user, soundSettings]);
  
  const updatePrizes = useCallback((newPrizes: Prize[]) => {
    setPrizes(newPrizes);
  }, []);
  
  const resetHistory = useCallback(() => {
    setHistory([]);
    setCurrentResult(null);
  }, []);
  
  const resetStatistics = useCallback(() => {
    setStatistics({});
    localStorage.removeItem('roulette-statistics');
  }, []);
  
  const updateSoundSettings = useCallback((newSettings: Partial<SoundSettings>) => {
    setSoundSettings(prev => ({ ...prev, ...newSettings }));
  }, []);
  
  const toggleCustomMode = useCallback(() => {
    setCustomMode(prev => !prev);
  }, []);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (resultTimeoutRef.current) {
        clearTimeout(resultTimeoutRef.current);
      }
    };
  }, []);
  
  return {
    prizes,
    spinning,
    currentResult,
    history,
    spinAngle,
    spinDuration,
    user,
    statistics,
    soundSettings,
    customMode,
    spin,
    updatePrizes,
    resetHistory,
    resetStatistics,
    updateSoundSettings,
    toggleCustomMode
  };
};
