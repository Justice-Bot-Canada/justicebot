import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Calculator, 
  FileSearch, 
  ClipboardCheck, 
  Scale, 
  ArrowRight,
  Calendar,
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { trackEvent } from "@/utils/analytics";

interface Tool {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  href: string;
  badge?: string;
  instant?: boolean;
}

const tools: Tool[] = [
  {
    id: "deadline",
    title: "Deadline Calculator",
    description: "Calculate key filing deadlines based on your situation",
    icon: Calendar,
    color: "from-blue-500 to-blue-600",
    href: "/triage",
    badge: "Popular",
    instant: true
  },
  {
    id: "form-finder",
    title: "Form Finder",
    description: "Find exactly which forms you need for your case type",
    icon: FileSearch,
    color: "from-purple-500 to-purple-600",
    href: "/forms",
    instant: true
  },
  {
    id: "checklist",
    title: "Document Checklist",
    description: "Get a personalized checklist of documents to gather",
    icon: ClipboardCheck,
    color: "from-green-500 to-green-600",
    href: "/triage",
    instant: true
  },
  {
    id: "settlement",
    title: "Settlement Estimator",
    description: "Estimate potential settlement ranges for your case",
    icon: DollarSign,
    color: "from-amber-500 to-amber-600",
    href: "/settlement-calculator",
    badge: "New"
  }
];

// Quick deadline presets
const deadlinePresets = [
  { label: "N4 Eviction Notice", days: 14, description: "Response deadline" },
  { label: "N12 Notice", days: 60, description: "Landlord's own use" },
  { label: "LTB T2 Filing", days: 365, description: "Within 1 year of issue" },
  { label: "HRTO Application", days: 365, description: "Within 1 year" },
  { label: "Small Claims", days: 730, description: "2-year limitation" },
];

const QuickToolsSection = () => {
  const navigate = useNavigate();
  const [selectedDeadline, setSelectedDeadline] = useState<number | null>(null);
  const [incidentDate, setIncidentDate] = useState("");
  const [calculatedDeadline, setCalculatedDeadline] = useState<Date | null>(null);

  const handleToolClick = (tool: Tool) => {
    trackEvent('tool_click', { tool_id: tool.id, tool_name: tool.title });
    navigate(tool.href);
  };

  const calculateDeadline = () => {
    if (!incidentDate || selectedDeadline === null) return;
    
    const incident = new Date(incidentDate);
    const deadline = new Date(incident);
    deadline.setDate(deadline.getDate() + deadlinePresets[selectedDeadline].days);
    setCalculatedDeadline(deadline);
    
    trackEvent('deadline_calculated', { 
      preset: deadlinePresets[selectedDeadline].label,
      days: deadlinePresets[selectedDeadline].days
    });
  };

  const getDaysRemaining = () => {
    if (!calculatedDeadline) return null;
    const today = new Date();
    const diff = Math.ceil((calculatedDeadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const daysRemaining = getDaysRemaining();

  return (
    <section className="py-16 bg-gradient-to-b from-muted/30 via-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-primary border-primary/30">
            <Sparkles className="w-3 h-3 mr-1" />
            Free Tools
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Quick Legal Tools
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get instant answers. No signup required for these free tools.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card 
                key={tool.id}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/30 overflow-hidden"
                onClick={() => handleToolClick(tool)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    {tool.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {tool.badge}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg mt-4 group-hover:text-primary transition-colors">
                    {tool.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center text-sm text-primary font-medium group-hover:gap-2 transition-all">
                    {tool.instant && (
                      <Clock className="w-3 h-3 mr-1" />
                    )}
                    <span>Use Now</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Inline Deadline Calculator */}
        <Card className="max-w-4xl mx-auto bg-gradient-to-br from-card to-muted/30 border-2">
          <CardHeader className="text-center pb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Calculator className="w-7 h-7 text-white" />
            </div>
            <CardTitle className="text-2xl">Quick Deadline Calculator</CardTitle>
            <CardDescription>
              Select your situation and incident date to see your deadline
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Preset Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">What type of deadline?</Label>
              <div className="flex flex-wrap gap-2">
                {deadlinePresets.map((preset, index) => (
                  <Button
                    key={index}
                    variant={selectedDeadline === index ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDeadline(index)}
                    className="text-sm"
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
              {selectedDeadline !== null && (
                <p className="text-xs text-muted-foreground">
                  {deadlinePresets[selectedDeadline].description} — {deadlinePresets[selectedDeadline].days} days from incident
                </p>
              )}
            </div>

            {/* Date Input */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="incident-date">When did it happen?</Label>
                <Input
                  id="incident-date"
                  type="date"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={calculateDeadline}
                  disabled={!incidentDate || selectedDeadline === null}
                  className="w-full"
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculate Deadline
                </Button>
              </div>
            </div>

            {/* Result */}
            {calculatedDeadline && (
              <div className={`p-6 rounded-xl ${daysRemaining && daysRemaining < 30 ? 'bg-destructive/10 border-destructive/30' : daysRemaining && daysRemaining < 90 ? 'bg-warning/10 border-warning/30' : 'bg-success/10 border-success/30'} border-2`}>
                <div className="flex items-start gap-4">
                  {daysRemaining && daysRemaining < 30 ? (
                    <AlertTriangle className="w-8 h-8 text-destructive flex-shrink-0" />
                  ) : (
                    <CheckCircle className="w-8 h-8 text-success flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="font-bold text-lg mb-1">
                      Your Deadline: {calculatedDeadline.toLocaleDateString('en-CA', { 
                        weekday: 'long',
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className={`text-sm ${daysRemaining && daysRemaining < 30 ? 'text-destructive font-semibold' : 'text-muted-foreground'}`}>
                      {daysRemaining && daysRemaining > 0 
                        ? `${daysRemaining} days remaining`
                        : daysRemaining === 0 
                          ? "Deadline is TODAY!"
                          : `Deadline passed ${Math.abs(daysRemaining || 0)} days ago`
                      }
                    </p>
                    {daysRemaining && daysRemaining < 30 && daysRemaining > 0 && (
                      <p className="text-sm text-destructive mt-2 font-medium">
                        ⚠️ Urgent: Start your application immediately
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border/50">
                  <Button variant="cta" onClick={() => navigate('/triage')} className="w-full sm:w-auto">
                    Start My Application Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default QuickToolsSection;
