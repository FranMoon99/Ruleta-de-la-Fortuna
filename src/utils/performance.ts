
import { useCallback, useEffect, useRef } from 'react';

// Debounce function to limit how often a function can be called
export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
): ((...args: Parameters<F>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): void => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };
};

// Custom hook for implementing requestAnimationFrame
export const useAnimationFrame = (callback: (deltaTime: number) => void) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  
  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, [callback]);
  
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]);
};

// Memoization cache for expensive calculations
export const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map();
  
  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

// Custom hook for delayed loading (can improve perceived performance)
export const useDelayedLoading = (isLoading: boolean, delay = 300): boolean => {
  const [delayedLoading, setDelayedLoading] = React.useState(isLoading);
  
  React.useEffect(() => {
    if (isLoading) {
      setDelayedLoading(true);
    } else {
      const timer = setTimeout(() => {
        setDelayedLoading(false);
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, delay]);
  
  return delayedLoading;
};
