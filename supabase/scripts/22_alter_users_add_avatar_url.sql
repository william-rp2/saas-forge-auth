-- 22_alter_users_add_avatar_url.sql
-- Adiciona campo avatar_url à tabela users para suporte a fotos de perfil
-- Integração com o módulo de Storage

-- Adicionar coluna avatar_url à tabela users
ALTER TABLE public.users 
ADD COLUMN avatar_url TEXT;

-- Criar índice para otimizar consultas por avatar
CREATE INDEX idx_users_avatar_url ON public.users(avatar_url) WHERE avatar_url IS NOT NULL;

-- Comentário para documentação
COMMENT ON COLUMN public.users.avatar_url IS 'URL da foto de perfil do usuário no Supabase Storage';

-- Função para validar URL do avatar (opcional, para garantir que seja do nosso storage)
CREATE OR REPLACE FUNCTION validate_avatar_url(url TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Permitir NULL (sem avatar)
  IF url IS NULL THEN
    RETURN TRUE;
  END IF;
  
  -- Validar que a URL é do nosso storage do Supabase
  -- Ajustar conforme sua configuração do Supabase
  IF url ~ '^https://[a-z0-9]+\.supabase\.co/storage/v1/object/public/avatars/' THEN
    RETURN TRUE;
  END IF;
  
  -- Para desenvolvimento local, permitir URLs de blob temporárias
  IF url ~ '^blob:' THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Constraint para validar URLs de avatar (opcional)
-- ALTER TABLE public.users 
-- ADD CONSTRAINT check_avatar_url 
-- CHECK (validate_avatar_url(avatar_url));

-- Trigger para limpar avatar_url quando usuário é deletado
-- (o arquivo no storage deve ser removido pela aplicação)
CREATE OR REPLACE FUNCTION cleanup_user_avatar()
RETURNS TRIGGER AS $$
BEGIN
  -- Log para auditoria (opcional)
  IF OLD.avatar_url IS NOT NULL THEN
    INSERT INTO public.audit_log (table_name, operation, old_data, created_at)
    VALUES (
      'users',
      'avatar_cleanup',
      json_build_object('user_id', OLD.id, 'avatar_url', OLD.avatar_url),
      now()
    );
  END IF;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Criar tabela de auditoria se não existir (para o trigger acima)
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Aplicar trigger de limpeza
CREATE TRIGGER trigger_cleanup_user_avatar
  BEFORE DELETE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION cleanup_user_avatar();

-- Política RLS para avatar_url (usuários podem atualizar seu próprio avatar)
-- Assumindo que já existe RLS na tabela users
CREATE POLICY "Users can update own avatar" 
ON public.users FOR UPDATE 
USING (id = auth.uid())
WITH CHECK (id = auth.uid());