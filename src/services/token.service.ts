import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { api } from '../api/client';
import { LoginResponse, RegisterRequest, RegisterResponse } from '../types/auth.types';

const TOKEN_KEY = 'auth_token';

export const login = async (email: string, password: string) => {
  console.log('Intentando login con:', { email, password });
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
      await deleteToken();
      router.replace('/');
    }
    return Promise.reject(error);
  }
);
