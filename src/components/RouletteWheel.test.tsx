
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RouletteWheel from './RouletteWheel';
import '@testing-library/jest-dom'; // Add this import for toHaveStyle

// Mock useRenderPerformance to avoid hook issues in tests
vi.mock('../utils/performance', () => ({
  useRenderPerformance: vi.fn(),
}));

// Sample prizes for testing
const testPrizes = [
  { id: '1', name: 'Prize 1', value: 10, color: '#ff0000' },
  { id: '2', name: 'Prize 2', value: 20, color: '#00ff00' },
  { id: '3', name: 'Prize 3', value: 30, color: '#0000ff' },
  { id: '4', name: 'Prize 4', value: 40, color: '#ffff00' },
];

describe('RouletteWheel', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  it('renders with correct number of segments', () => {
    render(<RouletteWheel prizes={testPrizes} spinning={false} spinAngle={0} spinDuration={5} />);
    const segments = document.querySelectorAll('path');
    expect(segments.length).toBe(testPrizes.length);
  });

  it('applies correct transform style when not spinning', () => {
    render(<RouletteWheel prizes={testPrizes} spinning={false} spinAngle={0} spinDuration={5} />);
    const wheel = screen.getByTestId('roulette-wheel') || document.querySelector('.roulette-wheel');
    expect(wheel).toHaveStyle('transform: rotate(0deg)');
    expect(wheel).toHaveStyle('transition: none');
  });

  it('applies correct transform style when spinning', () => {
    const spinAngle = 720;
    const spinDuration = 5;
    
    render(
      <RouletteWheel 
        prizes={testPrizes} 
        spinning={true} 
        spinAngle={spinAngle} 
        spinDuration={spinDuration} 
      />
    );
    
    const wheel = screen.getByTestId('roulette-wheel') || document.querySelector('.roulette-wheel');
    expect(wheel).toHaveStyle(`transform: rotate(${spinAngle}deg)`);
    expect(wheel).toHaveStyle(`transition: transform ${spinDuration}s cubic-bezier(0.2, 0.8, 0.2, 1)`);
  });
});
