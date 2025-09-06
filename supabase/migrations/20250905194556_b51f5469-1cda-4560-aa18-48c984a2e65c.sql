-- Fix function search path security issue
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
$$ LANGUAGE plpgsql SET search_path = public;