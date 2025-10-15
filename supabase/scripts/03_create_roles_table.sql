-- Create roles table for RBAC system
-- This table stores the different access roles/profiles

CREATE TABLE public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3b82f6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_roles_name ON public.roles(name);
CREATE INDEX idx_roles_created_at ON public.roles(created_at);

-- Create updated_at trigger
CREATE TRIGGER update_roles_updated_at 
    BEFORE UPDATE ON public.roles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default roles
INSERT INTO public.roles (id, name, description, color) VALUES
    (gen_random_uuid(), 'Administrador', 'Acesso completo ao sistema', '#ef4444'),
    (gen_random_uuid(), 'Membro da Equipe', 'Acesso para gerenciar projetos e tarefas', '#3b82f6'),
    (gen_random_uuid(), 'Cliente', 'Acesso somente leitura aos próprios projetos', '#10b981');