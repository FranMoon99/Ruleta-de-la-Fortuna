
import React from 'react';
import { useTheme } from '@/hooks/useTheme';

interface RouletteEffectsProps {
  spinning: boolean;
}

const RouletteEffects: React.FC<RouletteEffectsProps> = ({ spinning }) => {
  const { theme } = useTheme();
  const isLightTheme = theme === 'light';

  return (
    <>
      {/* SVG Definitions */}
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
    </>
  );
};

export default RouletteEffects;
