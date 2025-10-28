-- Update HRTO mediation (step 4) to T2/T6 application filing
UPDATE tutorial_videos 
SET 
  title = 'Filing HRTO Applications - T1, T2, and Other Forms',
  description = 'Complete guide to filing Human Rights Tribunal applications including T1, T2, and other forms',
  video_url = 'https://www.youtube.com/embed/dv698nUv8EU',
  thumbnail_url = 'https://img.youtube.com/vi/dv698nUv8EU/maxresdefault.jpg',
  duration_seconds = 1800
WHERE pathway_type = 'hrto' AND step_number = 4;

-- Update HRTO step 3 to building discrimination case
UPDATE tutorial_videos 
SET 
  title = 'Building a Discrimination Case - 5 Things to Know',
  description = 'Learn the 5 essential things you need to know before filing a human rights application in Ontario',
  video_url = 'https://www.youtube.com/embed/aMCB5e-1wyE',
  thumbnail_url = 'https://img.youtube.com/vi/aMCB5e-1wyE/maxresdefault.jpg',
  duration_seconds = 900
WHERE pathway_type = 'hrto' AND step_number = 3;

-- Add small claims hearing tips
INSERT INTO tutorial_videos (
  pathway_type, step_number, title, description, video_url, thumbnail_url, category, duration_seconds, is_active, view_count
) VALUES (
  'small-claims', 5, 
  'Small Claims Court Hearing Tips - Evidence Presentation',
  'Deputy Judge Janis Criger provides expert tips on presenting evidence in Small Claims Court',
  'https://www.youtube.com/embed/yU5RsTwv0N0',
  'https://img.youtube.com/vi/yU5RsTwv0N0/maxresdefault.jpg',
  'Hearing Preparation', 780, true, 0
);

-- Add legal rights and responsibilities video
INSERT INTO tutorial_videos (
  pathway_type, step_number, title, description, video_url, thumbnail_url, category, duration_seconds, is_active, view_count
) VALUES (
  'general', 1,
  'Employment Rights - Know Your Legal Rights in Ontario',
  'Understand your legal rights and responsibilities under Ontario Employment Standards Act',
  'https://www.youtube.com/embed/68zJgtBCxsk',
  'https://img.youtube.com/vi/68zJgtBCxsk/maxresdefault.jpg',
  'Getting Started', 600, true, 0
);

-- Add Ontario Human Rights System Explained
INSERT INTO tutorial_videos (
  pathway_type, step_number, title, description, video_url, thumbnail_url, category, duration_seconds, is_active, view_count
) VALUES (
  'hrto', 5,
  'Ontario Human Rights System Explained',
  'Comprehensive explanation of Ontario Human Rights Code and organizations',
  'https://www.youtube.com/embed/Zz11M26NK0I',
  'https://img.youtube.com/vi/Zz11M26NK0I/maxresdefault.jpg',
  'Getting Started', 480, true, 0
);