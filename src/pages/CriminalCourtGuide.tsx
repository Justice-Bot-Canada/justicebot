import React from "react";
import { Link } from "react-router-dom";
import EnhancedSEO from "@/components/EnhancedSEO";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scale, FileText, Shield, AlertCircle, Gavel, Users, BookOpen, Clock } from "lucide-react";

const CriminalCourtGuide = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Ultimate Guide to Criminal Court in Ontario: Process, Rights, and What to Expect",
    "description": "Comprehensive guide covering criminal court proceedings in Ontario, from charges to trial, including your rights, bail procedures, and the justice system process",
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
    { name: "Criminal Court Guide", url: "https://justice-bot.com/criminal-court-guide" }
  ];

  const faqData = [
    {
      question: "What happens when I'm arrested?",
      answer: "When arrested, police must inform you of the reason for arrest and your rights under the Canadian Charter of Rights and Freedoms. You have the right to remain silent, speak to a lawyer immediately, and be informed of these rights. Police may search you and your immediate surroundings for weapons or evidence."
    },
    {
      question: "What is bail and how does it work in Ontario?",
      answer: "Bail (judicial interim release) is the temporary release of an accused person while awaiting trial. In Ontario, you may be released by police on an Undertaking (Form 5.1), or you may need a bail hearing before a Justice of the Peace. Bail conditions may include curfews, no-contact orders, and reporting requirements."
    },
    {
      question: "Do I need a lawyer for criminal charges?",
      answer: "Yes, it is strongly recommended to have legal representation for any criminal charge. Criminal convictions can result in jail time, fines, and a permanent criminal record affecting employment and travel. Legal Aid Ontario may provide a lawyer if you qualify financially."
    },
    {
      question: "What is the difference between summary and indictable offences?",
      answer: "Summary offences are less serious crimes with maximum penalties of 2 years less a day in jail and/or fines up to $5,000. Indictable offences are more serious with higher penalties including longer jail sentences. Some offences are hybrid, where the Crown chooses how to proceed."
    },
    {
      question: "Can I represent myself in criminal court?",
      answer: "While you have the right to self-representation, it is not recommended for criminal matters. The criminal justice system is complex, and mistakes can result in serious consequences. Even with a lawyer, understanding your case is important for making informed decisions."
    }
  ];

  return (
    <>
      <PerformanceMonitor />
      <EnhancedSEO
        title="Ultimate Guide to Criminal Court in Ontario | Criminal Law Process"
        description="Complete guide to criminal court proceedings in Ontario. Learn about arrests, bail, trials, your legal rights, and navigating the criminal justice system from charges to resolution."
        keywords="criminal court Ontario, criminal charges, bail hearing, criminal trial, legal rights, criminal law, Ontario justice system, criminal defence, legal representation"
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
        faqData={faqData}
        articleData={{
          publishedTime: "2025-01-27T00:00:00Z",
          modifiedTime: new Date().toISOString(),
          author: "Justice-Bot Legal Team",
          section: "Criminal Law",
          tags: ["Criminal Court", "Criminal Law", "Ontario", "Legal Rights", "Bail", "Trial"]
        }}
      />
      
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Ultimate Guide to Criminal Court in Ontario
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A comprehensive resource for understanding criminal proceedings, your legal rights, 
              and what to expect when facing criminal charges in Ontario
            </p>
          </div>

          {/* Quick Navigation */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Quick Navigation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <a href="#understanding-charges" className="text-primary hover:underline">Understanding Criminal Charges</a>
                <a href="#arrest-rights" className="text-primary hover:underline">Arrest and Your Rights</a>
                <a href="#bail-process" className="text-primary hover:underline">Bail and Release</a>
                <a href="#court-process" className="text-primary hover:underline">Court Process</a>
                <a href="#legal-representation" className="text-primary hover:underline">Legal Representation</a>
                <a href="#trial-process" className="text-primary hover:underline">Trial Process</a>
                <a href="#sentencing" className="text-primary hover:underline">Sentencing</a>
                <a href="#appeals" className="text-primary hover:underline">Appeals</a>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="space-y-12">
            {/* Introduction */}
            <section>
              <h2 className="text-3xl font-bold mb-4 text-foreground">Introduction to Criminal Law in Ontario</h2>
              <p className="text-muted-foreground mb-4">
                The criminal justice system in Ontario is designed to balance public safety with individual rights 
                and freedoms. Understanding how the system works is crucial when facing criminal charges, as the 
                consequences can be life-changing. This guide provides a comprehensive overview of criminal proceedings 
                in Ontario, from the moment of arrest through to trial and beyond.
              </p>
              <p className="text-muted-foreground mb-4">
                Criminal law in Canada is governed by the Criminal Code, a federal statute that applies across all 
                provinces and territories. However, provincial courts handle most criminal matters, and Ontario has 
                its own court system and procedures. This guide focuses specifically on Ontario's criminal justice system.
              </p>
            </section>

            {/* Understanding Charges */}
            <section id="understanding-charges">
              <h2 className="text-3xl font-bold mb-6 text-foreground flex items-center gap-2">
                <FileText className="w-8 h-8" />
                Understanding Criminal Charges
              </h2>
              
              <h3 className="text-2xl font-semibold mb-3 text-foreground">Types of Criminal Offences</h3>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Summary Offences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">Less serious crimes with lighter penalties:</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Max 2 years less a day in jail</li>
                      <li>Fines up to $5,000</li>
                      <li>No preliminary inquiry</li>
                      <li>Tried in provincial court</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Indictable Offences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">More serious crimes with severe penalties:</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Longer jail sentences</li>
                      <li>Higher fines</li>
                      <li>May have preliminary inquiry</li>
                      <li>Some tried in Superior Court</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Hybrid Offences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">Crown chooses how to proceed:</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Can be summary or indictable</li>
                      <li>Decision based on severity</li>
                      <li>Most common type</li>
                      <li>Examples: assault, theft under $5000</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <h3 className="text-2xl font-semibold mb-3 text-foreground">Common Criminal Charges in Ontario</h3>
              <p className="text-muted-foreground mb-4">
                Understanding the nature of your charges is the first step in mounting an effective defence. Here are 
                some of the most common criminal charges in Ontario:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                <li><strong>Assault:</strong> Applying force to another person without consent (s. 266)</li>
                <li><strong>Theft:</strong> Taking property without permission with intent to deprive (s. 322)</li>
                <li><strong>Mischief:</strong> Damaging or interfering with property (s. 430)</li>
                <li><strong>Impaired Driving:</strong> Operating a vehicle while impaired by drugs or alcohol (s. 320.14)</li>
                <li><strong>Drug Possession:</strong> Possessing controlled substances (Controlled Drugs and Substances Act)</li>
                <li><strong>Fraud:</strong> Deception for financial gain (s. 380)</li>
                <li><strong>Break and Enter:</strong> Unlawful entry with intent to commit crime (s. 348)</li>
                <li><strong>Breach of Conditions:</strong> Violating bail or probation terms (s. 145)</li>
              </ul>
            </section>

            {/* Arrest and Rights */}
            <section id="arrest-rights">
              <h2 className="text-3xl font-bold mb-6 text-foreground flex items-center gap-2">
                <Shield className="w-8 h-8" />
                Arrest and Your Charter Rights
              </h2>
              
              <Card className="mb-6 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Your Rights Upon Arrest
                </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Under the Canadian Charter of Rights and Freedoms, you have specific rights when arrested:
                  </p>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="font-semibold min-w-fit">Section 10(a):</span>
                      <span>Right to be informed promptly of the reasons for your arrest or detention</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold min-w-fit">Section 10(b):</span>
                      <span>Right to retain and instruct counsel without delay and to be informed of that right</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold min-w-fit">Section 7:</span>
                      <span>Right to remain silent - you don't have to answer police questions</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold min-w-fit">Section 9:</span>
                      <span>Right not to be arbitrarily detained or imprisoned</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <h3 className="text-2xl font-semibold mb-3 text-foreground">What Police Can and Cannot Do</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <Card className="border-green-500/20">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-600 dark:text-green-400">Police CAN:</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                      <li>Ask for your name and address</li>
                      <li>Search you for weapons upon arrest</li>
                      <li>Search the immediate area for evidence</li>
                      <li>Take your photo and fingerprints</li>
                      <li>Hold you for up to 24 hours before a bail hearing</li>
                      <li>Search with a warrant</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-red-500/20">
                  <CardHeader>
                    <CardTitle className="text-lg text-red-600 dark:text-red-400">Police CANNOT:</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                      <li>Force you to answer questions</li>
                      <li>Deny you access to a lawyer</li>
                      <li>Search your home without a warrant (with exceptions)</li>
                      <li>Use excessive force</li>
                      <li>Lie about evidence against you (generally)</li>
                      <li>Continue questioning after you invoke right to silence</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <h3 className="text-2xl font-semibold mb-3 text-foreground">After Arrest: What Happens Next</h3>
              <p className="text-muted-foreground mb-4">
                After arrest, you'll typically be taken to a police station for processing. This includes:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-4">
                <li>Booking (recording personal information)</li>
                <li>Fingerprinting and photographing</li>
                <li>Search and property inventory</li>
                <li>Opportunity to contact a lawyer</li>
                <li>Decision on release or detention</li>
              </ol>
            </section>

            {/* Bail Process */}
            <section id="bail-process">
              <h2 className="text-3xl font-bold mb-6 text-foreground flex items-center gap-2">
                <Scale className="w-8 h-8" />
                Bail and Release Procedures
              </h2>
              
              <p className="text-muted-foreground mb-6">
                In Canada, there's a presumption in favor of release. This means you should generally be released 
                unless there's a good reason to keep you in custody. The bail system has three main considerations:
              </p>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Primary Ground</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Ensuring your attendance in court. Will you show up for your court dates?
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Secondary Ground</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Protection and safety of the public. Are you a risk to commit further crimes?
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tertiary Ground</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Maintaining confidence in the justice system. Is detention necessary for public confidence?
                    </p>
                  </CardContent>
                </Card>
              </div>

              <h3 className="text-2xl font-semibold mb-3 text-foreground">Types of Release</h3>
              
              <div className="space-y-4 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Form 5.1 - Undertaking to Peace Officer</CardTitle>
                    <CardDescription>Release by police without a court appearance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      Police may release you directly from the station by having you sign an undertaking with conditions. 
                      This is the least restrictive form of release.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Common conditions: appear in court, keep the peace, no contact with victims/witnesses, stay away 
                      from certain places.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Form 11 - Recognizance</CardTitle>
                    <CardDescription>Release by officer in charge</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      A promise to pay a sum of money if you fail to appear in court or breach conditions. May or may 
                      not require a deposit.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Form 32 - Recognizance Before Justice</CardTitle>
                    <CardDescription>Court-ordered release with conditions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      If police don't release you, you'll have a bail hearing before a Justice of the Peace (usually 
                      within 24 hours). The Justice will decide on release conditions and whether a surety is required.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <h3 className="text-2xl font-semibold mb-3 text-foreground">Bail Hearing Process</h3>
              <p className="text-muted-foreground mb-4">
                If you're not released by police, you'll appear before a Justice of the Peace for a bail hearing. 
                Here's what to expect:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                <li>Crown presents reasons why you should be detained</li>
                <li>Your lawyer argues for your release and proposes conditions</li>
                <li>A surety may be required (someone who supervises you and ensures compliance)</li>
                <li>Justice decides whether to grant bail and sets conditions</li>
                <li>Breach of bail conditions is a separate criminal offence</li>
              </ul>
            </section>

            {/* Court Process */}
            <section id="court-process">
              <h2 className="text-3xl font-bold mb-6 text-foreground flex items-center gap-2">
                <Gavel className="w-8 h-8" />
                The Court Process
              </h2>
              
              <h3 className="text-2xl font-semibold mb-3 text-foreground">First Appearance</h3>
              <p className="text-muted-foreground mb-4">
                Your first court appearance is typically brief and procedural. Here's what happens:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                <li>Charges are read and you confirm you understand them</li>
                <li>Crown discloses initial evidence (disclosure package)</li>
                <li>Case is set for a future date (usually 2-6 weeks)</li>
                <li>No plea is entered at this stage</li>
                <li>Bail conditions may be reviewed if needed</li>
              </ul>

              <h3 className="text-2xl font-semibold mb-3 text-foreground">Disclosure</h3>
              <p className="text-muted-foreground mb-4">
                The Crown must provide you with all evidence they have against you. This is called "disclosure" and 
                typically includes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                <li>Police reports and witness statements</li>
                <li>Photos, videos, and audio recordings</li>
                <li>Forensic reports and lab results</li>
                <li>Any exculpatory evidence (evidence that helps your case)</li>
                <li>911 calls and dispatch records</li>
              </ul>

              <h3 className="text-2xl font-semibold mb-3 text-foreground">Resolution Options</h3>
              <div className="space-y-4 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Withdrawal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Crown determines there's insufficient evidence or it's not in the public interest to proceed. 
                      Charges are dropped entirely.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Peace Bond (Section 810)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Agreement to keep the peace for a period (usually 12 months). Not a guilty plea or criminal 
                      conviction. May have conditions similar to probation.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Guilty Plea</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Admitting guilt to the charges. May be negotiated with Crown for reduced charges or joint 
                      submission on sentence. Results in a criminal conviction.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Trial</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Pleading not guilty and proceeding to trial. Crown must prove guilt beyond a reasonable doubt. 
                      May be before a judge alone or judge and jury depending on the offence.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Legal Representation */}
            <section id="legal-representation">
              <h2 className="text-3xl font-bold mb-6 text-foreground flex items-center gap-2">
                <Users className="w-8 h-8" />
                Legal Representation
              </h2>
              
              <p className="text-muted-foreground mb-6">
                Having competent legal representation is crucial in criminal matters. A criminal conviction can have 
                serious and lasting consequences on your life, employment, and ability to travel.
              </p>

              <h3 className="text-2xl font-semibold mb-3 text-foreground">Types of Legal Representation</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Private Criminal Lawyer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                      <li>Hired directly by you</li>
                      <li>More control over choice of lawyer</li>
                      <li>May have more time for your case</li>
                      <li>Can be expensive ($3,000-$50,000+)</li>
                      <li>Experience varies widely</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Legal Aid Ontario</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                      <li>Government-funded legal services</li>
                      <li>Must meet financial eligibility</li>
                      <li>Assigned lawyer or duty counsel</li>
                      <li>Free or low-cost</li>
                      <li>Often experienced criminal lawyers</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <h3 className="text-2xl font-semibold mb-3 text-foreground">Duty Counsel</h3>
              <p className="text-muted-foreground mb-4">
                Duty counsel are lawyers available at court to provide free legal advice and representation for bail 
                hearings and first appearances. They can:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                <li>Provide legal advice about your charges</li>
                <li>Represent you at bail hearings</li>
                <li>Help with first appearances</li>
                <li>Assist with guilty pleas on summary matters</li>
                <li>Available to anyone regardless of income</li>
              </ul>
            </section>

            {/* Trial Process */}
            <section id="trial-process">
              <h2 className="text-3xl font-bold mb-6 text-foreground flex items-center gap-2">
                <Clock className="w-8 h-8" />
                Trial Process and Timeline
              </h2>
              
              <p className="text-muted-foreground mb-6">
                If your case goes to trial, here's what to expect. Keep in mind that most cases resolve before trial 
                through withdrawal, peace bonds, or guilty pleas.
              </p>

              <h3 className="text-2xl font-semibold mb-3 text-foreground">Pre-Trial Proceedings</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                <li><strong>Judicial Pre-Trial (JPT):</strong> Meeting with judge, Crown, and defence to discuss case</li>
                <li><strong>Charter Applications:</strong> Challenging evidence or police conduct under Charter rights</li>
                <li><strong>Preliminary Inquiry:</strong> For indictable offences, hearing to determine if enough evidence for trial</li>
                <li><strong>Disclosure Review:</strong> Ongoing review of Crown's evidence and additional disclosure</li>
              </ul>

              <h3 className="text-2xl font-semibold mb-3 text-foreground">The Trial</h3>
              <p className="text-muted-foreground mb-4">A typical trial follows this sequence:</p>
              <ol className="list-decimal list-inside space-y-3 text-muted-foreground mb-6">
                <li><strong>Opening Statements:</strong> Crown outlines case (defence may or may not give opening)</li>
                <li><strong>Crown's Case:</strong> Crown calls witnesses and presents evidence</li>
                <li><strong>Cross-Examination:</strong> Defence questions Crown witnesses</li>
                <li><strong>Defence Motion:</strong> Defence may argue insufficient evidence (rare to succeed)</li>
                <li><strong>Defence Case:</strong> Defence may call witnesses or present evidence (not required)</li>
                <li><strong>Closing Arguments:</strong> Both sides summarize their positions</li>
                <li><strong>Verdict:</strong> Judge or jury delivers guilty or not guilty verdict</li>
              </ol>

              <h3 className="text-2xl font-semibold mb-3 text-foreground">Your Right to Remain Silent</h3>
              <p className="text-muted-foreground mb-4">
                You are never required to testify at your own trial. The Crown must prove your guilt beyond a reasonable 
                doubt without your testimony. Your lawyer will advise whether testifying is in your best interest.
              </p>
            </section>

            {/* Sentencing */}
            <section id="sentencing">
              <h2 className="text-3xl font-bold mb-6 text-foreground">Sentencing</h2>
              
              <p className="text-muted-foreground mb-6">
                If found guilty or you plead guilty, the court will hold a sentencing hearing. The judge considers:
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Aggravating Factors</CardTitle>
                    <CardDescription>Factors that increase sentence</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Prior criminal record</li>
                      <li>Serious harm to victim</li>
                      <li>Breach of trust</li>
                      <li>Planned or deliberate conduct</li>
                      <li>Vulnerable victim</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Mitigating Factors</CardTitle>
                    <CardDescription>Factors that decrease sentence</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>No prior record</li>
                      <li>Early guilty plea</li>
                      <li>Remorse and acceptance of responsibility</li>
                      <li>Steps taken for rehabilitation</li>
                      <li>Support in the community</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <h3 className="text-2xl font-semibold mb-3 text-foreground">Types of Sentences</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                <li><strong>Absolute Discharge:</strong> No conviction, no conditions, clean record after 1 year</li>
                <li><strong>Conditional Discharge:</strong> No conviction if conditions met, clean record after 3 years</li>
                <li><strong>Fine:</strong> Monetary penalty, may have time to pay</li>
                <li><strong>Probation:</strong> Supervision in community with conditions (up to 3 years)</li>
                <li><strong>Conditional Sentence:</strong> Jail sentence served in community with strict conditions</li>
                <li><strong>Jail Time:</strong> Custody in provincial jail (under 2 years) or federal prison (2+ years)</li>
              </ul>
            </section>

            {/* Appeals */}
            <section id="appeals">
              <h2 className="text-3xl font-bold mb-6 text-foreground">Appeals</h2>
              
              <p className="text-muted-foreground mb-4">
                You have the right to appeal a conviction or sentence if you believe there was an error in law, 
                unreasonable verdict, or miscarriage of justice. Appeals must be filed within strict timelines:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                <li>Summary convictions: 30 days to Superior Court of Justice</li>
                <li>Indictable convictions: 30 days to Court of Appeal for Ontario</li>
                <li>Extensions possible with good reason</li>
                <li>May need to apply for bail pending appeal</li>
              </ul>
            </section>

            {/* Call to Action */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold mb-4 text-foreground">Get Help With Your Criminal Case</h3>
                <p className="text-muted-foreground mb-6">
                  Facing criminal charges is serious. Justice-Bot can help you understand your charges, prepare for 
                  court, and connect with legal resources. Start by assessing your case or exploring our criminal law 
                  journey.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild>
                    <Link to="/criminal-journey">Start Criminal Journey</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/case-assessment">Assess Your Case</Link>
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

export default CriminalCourtGuide;