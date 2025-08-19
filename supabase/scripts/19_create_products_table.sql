-- Create products table with multi-tenant architecture
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL CHECK (status IN ('ACTIVE', 'INACTIVE')) DEFAULT 'ACTIVE',
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_team_id ON public.products(team_id);
CREATE INDEX idx_products_status ON public.products(status);
CREATE INDEX idx_products_name ON public.products(name);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policy for tenant isolation - products are only visible to team members
CREATE POLICY "Products are isolated by team" ON public.products
    FOR ALL USING (
        team_id IN (
            SELECT team_id FROM public.team_members 
            WHERE user_id = auth.uid()
        )
    );

-- Create policy for product creation - only team members can create products
CREATE POLICY "Team members can create products" ON public.products
    FOR INSERT WITH CHECK (
        team_id IN (
            SELECT team_id FROM public.team_members 
            WHERE user_id = auth.uid()
        )
    );

-- Create policy for product updates - only team members can update products
CREATE POLICY "Team members can update products" ON public.products
    FOR UPDATE USING (
        team_id IN (
            SELECT team_id FROM public.team_members 
            WHERE user_id = auth.uid()
        )
    );

-- Create policy for product deletion - only team members can delete products
CREATE POLICY "Team members can delete products" ON public.products
    FOR DELETE USING (
        team_id IN (
            SELECT team_id FROM public.team_members 
            WHERE user_id = auth.uid()
        )
    );