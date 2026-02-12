/**
 * Training load and stress calculations
 */

/**
 * Calculate Training Stress Score (TSS)
 * @param normalizedPower - Normalized Power for the workout
 * @param durationSeconds - Duration in seconds
 * @param ftp - Functional Threshold Power
 */
export function calculateTSS(
  normalizedPower: number,
  durationSeconds: number,
  ftp: number,
): number {
  const hours = durationSeconds / 3600;
  const intensityFactor = normalizedPower / ftp;
  return Math.round(hours * intensityFactor * intensityFactor * 100);
}

/**
 * Calculate Intensity Factor (IF)
 * @param normalizedPower - Normalized Power for the workout
 * @param ftp - Functional Threshold Power
 */
export function calculateIntensityFactor(normalizedPower: number, ftp: number): number {
  return Math.round((normalizedPower / ftp) * 100) / 100;
}

/**
 * Estimate Normalized Power from average power (rough approximation)
 * @param avgPower - Average power for the workout
 * @param variability - Power variability factor (1.0 = steady, 1.1+ = variable)
 */
export function estimateNormalizedPower(avgPower: number, variability: number = 1.05): number {
  return Math.round(avgPower * variability);
}

/**
 * Calculate weekly Training Load
 * @param weeklyTSS - Array of daily TSS values
 */
export function calculateWeeklyLoad(weeklyTSS: number[]): number {
  return weeklyTSS.reduce((sum, tss) => sum + tss, 0);
}

/**
 * Calculate Chronic Training Load (CTL) - Fitness
 * Simple exponentially weighted moving average over 42 days
 */
export function calculateCTL(dailyTSS: number[], days: number = 42): number {
  if (dailyTSS.length === 0) return 0;

  const recentTSS = dailyTSS.slice(-days);
  const sum = recentTSS.reduce((acc, val) => acc + val, 0);
  return Math.round(sum / days);
}

/**
 * Calculate Acute Training Load (ATL) - Fatigue
 * Simple exponentially weighted moving average over 7 days
 */
export function calculateATL(dailyTSS: number[], days: number = 7): number {
  if (dailyTSS.length === 0) return 0;

  const recentTSS = dailyTSS.slice(-days);
  const sum = recentTSS.reduce((acc, val) => acc + val, 0);
  return Math.round(sum / days);
}

/**
 * Calculate Training Stress Balance (TSB) - Form
 * TSB = CTL - ATL
 */
export function calculateTSB(ctl: number, atl: number): number {
  return Math.round(ctl - atl);
}
