-- Create plan_features junction table

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
('2', '1'), -- advanced-reports
('2', '2'); -- api-access

-- Enterprise plan features (all features)
INSERT INTO public.plan_features (plan_id, feature_id) VALUES
('3', '1'), -- advanced-reports
('3', '2'), -- api-access
('3', '3'), -- priority-support
('3', '4'), -- custom-branding
('3', '5'); -- unlimited-exports

-- Enable RLS
ALTER TABLE public.plan_features ENABLE ROW LEVEL SECURITY;

-- Create policy for plan_features (read-only for all authenticated users)
CREATE POLICY "Plan features are viewable by authenticated users" ON public.plan_features
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy for plan_features management (admin only)
CREATE POLICY "Plan features are manageable by admins" ON public.plan_features
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users u 
            JOIN public.roles r ON u.role_id = r.id 
            WHERE u.id = auth.uid() 
            AND r.name = 'Administrador'
        )
    );