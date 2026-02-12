import { Entity } from '../common';

export enum IntervalType {
  WARMUP = 'WARMUP',
  WORK = 'WORK',
  REST = 'REST',
  COOLDOWN = 'COOLDOWN',
}

export interface WorkoutInterval extends Entity {
  workoutId: string;
  order: number;
  type: IntervalType;
  durationSeconds: number;
  targetPowerWatts?: number;
  targetPowerPercentFTP?: number;
  targetHeartRate?: number;
  targetCadence?: number;
  description?: string;
}
