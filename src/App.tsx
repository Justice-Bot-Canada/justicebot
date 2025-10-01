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
import LegalChat from "./pages/LegalChat";
import DocumentAnalysis from "./pages/DocumentAnalysis";
import TutorialLibrary from "./pages/TutorialLibrary";
import TemplateLibrary from "./pages/TemplateLibrary";
import Referrals from "./pages/Referrals";
import ErrorBoundary from "./components/ErrorBoundary";
import LiveSupportWidget from "./components/LiveSupportWidget";

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
          <Route path="/hrto-help" element={<HRTOHelp />} />
          <Route path="/ltb-help" element={<LTBHelp />} />
          <Route path="/small-claims-court" element={<SmallClaimsCourt />} />
        <Route path="/hrto-journey" element={<HRTOJourney />} />
        <Route path="/ltb-journey" element={<LTBJourney />} />
        <Route path="/small-claims-journey" element={<SmallClaimsJourney />} />
        <Route path="/criminal-journey" element={<CriminalJourney />} />
        <Route path="/family-journey" element={<FamilyJourney />} />
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
