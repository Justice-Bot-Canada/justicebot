import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ConversionFAQ = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      id: "signup",
      question: "Do I need to sign up to use this?",
      answer: "No — the first assessment is completely free with no account required. You only sign up when you want to save your results and access your personalized documents."
    },
    {
      id: "lawyer",
      question: "Is this a lawyer?",
      answer: "No — Justice-Bot provides legal guidance and preparation help designed specifically for self-represented people. We help you understand your options and prepare your case. Always verify with official tribunal sources for the most current information."
    },
    {
      id: "privacy",
      question: "Is my information private?",
      answer: "Absolutely. Your data stays secure with bank-level encryption. We never sell your information to third parties. We're PIPEDA compliant and take your privacy seriously."
    },
    {
      id: "cost",
      question: "What does it cost?",
      answer: "Your initial case assessment is 100% free — no credit card required. If you want generated documents and advanced features, premium plans start at just $5.99 per form. That's a fraction of what a paralegal would charge."
    },
    {
      id: "accuracy",
      question: "How accurate is the legal guidance?",
      answer: "Our AI is trained on Ontario tribunal procedures and regularly updated. We cite specific forms and deadlines from official sources. However, laws change — always double-check critical deadlines with the tribunal directly."
    },
    {
      id: "time",
      question: "How long does it take?",
      answer: "The initial assessment takes less than 90 seconds. Getting your full case roadmap with recommended forms typically takes 5-10 minutes. Most users complete their first draft documents in under 30 minutes."
    }
  ];

  return (
    <section className="py-16 bg-background" aria-labelledby="faq-heading">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
              <HelpCircle className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Common Questions</span>
            </div>
            <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold mb-4">
              Questions Before You Start?
            </h2>
            <p className="text-muted-foreground">
              Quick answers to help you feel confident about your next step.
            </p>
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq) => (
              <Card key={faq.id} className="border-border/50">
                <AccordionItem value={faq.id} className="border-none">
                  <AccordionTrigger className="px-6 py-4 text-left hover:no-underline hover:bg-muted/30 rounded-lg transition-colors">
                    <span className="font-semibold text-foreground pr-4">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Card>
            ))}
          </Accordion>

          {/* CTA */}
          <div className="text-center mt-10">
            <p className="text-muted-foreground mb-4">
              Still have questions? Start your free assessment and see for yourself.
            </p>
            <Button 
              variant="cta" 
              size="lg"
              className="group"
              onClick={() => navigate('/triage')}
            >
              Start Free Assessment
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConversionFAQ;
