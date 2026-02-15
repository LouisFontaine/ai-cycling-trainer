export const INTERVALS_ICU_CLIENT = Symbol('INTERVALS_ICU_CLIENT');

export interface IntervalsIcuAthlete {
  id: string;
  name: string;
}

export interface IIntervalsIcuClient {
  getAthlete(athleteId: string, apiKey: string): Promise<IntervalsIcuAthlete>;
}
