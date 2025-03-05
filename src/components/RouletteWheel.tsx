
import React from 'react';
import { Prize } from '../utils/prizes';
import RouletteSegment from './RouletteSegment';
import RouletteEffects from './RouletteEffects';
import { useRenderPerformance } from '../utils/performance';

interface RouletteWheelProps {
  prizes: Prize[];
  spinning: boolean;
  spinAngle: number;
  spinDuration: number;
}

const RouletteWheel: React.FC<RouletteWheelProps> = ({
  prizes,
  spinning,
  spinAngle,
  spinDuration,
}) => {
  useRenderPerformance('RouletteWheel');
  
  const radius = 150;
  const size = radius * 2;
  
  return (
    <div className="relative" style={{ width: `${size}px`, height: `${size}px` }}>
      <div className="relative roulette-section">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className={`roulette-wheel transition-transform ${spinning ? 'spinning' : ''}`}
          style={{
            transform: `rotate(${spinAngle}deg)`,
            transition: spinning
              ? `transform ${spinDuration}s cubic-bezier(0.2, 0.8, 0.2, 1)`
              : 'none',
          }}
        >
          {prizes.map((prize, index) => (
            <RouletteSegment
              key={prize.id}
              prize={prize}
              index={index}
              total={prizes.length}
              radius={radius}
            />
          ))}
        </svg>
        
        <RouletteEffects spinning={spinning} radius={radius} />
      </div>
    </div>
  );
};

export default RouletteWheel;
