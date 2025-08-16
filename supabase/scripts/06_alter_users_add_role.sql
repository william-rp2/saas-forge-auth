-- Add role_id column to users table

ALTER TABLE public.users 
ADD COLUMN role_id UUID REFERENCES public.roles(id);

-- Create index for better performance
CREATE INDEX idx_users_role_id ON public.users(role_id);

-- Set default role for existing users (Client role)
UPDATE public.users SET role_id = '3' WHERE role_id IS NULL;

-- Make role_id NOT NULL after setting defaults
ALTER TABLE public.users ALTER COLUMN role_id SET NOT NULL;