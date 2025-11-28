import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, FileText, Wrench, AlertTriangle } from 'lucide-react';

export default function TenantRightsRepairsNotDone() {
  return (
    <>
      <Helmet>
        <title>Tenant Rights Ontario – Repairs Not Done (2025 Guide) | Justice-Bot</title>
        <meta name="description" content="Ontario tenant rights when landlord refuses repairs. Learn how to file T6, document evidence, and get compensation when repairs are ignored." />
        <meta name="keywords" content="tenant rights repairs Ontario, landlord won't fix, T6 application, repairs not done, Ontario tenant law, maintenance issues" />
        <link rel="canonical" href="https://www.justice-bot.com/tenant-rights-repairs-not-done" />
        
        <meta property="og:title" content="Tenant Rights Ontario – Repairs Not Done (2025 Guide)" />
        <meta property="og:description" content="Ontario tenant rights when landlord refuses repairs. Learn how to file T6, document evidence, and get compensation when repairs are ignored." />
        <meta property="og:url" content="https://www.justice-bot.com/tenant-rights-repairs-not-done" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://www.justice-bot.com/justice-bot-logo.jpeg" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Tenant Rights Ontario – Repairs Not Done (2025 Guide)",
            "description": "Ontario tenant rights when landlord refuses repairs. Learn how to file T6, document evidence, and get compensation.",
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
                "name": "Can my landlord tell me to fix something myself?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No. That's illegal."
                }
              },
              {
                "@type": "Question",
                "name": "Can the landlord blame me for wear and tear?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No — normal wear and tear is their responsibility."
                }
              },
              {
                "@type": "Question",
                "name": "Do I need Property Standards?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Not required, but very helpful."
                }
              },
              {
                "@type": "Question",
                "name": "Can I file without a lawyer?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Most tenants self-represent successfully."
                }
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="mb-8">
            <Badge className="mb-4">Tenant Rights Guide</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Tenant Rights Ontario – Repairs Not Done (2025 Guide)
            </h1>
            <p className="text-xl text-muted-foreground">
              When a landlord fails to complete essential repairs, they violate Ontario's Residential Tenancies Act (RTA). You have strong legal rights, and this guide explains exactly what to do.
            </p>
          </div>

          <Card className="mb-8 bg-primary/5 border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Need Help With Repairs Issues?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Justice-Bot can automatically generate your T6 or T2+T6 application to force repairs and get compensation.</p>
              <Button asChild size="lg">
                <Link to="/forms">Get Your Forms Generated Now</Link>
              </Button>
            </CardContent>
          </Card>

          <div className="prose prose-lg max-w-none">
            <h2>Your Legal Rights if Repairs Are Not Done</h2>
            <p>Ontario law requires landlords to keep your home:</p>
            <ul>
              <li>In good repair</li>
              <li>Safe and healthy</li>
              <li>Free from mold, pests, and hazards</li>
              <li>Compliant with Property Standards</li>
              <li>Suitable for normal living</li>
            </ul>
            <p>You do not have to:</p>
            <ul>
              <li>Fix the problem yourself</li>
              <li>Pay for the repairs</li>
              <li>Accept excuses ("we're busy", "it's old")</li>
            </ul>
            <p>The law places 100% of repair responsibility on the landlord.</p>

            <h2>Common Repair Issues in Ontario (2025)</h2>
            <ul>
              <li>Mold</li>
              <li>Plumbing leaks</li>
              <li>Water damage</li>
              <li>Electrical hazards</li>
              <li>Non-working appliances</li>
              <li>Broken windows, doors, locks</li>
              <li>Inadequate heating</li>
              <li>Pests (bed bugs, cockroaches, mice)</li>
              <li>Unsafe floors or steps</li>
            </ul>

            <h2>Which Form to File When Repairs Aren't Done</h2>
            <p>You typically file:</p>
            <Card className="my-6">
              <CardHeader>
                <CardTitle>T6 – Maintenance Application</CardTitle>
              </CardHeader>
              <CardContent>
                <p>When repairs, health, or maintenance issues are ignored.</p>
              </CardContent>
            </Card>
            
            <p>If repairs also cause harassment or harm:</p>
            <Card className="my-6 border-primary">
              <CardHeader>
                <CardTitle>File T2 + T6 together</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Examples:</p>
                <ul>
                  <li>Landlord refuses repairs and targets your family</li>
                  <li>Landlord ignores repair requests for months</li>
                  <li>Repairs cause health symptoms</li>
                  <li>The situation affects children or disabled family members</li>
                </ul>
              </CardContent>
            </Card>

            <h2>What You Can Win (Real LTB Outcomes)</h2>
            <p>Tenants commonly receive:</p>
            <div className="grid gap-4 my-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Rent abatement (refund)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Often 20–50% of rent during the problem period.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Repair order
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Binding and enforceable.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Compensation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul>
                    <li>Cleaning supplies</li>
                    <li>Damaged items</li>
                    <li>Hotel costs</li>
                    <li>Medical-related costs</li>
                    <li>Food loss</li>
                    <li>Disability-related impacts</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Administrative fines against the landlord
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            <h2>How to Build a Strong Repair Case</h2>
            
            <h3>Step 1 – Document the problem</h3>
            <p>Take clear photos and videos:</p>
            <ul>
              <li>Before and after</li>
              <li>Repeat photos as problem gets worse</li>
              <li>Close-ups of visible damage</li>
            </ul>

            <h3>Step 2 – Report the problem in writing</h3>
            <p>Email the landlord with:</p>
            <ul>
              <li>Date</li>
              <li>Description</li>
              <li>Request for repair</li>
              <li>Timeline of when issue began</li>
            </ul>

            <h3>Step 3 – Keep a repair log</h3>
            <p>A simple timeline like:</p>
            <Card className="my-6 bg-muted">
              <CardContent className="pt-6">
                <p className="font-mono text-sm">
                  "April 14 – Mold first appeared under sink.<br/>
                  April 17 – Emailed landlord, no response.<br/>
                  April 22 – Mold spreading, child coughing."
                </p>
              </CardContent>
            </Card>
            <p>This is extremely powerful at hearings.</p>

            <h3>Step 4 – Get outside inspections if needed</h3>
            <ul>
              <li>Property Standards Officer</li>
              <li>Toronto Public Health</li>
              <li>Fire Marshal</li>
              <li>CAS (if children affected)</li>
            </ul>
            <p>These reports can be case-winning evidence.</p>

            <h2>How to File Your Case</h2>
            <p>If repairs are not done:</p>
            <ol>
              <li>File a T6 for maintenance</li>
              <li>Add a T2 if harassment, neglect, or retaliation occurred</li>
              <li>Attach evidence</li>
              <li>Request all appropriate remedies</li>
              <li>Submit through Tribunals Ontario portal</li>
              <li>Serve your landlord</li>
              <li>Attend Zoom hearing</li>
            </ol>

            <h2>How Long It Takes</h2>
            <p>Typical 2025 timelines:</p>
            <ul>
              <li>T6: 8–14 months</li>
              <li>Urgent health/safety: potentially faster</li>
            </ul>
            <p>Do not wait — file early.</p>

            <Card className="my-8 bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6" />
                  Use Justice-Bot to Generate Your T6 or T2 Automatically
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Justice-Bot can:</p>
                <ul className="space-y-2 mb-6">
                  <li>✓ Review your repair evidence</li>
                  <li>✓ Recommend T2, T6, or both</li>
                  <li>✓ Auto-fill your legal forms</li>
                  <li>✓ Build your evidence package</li>
                  <li>✓ Generate your timeline</li>
                  <li>✓ Prepare disclosure</li>
                  <li>✓ Tell you the exact remedies to request</li>
                </ul>
                <p className="mb-4">You upload your pictures → Justice-Bot prepares your case.</p>
                <Button asChild variant="secondary" size="lg" className="w-full">
                  <Link to="/forms">Start Your Application</Link>
                </Button>
              </CardContent>
            </Card>

            <h2>FAQ – Repairs Not Done (Ontario)</h2>
            <div className="space-y-6 my-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can my landlord tell me to fix something myself?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>No. That's illegal.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can the landlord blame me for wear and tear?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>No — normal wear and tear is their responsibility.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Do I need Property Standards?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Not required, but very helpful.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I file without a lawyer?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Yes. Most tenants self-represent successfully.</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 p-6 bg-muted rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Ready to Take Action on Repairs?</h3>
              <p className="mb-6">
                Justice-Bot makes filing for repairs simple and accurate. Get your forms generated, evidence organized, and case prepared in minutes.
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
