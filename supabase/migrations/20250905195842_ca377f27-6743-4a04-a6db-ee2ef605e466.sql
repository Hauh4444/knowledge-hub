-- Add deadline field to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS deadline TIMESTAMP WITH TIME ZONE;

-- Update the update_updated_at_column trigger to also work with projects
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();