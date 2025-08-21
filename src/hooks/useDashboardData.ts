/**
 * Custom hook for dashboard data management
 * Handles fetching and caching of dashboard statistics
 */

import { useState, useEffect } from 'react';
import { mockApi, isMockEnabled } from '@/mocks/handlers';
import { DashboardStats } from '@/lib/services/dashboard-service';

export interface UseDashboardDataReturn {
  data: DashboardStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching dashboard statistics
 */
export const useDashboardData = (): UseDashboardDataReturn => {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      
      if (isMockEnabled()) {
        // Use mock data in development
        response = await mockApi.dashboard.getDashboardStats();
        if (response.success) {
          setData(response.data);
        } else {
          throw new Error(response.message || 'Erro ao carregar dados');
        }
      } else {
        // Use real API in production
        const apiResponse = await fetch('/api/admin/dashboard-stats');
        
        if (!apiResponse.ok) {
          throw new Error(`HTTP error! status: ${apiResponse.status}`);
        }
        
        const result = await apiResponse.json();
        setData(result);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchDashboardData
  };
};

/**
 * Hook for fetching user growth metrics
 */
export const useUserGrowthData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (isMockEnabled()) {
          const response = await mockApi.dashboard.getUserGrowth();
          if (response.success) {
            setData(response.data);
          } else {
            throw new Error(response.message);
          }
        } else {
          const apiResponse = await fetch('/api/admin/user-growth');
          const result = await apiResponse.json();
          setData(result);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

/**
 * Hook for fetching team activity metrics
 */
export const useTeamActivityData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (isMockEnabled()) {
          const response = await mockApi.dashboard.getTeamActivity();
          if (response.success) {
            setData(response.data);
          } else {
            throw new Error(response.message);
          }
        } else {
          const apiResponse = await fetch('/api/admin/team-activity');
          const result = await apiResponse.json();
          setData(result);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};