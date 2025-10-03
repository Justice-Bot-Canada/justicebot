import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TutorialVideos from "@/components/TutorialVideos";
import SEOHead from "@/components/SEOHead";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayCircle } from "lucide-react";

export default function TutorialLibrary() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "VideoGallery",
    "name": "Justice Bot Legal Tutorial Videos",
    "description": "Free video tutorials teaching Canadians how to navigate legal processes including LTB applications, HRTO complaints, Small Claims Court, and more.",
    "url": "https://justice-bot.com/tutorials",
    "image": "https://justice-bot.com/how-it-works-thumbnail.jpg"
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Free Legal Tutorial Videos - LTB, HRTO, Small Claims Guide"
        description="Watch step-by-step video tutorials for Ontario legal processes. Learn how to file LTB applications, HRTO complaints, Small Claims Court documents, and represent yourself effectively."
        keywords="legal tutorials, video guides, LTB tutorial, HRTO tutorial, small claims tutorial, legal help videos, self-representation videos, court procedure videos"
        canonicalUrl="https://justice-bot.com/tutorials"
        ogImage="https://justice-bot.com/how-it-works-thumbnail.jpg"
        structuredData={structuredData}
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
        </div>
      </main>
      <Footer />
    </div>
  );
}
