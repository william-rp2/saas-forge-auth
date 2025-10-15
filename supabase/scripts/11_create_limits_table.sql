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
INSERT INTO public.limits (key, name, description) VALUES
('max-projects', 'Máximo de Projetos', 'Número máximo de projetos que podem ser criados'),
('max-users', 'Máximo de Usuários', 'Número máximo de usuários na conta'),
('max-storage', 'Armazenamento (GB)', 'Limite de armazenamento em gigabytes'),
('max-api-calls', 'Chamadas API/mês', 'Número máximo de chamadas à API por mês');
