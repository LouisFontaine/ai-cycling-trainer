import { Entity } from '../common';
import { Workout } from '../workout';

export interface TrainingPlan extends Entity {
  name: string;
  description?: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  goalDescription?: string;
  targetEventDate?: Date;
  weeklyHours: number;
  workouts: Workout[];
  isActive: boolean;
}

export interface CreateTrainingPlanDto {
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  goalDescription?: string;
  targetEventDate?: Date;
  weeklyHours: number;
}

export interface UpdateTrainingPlanDto {
  name?: string;
  description?: string;
  goalDescription?: string;
  targetEventDate?: Date;
  weeklyHours?: number;
  isActive?: boolean;
}

export interface GenerateTrainingPlanDto {
  goalDescription: string;
  startDate: Date;
  durationWeeks: number;
  weeklyHours: number;
  targetEventDate?: Date;
  focusAreas?: string[];
}
