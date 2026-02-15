export class UserEntity {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  intervalsIcuUserId?: string;
  intervalsIcuApiKey?: string;
  createdAt: Date;
  updatedAt: Date;

  connectIntervalsIcu(
    athleteId: string,
    apiKey: string,
  ): { intervalsIcuUserId: string; intervalsIcuApiKey: string } {
    return {
      intervalsIcuUserId: athleteId,
      intervalsIcuApiKey: apiKey,
    };
  }

  disconnectFromIntervalsIcu(): { intervalsIcuUserId: null; intervalsIcuApiKey: null } {
    return {
      intervalsIcuUserId: null,
      intervalsIcuApiKey: null,
    };
  }
}
