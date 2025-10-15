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

-- Insert default permissions
INSERT INTO public.permissions (id, action, subject, name, description) VALUES
    (gen_random_uuid(), 'create', 'Project', 'Criar Projetos', 'Permitir criação de novos projetos'),
    (gen_random_uuid(), 'read', 'Project', 'Visualizar Projetos', 'Permitir visualização de projetos'),
    (gen_random_uuid(), 'manage', 'all', 'Acesso Total', 'Acesso completo ao sistema');