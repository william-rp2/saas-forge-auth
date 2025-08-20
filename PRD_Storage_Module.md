# PRD - Módulo de Storage

## 1. Visão Geral

O **Módulo de Storage** é um sistema robusto e reutilizável para gerenciamento de arquivos que utiliza o Supabase Storage como backend. Este módulo serve como fundação arquitetural para todas as funcionalidades futuras que necessitem de upload, armazenamento e gerenciamento de arquivos.

### Objetivos Principais

1. **Componentização Reutilizável**: Criar um componente genérico `<Uploader>` que pode ser usado em qualquer parte da aplicação
2. **Integração com Entitlements**: Implementar limites de armazenamento baseados no plano de assinatura do usuário
3. **Segurança e Isolamento**: Garantir que cada equipe tenha acesso apenas aos seus próprios arquivos
4. **Experiência do Usuário**: Oferecer interface intuitiva com drag-and-drop, progress tracking e feedback visual

## 2. Arquitetura e Integração

### 2.1. Multi-Tenancy (Isolamento por Equipe)

O sistema de Storage implementa isolamento rigoroso de dados através da estrutura de pastas:

```
Storage Structure:
├── avatars/
│   ├── {user_id}/
│   │   └── avatar.jpg
├── documents/
│   ├── {team_id}/
│   │   ├── products/
│   │   │   ├── {product_id}/
│   │   │   │   └── attachment.pdf
```

**Row Level Security (RLS)**: Políticas de segurança garantem que:
- Usuários só podem fazer upload para pastas de suas equipes
- Avatares são públicos mas organizados por usuário
- Documentos são privados e isolados por equipe

### 2.2. Integração com Entitlements

Novo limite introduzido: `storage-limit-mb`

| Plano | Limite de Storage |
|-------|------------------|
| Free | 100MB |
| Pro | 5GB |
| Enterprise | 50GB |

**Verificação de Limites**: Antes de cada upload, o sistema:
1. Calcula o uso atual de storage da equipe
2. Verifica se o novo arquivo excederá o limite
3. Bloqueia o upload se necessário, exibindo mensagem explicativa

### 2.3. Integração com RBAC

O upload de arquivos respeita as permissões existentes:
- Usuários precisam ter permissão `create` no subject correspondente
- Exemplo: Para anexar arquivos a produtos, precisa da permissão `create Product`

## 3. Componente Central: `<Uploader>`

### 3.1. Características Principais

```typescript
interface UploaderProps {
  path: string;                    // Caminho no Storage
  accept?: string;                 // Tipos de arquivo aceitos
  maxFiles?: number;               // Máximo de arquivos
  maxFileSize?: number;            // Tamanho máximo por arquivo
  onUploadComplete?: (files: UploaderFile[]) => void;
  onUploadError?: (error: string) => void;
  checkStorageLimit?: boolean;     // Verificar limites do plano
}
```

### 3.2. Funcionalidades

- **Drag & Drop**: Interface intuitiva para arrastar arquivos
- **Progress Tracking**: Barra de progresso em tempo real
- **Validação**: Tipos de arquivo, tamanho, quantidade
- **Feedback Visual**: Estados de loading, sucesso e erro
- **Limite de Plano**: Integração automática com entitlements

### 3.3. Estados do Arquivo

```typescript
interface UploaderFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  status: 'uploading' | 'success' | 'error';
  progress: number;
}
```

## 4. Casos de Uso Implementados

### 4.1. Foto de Perfil do Usuário

**Localização**: `/settings/profile`

**Configuração**:
- `path`: "avatars/"
- `accept`: "image/jpeg,image/png,image/webp"
- `maxFiles`: 1
- `maxFileSize`: 5MB

**Funcionalidades**:
- Upload de avatar único
- Preview em tempo real
- Integração com componente Avatar
- Atualização automática do perfil do usuário

### 4.2. Anexos de Produtos

**Localização**: `/admin/products` (formulário de edição)

**Configuração**:
- `path`: "documents/"
- `accept`: "*/*" (todos os tipos)
- `maxFiles`: 10
- `maxFileSize`: 10MB

**Funcionalidades**:
- Upload múltiplo de documentos
- Lista de anexos existentes
- Download de arquivos
- Associação automática com produto

## 5. Modelo de Dados

### 5.1. Tabela `documents`

