-- Create junction table for roles and permissions (many-to-many)

CREATE TABLE public.role_permissions (
    role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_role_permissions_role_id ON public.role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission_id ON public.role_permissions(permission_id);

-- Insert default role-permission associations
INSERT INTO public.role_permissions (role_id, permission_id) VALUES
    ((select id from public.roles where name = 'Administrador'), (select id from public.permissions where action = 'manage')),
    ((select id from public.roles where name = 'Membro da Equipe'), (select id from public.permissions where action = 'create')),
    ((select id from public.roles where name = 'Membro da Equipe'), (select id from public.permissions where action = 'read'));