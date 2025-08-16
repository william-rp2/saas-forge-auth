# PRD - Módulo de Autenticação SaaS Core

## 1. Visão Geral

O Módulo de Autenticação do SaaS Core é um sistema completo e reutilizável que fornece todas as funcionalidades necessárias para autenticação de usuários em aplicações SaaS. Este módulo foi desenvolvido seguindo princípios de arquitetura desacoplada e componentização extrema.

## 2. Funcionalidades Implementadas

### 2.1 Telas de Autenticação

- **Login (`/auth/login`)**: Autenticação via email/senha ou Google OAuth
- **Cadastro (`/auth/signup`)**: Processo de registro em 3 etapas
- **Recuperação de Senha (`/auth/forgot-password`)**: Sistema de reset seguro
- **Dashboard (`/dashboard`)**: Área protegida (placeholder)

### 2.2 Páginas Legais

- **Termos de Uso (`/terms`)**: Documento completo de termos
- **Política de Privacidade (`/privacy`)**: Conformidade com LGPD

## 3. Arquitetura Técnica

### 3.1 Sistema de Mocks

O projeto implementa um sistema completo de mocks que pode ser habilitado/desabilitado:

```typescript
// Controle via variável de ambiente
VITE_USE_MOCKS=true  // Ativa mocks (padrão em desenvolvimento)
```

### 3.2 Estrutura de Componentes

```
src/
├── components/
│   ├── shared/           # Componentes reutilizáveis
│   │   ├── AuthLayout.tsx
│   │   ├── PlanCard.tsx
│   │   ├── GoogleButton.tsx
│   │   └── FormDivider.tsx
│   └── features/auth/    # Componentes específicos de autenticação
│       ├── LoginForm.tsx
│       ├── SignupForm.tsx
│       └── ForgotPasswordForm.tsx
├── mocks/               # Sistema de simulação de dados
├── lib/                 # Utilitários e validações
└── pages/               # Páginas da aplicação
```

### 3.3 Design System

Implementa um sistema de design robusto com:
- **Tokens semânticos**: Cores, gradientes e espaçamentos padronizados
- **Componentes Shadcn/UI**: Base sólida para interface
- **Responsividade**: Design mobile-first
- **Acessibilidade**: Conformidade com padrões WCAG

## 4. Validação e Formulários

### 4.1 Schemas Zod

- `loginSchema`: Validação de email e senha
- `registerSchema`: Validação completa de cadastro com confirmação
- `forgotPasswordSchema`: Validação de email para recuperação

### 4.2 React Hook Form

Integração completa com:
- Validação em tempo real
- Estados de loading
- Tratamento de erros
- Acessibilidade

## 5. Banco de Dados (Scripts Supabase)

### 5.1 Tabela Users (`01_create_users_table.sql`)

```sql
- id (UUID, PK)
- auth_user_id (UUID, FK para auth.users)
- full_name (VARCHAR)
- email (VARCHAR, único)
- provider (enum: 'email', 'google')
- selected_plan (enum: 'basic', 'pro', 'enterprise')
- timestamps (created_at, updated_at)
```

### 5.2 Tabela Profiles (`02_create_profiles_table.sql`)

```sql
- id (UUID, PK)
- user_id (UUID, FK para users)
- avatar_url, bio, company, website
- notification_preferences (JSONB)
- timestamps
```

### 5.3 RLS (Row Level Security)

- Políticas de segurança configuradas
- Usuários só acessam próprios dados
- Service role para operações administrativas

## 6. Fluxos de Usuário

### 6.1 Cadastro Multi-etapas

1. **Etapa 1**: Informações básicas (nome, email, senha)
2. **Etapa 2**: Seleção de plano (Basic, Pro, Enterprise)
3. **Etapa 3**: Aceitação de termos e políticas

### 6.2 Autenticação

- Login com email/senha
- Integração Google OAuth (simulada)
- Recuperação de senha com segurança

## 7. Segurança

### 7.1 Proteções Implementadas

- Validação de entrada com Zod
- Prevenção de enumeração de usuários
- Mensagens de erro padronizadas
- HTTPS obrigatório (em produção)

### 7.2 LGPD/GDPR

- Política de privacidade detalhada
- Consentimento explícito
- Direitos do usuário documentados
- Base legal para processamento

## 8. Como Usar o Sistema de Mocks

### 8.1 Habilitação

```typescript
// Em desenvolvimento (automático)
import.meta.env.DEV  // true

// Ou via variável de ambiente
VITE_USE_MOCKS=true
```

### 8.2 Credenciais de Teste

```
Email: teste@email.com
Senha: 123456
```

### 8.3 Simulações Disponíveis

- Delay de rede realista (1 segundo)
- Respostas de erro e sucesso
- Criação de novos usuários
- Autenticação Google simulada

## 9. Próximos Passos

### 9.1 Integração Real

Para conectar com Supabase real:

1. Executar scripts SQL (`supabase/scripts/`)
2. Configurar variáveis de ambiente
3. Substituir mocks por APIs reais
4. Configurar Google OAuth

### 9.2 Funcionalidades Futuras

- Autenticação 2FA
- Gerenciamento de sessões
- Auditoria de login
- Integração com sistemas de pagamento

## 10. Tecnologias Utilizadas

- **React 18** + **TypeScript**
- **React Router 6** (navegação)
- **React Hook Form** + **Zod** (formulários)
- **Tailwind CSS** (estilização)
- **Shadcn/UI** (componentes)
- **Lucide React** (ícones)
- **React Helmet Async** (SEO)

---

*Documento gerado automaticamente pelo sistema SaaS Core*
*Data: 16 de Agosto de 2024*