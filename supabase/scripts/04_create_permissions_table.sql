-- Create permissions table for granular access control
-- Based on action + subject pattern

CREATE TABLE public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(50) NOT NULL, -- 'create', 'read', 'update', 'delete', 'manage'
    subject VARCHAR(50) NOT NULL, -- 'Project', 'Task', 'User', 'Role', 'all', etc.
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique constraint on action + subject combination
ALTER TABLE public.permissions ADD CONSTRAINT unique_action_subject UNIQUE (action, subject);

-- Create indexes
CREATE INDEX idx_permissions_action_subject ON public.permissions(action, subject);

-- Enable Row Level Security  
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;

-- RLS Policy - Same as roles (admin access)
CREATE POLICY "Admins can read permissions" 
    ON public.permissions FOR SELECT 
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
                    (p.action = 'read' AND p.subject = 'Role')
                )
            )
        )
    );

-- Insert default permissions
INSERT INTO public.permissions (id, action, subject, name, description) VALUES
    ('1', 'create', 'Project', 'Criar Projetos', 'Permitir criação de novos projetos'),
    ('2', 'read', 'Project', 'Visualizar Projetos', 'Permitir visualização de projetos'),
    ('22', 'manage', 'all', 'Acesso Total', 'Acesso completo ao sistema');