
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
          setPoints(0);
          setTotalSpins(0);
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
  
  // Cargar puntos y datos del usuario cuando cambia el usuario
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      setIsLoadingUserData(true);
      
      try {
        // Obtener los puntos del usuario con una consulta más segura
        const { data: pointsData, error: pointsError } = await supabase
          .rpc('get_user_points', { user_id_param: user.id })
          .then(response => {
            if (response.error) {
              console.error('RPC error:', response.error);
              // Fallback to direct query if RPC fails
              return supabase
                .from('user_points' as any)
                .select('total_points')
                .eq('user_id', user.id)
                .single();
            }
            return response;
          });
        
        if (pointsError && pointsError.code !== 'PGRST116') {
          console.error('Error cargando puntos:', pointsError);
        }
        
        // Safely access total_points regardless of data structure
        if (pointsData) {
          // Handle both RPC result (single value) or direct query (object with total_points)
          const points = typeof pointsData === 'number' 
            ? pointsData 
            : pointsData.total_points || 0;
          
          setPoints(points);
        }
        
        // Obtener información del perfil con verificación de tipo
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileError) {
          console.error('Error cargando perfil:', profileError);
        }
        
        if (profileData) {
          // Safely access total_spins with type checking
          const spins = (profileData as any).total_spins || 0;
          setTotalSpins(spins);
        }
        
        // Cargar historial de giros con manejo de errores y tipado
        const { data: historyData, error: historyError } = await supabase
          .rpc('get_user_spin_history', { 
            user_id_param: user.id,
            limit_count: 30
          })
          .then(response => {
            if (response.error) {
              console.error('RPC error:', response.error);
              // Fallback to direct query
              return supabase
                .from('resultados' as any)
                .select('id, fecha, premio_id, points_earned')
                .eq('user_id', user.id)
                .order('fecha' as any, { ascending: false })
                .limit(30);
            }
            return response;
          });
        
        if (historyError) {
          console.error('Error cargando historial:', historyError);
        }
        
        if (historyData && historyData.length > 0) {
          // Convertir los resultados a SpinResult con manejo de tipo seguro
          const spinResults: SpinResult[] = historyData.map((item: any) => {
            // Find prize by ID or create a fallback
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
      } catch (error) {
        console.error('Error cargando datos del usuario:', error);
      } finally {
        setIsLoadingUserData(false);
      }
    };
    
    fetchUserData();
  }, [user, prizes]);
  
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
      setHistory(prev => [result, ...prev].slice(0, 30)); // Keep 30 most recent
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
          
          // Actualizar los puntos localmente sin necesidad de recargar
          setPoints(prev => prev + prize.value);
          setTotalSpins(prev => prev + 1);
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
  
  // Función para actualizar manualmente los puntos (para pruebas)
  const updatePoints = useCallback((newPoints: number) => {
    setPoints(newPoints);
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
