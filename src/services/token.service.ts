import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { api } from '../api/client';
import { LoginResponse, RegisterRequest, RegisterResponse } from '../types/auth.types';

type JwtPayload = {
  exp?: number;
};

const TOKEN_KEY = 'auth_token';

export const login = async (email: string, password: string) => {
  try {
    const { data } = await api.post<LoginResponse>('/auth/login', {
      email,
      password
    });

    return data;
  } catch (error) {
    console.log('Error en login:', error);
    throw error;
  }
};

export const registerUser = async (payload: RegisterRequest) => {
  const { data } = await api.post<RegisterResponse>('/auth/register',
    payload
  );

  return data;
};

export const saveToken = async (token: string) => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

export const getToken = async () => {
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

export const deleteToken = async () => {
  if(!!SecureStore.getItemAsync(TOKEN_KEY)) {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
};

// Response: detecta 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      await logout();
      router.replace('/');
    }
    return Promise.reject(error);
  }
);

export const isTokenExpired = async (): Promise<boolean> => {
  const token = await getToken();
  if (!token) return true;

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    if (!decoded.exp) return true;

    const now = Date.now() / 1000;
    return decoded.exp < now;
  } catch {
    return true;
  }
};

export const logout = async () => {
  await deleteToken();
};