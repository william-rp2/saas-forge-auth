-- Create profiles table for extended user information
-- One-to-one relationship with users table

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    avatar_url TEXT,
    bio TEXT,
    company VARCHAR(100),
    website VARCHAR(255),
    phone VARCHAR(20),
    timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo',
    language VARCHAR(10) DEFAULT 'pt-BR',
    notification_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": true}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE UNIQUE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_created_at ON public.profiles(created_at);

-- Create updated_at trigger
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON public.profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" 
    ON public.profiles FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM public.users 
        WHERE users.id = profiles.user_id 
        AND users.auth_user_id = auth.uid()
    ));

CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (EXISTS (
        SELECT 1 FROM public.users 
        WHERE users.id = profiles.user_id 
        AND users.auth_user_id = auth.uid()
    ));

-- Service role policy
CREATE POLICY "Service role can manage all profiles" 
    ON public.profiles FOR ALL 
    USING (auth.role() = 'service_role');