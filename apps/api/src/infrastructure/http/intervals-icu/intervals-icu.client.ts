import { Injectable } from '@nestjs/common';
import { InvalidIntervalsIcuCredentialsException } from '@domain/exceptions/domain.exception';
import {
  IIntervalsIcuClient,
  IntervalsIcuAthlete,
} from '@application/services/intervals-icu-client.interface';

@Injectable()
export class IntervalsIcuClient implements IIntervalsIcuClient {
  private readonly baseUrl = 'https://intervals.icu/api/v1';

  async getAthlete(athleteId: string, apiKey: string): Promise<IntervalsIcuAthlete> {
    const credentials = Buffer.from(`API_KEY:${apiKey}`).toString('base64');

    const response = await fetch(`${this.baseUrl}/athlete/${athleteId}`, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new InvalidIntervalsIcuCredentialsException();
      }
      throw new Error(`Intervals.icu API error: ${response.status} ${response.statusText}`);
    }

    const data: Record<string, any> = await response.json();

    return {
      id: data.id,
      name: data.name ?? `${data.firstname ?? ''} ${data.lastname ?? ''}`.trim(),
    };
  }
}
