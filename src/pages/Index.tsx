
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
import { Volume2, VolumeX, UserIcon, LogOut, LogIn, Mail, Github, Twitter } from 'lucide-react';
import { playClickSound } from '@/utils/animations';
import { supabase, signInWithProvider, signOut, authProviders } from '@/integrations/supabase/client';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  
  const toggleSound = () => {
    if (soundEnabled) {
      setSoundEnabled(false);
    } else {
      setSoundEnabled(true);
      playClickSound();
    }
  };
  
  const handleLogin = async (provider: 'google' | 'github' | 'facebook' | 'twitter' | 'discord') => {
    try {
      const { error } = await signInWithProvider(provider);
      
      if (error) {
        toast({
          title: "Error al iniciar sesión",
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Error al iniciar sesión",
        description: error.message || "Ha ocurrido un error inesperado",
        variant: "destructive"
      });
    }
  };
  
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  <span>Iniciar sesión</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleLogin('google')} className="cursor-pointer">
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLogin('github')} className="cursor-pointer">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLogin('twitter')} className="cursor-pointer">
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter/X
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
