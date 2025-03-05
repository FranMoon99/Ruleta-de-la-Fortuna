
import React from 'react';
import { render, screen } from '@testing-library/react';
import PointsDisplay from '../PointsDisplay';

describe('PointsDisplay', () => {
  it('renders the points correctly', () => {
    render(<PointsDisplay points={1500} />);
    expect(screen.getByText('1500')).toBeInTheDocument();
    expect(screen.getByText('puntos totales')).toBeInTheDocument();
  });
  
  it('calculates the correct level and progress', () => {
    render(<PointsDisplay points={2500} />);
    // Level should be 3 (2500/1000 = 2.5, floor to 2, add 1 = 3)
    expect(screen.getByText('Nivel 3')).toBeInTheDocument();
    // Progress text shows points remaining to next level
    expect(screen.getByText('500 / 1000 para el siguiente nivel')).toBeInTheDocument();
  });
  
  it('displays loading state when isLoading is true', () => {
    render(<PointsDisplay points={1000} isLoading={true} />);
    // Should show skeletons instead of content
    expect(screen.queryByText('1000')).not.toBeInTheDocument();
    expect(document.querySelector('.skeleton')).toBeInTheDocument();
  });
});
