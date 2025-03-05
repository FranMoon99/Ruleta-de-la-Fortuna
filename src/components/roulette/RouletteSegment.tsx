
import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Prize } from '@/utils/prizes';

interface RouletteSegmentProps {
  segment: {
    path: string;
    textX: number;
    textY: number;
    textRotation: number;
    prize: Prize;
    fillColor: string;
  };
  index: number;
}

const RouletteSegment: React.FC<RouletteSegmentProps> = ({ segment, index }) => {
  const { theme } = useTheme();
  const isLightTheme = theme === 'light';

  return (
    <g key={index} className="wheel-segment group">
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
  );
};

export default RouletteSegment;
