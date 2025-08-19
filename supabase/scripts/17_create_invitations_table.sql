-- Create team invitations table
CREATE TABLE public.team_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'MEMBER')),
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'DECLINED')),
  invited_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days')
);

-- Create indexes for better performance
CREATE INDEX idx_invitations_team_id ON public.team_invitations(team_id);
CREATE INDEX idx_invitations_email ON public.team_invitations(email);
CREATE INDEX idx_invitations_status ON public.team_invitations(status);

-- Add RLS policy
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view invitations for teams they are members of
CREATE POLICY "Users can view team invitations" ON public.team_invitations
  FOR SELECT USING (
    team_id IN (
      SELECT team_id FROM public.team_members 
      WHERE user_id = auth.uid()
    )
  );

-- Policy: Only team admins and owners can create invitations
CREATE POLICY "Team admins can create invitations" ON public.team_invitations
  FOR INSERT WITH CHECK (
    team_id IN (
      SELECT team_id FROM public.team_members 
      WHERE user_id = auth.uid() AND role IN ('OWNER', 'ADMIN')
    )
  );