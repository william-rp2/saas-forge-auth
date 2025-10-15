-- Create features table for feature flags management

CREATE TABLE public.features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

-- Create index for better performance
CREATE INDEX idx_features_key ON public.features(key);

-- Insert default features
INSERT INTO public.features (id, key, name, description) VALUES
(gen_random_uuid(), 'advanced-reports', 'Relatórios Avançados', 'Acesso a relatórios detalhados e analytics'),
(gen_random_uuid(), 'api-access', 'Acesso à API', 'Integração via API REST'),
(gen_random_uuid(), 'priority-support', 'Suporte Prioritário', 'Suporte técnico com prioridade'),
(gen_random_uuid(), 'custom-branding', 'Marca Personalizada', 'Personalização da marca e logotipo'),
(gen_random_uuid(), 'unlimited-exports', 'Exportações Ilimitadas', 'Exportar dados sem limitações');
