# PRD - Módulo de Entitlements (Planos e Permissões)

## 1. Visão Geral

O Módulo de Entitlements é responsável por gerenciar os planos de assinatura, features habilitadas e limites de uso do sistema. Este módulo permite a monetização do SaaS através de diferentes níveis de acesso e controle granular sobre funcionalidades.

## 2. Objetivos

- **Layout Administrativo Unificado**: Criar uma interface centralizada para gestão administrativa
- **Gestão de Planos**: Permitir criação, edição e exclusão de planos de assinatura
- **Feature Flags**: Sistema para habilitar/desabilitar funcionalidades por plano
- **Controle de Limites**: Definir limites quantitativos para cada plano
- **Hook de Verificação**: Interface simples para verificar permissões em toda a aplicação

## 3. Layout Administrativo

### 3.1 Estrutura de Navegação

O layout administrativo (`/admin`) inclui:

- **Sidebar responsivo** com navegação entre seções
- **Dashboard**: Visão geral das métricas do sistema
- **Gestão de Acessos**: RBAC existente integrado ao layout
- **Planos e Permissões**: Nova seção para gerenciar entitlements

### 3.2 Componentes do Layout

- `AdminLayout.tsx`: Layout principal com sidebar
- `AdminDashboard.tsx`: Dashboard com métricas mockadas
- Navegação responsiva com menu mobile

## 4. Modelo de Dados

### 4.1 Entidades Principais

#### Plans (Planos)
```typescript
interface MockPlan {
  id: string;
  name: string;          // "Free", "Pro", "Enterprise"
  price: number;         // 0, 49.90, 149.90
  priceDescription: string; // "/mês"
  description?: string;
  createdAt: string;
  updatedAt: string;
}
```

#### Features (Funcionalidades)
```typescript
interface MockFeature {
  id: string;
  key: string;           // "advanced-reports", "api-access"
  name: string;          // "Relatórios Avançados"
  description: string;
}
```

#### Limits (Limites)
```typescript
interface MockLimit {
  id: string;
  key: string;           // "max-projects", "max-users"
  name: string;          // "Máximo de Projetos"
  description: string;
}
```

### 4.2 Relacionamentos

- **Plan Features**: Tabela de junção entre planos e features
- **Plan Limits**: Tabela de junção entre planos e limites com valores
- **User Plans**: Usuários possuem um `planId`

## 5. Funcionalidades

### 5.1 Gestão de Planos

#### Lista de Planos (`/admin/plans`)
- **DataTable** com todos os planos
- **Ações**: Editar, Excluir
- **Botão**: Criar Novo Plano

#### Formulário de Plano (`/admin/plans/edit/:id`)
- **Informações Básicas**: Nome, preço, descrição
- **Features**: Checkboxes para habilitar funcionalidades
- **Limites**: Inputs numéricos para definir valores (-1 = ilimitado)

### 5.2 Hook useEntitlements

#### Interface Principal
```typescript
interface EntitlementData {
  can: (featureKey: string) => boolean;
  getLimit: (limitKey: string) => number;
  currentPlan: {
    id: string;
    name: string;
    price: number;
    priceDescription: string;
  } | null;
}
```

#### Hooks Auxiliares
- `useFeature(featureKey)`: Verificação específica de feature
- `useLimit(limitKey)`: Obtenção específica de limite

### 5.3 Exemplos de Uso

#### Feature Toggle
```typescript
const { can } = useEntitlements();

{can('advanced-reports') && (
  <Button>Exportar Relatório Avançado</Button>
)}
```

#### Verificação de Limite
```typescript
const { getLimit } = useEntitlements();
const maxProjects = getLimit('max-projects');

<p>Projetos: {currentCount} / {maxProjects === -1 ? '∞' : maxProjects}</p>
```

## 6. Estrutura de Arquivos

```
src/
├── pages/admin/
│   ├── AdminLayout.tsx
│   ├── Dashboard.tsx
│   ├── Plans.tsx
│   └── PlanEdit.tsx
├── components/features/plans/
│   ├── PlansDataTable.tsx
│   └── PlanForm.tsx
├── lib/hooks/
│   └── useEntitlements.ts
└── mocks/
    └── db.ts (expandido com entitlements)
```

## 7. Scripts SQL

### 7.1 Tabelas Criadas

1. **09_create_plans_table.sql**: Tabela de planos
2. **10_create_features_table.sql**: Tabela de features
3. **11_create_limits_table.sql**: Tabela de limites
4. **12_create_plan_features_table.sql**: Relacionamento plano-feature
5. **13_create_plan_limits_table.sql**: Relacionamento plano-limite
6. **14_alter_users_add_plan.sql**: Adiciona planId aos usuários

### 7.2 Dados Padrão

#### Planos
- **Free**: R$ 0/mês, 3 projetos, 1 usuário, 1GB
- **Pro**: R$ 49.90/mês, 50 projetos, 10 usuários, 100GB + features
- **Enterprise**: R$ 149.90/mês, ilimitado + todas as features

#### Features
- `advanced-reports`: Relatórios Avançados
- `api-access`: Acesso à API
- `priority-support`: Suporte Prioritário
- `custom-branding`: Marca Personalizada
- `unlimited-exports`: Exportações Ilimitadas

#### Limites
- `max-projects`: Máximo de Projetos
- `max-users`: Máximo de Usuários
- `max-storage`: Armazenamento (GB)
- `max-api-calls`: Chamadas API/mês

## 8. Considerações Técnicas

### 8.1 Roteamento
- Layout administrativo usa `<Outlet />` para renderizar sub-rotas
- Navegação integrada com React Router (`NavLink`)

### 8.2 Estado Mockado
- Todas as operações simulam delays de API
- Dados persistem apenas durante a sessão
- Sistema de toast para feedback das ações

### 8.3 Responsividade
- Sidebar colapsável em mobile
- Grid responsivo nos formulários
- Menu overlay para dispositivos móveis

## 9. Próximos Passos

### 9.1 Integrações Futuras
- Conectar com Supabase para persistência real
- Integração com Stripe para pagamentos
- Sistema de notificações por email

### 9.2 Funcionalidades Avançadas
- Histórico de mudanças de plano
- Analytics de uso por feature
- Alertas de limite atingido
- Migrações automáticas entre planos

## 10. Documentação do Hook

### 10.1 useEntitlements

O hook principal para verificação de entitlements em qualquer componente da aplicação.

**Parâmetros:**
- `userId?: string` - ID do usuário (opcional, usa o logado por padrão)

**Retorno:**
- `can(featureKey)` - Verifica se feature está habilitada
- `getLimit(limitKey)` - Obtém valor do limite
- `currentPlan` - Informações do plano atual

**Exemplo completo:**
```typescript
import { useEntitlements } from '@/lib/hooks/useEntitlements';

function ProjectList() {
  const { can, getLimit, currentPlan } = useEntitlements();
  
  const maxProjects = getLimit('max-projects');
  const canExport = can('advanced-reports');
  
  return (
    <div>
      <h2>Projetos ({currentProjects}/{maxProjects})</h2>
      {canExport && <ExportButton />}
      <p>Plano atual: {currentPlan?.name}</p>
    </div>
  );
}
```

Este módulo fornece a base para um sistema de monetização robusto e escalável, mantendo a simplicidade de uso através do hook `useEntitlements`.