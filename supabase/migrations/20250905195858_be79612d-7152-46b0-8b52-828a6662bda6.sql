-- Add deadline field to projects table if it doesn't exist
ALTER TABLE projects ADD COLUMN IF NOT EXISTS deadline TIMESTAMP WITH TIME ZONE;