-- Add multiple tutorial videos from user request
INSERT INTO tutorial_videos (
  title,
  description,
  video_url,
  category,
  pathway_type,
  step_number,
  is_active
) VALUES
(
  'Small Claims Court Hearing Tips',
  'Essential tips and strategies for your small claims court hearing in Ontario.',
  'https://www.youtube.com/embed/rAPiS8ybMaE',
  'Court Process',
  'small-claims',
  3,
  true
),
(
  'Gathering Evidence for Your LTB Case',
  'Learn how to gather and organize evidence for your Landlord and Tenant Board case.',
  'https://www.youtube.com/embed/zosFPJGZuc8',
  'Evidence',
  'ltb',
  1,
  true
),
(
  'Overview of Trial in Small Claims Court, Ontario',
  'Complete overview of what to expect during a trial in Small Claims Court in Ontario.',
  'https://www.youtube.com/embed/jiWsMIyK-2Q',
  'Court Process',
  'small-claims',
  4,
  true
),
(
  'Tips on Opening Statements',
  'How to craft and deliver effective opening statements in Small Claims Court.',
  'https://www.youtube.com/embed/A2aob1yfAPM',
  'Court Process',
  'small-claims',
  5,
  true
),
(
  'Evidence in Small Claims',
  'Understanding evidence rules and requirements for Small Claims Court in Ontario.',
  'https://www.youtube.com/embed/yU5RsTwv0N0',
  'Evidence',
  'small-claims',
  6,
  true
);;
