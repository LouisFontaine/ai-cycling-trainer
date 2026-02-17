export interface IntervalsIcuWorkoutStep {
  duration: number;
  ramp?: boolean;
  power?: { value?: number; start?: number; end?: number; units: string };
  cadence?: { value?: number; start?: number; end?: number; units: string };
}

export interface IntervalsIcuZoneTime {
  id: string;
  name: string;
  zone: number;
  secs: number;
  color: string;
  min?: number;
  max: number;
  minWatts: number;
  maxWatts: number;
}

export interface IntervalsIcuEvent {
  id: number;
  name: string;
  description?: string;
  start_date_local: string;
  type: string;
  category: string;
  moving_time?: number;
  icu_training_load?: number;
  color?: string;
  workout_doc?: {
    steps?: IntervalsIcuWorkoutStep[];
    duration?: number;
    zoneTimes?: IntervalsIcuZoneTime[];
  };
}
