/**
 * Dashboard service for admin analytics
 * Provides aggregated data for dashboard components
 */

import { mockDb, mockUsers, mockTeams } from '@/mocks/db';

export interface DashboardStats {
  totalUsers: number;
  totalTeams: number;
  planDistribution: Array<{ name: string; value: number; color: string }>;
  weeklyTeams: Array<{ week: string; teams: number }>;
  revenueStats: {
    monthly: string;
    activeSubscribers: number;
    activityRate: string;
  };
}

/**
 * Simulates dashboard data aggregation
 * In production, this would query the database using Prisma
 */
export class DashboardService {
  /**
   * Get comprehensive dashboard statistics
   */
  static async getDashboardStats(): Promise<DashboardStats> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Get mock data
    const users = mockUsers;
    const teams = mockTeams;

    // Calculate total users and teams
    const totalUsers = users.length;
    const totalTeams = teams.length;

    // Calculate plan distribution
    const planCounts = {
      basic: users.filter(u => u.selectedPlan === 'basic').length,
      pro: users.filter(u => u.selectedPlan === 'pro').length,
      enterprise: users.filter(u => u.selectedPlan === 'enterprise').length,
    };

    const planDistribution = [
      { name: 'Free', value: planCounts.basic || 0, color: '#94a3b8' },
      { name: 'Pro', value: planCounts.pro || 0, color: '#3b82f6' },
      { name: 'Enterprise', value: planCounts.enterprise || 0, color: '#10b981' }
    ];

    // Generate weekly teams data (last 8 weeks)
    const weeklyTeams = this.generateWeeklyTeamsData();

    // Calculate revenue stats
    const revenueStats = this.calculateRevenueStats(planCounts);

    return {
      totalUsers,
      totalTeams,
      planDistribution,
      weeklyTeams,
      revenueStats
    };
  }

  /**
   * Generate mock weekly teams creation data
   */
  private static generateWeeklyTeamsData() {
    const weeks = [];
    const now = new Date();
    
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7));
      
      const weekLabel = `${weekStart.getDate().toString().padStart(2, '0')}/${(weekStart.getMonth() + 1).toString().padStart(2, '0')}`;
      
      // Generate random but realistic data
      const teams = Math.floor(Math.random() * 15) + 2;
      
      weeks.push({
        week: weekLabel,
        teams
      });
    }
    
    return weeks;
  }

  /**
   * Calculate revenue statistics based on plan distribution
   */
  private static calculateRevenueStats(planCounts: Record<string, number>) {
    const planPrices = {
      basic: 0,
      pro: 49.90,
      enterprise: 149.90
    };

    const monthlyRevenue = Object.entries(planCounts).reduce((total, [plan, count]) => {
      const price = planPrices[plan as keyof typeof planPrices] || 0;
      return total + (price * count);
    }, 0);

    const activeSubscribers = (planCounts.pro || 0) + (planCounts.enterprise || 0);
    const totalUsers = Object.values(planCounts).reduce((sum, count) => sum + count, 0);
    const activityRate = totalUsers > 0 ? Math.round((activeSubscribers / totalUsers) * 100) : 0;

    return {
      monthly: `R$ ${monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      activeSubscribers,
      activityRate: `${activityRate}%`
    };
  }

  /**
   * Get user growth metrics
   */
  static async getUserGrowthMetrics() {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      thisMonth: 127,
      lastMonth: 98,
      growth: '+29.6%'
    };
  }

  /**
   * Get team activity metrics
   */
  static async getTeamActivityMetrics() {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      activeTeams: 45,
      totalTeams: 67,
      activityRate: '67.2%'
    };
  }
}