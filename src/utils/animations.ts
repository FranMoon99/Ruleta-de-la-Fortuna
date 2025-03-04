export const playSpinSound = (): HTMLAudioElement => {
  const audio = new Audio();
  audio.src = 'https://assets.mixkit.co/sfx/preview/mixkit-casino-wheel-spinning-1057.mp3';
  audio.volume = 0.5;
  audio.play().catch(e => console.error("Error reproduciendo sonido de giro:", e));
  return audio;
};

export const playWinSound = (volume: number = 0.6): void => {
  const audio = new Audio();
  audio.src = 'https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3';
  audio.volume = volume;
  audio.play().catch(e => console.error("Error reproduciendo sonido de victoria:", e));
};

export const playClickSound = (volume: number = 0.3): void => {
  const audio = new Audio();
  audio.src = 'https://assets.mixkit.co/sfx/preview/mixkit-interface-click-1126.mp3';
  audio.volume = volume;
  audio.play().catch(e => console.error("Error reproduciendo sonido de clic:", e));
};

export const getRandomSpinDuration = (): number => {
  // Return a random duration between 5-7 seconds
  return 5 + Math.random() * 2;
};

export const getRandomSpinEasing = (): string => {
  const easings = [
    'cubic-bezier(0.2, 0.1, 0.1, 1)',
    'cubic-bezier(0.3, 0.1, 0.1, 1)',
    'cubic-bezier(0.4, 0.1, 0.1, 1)',
  ];
  return easings[Math.floor(Math.random() * easings.length)];
};

// Nuevas animaciones CSS como string para añadir al estilo global si es necesario
export const additionalAnimations = `
@keyframes confetti-fall {
  0% {
    transform: translateY(-10px) rotate(0deg) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  30% {
    transform: translateY(30px) rotate(90deg) scale(1);
  }
  100% {
    transform: translateY(200px) rotate(720deg) scale(0);
    opacity: 0;
  }
}

@keyframes floating {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes glow-pulse {
  0%, 100% { filter: brightness(1) drop-shadow(0 0 5px rgba(255,255,255,0.2)); }
  50% { filter: brightness(1.3) drop-shadow(0 0 10px rgba(255,255,255,0.5)); }
}
`;
