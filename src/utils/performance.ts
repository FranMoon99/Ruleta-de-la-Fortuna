
import { useEffect, useState, useRef, useCallback } from 'react';

// Cache for memoized values
const memoCache = new Map();

/**
 * Memoizes a value to prevent unnecessary recalculations
 * @param key - Unique key to identify the value
 * @param calculator - Function to calculate the value
 * @param dependencies - Array of dependencies that trigger recalculation
 */
export function useMemoizedValue<T>(
  key: string,
  calculator: () => T,
  dependencies: any[] = []
): T {
  const [value, setValue] = useState<T>(() => {
    if (memoCache.has(key)) {
      return memoCache.get(key);
    }
    const calculatedValue = calculator();
    memoCache.set(key, calculatedValue);
    return calculatedValue;
  });

  useEffect(() => {
    const calculatedValue = calculator();
    memoCache.set(key, calculatedValue);
    setValue(calculatedValue);
  }, dependencies);

  return value;
}

/**
 * A hook to measure component render performance
 * @param componentName - Name of the component to measure
 */
export function useRenderPerformance(componentName: string): void {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(performance.now());

  useEffect(() => {
    const timeSinceLastRender = performance.now() - lastRenderTime.current;
    renderCount.current += 1;
    console.log(
      `[Performance] ${componentName} rendered (${renderCount.current}) - ${timeSinceLastRender.toFixed(2)}ms`
    );
    lastRenderTime.current = performance.now();
  });
}

/**
 * A hook for lazy loading components when they enter the viewport
 */
export function useLazyLoad(options = { threshold: 0.1 }): [React.RefObject<HTMLDivElement>, boolean] {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const callback = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    setIsVisible(entry.isIntersecting);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(callback, options);
    const currentRef = ref.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [callback, options]);

  return [ref, isVisible];
}
