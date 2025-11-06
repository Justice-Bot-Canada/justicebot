import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Scale, FileText, Target, Calculator, Brain, Shield, 
  Book, Briefcase, Users, TrendingUp, Calendar, CheckCircle2,
  MessageSquare, Sparkles, Heart, Flag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FeatureGuide() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'AI Legal Triage',
      tier: 'Free',
      description: 'Get instant guidance on which legal pathway is right for your case.',
      benefits: [
        'Answer simple questions about your situation',
        'AI analyzes your case and recommends the best tribunal or court',
        'Learn about timelines and requirements',
        'Understand your options before spending money'
      ],
      link: '/triage'
    },
    {
      icon: FileText,
      title: 'Smart Form Intelligence',
      tier: 'Low-Income+',
      description: 'AI-powered form filling that understands your case and completes legal documents for you.',
      benefits: [
        'Automatically fills forms based on your case details',
        'Explains every question in plain language',
        'Prevents common mistakes that delay cases',
        'Generates court-ready PDFs instantly'
      ],
      link: '/forms'
    },
    {
      icon: Target,
      title: 'Case Merit Scorer',
      tier: 'Low-Income+',
      description: 'AI evaluates the strength of your case based on Canadian legal precedents.',
      benefits: [
        'Objective assessment of your case strength (0-100 score)',
        'Identifies weaknesses before you file',
        'Shows what evidence would strengthen your case',
        'Helps you decide whether to proceed or settle'
      ],
      link: '/case-strength'
    },
    {
      icon: Shield,
      title: 'Evidence Strategist',
      tier: 'Monthly+',
      description: 'Organize, analyze, and build a winning evidence package.',
      benefits: [
        'Upload photos, documents, emails, recordings',
        'AI categorizes and tags everything automatically',
        'Suggests what evidence is missing',
        'Creates professional exhibit books for court'
      ],
      link: '/evidence'
    },
    {
      icon: Book,
      title: 'Legal Research Assistant',
      tier: 'Monthly+',
      description: 'Search Canadian case law (CanLII) and get AI-powered analysis.',
      benefits: [
        'Find cases similar to yours across Canada',
        'AI explains complex legal precedents in plain English',
        'Identifies winning arguments used in past cases',
        'Cites relevant sections of laws and regulations'
      ],
      link: '/legal-chat'
    },
    {
      icon: Briefcase,
      title: 'Smart Document Drafter',
      tier: 'Monthly+',
      description: 'Generate professional legal documents tailored to your case.',
      benefits: [
        'Creates demand letters, affidavits, motions, responses',
        'Uses proper legal language and formatting',
        'Customized to your specific facts and arguments',
        'Saves thousands in legal drafting fees'
      ],
      link: '/document-drafter'
    },
    {
      icon: Calculator,
      title: 'Settlement Calculator',
      tier: 'Yearly Only',
      description: 'AI-powered analysis of fair settlement ranges based on Canadian case law.',
      benefits: [
        'Estimates settlement value for personal injury, employment, etc.',
        'Based on actual Canadian court awards',
        'Breaks down economic vs. non-economic damages',
        'Provides negotiation strategies and comparable cases'
      ],
      link: '/settlement-calculator'
    },
    {
      icon: Calendar,
      title: 'Deadline Guardian',
      tier: 'Low-Income+',
      description: 'Never miss a critical court deadline again.',
      benefits: [
        'Tracks all filing deadlines automatically',
        'Email and SMS reminders before due dates',
        'Accounts for court holidays and extensions',
        'Syncs with your personal calendar'
      ],
      link: '/case-timeline'
    },
    {
      icon: MessageSquare,
      title: '24/7 Legal Chat Assistant',
      tier: 'Free',
      description: 'Ask legal questions anytime and get instant AI-powered answers.',
      benefits: [
        'Answers questions about Canadian law',
        'Explains legal terms and procedures',
        'Available 24/7, no appointment needed',
        'Completely confidential'
      ],
      link: '/legal-chat'
    },
  ];

  const empowermentSection = {
    title: 'Standing Up Against an Unjust System',
    subtitle: 'How Justice-Bot Levels the Playing Field',
    problems: [
      {
        issue: 'Legal Costs Are Prohibitive',
        reality: 'Lawyers charge $300-$600/hour. A simple case can cost $5,000-$20,000. Most Canadians cannot afford justice.',
        solution: 'Justice-Bot gives you the same tools lawyers use for a fraction of the cost. Our yearly plan ($99.99) costs less than 20 minutes of lawyer time.'
      },
      {
        issue: 'The System Is Designed to Intimidate',
        reality: 'Complex legal language, confusing forms, strict deadlines. The system makes you feel like you need a lawyer to survive.',
        solution: 'Our AI translates everything into plain English, fills forms for you, tracks deadlines, and guides you step-by-step.'
      },
      {
        issue: 'Power Imbalance',
        reality: 'Landlords, employers, and corporations have lawyers. You don\'t. They use delay tactics and legal jargon to wear you down.',
        solution: 'Justice-Bot arms you with case law, settlement ranges, and winning strategies. You walk into that hearing prepared and confident.'
      },
      {
        issue: 'Courts Are Backlogged',
        reality: 'Cases take 1-3 years. The system hopes you give up. Delays favor the powerful.',
        solution: 'While we can\'t speed up the courts, we help you use the waiting time strategically—building evidence, researching precedents, strengthening your case.'
      },
      {
        issue: 'No One Teaches You Your Rights',
        reality: 'Schools don\'t teach tenant rights, employment law, or human rights protections. Ignorance is profitable for those in power.',
        solution: 'Justice-Bot educates you. Every feature is designed to make you legally literate so you can defend yourself.'
      },
    ]
  };

  return (
    <>
      <SEOHead
        title="Complete Feature Guide - Stand Up for Your Rights | Justice-Bot"
        description="Learn how Justice-Bot's AI-powered legal tools help Canadians navigate landlord-tenant disputes, employment law, human rights cases, and small claims court without expensive lawyers."
        keywords="legal self-representation, affordable legal help, AI legal assistant, tenant rights Canada, employment law help, human rights tribunal, small claims court guide"
      />
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <Badge className="mb-4 bg-primary/20 text-primary">Complete Platform Guide</Badge>
                <h1 className="text-5xl font-bold mb-6">
                  Every Tool You Need to Fight for Justice
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Professional legal capabilities at a fraction of the cost. Built for Canadians who refuse to be priced out of justice.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button size="lg" onClick={() => navigate('/triage')}>
                    Start Your Case Free
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => navigate('/pricing')}>
                    View Pricing
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Your Legal Arsenal</h2>
                <p className="text-xl text-muted-foreground">
                  Each tool is designed to replace expensive legal services
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <Badge variant="outline">{feature.tier}</Badge>
                        </div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ul className="space-y-2">
                          {feature.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => navigate(feature.link)}
                        >
                          Try It Now
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Empowerment Section */}
          <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                  <Flag className="w-16 h-16 mx-auto mb-4 text-amber-600" />
                  <h2 className="text-4xl font-bold mb-4">{empowermentSection.title}</h2>
                  <p className="text-xl text-muted-foreground">{empowermentSection.subtitle}</p>
                </div>

                <div className="space-y-8">
                  {empowermentSection.problems.map((item, index) => (
                    <Card key={index} className="border-l-4 border-l-amber-500">
                      <CardHeader>
                        <CardTitle className="text-xl text-amber-700 dark:text-amber-400">
                          {item.issue}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="font-semibold mb-2 text-red-600 dark:text-red-400">The Reality:</p>
                          <p className="text-muted-foreground">{item.reality}</p>
                        </div>
                        <div>
                          <p className="font-semibold mb-2 text-green-600 dark:text-green-400">How Justice-Bot Helps:</p>
                          <p>{item.solution}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="mt-12 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <Heart className="w-12 h-12 text-primary shrink-0" />
                      <div>
                        <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                        <p className="text-lg mb-4">
                          The Canadian legal system was designed when only the wealthy could afford lawyers. That system still exists today, pricing out ordinary people from their own justice.
                        </p>
                        <p className="text-lg mb-4">
                          <strong>Justice-Bot exists to break that system.</strong> We believe everyone deserves the same legal tools, regardless of income. We're building the future of accessible justice—one where AI empowers citizens to defend their rights without going bankrupt.
                        </p>
                        <p className="text-lg font-semibold text-primary">
                          Join the 800+ Canadians already using Justice-Bot to stand up for themselves.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl font-bold mb-6">Ready to Take Control of Your Case?</h2>
              <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
                Start with our free triage tool. No credit card required. See what Justice-Bot can do for you.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button size="lg" variant="secondary" onClick={() => navigate('/triage')}>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Free Case Analysis
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/pricing')} className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10">
                  View All Plans
                </Button>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
