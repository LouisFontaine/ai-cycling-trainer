import apiClient from '@/lib/api-client';

export interface IntervalsIcuStatus {
  connected: boolean;
  athleteId?: string;
  athleteName?: string;
}

interface ConnectIntervalsIcuDto {
  athleteId: string;
  apiKey: string;
}

interface ConnectIntervalsIcuResponse {
  athleteName: string;
}

export const intervalsIcuService = {
  async getConnectionStatus(): Promise<IntervalsIcuStatus> {
    const response = await apiClient.get<IntervalsIcuStatus>(
      '/users/me/intervals-icu/status',
    );
    return response.data;
  },

  async connect(data: ConnectIntervalsIcuDto): Promise<ConnectIntervalsIcuResponse> {
    const response = await apiClient.put<ConnectIntervalsIcuResponse>(
      '/users/me/intervals-icu',
      data,
    );
    return response.data;
  },

  async disconnect(): Promise<void> {
    await apiClient.delete('/users/me/intervals-icu');
  },
};
