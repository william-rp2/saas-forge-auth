/**
 * Authentication utilities and types
 * Provides type-safe authentication helpers and user management
 */

import { mockAuth, isMockEnabled } from '@/mocks';

/**
 * User authentication state
 */
export interface User {
  id: string;
  fullName: string;
  email: string;
  selectedPlan: 'basic' | 'pro' | 'enterprise';
}

/**
 * Authentication context state
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration data
 */
export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  selectedPlan: 'basic' | 'pro' | 'enterprise';
  acceptTerms: boolean;
  acceptPrivacy: boolean;
}

/**
 * Authentication API service
 * Switches between mock and real API based on environment
 */
export const authApi = {
  /**
   * Authenticate user with email and password
   */
  login: async (credentials: LoginCredentials) => {
    if (isMockEnabled()) {
      return mockAuth.login(credentials.email, credentials.password);
    }
    
    // TODO: Replace with real API call when Supabase is connected
    throw new Error('Real API not implemented yet. Please enable mocks.');
  },

  /**
   * Register new user
   */
  register: async (data: RegisterData) => {
    if (isMockEnabled()) {
      return mockAuth.register({
        name: data.fullName,
        email: data.email,
        password: data.password,
        selectedPlan: data.selectedPlan,
      });
    }
    
    // TODO: Replace with real API call when Supabase is connected
    throw new Error('Real API not implemented yet. Please enable mocks.');
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email: string) => {
    if (isMockEnabled()) {
      return mockAuth.forgotPassword(email);
    }
    
    // TODO: Replace with real API call when Supabase is connected
    throw new Error('Real API not implemented yet. Please enable mocks.');
  },

  /**
   * Authenticate with Google
   */
  googleLogin: async () => {
    if (isMockEnabled()) {
      return mockAuth.googleLogin();
    }
    
    // TODO: Replace with real API call when Supabase is connected
    throw new Error('Real API not implemented yet. Please enable mocks.');
  },
};

/**
 * Local storage keys for persistence
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'saas_core_auth_token',
  USER_DATA: 'saas_core_user_data',
} as const;

/**
 * Utility functions for token management
 */
export const tokenUtils = {
  /**
   * Store authentication token
   */
  store: (token: string) => {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  /**
   * Retrieve authentication token
   */
  get: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  /**
   * Remove authentication token
   */
  remove: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  },
};