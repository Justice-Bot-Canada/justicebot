/**
 * Shared CORS headers for all Edge Functions
 * 
 * Security: Only allow production domain and localhost for development
 * This fixes the inconsistent CORS issue flagged in due diligence.
 */

const ALLOWED_ORIGINS = [
  'https://justice-bot.com',
  'https://www.justice-bot.com',
  'http://localhost:8080',
  'http://localhost:5173',
];

export function getCorsHeaders(requestOrigin?: string | null): Record<string, string> {
  // Check if the request origin is in our allowed list
  const origin = requestOrigin && ALLOWED_ORIGINS.includes(requestOrigin) 
    ? requestOrigin 
    : ALLOWED_ORIGINS[0]; // Default to production

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Max-Age': '86400',
  };
}

// For backward compatibility - use this when migrating functions gradually
export const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://justice-bot.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};
