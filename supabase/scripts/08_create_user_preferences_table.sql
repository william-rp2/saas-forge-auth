-- Create user preferences table

CREATE TABLE public.user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    theme VARCHAR(10) DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
    product_updates BOOLEAN DEFAULT true,
    account_activity BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create indexes
CREATE INDEX idx_user_preferences_user_id ON public.user_preferences(user_id);
CREATE INDEX idx_user_preferences_theme ON public.user_preferences(theme);

-- Create updated_at trigger
CREATE TRIGGER update_user_preferences_updated_at 
    BEFORE UPDATE ON public.user_preferences 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policy - Users can only access their own preferences
CREATE POLICY "Users can manage their own preferences" 
    ON public.user_preferences FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.users u
            WHERE u.id = user_preferences.user_id
            AND u.auth_user_id = auth.uid()
        )
    );