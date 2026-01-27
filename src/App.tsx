import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
   Route Pages (non-lazy)
   NOTE: keep these imports if they exist in your project.
======================= */
import ProgramLanding from "./pages/ProgramLanding";
import LowIncomeApproval from "./pages/LowIncomeApproval";
import PaymentSuccess from "./pages/PaymentSuccess";
import UnlockSuccess from "./pages/UnlockSuccess";
import DocumentsReady from "./pages/DocumentsReady";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import ThankYou from "./pages/ThankYou";
import HRTOHelp from "./pages/HRTOHelp";
import LTBHelp from "./pages/LTBHelp";
import SmallClaimsCourt from "./pages/SmallClaimsCourt";

/* =======================
   Admin / Other Pages (lazy)
======================= */
const Admin = lazy(() => import("./pages/Admin"));
const AdminFormsSync = lazy(() => import("./pages/AdminFormsSync"));
const AdminTestimonials = lazy(() => import("./pages/AdminTestimonials"));
const AdminProgramDashboard = lazy(() => import("./pages/AdminProgramDashboard"));
const AdminForms = lazy(() => import("./pages/AdminForms"));
const AdminKPI = lazy(() => import("./pages/AdminKPI"));
const DocumentsUnlocked = lazy(() => import("./pages/DocumentsUnlocked"));
const CaseWorkspacePage = lazy(() => import("./pages/CaseWorkspacePage"));

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
              path="/admin/forms"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <AdminForms />
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
            <Route
              path="/admin/kpi"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <AdminKPI />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            {/* Program Pilot Routes */}
            <Route
              path="/program/:slug"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <ProgramLanding />
                </Suspense>
              }
            />

            {/* Payment & Subscription */}
            <Route
              path="/low-income"
              element={
                <ProtectedRoute>
                  <LowIncomeApproval />
                </ProtectedRoute>
              }
            />
            <Route path="/low-income-approval" element={<Navigate to="/low-income" replace />} />
            <Route path="/court-information" element={<Navigate to="/court" replace />} />
            <Route
              path="/payment-success"
              element={
                <ProtectedRoute>
                  <PaymentSuccess />
                </ProtectedRoute>
              }
            />
            <Route path="/unlock-success" element={<UnlockSuccess />} />
            <Route
              path="/case/:caseId/next-steps"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <DocumentsUnlocked />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route path="/documents-unlocked" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/case/:caseId/documents-ready"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <DocumentsReady />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/subscription-success"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <SubscriptionSuccess />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment-cancel"
              element={
                <ProtectedRoute>
                  <PaymentCancel />
                </ProtectedRoute>
              }
            />
            <Route path="/thank-you" element={<ThankYou />} />

            {/* Legacy/Deprecated routes - kept for backwards compatibility */}
            <Route path="/hrto-help" element={<HRTOHelp />} />
            <Route path="/ltb-help" element={<LTBHelp />} />
            <Route path="/small-claims-court" element={<SmallClaimsCourt />} />

            {/* Redirects for crawled legacy URLs - prevents 404s in Google Search Console */}
            <Route path="/download" element={<Navigate to="/templates" replace />} />
            <Route path="/docs" element={<Navigate to="/legal-resources" replace />} />
            <Route path="/docs/*" element={<Navigate to="/legal-resources" replace />} />
            <Route path="/signup" element={<Navigate to="/welcome" replace />} />
            <Route path="/login" element={<Navigate to="/welcome" replace />} />
            <Route path="/generate" element={<Navigate to="/forms" replace />} />
            <Route path="/small-claims" element={<Navigate to="/small-claims-journey" replace />} />
            <Route path="/auth" element={<Navigate to="/welcome" replace />} />

            {/* Legacy city pages - Ontario cities redirect to LTB pages */}
            <Route path="/legal-help-toronto" element={<Navigate to="/ltb-toronto" replace />} />
            <Route path="/legal-help-ottawa" element={<Navigate to="/ltb-ottawa" replace />} />
            <Route path="/legal-help-mississauga" element={<Navigate to="/ltb-mississauga" replace />} />
            <Route path="/legal-help-brampton" element={<Navigate to="/ltb-brampton" replace />} />
            <Route path="/legal-help-hamilton" element={<Navigate to="/ltb-hamilton" replace />} />
            <Route path="/legal-help-london" element={<Navigate to="/ltb-london" replace />} />
            <Route path="/legal-help-markham" element={<Navigate to="/ltb-markham" replace />} />
            <Route path="/legal-help-vaughan" element={<Navigate to="/ltb-vaughan" replace />} />
            <Route path="/legal-help-kitchener" element={<Navigate to="/ltb-kitchener" replace />} />
            <Route path="/legal-help-windsor" element={<Navigate to="/ltb-windsor" replace />} />

            {/* Non-Ontario cities redirect to triage */}
            <Route path="/legal-help-edmonton" element={<Navigate to="/triage" replace />} />
            <Route path="/legal-help-vancouver" element={<Navigate to="/triage" replace />} />
            <Route path="/legal-help-calgary" element={<Navigate to="/triage" replace />} />
            <Route path="/legal-help-montreal" element={<Navigate to="/triage" replace />} />
            <Route path="/legal-help-winnipeg" element={<Navigate to="/triage" replace />} />

            {/* 404 Catch-all */}
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
