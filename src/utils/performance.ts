
import React, { useState, useEffect } from 'react';

// Optimiza el rendimiento retrasando la visualización de un estado de carga
// Útil para evitar flickers rápidos de estados de carga
export function useDelayedLoading(loading: boolean, delay: number = 200): boolean {
  const [delayedLoading, setDelayedLoading] = useState(false);
  
  useEffect(() => {
    if (loading) {
      // Si está cargando, establecer el retardo
      const timer = setTimeout(() => {
        setDelayedLoading(true);
      }, delay);
      
      return () => clearTimeout(timer);
    } else {
      // Si ya no está cargando, actualizar inmediatamente
      setDelayedLoading(false);
    }
  }, [loading, delay]);
  
  return delayedLoading;
}

// Optimiza el rendimiento de listas con mucho contenido
export function useVirtualizedList<T>(
  items: T[],
  pageSize: number = 20
): {
  visibleItems: T[];
  loadMore: () => void;
  hasMore: boolean;
  loading: boolean;
} {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const visibleItems = items.slice(0, page * pageSize);
  const hasMore = visibleItems.length < items.length;
  
  const loadMore = () => {
    if (!hasMore || loading) return;
    
    setLoading(true);
    // Simular un pequeño retraso para no bloquear la UI
    setTimeout(() => {
      setPage(prevPage => prevPage + 1);
      setLoading(false);
    }, 100);
  };
  
  return { visibleItems, loadMore, hasMore, loading };
}

// Componente para cargar imágenes con lazy loading
export const LazyImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <img
      {...props}
      loading="lazy"
      onLoad={() => setLoaded(true)}
      style={{
        ...props.style,
        opacity: loaded ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out'
      }}
    />
  );
};
