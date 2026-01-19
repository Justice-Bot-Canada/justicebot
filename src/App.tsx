import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Suspense, lazy } from "react";
import { SkipToContent, useFocusManagement, useKeyboardNavigation } from "@/components/AccessibilityFeatures";
import { KlaviyoTracking } from "@/components/KlaviyoTracking";
import { useAnalytics } from "@/hooks/useAnalytics";
import { CanonicalURL } from "@/components/CanonicalURL";
import { ConsentProvider } from "@/hooks/useConsent";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { ProgramProvider } from "@/contexts/ProgramContext";
import DemoModeWrapper from "@/components/DemoModeWrapper";
import DemoModeBanner from "@/components/DemoModeBanner";
import Index from "./pages/Index";
import PathwayDecision from "./pages/PathwayDecision";
import Pricing from "./pages/Pricing";
import LowIncomeApproval from "./pages/LowIncomeApproval";
import Privacy from "./pages/Privacy";
import Liability from "./pages/Liability";
import Terms from "./pages/Terms";
import PaymentSuccess from "./pages/PaymentSuccess";
import UnlockSuccess from "./pages/UnlockSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import ThankYou from "./pages/ThankYou";
import NotFound from "./pages/NotFound";
import Welcome from "./pages/Welcome";
import ResetPassword from "./pages/ResetPassword";
import Triage from "./pages/Triage";
import FormSelector from "./pages/FormSelector";
import Forms from "./pages/Forms";
import TribunalLocatorPage from "./pages/TribunalLocatorPage";
import ProtectedRoute from "./components/ProtectedRoute";
import HRTOHelp from "./pages/HRTOHelp";
import LTBHelp from "./pages/LTBHelp";
import SmallClaimsCourt from "./pages/SmallClaimsCourt";
import Contact from "./pages/Contact";
import Feedback from "./pages/Feedback";
import HRTOJourney from "./pages/HRTOJourney";
import LTBJourney from "./pages/LTBJourney";
import SmallClaimsJourney from "./pages/SmallClaimsJourney";
import CriminalJourney from "./pages/CriminalJourney";
import FamilyJourney from "./pages/FamilyJourney";
import SuperiorCourtJourney from "./pages/SuperiorCourtJourney";
import PoliceAccountabilityJourney from "./pages/PoliceAccountabilityJourney";
import CASJourney from "./pages/CASJourney";
import LabourBoardJourney from "./pages/LabourBoardJourney";
import ImmigrationJourney from "./pages/ImmigrationJourney";
import AccountabilityJourney from "./pages/AccountabilityJourney";
import ProvincialAccountabilityJourney from "./pages/ProvincialAccountabilityJourney";
import ErrorBoundary from "./components/ErrorBoundary";
import LiveSupportWidget from "./components/LiveSupportWidget";
import Disclaimer from "./pages/Disclaimer";
import UserTerms from "./pages/UserTerms";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import WhatWeDo from "./pages/WhatWeDo";
import Partners from "./pages/Partners";
import Clinics from "./pages/Clinics";
import Team from "./pages/Team";
import Blog from "./pages/Blog";
import BlogList from "./pages/BlogList";
import OntarioSmallClaimsCourt2025 from "./pages/blog/OntarioSmallClaimsCourt2025";
import Scope from "./pages/Scope";
import Accessibility from "./pages/Accessibility";
import PaymentPolicy from "./pages/PaymentPolicy";
import ComplaintProcess from "./pages/ComplaintProcess";
import Roadmap from "./pages/Roadmap";
import Troubleshooting from "./pages/Troubleshooting";
import MediaInquiries from "./pages/MediaInquiries";
import Press from "./pages/Press";
import GovernmentInquiries from "./pages/GovernmentInquiries";
import LegalUpdates from "./pages/LegalUpdates";
import CourtInformation from "./pages/CourtInformation";
import Explain from "./pages/Explain";
import LegalResources from "./pages/LegalResources";
import Journey from "./pages/Journey";
import CriminalCourtGuide from "./pages/CriminalCourtGuide";
import CriminalCourtMistakes from "./pages/CriminalCourtMistakes";
import DemoJourney from "./pages/DemoJourney";
import UrgentTriage from "./pages/UrgentTriage";
import FindMyPath from "./pages/FindMyPath";
import UploadFirst from "./pages/UploadFirst";
import Upload from "./pages/Upload";
import ExplainMyOptions from "./pages/ExplainMyOptions";
import Intake from "./pages/Intake";
import IntakeSummary from "./pages/IntakeSummary";
import Funnel from "./pages/Funnel";
import CaseDemo from "./pages/CaseDemo";
import TenantRightsGuide from "./pages/TenantRightsGuide";
import FamilyLawGuide from "./pages/FamilyLawGuide";
import HumanRightsGuide from "./pages/HumanRightsGuide";
import LTBT2FormGuide from "./pages/LTBT2FormGuide";
import LTBToronto from "./pages/LTBToronto";
import HowToFileT2Ontario from "./pages/HowToFileT2Ontario";
import TenantRightsRepairsNotDone from "./pages/TenantRightsRepairsNotDone";
import TenantRightsHarassment from "./pages/TenantRightsHarassment";
import TenantRightsUnsafeHousing from "./pages/TenantRightsUnsafeHousing";
import TenantRightsPrivacyViolations from "./pages/TenantRightsPrivacyViolations";
import HowToFileT6Ontario from "./pages/HowToFileT6Ontario";
import HowToFightN4Eviction from "./pages/HowToFightN4Eviction";
import HRTOToronto from "./pages/HRTOToronto";
import HRTOOttawa from "./pages/HRTOOttawa";
import LTBCityPage from "./pages/LTBCityPage";
const LegalPathReportPage = lazy(() => import("./pages/LegalPathReportPage"));
// Lazy load heavy components
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminFormsSync = lazy(() => import("./pages/AdminFormsSync"));
const AdminTestimonials = lazy(() => import("./pages/AdminTestimonials"));
const DocumentAnalysis = lazy(() => import("./pages/DocumentAnalysis"));
const FormBuilder = lazy(() => import("./pages/FormBuilder"));
const CaseAssessment = lazy(() => import("./pages/CaseAssessment"));
const Profile = lazy(() => import("./pages/Profile"));
const Evidence = lazy(() => import("./pages/Evidence"));
const LegalChat = lazy(() => import("./pages/LegalChat"));
const TutorialLibrary = lazy(() => import("./pages/TutorialLibrary"));
const TemplateLibrary = lazy(() => import("./pages/TemplateLibrary"));
const Referrals = lazy(() => import("./pages/Referrals"));
import Referral from "./pages/Referral";
const SmartDocuments = lazy(() => import("./pages/SmartDocuments"));
const CaseTimeline = lazy(() => import("./pages/CaseTimeline"));
const DocumentDrafter = lazy(() => import("./pages/DocumentDrafter"));
const DocumentsReady = lazy(() => import("./pages/DocumentsReady"));
const CaseStrengthAnalyzer = lazy(() => import("./pages/CaseStrengthAnalyzer"));
const SettlementCalculator = lazy(() => import("./pages/SettlementCalculator"));
const SubscriptionSuccess = lazy(() => import("./pages/SubscriptionSuccess"));
const FeatureGuide = lazy(() => import("./pages/FeatureGuide"));
const ProgramLanding = lazy(() => import("./pages/ProgramLanding"));
const AdminProgramDashboard = lazy(() => import("./pages/AdminProgramDashboard"));
const DocumentsUnlocked = lazy(() => import("./pages/DocumentsUnlocked"));
const CaseWorkspacePage = lazy(() => import("./pages/CaseWorkspacePage"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Initialize QueryClient outside component to avoid re-creation
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

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
          {/* Main Landing & Getting Started */}
          <Route path="/" element={<Index />} />
          <Route path="/demo-journey" element={<DemoJourney />} />
          <Route path="/demo" element={<DemoJourney />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/intake" element={<Intake />} />
          <Route path="/intake/summary" element={<IntakeSummary />} />
          <Route path="/funnel" element={<Funnel />} />
          <Route path="/triage" element={<Triage />} />
          <Route path="/urgent-triage" element={<UrgentTriage />} />
          <Route path="/find-my-path" element={<FindMyPath />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/upload-first" element={<UploadFirst />} />
          <Route path="/explain-my-options" element={<ExplainMyOptions />} />
          <Route path="/case-demo" element={<CaseDemo />} />
          <Route path="/case-demo/:caseType" element={<CaseDemo />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/legal-path-report" element={<Suspense fallback={<LoadingFallback />}><LegalPathReportPage /></Suspense>} />

          {/* Legal Journey Pathways */}
          <Route path="/hrto-journey" element={<HRTOJourney />} />
          <Route path="/ltb-journey" element={<LTBJourney />} />
          <Route path="/small-claims-journey" element={<SmallClaimsJourney />} />
          <Route path="/criminal-journey" element={<CriminalJourney />} />
          <Route path="/family-journey" element={<FamilyJourney />} />
          <Route path="/superior-court-journey" element={<SuperiorCourtJourney />} />
          <Route path="/cas-journey" element={<CASJourney />} />
          <Route path="/labour-journey" element={<LabourBoardJourney />} />
          <Route path="/immigration-journey" element={<ImmigrationJourney />} />
          <Route path="/accountability-journey" element={<AccountabilityJourney />} />
          <Route path="/accountability/:province/:type" element={<ProvincialAccountabilityJourney />} />
          <Route path="/police-accountability-journey" element={<PoliceAccountabilityJourney />} />

          {/* Tools & Services (Protected) */}
          <Route path="/dashboard" element={<ProtectedRoute><Suspense fallback={<LoadingFallback />}><Dashboard /></Suspense></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Suspense fallback={<LoadingFallback />}><Profile /></Suspense></ProtectedRoute>} />
          <Route path="/legal-chat" element={<Suspense fallback={<LoadingFallback />}><LegalChat /></Suspense>} />
          <Route path="/document-analysis" element={<ProtectedRoute><Suspense fallback={<LoadingFallback />}><DocumentAnalysis /></Suspense></ProtectedRoute>} />
          <Route path="/document-drafter" element={<ProtectedRoute><Suspense fallback={<LoadingFallback />}><DocumentDrafter /></Suspense></ProtectedRoute>} />
          <Route path="/smart-documents" element={<ProtectedRoute><Suspense fallback={<LoadingFallback />}><SmartDocuments /></Suspense></ProtectedRoute>} />
          <Route path="/evidence" element={<ProtectedRoute><Suspense fallback={<LoadingFallback />}><Evidence /></Suspense></ProtectedRoute>} />
          <Route path="/case-timeline" element={<ProtectedRoute><Suspense fallback={<LoadingFallback />}><CaseTimeline /></Suspense></ProtectedRoute>} />
          <Route path="/case-strength" element={<ProtectedRoute><Suspense fallback={<LoadingFallback />}><CaseStrengthAnalyzer /></Suspense></ProtectedRoute>} />
          <Route path="/assessment" element={<ProtectedRoute><Suspense fallback={<LoadingFallback />}><CaseAssessment /></Suspense></ProtectedRoute>} />
          <Route path="/settlement-calculator" element={<ProtectedRoute><Suspense fallback={<LoadingFallback />}><SettlementCalculator /></Suspense></ProtectedRoute>} />
          <Route path="/pathway/:caseId" element={<ProtectedRoute><PathwayDecision /></ProtectedRoute>} />
          <Route path="/case-workspace/:caseId" element={<ProtectedRoute><Suspense fallback={<LoadingFallback />}><CaseWorkspacePage /></Suspense></ProtectedRoute>} />

          {/* Forms Management */}
          <Route path="/forms" element={<Forms />} />
          <Route path="/forms/:venue" element={<ProtectedRoute><FormSelector /></ProtectedRoute>} />
          <Route path="/form/:formId" element={<ProtectedRoute><Suspense fallback={<LoadingFallback />}><FormBuilder /></Suspense></ProtectedRoute>} />

          {/* Resources & Learning */}
          <Route path="/tutorials" element={<Suspense fallback={<LoadingFallback />}><TutorialLibrary /></Suspense>} />
          <Route path="/templates" element={<Suspense fallback={<LoadingFallback />}><TemplateLibrary /></Suspense>} />
          <Route path="/legal-resources" element={<LegalResources />} />
          <Route path="/features" element={<Suspense fallback={<LoadingFallback />}><FeatureGuide /></Suspense>} />
          <Route path="/criminal-court-guide" element={<CriminalCourtGuide />} />
          <Route path="/criminal-court-mistakes" element={<CriminalCourtMistakes />} />
          <Route path="/tribunal-locator" element={<TribunalLocatorPage />} />
          <Route path="/court" element={<CourtInformation />} />
          <Route path="/explain" element={<Explain />} />
          
          {/* SEO Pillar & Cluster Pages */}
          <Route path="/tenant-rights-ontario-guide" element={<TenantRightsGuide />} />
          <Route path="/family-law-ontario-guide" element={<FamilyLawGuide />} />
          <Route path="/human-rights-ontario-guide" element={<HumanRightsGuide />} />
          <Route path="/ltb-t2-form-guide" element={<LTBT2FormGuide />} />
          <Route path="/ltb-toronto" element={<LTBToronto />} />
          <Route path="/how-to-file-t2-ontario" element={<HowToFileT2Ontario />} />
          <Route path="/tenant-rights-repairs-not-done" element={<TenantRightsRepairsNotDone />} />
          <Route path="/tenant-rights-harassment-by-landlord" element={<TenantRightsHarassment />} />
          <Route path="/tenant-rights-unsafe-housing" element={<TenantRightsUnsafeHousing />} />
          <Route path="/tenant-rights-privacy-violations" element={<TenantRightsPrivacyViolations />} />
          <Route path="/how-to-file-t6-ontario" element={<HowToFileT6Ontario />} />
          <Route path="/how-to-fight-n4-eviction-ontario" element={<HowToFightN4Eviction />} />
          <Route path="/hrto-toronto" element={<HRTOToronto />} />
          <Route path="/hrto-ottawa" element={<HRTOOttawa />} />
          
          {/* City-specific LTB Pages */}
          <Route path="/ltb-ottawa" element={<LTBCityPage />} />
          <Route path="/ltb-mississauga" element={<LTBCityPage />} />
          <Route path="/ltb-hamilton" element={<LTBCityPage />} />
          <Route path="/ltb-brampton" element={<LTBCityPage />} />
          <Route path="/ltb-london" element={<LTBCityPage />} />
          <Route path="/ltb-kitchener" element={<LTBCityPage />} />
          <Route path="/ltb-windsor" element={<LTBCityPage />} />
          <Route path="/ltb-markham" element={<LTBCityPage />} />
          <Route path="/ltb-vaughan" element={<LTBCityPage />} />
          <Route path="/ltb-oakville" element={<LTBCityPage />} />
          <Route path="/ltb-burlington" element={<LTBCityPage />} />
          <Route path="/ltb-oshawa" element={<LTBCityPage />} />
          <Route path="/ltb-barrie" element={<LTBCityPage />} />
          <Route path="/ltb-guelph" element={<LTBCityPage />} />
          <Route path="/ltb-cambridge" element={<LTBCityPage />} />
          <Route path="/ltb-whitby" element={<LTBCityPage />} />
          <Route path="/ltb-ajax" element={<LTBCityPage />} />
          <Route path="/ltb-richmond-hill" element={<LTBCityPage />} />
          <Route path="/ltb-sudbury" element={<LTBCityPage />} />

          <Route path="/about" element={<About />} />
          <Route path="/team" element={<Team />} />
          <Route path="/scope" element={<Scope />} />
          <Route path="/what-we-do" element={<WhatWeDo />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/ontario-small-claims-court-2025" element={<OntarioSmallClaimsCourt2025 />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/troubleshooting" element={<Troubleshooting />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/clinics" element={<Clinics />} />
          <Route path="/referrals" element={<ProtectedRoute><Suspense fallback={<LoadingFallback />}><Referrals /></Suspense></ProtectedRoute>} />
          <Route path="/referral" element={<Referral />} />
          <Route path="/media-inquiries" element={<MediaInquiries />} />
          <Route path="/press" element={<Press />} />
          <Route path="/government-inquiries" element={<GovernmentInquiries />} />
          <Route path="/government" element={<GovernmentInquiries />} />
          <Route path="/legal-updates" element={<LegalUpdates />} />

          {/* Legal & Policies */}
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/user-terms" element={<UserTerms />} />
          <Route path="/liability" element={<Liability />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/payment-policy" element={<PaymentPolicy />} />
          <Route path="/accessibility" element={<Accessibility />} />
          <Route path="/complaint-process" element={<ComplaintProcess />} />

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute><Suspense fallback={<LoadingFallback />}><Admin /></Suspense></ProtectedRoute>} />
          <Route path="/admin/forms-sync" element={<ProtectedRoute><Suspense fallback={<LoadingFallback />}><AdminFormsSync /></Suspense></ProtectedRoute>} />
          <Route path="/admin/testimonials" element={<ProtectedRoute><Suspense fallback={<LoadingFallback />}><AdminTestimonials /></Suspense></ProtectedRoute>} />
          <Route path="/admin/programs" element={<ProtectedRoute><Suspense fallback={<LoadingFallback />}><AdminProgramDashboard /></Suspense></ProtectedRoute>} />

          {/* Program Pilot Routes */}
          <Route path="/program/:slug" element={<Suspense fallback={<LoadingFallback />}><ProgramLanding /></Suspense>} />

          {/* Payment & Subscription */}
          <Route path="/low-income" element={<ProtectedRoute><LowIncomeApproval /></ProtectedRoute>} />
          <Route path="/low-income-approval" element={<Navigate to="/low-income" replace />} />
          <Route path="/court-information" element={<Navigate to="/court" replace />} />
          <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
          <Route path="/unlock-success" element={<UnlockSuccess />} />
          <Route path="/case/:caseId/next-steps" element={<ProtectedRoute><Suspense fallback={<LoadingFallback />}><DocumentsUnlocked /></Suspense></ProtectedRoute>} />
          <Route path="/documents-unlocked" element={<Navigate to="/dashboard" replace />} />
          <Route path="/case/:caseId/documents-ready" element={<ProtectedRoute><Suspense fallback={<LoadingFallback />}><DocumentsReady /></Suspense></ProtectedRoute>} />
          <Route path="/subscription-success" element={<ProtectedRoute><Suspense fallback={<LoadingFallback />}><SubscriptionSuccess /></Suspense></ProtectedRoute>} />
          <Route path="/payment-cancel" element={<ProtectedRoute><PaymentCancel /></ProtectedRoute>} />
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
