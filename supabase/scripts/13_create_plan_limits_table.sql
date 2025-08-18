-- Create plan_limits junction table with values

CREATE TABLE public.plan_limits (
    plan_id UUID REFERENCES public.plans(id) ON DELETE CASCADE,
    limit_id UUID REFERENCES public.limits(id) ON DELETE CASCADE,
    value INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (plan_id, limit_id)
);

-- Create indexes for better performance
CREATE INDEX idx_plan_limits_plan_id ON public.plan_limits(plan_id);
CREATE INDEX idx_plan_limits_limit_id ON public.plan_limits(limit_id);

-- Insert default plan-limit relationships

-- Free plan limits
INSERT INTO public.plan_limits (plan_id, limit_id, value) VALUES
('1', '1', 3),    -- max-projects: 3
('1', '2', 1),    -- max-users: 1
('1', '3', 1),    -- max-storage: 1GB
('1', '4', 100);  -- max-api-calls: 100/month

-- Pro plan limits
INSERT INTO public.plan_limits (plan_id, limit_id, value) VALUES
('2', '1', 50),   -- max-projects: 50
('2', '2', 10),   -- max-users: 10
('2', '3', 100),  -- max-storage: 100GB
('2', '4', 10000); -- max-api-calls: 10,000/month

-- Enterprise plan limits
INSERT INTO public.plan_limits (plan_id, limit_id, value) VALUES
('3', '1', -1),   -- max-projects: unlimited
('3', '2', -1),   -- max-users: unlimited
('3', '3', 1000), -- max-storage: 1TB
('3', '4', -1);   -- max-api-calls: unlimited

-- Enable RLS
ALTER TABLE public.plan_limits ENABLE ROW LEVEL SECURITY;

-- Create policy for plan_limits (read-only for all authenticated users)
CREATE POLICY "Plan limits are viewable by authenticated users" ON public.plan_limits
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy for plan_limits management (admin only)
CREATE POLICY "Plan limits are manageable by admins" ON public.plan_limits
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users u 
            JOIN public.roles r ON u.role_id = r.id 
            WHERE u.id = auth.uid() 
            AND r.name = 'Administrador'
        )
    );