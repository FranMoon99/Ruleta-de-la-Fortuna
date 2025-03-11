
import { supabase, saveSpinResult as saveSpinResultToSupabase, getUserPoints } from "@/integrations/supabase/client";

export interface Prize {
  id: string;
  name: string;
  value: number;
  color: string;
  probability?: number; // Optional probability weight
}

export const defaultPrizes: Prize[] = [
  { id: '1', name: '100 Puntos', value: 100, color: 'roulette-red' },
  { id: '2', name: '200 Puntos', value: 200, color: 'roulette-blue' },
  { id: '3', name: '300 Puntos', value: 300, color: 'roulette-green' },
  { id: '4', name: '400 Puntos', value: 400, color: 'roulette-yellow' },
  { id: '5', name: '500 Puntos', value: 500, color: 'roulette-purple' },
  { id: '6', name: '600 Puntos', value: 600, color: 'roulette-orange' },
  { id: '7', name: '700 Puntos', value: 700, color: 'roulette-pink' },
  { id: '8', name: '800 Puntos', value: 800, color: 'roulette-teal' },
  { id: '9', name: '900 Puntos', value: 900, color: 'roulette-indigo' },
  { id: '10', name: '1000 Puntos', value: 1000, color: 'roulette-cyan' },
  { id: '11', name: 'Bono Sorpresa', value: 0, color: 'roulette-lime' },
  { id: '12', name: 'Premio Grande', value: 2000, color: 'roulette-amber' },
];

export const generateRandomAngle = (segmentCount: number): number => {
  const segmentAngle = 360 / segmentCount;
  const randomSegment = Math.floor(Math.random() * segmentCount);
  const randomOffset = Math.random() * segmentAngle;
  const baseAngle = randomSegment * segmentAngle + randomOffset;
  
  const extraRotations = 3 + Math.floor(Math.random() * 4);
  return baseAngle + (360 * extraRotations);
};

export const calculatePrizeIndex = (angle: number, segmentCount: number): number => {
  const normalizedAngle = angle % 360;
  const segmentAngle = 360 / segmentCount;
  
  const segmentIndex = Math.floor(normalizedAngle / segmentAngle);
  return (segmentCount - 1) - segmentIndex;
};

export const saveCustomPrizes = async (prizes: Prize[]): Promise<void> => {
  localStorage.setItem('roulette-prizes', JSON.stringify(prizes));
  
  // Authentication functionality disabled
  // No Supabase syncing here
};

export const loadCustomPrizes = async (): Promise<Prize[] | null> => {
  // Authentication functionality disabled
  // No Supabase loading here
  
  const saved = localStorage.getItem('roulette-prizes');
  return saved ? JSON.parse(saved) : null;
};

export const saveSpinResult = async (prizeId: string, userId?: string): Promise<boolean> => {
  try {
    // Authentication functionality disabled
    // Only use local storage
    
    const history = JSON.parse(localStorage.getItem('roulette-history') || '[]');
    const prize = defaultPrizes.find(p => p.id === prizeId);
    
    history.unshift({
      prizeId,
      points: prize ? prize.value : 0,
      timestamp: new Date().toISOString()
    });
    
    localStorage.setItem('roulette-history', JSON.stringify(history.slice(0, 30)));
    
    // Update local points
    const currentPoints = parseInt(localStorage.getItem('roulette-points') || '0');
    localStorage.setItem('roulette-points', String(currentPoints + (prize ? prize.value : 0)));
    
    return true;
  } catch (error) {
    console.error('Error al guardar el resultado:', error);
    return false;
  }
};

export const loadSpinHistory = async () => {
  // Authentication functionality disabled
  // Only use local storage
  
  const history = JSON.parse(localStorage.getItem('roulette-history') || '[]');
  return history;
};

export const loadUserPoints = async (userId?: string): Promise<number> => {
  try {
    // Authentication functionality disabled
    // Only use local storage
    
    return parseInt(localStorage.getItem('roulette-points') || '0');
  } catch (error) {
    console.error('Error al cargar los puntos:', error);
    return 0;
  }
};
