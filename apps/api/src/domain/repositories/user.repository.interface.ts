import { UserEntity } from '../entities/user.entity';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  passwordHash?: string;
  intervalsIcuUserId?: string | null;
  intervalsIcuApiKey?: string | null;
}

export interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
}

export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  create(user: CreateUserData): Promise<UserEntity>;
  update(id: string, data: UpdateUserData): Promise<UserEntity>;
}
