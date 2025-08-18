-- Create limits table for usage limits management

CREATE TABLE public.limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

-- Create index for better performance
CREATE INDEX idx_limits_key ON public.limits(key);

-- Insert default limits
INSERT INTO public.limits (id, key, name, description) VALUES
('1', 'max-projects', 'Máximo de Projetos', 'Número máximo de projetos que podem ser criados'),
('2', 'max-users', 'Máximo de Usuários', 'Número máximo de usuários na conta'),
('3', 'max-storage', 'Armazenamento (GB)', 'Limite de armazenamento em gigabytes'),
('4', 'max-api-calls', 'Chamadas API/mês', 'Número máximo de chamadas à API por mês');

-- Enable RLS
ALTER TABLE public.limits ENABLE ROW LEVEL SECURITY;

-- Create policy for limits (read-only for all authenticated users)
CREATE POLICY "Limits are viewable by authenticated users" ON public.limits
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy for limits management (admin only)
CREATE POLICY "Limits are manageable by admins" ON public.limits
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users u 
            JOIN public.roles r ON u.role_id = r.id 
            WHERE u.id = auth.uid() 
            AND r.name = 'Administrador'
        )
    );