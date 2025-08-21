# PRD - Módulo de Notificações

## 📋 Visão Geral

O Módulo de Notificações é um sistema completo para gerenciar e exibir notificações em tempo real para usuários da plataforma SaaS. O sistema permite que os usuários sejam notificados sobre eventos importantes relacionados a produtos, documentos, convites de equipe e mudanças de plano.

## 🎯 Objetivos

### Objetivos Principais
- Manter usuários informados sobre atividades relevantes em suas equipes
- Melhorar o engajamento e colaboração entre membros da equipe
- Fornecer um histórico completo de atividades importantes
- Permitir controle granular sobre preferências de notificação

### Objetivos Secundários
- Reduzir a necessidade de comunicação externa (email, Slack)
- Aumentar a retenção de usuários através de melhor UX
- Facilitar o onboarding de novos membros da equipe

## 👥 Personas e Casos de Uso

### Persona 1: Administrador de Equipe
**Necessidades:**
- Ser notificado quando novos membros são convidados
- Receber alertas sobre mudanças de plano
- Acompanhar atividades de criação de produtos

**Casos de Uso:**
- Receber notificação quando um membro cria um novo produto
- Ser alertado sobre uploads de documentos importantes
- Acompanhar status de convites enviados

### Persona 2: Membro da Equipe
**Necessidades:**
- Ser notificado sobre novos produtos criados na equipe
- Receber alertas sobre documentos compartilhados
- Acompanhar mudanças relevantes no workspace

**Casos de Uso:**
- Ver notificações de produtos criados por outros membros
- Receber alertas sobre documentos importantes
- Acompanhar atividades da equipe em tempo real

## 🔧 Funcionalidades

### 1. Sistema de Notificações Core

#### 1.1 Tipos de Notificação
- **PRODUCT_CREATED**: Produto criado na equipe
- **DOCUMENT_UPLOADED**: Documento carregado
- **USER_INVITED**: Usuário convidado para equipe
- **PLAN_CHANGED**: Plano da equipe alterado
- **PRODUCT_UPDATED**: Produto atualizado

