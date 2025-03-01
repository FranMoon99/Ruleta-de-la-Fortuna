
export const playSpinSound = (): HTMLAudioElement => {
  const audio = new Audio();
  audio.src = 'https://assets.mixkit.co/sfx/preview/mixkit-casino-wheel-spinning-1057.mp3';
  audio.volume = 0.5;
  audio.play();
  return audio;
};

export const playWinSound = (): void => {
  const audio = new Audio();
  audio.src = 'https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3';
  audio.volume = 0.5;
  audio.play();
};

export const playClickSound = (): void => {
  const audio = new Audio();
  audio.src = 'https://assets.mixkit.co/sfx/preview/mixkit-interface-click-1126.mp3';
  audio.volume = 0.3;
  audio.play();
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
