/**
 * Security Audit Logging Utility
 * SOC2-compliant audit trail for sensitive operations
 */

import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

export type AuditAction = 
  // Document operations
  | 'document.generated'
  | 'document.downloaded'
  | 'document.deleted'
  // Evidence operations
  | 'evidence.uploaded'
  | 'evidence.analyzed'
  | 'evidence.deleted'
  // Case operations
  | 'case.created'
  | 'case.updated'
  | 'case.deleted'
  | 'case.triage_completed'
  // Authentication events
  | 'auth.signup'
  | 'auth.login'
  | 'auth.logout'
  | 'auth.password_reset'
  | 'auth.password_changed'
  // Payment events
  | 'payment.initiated'
  | 'payment.completed'
  | 'payment.failed'
  | 'payment.refunded'
  // Entitlement events
  | 'entitlement.granted'
  | 'entitlement.revoked'
  | 'entitlement.expired'
  // Admin operations
  | 'admin.grant_access'
  | 'admin.revoke_access'
  | 'admin.user_lookup'
  // AI operations
  | 'ai.analysis_requested'
  | 'ai.chat_message'
  // Data access
  | 'data.export'
  | 'data.bulk_query';

export type ResourceType = 
  | 'document'
  | 'evidence'
  | 'case'
  | 'user'
  | 'payment'
  | 'entitlement'
  | 'form'
  | 'analysis';

interface AuditLogEntry {
  action: AuditAction;
  resource_type: ResourceType;
  resource_id?: string | null;
  user_id?: string | null;
  ip_address?: string | null;
  user_agent?: string | null;
  metadata?: Record<string, unknown>;
}

/**
 * Get client IP from request headers
 */
export function getClientIp(req: Request): string | null {
  // Check common headers for client IP
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  
  const cfConnectingIp = req.headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  
  return null;
}

/**
 * Create an audit log entry in the database
 */
export async function logAuditEvent(
  supabaseClient: SupabaseClient,
  entry: AuditLogEntry,
  req?: Request
): Promise<void> {
  try {
    const ip_address = req ? getClientIp(req) : null;
    const user_agent = req?.headers.get('user-agent') || null;

    const { error } = await supabaseClient
      .from('security_audit_log')
      .insert({
        action: entry.action,
        resource_type: entry.resource_type,
        resource_id: entry.resource_id || null,
        user_id: entry.user_id || null,
        ip_address,
        user_agent,
        metadata: entry.metadata || {},
      });

    if (error) {
      console.error('[AUDIT_LOG] Failed to write audit log:', error.message);
    } else {
      console.log('[AUDIT_LOG]', {
        action: entry.action,
        resource_type: entry.resource_type,
        resource_id: entry.resource_id,
        user_id: entry.user_id ? entry.user_id.substring(0, 8) + '...' : null,
      });
    }
  } catch (err) {
    // Never let audit logging failures break the main flow
    console.error('[AUDIT_LOG] Exception in audit logging:', err);
  }
}

/**
 * Create a service-role Supabase client for audit logging
 * Use this when you need to log events without user context
 */
export function createAuditClient(): SupabaseClient {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );
}

/**
 * Helper to mask sensitive data for logging
 */
export function maskSensitive(value: string, visibleChars: number = 4): string {
  if (!value || value.length <= visibleChars) {
    return '***';
  }
  return value.substring(0, visibleChars) + '***';
}

/**
 * Hash email for privacy-preserving logging
 */
export async function hashEmail(email: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(email.toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join('');
}
