import { supabase } from "@/integrations/supabase/client";

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
  // Generate a random angle within 360 degrees
  // Then add multiple full rotations (e.g., 1080 degrees = 3 full rotations)
  const segmentAngle = 360 / segmentCount;
  const randomSegment = Math.floor(Math.random() * segmentCount);
  const randomOffset = Math.random() * segmentAngle;
  const baseAngle = randomSegment * segmentAngle + randomOffset;
  
  // Add between 3-6 full rotations for dramatic effect
  const extraRotations = 3 + Math.floor(Math.random() * 4);
  return baseAngle + (360 * extraRotations);
};

export const calculatePrizeIndex = (angle: number, segmentCount: number): number => {
  // Normalize the angle to 0-360 degrees
  const normalizedAngle = angle % 360;
  const segmentAngle = 360 / segmentCount;
  
  // Calculate which segment the wheel lands on
  // Note: we invert the index because the wheel rotates clockwise
  const segmentIndex = Math.floor(normalizedAngle / segmentAngle);
  return (segmentCount - 1) - segmentIndex;
};

export const saveCustomPrizes = async (prizes: Prize[]): Promise<void> => {
  // Guardar localmente para uso sin conexión
  localStorage.setItem('roulette-prizes', JSON.stringify(prizes));
  
  // Si el usuario está autenticado, sincronizar con Supabase
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.user) {
    // Primero limpiar premios existentes (esto requeriría permisos adicionales)
    // En una implementación más completa, deberíamos actualizar en lugar de borrar/recrear
    console.log("Sincronizando premios personalizados con Supabase...");
  }
};

export const loadCustomPrizes = async (): Promise<Prize[] | null> => {
  // Primero intentar cargar desde Supabase si el usuario está autenticado
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.user) {
    try {
      // En una implementación completa, cargaríamos los premios del usuario desde Supabase
      console.log("Intentando cargar premios personalizados desde Supabase...");
      // Por ahora, caemos de vuelta al almacenamiento local
    } catch (error) {
      console.error("Error cargando premios desde Supabase:", error);
    }
  }
  
  // Si no hay datos de Supabase o el usuario no está autenticado, usar localStorage
  const saved = localStorage.getItem('roulette-prizes');
  return saved ? JSON.parse(saved) : null;
};

// Nueva función para guardar un resultado en Supabase
export const saveSpinResult = async (prizeId: string, userId?: string): Promise<boolean> => {
  try {
    // Primero verificar si el usuario está autenticado
    if (!userId) {
      const { data: { session } } = await supabase.auth.getSession();
      userId = session?.user?.id;
    }
    
    // Si hay un usuario autenticado, guardar el resultado
    if (userId) {
      const { error } = await supabase.from('resultados').insert({
        user_id: userId,
        premio_id: prizeId
      });
      
      if (error) {
        console.error('Error al guardar el resultado:', error);
        return false;
      }
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error al guardar el resultado:', error);
    return false;
  }
};

// Nueva función para cargar el historial de resultados
export const loadSpinHistory = async (): Promise<any[]> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('resultados')
      .select('*, premios(nombre)')
      .eq('user_id', session.user.id)
      .order('fecha', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('Error al cargar el historial:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error al cargar el historial:', error);
    return [];
  }
};
