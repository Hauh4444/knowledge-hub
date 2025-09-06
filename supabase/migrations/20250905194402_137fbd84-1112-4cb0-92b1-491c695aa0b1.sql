-- Create likes table to track actual likes
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  resource_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, resource_id)
);

-- Enable RLS on likes table
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for likes
CREATE POLICY "Users can view all likes" 
ON public.likes 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own likes" 
ON public.likes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" 
ON public.likes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create views table to track actual views
CREATE TABLE IF NOT EXISTS public.resource_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  resource_id UUID NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on resource_views table
ALTER TABLE public.resource_views ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for resource_views
CREATE POLICY "Anyone can view resource views" 
ON public.resource_views 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert resource views" 
ON public.resource_views 
FOR INSERT 
WITH CHECK (true);

-- Create function to update resource counts
CREATE OR REPLACE FUNCTION update_resource_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- Update likes count
  UPDATE resources 
  SET likes = (SELECT COUNT(*) FROM likes WHERE resource_id = NEW.resource_id OR resource_id = OLD.resource_id)
  WHERE id = COALESCE(NEW.resource_id, OLD.resource_id);
  
  -- Update comments count
  UPDATE resources 
  SET comments_count = (SELECT COUNT(*) FROM comments WHERE resource_id = COALESCE(NEW.resource_id, OLD.resource_id))
  WHERE id = COALESCE(NEW.resource_id, OLD.resource_id);
  
  -- Update views count
  UPDATE resources 
  SET views = (SELECT COUNT(*) FROM resource_views WHERE resource_id = COALESCE(NEW.resource_id, OLD.resource_id))
  WHERE id = COALESCE(NEW.resource_id, OLD.resource_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update counts
DROP TRIGGER IF EXISTS update_likes_count ON likes;
CREATE TRIGGER update_likes_count
  AFTER INSERT OR DELETE ON likes
  FOR EACH ROW
  EXECUTE FUNCTION update_resource_counts();

DROP TRIGGER IF EXISTS update_comments_count ON comments;
CREATE TRIGGER update_comments_count
  AFTER INSERT OR DELETE OR UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_resource_counts();

DROP TRIGGER IF EXISTS update_views_count ON resource_views;
CREATE TRIGGER update_views_count
  AFTER INSERT ON resource_views
  FOR EACH ROW
  EXECUTE FUNCTION update_resource_counts();