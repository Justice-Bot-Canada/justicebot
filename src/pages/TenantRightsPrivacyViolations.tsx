import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, FileText, Lock, AlertTriangle } from 'lucide-react';

export default function TenantRightsPrivacyViolations() {
  return (
    <>
      <Helmet>
        <title>Tenant Rights Ontario – Privacy Violations & Illegal Entry (2025 Guide) | Justice-Bot</title>
        <meta name="description" content="Ontario tenant rights when landlord enters illegally or violates privacy. Learn what counts as illegal entry, how to document it, and file a T2 application." />
        <meta name="keywords" content="illegal entry Ontario, privacy violations landlord, T2 privacy, landlord entering without notice, tenant privacy Ontario" />
        <link rel="canonical" href="https://www.justice-bot.com/tenant-rights-privacy-violations" />
        
        <meta property="og:title" content="Tenant Rights Ontario – Privacy Violations & Illegal Entry (2025 Guide)" />
        <meta property="og:description" content="Ontario tenant rights when landlord enters illegally or violates privacy. Learn what counts as illegal entry and how to file a T2." />
        <meta property="og:url" content="https://www.justice-bot.com/tenant-rights-privacy-violations" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://www.justice-bot.com/justice-bot-logo.jpeg" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Tenant Rights Ontario – Privacy Violations & Illegal Entry (2025 Guide)",
            "description": "Ontario tenant rights when landlord enters illegally or violates privacy. Learn what counts as illegal entry.",
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
                "name": "Can the landlord enter if I'm not home?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Not without notice."
                }
              },
              {
                "@type": "Question",
                "name": "Can they enter with verbal notice?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No. It must be written."
                }
              },
              {
                "@type": "Question",
                "name": "Can I refuse entry if the notice time doesn't work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes — the time must be reasonable."
                }
              },
              {
                "@type": "Question",
                "name": "Can I record the landlord?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes — you can record your own interactions."
                }
              },
              {
                "@type": "Question",
                "name": "Is repeated illegal entry considered harassment?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. And the LTB treats it seriously."
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
              Tenant Rights Ontario – Privacy Violations & Illegal Entry (2025 Guide)
            </h1>
            <p className="text-xl text-muted-foreground">
              In Ontario, your landlord cannot enter your home whenever they feel like it. Illegal entry, surprise inspections, unannounced visits, and intimidation at the door are all violations of your rights — and the law supports you strongly.
            </p>
          </div>

          <Card className="mb-8 bg-primary/5 border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Privacy Violated?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Justice-Bot can help you document illegal entry and automatically generate your T2 application to protect your privacy rights.</p>
              <Button asChild size="lg">
                <Link to="/forms">Protect Your Privacy Now</Link>
              </Button>
            </CardContent>
          </Card>

          <div className="prose prose-lg max-w-none">
            <h2>What Counts as Illegal Entry in Ontario?</h2>
            <p>A landlord must follow strict rules to enter your home.</p>
            <p>Illegal entry includes:</p>
            <ul>
              <li>Entering without 24-hour written notice</li>
              <li>Entering with no reason</li>
              <li>Entering while you're not home</li>
              <li>Entering repeatedly to intimidate</li>
              <li>Coming in with contractors without permission</li>
              <li>Coming in after you said "no, this time does not work"</li>
              <li>Opening doors, windows, closets, cupboards without justification</li>
              <li>Using a key to walk in</li>
              <li>Entering for non-emergency situations</li>
            </ul>

            <h3>Extreme violations include:</h3>
            <ul>
              <li>Letting themselves in late at night</li>
              <li>Repeated unannounced visits</li>
              <li>Bringing police or security with no legal basis</li>
              <li>Entering children's rooms without cause</li>
              <li>Inspecting your personal belongings</li>
            </ul>
            <p className="font-semibold">All of these are prohibited under the Residential Tenancies Act.</p>

            <h2>When Can a Landlord Legally Enter?</h2>
            <p>The law allows entry only in specific situations:</p>

            <div className="space-y-4 my-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">1. 24-hour written notice</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>The notice must:</p>
                  <ul>
                    <li>Be in writing</li>
                    <li>State the reason for entry</li>
                    <li>Give a specific time</li>
                    <li>Be between 8 a.m. – 8 p.m.</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">2. Emergency</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Actual emergencies only:</p>
                  <ul>
                    <li>Fire</li>
                    <li>Flood</li>
                    <li>Gas leak</li>
                  </ul>
                  <p className="mt-2 font-semibold">Not "I need to check something."</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">3. Tenant agreement</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>You can give permission verbally — but only if you choose.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">4. Showing the unit</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Only if you've given notice to move out, and they must still behave properly.</p>
                </CardContent>
              </Card>
            </div>

            <h2>Which Form to File for Illegal Entry?</h2>
            <p>You file:</p>
            <Card className="my-6 border-primary">
              <CardHeader>
                <CardTitle>✔ T2 – Application Concerning Tenant Rights</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Illegal entry = interference with reasonable enjoyment and often harassment.</p>
              </CardContent>
            </Card>

            <p>If the landlord used entry to scare or pressure you, also include:</p>
            <Card className="my-6 border-primary">
              <CardHeader>
                <CardTitle>✔ Human Rights Tribunal (HRTO) claim</CardTitle>
              </CardHeader>
              <CardContent>
                <p>(especially if targeting disability, family status, or other protected grounds)</p>
                <p className="mt-2">Justice-Bot can help determine this automatically.</p>
              </CardContent>
            </Card>

            <h2>What Tenants Can Win in Illegal Entry Cases</h2>
            <p>LTB rulings often include:</p>
            <div className="grid gap-4 my-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Rent abatement (refund)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Usually 10–30% depending on frequency and impact.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Orders stopping the behaviour
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Strict and enforceable.</p>
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
                    <li>Stress</li>
                    <li>Harm</li>
                    <li>Child impact</li>
                    <li>Safety concerns</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Administrative fines
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Orders restricting the landlord from contacting you directly
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>(rare but possible in extreme cases)</p>
                </CardContent>
              </Card>
            </div>

            <h2>How to Document Privacy Violations (The Part That Wins Cases)</h2>
            
            <h3>1. Keep a Privacy Violation Log</h3>
            <p>Record:</p>
            <ul>
              <li>Date & time</li>
              <li>What happened</li>
              <li>Witnesses</li>
              <li>Whether notice was given</li>
              <li>Impact on your safety/peace</li>
            </ul>
            <p className="font-semibold">These logs win cases.</p>

            <h3>2. Save all messages</h3>
            <ul>
              <li>Texts</li>
              <li>Emails</li>
              <li>Notes</li>
              <li>Voicemails</li>
              <li>Any threats or pressure</li>
            </ul>
            <p>Screenshots are perfect evidence.</p>

            <h3>3. Video or audio recording</h3>
            <p>You can record your own interactions without telling the landlord.</p>
            <p className="font-semibold">If they enter illegally or confront you → record it.</p>

            <h3>4. Photographs</h3>
            <p>Photos of:</p>
            <ul>
              <li>Notice (if any)</li>
              <li>Damage</li>
              <li>Timeline of entries</li>
              <li>Anything disturbed</li>
            </ul>

            <h3>5. Witness statements</h3>
            <p>Neighbours or family who saw or heard the entry.</p>

            <h2>How to File Your Case (T2)</h2>
            <ol>
              <li><strong>Prepare your evidence:</strong> Logs, screenshots, videos, witness names, medical impacts, notice (or lack of notice)</li>
              <li><strong>Fill out the T2:</strong> Include detailed description, dates, times, how your privacy was violated, impact, what remedies you want</li>
              <li><strong>File online via Tribunals Ontario:</strong> Upload T2 form, evidence, fee or fee waiver</li>
              <li><strong>Serve the landlord:</strong> Email or hand delivery is accepted</li>
              <li><strong>Attend the Zoom hearing:</strong> Stick to dates and evidence, stay calm, do not interrupt, use your logs to stay structured</li>
            </ol>

            <h2>Examples of Illegal Entry the LTB Has Ruled Against</h2>
            <p>Tenants have successfully won cases for:</p>
            <ul>
              <li>Landlord entering while tenant at work</li>
              <li>Using spare key without notice</li>
              <li>Repeated surprise inspections</li>
              <li>Coming in after arguments</li>
              <li>Entering to "check" things with no reason</li>
              <li>Entering multiple times a day</li>
              <li>Coming in after tenant refused showings</li>
              <li>Entering bedrooms while children inside</li>
            </ul>
            <p className="font-semibold">These cases often award strong remedies.</p>

            <Card className="my-8 bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6" />
                  Use Justice-Bot to Build Your Illegal Entry Case Automatically
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Justice-Bot can:</p>
                <ul className="space-y-2 mb-6">
                  <li>✓ Analyze your messages and entry logs</li>
                  <li>✓ Auto-fill your T2</li>
                  <li>✓ Create a perfect privacy violation timeline</li>
                  <li>✓ Prepare your disclosure</li>
                  <li>✓ Recommend rent abatement levels</li>
                  <li>✓ Identify if Human Rights violations exist</li>
                  <li>✓ Prepare you for your hearing</li>
                </ul>
                <p className="mb-4">Upload your evidence → Justice-Bot builds your case.</p>
                <Button asChild variant="secondary" size="lg" className="w-full">
                  <Link to="/forms">Start Your Privacy Case</Link>
                </Button>
              </CardContent>
            </Card>

            <h2>FAQ – Illegal Entry (Ontario)</h2>
            <div className="space-y-6 my-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can the landlord enter if I'm not home?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Not without notice.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can they enter with verbal notice?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>No. It must be written.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I refuse entry if the notice time doesn't work?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Yes — the time must be "reasonable."</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I record the landlord?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Yes — you can record your own interactions.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Is repeated illegal entry considered harassment?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Yes. And the LTB treats it seriously.</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 p-6 bg-muted rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Ready to Protect Your Privacy?</h3>
              <p className="mb-6">
                Justice-Bot makes filing for privacy violations simple and accurate. Get your forms generated, evidence organized, and case prepared in minutes.
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
