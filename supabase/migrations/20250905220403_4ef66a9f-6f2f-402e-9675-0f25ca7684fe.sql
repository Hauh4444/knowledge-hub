-- Add dark mode preference to user settings table
ALTER TABLE public.user_settings 
ADD COLUMN dark_mode_preference boolean DEFAULT null;

COMMENT ON COLUMN public.user_settings.dark_mode_preference IS 'User preference for dark mode: true = dark, false = light, null = system default';