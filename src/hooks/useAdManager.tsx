
import { useState, useEffect, useCallback } from 'react';

interface AdManagerOptions {
  interstitialFrequency?: number; // Cada cuántos giros mostrar anuncio intersticial
  enableAds?: boolean; // Habilitar/deshabilitar anuncios
}

export const useAdManager = (options: AdManagerOptions = {}) => {
  const { 
    interstitialFrequency = 3, 
    enableAds = true 
  } = options;
  
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [actionCount, setActionCount] = useState(0);
  
  // Función para incrementar el contador de acciones y mostrar anuncio si es necesario
  const trackAction = useCallback(() => {
    if (!enableAds) return;
    
    setActionCount(prev => {
      const newCount = prev + 1;
      if (newCount % interstitialFrequency === 0) {
        setShowInterstitial(true);
      }
      return newCount;
    });
  }, [enableAds, interstitialFrequency]);
  
  // Función para cerrar el anuncio intersticial
  const closeInterstitial = useCallback(() => {
    setShowInterstitial(false);
  }, []);
  
  // Cargar preferencias de anuncios del localStorage
  useEffect(() => {
    const storedPrefs = localStorage.getItem('ad-preferences');
    if (storedPrefs) {
      const prefs = JSON.parse(storedPrefs);
      // Podrías usar esto para implementar más opciones en el futuro
    }
  }, []);
  
  return {
    showInterstitial,
    trackAction,
    closeInterstitial,
    enableAds
  };
};

export default useAdManager;
