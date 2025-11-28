import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, FileText, Scale, MapPin } from 'lucide-react';

export default function HRTOToronto() {
  return (
    <>
      <Helmet>
        <title>Human Rights Tribunal Ontario – Toronto (2025 Guide) | Justice-Bot</title>
        <meta name="description" content="Complete 2025 guide to filing HRTO Form 1 in Toronto for housing discrimination, disability, family status, and reprisal cases. Learn how to build a strong case." />
        <meta name="keywords" content="HRTO Toronto, Human Rights Tribunal Toronto, HRTO Form 1, housing discrimination Toronto, disability discrimination, family status HRTO" />
        <link rel="canonical" href="https://www.justice-bot.com/hrto-toronto" />
        
        <meta property="og:title" content="Human Rights Tribunal Ontario – Toronto (2025 Guide)" />
        <meta property="og:description" content="Complete 2025 guide to filing HRTO Form 1 in Toronto for housing discrimination, disability, family status, and reprisal cases." />
        <meta property="og:url" content="https://www.justice-bot.com/hrto-toronto" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://www.justice-bot.com/justice-bot-logo.jpeg" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Human Rights Tribunal Ontario – Toronto (2025 Guide)",
            "description": "Complete 2025 guide to filing HRTO Form 1 in Toronto for housing discrimination cases.",
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
                  "text": "No. The HRTO is designed for self-represented people."
                }
              },
              {
                "@type": "Question",
                "name": "Does the HRTO help with rent or eviction?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No — that is LTB. But discrimination linked to eviction belongs at HRTO."
                }
              },
              {
                "@type": "Question",
                "name": "How long do cases take?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "6–18 months depending on complexity."
                }
              },
              {
                "@type": "Question",
                "name": "Can I file anonymously?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No — but your privacy is protected."
                }
              },
              {
                "@type": "Question",
                "name": "Can children be included?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes — especially in family status or disability cases."
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
              Human Rights Tribunal Ontario – Toronto (2025 Guide)
            </h1>
            <p className="text-xl text-muted-foreground">
              The Human Rights Tribunal of Ontario (HRTO) handles applications about discrimination in housing, services, employment, and reprisal. If you live in Toronto and have experienced discrimination, this guide shows you exactly how to file.
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
              <p className="mb-4">Justice-Bot can automatically generate your HRTO Form 1 with proper legal language, evidence organization, and timeline preparation for Toronto cases.</p>
              <Button asChild size="lg">
                <Link to="/forms">Get Your HRTO Form Generated Now</Link>
              </Button>
            </CardContent>
          </Card>

          <div className="prose prose-lg max-w-none">
            <h2>What the HRTO Handles in Toronto</h2>
            <p>The Human Rights Code protects people in Toronto from discrimination based on:</p>
            <ul>
              <li>Disability</li>
              <li>Family status (your role as a parent)</li>
              <li>Race / ethnic origin</li>
              <li>Colour</li>
              <li>Gender identity & expression</li>
              <li>Sex</li>
              <li>Age</li>
              <li>Receipt of public assistance (OW/ODSP) — in housing cases</li>
              <li>Marital status</li>
              <li>Creed</li>
              <li>Sexual orientation</li>
            </ul>

            <p>You can file an HRTO application if you were discriminated against in:</p>
            <ul>
              <li>Housing</li>
              <li>Employment</li>
              <li>Education</li>
              <li>Services</li>
              <li>Contracts</li>
              <li>Membership in associations</li>
              <li>Child protection settings</li>
              <li>Access to public services</li>
            </ul>

            <h2>Examples of Housing Discrimination (Toronto)</h2>
            <p>Extremely common HRTO housing cases include:</p>

            <div className="space-y-4 my-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Disability-related discrimination</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul>
                    <li>Refusing repairs needed for a disability</li>
                    <li>Ignoring accommodation requests</li>
                    <li>Blaming disability for issues</li>
                    <li>Harassing someone because of mental health</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Family status discrimination</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul>
                    <li>Targeting parents with children</li>
                    <li>Complaints about "too much noise"</li>
                    <li>Treating single mothers unfairly</li>
                    <li>Threatening eviction because of kids</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Income-source discrimination (OW/ODSP)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul>
                    <li>Refusing to rent to you</li>
                    <li>Saying "we don't take ODSP/OW"</li>
                    <li>Harassing you because you receive benefits</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Race/ethnicity-based treatment</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul>
                    <li>Unequal treatment</li>
                    <li>Rude comments</li>
                    <li>Higher expectations</li>
                    <li>Threats or humiliation</li>
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
                    <li>Filing LTB applications</li>
                    <li>Asserting rights</li>
                    <li>Contacting authorities</li>
                  </ul>
                  <p className="mt-2 font-semibold">Reprisal cases are taken very seriously.</p>
                </CardContent>
              </Card>
            </div>

            <h2>Which Form You File</h2>
            <p>All HRTO applications use:</p>
            <Card className="my-6 border-primary">
              <CardHeader>
                <CardTitle>✔ Form 1 – Human Rights Application</CardTitle>
              </CardHeader>
              <CardContent>
                <p>This form applies to all types of discrimination.</p>
                <p className="mt-2">Justice-Bot can auto-fill this for you.</p>
              </CardContent>
            </Card>

            <h2>What You Can Win in HRTO Cases</h2>
            <div className="grid gap-4 my-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    General damages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Compensation for:</p>
                  <ul>
                    <li>Injury to dignity</li>
                    <li>Emotional harm</li>
                    <li>Loss of confidence</li>
                    <li>Distress</li>
                  </ul>
                  <p className="mt-2 font-semibold">These awards can be significant.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Special damages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Covering:</p>
                  <ul>
                    <li>Therapy</li>
                    <li>Hotel stays</li>
                    <li>Damaged items</li>
                    <li>Medical expenses</li>
                    <li>Lost income</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Orders requiring changes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Such as:</p>
                  <ul>
                    <li>Mandatory training</li>
                    <li>Policy changes</li>
                    <li>Accommodation orders</li>
                    <li>Behavioural restrictions</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Cease-and-desist orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>For harassment or discrimination.</p>
                </CardContent>
              </Card>
            </div>

            <h2>How to Build a Strong HRTO Case</h2>
            <p>The HRTO relies heavily on evidence, timelines, and clear connections between the discrimination and the impact.</p>

            <h3>Step 1 — Write a Clear Timeline</h3>
            <p>Include:</p>
            <ul>
              <li>Dates</li>
              <li>What happened</li>
              <li>Who said what</li>
              <li>How it affected you</li>
              <li>How your protected characteristic was involved</li>
            </ul>
            <p className="font-semibold">This timeline is crucial.</p>

            <h3>Step 2 — Gather All Evidence</h3>
            <p>Evidence may include:</p>
            <ul>
              <li>Text messages</li>
              <li>Emails</li>
              <li>Notes from conversations</li>
              <li>Photos/videos</li>
              <li>Witnesses</li>
              <li>Medical documents</li>
              <li>CAS notes (for family status matters)</li>
              <li>Doctor letters (disability cases)</li>
              <li>Notices, letters, formal documents</li>
            </ul>
            <p className="font-semibold">The stronger your evidence, the stronger your case.</p>

            <h3>Step 3 — Show the Connection</h3>
            <p>The HRTO needs to see:</p>
            <Card className="my-6 bg-muted">
              <CardContent className="pt-6">
                <p className="text-center font-semibold">
                  "I have a protected characteristic →<br/>
                  The respondent acted negatively →<br/>
                  There is a connection between the two."
                </p>
              </CardContent>
            </Card>
            <p>Example: "You're on ODSP, I'm increasing your rent anyway."</p>
            <p>Example: "You people always complain."</p>
            <p>Example: "You can't handle your kids."</p>
            <p className="font-semibold">That connection is everything.</p>

            <h3>Step 4 — File Form 1</h3>
            <p>You submit:</p>
            <ul>
              <li>Form 1</li>
              <li>All supporting evidence you have</li>
              <li>Summary of events</li>
              <li>Any relevant documents</li>
            </ul>
            <p>Justice-Bot can generate everything for you.</p>

            <h3>Step 5 — Mediation or Hearing</h3>
            <p>Most HRTO cases go to mediation first.</p>
            <p>If not resolved, a hearing is scheduled.</p>
            <p>At the hearing:</p>
            <ul>
              <li>You present evidence</li>
              <li>Respondent gives their version</li>
              <li>Tribunal assesses credibility</li>
              <li>Tribunal issues a written order</li>
            </ul>

            <h2>Common Toronto HRTO Case Examples</h2>
            <ul>
              <li>✔ Landlord targeting a single mother → Family status discrimination</li>
              <li>✔ Refusing repairs because the tenant has a disability → Disability discrimination + reprisal</li>
              <li>✔ Threatening eviction because children are "too noisy" → Family status discrimination</li>
              <li>✔ Harassing someone because they receive ODSP → Income-source discrimination</li>
              <li>✔ Reprisal after LTB filings → Protected under the Code</li>
            </ul>

            <h2>HRTO vs. LTB — Which One Should You File?</h2>
            <p>Often: You file both.</p>
            <p>Example:</p>
            <ul>
              <li>Unsafe housing → T6</li>
              <li>Harassment → T2</li>
              <li>Disability discrimination → HRTO</li>
            </ul>
            <p>The tribunals operate independently.</p>
            <p>Justice-Bot can tell you which tribunal is correct, which forms to file, and how to coordinate both cases.</p>

            <h2>Location & Contact – Human Rights Tribunal Ontario (Toronto Region)</h2>
            <Card className="my-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  HRTO Toronto Office (Central Region)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>655 Bay Street<br/>
                Toronto, ON M7A 2A3<br/>
                (Inside Tribunals Ontario building)</p>
                <p className="mt-4">Phone: 1-866-598-0322<br/>
                TTY: 1-866-607-1240</p>
                <p className="mt-4 font-semibold">All applications are filed online or by email.</p>
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
                  <li>✓ Analyze your documents for discrimination</li>
                  <li>✓ Detect Code violations automatically</li>
                  <li>✓ Identify relevant HRTO precedents</li>
                  <li>✓ Auto-fill Form 1 + Schedule A</li>
                  <li>✓ Build your timeline</li>
                  <li>✓ Prepare your evidence package</li>
                  <li>✓ Explain your rights in plain language</li>
                  <li>✓ Generate your mediation/hearing strategy</li>
                </ul>
                <p className="mb-4">You upload → Justice-Bot builds the case.</p>
                <Button asChild variant="secondary" size="lg" className="w-full">
                  <Link to="/forms">Start Your HRTO Application</Link>
                </Button>
              </CardContent>
            </Card>

            <h2>FAQ – HRTO Toronto (2025)</h2>
            <div className="space-y-6 my-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Do I need a lawyer?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>No. The HRTO is designed for self-represented people.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Does the HRTO help with rent or eviction?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>No — that is LTB. But discrimination linked to eviction belongs at HRTO.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How long do cases take?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>6–18 months depending on complexity.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I file anonymously?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>No — but your privacy is protected.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can children be included?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Yes — especially in family status or disability cases.</p>
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
