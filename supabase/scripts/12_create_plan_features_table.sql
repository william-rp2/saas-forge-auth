CREATE TABLE public.plan_features (
    plan_id UUID REFERENCES public.plans(id) ON DELETE CASCADE,
    feature_id UUID REFERENCES public.features(id) ON DELETE CASCADE,
    PRIMARY KEY (plan_id, feature_id)
);

-- Create indexes for better performance
CREATE INDEX idx_plan_features_plan_id ON public.plan_features(plan_id);
CREATE INDEX idx_plan_features_feature_id ON public.plan_features(feature_id);

-- Insert default plan-feature relationships
-- Free plan - no features

-- Pro plan features
INSERT INTO public.plan_features (plan_id, feature_id) VALUES
((select id from public.plans where name = 'Pro'), (select id from public.features where key = 'advanced-reports')), -- advanced-reports
((select id from public.plans where name = 'Pro'), (select id from public.features where key = 'api-access')); -- api-access

-- Enterprise plan features (all features)
INSERT INTO public.plan_features (plan_id, feature_id) VALUES
((select id from public.plans where name = 'Enterprise'), (select id from public.features where key = 'advanced-reports')), -- advanced-reports
((select id from public.plans where name = 'Enterprise'), (select id from public.features where key = 'api-access')), -- api-access
((select id from public.plans where name = 'Enterprise'), (select id from public.features where key = 'priority-support')), -- priority-support
((select id from public.plans where name = 'Enterprise'), (select id from public.features where key = 'custom-branding')), -- custom-branding
((select id from public.plans where name = 'Enterprise'), (select id from public.features where key = 'unlimited-exports')); -- unlimited-exports