
import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  className?: string;
  format?: 'horizontal' | 'vertical' | 'rectangle';
  slot?: string;
}

const AdBanner = ({ className = "", format = "horizontal", slot = "1234567890" }: AdBannerProps) => {
  const adRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Cargar el script de Google AdSense si aún no está cargado
    if (!window.adsbygoogle) {
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }
    
    // Intentar mostrar el anuncio cuando el componente se monte
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('Error al cargar el anuncio:', error);
    }
  }, []);
  
  // Establecer dimensiones según el formato
  let adStyle: React.CSSProperties = {};
  switch (format) {
    case 'horizontal':
      adStyle = { width: '728px', height: '90px', maxWidth: '100%' };
      break;
    case 'vertical':
      adStyle = { width: '120px', height: '240px', maxWidth: '100%' };
      break;
    case 'rectangle':
      adStyle = { width: '300px', height: '250px', maxWidth: '100%' };
      break;
  }
  
  return (
    <div className={`ad-container my-4 mx-auto ${className}`} ref={adRef}>
      <div className="text-xs text-muted-foreground mb-1 text-center">Publicidad</div>
      <ins
        className="adsbygoogle"
        style={adStyle}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Reemplazar con tu ID de cliente
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdBanner;
