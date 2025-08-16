/**
 * Mock API handlers for authentication operations
 * Simulates backend API calls with realistic delays and responses
 */

import { mockDb, MockUser } from './db';

/**
 * Response types for mock API calls
 */
export interface AuthResponse {
  success: boolean;
  message: string;
  user?: Partial<MockUser>;
  token?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Simulates network delay
 */
const simulateDelay = (ms: number = 1000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Mock authentication handlers
 */
export const mockAuth = {
  /**
   * Simulate user login
   */
  login: async (email: string, password: string): Promise<AuthResponse> => {
    await simulateDelay();

    const user = mockDb.findUserByEmail(email);
    
    if (!user || password !== '123456') {
      return {
        success: false,
        message: 'E-mail ou senha inválidos',
      };
    }

    return {
      success: true,
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        selectedPlan: user.selectedPlan,
      },
      token: 'mock_jwt_token_' + user.id,
    };
  },

  /**
   * Simulate user registration
   */
  register: async (userData: {
    fullName: string;
    email: string;
    password: string;
    selectedPlan: 'basic' | 'pro' | 'enterprise';
  }): Promise<AuthResponse> => {
    await simulateDelay();

    // Check if user already exists
    const existingUser = mockDb.findUserByEmail(userData.email);
    if (existingUser) {
      return {
        success: false,
        message: 'Usuário já existe com este e-mail',
      };
    }

    // Create new user
    const newUser = mockDb.createUser({
      fullName: userData.fullName,
      email: userData.email,
      encryptedPassword: 'hashed_' + userData.password,
      provider: 'email',
      selectedPlan: userData.selectedPlan,
    });

    // Create associated profile
    mockDb.createProfile({
      userId: newUser.id,
    });

    return {
      success: true,
      message: 'Cadastro realizado com sucesso! Faça seu login.',
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        selectedPlan: newUser.selectedPlan,
      },
    };
  },

  /**
   * Simulate password reset request
   */
  forgotPassword: async (email: string): Promise<AuthResponse> => {
    await simulateDelay();

    // Always return success to prevent user enumeration
    return {
      success: true,
      message: 'Se um usuário com este e-mail existir, um link de recuperação será enviado.',
    };
  },

  /**
   * Simulate Google OAuth login
   */
  googleLogin: async (): Promise<AuthResponse> => {
    await simulateDelay();

    // Simulate successful Google login
    return {
      success: true,
      message: 'Login com Google realizado com sucesso',
      user: {
        id: 'google_user_1',
        fullName: 'Usuário Google',
        email: 'usuario@google.com',
        selectedPlan: 'basic',
      },
      token: 'mock_google_jwt_token',
    };
  },
};

/**
 * Check if mocks are enabled
 */
export const isMockEnabled = (): boolean => {
  return import.meta.env.VITE_USE_MOCKS === 'true' || import.meta.env.DEV;
};