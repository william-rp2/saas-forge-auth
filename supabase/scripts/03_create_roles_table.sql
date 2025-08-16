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

-- Enable Row Level Security
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage roles" 
    ON public.roles FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.users u
            JOIN public.roles r ON u.role_id = r.id
            WHERE u.auth_user_id = auth.uid()
            AND EXISTS (
                SELECT 1 FROM public.role_permissions rp
                JOIN public.permissions p ON rp.permission_id = p.id
                WHERE rp.role_id = r.id
                AND (
                    (p.action = 'manage' AND p.subject = 'all') OR
                    (p.action IN ('create', 'read', 'update', 'delete') AND p.subject = 'Role')
                )
            )
        )
    );

-- Insert default roles
INSERT INTO public.roles (id, name, description, color) VALUES
    ('1', 'Administrador', 'Acesso completo ao sistema', '#ef4444'),
    ('2', 'Membro da Equipe', 'Acesso para gerenciar projetos e tarefas', '#3b82f6'),
    ('3', 'Cliente', 'Acesso somente leitura aos próprios projetos', '#10b981');