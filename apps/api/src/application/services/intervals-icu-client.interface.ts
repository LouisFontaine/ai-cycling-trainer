export {
  IntervalsIcuEvent,
  IntervalsIcuWorkoutStep,
  IntervalsIcuZoneTime,
} from '@domain/types/intervals-icu.types';

import type { IntervalsIcuEvent } from '@domain/types/intervals-icu.types';

export const INTERVALS_ICU_CLIENT = Symbol('INTERVALS_ICU_CLIENT');

export interface IntervalsIcuAthlete {
  id: string;
  name: string;
}

export interface IIntervalsIcuClient {
  getAthlete(athleteId: string, apiKey: string): Promise<IntervalsIcuAthlete>;
  getEvents(
    athleteId: string,
    apiKey: string,
    oldest: Date,
    newest: Date,
  ): Promise<IntervalsIcuEvent[]>;
}
