
import { useRef, useEffect } from 'react';
import { SoundSettings } from './useRouletteTypes';
import { playSpinSound, playWinSound } from '../utils/animations';

export const useSoundEffects = (soundSettings: SoundSettings) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Handle global audio behavior based on sound settings
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

  const playRouletteSpinSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (soundSettings.spinSound) {
      audioRef.current = playSpinSound();
      if (audioRef.current) {
        audioRef.current.volume = soundSettings.masterVolume;
      }
    }
  };

  const playRouletteWinSound = () => {
    if (soundSettings.winSound) {
      const winAudio = new Audio();
      winAudio.src = 'https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3';
      winAudio.volume = soundSettings.masterVolume;
      winAudio.play();
    }
  };

  // Cleanup function
  const cleanupSounds = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  return {
    audioRef,
    playRouletteSpinSound,
    playRouletteWinSound,
    cleanupSounds
  };
};
