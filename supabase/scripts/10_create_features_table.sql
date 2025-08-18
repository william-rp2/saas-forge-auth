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
('1', 'advanced-reports', 'Relatórios Avançados', 'Acesso a relatórios detalhados e analytics'),
('2', 'api-access', 'Acesso à API', 'Integração via API REST'),
('3', 'priority-support', 'Suporte Prioritário', 'Suporte técnico com prioridade'),
('4', 'custom-branding', 'Marca Personalizada', 'Personalização da marca e logotipo'),
('5', 'unlimited-exports', 'Exportações Ilimitadas', 'Exportar dados sem limitações');

-- Enable RLS
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;

-- Create policy for features (read-only for all authenticated users)
CREATE POLICY "Features are viewable by authenticated users" ON public.features
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy for features management (admin only)
CREATE POLICY "Features are manageable by admins" ON public.features
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users u 
            JOIN public.roles r ON u.role_id = r.id 
            WHERE u.id = auth.uid() 
            AND r.name = 'Administrador'
        )
    );