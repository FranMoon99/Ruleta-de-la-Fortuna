
import React from 'react';
import { Prize } from '../utils/prizes';

interface RouletteSegmentProps {
  prize: Prize;
  index: number;
  total: number;
  radius: number;
}

const RouletteSegment: React.FC<RouletteSegmentProps> = ({ prize, index, total, radius }) => {
  const angle = 360 / total;
  const startAngle = index * angle;
  const endAngle = (index + 1) * angle;
  
  // Convert to radians for calculations
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  
  // Calculate the coordinates of the endpoints of the arc
  const x1 = radius + radius * Math.cos(startRad);
  const y1 = radius + radius * Math.sin(startRad);
  const x2 = radius + radius * Math.cos(endRad);
  const y2 = radius + radius * Math.sin(endRad);
  
  // Determine if the arc is large (1) or small (0)
  const largeArcFlag = angle > 180 ? 1 : 0;
  
  // Create the path for the segment
  const pathData = `
    M ${radius} ${radius}
    L ${x1} ${y1}
    A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
    Z
  `;
  
  // Rotate the text to position in the middle of the segment
  const textRotation = startAngle + angle / 2;
  const textDistance = radius * 0.75; // Position text at 75% of the radius
  const textX = radius + textDistance * Math.cos((textRotation * Math.PI) / 180);
  const textY = radius + textDistance * Math.sin((textRotation * Math.PI) / 180);
  
  return (
    <g className="wheel-segment">
      <path
        d={pathData}
        fill={`var(--${prize.color})`}
        stroke="white"
        strokeWidth="1"
      />
      <text
        x={textX}
        y={textY}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize="12"
        fontWeight="bold"
        transform={`rotate(${textRotation + 90}, ${textX}, ${textY})`}
      >
        {prize.name}
      </text>
    </g>
  );
};

export default RouletteSegment;
