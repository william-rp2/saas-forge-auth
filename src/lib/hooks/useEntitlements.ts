import { useMemo } from 'react';
import { mockDb } from '@/mocks/db';

/**
 * Hook para gerenciar entitlements (direitos/permissões) baseados no plano do usuário
 * Controla o acesso a features e limites de uso
 */
export interface EntitlementData {
  /**
   * Verifica se uma feature está habilitada para o plano do usuário
   * @param featureKey - Chave única da feature (ex: 'advanced-reports')
   * @returns true se a feature estiver habilitada
   */
  can: (featureKey: string) => boolean;
  
  /**
   * Obtém o valor de um limite para o plano do usuário
   * @param limitKey - Chave única do limite (ex: 'max-projects')
   * @returns Valor numérico do limite
   */
  getLimit: (limitKey: string) => number;
  
  /**
   * Obtém informações detalhadas do plano atual
   */
  currentPlan: {
    id: string;
    name: string;
    price: number;
    priceDescription: string;
  } | null;
}

/**
 * Hook useEntitlements
 * @param userId - ID do usuário (opcional, usa o usuário logado por padrão)
 * @returns Objeto com funções para verificar features e limites
 */
export function useEntitlements(userId?: string): EntitlementData {
  // Por enquanto, vamos usar o usuário mockado padrão
  const currentUserId = userId || '1';
  
  const entitlementData = useMemo(() => {
    const user = mockDb.findUserById(currentUserId);
    if (!user) {
      return {
        can: () => false,
        getLimit: () => 0,
        currentPlan: null,
      };
    }

    const plan = mockDb.findPlanById(user.planId);
    if (!plan) {
      return {
        can: () => false,
        getLimit: () => 0,
        currentPlan: null,
      };
    }

    const planFeatures = mockDb.getPlanFeatures(plan.id);
    const planLimits = mockDb.getPlanLimits(plan.id);

    return {
      can: (featureKey: string): boolean => {
        return planFeatures.some(feature => feature.key === featureKey);
      },
      
      getLimit: (limitKey: string): number => {
        const limit = planLimits.find(limit => limit.key === limitKey);
        return limit?.value || 0;
      },
      
      currentPlan: {
        id: plan.id,
        name: plan.name,
        price: plan.price,
        priceDescription: plan.priceDescription,
      },
    };
  }, [currentUserId]);

  return entitlementData;
}

/**
 * Hook para verificar uma feature específica
 * Útil para componentes que precisam verificar apenas uma feature
 */
export function useFeature(featureKey: string, userId?: string): boolean {
  const { can } = useEntitlements(userId);
  return can(featureKey);
}

/**
 * Hook para obter um limite específico
 * Útil para componentes que precisam verificar apenas um limite
 */
export function useLimit(limitKey: string, userId?: string): number {
  const { getLimit } = useEntitlements(userId);
  return getLimit(limitKey);
}