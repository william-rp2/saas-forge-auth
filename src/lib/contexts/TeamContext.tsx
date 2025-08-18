/**
 * Contexto global para gerenciamento de equipes
 * Controla a equipe atual selecionada e operações relacionadas
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockDb } from '@/mocks/db';

export interface Team {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  teamId: string;
  userId: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  joinedAt: string;
}

export interface TeamInvitation {
  id: string;
  teamId: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  createdAt: string;
}

interface TeamContextValue {
  /** Equipe atualmente selecionada */
  currentTeam: Team | null;
  /** ID da equipe atual */
  currentTeamId: string | null;
  /** Todas as equipes do usuário */
  userTeams: Team[];
  /** Função para alterar a equipe atual */
  switchTeam: (teamId: string) => void;
  /** Função para criar nova equipe */
  createTeam: (name: string) => Promise<Team>;
  /** Função para obter membros da equipe atual */
  getTeamMembers: () => TeamMember[];
  /** Função para obter convites pendentes */
  getPendingInvitations: () => TeamInvitation[];
  /** Função para convidar membro */
  inviteMember: (email: string, role: 'ADMIN' | 'MEMBER') => Promise<void>;
  /** Função para alterar role de membro */
  updateMemberRole: (userId: string, newRole: 'ADMIN' | 'MEMBER') => Promise<void>;
  /** Função para remover membro */
  removeMember: (userId: string) => Promise<void>;
  /** Loading state */
  isLoading: boolean;
}

const TeamContext = createContext<TeamContextValue | undefined>(undefined);

interface TeamProviderProps {
  children: ReactNode;
}

/**
 * Provider do contexto de equipes
 */
export function TeamProvider({ children }: TeamProviderProps) {
  const [currentTeamId, setCurrentTeamId] = useState<string | null>(null);
  const [userTeams, setUserTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simula usuário logado (ID 1)
  const currentUserId = '1';

  // Inicialização - carrega equipes do usuário
  useEffect(() => {
    const loadUserTeams = () => {
      setIsLoading(true);
      
      // Busca todas as equipes onde o usuário é membro
      const teams = mockDb.getUserTeams(currentUserId);
      setUserTeams(teams);

      // Define a primeira equipe como padrão ou recupera do localStorage
      const savedTeamId = localStorage.getItem('currentTeamId');
      if (savedTeamId && teams.find(team => team.id === savedTeamId)) {
        setCurrentTeamId(savedTeamId);
      } else if (teams.length > 0) {
        setCurrentTeamId(teams[0].id);
      }

      setIsLoading(false);
    };

    loadUserTeams();
  }, [currentUserId]);

  // Salva a equipe atual no localStorage
  useEffect(() => {
    if (currentTeamId) {
      localStorage.setItem('currentTeamId', currentTeamId);
    }
  }, [currentTeamId]);

  const currentTeam = userTeams.find(team => team.id === currentTeamId) || null;

  const switchTeam = (teamId: string) => {
    setCurrentTeamId(teamId);
  };

  const createTeam = async (name: string): Promise<Team> => {
    const newTeam = mockDb.createTeam({
      name,
      ownerId: currentUserId,
    });

    // Adiciona o usuário como owner
    mockDb.addTeamMember({
      teamId: newTeam.id,
      userId: currentUserId,
      role: 'OWNER',
    });

    // Atualiza a lista de equipes
    const updatedTeams = mockDb.getUserTeams(currentUserId);
    setUserTeams(updatedTeams);
    
    // Seleciona a nova equipe
    setCurrentTeamId(newTeam.id);

    return newTeam;
  };

  const getTeamMembers = (): TeamMember[] => {
    if (!currentTeamId) return [];
    return mockDb.getTeamMembers(currentTeamId);
  };

  const getPendingInvitations = (): TeamInvitation[] => {
    if (!currentTeamId) return [];
    return mockDb.getTeamInvitations(currentTeamId, 'PENDING');
  };

  const inviteMember = async (email: string, role: 'ADMIN' | 'MEMBER'): Promise<void> => {
    if (!currentTeamId) throw new Error('Nenhuma equipe selecionada');

    await mockDb.createInvitation({
      teamId: currentTeamId,
      email,
      role,
      status: 'PENDING',
    });
  };

  const updateMemberRole = async (userId: string, newRole: 'ADMIN' | 'MEMBER'): Promise<void> => {
    if (!currentTeamId) throw new Error('Nenhuma equipe selecionada');
    
    await mockDb.updateTeamMemberRole(currentTeamId, userId, newRole);
  };

  const removeMember = async (userId: string): Promise<void> => {
    if (!currentTeamId) throw new Error('Nenhuma equipe selecionada');
    
    await mockDb.removeTeamMember(currentTeamId, userId);
  };

  const value: TeamContextValue = {
    currentTeam,
    currentTeamId,
    userTeams,
    switchTeam,
    createTeam,
    getTeamMembers,
    getPendingInvitations,
    inviteMember,
    updateMemberRole,
    removeMember,
    isLoading,
  };

  return (
    <TeamContext.Provider value={value}>
      {children}
    </TeamContext.Provider>
  );
}

/**
 * Hook para usar o contexto de equipes
 */
export function useTeams() {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeams deve ser usado dentro de um TeamProvider');
  }
  return context;
}

/**
 * Hook para verificar se o usuário tem uma equipe específica
 */
export function useTeamAccess(requiredRole?: TeamMember['role']) {
  const { currentTeamId, getTeamMembers } = useTeams();
  const currentUserId = '1'; // Simula usuário logado

  if (!currentTeamId) return { hasAccess: false, userRole: null };

  const members = getTeamMembers();
  const currentMember = members.find(member => member.userId === currentUserId);

  if (!currentMember) return { hasAccess: false, userRole: null };

  const hasAccess = requiredRole ? 
    (currentMember.role === 'OWNER' || currentMember.role === requiredRole) : 
    true;

  return { 
    hasAccess, 
    userRole: currentMember.role,
    isOwner: currentMember.role === 'OWNER',
    isAdmin: currentMember.role === 'ADMIN' || currentMember.role === 'OWNER'
  };
}