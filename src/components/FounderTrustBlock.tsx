import { Card, CardContent } from "@/components/ui/card";
import { Shield, Heart, Users } from "lucide-react";

const FounderTrustBlock = () => {
  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Founder message */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Why we built this</h3>
            </div>
            
            <blockquote className="text-muted-foreground border-l-2 border-primary/30 pl-4">
              "I watched family members struggle with legal forms they didn't understand, 
              facing deadlines they didn't know existed. Lawyers were too expensive. 
              Legal aid was overwhelmed. So I built Justice-Bot — to give everyone 
              the same fighting chance."
            </blockquote>
            
            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">The Justice-Bot Team</p>
                <p className="text-xs text-muted-foreground">Toronto, Ontario</p>
              </div>
            </div>
          </div>

          {/* Trust signals */}
          <div className="w-full md:w-auto md:min-w-[200px] space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-green-600" />
              <span>30-day money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-green-600" />
              <span>Real humans respond to emails</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-green-600" />
              <span>Used by 2,000+ Canadians</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FounderTrustBlock;
