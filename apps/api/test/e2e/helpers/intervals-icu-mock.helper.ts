import { InvalidIntervalsIcuCredentialsException } from '@domain/exceptions/domain.exception';
import {
  IIntervalsIcuClient,
  IntervalsIcuAthlete,
  IntervalsIcuEvent,
} from '../../../src/application/services/intervals-icu-client.interface';

export class MockIntervalsIcuClient implements IIntervalsIcuClient {
  private shouldSucceed = true;
  private mockAthlete: IntervalsIcuAthlete = {
    id: 'i12345',
    name: 'Test Athlete',
  };
  private mockEvents: IntervalsIcuEvent[] = [];

  setSuccess(athlete?: Partial<IntervalsIcuAthlete>): void {
    this.shouldSucceed = true;
    if (athlete) {
      this.mockAthlete = { ...this.mockAthlete, ...athlete };
    }
  }

  setEvents(events: IntervalsIcuEvent[]): void {
    this.mockEvents = events;
  }

  setFailure(): void {
    this.shouldSucceed = false;
  }

  async getAthlete(athleteId: string): Promise<IntervalsIcuAthlete> {
    if (!this.shouldSucceed) {
      throw new InvalidIntervalsIcuCredentialsException();
    }
    return { ...this.mockAthlete, id: athleteId };
  }

  async getEvents(): Promise<IntervalsIcuEvent[]> {
    if (!this.shouldSucceed) {
      throw new InvalidIntervalsIcuCredentialsException();
    }
    return [...this.mockEvents];
  }
}
