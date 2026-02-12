/**
 * Workout validation utilities
 */

export function isValidDuration(durationMinutes: number): boolean {
  return durationMinutes > 0 && durationMinutes <= 600; // Max 10 hours
}

export function isValidPower(watts: number): boolean {
  return watts >= 0 && watts <= 2000; // Reasonable power range
}

export function isValidHeartRate(bpm: number): boolean {
  return bpm >= 30 && bpm <= 220; // Reasonable HR range
}

export function isValidCadence(rpm: number): boolean {
  return rpm >= 0 && rpm <= 200; // Reasonable cadence range
}

export function isValidFTP(watts: number): boolean {
  return watts >= 50 && watts <= 600; // Reasonable FTP range
}
