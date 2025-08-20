-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('avatars', 'avatars', true),
  ('documents', 'documents', false);

-- Create documents table for file metadata
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  size_in_bytes BIGINT NOT NULL,
  uploader_user_id UUID NOT NULL,
  team_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create policies for documents
CREATE POLICY "Users can view team documents" 
ON public.documents 
FOR SELECT 
USING (team_id IN (
  SELECT team_id FROM public.team_members 
  WHERE user_id = auth.uid()
));

CREATE POLICY "Users can upload documents to their team" 
ON public.documents 
FOR INSERT 
WITH CHECK (team_id IN (
  SELECT team_id FROM public.team_members 
  WHERE user_id = auth.uid()
) AND uploader_user_id = auth.uid());

CREATE POLICY "Users can delete their own documents" 
ON public.documents 
FOR DELETE 
USING (uploader_user_id = auth.uid());

-- Add avatar_url column to users table (if it doesn't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'users' AND column_name = 'avatar_url') THEN
    ALTER TABLE public.users ADD COLUMN avatar_url TEXT;
  END IF;
END $$;

-- Create product_attachments junction table
CREATE TABLE public.product_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(product_id, document_id)
);

-- Enable RLS on product_attachments
ALTER TABLE public.product_attachments ENABLE ROW LEVEL SECURITY;

-- Create policies for product_attachments
CREATE POLICY "Users can view team product attachments" 
ON public.product_attachments 
FOR SELECT 
USING (document_id IN (
  SELECT id FROM public.documents 
  WHERE team_id IN (
    SELECT team_id FROM public.team_members 
    WHERE user_id = auth.uid()
  )
));

CREATE POLICY "Users can create product attachments in their team" 
ON public.product_attachments 
FOR INSERT 
WITH CHECK (document_id IN (
  SELECT id FROM public.documents 
  WHERE team_id IN (
    SELECT team_id FROM public.team_members 
    WHERE user_id = auth.uid()
  )
));

-- Storage policies for avatars bucket
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatar" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage policies for documents bucket
CREATE POLICY "Users can view team documents in storage" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] IN (
    SELECT team_id::text FROM public.team_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can upload documents to their team folder" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] IN (
    SELECT team_id::text FROM public.team_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete team documents they uploaded" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] IN (
    SELECT team_id::text FROM public.team_members 
    WHERE user_id = auth.uid()
  )
);

-- Create trigger for updating timestamps
CREATE TRIGGER update_documents_updated_at
BEFORE UPDATE ON public.documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();