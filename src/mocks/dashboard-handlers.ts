/**
 * Mock API handlers for dashboard operations
 * Simulates backend dashboard API calls with realistic delays and responses
 */

import { DashboardService } from '@/lib/services/dashboard-service';

/**
 * Dashboard API handlers for MSW (Mock Service Worker)
 */
export const dashboardHandlers = {
  /**
   * GET /api/admin/dashboard-stats
   * Returns comprehensive dashboard statistics
   */
  getDashboardStats: async () => {
    try {
      const stats = await DashboardService.getDashboardStats();
      return {
        success: true,
        data: stats
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao carregar estatísticas do dashboard',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  },

  /**
   * GET /api/admin/user-growth
   * Returns user growth metrics
   */
  getUserGrowth: async () => {
    try {
      const metrics = await DashboardService.getUserGrowthMetrics();
      return {
        success: true,
        data: metrics
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao carregar métricas de crescimento',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  },

  /**
   * GET /api/admin/team-activity
   * Returns team activity metrics
   */
  getTeamActivity: async () => {
    try {
      const metrics = await DashboardService.getTeamActivityMetrics();
      return {
        success: true,
        data: metrics
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao carregar métricas de atividade',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }
};

/**
 * Simulate fetch API for dashboard endpoints
 */
export const mockDashboardFetch = (url: string) => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      let response;
      
      switch (url) {
        case '/api/admin/dashboard-stats':
          response = await dashboardHandlers.getDashboardStats();
          break;
        case '/api/admin/user-growth':
          response = await dashboardHandlers.getUserGrowth();
          break;
        case '/api/admin/team-activity':
          response = await dashboardHandlers.getTeamActivity();
          break;
        default:
          response = {
            success: false,
            message: 'Endpoint não encontrado'
          };
      }
      
      resolve({
        ok: response.success,
        json: () => Promise.resolve(response.success ? response.data : response)
      });
    }, 300); // Simulate network delay
  });
};