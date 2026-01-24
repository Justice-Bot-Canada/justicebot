import * as Sentry from '@sentry/react';

export function initSentry() {
  // Only initialize in production with a valid DSN
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  
  if (import.meta.env.PROD && dsn) {
    Sentry.init({
      dsn,
      environment: 'production',
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
      ],
      // Performance monitoring sample rate
      tracesSampleRate: 0.1,
      // Session replay for errors
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      // Don't send PII
      beforeSend(event) {
        // Scrub any email addresses from error messages
        if (event.message) {
          event.message = event.message.replace(/[^\s@]+@[^\s@]+\.[^\s@]+/g, '[EMAIL]');
        }
        return event;
      },
    });
    console.log('[Sentry] Initialized in production mode');
  } else if (import.meta.env.DEV) {
    console.log('[Sentry] Skipped initialization in development mode');
  }
}

export { Sentry };
