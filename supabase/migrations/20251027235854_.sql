-- Fix HRTO step 1 - replace family law video with proper HRTO content
UPDATE tutorial_videos 
SET 
  video_url = 'https://www.youtube.com/embed/eZt0_SZ8dCw',
  thumbnail_url = 'https://img.youtube.com/vi/eZt0_SZ8dCw/maxresdefault.jpg',
  title = 'Understanding Your Human Rights - HRTO Overview',
  description = 'Learn about the Human Rights Tribunal of Ontario process and how to prepare your application',
  duration_seconds = 540
WHERE pathway_type = 'hrto' AND step_number = 1;;
