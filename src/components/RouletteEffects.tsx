
import React from 'react';

interface RouletteEffectsProps {
  spinning: boolean;
  radius: number;
}

const RouletteEffects: React.FC<RouletteEffectsProps> = ({ spinning, radius }) => {
  const size = radius * 2;
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Highlight glow when spinning */}
      <div
        className={`absolute inset-0 rounded-full transition-opacity duration-500 ${
          spinning
            ? 'opacity-70 animate-pulse'
            : 'opacity-0'
        }`}
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)',
        }}
        data-testid="glow-effect"
      />
      
      {/* Center point */}
      <div
        className="absolute bg-white rounded-full shadow-lg z-10"
        style={{
          width: '24px',
          height: '24px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          border: '4px solid #fff',
        }}
        data-testid="center-point"
      />
      
      {/* Pointer */}
      <div
        className="absolute bg-red-500 w-4 h-4 transform rotate-45 z-10"
        style={{
          top: '0',
          left: '50%',
          transform: 'translateX(-50%) translateY(-50%)',
        }}
        data-testid="pointer"
      />
    </div>
  );
};

export default RouletteEffects;
