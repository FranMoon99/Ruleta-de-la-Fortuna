
import { useRef, useEffect, useState } from 'react';

interface SoundOptions {
  volume?: number;
  loop?: boolean;
  autoplay?: boolean;
}

export const useSound = (src: string, options: SoundOptions = {}) => {
  const { volume = 0.5, loop = false, autoplay = false } = options;
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  
  useEffect(() => {
    const audio = new Audio(src);
    audio.volume = volume;
    audio.loop = loop;
    
    audioRef.current = audio;
    
    if (autoplay) {
      audio.play().catch(e => console.error("Audio autoplay failed:", e));
    }
    
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [src, volume, loop, autoplay]);
  
  const play = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      setIsPlaying(true);
    }
  };
  
  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };
  
  const setVolume = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, newVolume));
    }
  };
  
  return { play, pause, stop, isPlaying, setVolume };
};
