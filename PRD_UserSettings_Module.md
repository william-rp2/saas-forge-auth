# PRD - Módulo de Configurações do Usuário

## 1. Visão Geral

O Módulo de Configurações do Usuário permite que usuários gerenciem suas informações pessoais, segurança e preferências de sistema. Inclui gerenciamento global de tema com suporte ao modo escuro/claro.

## 2. Funcionalidades Implementadas

### 2.1 Estrutura de Navegação (/settings)
- **Layout Responsivo**: Navegação lateral no desktop, abas no mobile
- **Sub-rotas**: /settings/profile, /settings/security, /settings/preferences
- **Redirecionamento**: /settings → /settings/profile automaticamente

### 2.2 Seção Perfil (/settings/profile)
- **Upload de Avatar**: Simulação de upload de imagem
- **Dados Pessoais**: Nome completo, e-mail (somente leitura)
- **Data de Nascimento**: DatePicker do Shadcn/UI
- **CPF**: Input com máscara automática (999.999.999-99)
- **Validação**: Formulário pré-preenchido com controle de alterações

### 2.3 Seção Segurança (/settings/security)
- **Alteração de Senha**: Validação da senha atual
- **Indicador de Força**: Verificação em tempo real dos critérios
- **Validação**: Confirmação de senha e critérios de segurança

### 2.4 Seção Preferências (/settings/preferences)
- **Tema Global**: Claro, Escuro, Sistema com ThemeProvider
- **Notificações**: Checkboxes para preferências de e-mail

## 3. Arquitetura Técnica

### 3.1 ThemeProvider Global
```typescript
// Gerenciamento global de tema
const { theme, setTheme, actualTheme } = useTheme();

// Persistência em localStorage
// Prevenção de FOUC (Flash of Unstyled Content)
// Suporte a preferência do sistema
```

### 3.2 Componentes Principais
- **ProfileForm**: Formulário de dados pessoais
- **PasswordForm**: Alteração segura de senha  
- **PreferencesForm**: Configurações de tema e notificações
- **SettingsLayout**: Layout com navegação estruturada

## 4. Validações e Máscaras

### 4.1 CPF com Máscara
```typescript
const applyCpfMask = (value: string): string => {
  // Aplicação automática: 999.999.999-99
};
```

### 4.2 Validação de Senha
- Mínimo 8 caracteres
- Letras maiúsculas e minúsculas
- Números e caracteres especiais
- Confirmação de senha

## 5. Scripts SQL (Supabase)

1. **07_alter_users_add_profile_fields.sql**: Adiciona birth_date e cpf
2. **08_create_user_preferences_table.sql**: Tabela de preferências

## 6. Sistema de Mocks

Dados mockados incluem:
- Preferências de tema por usuário
- Configurações de notificação
- Dados pessoais com máscara de CPF
- Validação de senha mockada (123456)

---

**Módulo de Configurações implementado!** Sistema completo de gerenciamento de perfil, segurança e preferências com tema global persistente.