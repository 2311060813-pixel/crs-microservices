import axiosClient from './axiosClient';
import type { LoginRequest, LoginResponse } from '../types/auth';

export const login = (data: LoginRequest) => {
    return axiosClient.post<LoginResponse>('/api/auth/login', data);
};