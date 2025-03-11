
import React from 'react';
import { Volume2, Volume1, VolumeX, Music, Bell } from 'lucide-react';
import { SoundSettings as SoundSettingsType } from '@/hooks/useRoulette';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent
} from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { playClickSound } from '@/utils/animations';

interface SoundSettingsProps {
  settings: SoundSettingsType;
  onUpdate: (settings: Partial<SoundSettingsType>) => void;
}

const SoundSettings: React.FC<SoundSettingsProps> = ({ settings, onUpdate }) => {
  const handleVolumeChange = (value: number[]) => {
    onUpdate({ masterVolume: value[0] });
  };
  
  const toggleSpinSound = () => {
    onUpdate({ spinSound: !settings.spinSound });
    if (settings.clickSound) playClickSound();
  };
  
  const toggleWinSound = () => {
    onUpdate({ winSound: !settings.winSound });
    if (settings.clickSound) playClickSound();
  };
  
  const toggleClickSound = () => {
    onUpdate({ clickSound: !settings.clickSound });
    if (settings.clickSound) playClickSound();
  };
  
  const getVolumeIcon = () => {
    if (settings.masterVolume === 0) return <VolumeX className="h-5 w-5" />;
    if (settings.masterVolume < 0.5) return <Volume1 className="h-5 w-5" />;
    return <Volume2 className="h-5 w-5" />;
  };
  
  return (
    <Card className="glass-panel">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl">
          {getVolumeIcon()}
          Sonidos
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="master-volume">Volumen principal</Label>
            <span className="text-sm text-muted-foreground">
              {Math.round(settings.masterVolume * 100)}%
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <VolumeX className="h-4 w-4 text-muted-foreground" />
            <Slider
              id="master-volume"
              max={1}
              min={0}
              step={0.01}
              value={[settings.masterVolume]}
              onValueChange={handleVolumeChange}
              className="flex-1"
            />
            <Volume2 className="h-4 w-4" />
          </div>
        </div>
        
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              <Label htmlFor="spin-sound" className="cursor-pointer">Sonido de giro</Label>
            </div>
            <Switch 
              id="spin-sound" 
              checked={settings.spinSound}
              onCheckedChange={toggleSpinSound}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <Label htmlFor="win-sound" className="cursor-pointer">Sonido de victoria</Label>
            </div>
            <Switch 
              id="win-sound" 
              checked={settings.winSound}
              onCheckedChange={toggleWinSound}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 opacity-70" />
              <Label htmlFor="click-sound" className="cursor-pointer">Sonido de clic</Label>
            </div>
            <Switch 
              id="click-sound" 
              checked={settings.clickSound}
              onCheckedChange={toggleClickSound}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SoundSettings;
