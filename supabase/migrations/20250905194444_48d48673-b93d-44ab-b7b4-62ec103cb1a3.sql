-- Check if tables exist and create only if needed
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'likes') THEN
        CREATE TABLE public.likes (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL,
            resource_id UUID NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            UNIQUE(user_id, resource_id)
        );
        
        ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
        
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
    END IF;

    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'resource_views') THEN
        CREATE TABLE public.resource_views (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID,
            resource_id UUID NOT NULL,
            ip_address TEXT,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
        
        ALTER TABLE public.resource_views ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Anyone can view resource views" 
        ON public.resource_views 
        FOR SELECT 
        USING (true);

        CREATE POLICY "Anyone can insert resource views" 
        ON public.resource_views 
        FOR INSERT 
        WITH CHECK (true);
    END IF;
END $$;

-- Create or replace function to update resource counts
CREATE OR REPLACE FUNCTION update_resource_counts()
RETURNS TRIGGER AS $$
DECLARE
    target_resource_id UUID;
BEGIN
    -- Determine which resource_id to update
    IF TG_OP = 'DELETE' THEN
        target_resource_id := OLD.resource_id;
    ELSE
        target_resource_id := NEW.resource_id;
    END IF;
    
    -- Update likes count
    UPDATE resources 
    SET likes = (SELECT COUNT(*) FROM likes WHERE resource_id = target_resource_id)
    WHERE id = target_resource_id;
    
    -- Update comments count  
    UPDATE resources 
    SET comments_count = (SELECT COUNT(*) FROM comments WHERE resource_id = target_resource_id)
    WHERE id = target_resource_id;
    
    -- Update views count
    UPDATE resources 
    SET views = (SELECT COUNT(*) FROM resource_views WHERE resource_id = target_resource_id)
    WHERE id = target_resource_id;
    
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers first
DROP TRIGGER IF EXISTS update_likes_count ON likes;
DROP TRIGGER IF EXISTS update_comments_count ON comments;  
DROP TRIGGER IF EXISTS update_views_count ON resource_views;

-- Create new triggers
CREATE TRIGGER update_likes_count
    AFTER INSERT OR DELETE ON likes
    FOR EACH ROW
    EXECUTE FUNCTION update_resource_counts();

CREATE TRIGGER update_comments_count
    AFTER INSERT OR DELETE OR UPDATE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION update_resource_counts();

CREATE TRIGGER update_views_count
    AFTER INSERT ON resource_views
    FOR EACH ROW
    EXECUTE FUNCTION update_resource_counts();