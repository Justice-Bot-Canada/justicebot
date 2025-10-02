import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import { SkipToContent, useFocusManagement, useKeyboardNavigation } from "@/components/AccessibilityFeatures";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import PathwayDecision from "./pages/PathwayDecision";
import CaseAssessment from "./pages/CaseAssessment";
import Pricing from "./pages/Pricing";
import Admin from "./pages/Admin";
import LowIncomeApproval from "./pages/LowIncomeApproval";
import Privacy from "./pages/Privacy";
import Liability from "./pages/Liability";
import Terms from "./pages/Terms";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import NotFound from "./pages/NotFound";
import Welcome from "./pages/Welcome";
import Triage from "./pages/Triage";
import FormSelector from "./pages/FormSelector";
import FormBuilder from "./pages/FormBuilder";
import TribunalLocatorPage from "./pages/TribunalLocatorPage";
import Profile from "./pages/Profile";
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
import LegalChat from "./pages/LegalChat";
import DocumentAnalysis from "./pages/DocumentAnalysis";
import TutorialLibrary from "./pages/TutorialLibrary";
import TemplateLibrary from "./pages/TemplateLibrary";
import Referrals from "./pages/Referrals";
import ErrorBoundary from "./components/ErrorBoundary";
import LiveSupportWidget from "./components/LiveSupportWidget";
import Disclaimer from "./pages/Disclaimer";
import About from "./pages/About";
import Troubleshooting from "./pages/Troubleshooting";
import MediaInquiries from "./pages/MediaInquiries";
import GovernmentInquiries from "./pages/GovernmentInquiries";
import LegalUpdates from "./pages/LegalUpdates";
import CourtInformation from "./pages/CourtInformation";
import Explain from "./pages/Explain";
import Evidence from "./pages/Evidence";

const queryClient = new QueryClient();

const AppContent = () => {
  useFocusManagement();
  useKeyboardNavigation();
  
  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <PerformanceMonitor />
        <SkipToContent />
        <LiveSupportWidget />
      <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/hrto-help" element={<HRTOHelp />} />
          <Route path="/ltb-help" element={<LTBHelp />} />
          <Route path="/small-claims-court" element={<SmallClaimsCourt />} />
        <Route path="/hrto-journey" element={<HRTOJourney />} />
        <Route path="/ltb-journey" element={<LTBJourney />} />
        <Route path="/small-claims-journey" element={<SmallClaimsJourney />} />
        <Route path="/criminal-journey" element={<CriminalJourney />} />
        <Route path="/family-journey" element={<FamilyJourney />} />
        <Route path="/superior-court-journey" element={<SuperiorCourtJourney />} />
        <Route path="/accountability-journey" element={<AccountabilityJourney />} />
          <Route path="/accountability/:province/:type" element={<ProvincialAccountabilityJourney />} />
          <Route path="/police-accountability-journey" element={<PoliceAccountabilityJourney />} />
          <Route path="/cas-journey" element={<CASJourney />} />
          <Route path="/labour-journey" element={<LabourBoardJourney />} />
          <Route path="/immigration-journey" element={<ImmigrationJourney />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/assessment" element={<ProtectedRoute><CaseAssessment /></ProtectedRoute>} />
          <Route path="/pathway/:caseId" element={<ProtectedRoute><PathwayDecision /></ProtectedRoute>} />
          <Route path="/triage" element={<Triage />} />
          <Route path="/tribunal-locator" element={<TribunalLocatorPage />} />
          <Route path="/forms/:venue" element={<ProtectedRoute><FormSelector /></ProtectedRoute>} />
          <Route path="/form/:formId" element={<ProtectedRoute><FormBuilder /></ProtectedRoute>} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="/low-income" element={<ProtectedRoute><LowIncomeApproval /></ProtectedRoute>} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/liability" element={<Liability />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
          <Route path="/payment-cancel" element={<ProtectedRoute><PaymentCancel /></ProtectedRoute>} />
          <Route path="/legal-chat" element={<LegalChat />} />
          <Route path="/document-analysis" element={<ProtectedRoute><DocumentAnalysis /></ProtectedRoute>} />
          <Route path="/tutorials" element={<TutorialLibrary />} />
          <Route path="/templates" element={<TemplateLibrary />} />
          <Route path="/referrals" element={<ProtectedRoute><Referrals /></ProtectedRoute>} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/about" element={<About />} />
          <Route path="/troubleshooting" element={<Troubleshooting />} />
          <Route path="/media-inquiries" element={<MediaInquiries />} />
          <Route path="/government-inquiries" element={<GovernmentInquiries />} />
          <Route path="/legal-updates" element={<LegalUpdates />} />
          <Route path="/court" element={<CourtInformation />} />
          <Route path="/explain" element={<Explain />} />
          <Route path="/evidence" element={<ProtectedRoute><Evidence /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
