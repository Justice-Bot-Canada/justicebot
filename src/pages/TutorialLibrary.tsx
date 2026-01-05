import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TutorialVideos from "@/components/TutorialVideos";
import VideoShowcase from "@/components/VideoShowcase";
import EnhancedSEO from "@/components/EnhancedSEO";
import { CanonicalURL } from "@/components/CanonicalURL";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayCircle, Video } from "lucide-react";

export default function TutorialLibrary() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Justice-Bot Legal Tutorial Videos",
    "description": "Free video tutorials teaching Canadians how to navigate legal processes including LTB applications, HRTO complaints, Small Claims Court, and more.",
    "url": "https://justice-bot.com/tutorials",
    "itemListElement": [
      {
        "@type": "VideoObject",
        "name": "How to File an LTB Application",
        "description": "Step-by-step guide to filing Landlord and Tenant Board applications in Ontario",
        "thumbnailUrl": "https://justice-bot.com/how-it-works-thumbnail.jpg",
        "uploadDate": "2026-01-05",
        "duration": "PT5M"
      },
      {
        "@type": "VideoObject", 
        "name": "Filing an HRTO Complaint",
        "description": "Complete walkthrough of filing Human Rights Tribunal Ontario complaints",
        "thumbnailUrl": "https://justice-bot.com/how-it-works-thumbnail.jpg",
        "uploadDate": "2026-01-05",
        "duration": "PT5M"
      },
      {
        "@type": "VideoObject",
        "name": "Small Claims Court Filing Guide",
        "description": "Learn how to file claims under $35,000 in Ontario Small Claims Court",
        "thumbnailUrl": "https://justice-bot.com/how-it-works-thumbnail.jpg",
        "uploadDate": "2026-01-05",
        "duration": "PT5M"
      }
    ]
  };

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Tutorials", url: "/tutorials" }
  ];

  const faqData = [
    {
      question: "Are these video tutorials free?",
      answer: "Yes! All our video tutorials are completely free to watch. You can learn at your own pace without any subscription required."
    },
    {
      question: "What legal topics do your tutorials cover?",
      answer: "Our tutorials cover LTB applications, HRTO complaints, Small Claims Court, Family Court matters, and general self-representation skills for Ontario legal processes."
    },
    {
      question: "Do I need an account to watch tutorials?",
      answer: "No account is required to watch tutorial videos. However, creating a free account gives you access to additional tools and resources."
    },
    {
      question: "How long are the tutorial videos?",
      answer: "Most tutorials range from 5-15 minutes, designed to be concise and focused on specific legal procedures or forms."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <CanonicalURL />
      <EnhancedSEO
        title="Free Legal Tutorial Videos - LTB, HRTO, Small Claims Guide"
        description="Watch step-by-step video tutorials for Ontario legal processes. Learn how to file LTB applications, HRTO complaints, Small Claims Court documents, and represent yourself effectively."
        keywords="legal tutorials, video guides, LTB tutorial, HRTO tutorial, small claims tutorial, legal help videos, self-representation videos, court procedure videos"
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
        faqData={faqData}
      />
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <Breadcrumbs items={[
            { label: "Tutorial Videos" }
          ]} />
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
              <PlayCircle className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary">Video Tutorials</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Learn How to Navigate Your Legal Journey
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Watch step-by-step video guides for filing forms, gathering evidence, 
              and presenting your case effectively.
            </p>
          </div>

          {/* Featured AI-Generated Tutorial Videos */}
          <section className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <Video className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Platform Walkthrough Videos</h2>
            </div>
            <p className="text-muted-foreground mb-8">
              See how Justice-Bot helps you through each step of your legal journey with these visual guides.
            </p>
            <VideoShowcase />
          </section>

          {/* Database-Driven Tutorial Videos */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Additional Resources</h2>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
                <TabsTrigger value="all">All Videos</TabsTrigger>
                <TabsTrigger value="ltb">LTB</TabsTrigger>
                <TabsTrigger value="hrto">HRTO</TabsTrigger>
                <TabsTrigger value="small-claims">Small Claims</TabsTrigger>
                <TabsTrigger value="general">General</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <TutorialVideos />
              </TabsContent>
              <TabsContent value="ltb">
                <TutorialVideos pathwayType="ltb" />
              </TabsContent>
              <TabsContent value="hrto">
                <TutorialVideos pathwayType="hrto" />
              </TabsContent>
              <TabsContent value="small-claims">
                <TutorialVideos pathwayType="small-claims" />
              </TabsContent>
              <TabsContent value="general">
                <TutorialVideos category="general" />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
