
// Mock IntersectionObserver for jest/vitest
class MockIntersectionObserver {
  readonly root: Element | null;
  readonly rootMargin: string;
  readonly thresholds: ReadonlyArray<number>;
  
  constructor() {
    this.root = null;
    this.rootMargin = "";
    this.thresholds = [0];
  }
  
  disconnect() {
    return;
  }
  
  observe() {
    return;
  }
  
  takeRecords() {
    return [];
  }
  
  unobserve() {
    return;
  }
}

global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: (key: string): string => {
      return store[key] || null;
    },
    setItem: (key: string, value: string): void => {
      store[key] = value.toString();
    },
    removeItem: (key: string): void => {
      delete store[key];
    },
    clear: (): void => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});
