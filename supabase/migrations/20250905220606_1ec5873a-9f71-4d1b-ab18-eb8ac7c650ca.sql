-- Fix function search paths for all functions without proper search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_resource_counts()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE conversations 
  SET last_message_at = NEW.created_at, updated_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;