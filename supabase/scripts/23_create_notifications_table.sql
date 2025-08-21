-- ============================================================================
-- NOTIFICATIONS MODULE
-- ============================================================================

-- Create enum for notification action types
CREATE TYPE public.notification_action_type AS ENUM (
  'PRODUCT_CREATED',
  'PRODUCT_UPDATED', 
  'PRODUCT_DELETED',
  'USER_INVITED',
  'USER_JOINED',
  'TEAM_CREATED',
  'TEAM_UPDATED',
  'DOCUMENT_UPLOADED',
  'PLAN_CHANGED'
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  actor_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action_type public.notification_action_type NOT NULL,
  entity_id UUID,
  entity_type VARCHAR(50),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  is_read BOOLEAN NOT NULL DEFAULT false,
  message TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ(6) NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_notifications_recipient_read ON public.notifications(recipient_user_id, is_read);
CREATE INDEX idx_notifications_recipient_created ON public.notifications(recipient_user_id, created_at DESC);
CREATE INDEX idx_notifications_team ON public.notifications(team_id);
CREATE INDEX idx_notifications_entity ON public.notifications(entity_id, entity_type);

-- Add updated_at trigger
CREATE TRIGGER set_notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Enable RLS (Row Level Security)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see notifications where they are the recipient
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (
    recipient_user_id = auth.uid()
  );

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (
    recipient_user_id = auth.uid()
  );

-- System can insert notifications (handled by service functions)
CREATE POLICY "System can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- Grant permissions
GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT INSERT ON public.notifications TO service_role;

-- Add comments for documentation
COMMENT ON TABLE public.notifications IS 'Stores all user notifications for the application';
COMMENT ON COLUMN public.notifications.recipient_user_id IS 'User who will receive the notification';
COMMENT ON COLUMN public.notifications.actor_user_id IS 'User who performed the action (can be null for system notifications)';
COMMENT ON COLUMN public.notifications.action_type IS 'Type of action that triggered the notification';
COMMENT ON COLUMN public.notifications.entity_id IS 'ID of the entity related to the notification (product, team, etc.)';
COMMENT ON COLUMN public.notifications.entity_type IS 'Type of entity (Product, Team, User, etc.)';
COMMENT ON COLUMN public.notifications.team_id IS 'Team context for the notification';
COMMENT ON COLUMN public.notifications.is_read IS 'Whether the notification has been read by the recipient';
COMMENT ON COLUMN public.notifications.message IS 'Optional custom message for the notification';
COMMENT ON COLUMN public.notifications.metadata IS 'Additional JSON data for the notification (URLs, extra info, etc.)';