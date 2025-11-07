import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, ArrowLeft, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function OntarioSmallClaimsCourt2025() {
  return (
    <>
      <Helmet>
        <title>Ontario Small Claims Court Guide (2025 Update) — Justice-Bot</title>
        <meta name="description" content="A clear, plain-language guide to Ontario Small Claims Court in 2025: what's new, how to file, forms, settlement, trial, and enforcement." />
        <meta name="keywords" content="ontario small claims court, small claims court ontario 2025, how to file small claims ontario, ontario court forms, small claims settlement, small claims trial" />
        <link rel="canonical" href="https://justice-bot.com/blog/ontario-small-claims-court-2025" />
        <meta property="og:title" content="Ontario Small Claims Court Guide (2025 Update) — Justice-Bot" />
        <meta property="og:description" content="A clear, plain-language guide to Ontario Small Claims Court in 2025: what's new, how to file, forms, settlement, trial, and enforcement." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://justice-bot.com/blog/ontario-small-claims-court-2025" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1555375771-14b2a63968a6" />
        <meta name="author" content="Justice-Bot Canada" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Ontario Small Claims Court Guide (2025 Update)",
            "description": "A clear, plain-language guide to Ontario Small Claims Court in 2025: what's new, how to file, forms, settlement, trial, and enforcement.",
            "image": "https://images.unsplash.com/photo-1555375771-14b2a63968a6",
            "datePublished": "2025-11-01",
            "author": {
              "@type": "Organization",
              "name": "Justice-Bot Canada"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Justice-Bot",
              "logo": {
                "@type": "ImageObject",
                "url": "https://justice-bot.com/justice-bot-logo.jpeg"
              }
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <article className="container mx-auto px-4 py-8 max-w-4xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <header className="mb-8">
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                November 2025
              </span>
              <span>·</span>
              <span>Justice-Bot Canada</span>
              <span>·</span>
              <span className="text-primary">Legal Help & Self-Representation</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Ontario Small Claims Court Guide (2025 Update)
            </h1>
            <p className="text-xl text-muted-foreground">
              Plain-language steps for filing, settlement, trial, and enforcement — updated for 2025 changes.
            </p>
          </header>

          <img 
            src="https://images.unsplash.com/photo-1555375771-14b2a63968a6" 
            alt="Ontario Courthouse exterior in daylight"
            className="w-full rounded-lg mb-8"
          />

          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4 border-l-4 border-primary pl-4">
                What's New in 2025
              </h2>
              <ul className="space-y-2 list-disc list-inside text-foreground/90">
                <li><strong>Monetary limit:</strong> Claims up to <strong>$35,000</strong> (unchanged from 2024)</li>
                <li><strong>Filing fee:</strong> Now <strong>$120</strong> for claims under $10K (was $115 in 2024); <strong>$210</strong> for claims $10K–$35K (was $205)</li>
                <li><strong>Mandatory mediation notice:</strong> All filings now require acknowledgment that mediation may be ordered</li>
                <li><strong>Digital forms:</strong> More courts accept e-filed forms via <a href="https://www.ontariocourtforms.on.ca" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ontariocourtforms.on.ca</a> (not all yet)</li>
              </ul>
            </CardContent>
          </Card>

          <section className="prose prose-lg max-w-none mb-8">
            <h2 className="text-3xl font-bold mb-4 border-l-4 border-primary pl-4">
              Who Can Use Small Claims Court?
            </h2>
            <p className="text-foreground/90 leading-relaxed mb-4">
              You can bring a claim in Ontario Small Claims Court if:
            </p>
            <ul className="space-y-2 list-disc list-inside text-foreground/90 mb-6">
              <li>Your claim is for <strong>money or personal property</strong> (not family law, criminal, or employment insurance)</li>
              <li>The total claim (including interest and costs) is <strong>$35,000 or less</strong></li>
              <li>You or the defendant live or carry on business in Ontario</li>
            </ul>

            <Alert className="mb-6">
              <AlertDescription>
                <strong>Tip:</strong> If your claim is worth more than $35K, you must either reduce it to $35K or file in Superior Court (which is more complex and expensive).
              </AlertDescription>
            </Alert>
          </section>

          <section className="prose prose-lg max-w-none mb-8">
            <h2 className="text-3xl font-bold mb-4 border-l-4 border-primary pl-4">
              Step 1: Prepare Your Claim
            </h2>
            
            <h3 className="text-2xl font-semibold mb-3 mt-6">Gather evidence</h3>
            <ul className="space-y-2 list-disc list-inside text-foreground/90 mb-6">
              <li>Contracts, invoices, receipts</li>
              <li>Photos, emails, text messages</li>
              <li>Witness statements or contact info</li>
            </ul>

            <h3 className="text-2xl font-semibold mb-3 mt-6">Calculate your damages</h3>
            <p className="text-foreground/90 leading-relaxed mb-4">
              Include the money owed (principal), plus any:
            </p>
            <ul className="space-y-2 list-disc list-inside text-foreground/90 mb-6">
              <li><strong>Interest:</strong> Under the <em>Courts of Justice Act</em>, you can claim pre-judgment interest at the prescribed rate (currently around 2–3% per year)</li>
              <li><strong>Costs:</strong> Court filing fees and reasonable out-of-pocket expenses</li>
            </ul>
            <p className="text-foreground/90 leading-relaxed mb-6">
              <strong>Remember:</strong> Your total must not exceed $35,000.
            </p>
          </section>

          <section className="prose prose-lg max-w-none mb-8">
            <h2 className="text-3xl font-bold mb-4 border-l-4 border-primary pl-4">
              Step 2: File Your Plaintiff's Claim (Form 7A)
            </h2>
            
            <h3 className="text-2xl font-semibold mb-3 mt-6">Where to file</h3>
            <p className="text-foreground/90 leading-relaxed mb-4">
              You file in the Small Claims Court nearest to where the defendant lives or does business, or where the incident occurred. Find your courthouse at:
            </p>
            <a 
              href="https://www.ontariocourts.ca/scj/small-claims/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline mb-6"
            >
              Ontario Courts - Small Claims
              <ExternalLink className="w-4 h-4" />
            </a>

            <h3 className="text-2xl font-semibold mb-3 mt-6">How to file</h3>
            <ol className="space-y-3 list-decimal list-inside text-foreground/90 mb-6">
              <li>Download <strong>Form 7A (Plaintiff's Claim)</strong> from <a href="https://www.ontariocourtforms.on.ca" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ontariocourtforms.on.ca</a></li>
              <li>Fill it out completely (your info, defendant's info, facts, amount claimed)</li>
              <li>Make 3 copies: one for you, one for the court, one for each defendant</li>
              <li>File in person or by mail with the <strong>filing fee</strong>:
                <ul className="ml-6 mt-2 space-y-1">
                  <li>$120 for claims under $10,000</li>
                  <li>$210 for claims $10,000–$35,000</li>
                </ul>
              </li>
              <li>The court clerk will issue your claim with a court file number</li>
            </ol>

            <Alert className="mb-6">
              <AlertDescription>
                <strong>2025 update:</strong> Some courthouses now accept e-filing. Check your local court's website for details.
              </AlertDescription>
            </Alert>
          </section>

          <section className="prose prose-lg max-w-none mb-8">
            <h2 className="text-3xl font-bold mb-4 border-l-4 border-primary pl-4">
              Step 3: Serve the Defendant
            </h2>
            <p className="text-foreground/90 leading-relaxed mb-4">
              You must <strong>serve</strong> (deliver) a copy of your claim to the defendant within 6 months of filing. Acceptable methods:
            </p>
            <ul className="space-y-2 list-disc list-inside text-foreground/90 mb-6">
              <li><strong>Personal service:</strong> Hand-deliver by an adult (not you)</li>
              <li><strong>Alternative service:</strong> Registered mail, courier, leaving it at their home/business</li>
              <li><strong>Substituted service:</strong> If they're avoiding service, you can ask the court for permission to serve another way (e.g., email, social media)</li>
            </ul>
            <p className="text-foreground/90 leading-relaxed mb-6">
              After serving, file an <strong>Affidavit of Service (Form 8A)</strong> with the court as proof.
            </p>
          </section>

          <section className="prose prose-lg max-w-none mb-8">
            <h2 className="text-3xl font-bold mb-4 border-l-4 border-primary pl-4">
              Step 4: Defendant's Response
            </h2>
            <p className="text-foreground/90 leading-relaxed mb-4">
              The defendant has <strong>20 days</strong> from being served to respond. They can:
            </p>
            <ul className="space-y-2 list-disc list-inside text-foreground/90 mb-6">
              <li><strong>File a Defence (Form 9A):</strong> Dispute your claim</li>
              <li><strong>File a Defendant's Claim (Form 10A):</strong> Countersue you</li>
              <li><strong>Do nothing:</strong> You can request a default judgment (automatic win)</li>
            </ul>

            <Alert className="mb-6">
              <AlertDescription>
                <strong>If they do nothing:</strong> Wait until after the 20-day deadline, then file a <strong>Default Judgment (Form 11B)</strong> and request payment.
              </AlertDescription>
            </Alert>
          </section>

          <section className="prose prose-lg max-w-none mb-8">
            <h2 className="text-3xl font-bold mb-4 border-l-4 border-primary pl-4">
              Step 5: Settlement Conference
            </h2>
            <p className="text-foreground/90 leading-relaxed mb-4">
              Before trial, the court will schedule a <strong>settlement conference</strong>—a meeting with a judge or referee to try to resolve the case. You must:
            </p>
            <ul className="space-y-2 list-disc list-inside text-foreground/90 mb-6">
              <li>Bring all evidence and documents</li>
              <li>Be prepared to negotiate a settlement</li>
              <li>Listen to the judge's evaluation of your case</li>
            </ul>
            <p className="text-foreground/90 leading-relaxed mb-6">
              <strong>Result:</strong> Many cases settle here. If not, the judge will set a trial date.
            </p>
          </section>

          <section className="prose prose-lg max-w-none mb-8">
            <h2 className="text-3xl font-bold mb-4 border-l-4 border-primary pl-4">
              Step 6: Trial
            </h2>
            <p className="text-foreground/90 leading-relaxed mb-4">
              If no settlement, you'll go to trial (usually 3–12 months after filing). At trial:
            </p>
            <ol className="space-y-3 list-decimal list-inside text-foreground/90 mb-6">
              <li><strong>You (plaintiff) present your case first:</strong> Tell your story, submit evidence, call witnesses</li>
              <li><strong>Defendant presents their case:</strong> Their version, evidence, witnesses</li>
              <li><strong>Both sides can cross-examine:</strong> Ask questions of the other side's witnesses</li>
              <li><strong>Judge makes a decision:</strong> Either immediately or in writing later</li>
            </ol>

            <h3 className="text-2xl font-semibold mb-3 mt-6">Tips for trial</h3>
            <ul className="space-y-2 list-disc list-inside text-foreground/90 mb-6">
              <li>Be organized: number your documents, prepare an outline</li>
              <li>Stick to facts: no arguing or emotions</li>
              <li>Speak clearly and directly to the judge</li>
              <li>Bring 3 copies of everything: one for you, one for the judge, one for the defendant</li>
            </ul>
          </section>

          <section className="prose prose-lg max-w-none mb-8">
            <h2 className="text-3xl font-bold mb-4 border-l-4 border-primary pl-4">
              Step 7: Enforcement
            </h2>
            <p className="text-foreground/90 leading-relaxed mb-4">
              If you win but the defendant doesn't pay, you can enforce the judgment:
            </p>
            <ul className="space-y-2 list-disc list-inside text-foreground/90 mb-6">
              <li><strong>Writ of Seizure and Sale (Form 20C):</strong> Seize and sell their property</li>
              <li><strong>Garnishment (Form 20E):</strong> Take money from their bank account or wages</li>
              <li><strong>Examination Hearing (Form 20H):</strong> Force them to disclose their assets</li>
            </ul>
            <p className="text-foreground/90 leading-relaxed mb-6">
              Enforcement costs money (filing fees) and time, so consider whether it's worth it.
            </p>
          </section>

          <Card className="bg-primary/5 border-primary/20 mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Common Mistakes to Avoid</h2>
              <ul className="space-y-2 list-disc list-inside text-foreground/90">
                <li><strong>Missing the 6-month service deadline:</strong> Your claim can be dismissed</li>
                <li><strong>Claiming over $35,000:</strong> Court has no jurisdiction</li>
                <li><strong>Not bringing enough copies:</strong> Bring 3 of everything</li>
                <li><strong>Showing up unprepared:</strong> No evidence = no win</li>
                <li><strong>Not responding to court orders:</strong> Can result in case dismissal</li>
              </ul>
            </CardContent>
          </Card>

          <section className="prose prose-lg max-w-none mb-8">
            <h2 className="text-3xl font-bold mb-4 border-l-4 border-primary pl-4">
              Resources
            </h2>
            <ul className="space-y-3 mb-6">
              <li>
                <a href="https://www.ontariocourts.ca/scj/small-claims/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-2">
                  Ontario Small Claims Court – Official Site
                  <ExternalLink className="w-4 h-4" />
                </a>
              </li>
              <li>
                <a href="https://www.ontariocourtforms.on.ca" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-2">
                  Ontario Court Forms
                  <ExternalLink className="w-4 h-4" />
                </a>
              </li>
              <li>
                <a href="https://www.legalaid.on.ca" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-2">
                  Legal Aid Ontario
                  <ExternalLink className="w-4 h-4" />
                </a>
              </li>
              <li>
                <Link to="/small-claims" className="text-primary hover:underline">
                  Justice-Bot Small Claims Journey Tool
                </Link>
              </li>
            </ul>
          </section>

          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-6 text-center">
              <h2 className="text-2xl font-bold mb-4">Need Help With Your Case?</h2>
              <p className="text-foreground/90 mb-6">
                Justice-Bot can guide you through forms, deadlines, and court procedures step-by-step.
              </p>
              <Link to="/journey">
                <Button size="lg" className="font-semibold">
                  Start Your Legal Journey
                </Button>
              </Link>
            </CardContent>
          </Card>
        </article>

        <Footer />
      </div>
    </>
  );
}
