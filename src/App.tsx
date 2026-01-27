import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";

import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";

import {
  SkipToContent,
  useFocusManagement,
  useKeyboardNavigation,
} from "@/components/AccessibilityFeatures";
import { CanonicalURL } from "@/components/CanonicalURL";
import { KlaviyoTracking } from "@/components/KlaviyoTracking";
import { useAnalytics } from "@/hooks/useAnalytics";
import { ConsentProvider } from "@/hooks/useConsent";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { ProgramProvider } from "@/contexts/ProgramContext";
import DemoModeWrapper from "@/components/DemoModeWrapper";
import DemoModeBanner from "@/components/DemoModeBanner";
import LiveSupportWidget from "./components/LiveSupportWidget";

/* =======================
   Core Pages
======================= */
import Index from "./pages/Index";
import Welcome from "./pages/Welcome";
import NotFound from "./pages/NotFound";
import Triage from "./pages/Triage";
import Case from "./pages/Case";
import Forms from "./pages/Forms";
import Callback from "./pages/Callback";
import FormSelector from "./pages/FormSelector";

/* =======================
   Admin Pages (lazy)
======================= */
const Admin = lazy(() => import("./pages/Admin"));
const AdminFormsSync = lazy(() => import("./pages/AdminFormsSync"));
const AdminTestimonials = lazy(() => import("./pages/AdminTestimonials"));
const AdminProgramDashboard = lazy(() => import("./pages/AdminProgramDashboard"));
import AdminFormSources from "./pages/AdminFormSources";

/* =======================
   Lazy Pages
======================= */
const Dashboard = lazy(() => import("./pages/Dashboard"));

/* =======================
   Loading
======================= */
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <p>Loading…</p>
  </div>
);

/* =======================
   React Query
======================= */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

/* =======================
   App Content
======================= */
const AppContent = () => {
  useFocusManagement();
  useKeyboardNavigation();
  useAnalytics();

  return (
    <ErrorBoundary>
      <DemoModeWrapper>
        <div className="min-h-screen">
          <DemoModeBanner />
          <CanonicalURL />
          <SkipToContent />
          <LiveSupportWidget />
          <KlaviyoTracking />

          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route path="/welcome" element={<Welcome />} />

            {/* Supabase email verification callback (PUBLIC) */}
            <Route path="/auth/callback" element={<Callback />} />

            {/* Core flow */}
            <Route path="/triage" element={<Triage />} />
            <Route path="/case/:caseId" element={<Case />} />

            {/* Forms */}
            <Route path="/forms" element={<Forms />} />
            <Route
              path="/forms/:venue"
              element={
                <ProtectedRoute>
                  <FormSelector />
                </ProtectedRoute>
              }
            />

            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <Dashboard />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            {/* Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <Admin />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/forms-sync"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <AdminFormsSync />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/forms"
              element={
                <ProtectedRoute>
                  <AdminFormSources />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/testimonials"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <AdminTestimonials />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/programs"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <AdminProgramDashboard />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </DemoModeWrapper>
    </ErrorBoundary>
  );
};

/* =======================
   App Wrapper
======================= */
const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <ConsentProvider>
            <ProgramProvider>
              <AppContent />
              <CookieConsentBanner />
            </ProgramProvider>
          </ConsentProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
