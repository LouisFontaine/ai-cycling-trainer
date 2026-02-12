/**
 * Common types shared across the application
 */

export type UUID = string;

export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

export interface Entity extends Timestamps {
  id: UUID;
}

export enum WorkoutIntensity {
  RECOVERY = 'RECOVERY',
  ENDURANCE = 'ENDURANCE',
  TEMPO = 'TEMPO',
  THRESHOLD = 'THRESHOLD',
  VO2_MAX = 'VO2_MAX',
  ANAEROBIC = 'ANAEROBIC',
}

export enum WorkoutType {
  RIDE = 'RIDE',
  RUN = 'RUN',
  SWIM = 'SWIM',
  STRENGTH = 'STRENGTH',
  REST = 'REST',
}

export interface PowerZones {
  z1: { min: number; max: number }; // Recovery
  z2: { min: number; max: number }; // Endurance
  z3: { min: number; max: number }; // Tempo
  z4: { min: number; max: number }; // Threshold
  z5: { min: number; max: number }; // VO2 Max
  z6: { min: number; max: number }; // Anaerobic
}

export interface HeartRateZones {
  z1: { min: number; max: number };
  z2: { min: number; max: number };
  z3: { min: number; max: number };
  z4: { min: number; max: number };
  z5: { min: number; max: number };
}
