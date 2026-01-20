import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowRight, 
  MessageCircle, 
  Building2, 
  FileText, 
  CheckCircle,
  Loader2,
  HelpCircle,
  Scale,
  Users,
  Home,
  Briefcase,
  Heart,
  Gavel,
  Shield
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { analytics, trackEvent } from "@/utils/analytics";
import AuthDialog from "@/components/AuthDialog";
import { supabase } from "@/integrations/supabase/client";

// Issue types with icons
const ISSUE_TYPES = [
  { id: "housing", label: "Housing / Landlord Issues", icon: Home, examples: "Eviction, repairs, rent disputes" },
  { id: "human-rights", label: "Human Rights / Discrimination", icon: Users, examples: "Workplace, housing, services" },
  { id: "employment", label: "Employment / Labour", icon: Briefcase, examples: "Termination, wages, harassment" },
  { id: "family", label: "Family Law", icon: Heart, examples: "Divorce, custody, support" },
  { id: "civil", label: "Money / Civil Dispute", icon: Scale, examples: "Debt, contracts, small claims" },
  { id: "criminal", label: "Criminal / Police Matter", icon: Gavel, examples: "Charges, complaints, records" },
  { id: "unsure", label: "I'm not sure yet", icon: HelpCircle, examples: "That's okay — we'll figure it out" },
];

// Province mapping
const PROVINCES = [
  { code: "ON", name: "Ontario" },
  { code: "BC", name: "British Columbia" },
  { code: "AB", name: "Alberta" },
  { code: "QC", name: "Quebec" },
  { code: "MB", name: "Manitoba" },
  { code: "SK", name: "Saskatchewan" },
  { code: "NS", name: "Nova Scotia" },
  { code: "NB", name: "New Brunswick" },
  { code: "NL", name: "Newfoundland and Labrador" },
  { code: "PE", name: "Prince Edward Island" },
  { code: "NT", name: "Northwest Territories" },
  { code: "NU", name: "Nunavut" },
  { code: "YT", name: "Yukon" },
];

// Tribunal/form recommendations based on issue type and province
const RECOMMENDATIONS: Record<string, { 
  tribunal: string; 
  tribunalFull: string;
  forms: string[]; 
  description: string;
  nextSteps: string[];
}> = {
  "housing-ON": {
    tribunal: "LTB",
    tribunalFull: "Landlord and Tenant Board",
    forms: ["T2", "T6", "A1"],
    description: "Ontario's tribunal for residential tenancy disputes. Handles evictions, maintenance issues, and rent disputes.",
    nextSteps: ["Gather relevant documents (lease, notices, photos)", "Review the appropriate application form", "Prepare a timeline of events"],
  },
  "human-rights-ON": {
    tribunal: "HRTO",
    tribunalFull: "Human Rights Tribunal of Ontario",
    forms: ["Form 1"],
    description: "Handles discrimination complaints related to housing, employment, or services in Ontario.",
    nextSteps: ["Document the discriminatory incidents", "Identify the grounds of discrimination", "Prepare a chronology of events"],
  },
  "employment-ON": {
    tribunal: "OLRB",
    tribunalFull: "Ontario Labour Relations Board",
    forms: ["Application for Certification"],
    description: "Handles employment standards, labour relations, and workplace disputes.",
    nextSteps: ["Gather employment records", "Review employment contract", "Document workplace incidents"],
  },
  "family-ON": {
    tribunal: "Family Court",
    tribunalFull: "Ontario Court of Justice - Family Court",
    forms: ["Form 8", "Form 13", "Form 14"],
    description: "Handles divorce, custody, access, and support matters.",
    nextSteps: ["Gather financial documents", "Document custody arrangements", "Consider mediation options"],
  },
  "civil-ON": {
    tribunal: "Small Claims",
    tribunalFull: "Small Claims Court",
    forms: ["Plaintiff's Claim", "Defence"],
    description: "Handles civil disputes up to $35,000 in Ontario.",
    nextSteps: ["Calculate your claim amount", "Gather contracts and receipts", "Identify the correct defendant"],
  },
  "criminal-ON": {
    tribunal: "Criminal Court",
    tribunalFull: "Ontario Court of Justice",
    forms: ["Varies by matter"],
    description: "Handles criminal charges and police complaints.",
    nextSteps: ["Obtain disclosure from Crown", "Consider legal aid options", "Document your version of events"],
  },
  // Default for unsure or other provinces
  "default": {
    tribunal: "Multiple Options",
    tribunalFull: "Several pathways may apply",
    forms: ["We'll identify these for you"],
    description: "Based on your specific situation, there may be multiple legal pathways available.",
    nextSteps: ["Describe your situation in detail", "Upload relevant documents", "We'll analyze and recommend"],
  },
};

