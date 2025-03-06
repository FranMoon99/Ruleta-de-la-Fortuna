import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRoulette } from '@/hooks/useRoulette';
import RouletteWheel from '@/components/RouletteWheel';
import SpinButton from '@/components/SpinButton';
import PrizeDisplay from '@/components/PrizeDisplay';
import HistoryDisplay from '@/components/HistoryDisplay';
import PrizeCustomizer from '@/components/PrizeCustomizer';
import StatisticsDisplay from '@/components/StatisticsDisplay';
import SoundSettings from '@/components/SoundSettings';
import CustomRouletteMode from '@/components/CustomRouletteMode';
import ThemeToggle from '@/components/ThemeToggle';
import UserProfile from '@/components/UserProfile';
import PointsDisplay from '@/components/PointsDisplay';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Volume2, VolumeX, UserIcon, LogOut, BarChart2, History, Sliders, Award, User } from 'lucide-react';
import { playClickSound } from '@/utils/animations';
import { signOut } from '@/integrations/supabase/client';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { defaultPrizes } from '@/utils/prizes';
import { ThemeProvider } from '@/hooks/useTheme';
import AdBanner from '@/components/AdBanner';
import InterstitialAd from '@/components/InterstitialAd';
import { useAdManager } from '@/hooks/useAdManager';

const Index = () => {
  const {
    prizes,
    spinning,
    currentResult,
    history,
    spinAngle,
    spinDuration,
    statistics,
    soundSettings,
    customMode,
    points,
    totalSpins,
    isLoadingUserData,
    spin,
    updatePrizes,
    resetHistory,
    resetStatistics,
    updateSoundSettings,
    toggleCustomMode
  } = useRoulette();
  
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const { toast } = useToast();
  const { showInterstitial, trackAction, closeInterstitial } = useAdManager({ interstitialFrequency: 5 });
  
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
    
    if (!soundSettings.masterVolume) {
      HTMLAudioElement.prototype.play = function() {
        return new Promise((resolve) => resolve());
      };
    } else {
      HTMLAudioElement.prototype.play = originalPlay;
    }
    
    return () => {
      HTMLAudioElement.prototype.play = originalPlay;
    };
  }, [soundSettings.masterVolume]);
  
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
    const newVolume = soundSettings.masterVolume > 0 ? 0 : 0.5;
    updateSoundSettings({ masterVolume: newVolume });
    if (newVolume > 0 && soundSettings.clickSound) {
      playClickSound(newVolume);
    }
  };
  
  const handleSpin = () => {
    spin();
    trackAction();
  };
  
  return (
    <ThemeProvider soundSettings={soundSettings}>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-secondary/30 dark:from-slate-900 dark:via-slate-900 dark:to-primary/10">
        <div className="absolute top-0 left-0 right-0 h-60 bg-gradient-to-b from-primary/10 to-transparent dark:from-primary/5"></div>
        <div className="absolute bottom-0 left-0 right-0 h-60 bg-gradient-to-t from-primary/5 to-transparent dark:from-primary/5"></div>
        <div className="fixed top-1/4 -left-32 w-64 h-64 rounded-full bg-accent/10 filter blur-3xl dark:bg-accent/5"></div>
        <div className="fixed top-1/3 -right-32 w-80 h-80 rounded-full bg-primary/10 filter blur-3xl dark:bg-primary/5"></div>
        <div className="fixed bottom-1/4 left-1/4 w-40 h-40 rounded-full bg-primary/5 filter blur-3xl dark:bg-accent/5"></div>
        
        <Header />
        
        {showInterstitial && (
          <InterstitialAd onClose={closeInterstitial} />
        )}
        
        <main className="container px-4 py-4 md:py-8 mx-auto flex-1 relative z-10">
          <div className="absolute top-0 right-0 z-20 flex items-center gap-2 p-2">
            <ThemeToggle className="mr-2" />
          </div>
          
          <AdBanner format="horizontal" className="mb-6" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 xl:gap-12 mt-10 md:mt-0">
            <div className="lg:col-span-1 order-3 lg:order-1">
              <Tabs defaultValue="history" className="h-full">
                <TabsList className="grid grid-cols-3 mb-4 w-full">
                  <TabsTrigger value="history" className="flex items-center gap-1" onClick={() => soundSettings.clickSound && playClickSound(soundSettings.masterVolume)}>
                    <History className="h-4 w-4" />
                    <span className="hidden sm:inline">Historial</span>
                  </TabsTrigger>
                  <TabsTrigger value="statistics" className="flex items-center gap-1" onClick={() => soundSettings.clickSound && playClickSound(soundSettings.masterVolume)}>
                    <BarChart2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Estadísticas</span>
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-1" onClick={() => soundSettings.clickSound && playClickSound(soundSettings.masterVolume)}>
                    <Sliders className="h-4 w-4" />
                    <span className="hidden sm:inline">Ajustes</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="history" className="h-full">
                  <HistoryDisplay history={history} onReset={resetHistory} />
                </TabsContent>
                
                <TabsContent value="statistics" className="h-full">
                  <StatisticsDisplay 
                    statistics={statistics}
                    prizes={prizes}
                    onReset={resetStatistics}
                  />
                </TabsContent>
                
                <TabsContent value="settings" className="space-y-4">
                  <SoundSettings 
                    settings={soundSettings}
                    onUpdate={updateSoundSettings}
                  />
                  
                  <CustomRouletteMode 
                    prizes={defaultPrizes}
                    customMode={customMode}
                    onUpdate={updatePrizes}
                    onToggleMode={toggleCustomMode}
                  />
                </TabsContent>
              </Tabs>
              
              <div className="mt-4">
                <AdBanner format="rectangle" />
              </div>
            </div>
            
            <div className="lg:col-span-1 order-1 lg:order-2 flex flex-col items-center">
              <div className="mb-4 md:mb-8 relative">
                <div className="transform scale-75 md:scale-90 lg:scale-100 origin-top">
                  <RouletteWheel 
                    prizes={prizes} 
                    spinning={spinning} 
                    spinAngle={spinAngle} 
                    spinDuration={spinDuration} 
                  />
                </div>
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute top-2 right-2 h-9 w-9 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-white/90 dark:hover:bg-slate-800/90 shadow-md transition-all duration-300"
                  onClick={toggleSound}
                >
                  {soundSettings.masterVolume > 0 ? (
                    <Volume2 className="h-4 w-4 text-primary" />
                  ) : (
                    <VolumeX className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              
              <div className="w-full max-w-xs flex flex-col items-center gap-4 md:gap-6">
                <SpinButton onSpin={handleSpin} disabled={spinning} />
                
                <PrizeCustomizer prizes={prizes} onUpdate={updatePrizes} />
              </div>
            </div>
            
            <div className="lg:col-span-1 order-2 lg:order-3 space-y-4">
              <PrizeDisplay result={currentResult} showAnimation={showWinAnimation} />
              
              <PointsDisplay 
                points={points}
                isLoading={isLoadingUserData}
              />
              
              <div className="mt-6">
                <AdBanner format="rectangle" slot="5678901234" />
              </div>
            </div>
          </div>
          
          <AdBanner format="horizontal" className="mt-8" />
        </main>
        
        <Footer />
        <Toaster />
      </div>
    </ThemeProvider>
  );
};

export default Index;
