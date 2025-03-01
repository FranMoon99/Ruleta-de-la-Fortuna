
import React, { useEffect, useState } from 'react';
import { useRoulette } from '@/hooks/useRoulette';
import RouletteWheel from '@/components/RouletteWheel';
import SpinButton from '@/components/SpinButton';
import PrizeDisplay from '@/components/PrizeDisplay';
import HistoryDisplay from '@/components/HistoryDisplay';
import PrizeCustomizer from '@/components/PrizeCustomizer';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Settings } from 'lucide-react';
import { playClickSound } from '@/utils/animations';

const Index = () => {
  const {
    prizes,
    spinning,
    currentResult,
    history,
    spinAngle,
    spinDuration,
    spin,
    updatePrizes,
    resetHistory
  } = useRoulette();
  
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Update win animation state when spin completes
  useEffect(() => {
    if (!spinning && currentResult) {
      setShowWinAnimation(true);
      const timer = setTimeout(() => {
        setShowWinAnimation(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [spinning, currentResult]);
  
  // Override global audio context when sound is disabled
  useEffect(() => {
    const originalPlay = HTMLAudioElement.prototype.play;
    
    if (!soundEnabled) {
      HTMLAudioElement.prototype.play = function() {
        return new Promise((resolve) => resolve());
      };
    } else {
      HTMLAudioElement.prototype.play = originalPlay;
    }
    
    return () => {
      HTMLAudioElement.prototype.play = originalPlay;
    };
  }, [soundEnabled]);
  
  const toggleSound = () => {
    if (soundEnabled) {
      setSoundEnabled(false);
    } else {
      setSoundEnabled(true);
      playClickSound();
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-secondary/30">
      {/* Enhanced background decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-60 bg-gradient-to-b from-primary/10 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-60 bg-gradient-to-t from-primary/5 to-transparent"></div>
      <div className="fixed top-1/4 -left-32 w-64 h-64 rounded-full bg-accent/10 filter blur-3xl"></div>
      <div className="fixed top-1/3 -right-32 w-80 h-80 rounded-full bg-primary/10 filter blur-3xl"></div>
      <div className="fixed bottom-1/4 left-1/4 w-40 h-40 rounded-full bg-primary/5 filter blur-3xl"></div>
      
      <Header />
      
      <main className="container px-4 py-8 mx-auto flex-1 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
          {/* Left sidebar - History */}
          <div className="lg:col-span-1 order-3 lg:order-1">
            <HistoryDisplay history={history} onReset={resetHistory} />
          </div>
          
          {/* Center - Roulette Wheel & Controls */}
          <div className="lg:col-span-1 order-1 lg:order-2 flex flex-col items-center">
            <div className="mb-8 relative">
              <RouletteWheel 
                prizes={prizes} 
                spinning={spinning} 
                spinAngle={spinAngle} 
                spinDuration={spinDuration} 
              />
              
              {/* Enhanced sound toggle button */}
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute top-2 right-2 h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90 shadow-md transition-all duration-300"
                onClick={toggleSound}
              >
                {soundEnabled ? (
                  <Volume2 className="h-4 w-4 text-primary" />
                ) : (
                  <VolumeX className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            
            <div className="w-full max-w-xs flex flex-col items-center gap-6">
              <SpinButton onSpin={spin} disabled={spinning} />
              
              {/* Enhanced customize button */}
              <PrizeCustomizer prizes={prizes} onUpdate={updatePrizes} />
            </div>
          </div>
          
          {/* Right sidebar - Current Prize */}
          <div className="lg:col-span-1 order-2 lg:order-3">
            <PrizeDisplay result={currentResult} showAnimation={showWinAnimation} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
