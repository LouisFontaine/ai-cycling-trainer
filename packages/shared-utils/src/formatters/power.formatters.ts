/**
 * Power formatting utilities
 */

export function formatPower(watts: number): string {
  return `${Math.round(watts)}W`;
}

export function formatPowerWithFTP(watts: number, ftp: number): string {
  const percentage = Math.round((watts / ftp) * 100);
  return `${Math.round(watts)}W (${percentage}% FTP)`;
}

export function calculatePowerFromFTP(ftpWatts: number, percentage: number): number {
  return Math.round((ftpWatts * percentage) / 100);
}

export function calculateWattsPerKg(watts: number, weightKg: number): number {
  return Math.round((watts / weightKg) * 10) / 10;
}

export function formatWattsPerKg(watts: number, weightKg: number): string {
  const wPerKg = calculateWattsPerKg(watts, weightKg);
  return `${wPerKg} W/kg`;
}