#### 1.2 Estrutura de Dados
```typescript
interface Notification {
  id: string;
  recipientUserId: string;
  actorUserId: string;
  actionType: NotificationActionType;
  entityId: string;
  entityType: string;
  teamId: string;
  isRead: boolean;
  message: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. Interface de Usuário

#### 2.1 Componente Bell (Sininho)
**Localização:** Header da aplicação
**Funcionalidades:**
- Contador de notificações não lidas
- Dropdown com últimas 5 notificações
- Botão "Marcar todas como lidas"
- Link para página completa de notificações
- Indicador visual para novas notificações

**Estados:**
- Sem notificações: Ícone cinza
- Com notificações não lidas: Ícone com badge vermelho
- Carregando: Spinner

#### 2.2 Página de Notificações
**Rota:** `/notifications`
**Funcionalidades:**
- Lista completa de notificações do usuário
- Filtros por tipo de notificação
- Filtros por status (lidas/não lidas)
- Busca por texto
- Paginação
- Ações em massa (marcar como lida)

**Layout:**
- Header com título e ações
- Barra de filtros e busca
- Lista de notificações com avatares e timestamps
- Paginação no rodapé

### 3. Preferências de Notificação

#### 3.1 Configurações por Usuário
**Localização:** Página de Configurações > Notificações
**Opções:**
- Notificações por email (on/off)
- Notificações push (on/off)
- Tipos específicos de notificação (granular)
- Frequência de digest por email

#### 3.2 Estrutura de Preferências
```typescript
interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  productCreated: boolean;
  documentUploaded: boolean;
  userInvited: boolean;
  planChanged: boolean;
  digestFrequency: 'immediate' | 'daily' | 'weekly' | 'never';
}
```

## 🏗️ Arquitetura Técnica

### 1. Backend

#### 1.1 Banco de Dados
**Tabela:** `notifications`
**Campos:**
- `id` (UUID, PK)
- `recipient_user_id` (UUID, FK)
- `actor_user_id` (UUID, FK)
- `action_type` (ENUM)
- `entity_id` (UUID)
- `entity_type` (VARCHAR)
- `team_id` (UUID, FK)
- `is_read` (BOOLEAN)
- `message` (TEXT)
- `metadata` (JSONB)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Índices:**
- `idx_notifications_recipient_created` (recipient_user_id, created_at DESC)
- `idx_notifications_team_created` (team_id, created_at DESC)
- `idx_notifications_unread` (recipient_user_id, is_read)

#### 1.2 API Endpoints
```
GET /api/notifications - Listar notificações do usuário
POST /api/notifications - Criar nova notificação
PATCH /api/notifications/:id/read - Marcar como lida
PATCH /api/notifications/read-all - Marcar todas como lidas
GET /api/notifications/unread-count - Contar não lidas
```

#### 1.3 Serviço de Notificações
**Arquivo:** `notification-service.ts`
**Responsabilidades:**
- Criar notificações para eventos específicos
- Enviar webhooks para N8N
- Gerenciar preferências de usuário
- Helpers para tipos comuns de notificação

### 2. Frontend

#### 2.1 Componentes
- `NotificationBell.tsx` - Sininho no header
- `NotificationsPage.tsx` - Página completa
- `NotificationItem.tsx` - Item individual
- `NotificationFilters.tsx` - Filtros e busca

#### 2.2 Hooks Customizados
- `useNotifications()` - Gerenciar estado das notificações
- `useNotificationPreferences()` - Gerenciar preferências

#### 2.3 Estado Global
- Context para notificações não lidas
- Sincronização em tempo real (futuro: WebSockets)

### 3. Integrações

#### 3.1 N8N Webhook
**Endpoint:** Configurável via variável de ambiente
**Payload:**
```json
{
  "type": "notification_created",
  "notification": {
    "id": "uuid",
    "recipientUserId": "uuid",
    "actionType": "PRODUCT_CREATED",
    "message": "João criou o produto 'App Mobile'",
    "teamId": "uuid"
  }
}
```

#### 3.2 Triggers de Notificação
- **Criação de Produto:** `ProductForm.tsx` → `NotificationHelpers.productCreated()`
- **Upload de Documento:** `Uploader.tsx` → `NotificationHelpers.documentUploaded()`
- **Convite de Usuário:** `InviteForm.tsx` → `NotificationHelpers.userInvited()`
- **Mudança de Plano:** `PlanManager.tsx` → `NotificationHelpers.planChanged()`

## 📊 Métricas e Analytics

### 1. Métricas de Engajamento
- Taxa de abertura de notificações
- Tempo médio para marcar como lida
- Notificações mais clicadas por tipo
- Taxa de conversão (notificação → ação)

### 2. Métricas de Performance
- Tempo de carregamento do componente Bell
- Tempo de resposta da API de notificações
- Taxa de erro na criação de notificações

### 3. Métricas de Produto
- Usuários ativos que recebem notificações
- Preferências mais comuns
- Tipos de notificação mais gerados

## 🚀 Roadmap de Implementação

### Fase 1: Core (Concluída) ✅
- [x] Modelo de dados e migrations
- [x] Serviço de notificações básico
- [x] Componente Bell no header
- [x] Página de histórico de notificações
- [x] Integração com criação de produtos

### Fase 2: Melhorias (Futuro)
- [ ] Notificações em tempo real (WebSockets)
- [ ] Notificações push no browser
- [ ] Digest por email
- [ ] Notificações mobile (PWA)

### Fase 3: Avançado (Futuro)
- [ ] Notificações inteligentes (ML)
- [ ] Agrupamento de notificações similares
- [ ] Notificações baseadas em localização
- [ ] Integração com Slack/Teams

## 🔒 Considerações de Segurança

### 1. Privacidade
- Usuários só veem notificações de suas equipes
- Dados sensíveis não são expostos em metadados
- Logs de notificação são auditáveis

### 2. Performance
- Índices otimizados para consultas frequentes
- Paginação para evitar sobrecarga
- Cache de contadores de notificações não lidas

### 3. Rate Limiting
- Limite de notificações por usuário/hora
- Throttling de webhooks para N8N
- Debounce em ações de massa

## 📝 Considerações de UX

### 1. Acessibilidade
- Suporte a screen readers
- Navegação por teclado
- Contraste adequado para indicadores

### 2. Responsividade
- Componente Bell adaptado para mobile
- Página de notificações otimizada para touch
- Filtros colapsáveis em telas pequenas

### 3. Estados de Loading
- Skeletons durante carregamento
- Feedback visual para ações
- Tratamento de erros gracioso

## 🧪 Testes

### 1. Testes Unitários
- Serviço de notificações
- Helpers de criação
- Componentes React

### 2. Testes de Integração
- Fluxo completo de criação → notificação
- API endpoints
- Webhooks N8N

### 3. Testes E2E
- Criação de produto → notificação no Bell
- Marcar como lida → atualização do contador
- Filtros na página de notificações

---

**Versão:** 1.0  
**Data:** Janeiro 2025  
**Status:** Implementado (Fase 1)  
**Próxima Revisão:** Março 2025