-- Example script demonstrating tenant isolation principle
-- This shows how ALL future data tables should include team_id for multi-tenancy

-- Create a sample projects table with proper tenant isolation
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'ACTIVE',
  created_by UUID NOT NULL REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes optimized for tenant queries
CREATE INDEX idx_projects_team_id ON public.projects(team_id);
CREATE INDEX idx_projects_team_status ON public.projects(team_id, status);
CREATE INDEX idx_projects_created_by ON public.projects(created_by);

-- Add RLS policy for tenant isolation
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- CRITICAL: This policy ensures data isolation between teams
CREATE POLICY "Users can only access projects from their teams" ON public.projects
  FOR ALL USING (
    team_id IN (
      SELECT team_id FROM public.team_members 
      WHERE user_id = auth.uid()
    )
  );

-- Example of how to add team_id to existing tables (if they existed)
-- ALTER TABLE existing_table ADD COLUMN team_id UUID REFERENCES public.teams(id);
-- UPDATE existing_table SET team_id = (SELECT default_team_for_migration);

/*
TENANT ISOLATION PRINCIPLE:
=========================
This script demonstrates the core architectural principle:
- ALL data tables MUST include team_id column
- ALL queries MUST filter by team_id  
- ALL RLS policies MUST enforce team boundaries
- This ensures complete data isolation between teams
*/