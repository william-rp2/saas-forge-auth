/**
 * Hook para gerenciar redirecionamentos pós-autenticação
 * Implementa a lógica de fluxo obrigatório de criação de equipe
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeams } from '@/lib/contexts/TeamContext';

/**
 * Configurações de redirecionamento baseadas no estado do usuário
 */
interface RedirectConfig {
  /** Se deve verificar se o usuário tem equipes */
  checkTeams?: boolean;
  /** URL padrão para redirecionamento se tiver equipes */
  defaultUrl?: string;
  /** URL para redirecionamento se não tiver equipes */
  noTeamsUrl?: string;
}

/**
 * Hook para gerenciar redirecionamentos pós-login
 * Garante que usuários sem equipes sejam direcionados para criação
 */
export function useAuthRedirect(config: RedirectConfig = {}) {
  const navigate = useNavigate();
  const { userTeams, isLoading } = useTeams();
  
  const {
    checkTeams = true,
    defaultUrl = '/dashboard',
    noTeamsUrl = '/teams/create'
  } = config;

  useEffect(() => {
    // Aguarda o carregamento das equipes
    if (isLoading) return;

    // Se não deve verificar equipes, redireciona para URL padrão
    if (!checkTeams) {
      navigate(defaultUrl);
      return;
    }

    // Verifica se o usuário tem equipes
    if (userTeams.length === 0) {
      // Usuário não tem equipes - deve criar uma
      navigate(noTeamsUrl);
    } else {
      // Usuário tem equipes - pode ir para o dashboard
      navigate(defaultUrl);
    }
  }, [isLoading, userTeams, checkTeams, defaultUrl, noTeamsUrl, navigate]);

  return {
    isRedirecting: isLoading,
    hasTeams: userTeams.length > 0,
  };
}

/**
 * Hook específico para verificar se usuário precisa criar equipe
 */
export function useRequireTeam() {
  const { userTeams, isLoading } = useTeams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && userTeams.length === 0) {
      navigate('/teams/create');
    }
  }, [isLoading, userTeams, navigate]);

  return {
    requiresTeam: !isLoading && userTeams.length === 0,
    isLoading,
  };
}