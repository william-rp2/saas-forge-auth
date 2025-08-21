-- 21_create_product_attachments_table.sql
-- Criação da tabela product_attachments para anexos de produtos
-- Relaciona documentos com produtos específicos

-- Criar tabela product_attachments
CREATE TABLE public.product_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Garantir que um documento não seja anexado múltiplas vezes ao mesmo produto
  UNIQUE(product_id, document_id)
);

-- Índices para otimização
CREATE INDEX idx_product_attachments_product_id ON public.product_attachments(product_id);
CREATE INDEX idx_product_attachments_document_id ON public.product_attachments(document_id);

-- Habilitar RLS
ALTER TABLE public.product_attachments ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver anexos de produtos de suas equipes
CREATE POLICY "Users can view team product attachments" 
ON public.product_attachments FOR SELECT 
USING (
  product_id IN (
    SELECT p.id 
    FROM public.products p 
    INNER JOIN public.team_members tm ON p.team_id = tm.team_id 
    WHERE tm.user_id = auth.uid()
  )
);

-- Política: Usuários podem inserir anexos em produtos de suas equipes
CREATE POLICY "Users can insert team product attachments" 
ON public.product_attachments FOR INSERT 
WITH CHECK (
  product_id IN (
    SELECT p.id 
    FROM public.products p 
    INNER JOIN public.team_members tm ON p.team_id = tm.team_id 
    WHERE tm.user_id = auth.uid()
  )
  AND document_id IN (
    SELECT d.id 
    FROM public.documents d 
    WHERE d.uploaded_by = auth.uid()
  )
);

-- Política: Usuários podem deletar anexos que criaram
CREATE POLICY "Users can delete own product attachments" 
ON public.product_attachments FOR DELETE 
USING (
  document_id IN (
    SELECT d.id 
    FROM public.documents d 
    WHERE d.uploaded_by = auth.uid()
  )
);

-- View para facilitar consultas de produtos com anexos
CREATE OR REPLACE VIEW public.products_with_attachments AS
SELECT 
  p.*,
  COALESCE(
    json_agg(
      json_build_object(
        'id', d.id,
        'name', d.name,
        'url', d.url,
        'file_type', d.file_type,
        'size_in_bytes', d.size_in_bytes,
        'uploaded_by', d.uploaded_by,
        'created_at', d.created_at
      )
    ) FILTER (WHERE d.id IS NOT NULL),
    '[]'::json
  ) AS attachments
FROM public.products p
LEFT JOIN public.product_attachments pa ON p.id = pa.product_id
LEFT JOIN public.documents d ON pa.document_id = d.id
GROUP BY p.id;

-- Comentários para documentação
COMMENT ON TABLE public.product_attachments IS 'Tabela de relacionamento entre produtos e documentos anexados';
COMMENT ON VIEW public.products_with_attachments IS 'View que retorna produtos com seus anexos em formato JSON';