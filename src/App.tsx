import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assessment" element={<CaseAssessment />} />
          <Route path="/triage" element={<Triage />} />
          <Route path="/tribunal-locator" element={<TribunalLocatorPage />} />
          <Route path="/forms/:venue" element={<FormSelector />} />
          <Route path="/form/:formId" element={<FormBuilder />} />
          <Route path="/pricing" element={<Pricing />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/low-income" element={<LowIncomeApproval />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/liability" element={<Liability />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancel" element={<PaymentCancel />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
