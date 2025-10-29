-- Fix legal-docs storage bucket security - Make bucket private
UPDATE storage.buckets 
SET public = false 
WHERE name = 'legal-docs';