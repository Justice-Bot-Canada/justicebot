import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, FileText, Shield, AlertTriangle } from 'lucide-react';

export default function TenantRightsHarassment() {
  return (
    <>
      <Helmet>
        <title>Tenant Rights Ontario – Harassment by Landlord (2025 Guide) | Justice-Bot</title>
        <meta name="description" content="Ontario tenant rights when facing landlord harassment. Learn what counts as harassment, how to document it, and file a T2 application for protection." />
        <meta name="keywords" content="landlord harassment Ontario, tenant harassment, T2 harassment, illegal entry, tenant intimidation, Ontario tenant rights" />
        <link rel="canonical" href="https://www.justice-bot.com/tenant-rights-harassment-by-landlord" />
        
        <meta property="og:title" content="Tenant Rights Ontario – Harassment by Landlord (2025 Guide)" />
        <meta property="og:description" content="Ontario tenant rights when facing landlord harassment. Learn what counts as harassment, how to document it, and file a T2 application for protection." />
        <meta property="og:url" content="https://www.justice-bot.com/tenant-rights-harassment-by-landlord" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://www.justice-bot.com/justice-bot-logo.jpeg" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Tenant Rights Ontario – Harassment by Landlord (2025 Guide)",
            "description": "Ontario tenant rights when facing landlord harassment. Learn what counts as harassment and how to file a T2 application.",
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
                "name": "Can the landlord yell at me?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No. Verbal abuse is harassment."
                }
              },
              {
                "@type": "Question",
                "name": "Do I have to move out if they pressure me?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely not."
                }
              },
              {
                "@type": "Question",
                "name": "Can I record them?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes — you may record your own interactions."
                }
              },
              {
                "@type": "Question",
                "name": "Does harassment include discrimination?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. That strengthens your claim."
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
              Tenant Rights Ontario – Harassment by Landlord (2025 Guide)
            </h1>
            <p className="text-xl text-muted-foreground">
              Harassment from a landlord is illegal in Ontario. Whether they are yelling, threatening, entering without notice, targeting your children, discriminating, or trying to pressure you to move out — you do not have to tolerate it.
            </p>
          </div>

          <Card className="mb-8 bg-destructive/10 border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Stop Landlord Harassment Now
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Justice-Bot can help you document harassment and automatically generate your T2 application with proper legal language and evidence organization.</p>
              <Button asChild size="lg" variant="destructive">
                <Link to="/forms">Get Protected Now</Link>
              </Button>
            </CardContent>
          </Card>

          <div className="prose prose-lg max-w-none">
            <h2>What Counts as Harassment in Ontario?</h2>
            <p>Harassment includes any behaviour that is:</p>
            <ul>
              <li>Threatening</li>
              <li>Intimidating</li>
              <li>Discriminatory</li>
              <li>Coercive</li>
              <li>Used to force a tenant to move</li>
              <li>Used to pressure you into not asserting your rights</li>
            </ul>
            <p>The law protects your security, dignity, and reasonable enjoyment of your home.</p>

            <h2>Examples of Harassment by a Landlord</h2>
            
            <div className="space-y-6 my-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">1. Verbal threats or intimidation</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul>
                    <li>Yelling</li>
                    <li>Swearing</li>
                    <li>Threatening eviction</li>
                    <li>Making comments about your children</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">2. Constant pressure to move out</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul>
                    <li>Weekly "are you leaving yet?" conversations</li>
                    <li>Repeated requests to "give notice"</li>
                    <li>Attempts to force cash-for-keys</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">3. Discrimination</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Targeting you based on:</p>
                  <ul>
                    <li>Disability</li>
                    <li>Family status (your kids)</li>
                    <li>Income (OW/ODSP)</li>
                    <li>Ethnicity</li>
                    <li>Gender</li>
                    <li>Any protected human rights ground</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">4. Entering without notice</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul>
                    <li>Sneaking into the unit</li>
                    <li>Walking in without 24-hour written notice</li>
                    <li>"Drive-by" checks or stalking behaviour</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">5. Retaliation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Harassment after:</p>
                  <ul>
                    <li>You filed a T2 or T6</li>
                    <li>You called Property Standards</li>
                    <li>You reported issues</li>
                    <li>You refused illegal requests</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">6. Harassing contractors or maintenance staff</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Landlord sends workers who:</p>
                  <ul>
                    <li>Intimidate</li>
                    <li>Make inappropriate comments</li>
                    <li>Act aggressively</li>
                  </ul>
                  <p className="mt-2">Landlord is responsible for workers' behaviour.</p>
                </CardContent>
              </Card>
            </div>

            <h2>Your Rights Under Ontario Law</h2>
            <p>The landlord must not:</p>
            <ul>
              <li>Interfere with your reasonable enjoyment</li>
              <li>Harass you</li>
              <li>Threaten you</li>
              <li>Target, discriminate, or retaliate against you</li>
            </ul>
            <p>The T2 form exists specifically to protect you from this.</p>

            <h2>Which Form to File for Harassment</h2>
            <Card className="my-6 border-primary">
              <CardHeader>
                <CardTitle>✔ T2 – Application Concerning Tenant Rights</CardTitle>
              </CardHeader>
            </Card>
            
            <p>If harassment also involves:</p>
            <ul>
              <li>Neglect</li>
              <li>Health issues</li>
              <li>Safety concerns</li>
              <li>Retaliation after repair requests</li>
            </ul>
            <p>... then file:</p>
            <Card className="my-6 border-primary">
              <CardHeader>
                <CardTitle>✔ T2 + T6 (together)</CardTitle>
              </CardHeader>
              <CardContent>
                <p>This is extremely common and increases your remedies.</p>
              </CardContent>
            </Card>

            <h2>What You Can Win in a Harassment Case</h2>
            <div className="grid gap-4 my-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Rent abatement (refund)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Harassment often supports 20–50% rent reduction.</p>
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
                    <li>Emotional distress</li>
                    <li>Costs</li>
                    <li>Child impact</li>
                    <li>Medical effects</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Order to stop the harassment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Legally binding.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Administrative fines against the landlord
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Especially for repeat behaviour.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Orders protecting children or vulnerable tenants
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            <h2>How to Document Harassment (Most Important Section)</h2>
            <p className="text-lg font-semibold">This is where tenants either win or lose.</p>

            <h3>1. Keep a Harassment Log</h3>
            <p>Record every incident:</p>
            <ul>
              <li>Date</li>
              <li>Time</li>
              <li>What was said/done</li>
              <li>Witnesses</li>
              <li>Impact on you or your children</li>
            </ul>
            <p className="font-semibold">This can be the single strongest piece of evidence.</p>

            <h3>2. Save all messages</h3>
            <p>Screenshots of:</p>
            <ul>
              <li>Texts</li>
              <li>Emails</li>
              <li>Threats</li>
              <li>Voicemails</li>
              <li>Facebook messages</li>
            </ul>
            <p className="font-semibold">Even one threatening message can win a T2.</p>

            <h3>3. Record audio/video when legal</h3>
            <p>You can record your own conversations without telling the landlord.</p>
            <p>If they yell, threaten, or harass — record it.</p>

            <h3>4. Witnesses</h3>
            <p>Neighbours, family, or workers who saw or heard the behaviour.</p>

            <h3>5. Context matters</h3>
            <p>Harassment combined with:</p>
            <ul>
              <li>Disability</li>
              <li>Children</li>
              <li>Health issues</li>
              <li>Previous repair requests</li>
              <li>Eviction attempts</li>
            </ul>
            <p>... strengthens the case substantially.</p>

            <h2>How to File a Harassment Case (T2)</h2>
            <ol>
              <li><strong>Gather evidence:</strong> Get everything — logs, screenshots, photos, audio/video, witness names, medical notes</li>
              <li><strong>Complete the T2 Form:</strong> Include details of harassment, exact dates, witness information, the impact on your life, remedies you want</li>
              <li><strong>File online through Tribunals Ontario:</strong> Upload the completed T2, all evidence, fee or fee waiver</li>
              <li><strong>Serve your landlord:</strong> Email or hand delivery is allowed</li>
              <li><strong>Attend the Zoom hearing:</strong> Stay calm, do not interrupt, give dates and evidence, state impact on your peace/health/children</li>
            </ol>

            <h2>Real LTB Harassment Cases – What Tenants Typically Win</h2>
            <ul>
              <li>25–35% rent abatement</li>
              <li>Orders to stop the behaviour</li>
              <li>Compensation for stress or health impact</li>
              <li>Costs for moving or damage (if applicable)</li>
              <li>Administrative fines</li>
            </ul>
            <p className="font-semibold">If children are involved, the Board takes the case very seriously.</p>

            <Card className="my-8 bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6" />
                  Use Justice-Bot to Build Your Harassment Case Automatically
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Justice-Bot can:</p>
                <ul className="space-y-2 mb-6">
                  <li>✓ Analyze all messages, screenshots, and recordings</li>
                  <li>✓ Auto-fill your T2</li>
                  <li>✓ Build your harassment log</li>
                  <li>✓ Highlight evidence patterns</li>
                  <li>✓ Show which remedies apply</li>
                  <li>✓ Generate your hearing prep package</li>
                  <li>✓ Provide human-rights guidance if discrimination occurred</li>
                </ul>
                <p className="mb-4">You upload → Justice-Bot builds the entire case.</p>
                <Button asChild variant="secondary" size="lg" className="w-full">
                  <Link to="/forms">Start Your Harassment Case</Link>
                </Button>
              </CardContent>
            </Card>

            <h2>FAQ – Landlord Harassment in Ontario</h2>
            <div className="space-y-6 my-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can the landlord yell at me?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>No. Verbal abuse is harassment.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Do I have to move out if they pressure me?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Absolutely not.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I record them?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Yes — you may record your own interactions.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Does harassment include discrimination?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Yes. That strengthens your claim.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I file anonymously?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>No — but your evidence package can protect your privacy.</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 p-6 bg-muted rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Ready to Stop the Harassment?</h3>
              <p className="mb-6">
                Justice-Bot makes filing for harassment protection simple and accurate. Get your forms generated, evidence organized, and case prepared in minutes.
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
