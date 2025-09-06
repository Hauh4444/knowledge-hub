-- Fix function search path security issue
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
$$ LANGUAGE plpgsql SET search_path = public;