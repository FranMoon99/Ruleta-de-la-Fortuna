import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRoulette } from '@/hooks/useRoulette';
import RouletteWheel from '@/components/RouletteWheel';
import SpinButton from '@/components/SpinButton';
import PrizeDisplay from '@/components/PrizeDisplay';
import HistoryDisplay from '@/components/HistoryDisplay';
import PrizeCustomizer from '@/components/PrizeCustomizer';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, UserIcon, LogOut } from 'lucide-react';
import { playClickSound } from '@/utils/animations';
import { signOut } from '@/integrations/supabase/client';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const {
    prizes,
    spinning,
    currentResult,
    history,
    spinAngle,
    spinDuration,
    user,
    spin,
    updatePrizes,
    resetHistory
  } = useRoulette();
  
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    if (!spinning && currentResult) {
      setShowWinAnimation(true);
      const timer = setTimeout(() => {
        setShowWinAnimation(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [spinning, currentResult]);
  
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
  
  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente"
      });
    } catch (error: any) {
      toast({
        title: "Error al cerrar sesión",
        description: error.message || "Ha ocurrido un error inesperado",
        variant: "destructive"
      });
    }
  };
  
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
      <div className="absolute top-0 left-0 right-0 h-60 bg-gradient-to-b from-primary/10 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-60 bg-gradient-to-t from-primary/5 to-transparent"></div>
      <div className="fixed top-1/4 -left-32 w-64 h-64 rounded-full bg-accent/10 filter blur-3xl"></div>
      <div className="fixed top-1/3 -right-32 w-80 h-80 rounded-full bg-primary/10 filter blur-3xl"></div>
      <div className="fixed bottom-1/4 left-1/4 w-40 h-40 rounded-full bg-primary/5 filter blur-3xl"></div>
      
      <Header />
      
      <main className="container px-4 py-8 mx-auto flex-1 relative z-10">
        <div className="absolute top-0 right-0 z-20">
          {user ? (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={handleLogout}
            >
              <UserIcon className="h-4 w-4" />
              <span className="hidden md:inline">{user.email}</span>
              <LogOut className="h-4 w-4" />
            </Button>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                <span>Iniciar sesión</span>
              </Button>
            </Link>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
          <div className="lg:col-span-1 order-3 lg:order-1">
            <HistoryDisplay history={history} onReset={resetHistory} />
          </div>
          
          <div className="lg:col-span-1 order-1 lg:order-2 flex flex-col items-center">
            <div className="mb-8 relative">
              <RouletteWheel 
                prizes={prizes} 
                spinning={spinning} 
                spinAngle={spinAngle} 
                spinDuration={spinDuration} 
              />
              
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
              
              <PrizeCustomizer prizes={prizes} onUpdate={updatePrizes} />
            </div>
          </div>
          
          <div className="lg:col-span-1 order-2 lg:order-3">
            <PrizeDisplay result={currentResult} showAnimation={showWinAnimation} />
          </div>
        </div>
      </main>
      
      <Footer />
      <Toaster />
    </div>
  );
};

export default Index;
