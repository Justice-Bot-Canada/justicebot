/**
 * Application-level rate limiter using Supabase database
 * Works with the rate_limits table to track request counts per key
 */

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

/**
 * Check and update rate limit for a given key
 * @param supabase - Supabase client with service role
 * @param key - Unique identifier for rate limiting (e.g., "submit-lead:ip:1.2.3.4")
 * @param limit - Maximum allowed requests in the window
 * @param windowMs - Time window in milliseconds
 * @returns RateLimitResult with allowed status and remaining requests
 */
export async function checkRateLimit(
  supabase: any,
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStart = new Date(now - windowMs);
  const resetAt = new Date(now + windowMs);

  try {
    // Try to get existing rate limit entry
    const { data: existing, error: fetchError } = await supabase
      .from('rate_limits')
      .select('count, updated_at')
      .eq('key', key)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 is "no rows returned" - other errors should be logged
      console.error('Rate limit fetch error:', fetchError);
      // Allow request on error to avoid blocking legitimate users
      return { allowed: true, remaining: limit - 1, resetAt };
    }

    // If entry exists and is within the window
    if (existing && new Date(existing.updated_at) > windowStart) {
      if (existing.count >= limit) {
        return {
          allowed: false,
          remaining: 0,
          resetAt: new Date(new Date(existing.updated_at).getTime() + windowMs)
        };
      }

      // Increment count
      const { error: updateError } = await supabase
        .from('rate_limits')
        .update({
          count: existing.count + 1,
          updated_at: new Date().toISOString()
        })
        .eq('key', key);

      if (updateError) {
        console.error('Rate limit update error:', updateError);
      }

      return {
        allowed: true,
        remaining: limit - existing.count - 1,
        resetAt
      };
    }

    // No entry or expired - create new one
    const { error: upsertError } = await supabase
      .from('rate_limits')
      .upsert({
        key,
        count: 1,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });

    if (upsertError) {
      console.error('Rate limit upsert error:', upsertError);
    }

    return {
      allowed: true,
      remaining: limit - 1,
      resetAt
    };
  } catch (error) {
    console.error('Rate limit check error:', error);
    // Allow on error to avoid blocking legitimate users
    return { allowed: true, remaining: limit - 1, resetAt };
  }
}

/**
 * Get client IP from request headers (works with Cloudflare)
 */
export function getClientIP(req: Request): string {
  return req.headers.get('cf-connecting-ip') ||
         req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
         req.headers.get('x-real-ip') ||
         'unknown';
}

/**
 * Create a rate limit key for IP-based limiting
 */
export function createIPKey(functionName: string, ip: string): string {
  return `${functionName}:ip:${ip}`;
}

/**
 * Create a rate limit key for user-based limiting
 */
export function createUserKey(functionName: string, userId: string): string {
  return `${functionName}:user:${userId}`;
}

/**
 * Create a daily rate limit key for quotas
 */
export function createDailyKey(functionName: string, identifier: string): string {
  const today = new Date().toISOString().split('T')[0];
  return `${functionName}:daily:${identifier}:${today}`;
}

/**
 * Standard rate limit response
 */
export function rateLimitResponse(corsHeaders: Record<string, string>, resetAt: Date): Response {
  return new Response(
    JSON.stringify({
      error: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil((resetAt.getTime() - Date.now()) / 1000)
    }),
    {
      status: 429,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Retry-After': Math.ceil((resetAt.getTime() - Date.now()) / 1000).toString()
      }
    }
  );
}
