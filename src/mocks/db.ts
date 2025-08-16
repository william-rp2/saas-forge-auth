/**
 * Mock database containing simulated user data and RBAC structures
 * This replaces actual database calls during development
 */

export interface MockUser {
  id: string;
  fullName: string;
  email: string;
  encryptedPassword: string;
  provider: 'email' | 'google';
  selectedPlan: 'basic' | 'pro' | 'enterprise';
  roleId: string;
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
 * RBAC System Interfaces
 */
export interface MockPermission {
  id: string;
  action: string; // 'create', 'read', 'update', 'delete', 'manage'
  subject: string; // 'Project', 'Task', 'Billing', 'User', 'Role', 'all'
  name: string;
  description: string;
}

export interface MockRole {
  id: string;
  name: string;
  description: string;
  color: string;
  permissionIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MockRolePermission {
  roleId: string;
  permissionId: string;
}


/**
 * Mock permissions database
 * Granular permissions based on action + subject pattern
 */
export const mockPermissions: MockPermission[] = [
  // Project permissions
  { id: '1', action: 'create', subject: 'Project', name: 'Criar Projetos', description: 'Permitir criação de novos projetos' },
  { id: '2', action: 'read', subject: 'Project', name: 'Visualizar Projetos', description: 'Permitir visualização de projetos' },
  { id: '3', action: 'update', subject: 'Project', name: 'Editar Projetos', description: 'Permitir edição de projetos' },
  { id: '4', action: 'delete', subject: 'Project', name: 'Excluir Projetos', description: 'Permitir exclusão de projetos' },
  
  // Task permissions
  { id: '5', action: 'create', subject: 'Task', name: 'Criar Tarefas', description: 'Permitir criação de tarefas' },
  { id: '6', action: 'read', subject: 'Task', name: 'Visualizar Tarefas', description: 'Permitir visualização de tarefas' },
  { id: '7', action: 'update', subject: 'Task', name: 'Editar Tarefas', description: 'Permitir edição de tarefas' },
  { id: '8', action: 'delete', subject: 'Task', name: 'Excluir Tarefas', description: 'Permitir exclusão de tarefas' },
  
  // User management permissions
  { id: '9', action: 'create', subject: 'User', name: 'Criar Usuários', description: 'Permitir criação de usuários' },
  { id: '10', action: 'read', subject: 'User', name: 'Visualizar Usuários', description: 'Permitir visualização de usuários' },
  { id: '11', action: 'update', subject: 'User', name: 'Editar Usuários', description: 'Permitir edição de usuários' },
  { id: '12', action: 'delete', subject: 'User', name: 'Excluir Usuários', description: 'Permitir exclusão de usuários' },
  
  // Role management permissions
  { id: '13', action: 'create', subject: 'Role', name: 'Criar Perfis', description: 'Permitir criação de perfis de acesso' },
  { id: '14', action: 'read', subject: 'Role', name: 'Visualizar Perfis', description: 'Permitir visualização de perfis' },
  { id: '15', action: 'update', subject: 'Role', name: 'Editar Perfis', description: 'Permitir edição de perfis' },
  { id: '16', action: 'delete', subject: 'Role', name: 'Excluir Perfis', description: 'Permitir exclusão de perfis' },
  
  // Billing permissions
  { id: '17', action: 'read', subject: 'Billing', name: 'Visualizar Faturamento', description: 'Permitir visualização do faturamento' },
  { id: '18', action: 'update', subject: 'Billing', name: 'Gerenciar Faturamento', description: 'Permitir gestão do faturamento' },
  
  // System permissions
  { id: '19', action: 'read', subject: 'Analytics', name: 'Visualizar Analytics', description: 'Permitir acesso aos analytics' },
  { id: '20', action: 'read', subject: 'Settings', name: 'Visualizar Configurações', description: 'Permitir acesso às configurações' },
  { id: '21', action: 'update', subject: 'Settings', name: 'Editar Configurações', description: 'Permitir edição das configurações' },
  
  // Super admin permission
  { id: '22', action: 'manage', subject: 'all', name: 'Acesso Total', description: 'Acesso completo ao sistema' },
];

/**
 * Mock roles database
 */
export const mockRoles: MockRole[] = [
  {
    id: '1',
    name: 'Administrador',
    description: 'Acesso completo ao sistema',
    color: '#ef4444',
    permissionIds: ['22'], // manage all
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Membro da Equipe',
    description: 'Acesso para gerenciar projetos e tarefas',
    color: '#3b82f6',
    permissionIds: ['1', '2', '3', '5', '6', '7', '10', '19'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Cliente',
    description: 'Acesso somente leitura aos próprios projetos',
    color: '#10b981',
    permissionIds: ['2', '6', '20'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

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
    roleId: '1', // Administrator role
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    fullName: 'Maria Silva',
    email: 'maria@empresa.com',
    encryptedPassword: 'hashed_password',
    provider: 'email',
    selectedPlan: 'pro',
    roleId: '2', // Team Member role
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    fullName: 'João Santos',
    email: 'joao@cliente.com',
    encryptedPassword: 'hashed_password',
    provider: 'email',
    selectedPlan: 'basic',
    roleId: '3', // Client role
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
    bio: 'Administrador do sistema',
    company: 'SaaS Core',
  },
  {
    id: '2',
    userId: '2',
    bio: 'Desenvolvedora Full Stack',
    company: 'Empresa ABC',
  },
  {
    id: '3',
    userId: '3',
    bio: 'Gerente de Projetos',
    company: 'Cliente XYZ',
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
   * Find user by ID
   */
  findUserById: (id: string): MockUser | undefined => {
    return mockUsers.find(user => user.id === id);
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
   * Update user role
   */
  updateUserRole: (userId: string, roleId: string): MockUser | undefined => {
    const userIndex = mockUsers.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      mockUsers[userIndex].roleId = roleId;
      mockUsers[userIndex].updatedAt = new Date().toISOString();
      return mockUsers[userIndex];
    }
    return undefined;
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

  /**
   * RBAC Operations
   */

  /**
   * Get all permissions
   */
  getAllPermissions: (): MockPermission[] => {
    return [...mockPermissions];
  },

  /**
   * Get permissions by IDs
   */
  getPermissionsByIds: (permissionIds: string[]): MockPermission[] => {
    return mockPermissions.filter(permission => permissionIds.includes(permission.id));
  },

  /**
   * Get all roles
   */
  getAllRoles: (): MockRole[] => {
    return [...mockRoles];
  },

  /**
   * Find role by ID
   */
  findRoleById: (id: string): MockRole | undefined => {
    return mockRoles.find(role => role.id === id);
  },

  /**
   * Create new role
   */
  createRole: (roleData: Omit<MockRole, 'id' | 'createdAt' | 'updatedAt'>): MockRole => {
    const newRole: MockRole = {
      ...roleData,
      id: (mockRoles.length + 1).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockRoles.push(newRole);
    return newRole;
  },

  /**
   * Update role
   */
  updateRole: (id: string, updates: Partial<Omit<MockRole, 'id' | 'createdAt' | 'updatedAt'>>): MockRole | undefined => {
    const roleIndex = mockRoles.findIndex(role => role.id === id);
    if (roleIndex !== -1) {
      mockRoles[roleIndex] = {
        ...mockRoles[roleIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return mockRoles[roleIndex];
    }
    return undefined;
  },

  /**
   * Delete role
   */
  deleteRole: (id: string): boolean => {
    const roleIndex = mockRoles.findIndex(role => role.id === id);
    if (roleIndex !== -1) {
      mockRoles.splice(roleIndex, 1);
      return true;
    }
    return false;
  },

  /**
   * Get user permissions through their role
   */
  getUserPermissions: (userId: string): MockPermission[] => {
    const user = mockDb.findUserById(userId);
    if (!user) return [];

    const role = mockDb.findRoleById(user.roleId);
    if (!role) return [];

    return mockDb.getPermissionsByIds(role.permissionIds);
  },

  /**
   * Check if user has specific permission
   */
  userCan: (userId: string, action: string, subject: string): boolean => {
    const permissions = mockDb.getUserPermissions(userId);
    
    // Check for super admin permission (manage all)
    const hasManageAll = permissions.some(p => p.action === 'manage' && p.subject === 'all');
    if (hasManageAll) return true;

    // Check for specific permission
    return permissions.some(p => p.action === action && p.subject === subject);
  },

  /**
   * Get all users
   */
  getAllUsers: (): MockUser[] => {
    return [...mockUsers];
  },
};