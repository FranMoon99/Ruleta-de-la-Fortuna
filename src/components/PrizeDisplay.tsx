
import React, { useEffect, useState } from 'react';
import { Trophy, Gift } from 'lucide-react';
import { SpinResult } from '@/hooks/useRoulette';
import { Card } from '@/components/ui/card';

interface PrizeDisplayProps {
  result: SpinResult | null;
  showAnimation: boolean;
}

const PrizeDisplay: React.FC<PrizeDisplayProps> = ({ result, showAnimation }) => {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    if (result && showAnimation) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [result, showAnimation]);

  if (!result) {
    return (
      <Card className="prize-card h-48 flex flex-col items-center justify-center">
        <Gift className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-xl font-medium text-muted-foreground">Gira la ruleta para ganar un premio</p>
      </Card>
    );
  }

  return (
    <Card className={`prize-card h-48 flex flex-col items-center justify-center relative overflow-hidden ${
      animate ? 'animate-scale-in' : ''
    }`}>
      {/* Background color glow based on the prize color */}
      <div 
        className={`absolute inset-0 opacity-10 ${animate ? 'animate-pulse-light' : ''}`}
        style={{ 
          backgroundColor: result.prize.color.startsWith('roulette-') 
            ? `var(--${result.prize.color.replace('roulette-', '')})` 
            : result.prize.color 
        }}
      ></div>
      
      <div className="relative z-10">
        <div className="flex justify-center mb-4">
          <Trophy className={`h-10 w-10 ${animate ? 'animate-glow' : ''}`} 
            style={{ 
              color: result.prize.color.startsWith('roulette-') 
                ? `var(--${result.prize.color.replace('roulette-', '')})` 
                : result.prize.color 
            }} 
          />
        </div>
        
        <h2 className="text-2xl font-bold mb-2">¡Felicidades!</h2>
        <div className="text-center">
          <p className="text-xl font-medium mb-1">Has ganado:</p>
          <p className="text-2xl font-bold">{result.prize.name}</p>
        </div>
      </div>
      
      {/* Celebration confetti effect when animating */}
      {animate && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: ['#ff6b6b', '#feca57', '#1dd1a1', '#5f27cd', '#54a0ff'][i % 5],
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `scale(${Math.random() * 0.5 + 0.5})`,
                opacity: Math.random() * 0.7 + 0.3,
                animation: `confetti-fall ${Math.random() * 2 + 1}s linear forwards`,
              }}
            />
          ))}
        </div>
      )}
    </Card>
  );
};

export default PrizeDisplay;
