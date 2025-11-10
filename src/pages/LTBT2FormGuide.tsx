import SEOHead from "@/components/SEOHead";
import { ArticleSchema } from "@/components/ArticleSchema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { FileText, Download, AlertCircle, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const LTBT2FormGuide = () => {
  return (
    <>
      <SEOHead
        title="How to File LTB T2 Form Ontario 2025 | Step-by-Step Tenant Rights Guide"
        description="Complete guide to filing LTB T2 form in Ontario. Learn when to use T2 application, how to complete it correctly, filing deadlines, and what evidence you need. Free T2 form template."
        canonicalUrl="https://justice-bot.com/ltb-t2-form-guide"
        keywords="LTB T2 form, how to file T2 form Ontario, T2 application tenant rights, LTB forms Ontario, Landlord Tenant Board T2"
      />
      
      <ArticleSchema
        headline="How to File LTB T2 Form Ontario: Complete Guide"
        description="Step-by-step instructions for filing an LTB T2 application about tenant rights in Ontario, including forms, deadlines, and evidence requirements."
        image="https://justice-bot.com/justice-bot-logo.jpeg"
        datePublished="2025-01-09"
        dateModified="2025-01-09"
        author="Justice-Bot Legal Team"
        url="https://justice-bot.com/ltb-t2-form-guide"
      />

      <div className="min-h-screen bg-background">
        <Header />
        <section className="bg-gradient-to-b from-primary/10 to-background py-16 px-4">
          <div className="container max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-primary">Home</Link>
              <span>/</span>
              <Link to="/tenant-rights-ontario-guide" className="hover:text-primary">Tenant Rights Guide</Link>
              <span>/</span>
              <span>LTB T2 Form Guide</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              How to File an LTB T2 Form in Ontario
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8">
              Complete step-by-step guide to filing a T2 application with the Landlord and Tenant Board when your landlord violates your tenant rights.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link to="/ltb-journey">File T2 with AI Help</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/forms">Download T2 Form</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container max-w-4xl mx-auto space-y-12">
            
            <div>
              <h2 className="text-3xl font-bold mb-6">What is an LTB T2 Form?</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-lg mb-4">
                    The <strong>LTB T2 form</strong> (officially called "Tenant's Application About Tenant Rights") is used when a landlord:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                      <span>Violates your rights under the Residential Tenancies Act</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                      <span>Fails to meet their obligations as a landlord</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                      <span>Harasses you or substantially interferes with your reasonable enjoyment</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                      <span>Illegally increases rent or charges illegal fees</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                      <span>Illegally enters your unit without proper notice</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                      <span>Changes the locks or seizes your belongings</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">When to Use T2 vs Other Forms</h2>
              <div className="grid gap-4">
                <Card className="border-l-4 border-l-primary">
                  <CardHeader>
                    <CardTitle>Use T2 Form For:</CardTitle>
                    <CardDescription>
                      Rights violations, harassment, illegal rent increases, illegal entry, illegal fees
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card className="border-l-4 border-l-muted">
                  <CardHeader>
                    <CardTitle>Use T6 Form Instead For:</CardTitle>
                    <CardDescription>
                      Maintenance and repair issues (broken heating, plumbing, pests, etc.)
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card className="border-l-4 border-l-muted">
                  <CardHeader>
                    <CardTitle>Use T1 Form Instead For:</CardTitle>
                    <CardDescription>
                      Rent rebate applications or illegal rent collection
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">Step-by-Step: How to Complete T2 Form</h2>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">1</span>
                      Download the Official T2 Form
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Get the latest version from the Tribunals Ontario website or use our AI-assisted form builder.
                    </p>
                    <Button asChild>
                      <Link to="/forms">
                        <Download className="mr-2 h-4 w-4" />
                        Download T2 Form
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">2</span>
                      Fill Out Your Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li>• Your full legal name and contact information</li>
                      <li>• Complete rental unit address</li>
                      <li>• Landlord's full legal name and address</li>
                      <li>• Monthly rent amount</li>
                      <li>• Date you moved in</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">3</span>
                      Select the Violations (Part 2)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3">Check all boxes that apply to your situation:</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                        <span><strong>Section 22:</strong> Illegal rent or rent increase</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                        <span><strong>Section 23:</strong> Substantial interference with reasonable enjoyment</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                        <span><strong>Section 24:</strong> Landlord withholds vital service</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                        <span><strong>Section 25:</strong> Illegal entry</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                        <span><strong>Section 26:</strong> Changed locks illegally</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                        <span><strong>Section 29:</strong> Harassment or coercion</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">4</span>
                      Describe What Happened (Part 3)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3">Write a clear, detailed description including:</p>
                    <ul className="space-y-2">
                      <li>• <strong>What</strong> happened (specific incidents)</li>
                      <li>• <strong>When</strong> it happened (exact dates and times)</li>
                      <li>• <strong>Where</strong> it happened</li>
                      <li>• <strong>Who</strong> was involved</li>
                      <li>• <strong>How</strong> it affected you</li>
                      <li>• Any attempts you made to resolve it</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">5</span>
                      Request Remedies (Part 4)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3">Tell the LTB what you want them to order:</p>
                    <ul className="space-y-2">
                      <li>• Rent abatement (rent reduction for violations)</li>
                      <li>• Order landlord to stop the behaviour</li>
                      <li>• Compensation for damages or losses</li>
                      <li>• Order landlord to comply with their obligations</li>
                      <li>• Administrative fine against landlord</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">6</span>
                      Gather Evidence
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-accent/50 rounded-lg p-4 mb-4">
                      <AlertCircle className="h-5 w-5 text-primary mb-2" />
                      <p className="font-semibold mb-2">Strong evidence is critical!</p>
                      <p className="text-sm">The more evidence you have, the better your chances of winning.</p>
                    </div>
                    <p className="mb-3">Collect and organize:</p>
                    <ul className="space-y-2">
                      <li>• Text messages and emails with landlord</li>
                      <li>• Photos or videos of issues</li>
                      <li>• Witness statements (written and signed)</li>
                      <li>• Receipts for any expenses</li>
                      <li>• Your lease agreement</li>
                      <li>• Rent receipts or bank statements</li>
                      <li>• Any written notices from landlord</li>
                      <li>• Police reports (if applicable)</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">7</span>
                      File Your T2 Application
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">You have three filing options:</p>
                    <div className="space-y-3">
                      <div className="border-l-4 border-l-primary pl-4">
                        <h4 className="font-semibold">Online (Recommended)</h4>
                        <p className="text-sm text-muted-foreground">File through Tribunals Ontario website - fastest processing</p>
                      </div>
                      <div className="border-l-4 border-l-muted pl-4">
                        <h4 className="font-semibold">By Mail</h4>
                        <p className="text-sm text-muted-foreground">Send to: Landlord and Tenant Board, 15 Grosvenor Street, Ground Floor, Toronto ON M7A 2G6</p>
                      </div>
                      <div className="border-l-4 border-l-muted pl-4">
                        <h4 className="font-semibold">In Person</h4>
                        <p className="text-sm text-muted-foreground">Visit your local LTB office (check website for locations and hours)</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm"><strong>Filing Fee:</strong> $53 (may be waived for low income - request fee waiver with application)</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="bg-accent/50 rounded-lg p-8">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <AlertCircle className="h-8 w-8 text-primary" />
                Important Deadlines
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-l-primary pl-6">
                  <h3 className="text-xl font-semibold mb-2">One Year Limitation</h3>
                  <p className="text-muted-foreground">
                    You must file your T2 application within <strong>one year</strong> of when the issue occurred. 
                    For ongoing issues, file within one year of the last incident.
                  </p>
                </div>
                <div className="border-l-4 border-l-muted pl-6">
                  <h3 className="text-xl font-semibold mb-2">After Filing</h3>
                  <p className="text-muted-foreground">
                    The LTB will schedule a hearing within several weeks to months. You'll receive a Notice of Hearing 
                    with the date, time, and instructions. Make sure to serve your landlord with a copy.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">Common T2 Mistakes to Avoid</h2>
              <div className="grid gap-4">
                <Card className="border-l-4 border-l-destructive">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-destructive" />
                      Missing Evidence
                    </CardTitle>
                    <CardDescription>
                      Not providing sufficient documentation to prove your claims. Always attach copies of evidence.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card className="border-l-4 border-l-destructive">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-destructive" />
                      Vague Descriptions
                    </CardTitle>
                    <CardDescription>
                      Writing "my landlord is mean" instead of specific incidents with dates, times, and details.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card className="border-l-4 border-l-destructive">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-destructive" />
                      Wrong Form
                    </CardTitle>
                    <CardDescription>
                      Using T2 for maintenance issues (use T6) or rent rebates (use T1). Check which form applies.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card className="border-l-4 border-l-destructive">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-destructive" />
                      Missing Deadlines
                    </CardTitle>
                    <CardDescription>
                      Filing after the one-year limitation period or missing the hearing date.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>

            <div className="bg-primary/10 rounded-lg p-8 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-4">Need Help Filing Your T2 Application?</h2>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Our AI legal assistant can help you complete the T2 form correctly, gather evidence, 
                and prepare for your hearing. Get personalized guidance in minutes.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg">
                  <Link to="/ltb-journey">Start T2 Application with AI</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/legal-chat">Ask Questions About T2</Link>
                </Button>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">Related Guides</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <Link to="/ltb-hearing-timeline" className="hover:text-primary">
                        LTB Hearing Timeline Explained
                      </Link>
                    </CardTitle>
                    <CardDescription>What happens after you file and how to prepare for your hearing</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <Link to="/tenant-rights-ontario-guide" className="hover:text-primary">
                        Complete Tenant Rights Guide
                      </Link>
                    </CardTitle>
                    <CardDescription>All your rights as an Ontario tenant in one comprehensive guide</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default LTBT2FormGuide;
