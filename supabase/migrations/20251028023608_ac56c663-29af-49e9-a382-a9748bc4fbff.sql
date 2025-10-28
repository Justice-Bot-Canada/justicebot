-- Remove old videos and add new ones
DELETE FROM tutorial_videos 
WHERE title ILIKE '%legal rights and responsib%' 
   OR title ILIKE '%understanding ontario legal system%';

-- Add new tutorial videos
INSERT INTO tutorial_videos (title, description, video_url, thumbnail_url, pathway_type, category, step_number, is_active)
VALUES 
  (
    'Know Your Rights in Ontario',
    'Essential guide to understanding your legal rights as an Ontario resident',
    'https://www.youtube.com/embed/iWPgxzwYLrc',
    'https://i.ytimg.com/vi/iWPgxzwYLrc/maxresdefault.jpg',
    'general',
    'Legal Rights',
    1,
    true
  ),
  (
    'Understanding Ontario Legal System',
    'Comprehensive overview of how the Ontario legal system works',
    'https://www.youtube.com/embed/55vVptgQ3p0',
    'https://i.ytimg.com/vi/55vVptgQ3p0/maxresdefault.jpg',
    'general',
    'Legal System',
    2,
    true
  );