import { useState, useCallback, useEffect, useRef } from 'react';
import { Prize, defaultPrizes, generateRandomAngle, calculatePrizeIndex, loadCustomPrizes, saveCustomPrizes } from '../utils/prizes';
import { playSpinSound, playWinSound, getRandomSpinDuration } from '../utils/animations';
import { 
  supabase, 
  saveSpinResult, 
  getUserPoints, 
  getUserSpinHistory, 
  saveUserSettings, 
  getUserSettings, 
  syncUserStats, 
  getUserStats,
  getUserProfile,
  UserProfile
} from '@/integrations/supabase/client';

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
  const [user, setUser] = useState<any | null>(null);
  const [statistics, setStatistics] = useState<Record<string, number>>({});
  const [soundSettings, setSoundSettings] = useState<SoundSettings>(() => {
    const saved = localStorage.getItem('roulette-sound-settings');
    return saved ? JSON.parse(saved) : DEFAULT_SOUND_SETTINGS;
  });
  const [customMode, setCustomMode] = useState(false);
  const [points, setPoints] = useState(0);
  const [totalSpins, setTotalSpins] = useState(0);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  
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
  }, [user?.id]);
  
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
          setPoints(0);
          setTotalSpins(0);
        }
      }
    );
    
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
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      setIsLoadingUserData(true);
      
      try {
        const userPoints = await getUserPoints(user.id);
        setPoints(userPoints);
        
        const profileData = await getUserProfile(user.id);
        
        if (profileData) {
          setTotalSpins(profileData.total_spins || 0);
        }
        
        const historyData = await getUserSpinHistory(user.id);
        
        if (historyData && Array.isArray(historyData) && historyData.length > 0) {
          const spinResults: SpinResult[] = historyData.map((item) => {
            const prize = prizes.find(p => p.id === item.premio_id) || {
              id: item.premio_id || 'unknown',
              name: 'Premio desconocido',
              value: item.points_earned || 0,
              color: 'roulette-gray'
            };
            
            return {
              prize,
              timestamp: new Date(item.fecha)
            };
          });
          
          setHistory(spinResults);
        }
        
        await syncSettingsFromCloud();
        
        await syncStatsFromCloud();
        
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoadingUserData(false);
      }
    };
    
    fetchUserData();
  }, [user, prizes]);
  
  useEffect(() => {
    const savedStats = localStorage.getItem('roulette-statistics');
    if (savedStats) {
      setStatistics(JSON.parse(savedStats));
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('roulette-sound-settings', JSON.stringify(soundSettings));
    
    if (user && lastSyncTime) {
      const timeSinceLastSync = new Date().getTime() - lastSyncTime.getTime();
      if (timeSinceLastSync > 60000) {
        syncSettingsToCloud();
      }
    }
  }, [soundSettings, user, lastSyncTime]);
  
  const syncSettingsToCloud = async () => {
    if (!user) return;
    
    try {
      await saveUserSettings(user.id, {
        soundSettings,
        favoriteColor: 'var(--primary)'
      });
      setLastSyncTime(new Date());
    } catch (error) {
      console.error('Error syncing settings:', error);
    }
  };
  
  const syncSettingsFromCloud = async () => {
    if (!user) return;
    
    try {
      const settings = await getUserSettings(user.id);
      if (settings && settings.soundSettings) {
        setSoundSettings(settings.soundSettings);
        localStorage.setItem('roulette-sound-settings', JSON.stringify(settings.soundSettings));
      }
      setLastSyncTime(new Date());
    } catch (error) {
      console.error('Error loading settings from cloud:', error);
    }
  };
  
  const syncStatsToCloud = async () => {
    if (!user) return;
    
    try {
      await syncUserStats(user.id, statistics);
    } catch (error) {
      console.error('Error syncing stats:', error);
    }
  };
  
  const syncStatsFromCloud = async () => {
    if (!user) return;
    
    try {
      const cloudStats = await getUserStats(user.id);
      if (Object.keys(cloudStats).length > 0) {
        setStatistics(cloudStats);
        localStorage.setItem('roulette-statistics', JSON.stringify(cloudStats));
      }
    } catch (error) {
      console.error('Error loading stats from cloud:', error);
    }
  };
  
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
      
      if (user) {
        try {
          await saveSpinResult(user.id, prize.id, prize.value);
          setPoints(prev => prev + prize.value);
          setTotalSpins(prev => prev + 1);
          
          syncStatsToCloud();
        } catch (error) {
          console.error("Error saving result:", error);
        }
      }
    }, duration * 1000 + 500);
  }, [prizes, spinning, user, soundSettings]);
  
  const updatePrizes = useCallback((newPrizes: Prize[]) => {
    setPrizes(newPrizes);
    saveCustomPrizes(newPrizes);
  }, []);
  
  const resetHistory = useCallback(() => {
    setHistory([]);
    setCurrentResult(null);
  }, []);
  
  const resetStatistics = useCallback(() => {
    setStatistics({});
    localStorage.removeItem('roulette-statistics');
    
    if (user) {
      syncUserStats(user.id, {});
    }
  }, [user]);
  
  const updateSoundSettings = useCallback((newSettings: Partial<SoundSettings>) => {
    setSoundSettings(prev => ({ ...prev, ...newSettings }));
  }, []);
  
  const toggleCustomMode = useCallback(() => {
    setCustomMode(prev => !prev);
  }, []);
  
  const updatePoints = useCallback((newPoints: number) => {
    setPoints(newPoints);
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
    user,
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
    updatePoints,
    syncSettingsToCloud,
    syncSettingsFromCloud,
    syncStatsToCloud,
    syncStatsFromCloud
  };
};
