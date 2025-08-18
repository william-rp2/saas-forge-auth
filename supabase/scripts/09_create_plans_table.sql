-- Create plans table for subscription management

CREATE TABLE public.plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    price_description VARCHAR(50) NOT NULL DEFAULT '/mês',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX idx_plans_name ON public.plans(name);

-- Insert default plans
INSERT INTO public.plans (id, name, price, price_description, description) VALUES
('1', 'Free', 0, '/mês', 'Plano gratuito para começar'),
('2', 'Pro', 49.90, '/mês', 'Plano profissional com recursos avançados'),
('3', 'Enterprise', 149.90, '/mês', 'Plano corporativo com recursos ilimitados');

-- Enable RLS
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- Create policy for plans (read-only for all authenticated users)
CREATE POLICY "Plans are viewable by authenticated users" ON public.plans
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy for plans management (admin only)
CREATE POLICY "Plans are manageable by admins" ON public.plans
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users u 
            JOIN public.roles r ON u.role_id = r.id 
            WHERE u.id = auth.uid() 
            AND r.name = 'Administrador'
        )
    );