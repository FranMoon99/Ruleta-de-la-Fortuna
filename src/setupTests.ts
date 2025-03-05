
import '@testing-library/jest-dom';

// Mock para IntersectionObserver que no está disponible en el entorno de prueba
class MockIntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  
  constructor(
    private callback: IntersectionObserverCallback,
    private options?: IntersectionObserverInit
  ) {
    if (options?.root) this.root = options.root;
    if (options?.rootMargin) this.rootMargin = options.rootMargin;
    if (options?.threshold) {
      this.thresholds = Array.isArray(options.threshold) 
        ? options.threshold 
        : [options.threshold];
    }
  }

  observe() {
    // Implementación mínima
  }

  unobserve() {
    // Implementación mínima
  }

  disconnect() {
    // Implementación mínima
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

// Asignar el mock al objeto global
global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

// Configuramos mock para localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock para window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
