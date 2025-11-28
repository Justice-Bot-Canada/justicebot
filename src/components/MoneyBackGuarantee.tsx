import { Shield, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function MoneyBackGuarantee() {
  return (
    <Card className="border-2 border-primary/20 bg-primary/5">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              100% Money-Back Guarantee
              <CheckCircle className="w-5 h-5 text-primary" />
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              If your form isn't accepted by the court or tribunal, we'll refund you completely - no questions asked.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Valid for 90 days after purchase</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Simple refund process - just email us</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Over 2,500 satisfied customers</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
