
import { useState, useCallback, useEffect, useRef } from 'react';
import { Prize, defaultPrizes, generateRandomAngle, calculatePrizeIndex, loadCustomPrizes, saveSpinResult } from '../utils/prizes';
import { playSpinSound, playWinSound, getRandomSpinDuration } from '../utils/animations';
import { supabase } from '@/integrations/supabase/client';

export interface SpinResult {
  prize: Prize;
  timestamp: Date;
}

export interface RouletteState {
  prizes: Prize[];
  spinning: boolean;
  currentResult: SpinResult | null;
  history: SpinResult[];
  spinAngle: number;
  spinDuration: number;
  user: any | null;
}

export const useRoulette = () => {
  const [prizes, setPrizes] = useState<Prize[]>(() => defaultPrizes);
  const [spinning, setSpinning] = useState(false);
  const [currentResult, setCurrentResult] = useState<SpinResult | null>(null);
  const [history, setHistory] = useState<SpinResult[]>([]);
  const [spinAngle, setSpinAngle] = useState(0);
  const [spinDuration, setSpinDuration] = useState(5);
  const [user, setUser] = useState<any | null>(null);
  
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
    
    // Play spin sound
    audioRef.current = playSpinSound();
    
    // Determine result after spinning
    resultTimeoutRef.current = setTimeout(async () => {
      const resultIndex = calculatePrizeIndex(angle, prizes.length);
      const prize = prizes[resultIndex];
      
      const result: SpinResult = {
        prize,
        timestamp: new Date()
      };
      
      setCurrentResult(result);
      setHistory(prev => [result, ...prev].slice(0, 10)); // Keep only 10 most recent
      setSpinning(false);
      
      // Play win sound
      playWinSound();
      
      // Si el usuario está autenticado, guardar el resultado en Supabase
      if (user) {
        try {
          await saveSpinResult(prize.id, user.id);
        } catch (error) {
          console.error("Error guardando el resultado:", error);
        }
      }
    }, duration * 1000 + 500); // Add a little buffer for the animation
  }, [prizes, spinning, user]);
  
  const updatePrizes = useCallback((newPrizes: Prize[]) => {
    setPrizes(newPrizes);
  }, []);
  
  const resetHistory = useCallback(() => {
    setHistory([]);
    setCurrentResult(null);
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
    spin,
    updatePrizes,
    resetHistory
  };
};
