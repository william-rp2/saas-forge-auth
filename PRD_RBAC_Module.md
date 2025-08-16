# PRD - Módulo de Gestão de Acessos (RBAC)

## 1. Visão Geral

O Módulo de Gestão de Acessos (RBAC) do SaaS Core implementa um sistema completo de controle de acesso baseado em papéis (Role-Based Access Control). Este módulo permite que administradores definam perfis granulares, associem permissões específicas e controlem o acesso dos usuários a diferentes funcionalidades do sistema.

## 2. Funcionalidades Implementadas

### 2.1 Gestão de Perfis (/admin/access-management)
- **Criação de Perfis**: Interface para criar novos perfis com nome, descrição e cor
- **Edição de Perfis**: Modificação de perfis existentes e suas permissões
- **Exclusão de Perfis**: Remoção segura com validação de uso
- **Visualização**: Lista de perfis com informações resumidas

### 2.2 Gestão de Usuários
- **Tabela de Usuários**: Visualização completa com perfis atuais
- **Alteração de Perfis**: Dropdown para mudança de perfil por usuário
- **Histórico**: Informações de criação e status

### 2.3 Sistema de Permissões
- **Modelo Action + Subject**: Permissões granulares (ex: 'create' + 'Project')
- **Hook usePermissions**: Verificação de permissões em tempo real
- **Componente <Can>**: Renderização condicional baseada em permissões

## 3. Arquitetura Técnica

### 3.1 Modelo de Dados RBAC
```typescript
Permission: { action: string, subject: string, name: string }
Role: { name: string, permissionIds: string[], color: string }
User: { roleId: string, ... }
```

### 3.2 Sistema de Verificação
```typescript
// Hook de permissões
const { can } = usePermissions();
if (can('create', 'Project')) { /* autorizado */ }

// Componente de proteção
<Can action="delete" subject="User">
  <Button>Deletar</Button>
</Can>
```

## 4. Componentes Implementados

- **RolesManager**: CRUD de perfis com seleção de permissões
- **UsersManager**: Tabela de usuários com alteração de perfis
- **RoleForm**: Formulário para criação/edição de perfis
- **Can**: Wrapper para renderização condicional
- **usePermissions**: Hook para verificação de acesso

## 5. Scripts SQL (Supabase)

1. **03_create_roles_table.sql**: Tabela de perfis
2. **04_create_permissions_table.sql**: Tabela de permissões
3. **05_create_role_permissions_table.sql**: Tabela de junção
4. **06_alter_users_add_role.sql**: Adiciona role_id aos usuários

## 6. Sistema de Mocks

O sistema continua usando mocks com:
- Usuários pré-definidos com diferentes perfis
- Permissões granulares simuladas
- Operações CRUD completas
- Validações de negócio

---

**Módulo RBAC implementado com sucesso!** O sistema agora possui controle granular de acesso, interfaces administrativas e verificação de permissões em tempo real.