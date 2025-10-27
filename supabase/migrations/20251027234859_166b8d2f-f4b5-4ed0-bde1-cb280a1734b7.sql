-- Update LTB tutorial videos with proper YouTube sources
UPDATE tutorial_videos 
SET 
  video_url = 'https://www.youtube.com/embed/Ds97LCuSX1U',
  thumbnail_url = 'https://img.youtube.com/vi/Ds97LCuSX1U/maxresdefault.jpg',
  title = 'Joining an LTB Hearing - Official Guide',
  description = 'Official Tribunals Ontario video showing how to join your virtual LTB hearing',
  duration_seconds = 214
WHERE pathway_type = 'ltb' AND step_number = 1;

UPDATE tutorial_videos 
SET 
  video_url = 'https://www.youtube.com/embed/-e1JcSwg2_U',
  thumbnail_url = 'https://img.youtube.com/vi/-e1JcSwg2_U/maxresdefault.jpg',
  title = 'What to Expect at Your LTB Hearing',
  description = 'Official guide on what happens during your LTB hearing and how to present your case',
  duration_seconds = 310
WHERE pathway_type = 'ltb' AND step_number = 4;

-- Update Small Claims tutorial videos
UPDATE tutorial_videos 
SET 
  video_url = 'https://www.youtube.com/embed/-M_p6-6d_48',
  thumbnail_url = 'https://img.youtube.com/vi/-M_p6-6d_48/maxresdefault.jpg',
  title = 'How to File a Statement of Claim in Ontario',
  description = 'Complete guide to filing your statement of claim in Small Claims Court',
  duration_seconds = 420
WHERE pathway_type = 'small-claims' AND step_number = 1;

-- Update HRTO tutorial videos
UPDATE tutorial_videos 
SET 
  video_url = 'https://www.youtube.com/embed/eZt0_SZ8dCw',
  thumbnail_url = 'https://img.youtube.com/vi/eZt0_SZ8dCw/maxresdefault.jpg',
  title = 'Filing an HRTO Application - Complete Guide',
  description = 'Step-by-step tutorial on filing your Human Rights Tribunal application',
  duration_seconds = 540
WHERE pathway_type = 'hrto' AND step_number = 2;

UPDATE tutorial_videos 
SET 
  video_url = 'https://www.youtube.com/embed/ePFvRSP-HQw',
  thumbnail_url = 'https://img.youtube.com/vi/ePFvRSP-HQw/maxresdefault.jpg',
  title = 'Steps in Family Law Proceedings - Background',
  description = 'Ontario family lawyer explains the main stages in a family proceeding',
  duration_seconds = 480
WHERE pathway_type = 'hrto' AND step_number = 1;

-- Add new proper tutorial videos
INSERT INTO tutorial_videos (
  title, 
  description, 
  video_url, 
  thumbnail_url, 
  category, 
  pathway_type, 
  step_number, 
  duration_seconds,
  is_active,
  view_count
) VALUES 
(
  'LTB Portal Navigation Guide',
  'Learn how to navigate the Landlord and Tenant Board online portal',
  'https://www.youtube.com/embed/TeBw_F2ngaM',
  'https://img.youtube.com/vi/TeBw_F2ngaM/maxresdefault.jpg',
  'Form Completion',
  'ltb',
  2,
  423,
  true,
  0
),
(
  'Steps in Family Law: Starting and Responding',
  'How to start and respond to family law proceedings in Ontario',
  'https://www.youtube.com/embed/PdNzobC2nfU',
  'https://img.youtube.com/vi/PdNzobC2nfU/maxresdefault.jpg',
  'Getting Started',
  'family',
  1,
  540,
  true,
  0
),
(
  'Completing Form 22 - Request to Admit',
  'Step-by-step guide to completing Form 22 for family court',
  'https://www.youtube.com/embed/XFIuhcGiT78',
  'https://img.youtube.com/vi/XFIuhcGiT78/maxresdefault.jpg',
  'Form Completion',
  'family',
  2,
  360,
  true,
  0
)
ON CONFLICT DO NOTHING;