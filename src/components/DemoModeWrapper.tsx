import { useDemoMode } from "@/hooks/useDemoMode";
import DemoJourney from "@/pages/DemoJourney";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface DemoModeWrapperProps {
  children: React.ReactNode;
}

/**
 * Wrapper component that redirects to demo journey when in demo mode
 * Only allows certain public routes in demo mode
 */
const DemoModeWrapper = ({ children }: DemoModeWrapperProps) => {
  const { isDemoMode } = useDemoMode();
  const location = useLocation();
  const navigate = useNavigate();

  // Routes allowed in demo mode
  const allowedDemoRoutes = [
    "/",
    "/demo-journey",
    "/about",
    "/faq",
    "/contact",
    "/privacy",
    "/terms",
    "/disclaimer",
    "/accessibility",
    "/complaint-process",
    "/case-demo",
  ];

  useEffect(() => {
    if (isDemoMode) {
      // Check if current path starts with any allowed route
      const isAllowed = allowedDemoRoutes.some(route => 
        location.pathname === route || 
        location.pathname.startsWith(route + "/")
      );
      
      // Redirect to demo journey if not on an allowed route
      if (!isAllowed) {
        navigate("/demo-journey", { replace: true });
      }
    }
  }, [isDemoMode, location.pathname, navigate]);

  // In demo mode, if we're on the home page, show demo journey instead
  if (isDemoMode && location.pathname === "/") {
    return <DemoJourney />;
  }

  return <>{children}</>;
};

export default DemoModeWrapper;
