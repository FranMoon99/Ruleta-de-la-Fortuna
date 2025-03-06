
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface InterstitialAdProps {
  onClose: () => void;
  showCloseButton?: boolean;
  autoCloseTime?: number;
}

const InterstitialAd = ({ 
  onClose, 
  showCloseButton = true, 
  autoCloseTime = 5000 
}: InterstitialAdProps) => {
  const [timeLeft, setTimeLeft] = useState(autoCloseTime / 1000);
  
  useEffect(() => {
    // Cargar el script de Google AdSense si aún no está cargado
    if (!window.adsbygoogle) {
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }
    
    // Intentar mostrar el anuncio
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('Error al cargar el anuncio intersticial:', error);
    }
    
    // Temporizador para cerrar automáticamente
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [onClose, autoCloseTime]);
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      {showCloseButton && (
        <div className="absolute top-4 right-4">
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white">
            <X className="h-6 w-6" />
          </Button>
          <span className="text-white text-sm ml-2">{timeLeft}s</span>
        </div>
      )}
      
      <div className="w-full max-w-xl mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg">
        <div className="text-sm text-muted-foreground mb-2 text-center">Publicidad</div>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '400px' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Reemplazar con tu ID de cliente
          data-ad-slot="YYYYYYYYYY" // Reemplazar con tu slot de anuncio
          data-ad-format="auto"
        />
      </div>
    </div>
  );
};

export default InterstitialAd;
