import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Sparkles, Shield, Brain, Scale, Clock, DollarSign } from "lucide-react";

const competitors = [
  {
    name: "Traditional Lawyer",
    price: "$300-500/hr",
    features: {
      aiCaseLaw: false,
      meritCalculator: false,
      formAutofill: false,
      evidence24_7: false,
      dailyUpdates: false,
      encryption: true,
    }
  },
  {
    name: "Legal Aid Ontario",
    price: "Free (if eligible)",
    features: {
      aiCaseLaw: false,
      meritCalculator: false,
      formAutofill: false,
      evidence24_7: false,
      dailyUpdates: false,
      encryption: true,
    }
  },
  {
    name: "DIY / Self-Rep",
    price: "Free",
    features: {
      aiCaseLaw: false,
      meritCalculator: false,
      formAutofill: false,
      evidence24_7: false,
      dailyUpdates: false,
      encryption: false,
    }
  },
  {
    name: "Justice-Bot",
    price: "From $2.99/mo",
    isHighlighted: true,
    features: {
      aiCaseLaw: true,
      meritCalculator: true,
      formAutofill: true,
      evidence24_7: true,
      dailyUpdates: true,
      encryption: true,
    }
  }
];

const featureLabels = [
  { key: "aiCaseLaw", label: "AI Case Law Search", icon: Brain },
  { key: "meritCalculator", label: "Merit Score Calculator", icon: Scale },
  { key: "formAutofill", label: "75+ Auto-Fill Forms", icon: Sparkles },
  { key: "evidence24_7", label: "24/7 Evidence Analysis", icon: Clock },
  { key: "dailyUpdates", label: "Daily CanLII Updates", icon: Sparkles },
  { key: "encryption", label: "Bank-Level Encryption", icon: Shield },
];

const CompetitorComparison = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            Why Choose Us
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How Justice-Bot Compares
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get the power of AI legal research at a fraction of the cost of traditional options
          </p>
        </div>

        {/* Mobile-friendly cards */}
        <div className="block lg:hidden space-y-4">
          {competitors.map((competitor, idx) => (
            <Card 
              key={idx} 
              className={competitor.isHighlighted ? "border-primary border-2 bg-primary/5" : ""}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{competitor.name}</CardTitle>
                  <Badge variant={competitor.isHighlighted ? "default" : "secondary"}>
                    {competitor.price}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {featureLabels.map((feature) => (
                    <div key={feature.key} className="flex items-center gap-2 text-sm">
                      {competitor.features[feature.key as keyof typeof competitor.features] ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground/50" />
                      )}
                      <span className={competitor.features[feature.key as keyof typeof competitor.features] ? "" : "text-muted-foreground/50"}>
                        {feature.label}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 border-b border-border">Feature</th>
                {competitors.map((competitor, idx) => (
                  <th 
                    key={idx} 
                    className={`text-center p-4 border-b border-border ${
                      competitor.isHighlighted ? "bg-primary/10" : ""
                    }`}
                  >
                    <div className="font-bold">{competitor.name}</div>
                    <div className={`text-sm mt-1 ${competitor.isHighlighted ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                      {competitor.price}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {featureLabels.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <tr key={idx} className="border-b border-border/50">
                    <td className="p-4 flex items-center gap-2">
                      <Icon className="w-4 h-4 text-primary" />
                      {feature.label}
                    </td>
                    {competitors.map((competitor, cidx) => (
                      <td 
                        key={cidx} 
                        className={`text-center p-4 ${competitor.isHighlighted ? "bg-primary/5" : ""}`}
                      >
                        {competitor.features[feature.key as keyof typeof competitor.features] ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground/30 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-full">
            <DollarSign className="w-5 h-5" />
            <span className="font-semibold">Save up to $10,000+ in legal fees</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompetitorComparison;
