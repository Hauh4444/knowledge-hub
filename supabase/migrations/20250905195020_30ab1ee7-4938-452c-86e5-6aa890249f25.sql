-- Initialize existing resource counts to ensure accurate display
UPDATE resources 
SET 
  likes = COALESCE((SELECT COUNT(*) FROM likes WHERE resource_id = resources.id), 0),
  comments_count = COALESCE((SELECT COUNT(*) FROM comments WHERE resource_id = resources.id), 0),
  views = COALESCE((SELECT COUNT(*) FROM resource_views WHERE resource_id = resources.id), 0);