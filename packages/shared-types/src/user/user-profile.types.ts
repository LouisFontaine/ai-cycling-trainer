import { Entity, PowerZones, HeartRateZones } from '../common';

export interface UserProfile extends Entity {
  userId: string;
  ftpWatts?: number;
  maxHeartRate?: number;
  restingHeartRate?: number;
  weightKg?: number;
  heightCm?: number;
  birthDate?: Date;
  powerZones?: PowerZones;
  heartRateZones?: HeartRateZones;
  weeklyTrainingHours?: number;
  experienceLevel?: ExperienceLevel;
}

export enum ExperienceLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  ELITE = 'ELITE',
}

export interface UpdateUserProfileDto {
  ftpWatts?: number;
  maxHeartRate?: number;
  restingHeartRate?: number;
  weightKg?: number;
  heightCm?: number;
  birthDate?: Date;
  weeklyTrainingHours?: number;
  experienceLevel?: ExperienceLevel;
}
