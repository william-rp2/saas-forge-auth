/**
 * Mock database containing simulated user data
 * This replaces actual database calls during development
 */

export interface MockUser {
  id: string;
  fullName: string;
  email: string;
  encryptedPassword: string;
  provider: 'email' | 'google';
  selectedPlan: 'basic' | 'pro' | 'enterprise';
  createdAt: string;
  updatedAt: string;
}

export interface MockProfile {
  id: string;
  userId: string;
  avatarUrl?: string;
  bio?: string;
  company?: string;
  website?: string;
}

/**
 * Mock users database
 * Default test user: teste@email.com / 123456
 */
export const mockUsers: MockUser[] = [
  {
    id: '1',
    fullName: 'Usuário Teste',
    email: 'teste@email.com',
    encryptedPassword: 'hashed_123456', // In real app, this would be properly hashed
    provider: 'email',
    selectedPlan: 'pro',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

/**
 * Mock profiles database
 */
export const mockProfiles: MockProfile[] = [
  {
    id: '1',
    userId: '1',
    bio: 'Usuário de teste do sistema',
    company: 'Empresa Teste',
  },
];

/**
 * Utility functions for mock database operations
 */
export const mockDb = {
  /**
   * Find user by email
   */
  findUserByEmail: (email: string): MockUser | undefined => {
    return mockUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
  },

  /**
   * Create new user
   */
  createUser: (userData: Omit<MockUser, 'id' | 'createdAt' | 'updatedAt'>): MockUser => {
    const newUser: MockUser = {
      ...userData,
      id: (mockUsers.length + 1).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    return newUser;
  },

  /**
   * Find profile by user ID
   */
  findProfileByUserId: (userId: string): MockProfile | undefined => {
    return mockProfiles.find(profile => profile.userId === userId);
  },

  /**
   * Create new profile
   */
  createProfile: (profileData: Omit<MockProfile, 'id'>): MockProfile => {
    const newProfile: MockProfile = {
      ...profileData,
      id: (mockProfiles.length + 1).toString(),
    };
    mockProfiles.push(newProfile);
    return newProfile;
  },
};