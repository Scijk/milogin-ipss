export type LoginResponse = {
  success: boolean;
  error?: string;
  data?: {
    token?: string;
    user?: {
      id: string;
      email: string;
      createdAt: string;
      updatedAt: string;
    };
  },
};

export type RegisterRequest = {
  email: string;
  password: string;
};

export type RegisterResponse = {
  success: boolean;
  message?: string;
};