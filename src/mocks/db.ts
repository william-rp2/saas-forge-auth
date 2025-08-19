/**
 * Mock database containing simulated user data and RBAC structures
 * This replaces actual database calls during development
 */

export interface MockUser {
  id: string;
  name: string; // Changed from fullName for consistency
  email: string;
  encryptedPassword: string;
  provider: 'email' | 'google';
  selectedPlan: 'basic' | 'pro' | 'enterprise';
  roleId: string;
  planId: string; // New field for subscription plan
  birthDate?: string; // New field for birth date
  cpf?: string; // New field for CPF
  preferences?: { // New field for user preferences
    theme: 'light' | 'dark' | 'system';
    notifications: {
      productUpdates: boolean;
      accountActivity: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface MockProfile {
  id: string;
  userId: string;
  avatar?: string; // Changed from avatarUrl
  bio?: string;
  company?: string;
  website?: string;
}

/**
 * Entitlements System Interfaces
 */
export interface MockPlan {
  id: string;
  name: string;
  price: number;
  priceDescription: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MockFeature {
  id: string;
  key: string; // Unique identifier for the feature
  name: string;
  description: string;
}

export interface MockLimit {
  id: string;
  key: string; // Unique identifier for the limit
  name: string;
  description: string;
}

export interface MockPlanFeature {
  planId: string;
  featureId: string;
}

export interface MockPlanLimit {
  planId: string;
  limitId: string;
  value: number;
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
  
  // Product permissions
  { id: '23', action: 'create', subject: 'Product', name: 'Criar Produtos', description: 'Permitir criação de novos produtos' },
  { id: '24', action: 'read', subject: 'Product', name: 'Visualizar Produtos', description: 'Permitir visualização de produtos' },
  { id: '25', action: 'update', subject: 'Product', name: 'Editar Produtos', description: 'Permitir edição de produtos' },
  { id: '26', action: 'delete', subject: 'Product', name: 'Excluir Produtos', description: 'Permitir exclusão de produtos' },
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
    permissionIds: ['1', '2', '3', '5', '6', '7', '10', '19', '23', '24', '25', '26'],
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
 * Mock plans database
 */
export const mockPlans: MockPlan[] = [
  {
    id: '1',
    name: 'Free',
    price: 0,
    priceDescription: '/mês',
    description: 'Plano gratuito para começar',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Pro',
    price: 49.90,
    priceDescription: '/mês',
    description: 'Plano profissional com recursos avançados',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Enterprise',
    price: 149.90,
    priceDescription: '/mês',
    description: 'Plano corporativo com recursos ilimitados',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

/**
 * Mock features database
 */
export const mockFeatures: MockFeature[] = [
  {
    id: '1',
    key: 'advanced-reports',
    name: 'Relatórios Avançados',
    description: 'Acesso a relatórios detalhados e analytics',
  },
  {
    id: '2',
    key: 'api-access',
    name: 'Acesso à API',
    description: 'Integração via API REST',
  },
  {
    id: '3',
    key: 'priority-support',
    name: 'Suporte Prioritário',
    description: 'Suporte técnico com prioridade',
  },
  {
    id: '4',
    key: 'custom-branding',
    name: 'Marca Personalizada',
    description: 'Personalização da marca e logotipo',
  },
  {
    id: '5',
    key: 'unlimited-exports',
    name: 'Exportações Ilimitadas',
    description: 'Exportar dados sem limitações',
  },
];

/**
 * Mock limits database
 */
export const mockLimits: MockLimit[] = [
  {
    id: '1',
    key: 'max-projects',
    name: 'Máximo de Projetos',
    description: 'Número máximo de projetos que podem ser criados',
  },
  {
    id: '2',
    key: 'max-users',
    name: 'Máximo de Usuários',
    description: 'Número máximo de usuários na conta',
  },
  {
    id: '3',
    key: 'max-storage',
    name: 'Armazenamento (GB)',
    description: 'Limite de armazenamento em gigabytes',
  },
  {
    id: '4',
    key: 'max-api-calls',
    name: 'Chamadas API/mês',
    description: 'Número máximo de chamadas à API por mês',
  },
  {
    id: '5',
    key: 'max-products',
    name: 'Máximo de Produtos',
    description: 'Número máximo de produtos que podem ser criados',
  },
];

/**
 * Mock plan features relationships
 */
export const mockPlanFeatures: MockPlanFeature[] = [
  // Free plan - no features
  
  // Pro plan features
  { planId: '2', featureId: '1' }, // advanced-reports
  { planId: '2', featureId: '2' }, // api-access
  
  // Enterprise plan features (all features)
  { planId: '3', featureId: '1' }, // advanced-reports
  { planId: '3', featureId: '2' }, // api-access
  { planId: '3', featureId: '3' }, // priority-support
  { planId: '3', featureId: '4' }, // custom-branding
  { planId: '3', featureId: '5' }, // unlimited-exports
];

/**
 * Mock plan limits relationships
 */
export const mockPlanLimits: MockPlanLimit[] = [
  // Free plan limits
  { planId: '1', limitId: '1', value: 3 },    // max-projects: 3
  { planId: '1', limitId: '2', value: 1 },    // max-users: 1
  { planId: '1', limitId: '3', value: 1 },    // max-storage: 1GB
  { planId: '1', limitId: '4', value: 100 },  // max-api-calls: 100/month
  
  // Pro plan limits
  { planId: '2', limitId: '1', value: 50 },   // max-projects: 50
  { planId: '2', limitId: '2', value: 10 },   // max-users: 10
  { planId: '2', limitId: '3', value: 100 },  // max-storage: 100GB
  { planId: '2', limitId: '4', value: 10000 }, // max-api-calls: 10,000/month
  
  // Enterprise plan limits
  { planId: '3', limitId: '1', value: -1 },   // max-projects: unlimited
  { planId: '3', limitId: '2', value: -1 },   // max-users: unlimited
  { planId: '3', limitId: '3', value: 1000 }, // max-storage: 1TB
  { planId: '3', limitId: '4', value: -1 },   // max-api-calls: unlimited
  
  // Products limits for all plans
  { planId: '1', limitId: '5', value: 5 },    // max-products: 5 (Free)
  { planId: '2', limitId: '5', value: 100 },  // max-products: 100 (Pro)
  { planId: '3', limitId: '5', value: -1 },   // max-products: unlimited (Enterprise)
];

/**
 * Teams System Interfaces (Multi-Tenant Architecture)
 */
export interface MockTeam {
  id: string;
  name: string;
  ownerId: string; // FK to users.id
  createdAt: string;
  updatedAt: string;
}

export interface MockTeamMember {
  teamId: string;
  userId: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  joinedAt: string;
}

export interface MockTeamInvitation {
  id: string;
  teamId: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  createdAt: string;
}

/**
 * Mock teams database
 */
export const mockTeams: MockTeam[] = [
  {
    id: '1',
    name: 'Minha Primeira Equipe',
    ownerId: '1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Equipe ABC Corp',
    ownerId: '2',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
];

/**
 * Mock team members database
 */
export const mockTeamMembers: MockTeamMember[] = [
  {
    teamId: '1',
    userId: '1',
    role: 'OWNER',
    joinedAt: '2024-01-01T00:00:00Z',
  },
  {
    teamId: '1',
    userId: '3',
    role: 'MEMBER',
    joinedAt: '2024-01-05T00:00:00Z',
  },
  {
    teamId: '2',
    userId: '2',
    role: 'OWNER',
    joinedAt: '2024-01-02T00:00:00Z',
  },
  {
    teamId: '2',
    userId: '1',
    role: 'ADMIN',
    joinedAt: '2024-01-10T00:00:00Z',
  },
];

/**
 * Mock team invitations database
 */
export const mockTeamInvitations: MockTeamInvitation[] = [
  {
    id: '1',
    teamId: '1',
    email: 'novo@membro.com',
    role: 'MEMBER',
    status: 'PENDING',
    createdAt: '2024-01-15T00:00:00Z',
  },
];

/**
 * Mock users database
 * Default test user: teste@email.com / 123456
 */
export const mockUsers: MockUser[] = [
  {
    id: '1',
    name: 'Usuário Teste',
    email: 'teste@email.com',
    encryptedPassword: 'hashed_123456', // In real app, this would be properly hashed
    provider: 'email',
    selectedPlan: 'pro',
    roleId: '1', // Administrator role
    planId: '2', // Pro plan
    birthDate: '1990-01-15',
    cpf: '123.456.789-10',
    preferences: {
      theme: 'system',
      notifications: {
        productUpdates: true,
        accountActivity: true,
      },
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Maria Silva',
    email: 'maria@empresa.com',
    encryptedPassword: 'hashed_password',
    provider: 'email',
    selectedPlan: 'pro',
    roleId: '2', // Team Member role
    planId: '2', // Pro plan
    birthDate: '1985-06-22',
    cpf: '987.654.321-00',
    preferences: {
      theme: 'light',
      notifications: {
        productUpdates: true,
        accountActivity: false,
      },
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'João Santos',
    email: 'joao@cliente.com',
    encryptedPassword: 'hashed_password',
    provider: 'email',
    selectedPlan: 'basic',
    roleId: '3', // Client role
    planId: '1', // Free plan
    birthDate: '1992-11-08',
    preferences: {
      theme: 'dark',
      notifications: {
        productUpdates: false,
        accountActivity: true,
      },
    },
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
   * Update user data
   */
  updateUser: (userId: string, updates: Partial<Omit<MockUser, 'id' | 'createdAt' | 'updatedAt'>>): MockUser | undefined => {
    const userIndex = mockUsers.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
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

  /**
   * Entitlements Operations
   */

  /**
   * Get all plans
   */
  getAllPlans: (): MockPlan[] => {
    return [...mockPlans];
  },

  /**
   * Find plan by ID
   */
  findPlanById: (id: string): MockPlan | undefined => {
    return mockPlans.find(plan => plan.id === id);
  },

  /**
   * Create new plan
   */
  createPlan: (planData: Omit<MockPlan, 'id' | 'createdAt' | 'updatedAt'>): MockPlan => {
    const newPlan: MockPlan = {
      ...planData,
      id: (mockPlans.length + 1).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockPlans.push(newPlan);
    return newPlan;
  },

  /**
   * Update plan
   */
  updatePlan: (id: string, updates: Partial<Omit<MockPlan, 'id' | 'createdAt' | 'updatedAt'>>): MockPlan | undefined => {
    const planIndex = mockPlans.findIndex(plan => plan.id === id);
    if (planIndex !== -1) {
      mockPlans[planIndex] = {
        ...mockPlans[planIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return mockPlans[planIndex];
    }
    return undefined;
  },

  /**
   * Delete plan
   */
  deletePlan: (id: string): boolean => {
    const planIndex = mockPlans.findIndex(plan => plan.id === id);
    if (planIndex !== -1) {
      mockPlans.splice(planIndex, 1);
      return true;
    }
    return false;
  },

  /**
   * Get all features
   */
  getAllFeatures: (): MockFeature[] => {
    return [...mockFeatures];
  },

  /**
   * Get all limits
   */
  getAllLimits: (): MockLimit[] => {
    return [...mockLimits];
  },

  /**
   * Get features for a specific plan
   */
  getPlanFeatures: (planId: string): MockFeature[] => {
    const planFeatureIds = mockPlanFeatures
      .filter(pf => pf.planId === planId)
      .map(pf => pf.featureId);
    
    return mockFeatures.filter(feature => planFeatureIds.includes(feature.id));
  },

  /**
   * Get limits for a specific plan
   */
  getPlanLimits: (planId: string): Array<MockLimit & { value: number }> => {
    const planLimitData = mockPlanLimits.filter(pl => pl.planId === planId);
    
    return planLimitData.map(pl => {
      const limit = mockLimits.find(l => l.id === pl.limitId);
      return {
        ...limit!,
        value: pl.value,
      };
    });
  },

  /**
   * Update plan features
   */
  updatePlanFeatures: (planId: string, featureIds: string[]): void => {
    // Remove existing features for this plan
    const filteredFeatures = mockPlanFeatures.filter(pf => pf.planId !== planId);
    mockPlanFeatures.length = 0;
    mockPlanFeatures.push(...filteredFeatures);
    
    // Add new features
    featureIds.forEach(featureId => {
      mockPlanFeatures.push({ planId, featureId });
    });
  },

  /**
   * Update plan limits
   */
  updatePlanLimits: (planId: string, limits: Array<{ limitId: string; value: number }>): void => {
    // Remove existing limits for this plan
    const filteredLimits = mockPlanLimits.filter(pl => pl.planId !== planId);
    mockPlanLimits.length = 0;
    mockPlanLimits.push(...filteredLimits);
    
    // Add new limits
    limits.forEach(({ limitId, value }) => {
      mockPlanLimits.push({ planId, limitId, value });
    });
  },

  /**
   * Teams Operations (Multi-Tenant System)
   */

  /**
   * Get all teams where user is a member
   */
  getUserTeams: (userId: string): MockTeam[] => {
    const userTeamIds = mockTeamMembers
      .filter(member => member.userId === userId)
      .map(member => member.teamId);
    
    return mockTeams.filter(team => userTeamIds.includes(team.id));
  },

  /**
   * Create new team
   */
  createTeam: (teamData: Omit<MockTeam, 'id' | 'createdAt' | 'updatedAt'>): MockTeam => {
    const newTeam: MockTeam = {
      ...teamData,
      id: (mockTeams.length + 1).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockTeams.push(newTeam);
    return newTeam;
  },

  /**
   * Find team by ID
   */
  findTeamById: (id: string): MockTeam | undefined => {
    return mockTeams.find(team => team.id === id);
  },

  /**
   * Get team members
   */
  getTeamMembers: (teamId: string): MockTeamMember[] => {
    return mockTeamMembers.filter(member => member.teamId === teamId);
  },

  /**
   * Add member to team
   */
  addTeamMember: (memberData: Omit<MockTeamMember, 'joinedAt'>): MockTeamMember => {
    const newMember: MockTeamMember = {
      ...memberData,
      joinedAt: new Date().toISOString(),
    };
    mockTeamMembers.push(newMember);
    return newMember;
  },

  /**
   * Update team member role
   */
  updateTeamMemberRole: (teamId: string, userId: string, newRole: 'ADMIN' | 'MEMBER'): MockTeamMember | undefined => {
    const memberIndex = mockTeamMembers.findIndex(
      member => member.teamId === teamId && member.userId === userId
    );
    
    if (memberIndex !== -1) {
      mockTeamMembers[memberIndex].role = newRole;
      return mockTeamMembers[memberIndex];
    }
    return undefined;
  },

  /**
   * Remove member from team
   */
  removeTeamMember: (teamId: string, userId: string): boolean => {
    const memberIndex = mockTeamMembers.findIndex(
      member => member.teamId === teamId && member.userId === userId
    );
    
    if (memberIndex !== -1) {
      mockTeamMembers.splice(memberIndex, 1);
      return true;
    }
    return false;
  },

  /**
   * Get team invitations
   */
  getTeamInvitations: (teamId: string, status?: 'PENDING' | 'ACCEPTED' | 'DECLINED'): MockTeamInvitation[] => {
    let invitations = mockTeamInvitations.filter(invitation => invitation.teamId === teamId);
    
    if (status) {
      invitations = invitations.filter(invitation => invitation.status === status);
    }
    
    return invitations;
  },

  /**
   * Create team invitation
   */
  createInvitation: (invitationData: Omit<MockTeamInvitation, 'id' | 'createdAt'>): MockTeamInvitation => {
    const newInvitation: MockTeamInvitation = {
      ...invitationData,
      id: (mockTeamInvitations.length + 1).toString(),
      createdAt: new Date().toISOString(),
    };
    mockTeamInvitations.push(newInvitation);
    return newInvitation;
  },

  /**
   * Update invitation status
   */
  updateInvitationStatus: (invitationId: string, status: 'ACCEPTED' | 'DECLINED'): MockTeamInvitation | undefined => {
    const invitationIndex = mockTeamInvitations.findIndex(inv => inv.id === invitationId);
    
    if (invitationIndex !== -1) {
      mockTeamInvitations[invitationIndex].status = status;
      return mockTeamInvitations[invitationIndex];
    }
    return undefined;
  },

  /**
   * Check if user has access to team
   */
  userHasTeamAccess: (userId: string, teamId: string): boolean => {
    return mockTeamMembers.some(
      member => member.userId === userId && member.teamId === teamId
    );
  },

  /**
   * Get user role in team
   */
  getUserRoleInTeam: (userId: string, teamId: string): 'OWNER' | 'ADMIN' | 'MEMBER' | null => {
    const member = mockTeamMembers.find(
      member => member.userId === userId && member.teamId === teamId
    );
    return member ? member.role : null;
  },

  /**
   * Products Operations (Multi-Tenant Business Entity)
   */

  /**
   * Get products for a specific team (multi-tenant isolation)
   */
  getTeamProducts: (teamId: string): MockProduct[] => {
    return mockProducts.filter(product => product.teamId === teamId);
  },

  /**
   * Find product by ID
   */
  findProductById: (id: string): MockProduct | undefined => {
    return mockProducts.find(product => product.id === id);
  },

  /**
   * Create new product
   */
  createProduct: (productData: Omit<MockProduct, 'id' | 'createdAt' | 'updatedAt'>): MockProduct => {
    const newProduct: MockProduct = {
      ...productData,
      id: (mockProducts.length + 1).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockProducts.push(newProduct);
    return newProduct;
  },

  /**
   * Update product
   */
  updateProduct: (id: string, updates: Partial<Omit<MockProduct, 'id' | 'createdAt' | 'updatedAt'>>): MockProduct | undefined => {
    const productIndex = mockProducts.findIndex(product => product.id === id);
    if (productIndex !== -1) {
      mockProducts[productIndex] = {
        ...mockProducts[productIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return mockProducts[productIndex];
    }
    return undefined;
  },

  /**
   * Delete product
   */
  deleteProduct: (id: string): boolean => {
    const productIndex = mockProducts.findIndex(product => product.id === id);
    if (productIndex !== -1) {
      mockProducts.splice(productIndex, 1);
      return true;
    }
    return false;
  },

  /**
   * Count products for a team (for entitlements checking)
   */
  countTeamProducts: (teamId: string): number => {
    return mockProducts.filter(product => product.teamId === teamId).length;
  },
};