-- Add two new LTB tutorial videos
INSERT INTO tutorial_videos (title, description, video_url, thumbnail_url, pathway_type, category, step_number, is_active)
VALUES 
  (
    'Maintenance Issues under the Ontario Residential Tenancies Act',
    'Understanding your rights and obligations regarding maintenance issues as a tenant or landlord in Ontario',
    'https://www.youtube.com/embed/7op2vW-T48Q',
    'https://i.ytimg.com/vi/7op2vW-T48Q/maxresdefault.jpg',
    'ltb',
    'Tenant Rights',
    6,
    true
  ),
  (
    'Navigation of the Landlord and Tenant Board Online Portal',
    'Step-by-step guide to navigating and using the LTB online portal effectively',
    'https://www.youtube.com/embed/TeBw_F2ngaM',
    'https://i.ytimg.com/vi/TeBw_F2ngaM/maxresdefault.jpg',
    'ltb',
    'How To',
    7,
    true
  );;
