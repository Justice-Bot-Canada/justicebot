// ❌ Temporary stub to replace Sonner toast calls
// These do nothing but allow the code to compile
export const toast = {
  success: (...args: any[]) => console.log('[toast.success]', ...args),
  error: (...args: any[]) => console.error('[toast.error]', ...args),
  info: (...args: any[]) => console.info('[toast.info]', ...args),
  warning: (...args: any[]) => console.warn('[toast.warning]', ...args),
  promise: (...args: any[]) => console.log('[toast.promise]', ...args),
  loading: (...args: any[]) => console.log('[toast.loading]', ...args),
};
