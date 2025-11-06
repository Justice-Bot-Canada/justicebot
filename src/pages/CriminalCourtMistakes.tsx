import React from "react";
import { Link } from "react-router-dom";
import EnhancedSEO from "@/components/EnhancedSEO";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, MessageSquare, FileText, Scale, Clock, Users, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CriminalCourtMistakes = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "15 Common Mistakes in Criminal Cases: What to Avoid When Facing Charges",
    "description": "Learn the most common mistakes people make when facing criminal charges in Ontario and how to avoid them to protect your rights and get the best possible outcome",
    "author": {
      "@type": "Organization",
      "name": "Justice-Bot Legal Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Justice-Bot",
      "logo": {
        "@type": "ImageObject",
        "url": "https://justice-bot.com/justice-bot-logo.jpeg"
      }
    },
    "datePublished": "2025-01-27T00:00:00Z",
    "dateModified": new Date().toISOString()
  };

  const breadcrumbs = [
    { name: "Home", url: "https://justice-bot.com/" },
    { name: "Legal Resources", url: "https://justice-bot.com/legal-resources" },
    { name: "Criminal Court Mistakes", url: "https://justice-bot.com/criminal-court-mistakes" }
  ];

  const faqData = [
    {
      question: "What's the biggest mistake people make when arrested?",
      answer: "Talking to police without a lawyer. Many people think they can explain their way out of charges, but anything you say can and will be used against you. Exercise your right to remain silent and speak to a lawyer immediately."
    },
    {
      question: "Can I represent myself in criminal court?",
      answer: "While you have the right to self-representation, it's strongly discouraged. Criminal law is complex, and mistakes can result in jail time and a permanent criminal record. Even if you can't afford a lawyer, Legal Aid or duty counsel are available."
    },
    {
      question: "What happens if I miss a court date?",
      answer: "Missing court can result in a warrant for your arrest, additional charges for failure to appear, and difficulty getting bail in the future. Always attend all court dates or have your lawyer appear on your behalf if permitted."
    },
    {
      question: "Should I post about my case on social media?",
      answer: "No. Social media posts can be used as evidence against you. Police and Crown attorneys regularly check social media. Anything you post, including photos, videos, and comments, can undermine your defence."
    },
    {
      question: "Can I change my bail conditions if they're too strict?",
      answer: "Yes, you can apply to vary your bail conditions through a bail review. Your lawyer can help you demonstrate why changes are needed and propose reasonable alternatives."
    }
  ];

  return (
    <>
      <PerformanceMonitor />
      <EnhancedSEO
        title="15 Common Mistakes in Criminal Cases | Avoid These Errors"
        description="Avoid costly mistakes when facing criminal charges in Ontario. Learn what NOT to do, from talking to police without a lawyer to breaching bail conditions and missing court dates."
        keywords="criminal law mistakes, criminal charges errors, talking to police, bail conditions, criminal defence, legal representation, Ontario criminal court"
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
        faqData={faqData}
        articleData={{
          publishedTime: "2025-01-27T00:00:00Z",
          modifiedTime: new Date().toISOString(),
          author: "Justice-Bot Legal Team",
          section: "Criminal Law",
          tags: ["Criminal Law", "Legal Mistakes", "Criminal Defence", "Ontario", "Legal Rights"]
        }}
      />
      
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              15 Common Mistakes in Criminal Cases
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Learn what to avoid when facing criminal charges in Ontario to protect your rights 
              and achieve the best possible outcome
            </p>
          </div>

          <Alert className="mb-8 border-destructive/50">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Critical: Avoid These Mistakes</AlertTitle>
            <AlertDescription>
              The mistakes outlined below can seriously damage your case, lead to harsher penalties, or even 
              result in wrongful convictions. Knowledge is your first line of defence.
            </AlertDescription>
          </Alert>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Mistake 1 */}
            <Card className="border-l-4 border-l-destructive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-destructive" />
                  <span className="text-destructive">1.</span> Talking to Police Without a Lawyer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  <strong>The Mistake:</strong> Many people believe they can "explain their way out" of charges or 
                  that remaining silent makes them look guilty. They give statements to police hoping to clear things up.
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong>Why It's Dangerous:</strong> Police are trained interrogators. Anything you say can be taken 
                  out of context, misinterpreted, or used against you. Even innocent statements can be twisted. You 
                  cannot "talk your way out" of charges - that's what court is for.
                </p>
                <div className="bg-primary/5 p-4 rounded-md">
                  <p className="text-sm font-semibold mb-2">What to Do Instead:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Politely invoke your right to silence: "I wish to speak to a lawyer"</li>
                    <li>Do not answer questions beyond identifying yourself</li>
                    <li>Contact a criminal lawyer immediately - use duty counsel if needed</li>
                    <li>Do not waive your rights under any circumstances</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Mistake 2 */}
            <Card className="border-l-4 border-l-destructive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-destructive" />
                  <span className="text-destructive">2.</span> Not Hiring a Lawyer or Refusing Legal Aid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  <strong>The Mistake:</strong> Trying to represent yourself or refusing free legal assistance because 
                  of pride, misconceptions about Legal Aid, or thinking the charges aren't serious enough.
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong>Why It's Dangerous:</strong> Criminal law is incredibly complex. Judges, Crown attorneys, and 
                  police are legal professionals. Without proper representation, you don't know what you don't know - 
                  from Charter challenges to disclosure rights to negotiation tactics.
                </p>
                <div className="bg-primary/5 p-4 rounded-md">
                  <p className="text-sm font-semibold mb-2">What to Do Instead:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Apply for Legal Aid Ontario if you meet financial requirements</li>
                    <li>Speak with duty counsel at court (free for everyone)</li>
                    <li>Consider borrowing money or payment plans for a private lawyer</li>
                    <li>Remember: A criminal record costs far more than legal fees</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Mistake 3 */}
            <Card className="border-l-4 border-l-destructive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="w-6 h-6 text-destructive" />
                  <span className="text-destructive">3.</span> Breaching Bail Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  <strong>The Mistake:</strong> Violating bail conditions because you think they're unreasonable, 
                  forgetting about them, or believing "just this once won't matter."
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong>Why It's Dangerous:</strong> Breaching bail (Form 5.1, Form 11, or Form 32) is a separate 
                  criminal offence carrying up to 2 years in jail. It makes getting bail in the future nearly impossible 
                  and shows the court you can't follow orders.
                </p>
                <div className="bg-primary/5 p-4 rounded-md">
                  <p className="text-sm font-semibold mb-2">What to Do Instead:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Write down all bail conditions and review them daily</li>
                    <li>If conditions are too restrictive, apply for a bail variation</li>
                    <li>Set phone reminders for curfews and reporting times</li>
                    <li>Ask your lawyer or surety if you're unsure about any condition</li>
                    <li>Never contact prohibited persons, even if they contact you first</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Mistake 4 */}
            <Card className="border-l-4 border-l-destructive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-6 h-6 text-destructive" />
                  <span className="text-destructive">4.</span> Missing Court Dates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  <strong>The Mistake:</strong> Forgetting court dates, thinking one missed appearance won't matter, 
                  or being too scared/embarrassed to attend.
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong>Why It's Dangerous:</strong> Missing court results in a warrant for your arrest, an additional 
                  charge for failure to appear (up to 2 years jail), and loss of bail. Future bail becomes extremely 
                  difficult or impossible.
                </p>
                <div className="bg-primary/5 p-4 rounded-md">
                  <p className="text-sm font-semibold mb-2">What to Do Instead:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Mark all court dates in multiple calendars</li>
                    <li>Set multiple reminders (1 week, 1 day, morning of)</li>
                    <li>Plan transportation in advance</li>
                    <li>If emergency prevents attendance, call your lawyer and court immediately</li>
                    <li>Arrive early - courts are busy and delays happen</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Mistake 5 */}
            <Card className="border-l-4 border-l-destructive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-destructive" />
                  <span className="text-destructive">5.</span> Discussing Your Case on Social Media
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  <strong>The Mistake:</strong> Posting about your case, charges, or the alleged incident on Facebook, 
                  Instagram, Twitter, or other social media platforms.
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong>Why It's Dangerous:</strong> Police and Crown attorneys regularly monitor social media. Your 
                  posts can be used as evidence, contradicting your defence. Photos, videos, check-ins, and even "likes" 
                  can damage your case.
                </p>
                <div className="bg-primary/5 p-4 rounded-md">
                  <p className="text-sm font-semibold mb-2">What to Do Instead:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Do not post anything about your charges or case</li>
                    <li>Set all profiles to private</li>
                    <li>Consider deactivating accounts temporarily</li>
                    <li>Tell friends/family not to post about your case</li>
                    <li>Assume everything online will be seen by police and Crown</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Mistake 6 */}
            <Card className="border-l-4 border-l-destructive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-destructive" />
                  <span className="text-destructive">6.</span> Discussing Your Case with Friends or Family
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  <strong>The Mistake:</strong> Openly discussing case details, evidence, or strategy with friends, 
                  family, or other inmates (if in custody).
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong>Why It's Dangerous:</strong> These people can be compelled to testify against you. Jail 
                  informants are common. There's no privilege protecting these conversations (unlike lawyer-client).
                </p>
                <div className="bg-primary/5 p-4 rounded-md">
                  <p className="text-sm font-semibold mb-2">What to Do Instead:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Only discuss case details with your lawyer</li>
                    <li>Tell loved ones you can't discuss specifics</li>
                    <li>Never discuss your case with cellmates or other accused persons</li>
                    <li>Be aware that jail phones are often recorded</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Mistake 7 */}
            <Card className="border-l-4 border-l-destructive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-6 h-6 text-destructive" />
                  <span className="text-destructive">7.</span> Not Reviewing Disclosure Carefully
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  <strong>The Mistake:</strong> Letting your lawyer handle everything without reviewing the Crown's 
                  evidence package yourself, or not identifying errors and inconsistencies.
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong>Why It's Dangerous:</strong> You know the facts better than anyone. You can spot 
                  inaccuracies, missing evidence, or inconsistencies your lawyer might miss. This information is 
                  crucial for your defence.
                </p>
                <div className="bg-primary/5 p-4 rounded-md">
                  <p className="text-sm font-semibold mb-2">What to Do Instead:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Read every page of disclosure carefully</li>
                    <li>Make notes of errors, inconsistencies, or missing information</li>
                    <li>Provide your lawyer with your observations</li>
                    <li>Ask questions if you don't understand something</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Mistake 8 */}
            <Card className="border-l-4 border-l-destructive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-6 h-6 text-destructive" />
                  <span className="text-destructive">8.</span> Consenting to Searches Without a Warrant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  <strong>The Mistake:</strong> Allowing police to search your home, car, or phone without a warrant 
                  because you "have nothing to hide" or feel pressured.
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong>Why It's Dangerous:</strong> You can't predict what police will find significant. Innocent 
                  items can be interpreted as evidence. Consenting waives your Charter rights and makes evidence 
                  admissible.
                </p>
                <div className="bg-primary/5 p-4 rounded-md">
                  <p className="text-sm font-semibold mb-2">What to Do Instead:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Politely refuse consent: "I do not consent to any searches"</li>
                    <li>If police have a warrant, do not resist but say you don't consent</li>
                    <li>Do not touch or point to anything</li>
                    <li>Document what was searched and seized</li>
                    <li>Inform your lawyer immediately</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Mistake 9 */}
            <Card className="border-l-4 border-l-destructive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                  <span className="text-destructive">9.</span> Lying to Your Lawyer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  <strong>The Mistake:</strong> Withholding information or lying to your lawyer because you're 
                  embarrassed, worried they'll judge you, or think it's not relevant.
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong>Why It's Dangerous:</strong> Your lawyer needs all facts to prepare the best defence. 
                  Surprises at trial can destroy your case. Lawyer-client privilege protects your communications - 
                  they cannot share what you tell them.
                </p>
                <div className="bg-primary/5 p-4 rounded-md">
                  <p className="text-sm font-semibold mb-2">What to Do Instead:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Be completely honest with your lawyer about everything</li>
                    <li>Share information even if you think it's bad for your case</li>
                    <li>Trust in solicitor-client privilege</li>
                    <li>Let your lawyer decide what's relevant</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Mistake 10 */}
            <Card className="border-l-4 border-l-destructive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="w-6 h-6 text-destructive" />
                  <span className="text-destructive">10.</span> Pleading Guilty Without Understanding Consequences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  <strong>The Mistake:</strong> Pleading guilty to "get it over with," without understanding the 
                  long-term consequences or exploring other options like peace bonds or withdrawal.
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong>Why It's Dangerous:</strong> A criminal conviction is permanent and affects employment, 
                  travel (especially to USA), professional licensing, volunteering, and more. You cannot take back a 
                  guilty plea once entered.
                </p>
                <div className="bg-primary/5 p-4 rounded-md">
                  <p className="text-sm font-semibold mb-2">What to Do Instead:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Discuss all possible resolutions with your lawyer</li>
                    <li>Understand what a conviction means for your specific situation</li>
                    <li>Consider peace bonds (s. 810) which avoid convictions</li>
                    <li>Explore diversion programs if available</li>
                    <li>Only plead guilty when it's truly in your best interest</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Mistake 11 */}
            <Card className="border-l-4 border-l-destructive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-destructive" />
                  <span className="text-destructive">11.</span> Contacting Victims or Witnesses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  <strong>The Mistake:</strong> Trying to convince the victim/complainant to drop charges, apologizing, 
                  or attempting to "work things out" directly.
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong>Why It's Dangerous:</strong> This usually violates bail conditions and can result in new 
                  charges for witness intimidation or obstruction of justice. Even well-intentioned contact can be 
                  interpreted as threatening.
                </p>
                <div className="bg-primary/5 p-4 rounded-md">
                  <p className="text-sm font-semibold mb-2">What to Do Instead:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Have no contact whatsoever with complainants or witnesses</li>
                    <li>Don't use third parties to pass messages</li>
                    <li>If they contact you, do not respond and inform your lawyer</li>
                    <li>Let your lawyer handle any negotiations</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Mistake 12 */}
            <Card className="border-l-4 border-l-destructive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-6 h-6 text-destructive" />
                  <span className="text-destructive">12.</span> Not Addressing Underlying Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  <strong>The Mistake:</strong> Ignoring substance abuse, mental health issues, or anger management 
                  problems that contributed to the charges.
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong>Why It's Dangerous:</strong> Courts want to see rehabilitation. Taking proactive steps shows 
                  remorse and reduces the risk of reoffending, leading to better outcomes at sentencing.
                </p>
                <div className="bg-primary/5 p-4 rounded-md">
                  <p className="text-sm font-semibold mb-2">What to Do Instead:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Enroll in counselling or treatment programs immediately</li>
                    <li>Attend AA/NA meetings if substance abuse is a factor</li>
                    <li>Get documentation of all steps taken</li>
                    <li>Show the court you're taking responsibility</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Mistake 13 */}
            <Card className="border-l-4 border-l-destructive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-6 h-6 text-destructive" />
                  <span className="text-destructive">13.</span> Poor Courtroom Behaviour
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  <strong>The Mistake:</strong> Being late, dressing inappropriately, showing disrespect, chewing gum, 
                  using phones, or displaying attitude in court.
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong>Why It's Dangerous:</strong> Judges notice everything. Poor behaviour suggests lack of 
                  remorse, disrespect for the justice system, and inability to follow rules - all factors that can 
                  influence bail decisions and sentencing.
                </p>
                <div className="bg-primary/5 p-4 rounded-md">
                  <p className="text-sm font-semibold mb-2">What to Do Instead:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Arrive at least 30 minutes early</li>
                    <li>Dress professionally (business casual minimum)</li>
                    <li>Turn off your phone completely</li>
                    <li>Stand when the judge enters/exits</li>
                    <li>Address the judge as "Your Honour"</li>
                    <li>Never interrupt or speak out of turn</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Mistake 14 */}
            <Card className="border-l-4 border-l-destructive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                  <span className="text-destructive">14.</span> Continuing Criminal Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  <strong>The Mistake:</strong> Committing new offences while on bail or during court proceedings.
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong>Why It's Dangerous:</strong> New charges while on bail virtually guarantee detention, make 
                  future bail impossible, demonstrate to the court you cannot follow rules, and result in harsher 
                  sentences on all charges.
                </p>
                <div className="bg-primary/5 p-4 rounded-md">
                  <p className="text-sm font-semibold mb-2">What to Do Instead:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Stay completely law-abiding while your case is pending</li>
                    <li>Avoid situations that could lead to trouble</li>
                    <li>Change your lifestyle if necessary</li>
                    <li>Surround yourself with positive influences</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Mistake 15 */}
            <Card className="border-l-4 border-l-destructive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-6 h-6 text-destructive" />
                  <span className="text-destructive">15.</span> Not Being Patient with the Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  <strong>The Mistake:</strong> Getting frustrated with delays and wanting to "just get it over with" 
                  by pleading guilty or accepting a bad deal.
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong>Why It's Dangerous:</strong> Criminal cases take time - sometimes 12-18+ months. Rushing can 
                  result in accepting deals that aren't in your best interest. Sometimes delay works in your favor as 
                  witnesses forget details or Crown's case weakens.
                </p>
                <div className="bg-primary/5 p-4 rounded-md">
                  <p className="text-sm font-semibold mb-2">What to Do Instead:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Trust your lawyer's timeline and strategy</li>
                    <li>Use the time to address underlying issues and build your case</li>
                    <li>Understand that good outcomes take time</li>
                    <li>Focus on compliance with bail conditions and rehabilitation</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Summary Section */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle>Key Takeaways</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Facing criminal charges is one of the most stressful experiences you can go through. However, 
                  avoiding these common mistakes can significantly improve your outcome:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Exercise your right to silence and get a lawyer immediately</li>
                  <li>Follow all bail conditions to the letter</li>
                  <li>Never miss court dates</li>
                  <li>Keep off social media</li>
                  <li>Be honest with your lawyer</li>
                  <li>Take responsibility for underlying issues</li>
                  <li>Show respect in court</li>
                  <li>Be patient with the process</li>
                </ul>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold mb-4 text-foreground">Need Help With Your Criminal Case?</h3>
                <p className="text-muted-foreground mb-6">
                  Knowledge is power, but professional guidance is essential. Justice-Bot can help you understand your 
                  charges, prepare your defence, and connect with legal resources. Don't make these mistakes - get help 
                  now.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild>
                    <Link to="/criminal-journey">Start Criminal Journey</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/criminal-court-guide">Read Full Guide</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/legal-chat">Chat With AI Legal Assistant</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default CriminalCourtMistakes;