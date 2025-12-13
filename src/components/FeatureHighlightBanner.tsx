import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Shield, 
  Scale, 
  FileText, 
  Sparkles,
  RefreshCw
} from "lucide-react";

const highlights = [
  {
    icon: Brain,
    title: "AI Case Law Search",
    description: "Searches CanLII daily for relevant precedents",
  },
  {
    icon: Scale,
    title: "Smart Merit Calculator",
    description: "AI analyzes your case strength with real case law",
  },
  {
    icon: FileText,
    title: "75+ Official Forms",
    description: "Pre-filled with AI for LTB, HRTO, Family & more",
  },
  {
    icon: Shield,
    title: "Bank-Level Security",
    description: "Encrypted data with strict access controls",
  },
  {
    icon: RefreshCw,
    title: "Auto-Updated Daily",
    description: "Sweeps for new laws and case updates automatically",
  },
  {
    icon: Sparkles,
    title: "Evidence Analysis",
    description: "OCR scanning extracts key facts from your documents",
  },
];

const FeatureHighlightBanner = () => {
  return (
    <section className="py-12 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-y border-primary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <Badge variant="default" className="mb-3">
            <Sparkles className="w-3 h-3 mr-1" />
            Powered by AI
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold">
            Legal Tools That Actually Work
          </h2>
          <p className="text-muted-foreground mt-2">
            The same research power lawyers use — now accessible to everyone
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className="flex flex-col items-center text-center p-4 rounded-xl bg-background/50 hover:bg-background transition-colors border border-border/50"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlightBanner;
