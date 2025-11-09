import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Skip Navigation Link Component
export const SkipToContent = () => {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        tabIndex={0}
      >
        Skip to main content
      </a>
      <a
        href="#main-navigation"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-36 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        tabIndex={0}
      >
        Skip to navigation
      </a>
      <a
        href="#footer"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-64 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        tabIndex={0}
      >
        Skip to footer
      </a>
    </>
  );
};

// Focus management hook
export const useFocusManagement = () => {
  useEffect(() => {
    const handleRouteChange = () => {
      // Announce route changes to screen readers
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.focus({ preventScroll: true });
      }
    };

    // Listen for navigation changes
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);
};

// Keyboard navigation enhancement hook
export const useKeyboardNavigation = () => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape key closes modals/dropdowns
      if (event.key === 'Escape') {
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement?.getAttribute('role') === 'dialog') {
          activeElement.blur();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
};

// Announce changes to screen readers
export const LiveRegion = ({ message, level = 'polite' }: { 
  message: string; 
  level?: 'polite' | 'assertive' | 'off' 
}) => {
  return (
    <div
      aria-live={level}
      aria-atomic="true"
      className="sr-only"
      role="status"
    >
      {message}
    </div>
  );
};

// High contrast mode toggle
export const HighContrastToggle = () => {
  const [highContrast, setHighContrast] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check for saved preference
    const saved = localStorage.getItem('highContrast');
    if (saved === 'true') {
      setHighContrast(true);
      document.documentElement.classList.add('high-contrast');
    }
  }, []);

  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    
    if (newValue) {
      document.documentElement.classList.add('high-contrast');
      localStorage.setItem('highContrast', 'true');
      toast({
        title: "High contrast mode enabled",
        description: "Interface colors have been adjusted for better visibility.",
      });
    } else {
      document.documentElement.classList.remove('high-contrast');
      localStorage.setItem('highContrast', 'false');
      toast({
        title: "High contrast mode disabled",
        description: "Interface returned to normal colors.",
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleHighContrast}
      aria-label={`${highContrast ? 'Disable' : 'Enable'} high contrast mode`}
      className="text-xs"
    >
      {highContrast ? '🌙' : '☀️'} Contrast
    </Button>
  );
};

// Screen reader only text component
export const ScreenReaderOnly = ({ children }: { children: React.ReactNode }) => {
  return <span className="sr-only">{children}</span>;
};