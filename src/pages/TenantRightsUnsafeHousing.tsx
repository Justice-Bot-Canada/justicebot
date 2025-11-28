import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, FileText, Home, AlertTriangle } from 'lucide-react';

export default function TenantRightsUnsafeHousing() {
  return (
    <>
      <Helmet>
        <title>Tenant Rights Ontario – Unsafe or Unhealthy Housing (2025 Guide) | Justice-Bot</title>
        <meta name="description" content="Ontario tenant rights for unsafe or unhealthy housing conditions. Learn how to file T6, document evidence, and force repairs when your home is hazardous." />
        <meta name="keywords" content="unsafe housing Ontario, unhealthy housing, T6 application, mold Ontario, tenant safety, hazardous conditions Ontario" />
        <link rel="canonical" href="https://www.justice-bot.com/tenant-rights-unsafe-housing" />
        
        <meta property="og:title" content="Tenant Rights Ontario – Unsafe or Unhealthy Housing (2025 Guide)" />
        <meta property="og:description" content="Ontario tenant rights for unsafe or unhealthy housing conditions. Learn how to file T6, document evidence, and force repairs." />
        <meta property="og:url" content="https://www.justice-bot.com/tenant-rights-unsafe-housing" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://www.justice-bot.com/justice-bot-logo.jpeg" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Tenant Rights Ontario – Unsafe or Unhealthy Housing (2025 Guide)",
            "description": "Ontario tenant rights for unsafe or unhealthy housing conditions. Learn how to file T6 and force repairs.",
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
                "name": "Can I stop paying rent?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No — that can get you evicted. File a T6 instead."
                }
              },
              {
                "@type": "Question",
                "name": "Does the landlord have to fix mold?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Mold is a health hazard."
                }
              },
              {
                "@type": "Question",
                "name": "What if the landlord says it's my fault?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "They must prove that. Most issues are not the tenant's fault."
                }
              },
              {
                "@type": "Question",
                "name": "Do I need an inspection?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No, but it helps tremendously."
                }
              },
              {
                "@type": "Question",
                "name": "Can I get a refund for unsafe housing?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. It's called rent abatement, and it's common."
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
              Tenant Rights Ontario – Unsafe or Unhealthy Housing (2025 Guide)
            </h1>
            <p className="text-xl text-muted-foreground">
              If your home is unsafe, unhealthy, or putting your family at risk, Ontario law protects you. Your landlord must keep the unit in a condition that is safe, liveable, and compliant with health, building, and property standards laws.
            </p>
          </div>

          <Card className="mb-8 bg-destructive/10 border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Living in Unsafe Conditions?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Justice-Bot can help you document unsafe housing and automatically generate your T6 or T2+T6 application to force repairs and get compensation.</p>
              <Button asChild size="lg" variant="destructive">
                <Link to="/forms">Get Help Now</Link>
              </Button>
            </CardContent>
          </Card>

          <div className="prose prose-lg max-w-none">
            <h2>What Counts as Unsafe or Unhealthy Housing in Ontario?</h2>
            <p>Unsafe housing includes any condition that:</p>
            <ul>
              <li>Puts your health at risk</li>
              <li>Endangers your children</li>
              <li>Violates building codes</li>
              <li>Violates health or safety laws</li>
              <li>Makes a unit unfit for living</li>
              <li>Causes breathing issues, injuries, or illness</li>
            </ul>

            <h2>Common examples:</h2>
            
            <div className="space-y-4 my-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">1. Mold or Moisture Problems</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul>
                    <li>Black mold</li>
                    <li>Damp walls</li>
                    <li>Leaks that grow mold</li>
                    <li>Strong odours</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">2. Structural Issues</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul>
                    <li>Rotten floors</li>
                    <li>Unstable stairs</li>
                    <li>Weak balcony railings</li>
                    <li>Collapsing walls or ceilings</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">3. Pest Infestations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul>
                    <li>Bed bugs</li>
                    <li>Cockroaches</li>
                    <li>Mice or rats</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">4. No Heat in Winter / Overheating in Summer</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Ontario requires landlords to maintain heat and safe temperatures.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">5. Plumbing or Sewage Issues</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul>
                    <li>Backed-up drains</li>
                    <li>Sewage smells</li>
                    <li>Toilet overflow</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">6. Electrical Hazards</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul>
                    <li>Exposed wiring</li>
                    <li>Frequent power outages</li>
                    <li>Dangerous outlets or breakers</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">7. Fire Safety Problems</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul>
                    <li>No working smoke/CO alarms</li>
                    <li>Blocked fire exits</li>
                    <li>Unsafe heaters</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">8. Serious Safety Risks to Children</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul>
                    <li>Unsafe windows</li>
                    <li>Sharp hazards</li>
                    <li>Unstable fixtures</li>
                    <li>Holes in walls or floors</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <h2>Your Rights Under Ontario Law (RTA Requirements)</h2>
            <p>Landlords must keep the rental unit:</p>
            <ul>
              <li>In good state of repair</li>
              <li>Fit for habitation</li>
              <li>Compliant with health and safety standards</li>
              <li>Free of pests</li>
              <li>Safe for children, disabled tenants, and all occupants</li>
            </ul>
            <p className="font-semibold">These rights exist even if your lease says otherwise.</p>

            <h2>Which Form to File for Unsafe Housing</h2>
            <p>You typically file:</p>
            <Card className="my-6 border-primary">
              <CardHeader>
                <CardTitle>✔ T6 – Application About Maintenance</CardTitle>
              </CardHeader>
              <CardContent>
                <p>When the unsafe condition relates to:</p>
                <ul>
                  <li>Repairs</li>
                  <li>Health</li>
                  <li>Safety</li>
                  <li>Maintenance</li>
                  <li>Living conditions</li>
                </ul>
              </CardContent>
            </Card>

            <p>If the unsafe housing also comes with landlord harassment or neglect:</p>
            <Card className="my-6 border-primary">
              <CardHeader>
                <CardTitle>✔ T2 + T6</CardTitle>
              </CardHeader>
              <CardContent>
                <p>This combination is extremely powerful.</p>
              </CardContent>
            </Card>

            <h2>What You Can Win in an Unsafe Housing Case (Real LTB Results)</h2>
            <div className="grid gap-4 my-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Rent abatement (refund)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Often 20–50% of rent during unsafe conditions.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Work orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>The adjudicator can legally force repairs.</p>
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
                    <li>Hotel stays</li>
                    <li>Medical impacts</li>
                    <li>Child safety costs</li>
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
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Orders related to health and safety
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Especially when involving asthma, allergies, disability, or children.</p>
                </CardContent>
              </Card>
            </div>

            <h2>How to Build a Strong Unsafe Housing Case</h2>
            <p>Winning at the LTB requires organized evidence. Here's the formula:</p>

            <h3>Step 1 — Document the Problems</h3>
            <p>Take clear, repeated photos and videos of:</p>
            <ul>
              <li>Mold growth</li>
              <li>Pest activity</li>
              <li>Leaks</li>
              <li>Damage</li>
              <li>Hazards</li>
              <li>Broken fixtures</li>
              <li>Electrical risks</li>
            </ul>
            <p>Update photos as the issues get worse.</p>

            <h3>Step 2 — Report Everything in Writing</h3>
            <p>Email or text your landlord:</p>
            <ul>
              <li>A description of the issue</li>
              <li>The date you discovered it</li>
              <li>Your request for repair</li>
              <li>Any impact on your health or safety</li>
            </ul>
            <p>Do this multiple times if ignored.</p>

            <h3>Step 3 — Get Inspections or Reports (Optional but powerful)</h3>
            <ul>
              <li>Municipal Property Standards Officer</li>
              <li>Public Health</li>
              <li>CAS (if safety impacts children)</li>
              <li>Fire officials</li>
            </ul>
            <p className="font-semibold">These reports carry major weight at the LTB.</p>

            <h3>Step 4 — Keep a Timeline</h3>
            <Card className="my-6 bg-muted">
              <CardContent className="pt-6">
                <p className="font-mono text-sm">
                  Example:<br/>
                  Feb 3 — Leak appears in ceiling<br/>
                  Feb 5 — Emailed landlord, no reply<br/>
                  Feb 15 — Mold spreading, child coughing<br/>
                  Feb 20 — Contacted Property Standards
                </p>
              </CardContent>
            </Card>
            <p className="font-semibold">A strong timeline = strong case.</p>

            <h3>Step 5 — File Your Case</h3>
            <p>Depending on the situation:</p>
            <ul>
              <li>T6 for maintenance/safety</li>
              <li>T2 if harassment, retaliation, discrimination, or neglect</li>
              <li>Submit evidence</li>
              <li>Serve your landlord</li>
              <li>Prepare for the hearing</li>
            </ul>

            <h2>How Long Unsafe Housing Cases Take (2025)</h2>
            <p>Typical LTB timelines:</p>
            <ul>
              <li>T6: 8–14 months</li>
              <li>Urgent health/safety cases: sometimes faster</li>
            </ul>
            <p>The best strategy is to file early and build a clean evidence package.</p>

            <Card className="my-8 bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6" />
                  Use Justice-Bot to Build Your Unsafe Housing Case Automatically
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Justice-Bot can:</p>
                <ul className="space-y-2 mb-6">
                  <li>✓ Review your photos, videos, and messages</li>
                  <li>✓ Recommend T2, T6, or HRTO</li>
                  <li>✓ Auto-fill the forms</li>
                  <li>✓ Create a perfect evidence package</li>
                  <li>✓ Build your timeline</li>
                  <li>✓ Prepare you for the hearing</li>
                  <li>✓ Generate disclosure automatically</li>
                </ul>
                <p className="mb-4">You upload → Justice-Bot builds the entire case.</p>
                <Button asChild variant="secondary" size="lg" className="w-full">
                  <Link to="/forms">Start Your Application</Link>
                </Button>
              </CardContent>
            </Card>

            <h2>FAQ – Unsafe Housing (Ontario)</h2>
            <div className="space-y-6 my-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I stop paying rent?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>No — that can get you evicted. File a T6 instead.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Does the landlord have to fix mold?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Yes. Mold is a health hazard.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What if the landlord says it's my fault?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>They must prove that. Most issues are not the tenant's fault.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Do I need an inspection?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>No, but it helps tremendously.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I get a refund for unsafe housing?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Yes. It's called rent abatement, and it's common.</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 p-6 bg-muted rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Ready to Take Action on Unsafe Housing?</h3>
              <p className="mb-6">
                Justice-Bot makes filing for unsafe housing simple and accurate. Get your forms generated, evidence organized, and case prepared in minutes.
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
