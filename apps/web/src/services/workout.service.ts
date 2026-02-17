import apiClient from '@/lib/api-client';

export enum IntervalType {
  WARMUP = 'WARMUP',
  WORK = 'WORK',
  REST = 'REST',
  COOLDOWN = 'COOLDOWN',
}

export interface WorkoutInterval {
  durationSeconds: number;
  type: IntervalType;
  powerTargetPercent?: number;
  powerStartPercent?: number;
  powerEndPercent?: number;
  isRamp?: boolean;
}

export interface NextWorkout {
  name: string;
  description?: string;
  scheduledDate: string;
  type: string;
  durationMinutes: number;
  intervals: WorkoutInterval[];
}

export const workoutService = {
  async getNextWorkout(): Promise<NextWorkout | null> {
    const response = await apiClient.get<NextWorkout | null>('/workout/next');
    return response.data;
  },
};
