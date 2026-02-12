import apiClient from '@/lib/api-client';
import { Name } from '@/lib/value-objects';

interface ApiUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthResponse {
  accessToken: string;
  user: ApiUser;
}

function toAuthUser(raw: ApiUser) {
  return {
    id: raw.id,
    email: raw.email,
    firstName: Name.from(raw.firstName),
    lastName: Name.from(raw.lastName),
  };
}

interface LoginDto {
  email: string;
  password: string;
}

interface RegisterDto {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export const authService = {
  async register(data: RegisterDto) {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return { accessToken: response.data.accessToken, user: toAuthUser(response.data.user) };
  },

  async login(data: LoginDto) {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return { accessToken: response.data.accessToken, user: toAuthUser(response.data.user) };
  },

  async getMe() {
    const response = await apiClient.get<ApiUser>('/auth/me');
    return toAuthUser(response.data);
  },
};
