import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, MapPin, ListChecks, Clock, Download, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { trackEvent } from "@/utils/analytics";

interface UpgradeCardProps {
  venue?: string;
  className?: string;
}

export default function UpgradeCard({ venue, className }: UpgradeCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    trackEvent('begin_checkout', { product: 'legal_path_report', price: 5.99 });
    navigate('/legal-path-report');
  };

  return (
    <Card className={`border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-primary/20 shrink-0">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold">Get your Legal Path Report</h3>
            <p className="text-2xl font-bold text-primary mt-1">$5.99</p>
            
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary shrink-0" />
                Form + filing location
              </li>
              <li className="flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-primary shrink-0" />
                Evidence checklist
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary shrink-0" />
                Next steps + timelines
              </li>
              <li className="flex items-center gap-2">
                <Download className="h-4 w-4 text-primary shrink-0" />
                Downloadable PDF
              </li>
            </ul>

            <Button 
              onClick={handleClick}
              className="w-full mt-4 h-11"
              variant="cta"
            >
              Get the report
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
