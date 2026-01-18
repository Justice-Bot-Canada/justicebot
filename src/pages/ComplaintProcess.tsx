import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Clock, CheckCircle, MessageSquare } from "lucide-react";

const ComplaintProcess = () => {
  const currentDate = new Date().toLocaleDateString('en-CA', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <>
      <SEOHead
        title="Complaint Process | Justice-Bot"
        description="Justice-Bot is committed to fair treatment and accountability. Learn how to submit a complaint and our response process."
        keywords="complaint process, accountability, Justice-Bot complaints, feedback"
      />
      <Header />
      <main className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Formal Complaint & Accountability Process
            </h1>
            <p className="text-muted-foreground">
              Last updated: {currentDate}
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <p className="text-lg text-foreground leading-relaxed">
                Justice-Bot is committed to fair treatment and accountability.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <section>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    How to Submit a Complaint
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-foreground">
                    Users may submit complaints by email to:
                  </p>
                  <a 
                    href="mailto:complaints@justice-bot.com" 
                    className="text-primary font-semibold hover:underline block"
                  >
                    complaints@justice-bot.com
                  </a>
                  
                  <div className="mt-6">
                    <p className="text-foreground font-medium mb-3">Please include:</p>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        Your name and contact information
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        A description of the concern
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        Relevant dates or screenshots, if applicable
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Response Process
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4 text-foreground">
                    <li className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold flex-shrink-0">
                        1
                      </div>
                      <div>
                        <p className="font-medium">Acknowledgment</p>
                        <p className="text-muted-foreground">
                          Complaints will be acknowledged within 2 business days
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold flex-shrink-0">
                        2
                      </div>
                      <div>
                        <p className="font-medium">Substantive Response</p>
                        <p className="text-muted-foreground">
                          A substantive response will be provided within 10 business days
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold flex-shrink-0">
                        3
                      </div>
                      <div>
                        <p className="font-medium">Corrective Action</p>
                        <p className="text-muted-foreground">
                          Where appropriate, corrective action will be taken
                        </p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section>
              <Card className="bg-muted/30">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium text-foreground mb-2">Questions?</p>
                      <p className="text-muted-foreground">
                        For general inquiries, please contact{" "}
                        <a 
                          href="mailto:admin@justice-bot.com" 
                          className="text-primary hover:underline"
                        >
                          admin@justice-bot.com
                        </a>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ComplaintProcess;
