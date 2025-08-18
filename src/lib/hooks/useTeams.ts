/**
 * Hook personalizado para operações com equipes
 * Simplifica o uso do contexto de equipes em componentes
 */

import { useTeams, useTeamAccess } from '@/lib/contexts/TeamContext';

/**
 * Hook principal para operações de equipes
 */
export function useTeamOperations() {
  const teams = useTeams();
  const access = useTeamAccess();

  return {
    ...teams,
    ...access,
  };
}

/**
 * Hook para verificar se o usuário precisa criar uma equipe
 */
export function useRequiresTeam() {
  const { userTeams, isLoading } = useTeams();
  
  return {
    requiresTeam: !isLoading && userTeams.length === 0,
    isLoading,
  };
}

/**
 * Hook para operações específicas de membros
 */
export function useTeamMembers() {
  const { 
    getTeamMembers, 
    inviteMember, 
    updateMemberRole, 
    removeMember,
    currentTeamId 
  } = useTeams();
  
  const { isOwner, isAdmin } = useTeamAccess();

  const members = getTeamMembers();

  const canInviteMembers = isAdmin;
  const canManageMembers = isAdmin;
  const canRemoveMembers = isOwner;

  return {
    members,
    inviteMember,
    updateMemberRole,
    removeMember,
    canInviteMembers,
    canManageMembers,
    canRemoveMembers,
    currentTeamId,
  };
}

/**
 * Hook para operações com convites
 */
export function useTeamInvitations() {
  const { getPendingInvitations, inviteMember } = useTeams();
  const { isAdmin } = useTeamAccess();

  const pendingInvitations = getPendingInvitations();

  return {
    pendingInvitations,
    inviteMember,
    canSendInvites: isAdmin,
  };
}