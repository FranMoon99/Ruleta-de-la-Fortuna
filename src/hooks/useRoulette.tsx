
import { useState, useCallback, useEffect, useRef } from 'react';
import { Prize, defaultPrizes, generateRandomAngle, calculatePrizeIndex, loadCustomPrizes } from '../utils/prizes';
import { playSpinSound, playWinSound, getRandomSpinDuration } from '../utils/animations';

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
}

export const useRoulette = () => {
  const [prizes, setPrizes] = useState<Prize[]>(() => {
    const savedPrizes = loadCustomPrizes();
    return savedPrizes || defaultPrizes;
  });
  
  const [spinning, setSpinning] = useState(false);
  const [currentResult, setCurrentResult] = useState<SpinResult | null>(null);
  const [history, setHistory] = useState<SpinResult[]>([]);
  const [spinAngle, setSpinAngle] = useState(0);
  const [spinDuration, setSpinDuration] = useState(5);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const resultTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const spin = useCallback(() => {
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
    resultTimeoutRef.current = setTimeout(() => {
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
    }, duration * 1000 + 500); // Add a little buffer for the animation
  }, [prizes, spinning]);
  
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
    spin,
    updatePrizes,
    resetHistory
  };
};
