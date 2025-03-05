
import { useState, useCallback, useEffect, useRef } from 'react';
import { Prize, defaultPrizes, generateRandomAngle, calculatePrizeIndex, loadCustomPrizes, saveCustomPrizes, saveSpinResult, loadUserPoints } from '../utils/prizes';
import { playSpinSound, playWinSound, getRandomSpinDuration } from '../utils/animations';

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
  statistics: Record<string, number>;
  soundSettings: SoundSettings;
  customMode: boolean;
  points: number;
  totalSpins: number;
  isLoadingUserData: boolean;
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
  const [statistics, setStatistics] = useState<Record<string, number>>({});
  const [soundSettings, setSoundSettings] = useState<SoundSettings>(() => {
    const saved = localStorage.getItem('roulette-sound-settings');
    return saved ? JSON.parse(saved) : DEFAULT_SOUND_SETTINGS;
  });
  const [customMode, setCustomMode] = useState(false);
  const [points, setPoints] = useState(0);
  const [totalSpins, setTotalSpins] = useState(0);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const resultTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
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
  
  useEffect(() => {
    const savedStats = localStorage.getItem('roulette-statistics');
    if (savedStats) {
      setStatistics(JSON.parse(savedStats));
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('roulette-sound-settings', JSON.stringify(soundSettings));
  }, [soundSettings]);
  
  const spin = useCallback(async () => {
    if (spinning) return;
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    if (resultTimeoutRef.current) {
      clearTimeout(resultTimeoutRef.current);
    }
    
    setSpinning(true);
    
    const angle = generateRandomAngle(prizes.length);
    setSpinAngle(angle);
    
    const duration = getRandomSpinDuration();
    setSpinDuration(duration);
    
    if (soundSettings.spinSound) {
      audioRef.current = playSpinSound();
      if (audioRef.current) {
        audioRef.current.volume = soundSettings.masterVolume;
      }
    }
    
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
        
        localStorage.setItem('roulette-statistics', JSON.stringify(newStats));
        
        return newStats;
      });
      
      setCurrentResult(result);
      setHistory(prev => [result, ...prev].slice(0, 30));
      setSpinning(false);
      
      if (soundSettings.winSound) {
        const winAudio = new Audio();
        winAudio.src = 'https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3';
        winAudio.volume = soundSettings.masterVolume;
        winAudio.play();
      }
      
      try {
        await saveSpinResult(prize.id);
        setPoints(prev => prev + prize.value);
        setTotalSpins(prev => prev + 1);
        localStorage.setItem('roulette-total-spins', String(parseInt(localStorage.getItem('roulette-total-spins') || '0') + 1));
      } catch (error) {
        console.error("Error saving result:", error);
      }
    }, duration * 1000 + 500);
  }, [prizes, spinning, soundSettings]);
  
  const updatePrizes = useCallback((newPrizes: Prize[]) => {
    setPrizes(newPrizes);
    saveCustomPrizes(newPrizes);
  }, []);
  
  const resetHistory = useCallback(() => {
    setHistory([]);
    setCurrentResult(null);
    localStorage.removeItem('roulette-history');
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
  
  const updatePoints = useCallback((newPoints: number) => {
    setPoints(newPoints);
    localStorage.setItem('roulette-points', String(newPoints));
  }, []);
  
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
