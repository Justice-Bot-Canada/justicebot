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
            
            <div className="text-muted-foreground space-y-4 text-sm md:text-base">
              <p>
                I didn't build Justice-Bot because I watched the problem from the outside. I built it because I was living it.
              </p>
              <p>
                I was a tenant, a parent, and a person with disabilities trying to survive a legal system that assumes you have money, time, and legal training. I was dealing with housing issues, deadlines, forms, evidence, and hearings — all while raising my children and trying to protect our stability. The forms were confusing. The rules were unforgiving. Missing one step could cost us our home.
              </p>
              <p>
                Lawyers were unaffordable. Legal aid was overwhelmed. I had to learn the system the hard way, under pressure, with real consequences on the line.
              </p>
              <p>
                Justice-Bot was built out of that experience — to turn what I had to learn the hard way into tools that help others understand their rights, organize their evidence, meet deadlines, and stand on equal footing in a system that too often leaves people behind.
              </p>
              <p className="font-medium text-foreground">
                This isn't theoretical. It's personal. And it's about giving people a real chance to defend themselves when the stakes are high.
              </p>
            </div>
            
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