```sql
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  size_in_bytes BIGINT NOT NULL,
  uploader_user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### 5.2. Storage Buckets

- **avatars**: Bucket público para fotos de perfil
- **documents**: Bucket privado para documentos da equipe

### 5.3. Políticas RLS

```sql
-- Usuários podem ver seus próprios documentos
CREATE POLICY "Users can view their own documents" 
ON public.documents FOR SELECT 
USING (uploader_user_id = auth.uid());

-- Storage: controle de acesso por pasta
CREATE POLICY "Users can upload to their folder" 
ON storage.objects FOR INSERT 
WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);
```

## 6. Mock Data e Desenvolvimento

### 6.1. Novos Dados Mockados

**Limite de Storage**:
```typescript
{
  id: '6',
  key: 'storage-limit-mb',
  name: 'Limite de Armazenamento (MB)',
  description: 'Limite total de armazenamento em megabytes'
}
```

**Limites por Plano**:
```typescript
{ planId: '1', limitId: '6', value: 100 },   // Free: 100MB
{ planId: '2', limitId: '6', value: 5000 },  // Pro: 5GB
{ planId: '3', limitId: '6', value: 50000 }, // Enterprise: 50GB
```

**Campo Avatar no Usuário**:
```typescript
interface MockUser {
  // ... outros campos
  avatarUrl?: string;
}
```

### 6.2. Implementação Mock

Durante o desenvolvimento, o componente simula:
- Upload com progress realístico
- URLs temporárias usando `URL.createObjectURL()`
- Verificação de limites baseada nos dados mockados
- Persistência das URLs nos dados do usuário mock

## 7. Fluxos de Usuário

### 7.1. Upload de Avatar

1. Usuário acessa `/settings/profile`
2. Clica na área de upload ou arrasta arquivo
3. Sistema valida tipo e tamanho do arquivo
4. Verifica limite de storage do plano
5. Faz upload com feedback visual
6. Atualiza avatar automaticamente
7. Salva URL no perfil do usuário

### 7.2. Anexar Arquivo a Produto

1. Usuário edita produto em `/admin/products`
2. Acessa seção "Anexos"
3. Seleciona múltiplos arquivos
4. Sistema verifica permissões RBAC
5. Valida limite de storage da equipe
6. Upload com progress individual por arquivo
7. Associa arquivos ao produto
8. Lista anexos com opções de download/exclusão

## 8. Benefícios Demonstrados

### 8.1. Reutilização
- Componente `<Uploader>` usado em 2+ contextos diferentes
- Configuração flexível via props
- Fácil integração em novos módulos

### 8.2. Segurança
- Isolamento rigoroso por equipe/usuário
- Validação de tipos e tamanhos
- Políticas RLS garantem acesso correto

### 8.3. Experiência do Usuário
- Interface intuitiva com drag-and-drop
- Feedback visual em tempo real
- Mensagens de erro claras sobre limites

### 8.4. Escalabilidade
- Integração com planos de assinatura
- Limites flexíveis por plano
- Estrutura preparada para crescimento

## 9. Expansões Futuras

### 9.1. Funcionalidades Avançadas
- [ ] Compressão automática de imagens
- [ ] Preview de documentos (PDF, etc.)
- [ ] Versionamento de arquivos
- [ ] Compartilhamento com links temporários

### 9.2. Integrações
- [ ] Integração com CDN
- [ ] Backup automático
- [ ] Sincronização com Google Drive/Dropbox
- [ ] Escaneamento de vírus

### 9.3. Analytics
- [ ] Métricas de uso de storage
- [ ] Relatórios de uploads por equipe
- [ ] Análise de tipos de arquivo mais utilizados

## 10. Considerações Técnicas

### 10.1. Performance
- Upload em chunks para arquivos grandes
- Compressão de imagens no cliente
- Cache de URLs de download

### 10.2. Segurança
- Validação de tipos MIME no servidor
- Escaneamento de malware
- Rate limiting para uploads

### 10.3. Monitoramento
- Logs de uploads e downloads
- Alertas de uso próximo ao limite
- Métricas de performance

---

Este módulo estabelece a fundação sólida para todos os futuros sistemas que necessitem de gerenciamento de arquivos, demonstrando a integração perfeita entre Storage, Multi-tenancy, RBAC e Entitlements.