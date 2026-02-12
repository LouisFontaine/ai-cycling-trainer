/**
 * Workout-related constants
 */

export const DEFAULT_WARMUP_DURATION_MINUTES = 10;
export const DEFAULT_COOLDOWN_DURATION_MINUTES = 10;
export const MIN_WORKOUT_DURATION_MINUTES = 15;
export const MAX_WORKOUT_DURATION_MINUTES = 600; // 10 hours

export const CALORIES_PER_WATT_HOUR = 3.6; // Approximate conversion

export function estimateCaloriesFromPower(avgWatts: number, durationMinutes: number): number {
  const hours = durationMinutes / 60;
  return Math.round(avgWatts * hours * CALORIES_PER_WATT_HOUR);
}

export function estimateTSSFromPower(
  normalizedPower: number,
  durationMinutes: number,
  ftp: number,
): number {
  const hours = durationMinutes / 60;
  const intensityFactor = normalizedPower / ftp;
  return Math.round(hours * intensityFactor * intensityFactor * 100);
}
