import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EnhancedSEO from "@/components/EnhancedSEO";
import { CanonicalURL } from "@/components/CanonicalURL";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Shield, DollarSign, FileText, Lock, Clock, AlertCircle } from "lucide-react";

export default function FAQ() {
  const faqCategories = [
    {
      title: "Pricing & Eligibility",
      icon: DollarSign,
      faqs: [
        {
          question: "How much does Justice-Bot cost?",
          answer: "Justice-Bot offers flexible pricing: Free tier for basic triage and guides, $5.99/month for document generation and AI assistance, or $99.99/year (save 30%). We also offer a $2.99 low-income plan for eligible users."
        },
        {
          question: "Who qualifies for the low-income plan?",
          answer: "If you receive Ontario Works, ODSP, or have a household income below Statistics Canada's Low Income Cut-Off (LICO), you may qualify. Upload proof of income or benefits when you register."
        },
        {
          question: "Can I try Justice-Bot for free?",
          answer: "Yes! Our free tier includes case triage, basic guidance, and access to legal resource links. You can upgrade anytime for document generation and AI analysis."
        },
        {
          question: "What's your refund policy?",
          answer: "Monthly subscriptions can be cancelled anytime. Annual plans are refundable within 30 days if you haven't generated documents. Contact us for refund requests."
        }
      ]
    },
    {
      title: "What Justice-Bot Does",
      icon: FileText,
      faqs: [
        {
          question: "What legal issues can Justice-Bot help with?",
          answer: "We help with: Landlord-Tenant Board (LTB) applications, Human Rights Tribunal of Ontario (HRTO) claims, Small Claims Court up to $35,000, Family Court matters, labour/employment issues, and government accountability complaints."
        },
        {
          question: "What can't Justice-Bot help with?",
          answer: "Justice-Bot doesn't handle: Criminal defence, immigration/refugee claims, complex corporate law, class action lawsuits, appeals to higher courts, or situations requiring immediate legal representation (like bail hearings)."
        },
        {
          question: "Can Justice-Bot represent me in court?",
          answer: "No. Justice-Bot is a self-help tool that prepares documents and provides guidance. It cannot appear on your behalf or provide legal advice. For representation, consult a licensed paralegal or lawyer."
        },
        {
          question: "Is Justice-Bot a law firm?",
          answer: "No. We are a legal technology platform. We don't provide legal advice or representation. All content is for informational purposes and doesn't create a lawyer-client relationship."
        }
      ]
    },
    {
      title: "How It Works",
      icon: Clock,
      faqs: [
        {
          question: "How do I get started?",
          answer: "1) Sign up for a free account. 2) Use our Smart Triage to identify your legal venue. 3) Answer questions about your case. 4) Review AI-generated documents. 5) Download forms and filing instructions. 6) File with the appropriate tribunal or court."
        },
        {
          question: "How long does it take?",
          answer: "Most users complete their intake in 15-30 minutes. Document generation is instant. Review and editing may take 1-2 hours depending on case complexity."
        },
        {
          question: "Can I save my progress?",
          answer: "Yes! Your case is saved automatically. Return anytime to continue or update your information."
        },
        {
          question: "What happens after I download my forms?",
          answer: "You'll receive step-by-step filing instructions, including where to submit, fees (if any), and what to expect next. We also provide deadline tracking and hearing preparation guides."
        }
      ]
    },
    {
      title: "Privacy & Security",
      icon: Lock,
      faqs: [
        {
          question: "Is my information confidential?",
          answer: "Yes. All data is encrypted in transit and at rest. We comply with PIPEDA (Canada's privacy law) and never sell or share your information with third parties."
        },
        {
          question: "Who can see my case details?",
          answer: "Only you. Justice-Bot staff cannot access your case content unless you explicitly request support and grant permission."
        },
        {
          question: "How long do you keep my data?",
          answer: "We retain your case data as long as your account is active. You can delete your account and all data anytime from your profile settings."
        },
        {
          question: "Are Justice-Bot's systems secure?",
          answer: "Yes. We use bank-level 256-bit SSL encryption, secure servers in Canada, and regular security audits to protect your information."
        }
      ]
    },
    {
      title: "Support & Accuracy",
      icon: Shield,
      faqs: [
        {
          question: "What if I need help using Justice-Bot?",
          answer: "We offer email support (admin@justice-bot.com), video tutorials, and an AI assistant to answer questions. Premium users get priority support."
        },
        {
          question: "How accurate is Justice-Bot's guidance?",
          answer: "Our content is reviewed by legal professionals and references official tribunal/court sources. However, laws change frequently—always verify with official sources before filing."
        },
        {
          question: "What if Justice-Bot makes a mistake?",
          answer: "While we strive for accuracy, Justice-Bot is not liable for outcomes. See our Terms of Service and Liability Disclaimer. Always review documents carefully before filing."
        },
        {
          question: "Can I get a lawyer referral?",
          answer: "Yes! If your case requires professional representation, we can refer you to Legal Aid Ontario, pro bono services, or affordable paralegals/lawyers in your area."
        }
      ]
    }
  ];

  // Generate FAQPage structured data
  const allFaqItems = faqCategories.flatMap(cat => cat.faqs);
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": allFaqItems.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "FAQ", url: "/faq" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <CanonicalURL />
      <EnhancedSEO
        title="FAQ - Justice-Bot Pricing, Features & How It Works | Ontario Legal Help"
        description="Answers to common questions about Justice-Bot: pricing ($19/month), what legal issues we cover (LTB, HRTO, Small Claims, Family Court), eligibility, privacy, and how our AI legal assistant works in Ontario."
        keywords="Justice-Bot FAQ, legal help questions Ontario, AI legal assistant pricing, LTB help questions, HRTO questions, small claims FAQ, legal aid alternative questions"
        canonicalUrl="https://justice-bot.com/faq"
        structuredData={faqStructuredData}
        breadcrumbs={breadcrumbs}
      />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about using Justice-Bot
            </p>
          </div>

          <div className="space-y-12">
            {faqCategories.map((category, idx) => {
              const Icon = category.icon;
              return (
                <div key={idx} className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold">{category.title}</h2>
                  </div>
                  <Accordion type="single" collapsible className="w-full">
                    {category.faqs.map((faq, faqIdx) => (
                      <AccordionItem key={faqIdx} value={`item-${idx}-${faqIdx}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              );
            })}
          </div>

          <div className="mt-16 bg-warning/10 border border-warning/20 rounded-lg p-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-warning flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
                <p className="text-muted-foreground mb-4">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <a 
                  href="/contact" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
