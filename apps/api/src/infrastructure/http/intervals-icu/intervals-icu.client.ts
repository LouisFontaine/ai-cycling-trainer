import { Injectable } from '@nestjs/common';
import { InvalidIntervalsIcuCredentialsException } from '@domain/exceptions/domain.exception';
import {
  IIntervalsIcuClient,
  IntervalsIcuAthlete,
  IntervalsIcuEvent,
} from '@application/services/intervals-icu-client.interface';

@Injectable()
export class IntervalsIcuClient implements IIntervalsIcuClient {
  private readonly baseUrl = 'https://intervals.icu/api/v1';

  private buildAuthHeader(apiKey: string): string {
    const credentials = Buffer.from(`API_KEY:${apiKey}`).toString('base64');
    return `Basic ${credentials}`;
  }

  async getAthlete(athleteId: string, apiKey: string): Promise<IntervalsIcuAthlete> {
    const response = await fetch(`${this.baseUrl}/athlete/${athleteId}`, {
      method: 'GET',
      headers: {
        Authorization: this.buildAuthHeader(apiKey),
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new InvalidIntervalsIcuCredentialsException();
      }
      throw new Error(`Intervals.icu API error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as { id: string; name?: string; firstname?: string; lastname?: string };

    return {
      id: data.id,
      name: data.name ?? `${data.firstname ?? ''} ${data.lastname ?? ''}`.trim(),
    };
  }

  async getEvents(
    athleteId: string,
    apiKey: string,
    oldest: Date,
    newest: Date,
  ): Promise<IntervalsIcuEvent[]> {
    const params = new URLSearchParams({
      oldest: oldest.toISOString().split('T')[0],
      newest: newest.toISOString().split('T')[0],
      category: 'WORKOUT',
    });

    const response = await fetch(
      `${this.baseUrl}/athlete/${athleteId}/events?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          Authorization: this.buildAuthHeader(apiKey),
        },
      },
    );

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new InvalidIntervalsIcuCredentialsException();
      }
      throw new Error(`Intervals.icu API error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<IntervalsIcuEvent[]>;
  }
}
