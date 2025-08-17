-- Add profile fields to users table

ALTER TABLE public.users 
ADD COLUMN birth_date DATE,
ADD COLUMN cpf TEXT;

-- Create indexes for better performance
CREATE INDEX idx_users_birth_date ON public.users(birth_date);
CREATE INDEX idx_users_cpf ON public.users(cpf);

-- Add comments
COMMENT ON COLUMN public.users.birth_date IS 'User birth date';
COMMENT ON COLUMN public.users.cpf IS 'User CPF (Brazilian tax ID)';