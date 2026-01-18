import { useMemo } from "react";

/**
 * Hook to detect if the app is running in demo mode
 * Demo mode is active when accessing via demo.justice-bot.com
 */
export const useDemoMode = () => {
  const isDemoMode = useMemo(() => {
    const hostname = window.location.hostname;
    return hostname === "demo.justice-bot.com" || hostname.startsWith("demo.");
  }, []);

  return { isDemoMode };
};

/**
 * Check if demo mode is active (non-hook version for use outside components)
 */
export const isDemoModeActive = (): boolean => {
  const hostname = window.location.hostname;
  return hostname === "demo.justice-bot.com" || hostname.startsWith("demo.");
};
