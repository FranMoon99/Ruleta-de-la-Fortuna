
import React, { useMemo, useRef, useEffect } from 'react';
import { Prize } from '../utils/prizes';
import { useTheme } from '@/hooks/useTheme';

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
  const wheelRef = useRef<SVGSVGElement>(null);
  const { theme } = useTheme();
  
  // Efecto para animar el inicio del giro con un pequeño rebote
  useEffect(() => {
    if (spinning && wheelRef.current) {
      wheelRef.current.animate(
        [
          { transform: 'rotate(0deg) scale(1)' },
          { transform: 'rotate(-20deg) scale(1.03)', offset: 0.1 },
          { transform: `rotate(${spinAngle}deg) scale(1)` }
        ],
        {
          duration: spinDuration * 1000,
          easing: 'cubic-bezier(0.2, 0.4, 0.1, 1)',
          fill: 'forwards'
        }
      );
    }
  }, [spinning, spinAngle, spinDuration]);
  
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
  
  // Efectos de iluminación y sombras dependiendo del tema
  const isLightTheme = theme === 'light';
  
  return (
    <div className="relative mx-auto w-fit">
      {/* Marker/indicator at the top */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-0 h-0 border-l-[18px] border-r-[18px] border-t-[30px] border-l-transparent border-r-transparent border-t-red-600 z-20 filter drop-shadow-lg"></div>
      
      {/* Wheel Container with Enhanced Shadow */}
      <div className="relative rounded-full overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.3)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
        <svg 
          ref={wheelRef}
          width="400" 
          height="400" 
          viewBox="0 0 400 400" 
          className="wheel-container transition-transform duration-300"
        >
          <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor={isLightTheme ? "#00000055" : "#00000088"} />
            </filter>
            <filter id="inner-glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="arithmetic" k1="1" k2="1" k3="0" k4="0" />
            </filter>
            <filter id="texture" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <linearGradient id="glossy" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="white" stopOpacity="0.3" />
              <stop offset="100%" stopColor="white" stopOpacity="0.05" />
            </linearGradient>
            <radialGradient id="spinGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor={isLightTheme ? "#ffffff" : "#ffffff"} stopOpacity="0.4" />
              <stop offset="100%" stopColor={isLightTheme ? "#ffffff" : "#ffffff"} stopOpacity="0" />
            </radialGradient>
          </defs>
          
          {/* Outer circle with enhanced border */}
          <circle cx="200" cy="200" r="195" fill={isLightTheme ? "#1a1a1a" : "#111111"} filter="url(#shadow)" />
          <circle cx="200" cy="200" r="190" fill="none" stroke={isLightTheme ? "#ffffff" : "#333333"} strokeWidth="2" opacity="0.2" />
          
          {/* Segments with enhanced styling */}
          <g className="wheel-segments">
            {segments.map((segment, i) => (
              <g key={i} className="wheel-segment group">
                {/* Main segment fill */}
                <path 
                  d={segment.path} 
                  fill={segment.fillColor} 
                  stroke={isLightTheme ? "#ffffff" : "#333333"} 
                  strokeWidth="1.5"
                  className="transition-all duration-300 ease-in-out hover:brightness-110"
                />
                
                {/* Glossy overlay */}
                <path 
                  d={segment.path} 
                  fill="url(#glossy)" 
                  className="opacity-30 group-hover:opacity-50 transition-opacity duration-300"
                />
                
                {/* Prize text with better contrast and readability */}
                <text
                  x={segment.textX}
                  y={segment.textY}
                  fontSize="14"
                  fontWeight="bold"
                  fill="#ffffff"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${segment.textRotation}, ${segment.textX}, ${segment.textY})`}
                  className="filter drop-shadow-md"
                  style={{textShadow: '0px 1px 2px rgba(0,0,0,0.8)'}}
                >
                  {segment.prize.name}
                </text>
              </g>
            ))}
          </g>
          
          {/* Center hub with enhanced styling */}
          <circle cx="200" cy="200" r="35" fill={isLightTheme ? "#3a3a3a" : "#222222"} stroke={isLightTheme ? "#ffffff" : "#333333"} strokeWidth="3" />
          <circle cx="200" cy="200" r="30" fill={isLightTheme ? "#f8f8f8" : "#444444"} stroke={isLightTheme ? "#d1d1d1" : "#555555"} strokeWidth="2" filter="url(#inner-glow)" />
          
          {/* Decorative pattern in center */}
          <circle cx="200" cy="200" r="20" fill={isLightTheme ? "#3a3a3a" : "#222222"} opacity="0.2" />
          
          {/* Decorative dots around center with improved styling */}
          {[...Array(12)].map((_, i) => {
            const angle = i * 30 * Math.PI / 180;
            const x = 200 + 50 * Math.cos(angle);
            const y = 200 + 50 * Math.sin(angle);
            return (
              <circle 
                key={i} 
                cx={x} 
                cy={y} 
                r="3.5" 
                fill={isLightTheme ? "#1a1a1a" : "#333333"} 
                stroke={isLightTheme ? "#ffffff" : "#555555"} 
                strokeWidth="0.5" 
              />
            );
          })}
          
          {/* Spin glow effect (visible only during spinning) */}
          {spinning && (
            <circle cx="200" cy="200" r="180" fill="url(#spinGlow)" className="animate-pulse-light" />
          )}
        </svg>
        
        {/* Enhanced reflection overlay - glass effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent dark:from-white/10 pointer-events-none rounded-full"></div>
      </div>
      
      {/* Enhanced lighting effects during spinning */}
      {spinning && (
        <>
          <div className="absolute inset-0 animate-pulse-light rounded-full bg-gradient-to-tr from-white/0 via-white/10 to-white/0 pointer-events-none"></div>
          <div className="absolute -inset-4 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        </>
      )}
    </div>
  );
};

export default RouletteWheel;
