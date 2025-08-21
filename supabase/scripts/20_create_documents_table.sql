-- 20_create_documents_table.sql
-- Criação da tabela documents para o módulo de Storage
-- Suporta isolamento por equipe e rastreamento de uploads

-- Criar tabela documents
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  size_in_bytes BIGINT NOT NULL,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  path TEXT NOT NULL, -- Caminho no storage (ex: "documents/general/")
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para otimização de consultas
CREATE INDEX idx_documents_team_id ON public.documents(team_id);
CREATE INDEX idx_documents_uploaded_by ON public.documents(uploaded_by);
CREATE INDEX idx_documents_file_type ON public.documents(file_type);
CREATE INDEX idx_documents_created_at ON public.documents(created_at DESC);

-- Habilitar RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver documentos de suas equipes
CREATE POLICY "Users can view team documents" 
ON public.documents FOR SELECT 
USING (
  team_id IN (
    SELECT tm.team_id 
    FROM public.team_members tm 
    WHERE tm.user_id = auth.uid()
  )
);

-- Política: Usuários podem inserir documentos em suas equipes
CREATE POLICY "Users can insert team documents" 
ON public.documents FOR INSERT 
WITH CHECK (
  team_id IN (
    SELECT tm.team_id 
    FROM public.team_members tm 
    WHERE tm.user_id = auth.uid()
  )
  AND uploaded_by = auth.uid()
);

-- Política: Usuários podem atualizar documentos que fizeram upload
CREATE POLICY "Users can update own documents" 
ON public.documents FOR UPDATE 
USING (uploaded_by = auth.uid())
WITH CHECK (uploaded_by = auth.uid());

-- Política: Usuários podem deletar documentos que fizeram upload
CREATE POLICY "Users can delete own documents" 
ON public.documents FOR DELETE 
USING (uploaded_by = auth.uid());

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION update_documents_updated_at();

-- Comentários para documentação
COMMENT ON TABLE public.documents IS 'Tabela para armazenar metadados de documentos uploadados';
COMMENT ON COLUMN public.documents.team_id IS 'ID da equipe proprietária do documento (isolamento multi-tenant)';
COMMENT ON COLUMN public.documents.uploaded_by IS 'ID do usuário que fez o upload';
COMMENT ON COLUMN public.documents.path IS 'Caminho no Supabase Storage';
COMMENT ON COLUMN public.documents.size_in_bytes IS 'Tamanho do arquivo em bytes para controle de limites';