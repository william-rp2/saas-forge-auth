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
((select id from public.plans where name = 'Free'), (select id from public.limits where key = 'max-projects'), 3),    -- max-projects: 3
((select id from public.plans where name = 'Free'), (select id from public.limits where key = 'max-users'), 1),    -- max-users: 1
((select id from public.plans where name = 'Free'), (select id from public.limits where key = 'max-storage'), 1),    -- max-storage: 1GB
((select id from public.plans where name = 'Free'), (select id from public.limits where key = 'max-api-calls'), 100);  -- max-api-calls: 100/month

-- Pro plan limits
INSERT INTO public.plan_limits (plan_id, limit_id, value) VALUES
((select id from public.plans where name = 'Pro'), (select id from public.limits where key = 'max-projects'), 50),   -- max-projects: 50
((select id from public.plans where name = 'Pro'), (select id from public.limits where key = 'max-users'), 10),   -- max-users: 10
((select id from public.plans where name = 'Pro'), (select id from public.limits where key = 'max-storage'), 100),  -- max-storage: 100GB
((select id from public.plans where name = 'Pro'), (select id from public.limits where key = 'max-api-calls'), 10000); -- max-api-calls: 10,000/month

-- Enterprise plan limits
INSERT INTO public.plan_limits (plan_id, limit_id, value) VALUES
((select id from public.plans where name = 'Enterprise'), (select id from public.limits where key = 'max-projects'),  -1),   -- max-projects: unlimited
((select id from public.plans where name = 'Enterprise'), (select id from public.limits where key = 'max-users'), -1),   -- max-users: unlimited
((select id from public.plans where name = 'Enterprise'), (select id from public.limits where key = 'max-storage'), 1000), -- max-storage: 1TB
((select id from public.plans where name = 'Enterprise'), (select id from public.limits where key = 'max-api-calls'), -1);   -- max-api-calls: unlimited
