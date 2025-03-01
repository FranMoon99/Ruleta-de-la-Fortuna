
import React, { useMemo } from 'react';
import { Prize } from '../utils/prizes';

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
  spinDuration
}) => {
  const segments = useMemo(() => {
    const count = prizes.length;
    const anglePerSegment = 360 / count;
    
    return prizes.map((prize, index) => {
      const startAngle = index * anglePerSegment;
      const endAngle = (index + 1) * anglePerSegment;
      
      // Generate SVG path for the segment
      const startRad = (startAngle - 90) * Math.PI / 180;
      const endRad = (endAngle - 90) * Math.PI / 180;
      
      const x1 = 200 + 180 * Math.cos(startRad);
      const y1 = 200 + 180 * Math.sin(startRad);
      const x2 = 200 + 180 * Math.cos(endRad);
      const y2 = 200 + 180 * Math.sin(endRad);
      
      const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
      
      const d = [
        `M 200 200`,
        `L ${x1} ${y1}`,
        `A 180 180 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        `Z`
      ].join(' ');
      
      // Get the middle angle for text positioning
      const midAngle = (startAngle + endAngle) / 2;
      const midRad = (midAngle - 90) * Math.PI / 180;
      const textX = 200 + 110 * Math.cos(midRad);
      const textY = 200 + 110 * Math.sin(midRad);
      
      // Get color from the prize
      const bgColor = prize.color.startsWith('roulette-') 
        ? `bg-${prize.color}` 
        : prize.color;
      
      // Convert bgColor class to a fill color for SVG
      let fillColor;
      switch (prize.color) {
        case 'roulette-red': fillColor = '#e63946'; break;
        case 'roulette-blue': fillColor = '#457b9d'; break;
        case 'roulette-green': fillColor = '#2a9d8f'; break;
        case 'roulette-yellow': fillColor = '#e9c46a'; break;
        case 'roulette-purple': fillColor = '#9b5de5'; break;
        case 'roulette-orange': fillColor = '#f77f00'; break;
        case 'roulette-pink': fillColor = '#f72585'; break;
        case 'roulette-teal': fillColor = '#0096c7'; break;
        case 'roulette-indigo': fillColor = '#6930c3'; break;
        case 'roulette-cyan': fillColor = '#48cae4'; break;
        case 'roulette-lime': fillColor = '#aacc00'; break;
        case 'roulette-amber': fillColor = '#fb8500'; break;
        default: fillColor = prize.color;
      }
      
      return {
        path: d,
        textX,
        textY,
        textRotation: midAngle,
        prize,
        fillColor
      };
    });
  }, [prizes]);
  
  // Style for wheel rotation
  const wheelStyle = {
    '--spin-angle': `${spinAngle}deg`,
    '--spin-duration': `${spinDuration}s`,
    transform: spinning ? 'rotate(var(--spin-angle))' : 'rotate(0deg)',
    transition: spinning ? 'transform var(--spin-duration) cubic-bezier(0.3, 0.1, 0.1, 1)' : 'none'
  } as React.CSSProperties;
  
  return (
    <div className="relative mx-auto w-fit">
      {/* Marker/indicator at the top */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-red-600 z-20"></div>
      
      {/* Wheel Container with Shadow */}
      <div className="relative rounded-full overflow-hidden shadow-2xl">
        <svg 
          width="400" 
          height="400" 
          viewBox="0 0 400 400" 
          className="wheel-container transition-transform duration-300"
          style={wheelStyle}
        >
          <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#00000044" />
            </filter>
            <filter id="inner-glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="arithmetic" k1="1" k2="1" k3="0" k4="0" />
            </filter>
          </defs>
          
          {/* Outer circle */}
          <circle cx="200" cy="200" r="195" fill="#1a1a1a" filter="url(#shadow)" />
          
          {/* Segments */}
          <g className="wheel-segments">
            {segments.map((segment, i) => (
              <g key={i} className="wheel-segment hover:brightness-110 transition-all duration-200">
                <path 
                  d={segment.path} 
                  fill={segment.fillColor} 
                  stroke="#ffffff" 
                  strokeWidth="1"
                />
                <text
                  x={segment.textX}
                  y={segment.textY}
                  fontSize="12"
                  fontWeight="bold"
                  fill="#ffffff"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${segment.textRotation}, ${segment.textX}, ${segment.textY})`}
                >
                  {segment.prize.name}
                </text>
              </g>
            ))}
          </g>
          
          {/* Center circle */}
          <circle cx="200" cy="200" r="30" fill="#f8f8f8" stroke="#d1d1d1" strokeWidth="2" filter="url(#inner-glow)" />
          
          {/* Decorative dots around center */}
          {[...Array(12)].map((_, i) => {
            const angle = i * 30 * Math.PI / 180;
            const x = 200 + 45 * Math.cos(angle);
            const y = 200 + 45 * Math.sin(angle);
            return (
              <circle key={i} cx={x} cy={y} r="3" fill="#1a1a1a" />
            );
          })}
        </svg>
        
        {/* Reflection overlay - glass effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-full"></div>
      </div>
      
      {/* Lighting effects during spinning */}
      {spinning && (
        <div className="absolute inset-0 animate-pulse-light rounded-full bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none"></div>
      )}
    </div>
  );
};

export default RouletteWheel;
