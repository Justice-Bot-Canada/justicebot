import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, FileText, Scale, MapPin } from 'lucide-react';

export default function HRTOOttawa() {
  return (
    <>
      <Helmet>
        <title>Human Rights Tribunal Ontario – Ottawa (2025 Guide) | Justice-Bot</title>
        <meta name="description" content="Complete 2025 guide to filing HRTO Form 1 in Ottawa for housing discrimination, disability, family status, and reprisal cases. Plain-language guide for Ottawa residents." />
        <meta name="keywords" content="HRTO Ottawa, Human Rights Tribunal Ottawa, HRTO Form 1 Ottawa, housing discrimination Ottawa, disability discrimination, family status HRTO" />
        <link rel="canonical" href="https://www.justice-bot.com/hrto-ottawa" />
        
        <meta property="og:title" content="Human Rights Tribunal Ontario – Ottawa (2025 Guide)" />
        <meta property="og:description" content="Complete 2025 guide to filing HRTO Form 1 in Ottawa for housing discrimination, disability, family status, and reprisal cases." />
        <meta property="og:url" content="https://www.justice-bot.com/hrto-ottawa" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://www.justice-bot.com/justice-bot-logo.jpeg" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Human Rights Tribunal Ontario – Ottawa (2025 Guide)",
            "description": "Complete 2025 guide to filing HRTO Form 1 in Ottawa for housing discrimination cases.",
            "author": {
              "@type": "Organization",
              "name": "Justice-Bot"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Justice-Bot",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.justice-bot.com/justice-bot-logo.jpeg"
              }
            },
            "datePublished": "2025-01-01",
            "dateModified": "2025-01-01"
          })}
        </script>
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Do I need a lawyer?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No. HRTO is designed for self-representation."
                }
              },
              {
                "@type": "Question",
                "name": "Are hearings in person?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Mostly virtual, some hybrid."
                }
              },
              {
                "@type": "Question",
                "name": "Does HRTO help with eviction?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Indirectly — discrimination connected to eviction is HRTO jurisdiction."
                }
              },
              {
                "@type": "Question",
                "name": "Can I file multiple HRTO grounds?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Most cases include 2–3 grounds."
                }
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="mb-8">
            <Badge className="mb-4">Human Rights Guide</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Human Rights Tribunal Ontario – Ottawa (2025 Guide)
            </h1>
            <p className="text-xl text-muted-foreground">
              If you live in Ottawa and have experienced discrimination in housing, services, employment, or education, the Human Rights Tribunal of Ontario (HRTO) is where you file your complaint. This page gives you a full, plain-language guide to filing HRTO Form 1.
            </p>
          </div>

          <Card className="mb-8 bg-primary/5 border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                File Your HRTO Application
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Justice-Bot can automatically generate your HRTO Form 1 with proper legal language, evidence organization, and timeline preparation for Ottawa cases.</p>
              <Button asChild size="lg">
                <Link to="/forms">Get Your HRTO Form Generated Now</Link>
              </Button>
            </CardContent>
          </Card>

          <div className="prose prose-lg max-w-none">
            <h2>What the HRTO Does (Ottawa)</h2>
            <p>You can file an HRTO application if you were discriminated against because of:</p>
            <ul>
              <li>Disability</li>
              <li>Family status (your role as a parent)</li>
              <li>Race / ethnic origin</li>
              <li>Colour</li>
              <li>Creed</li>
              <li>Gender identity or expression</li>
              <li>Sex</li>
              <li>Sexual orientation</li>
              <li>Age</li>
              <li>Marital status</li>
              <li>Receipt of public assistance (OW/ODSP) – housing cases only</li>
              <li>Citizenship (limited situations)</li>
            </ul>

            <p>The HRTO hears cases involving:</p>
            <ul>
              <li>Landlords and housing providers</li>
              <li>Employers and workplaces</li>
              <li>Schools and educational institutions</li>
              <li>Government services</li>
              <li>Public programs</li>
              <li>Hospitals and healthcare services</li>
            </ul>

            <h2>Examples of Discrimination in Ottawa Housing</h2>
            <p>Common real-world cases include:</p>

            <div className="space-y-4 my-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Disability discrimination</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul>
                    <li>Landlord ignoring accommodation requests</li>
                    <li>Punishing tenant for disability-related behaviours</li>
                    <li>Refusing repairs needed for health conditions</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Family status discrimination</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul>
                    <li>Complaints about children</li>
                    <li>Eviction threats because of kids</li>
                    <li>Noise complaints targeting families</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Income-source discrimination</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul>
                    <li>"We don't rent to people on ODSP/OW."</li>
                    <li>Charging higher deposits</li>
                    <li>Harassing tenants who receive benefits</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Race or ethnicity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul>
                    <li>Unequal treatment</li>
                    <li>Stereotyping</li>
                    <li>Hostile comments</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-primary">
                <CardHeader>
                  <CardTitle className="text-lg">Reprisal</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Punishment for:</p>
                  <ul className="mt-2">
                    <li>Asking for repairs</li>
                    <li>Filing LTB forms</li>
                    <li>Reporting harassment</li>
                    <li>Contacting City of Ottawa By-Law</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <h2>Which Form to File</h2>
            <p>All HRTO matters use the same application:</p>
            <Card className="my-6 border-primary">
              <CardHeader>
                <CardTitle>✔ Form 1 – Human Rights Application</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Justice-Bot can auto-fill the entire Form 1 + Schedule A for you.</p>
              </CardContent>
            </Card>

            <h2>What You Can Win in an HRTO Case</h2>
            <div className="grid gap-4 my-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    General Damages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Money for:</p>
                  <ul>
                    <li>Lost dignity</li>
                    <li>Emotional harm</li>
                    <li>Negative mental health effects</li>
                    <li>Humiliation or distress</li>
                  </ul>
                  <p className="mt-2 font-semibold">HRTO awards often range from $10,000–$45,000 depending on impact.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Special Damages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Compensation for actual expenses:</p>
                  <ul>
                    <li>Therapy</li>
                    <li>Hotel stays</li>
                    <li>Cleaning costs</li>
                    <li>Medical bills</li>
                    <li>Lost wages</li>
                    <li>Replacement items</li>
                    <li>Food spoilage (for housing cases)</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Orders to Change Behaviour
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>The HRTO can require the respondent to:</p>
                  <ul>
                    <li>Stop discriminatory conduct</li>
                    <li>Provide disability accommodation</li>
                    <li>Complete training</li>
                    <li>Change policies</li>
                    <li>Issue written apologies</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Cease-and-Desist Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Stopping further harassment or discrimination.</p>
                </CardContent>
              </Card>
            </div>

            <h2>How to Build a Strong HRTO Case in Ottawa</h2>
            <p>Winning at the HRTO requires organized evidence. Here's the formula:</p>

            <h3>Step 1 — Create a Clear Timeline</h3>
            <p>Your story must be chronological:</p>
            <ul>
              <li>Date</li>
              <li>What happened</li>
              <li>How you were treated</li>
              <li>How it affected you</li>
              <li>Connection to your protected ground</li>
            </ul>

            <h3>Step 2 — Gather Evidence</h3>
            <p>Strong evidence includes:</p>
            <ul>
              <li>Emails</li>
              <li>Text messages</li>
              <li>Screenshots</li>
              <li>Photos/videos</li>
              <li>Notices or letters</li>
              <li>Medical notes</li>
              <li>Witness statements</li>
              <li>Housing inspection results</li>
              <li>Property Standards reports</li>
              <li>CAS documentation (if children affected)</li>
            </ul>
            <p className="font-semibold">The HRTO accepts many types of evidence.</p>

            <h3>Step 3 — Show the Connection</h3>
            <p>You must show:</p>
            <Card className="my-6 bg-muted">
              <CardContent className="pt-6">
                <p className="text-center font-semibold">
                  Protected Ground → Discriminatory Behaviour → Harm/Impact
                </p>
              </CardContent>
            </Card>
            <p>Example: "You people from ODSP always cause problems." → This directly connects to income-source discrimination.</p>
            <p>Another example: "We don't want kids running around here." → Clear family status discrimination.</p>

            <h3>Step 4 — File Form 1</h3>
            <p>You submit:</p>
            <ul>
              <li>Form 1</li>
              <li>All your evidence</li>
              <li>Timeline</li>
              <li>Details of discrimination</li>
              <li>Remedies you want</li>
            </ul>
            <p>Justice-Bot can prepare everything automatically.</p>

            <h3>Step 5 — Mediation or Hearing in Ottawa</h3>
            <p>The HRTO will usually offer:</p>
            <ul>
              <li>✔ Mediation → Faster, less formal, often successful</li>
              <li>✔ Hearing → If mediation fails, a tribunal hearing is scheduled</li>
            </ul>
            <p>Ottawa hearings are sometimes remote, sometimes hybrid.</p>

            <h2>Common Ottawa HRTO Case Patterns</h2>
            <ul>
              <li>✔ Tenants threatened with eviction because of children → Family status discrimination</li>
              <li>✔ Landlord refuses repairs after learning of disability → Disability discrimination</li>
              <li>✔ ODSP/OW tenants treated as "lesser" → Income-source discrimination</li>
              <li>✔ Racial profiling by landlords or property managers → Race discrimination</li>
              <li>✔ Reprisal after filing an LTB complaint → Protected under section 8 of the Code</li>
            </ul>

            <h2>HRTO vs. LTB in Ottawa – Which One Do You Use?</h2>
            <p>Often: Both.</p>
            <p>Example:</p>
            <ul>
              <li>Unsafe housing → T6</li>
              <li>Harassment → T2</li>
              <li>Disability discrimination → HRTO</li>
              <li>Threat of eviction → N4 defence</li>
            </ul>
            <p>Justice-Bot can give the exact routing: Which tribunal, which form, what order, what timeline.</p>

            <h2>Location & Contact – HRTO Ottawa</h2>
            <Card className="my-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Human Rights Tribunal Ontario – Ottawa Office
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>255 Albert Street<br/>
                Ottawa, ON K1P 6A9<br/>
                (Shared Tribunals Ontario space)</p>
                <p className="mt-4">Phone: 1-866-598-0322<br/>
                TTY: 1-866-607-1240</p>
                <p className="mt-4 font-semibold">All filings are online or by email.</p>
              </CardContent>
            </Card>

            <Card className="my-8 bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6" />
                  Use Justice-Bot to Build Your HRTO Case Automatically
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Justice-Bot can:</p>
                <ul className="space-y-2 mb-6">
                  <li>✓ Analyze your situation and spot discrimination</li>
                  <li>✓ Auto-fill Form 1 + Schedule A</li>
                  <li>✓ Build your timeline</li>
                  <li>✓ Produce a complete evidence package</li>
                  <li>✓ Prepare mediation strategy</li>
                  <li>✓ Prepare your hearing arguments</li>
                  <li>✓ Recommend additional remedies</li>
                  <li>✓ Identify relevant Ottawa HRTO precedents</li>
                </ul>
                <p className="mb-4">You upload → Justice-Bot builds the case.</p>
                <Button asChild variant="secondary" size="lg" className="w-full">
                  <Link to="/forms">Start Your HRTO Application</Link>
                </Button>
              </CardContent>
            </Card>

            <h2>FAQ – HRTO Ottawa (2025)</h2>
            <div className="space-y-6 my-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Do I need a lawyer?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>No. HRTO is designed for self-representation.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Are hearings in person?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Mostly virtual, some hybrid.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Does HRTO help with eviction?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Indirectly — discrimination connected to eviction is HRTO jurisdiction.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I file multiple HRTO grounds?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Yes. Most cases include 2–3 grounds.</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 p-6 bg-muted rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Ready to File Your HRTO Application?</h3>
              <p className="mb-6">
                Justice-Bot makes filing HRTO applications simple and accurate. Get your forms generated, evidence organized, and case prepared in minutes.
              </p>
              <Button asChild size="lg" className="w-full md:w-auto">
                <Link to="/forms">Get Started with Justice-Bot</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
