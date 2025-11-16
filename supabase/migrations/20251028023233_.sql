-- Remove L1 application video
DELETE FROM tutorial_videos 
WHERE title = 'L1 Application Process' 
  OR title LIKE '%L1 Application%';;
