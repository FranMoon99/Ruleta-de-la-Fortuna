
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import RouletteWheel from './RouletteWheel';
import { defaultPrizes } from '../utils/prizes';

describe('RouletteWheel', () => {
  it('renders the correct number of segments', () => {
    render(
      <RouletteWheel
        prizes={defaultPrizes}
        spinning={false}
        spinAngle={0}
        spinDuration={5}
      />
    );
    
    // Check that all prize segments are rendered
    // We're looking for the path elements that represent segments
    const segments = document.querySelectorAll('.wheel-segment path');
    expect(segments.length).toBe(defaultPrizes.length);
  });
  
  it('applies spinning transition when spinning', () => {
    render(
      <RouletteWheel
        prizes={defaultPrizes}
        spinning={true}
        spinAngle={180}
        spinDuration={5}
      />
    );
    
    const wheel = document.querySelector('.roulette-wheel');
    expect(wheel).toHaveStyle('transform: rotate(180deg)');
    expect(wheel).toHaveStyle('transition: transform 5s cubic-bezier(0.2, 0.8, 0.2, 1)');
  });
  
  it('does not apply spinning transition when not spinning', () => {
    render(
      <RouletteWheel
        prizes={defaultPrizes}
        spinning={false}
        spinAngle={180}
        spinDuration={5}
      />
    );
    
    const wheel = document.querySelector('.roulette-wheel');
    expect(wheel).toHaveStyle('transform: rotate(180deg)');
    expect(wheel).toHaveStyle('transition: none');
  });
});
