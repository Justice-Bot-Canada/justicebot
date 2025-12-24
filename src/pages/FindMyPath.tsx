import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Users, Briefcase, Scale, Baby, Shield, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EnhancedSEO from "@/components/EnhancedSEO";
import { analytics } from "@/utils/analytics";
import { useAuth } from "@/hooks/useAuth";

interface LegalCategory {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  questions: {
    text: string;
    options: { label: string; path: string; note?: string }[];
  }[];
}

const legalCategories: LegalCategory[] = [
  {
    id: "housing",
    icon: Home,
    title: "Housing & Tenancy",
    description: "Issues with landlords, rent, repairs, or evictions",
    questions: [
      {
        text: "What best describes your housing issue?",
        options: [
          { label: "I received an eviction notice", path: "/ltb-journey", note: "LTB applications" },
          { label: "My landlord won't make repairs", path: "/ltb-journey", note: "T6 Application" },
          { label: "My landlord is harassing me", path: "/ltb-journey", note: "T2 Application" },
          { label: "I'm facing discrimination in housing", path: "/hrto-journey", note: "Human Rights Tribunal" },
          { label: "Rent increase seems illegal", path: "/ltb-journey", note: "Review rent guidelines" }
        ]
      }
    ]
  },
  {
    id: "discrimination",
    icon: Users,
    title: "Discrimination & Human Rights",
    description: "Unfair treatment based on race, disability, gender, etc.",
    questions: [
      {
        text: "Where did the discrimination occur?",
        options: [
          { label: "At work or job application", path: "/hrto-journey", note: "HRTO or Labour Board" },
          { label: "In housing or by landlord", path: "/hrto-journey", note: "HRTO + possibly LTB" },
          { label: "Receiving services or goods", path: "/hrto-journey", note: "HRTO Application" },
          { label: "By police or government", path: "/hrto-journey", note: "HRTO or judicial review" }
        ]
      }
    ]
  },
  {
    id: "employment",
    icon: Briefcase,
    title: "Employment & Workplace",
    description: "Termination, wages, workplace safety, or harassment",
    questions: [
      {
        text: "What happened at work?",
        options: [
          { label: "I was fired or terminated", path: "/labour-board-journey", note: "Review termination" },
          { label: "I'm owed wages or vacation pay", path: "/labour-board-journey", note: "ESA claim" },
          { label: "Unsafe working conditions", path: "/labour-board-journey", note: "OHSA complaint" },
          { label: "Workplace discrimination", path: "/hrto-journey", note: "Human Rights claim" },
          { label: "I was injured at work", path: "/labour-board-journey", note: "WSIB claim" }
        ]
      }
    ]
  },
  {
    id: "money",
    icon: Scale,
    title: "Money & Contracts",
    description: "Someone owes you money or broke an agreement",
    questions: [
      {
        text: "How much money is involved?",
        options: [
          { label: "Under $35,000", path: "/small-claims-journey", note: "Small Claims Court" },
          { label: "Over $35,000", path: "/superior-court-journey", note: "Superior Court" },
          { label: "Not sure of the amount", path: "/small-claims-journey", note: "Start with Small Claims" }
        ]
      }
    ]
  },
  {
    id: "family",
    icon: Baby,
    title: "Family & Children",
    description: "Custody, access, child support, or CAS involvement",
    questions: [
      {
        text: "What family issue are you facing?",
        options: [
          { label: "Custody or access dispute", path: "/family-journey", note: "Family Court" },
          { label: "Child or spousal support", path: "/family-journey", note: "Family Court" },
          { label: "CAS/Children's Aid involved", path: "/cas-journey", note: "Child Protection" },
          { label: "Divorce proceedings", path: "/family-journey", note: "Family Court" }
        ]
      }
    ]
  },
  {
    id: "criminal",
    icon: Shield,
    title: "Criminal Charges",
    description: "Facing criminal charges or police issues",
    questions: [
      {
        text: "What is your situation?",
        options: [
          { label: "I've been charged with a crime", path: "/criminal-journey", note: "Criminal Court" },
          { label: "Police misconduct", path: "/police-accountability-journey", note: "OIPRD complaint" },
          { label: "I'm a victim of crime", path: "/criminal-journey", note: "Victim services" }
        ]
      }
    ]
  }
];

const FindMyPath = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<LegalCategory | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <EnhancedSEO
        title="Find My Legal Path | Discover Your Options | Justice-Bot"
        description="Not sure where to start? Answer a few questions and discover which legal pathway applies to your situation. Free legal guidance for Canadians."
        keywords="find legal path, which court to use, legal options Canada, tribunal finder, legal guidance"
        canonicalUrl="https://www.justice-bot.com/find-my-path"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Find Your Legal Path
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {selectedCategory 
              ? `Let's narrow down your ${selectedCategory.title.toLowerCase()} issue`
              : "Select the category that best describes your legal situation"
            }
          </p>
        </div>

        {!selectedCategory ? (
          /* Category Selection */
          <div className="grid md:grid-cols-2 gap-4">
            {legalCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card
                  key={category.id}
                  className="p-6 cursor-pointer transition-all hover:shadow-lg hover:border-primary"
                  onClick={() => setSelectedCategory(category)}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{category.title}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Questions */
          <div>
            <Button 
              variant="ghost" 
              className="mb-6"
              onClick={() => setSelectedCategory(null)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to categories
            </Button>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-full bg-primary/10">
                  <selectedCategory.icon className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">{selectedCategory.title}</h2>
              </div>

              {selectedCategory.questions.map((question, qIndex) => (
                <div key={qIndex} className="space-y-4">
                  <h3 className="font-medium text-lg">{question.text}</h3>
                  <div className="space-y-3">
                    {question.options.map((option, oIndex) => (
                      <button
                        key={oIndex}
                        className="w-full text-left p-4 border rounded-lg hover:bg-muted/50 hover:border-primary transition-all"
                        onClick={() => {
                          analytics.pathSelected({
                            legalDomain: selectedCategory.id,
                            selectedJourney: option.path.replace('/', '').replace('-journey', '').toUpperCase(),
                            confidenceLevel: 'medium',
                            userLoggedIn: !!user,
                          });
                          analytics.journeyStarted(
                            option.path.replace('/', '').replace('-journey', '').toUpperCase(),
                            '/find-my-path',
                            !!user
                          );
                          navigate(option.path);
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{option.label}</span>
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                        {option.note && (
                          <span className="text-sm text-muted-foreground">{option.note}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* Alternative Paths */}
        <div className="mt-8 p-6 bg-muted/30 rounded-lg">
          <h3 className="font-semibold mb-4 text-center">Other ways to get started:</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={() => navigate("/urgent-triage")}>
              🚨 I'm in an urgent situation
            </Button>
            <Button variant="outline" onClick={() => navigate("/upload-first")}>
              📄 Upload my documents first
            </Button>
            <Button variant="outline" onClick={() => navigate("/explain-my-options")}>
              📚 Explain my options
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FindMyPath;
