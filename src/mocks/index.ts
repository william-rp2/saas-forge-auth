/**
 * Mock system configuration and exports
 * Central point for managing mock data and API simulation
 */

export { mockAuth, isMockEnabled } from './handlers';
export { mockDb, type MockUser, type MockProfile } from './db';

/**
 * Initialize mock system
 * Call this function to set up mocks if needed
 */
export const initializeMocks = () => {
  if (import.meta.env.VITE_USE_MOCKS === 'true' || import.meta.env.DEV) {
    console.log('🎭 Mock system initialized - Using simulated data');
  }
};