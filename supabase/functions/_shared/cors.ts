/**
 * Shared CORS headers for all Edge Functions
 * 
 * Security: Only allow production domain by default.
 * Localhost origins are only included when ALLOW_LOCALHOST env var is set.
 */

const PRODUCTION_ORIGINS = [
  'https://justice-bot.com',
  'https://www.justice-bot.com',
];

const LOCALHOST_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:5173',
];

// Only include localhost in development environments
const ALLOWED_ORIGINS = Deno.env.get('ALLOW_LOCALHOST') === 'true'
  ? [...PRODUCTION_ORIGINS, ...LOCALHOST_ORIGINS]
  : PRODUCTION_ORIGINS;

export function getCorsHeaders(requestOrigin?: string | null): Record<string, string> {
  // Check if the request origin is in our allowed list
  const origin = requestOrigin && ALLOWED_ORIGINS.includes(requestOrigin) 
    ? requestOrigin 
    : PRODUCTION_ORIGINS[0]; // Default to production

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
