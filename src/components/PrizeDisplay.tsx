
import React, { useEffect, useState } from 'react';
import { Trophy, Gift, Crown, Star } from 'lucide-react';
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
      <Card className="prize-card h-48 flex flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/30 backdrop-blur-sm">
        <div className="relative">
          <Gift className="h-14 w-14 text-muted-foreground mb-4 opacity-80" />
          <Star className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-pulse opacity-80" />
        </div>
        <p className="text-xl font-medium text-muted-foreground">Gira la ruleta para ganar un premio</p>
      </Card>
    );
  }

  return (
    <Card className={`prize-card h-48 flex flex-col items-center justify-center relative overflow-hidden ${
      animate ? 'animate-scale-in' : ''
    } bg-gradient-to-br from-background/90 to-secondary/20 backdrop-blur-sm`}>
      {/* Background color glow based on the prize color */}
      <div 
        className={`absolute inset-0 opacity-20 ${animate ? 'animate-pulse-light' : ''}`}
        style={{ 
          backgroundColor: result.prize.color.startsWith('roulette-') 
            ? `var(--${result.prize.color.replace('roulette-', '')})` 
            : result.prize.color 
        }}
      ></div>
      
      <div className="relative z-10">
        <div className="flex justify-center mb-4 relative">
          {animate ? (
            <div className="relative">
              <Crown className={`h-12 w-12 ${animate ? 'animate-glow' : ''}`} 
                style={{ 
                  color: result.prize.color.startsWith('roulette-') 
                    ? `var(--${result.prize.color.replace('roulette-', '')})` 
                    : result.prize.color 
                }} 
              />
              <div className="absolute -inset-3 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
            </div>
          ) : (
            <Trophy className="h-12 w-12" 
              style={{ 
                color: result.prize.color.startsWith('roulette-') 
                  ? `var(--${result.prize.color.replace('roulette-', '')})` 
                  : result.prize.color 
              }} 
            />
          )}
        </div>
        
        <h2 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">¡Felicidades!</h2>
        <div className="text-center">
          <p className="text-lg font-medium mb-1">Has ganado:</p>
          <p className="text-2xl font-bold">{result.prize.name}</p>
        </div>
      </div>
      
      {/* Enhanced celebration confetti effect when animating */}
      {animate && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                backgroundColor: ['#ff6b6b', '#feca57', '#1dd1a1', '#5f27cd', '#54a0ff', '#fd79a8'][i % 6],
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `scale(${Math.random() * 0.5 + 0.5})`,
                opacity: Math.random() * 0.7 + 0.3,
                animation: `confetti-fall ${Math.random() * 2 + 1}s ease-out forwards`,
                boxShadow: '0 0 3px rgba(255,255,255,0.3)',
              }}
            />
          ))}
        </div>
      )}
    </Card>
  );
};

export default PrizeDisplay;
