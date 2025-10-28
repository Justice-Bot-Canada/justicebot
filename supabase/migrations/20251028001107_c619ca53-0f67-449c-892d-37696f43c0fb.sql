-- Add tutorial video for templates/forms section
INSERT INTO tutorial_videos (
  pathway_type,
  step_number,
  title,
  description,
  video_url,
  thumbnail_url,
  category,
  duration_seconds,
  is_active,
  view_count
)
VALUES (
  'forms',
  1,
  'How to Complete Legal Forms - Template Guide',
  'Learn how to properly fill out legal forms and templates in Ontario',
  'https://www.youtube.com/embed/eZt0_SZ8dCw',
  'https://img.youtube.com/vi/eZt0_SZ8dCw/maxresdefault.jpg',
  'Form Completion',
  540,
  true,
  0
);