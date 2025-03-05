
import { Prize } from '../utils/prizes';

export interface SpinResult {
  prize: Prize;
  timestamp: Date;
}

export interface SoundSettings {
  masterVolume: number;
  spinSound: boolean;
  winSound: boolean;
  clickSound: boolean;
}

export interface RouletteState {
  prizes: Prize[];
  spinning: boolean;
  currentResult: SpinResult | null;
  history: SpinResult[];
  spinAngle: number;
  spinDuration: number;
  statistics: Record<string, number>;
  soundSettings: SoundSettings;
  customMode: boolean;
  points: number;
  totalSpins: number;
  isLoadingUserData: boolean;
}

export const DEFAULT_SOUND_SETTINGS: SoundSettings = {
  masterVolume: 0.5,
  spinSound: true,
  winSound: true,
  clickSound: true
};
