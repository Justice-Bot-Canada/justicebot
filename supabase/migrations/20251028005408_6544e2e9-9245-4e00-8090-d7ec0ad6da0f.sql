-- Add Step-by-Step Small Claims Process video
INSERT INTO public.tutorial_videos (
  title,
  description,
  video_url,
  thumbnail_url,
  category,
  pathway_type,
  step_number,
  duration_seconds,
  is_active
) VALUES (
  'Step-by-Step Process For Small Claims In Ontario',
  'A comprehensive guide walking through the entire small claims court process in Ontario from start to finish.',
  'https://www.youtube.com/embed/NTaiMtqsE7c',
  'https://img.youtube.com/vi/NTaiMtqsE7c/maxresdefault.jpg',
  'Court Process',
  'small-claims',
  2,
  600,
  true
);