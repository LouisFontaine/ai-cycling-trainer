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
}
