-- Create enum for address types
CREATE TYPE public.address_type AS ENUM (
  'RESIDENTIAL',
  'COMMERCIAL',
  'OTHER'
);

-- Create table address
CREATE TABLE public.address (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  address_type public.address_type NOT NULL DEFAULT 'RESIDENTIAL',
  address_value VARCHAR(255) NOT NULL
);

-- Add profile fields to users table
ALTER TABLE public.users 
ADD COLUMN birth_date DATE,
ADD COLUMN cpf VARCHAR(11) UNIQUE NOT NULL,
ADD COLUMN gender VARCHAR(1); -- M - MASCULINO \ F - FEMININO

-- Create indexes for better performance
CREATE INDEX idx_users_birth_date ON public.users(birth_date);
CREATE INDEX idx_users_cpf ON public.users(cpf);

-- Add comments
COMMENT ON COLUMN public.users.birth_date IS 'User birth date';
COMMENT ON COLUMN public.users.cpf IS 'User CPF (Brazilian tax ID)'; -- Sem máscara
COMMENT ON COLUMN public.users.gender IS 'User gender (M - Male | F - Female)'