-- Add plan_id column to users table

ALTER TABLE public.users 
ADD COLUMN plan_id UUID REFERENCES public.plans(id);

-- Create index for better performance
CREATE INDEX idx_users_plan_id ON public.users(plan_id);

-- Make plan_id NOT NULL after setting defaults
ALTER TABLE public.users ALTER COLUMN plan_id SET NOT NULL;