interface ChatMessage {
  id: string;
  type: "bot" | "user" | "options" | "result" | "signup";
  content: string;
  options?: typeof ISSUE_TYPES | typeof PROVINCES;
  result?: typeof RECOMMENDATIONS["default"];
  timestamp: Date;
}

export default function ConversationalOnboarding() {
  const navigate = useNavigate();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [briefDescription, setBriefDescription] = useState("");
  const [showDescriptionInput, setShowDescriptionInput] = useState(false);
  const hasInitialized = useRef(false);
  
  // Initialize conversation (only once)
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    startConversation();
    trackEvent("onboarding_started", { type: "conversational" });
  }, []);

  // Scroll within chat container only (not the whole page)
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const addBotMessage = (content: string, delay = 800) => {
    return new Promise<void>((resolve) => {
      setIsTyping(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), type: "bot", content, timestamp: new Date() },
        ]);
        setIsTyping(false);
        resolve();
      }, delay);
    });
  };

  const addOptionsMessage = (content: string, options: typeof ISSUE_TYPES | typeof PROVINCES, delay = 400) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), type: "options", content, options, timestamp: new Date() },
        ]);
        resolve();
      }, delay);
    });
  };

  const addResultMessage = (result: typeof RECOMMENDATIONS["default"], delay = 600) => {
    return new Promise<void>((resolve) => {
      setIsTyping(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), type: "result", content: "", result, timestamp: new Date() },
        ]);
        setIsTyping(false);
        resolve();
      }, delay);
    });
  };

  const addSignupPrompt = (delay = 800) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), type: "signup", content: "", timestamp: new Date() },
        ]);
        resolve();
      }, delay);
    });
  };

  const startConversation = async () => {
    // Welcome message with reassurance
    await addBotMessage("Hi! I'm here to help you understand what legal options may be available to you. 👋", 500);
    await addBotMessage("You're not filing anything right now — this is just to help you get oriented.", 1000);
    await addBotMessage("What type of issue are you dealing with?", 800);
    await addOptionsMessage("", ISSUE_TYPES, 400);
    setCurrentStep(1);
  };

  const handleIssueSelect = async (issueId: string) => {
    const issue = ISSUE_TYPES.find((i) => i.id === issueId);
    if (!issue) return;

    setSelectedIssue(issueId);
    trackEvent("onboarding_issue_selected", { issue: issueId });

    // Add user's selection as a message
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), type: "user", content: issue.label, timestamp: new Date() },
    ]);

    // Ask for province
    await addBotMessage("Thanks! And which province or territory are you in?", 600);
    await addOptionsMessage("", PROVINCES, 400);
    setCurrentStep(2);
  };

  const handleProvinceSelect = async (provinceCode: string) => {
    const province = PROVINCES.find((p) => p.code === provinceCode);
    if (!province) return;

    setSelectedProvince(provinceCode);
    trackEvent("onboarding_province_selected", { province: provinceCode });

    // Add user's selection
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), type: "user", content: province.name, timestamp: new Date() },
    ]);

    // Brief optional context question
    await addBotMessage("Got it! Is there anything specific you'd like to share about your situation? (Optional)", 600);
    setShowDescriptionInput(true);
    setCurrentStep(3);
  };

  const handleDescriptionSubmit = async () => {
    setShowDescriptionInput(false);
    
    if (briefDescription.trim()) {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), type: "user", content: briefDescription, timestamp: new Date() },
      ]);
    }

    trackEvent("onboarding_description_provided", { 
      has_description: !!briefDescription.trim(),
      issue: selectedIssue,
      province: selectedProvince 
    });

    // Show analyzing state
    await addBotMessage("Let me look up what may apply to your situation...", 500);
    
    // Get recommendation
    const key = `${selectedIssue}-${selectedProvince}`;
    const recommendation = RECOMMENDATIONS[key] || RECOMMENDATIONS["default"];

    // Show result
    await addResultMessage(recommendation, 1200);
    
    // Show signup prompt
    await addBotMessage("This is a preview of what may be relevant. To continue and save your progress:", 800);
    await addSignupPrompt(400);
    setCurrentStep(4);
  };

  const handleSkipDescription = async () => {
    setBriefDescription("");
    await handleDescriptionSubmit();
  };

  const handleContinueWithoutAccount = () => {
    trackEvent("onboarding_continue_anonymous", { issue: selectedIssue, province: selectedProvince });
    // Store selections in sessionStorage for later
    sessionStorage.setItem("onboarding_issue", selectedIssue || "");
    sessionStorage.setItem("onboarding_province", selectedProvince || "");
    navigate("/upload");
  };

  const handleCreateAccount = () => {
    trackEvent("onboarding_signup_clicked", { issue: selectedIssue, province: selectedProvince });
    // Store selections
    sessionStorage.setItem("onboarding_issue", selectedIssue || "");
    sessionStorage.setItem("onboarding_province", selectedProvince || "");
    setShowAuthDialog(true);
  };

  const progress = (currentStep / 4) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Getting oriented</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Chat Container */}
      <Card className="border-2 border-primary/10">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-4 border-b bg-muted/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-sm">Justice-Bot Guide</h2>
              <p className="text-xs text-muted-foreground">Legal information assistant</p>
            </div>
          </div>

          {/* Chat Messages */}
          <div ref={chatContainerRef} className="p-4 space-y-4 min-h-[400px] max-h-[500px] overflow-y-auto">
            {messages.map((message) => (
              <div key={message.id}>
                {message.type === "bot" && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Scale className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-muted rounded-lg rounded-tl-none p-3 max-w-[85%]">
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                )}

                {message.type === "user" && (
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-lg rounded-tr-none p-3 max-w-[85%]">
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                )}

                {message.type === "options" && message.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {message.options.map((option: any) => {
                      const Icon = option.icon || Building2;
                      const isIssueType = "examples" in option;
                      return (
                        <Button
                          key={option.id || option.code}
                          variant="outline"
                          className="h-auto py-3 px-4 justify-start text-left hover:border-primary hover:bg-primary/5"
                          onClick={() => 
                            isIssueType 
                              ? handleIssueSelect(option.id) 
                              : handleProvinceSelect(option.code)
                          }
                        >
                          {isIssueType && <Icon className="h-4 w-4 mr-3 flex-shrink-0 text-muted-foreground" />}
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium block truncate">
                              {option.label || option.name}
                            </span>
                            {isIssueType && option.examples && (
                              <span className="text-xs text-muted-foreground block truncate">
                                {option.examples}
                              </span>
                            )}
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                )}

                {message.type === "result" && message.result && (
                  <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-4 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <Badge variant="secondary" className="mb-2">
                          May Apply
                        </Badge>
                        <h3 className="font-semibold text-lg">{message.result.tribunalFull}</h3>
                        <p className="text-sm text-muted-foreground">{message.result.tribunal}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm">{message.result.description}</p>
                    
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        Common forms used:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {message.result.forms.map((form, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {form}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Typical next steps:
                      </p>
                      <ul className="text-xs space-y-1">
                        {message.result.nextSteps.map((step, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {message.type === "signup" && (
                  <div className="bg-muted/50 border rounded-lg p-4 space-y-4">
                    <div className="space-y-3">
                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={handleCreateAccount}
                      >
                        Create Free Account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full text-muted-foreground"
                        onClick={handleContinueWithoutAccount}
                      >
                        Continue without account
                      </Button>
                    </div>
                    <div className="text-xs text-center text-muted-foreground space-y-1">
                      <p>Creating an account lets you:</p>
                      <ul className="space-y-0.5">
                        <li>✓ Save your answers and progress</li>
                        <li>✓ Access detailed form explanations</li>
                        <li>✓ Get step-by-step guidance</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Scale className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-muted rounded-lg rounded-tl-none p-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            {/* Description input */}
            {showDescriptionInput && (
              <div className="space-y-3">
                <Input
                  placeholder="e.g., My landlord hasn't fixed the heating..."
                  value={briefDescription}
                  onChange={(e) => setBriefDescription(e.target.value)}
                  className="text-sm"
                />
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={handleDescriptionSubmit}
                    disabled={!briefDescription.trim()}
                  >
                    Continue
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={handleSkipDescription}
                  >
                    Skip for now
                  </Button>
                </div>
              </div>
            )}

            
          </div>

          {/* Legal Disclaimer */}
          <div className="p-3 border-t bg-muted/20">
            <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
              <Shield className="h-3 w-3" />
              This tool provides legal information, not legal advice or representation.
            </p>
          </div>
        </CardContent>
      </Card>

      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </div>
  );
}
