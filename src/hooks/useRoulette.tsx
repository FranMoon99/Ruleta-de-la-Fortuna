
import { useState, useCallback, useEffect, useRef } from 'react';
import { Prize, defaultPrizes, generateRandomAngle, calculatePrizeIndex, saveSpinResult, loadUserPoints } from '../utils/prizes';
import { getRandomSpinDuration } from '../utils/animations';
import { useLocalStorage } from './useLocalStorage';
import { useSoundEffects } from './useSoundEffects';
import { SpinResult, SoundSettings, RouletteState, DEFAULT_SOUND_SETTINGS } from './useRouletteTypes';

export { SpinResult, SoundSettings, RouletteState } from './useRouletteTypes';

export const useRoulette = () => {
  const [prizes, setPrizes] = useState<Prize[]>(() => defaultPrizes);
  const [spinning, setSpinning] = useState(false);
  const [currentResult, setCurrentResult] = useState<SpinResult | null>(null);
  const [history, setHistory] = useState<SpinResult[]>([]);
  const [spinAngle, setSpinAngle] = useState(0);
  const [spinDuration, setSpinDuration] = useState(5);
  const [statistics, setStatistics] = useLocalStorage<Record<string, number>>('roulette-statistics', {});
  const [soundSettings, setSoundSettings] = useLocalStorage<SoundSettings>('roulette-sound-settings', DEFAULT_SOUND_SETTINGS);
  const [customMode, setCustomMode] = useState(false);
  const [points, setPoints] = useState(0);
  const [totalSpins, setTotalSpins] = useState(0);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  
  const resultTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { audioRef, playRouletteSpinSound, playRouletteWinSound, cleanupSounds } = useSoundEffects(soundSettings);
  
  useEffect(() => {
    const loadPrizes = async () => {
      const savedPrizes = localStorage.getItem('roulette-prizes');
      if (savedPrizes) {
        setPrizes(JSON.parse(savedPrizes));
      } else {
        setPrizes(defaultPrizes);
      }
    };
    
    loadPrizes();
  }, []);
  
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoadingUserData(true);
      
      try {
        // Load points from localStorage
        const userPoints = await loadUserPoints();
        setPoints(userPoints);
        
        // Load totalSpins from localStorage
        setTotalSpins(parseInt(localStorage.getItem('roulette-total-spins') || '0'));
        
        // Load history from localStorage
        const historyData = JSON.parse(localStorage.getItem('roulette-history') || '[]');
        if (historyData.length > 0) {
          const spinResults: SpinResult[] = historyData.map((item: any) => {
            const prize = prizes.find(p => p.id === item.prizeId) || {
              id: item.prizeId || 'unknown',
              name: 'Premio desconocido',
              value: item.points || 0,
              color: 'roulette-gray'
            };
            
            return {
              prize,
              timestamp: new Date(item.timestamp)
            };
          });
          
          setHistory(spinResults);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoadingUserData(false);
      }
    };
    
    fetchUserData();
  }, [prizes]);
  
  const spin = useCallback(async () => {
    if (spinning) return;
    
    if (resultTimeoutRef.current) {
      clearTimeout(resultTimeoutRef.current);
    }
    
    setSpinning(true);
    
    const angle = generateRandomAngle(prizes.length);
    setSpinAngle(angle);
    
    const duration = getRandomSpinDuration();
    setSpinDuration(duration);
    
    playRouletteSpinSound();
    
    resultTimeoutRef.current = setTimeout(async () => {
      const resultIndex = calculatePrizeIndex(angle, prizes.length);
      const prize = prizes[resultIndex];
      
      const result: SpinResult = {
        prize,
        timestamp: new Date()
      };
      
      setStatistics(prevStats => {
        const newStats = { ...prevStats };
        newStats[prize.id] = (newStats[prize.id] || 0) + 1;
        return newStats;
      });
      
      setCurrentResult(result);
      setHistory(prev => [result, ...prev].slice(0, 30));
      setSpinning(false);
      
      playRouletteWinSound();
      
      try {
        await saveSpinResult(prize.id);
        setPoints(prev => prev + prize.value);
        setTotalSpins(prev => prev + 1);
        localStorage.setItem('roulette-total-spins', String(parseInt(localStorage.getItem('roulette-total-spins') || '0') + 1));
      } catch (error) {
        console.error("Error saving result:", error);
      }
    }, duration * 1000 + 500);
  }, [prizes, spinning, playRouletteSpinSound, playRouletteWinSound, setStatistics]);
  
  const updatePrizes = useCallback((newPrizes: Prize[]) => {
    setPrizes(newPrizes);
    localStorage.setItem('roulette-prizes', JSON.stringify(newPrizes));
  }, []);
  
  const resetHistory = useCallback(() => {
    setHistory([]);
    setCurrentResult(null);
    localStorage.removeItem('roulette-history');
  }, []);
  
  const resetStatistics = useCallback(() => {
    setStatistics({});
  }, [setStatistics]);
  
  const updateSoundSettings = useCallback((newSettings: Partial<SoundSettings>) => {
    setSoundSettings(prev => ({ ...prev, ...newSettings }));
  }, [setSoundSettings]);
  
  const toggleCustomMode = useCallback(() => {
    setCustomMode(prev => !prev);
  }, []);
  
  const updatePoints = useCallback((newPoints: number) => {
    setPoints(newPoints);
    localStorage.setItem('roulette-points', String(newPoints));
  }, []);
  
  useEffect(() => {
    return () => {
      cleanupSounds();
      if (resultTimeoutRef.current) {
        clearTimeout(resultTimeoutRef.current);
      }
    };
  }, [cleanupSounds]);
  
  return {
    prizes,
    spinning,
    currentResult,
    history,
    spinAngle,
    spinDuration,
    statistics,
    soundSettings,
    customMode,
    points,
    totalSpins,
    isLoadingUserData,
    spin,
    updatePrizes,
    resetHistory,
    resetStatistics,
    updateSoundSettings,
    toggleCustomMode,
    updatePoints
  };
};
