import api from './axios';
import type { LoginPayload, RegisterPayload, ApiResponse, IUser } from '../types/index';

export interface AuthSuccessPayload {
  token: string;
  user: IUser;
}

export const registerUser = async (data: RegisterPayload): Promise<ApiResponse<AuthSuccessPayload>> => {
  const response = await api.post<ApiResponse<AuthSuccessPayload>>('/auth/register', data);
  return response.data;
};

export const loginUser = async (data: LoginPayload): Promise<ApiResponse<AuthSuccessPayload>> => {
  const response = await api.post<ApiResponse<AuthSuccessPayload>>('/auth/login', data);
  return response.data;
};

export const getMe = async (): Promise<ApiResponse<{ user: IUser }>> => {
  const response = await api.get<ApiResponse<{ user: IUser }>>('/auth/me');
  return response.data;
};
