export interface IntervalsIcuConnectionStatus {
  connected: boolean;
  athleteId?: string;
  athleteName?: string;
}

export interface ConnectIntervalsIcuRequest {
  athleteId: string;
  apiKey: string;
}

export interface ConnectIntervalsIcuResponse {
  athleteName: string;
}
