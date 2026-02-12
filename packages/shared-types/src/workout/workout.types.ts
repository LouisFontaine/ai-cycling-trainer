import { Entity, WorkoutIntensity, WorkoutType } from '../common';
import { WorkoutInterval } from './workout-interval.types';

export interface Workout extends Entity {
  name: string;
  description?: string;
  type: WorkoutType;
  intensity: WorkoutIntensity;
  durationMinutes: number;
  intervals: WorkoutInterval[];
  targetPowerWatts?: number;
  targetHeartRate?: number;
  userId: string;
  trainingPlanId?: string;
  scheduledDate?: Date;
  completedDate?: Date;
  notes?: string;
}

export interface CreateWorkoutDto {
  name: string;
  description?: string;
  type: WorkoutType;
  intensity: WorkoutIntensity;
  durationMinutes: number;
  intervals: Omit<WorkoutInterval, 'id' | 'workoutId'>[];
  targetPowerWatts?: number;
  targetHeartRate?: number;
  scheduledDate?: Date;
  notes?: string;
}

export interface UpdateWorkoutDto {
  name?: string;
  description?: string;
  scheduledDate?: Date;
  completedDate?: Date;
  notes?: string;
}
