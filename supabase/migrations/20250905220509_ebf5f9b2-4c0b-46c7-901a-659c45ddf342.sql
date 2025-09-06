-- Create a trigger to handle dark mode preference on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_dark_mode()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create user settings with dark mode preference if provided in user metadata
  INSERT INTO public.user_settings (
    user_id,
    dark_mode_preference
  ) VALUES (
    NEW.id,
    CASE 
      WHEN NEW.raw_user_meta_data ->> 'dark_mode_preference' = 'true' THEN true
      WHEN NEW.raw_user_meta_data ->> 'dark_mode_preference' = 'false' THEN false
      ELSE null
    END
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user dark mode handling
DROP TRIGGER IF EXISTS on_auth_user_created_dark_mode ON auth.users;
CREATE TRIGGER on_auth_user_created_dark_mode
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_dark_mode();