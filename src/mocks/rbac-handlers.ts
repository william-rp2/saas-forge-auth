/**
 * RBAC mock handlers for role and permission management
 * Simulates backend operations for access control management
 */

import { mockDb, MockRole, MockUser } from './db';
import { AuthResponse, simulateDelay } from './handlers';

/**
 * RBAC specific response types
 */
export interface RoleResponse {
  success: boolean;
  message: string;
  role?: MockRole;
  roles?: MockRole[];
}

export interface UserRoleResponse {
  success: boolean;
  message: string;
  user?: MockUser;
}

/**
 * Mock RBAC handlers
 */
export const mockRbac = {
  /**
   * Get all roles
   */
  getRoles: async (): Promise<RoleResponse> => {
    await simulateDelay(500);
    
    return {
      success: true,
      message: 'Perfis carregados com sucesso',
      roles: mockDb.getAllRoles(),
    };
  },

  /**
   * Create new role
   */
  createRole: async (roleData: {
    name: string;
    description: string;
    color: string;
    permissionIds: string[];
  }): Promise<RoleResponse> => {
    await simulateDelay();

    // Check if role name already exists
    const existingRole = mockDb.getAllRoles().find(role => 
      role.name.toLowerCase() === roleData.name.toLowerCase()
    );

    if (existingRole) {
      return {
        success: false,
        message: 'Já existe um perfil com este nome',
      };
    }

    const newRole = mockDb.createRole(roleData);

    return {
      success: true,
      message: 'Perfil criado com sucesso',
      role: newRole,
    };
  },

  /**
   * Update existing role
   */
  updateRole: async (roleId: string, updates: {
    name?: string;
    description?: string;
    color?: string;
    permissionIds?: string[];
  }): Promise<RoleResponse> => {
    await simulateDelay();

    // Check if trying to update name to an existing one
    if (updates.name) {
      const existingRole = mockDb.getAllRoles().find(role => 
        role.id !== roleId && role.name.toLowerCase() === updates.name!.toLowerCase()
      );

      if (existingRole) {
        return {
          success: false,
          message: 'Já existe um perfil com este nome',
        };
      }
    }

    const updatedRole = mockDb.updateRole(roleId, updates);

    if (!updatedRole) {
      return {
        success: false,
        message: 'Perfil não encontrado',
      };
    }

    return {
      success: true,
      message: 'Perfil atualizado com sucesso',
      role: updatedRole,
    };
  },

  /**
   * Delete role
   */
  deleteRole: async (roleId: string): Promise<RoleResponse> => {
    await simulateDelay();

    // Check if role is in use by users
    const usersWithRole = mockDb.getAllUsers().filter(user => user.roleId === roleId);
    
    if (usersWithRole.length > 0) {
      return {
        success: false,
        message: `Não é possível excluir este perfil. ${usersWithRole.length} usuário(s) ainda estão associados a ele.`,
      };
    }

    const deleted = mockDb.deleteRole(roleId);

    if (!deleted) {
      return {
        success: false,
        message: 'Perfil não encontrado',
      };
    }

    return {
      success: true,
      message: 'Perfil excluído com sucesso',
    };
  },

  /**
   * Get users with their roles
   */
  getUsersWithRoles: async (): Promise<{
    success: boolean;
    message: string;
    users?: Array<MockUser & { roleName: string; roleColor: string }>;
  }> => {
    await simulateDelay(500);

    const users = mockDb.getAllUsers();
    const roles = mockDb.getAllRoles();

    const usersWithRoles = users.map(user => {
      const role = roles.find(r => r.id === user.roleId);
      return {
        ...user,
        roleName: role?.name || 'Sem Perfil',
        roleColor: role?.color || '#6b7280',
      };
    });

    return {
      success: true,
      message: 'Usuários carregados com sucesso',
      users: usersWithRoles,
    };
  },

  /**
   * Update user role
   */
  updateUserRole: async (userId: string, roleId: string): Promise<UserRoleResponse> => {
    await simulateDelay();

    // Check if role exists
    const role = mockDb.findRoleById(roleId);
    if (!role) {
      return {
        success: false,
        message: 'Perfil não encontrado',
      };
    }

    const updatedUser = mockDb.updateUserRole(userId, roleId);

    if (!updatedUser) {
      return {
        success: false,
        message: 'Usuário não encontrado',
      };
    }

    return {
      success: true,
      message: 'Perfil do usuário atualizado com sucesso',
      user: updatedUser,
    };
  },

  /**
   * Get permissions
   */
  getPermissions: async () => {
    await simulateDelay(300);

    return {
      success: true,
      message: 'Permissões carregadas com sucesso',
      permissions: mockDb.getAllPermissions(),
    };
  },
};