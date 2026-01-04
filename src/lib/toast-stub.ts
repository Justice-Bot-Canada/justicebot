// ❌ Temporary stub to replace Sonner toast calls
// These do nothing but allow the code to compile
export const toast = {
  success: (...args: unknown[]) => console.log('[toast.success]', ...args),
  error: (...args: unknown[]) => console.error('[toast.error]', ...args),
  info: (...args: unknown[]) => console.info('[toast.info]', ...args),
  warning: (...args: unknown[]) => console.warn('[toast.warning]', ...args),
  promise: (...args: unknown[]) => console.log('[toast.promise]', ...args),
  loading: (...args: unknown[]) => console.log('[toast.loading]', ...args),
};
