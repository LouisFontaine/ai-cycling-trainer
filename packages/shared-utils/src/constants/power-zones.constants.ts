/**
 * Power zone constants based on FTP percentages
 * Following standard Coggan power zones
 */

export const POWER_ZONE_PERCENTAGES = {
  Z1: { min: 0, max: 55 }, // Active Recovery
  Z2: { min: 56, max: 75 }, // Endurance
  Z3: { min: 76, max: 90 }, // Tempo
  Z4: { min: 91, max: 105 }, // Lactate Threshold
  Z5: { min: 106, max: 120 }, // VO2 Max
  Z6: { min: 121, max: 150 }, // Anaerobic Capacity
} as const;

export const HEART_RATE_ZONE_PERCENTAGES = {
  Z1: { min: 0, max: 68 }, // Active Recovery
  Z2: { min: 69, max: 83 }, // Endurance
  Z3: { min: 84, max: 94 }, // Tempo
  Z4: { min: 95, max: 105 }, // Lactate Threshold
  Z5: { min: 106, max: 120 }, // VO2 Max
} as const;

export function calculatePowerZonesFromFTP(ftp: number) {
  return {
    z1: {
      min: Math.round((ftp * POWER_ZONE_PERCENTAGES.Z1.min) / 100),
      max: Math.round((ftp * POWER_ZONE_PERCENTAGES.Z1.max) / 100),
    },
    z2: {
      min: Math.round((ftp * POWER_ZONE_PERCENTAGES.Z2.min) / 100),
      max: Math.round((ftp * POWER_ZONE_PERCENTAGES.Z2.max) / 100),
    },
    z3: {
      min: Math.round((ftp * POWER_ZONE_PERCENTAGES.Z3.min) / 100),
      max: Math.round((ftp * POWER_ZONE_PERCENTAGES.Z3.max) / 100),
    },
    z4: {
      min: Math.round((ftp * POWER_ZONE_PERCENTAGES.Z4.min) / 100),
      max: Math.round((ftp * POWER_ZONE_PERCENTAGES.Z4.max) / 100),
    },
    z5: {
      min: Math.round((ftp * POWER_ZONE_PERCENTAGES.Z5.min) / 100),
      max: Math.round((ftp * POWER_ZONE_PERCENTAGES.Z5.max) / 100),
    },
    z6: {
      min: Math.round((ftp * POWER_ZONE_PERCENTAGES.Z6.min) / 100),
      max: Math.round((ftp * POWER_ZONE_PERCENTAGES.Z6.max) / 100),
    },
  };
}

export function calculateHeartRateZonesFromMax(maxHR: number) {
  return {
    z1: {
      min: Math.round((maxHR * HEART_RATE_ZONE_PERCENTAGES.Z1.min) / 100),
      max: Math.round((maxHR * HEART_RATE_ZONE_PERCENTAGES.Z1.max) / 100),
    },
    z2: {
      min: Math.round((maxHR * HEART_RATE_ZONE_PERCENTAGES.Z2.min) / 100),
      max: Math.round((maxHR * HEART_RATE_ZONE_PERCENTAGES.Z2.max) / 100),
    },
    z3: {
      min: Math.round((maxHR * HEART_RATE_ZONE_PERCENTAGES.Z3.min) / 100),
      max: Math.round((maxHR * HEART_RATE_ZONE_PERCENTAGES.Z3.max) / 100),
    },
    z4: {
      min: Math.round((maxHR * HEART_RATE_ZONE_PERCENTAGES.Z4.min) / 100),
      max: Math.round((maxHR * HEART_RATE_ZONE_PERCENTAGES.Z4.max) / 100),
    },
    z5: {
      min: Math.round((maxHR * HEART_RATE_ZONE_PERCENTAGES.Z5.min) / 100),
      max: Math.round((maxHR * HEART_RATE_ZONE_PERCENTAGES.Z5.max) / 100),
    },
  };
}
