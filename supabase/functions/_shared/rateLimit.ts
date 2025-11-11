// Shared rate limiting utility for edge functions
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 60000, // 1 minute
  maxRequests: 20,
};

export function checkRateLimit(
  ip: string, 
  config: RateLimitConfig = DEFAULT_CONFIG
): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { 
      count: 1, 
      resetTime: now + config.windowMs 
    });
    return true;
  }
  
  if (record.count >= config.maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
}

export function getRateLimitResponse(corsHeaders: Record<string, string>): Response {
  return new Response(
    JSON.stringify({ 
      error: 'Rate limit exceeded. Please try again later.' 
    }), 
    {
      status: 429,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}
