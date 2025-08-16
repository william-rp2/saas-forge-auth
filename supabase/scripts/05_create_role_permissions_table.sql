-- Create junction table for roles and permissions (many-to-many)

CREATE TABLE public.role_permissions (
    role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_role_permissions_role_id ON public.role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission_id ON public.role_permissions(permission_id);

-- Enable Row Level Security
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "Admins can manage role permissions" 
    ON public.role_permissions FOR ALL 
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
                    (p.action IN ('create', 'update', 'delete') AND p.subject = 'Role')
                )
            )
        )
    );

-- Insert default role-permission associations
INSERT INTO public.role_permissions (role_id, permission_id) VALUES
    ('1', '22'), -- Administrator: manage all
    ('2', '1'),  -- Team Member: create projects
    ('2', '2');  -- Team Member: read projects