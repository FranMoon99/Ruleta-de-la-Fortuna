
import { useRef, useCallback } from 'react';
import { playSpinSound, playWinSound, playClickSound } from '../utils/animations';
import { SoundSettings } from './useRouletteTypes';

export function useSoundEffects(soundSettings: SoundSettings) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const playSpin = useCallback(() => {
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
  }, [soundSettings]);
  
  const playWin = useCallback(() => {
    if (soundSettings.winSound) {
      const winAudio = new Audio();
      winAudio.src = 'https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3';
      winAudio.volume = soundSettings.masterVolume;
      winAudio.play();
    }
  }, [soundSettings]);
  
  const playClick = useCallback(() => {
    if (soundSettings.clickSound) {
      playClickSound(soundSettings.masterVolume);
    }
  }, [soundSettings]);
  
  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, []);
  
  return {
    playSpin,
    playWin,
    playClick,
    cleanup
  };
}
