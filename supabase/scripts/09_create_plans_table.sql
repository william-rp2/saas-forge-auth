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
INSERT INTO public.plans (name, price, price_description, description) VALUES
('Free', 0, '/mês', 'Plano gratuito para começar'),
('Pro', 49.90, '/mês', 'Plano profissional com recursos avançados'),
('Enterprise', 149.90, '/mês', 'Plano corporativo com recursos ilimitados');
