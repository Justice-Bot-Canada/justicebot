import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoSchema } from "@/components/VideoSchema";

export const AppDemoVideo = () => {
  const videos = [
    {
      id: "hrto",
      title: "HRTO - Human Rights Tribunal",
      embedUrl: "https://www.youtube.com/embed/jDpTN7oKdsc",
      description: "Learn how to file a human rights complaint with the HRTO"
    },
    {
      id: "small-claims",
      title: "Small Claims Court",
      embedUrl: "https://www.youtube.com/embed/NTaiMtqsE7c",
      description: "Step-by-step guide to filing in Small Claims Court"
    },
    {
      id: "ltb",
      title: "LTB - Landlord Tenant Board",
      embedUrl: "https://www.youtube.com/embed/lllrAC7yfLE",
      description: "Navigate the Landlord and Tenant Board process"
    }
  ];

  return (
    <>
      <VideoSchema
        name="Justice-Bot Tutorial Videos - Legal Help for HRTO, Small Claims, LTB"
        description="Watch video tutorials showing how to use Justice-Bot for Human Rights Tribunal, Small Claims Court, and Landlord Tenant Board cases in Ontario."
        thumbnailUrl="https://img.youtube.com/vi/jDpTN7oKdsc/maxresdefault.jpg"
        uploadDate="2025-10-03"
        duration="PT5M"
        contentUrl="https://justice-bot.com/demo-video"
        embedUrl="https://www.youtube.com/watch?v=jDpTN7oKdsc"
      />
      
      <section className="py-16 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">See Justice-Bot in Action</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Watch these video guides to see how easy it is to get legal help and navigate your case.
            </p>
          </div>

          <Card className="max-w-5xl mx-auto overflow-hidden shadow-2xl">
            <Tabs defaultValue="hrto" className="w-full">
              <TabsList className="w-full grid grid-cols-3 rounded-none border-b">
                {videos.map((video) => (
                  <TabsTrigger key={video.id} value={video.id} className="rounded-none">
                    {video.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {videos.map((video) => (
                <TabsContent key={video.id} value={video.id} className="m-0">
                  <div className="relative aspect-video bg-black">
                    <iframe
                      src={video.embedUrl}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 bg-card">
                    <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
                    <p className="text-muted-foreground">{video.description}</p>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </Card>

          <div className="text-center mt-8 space-y-4">
            <p className="text-sm text-muted-foreground">
              Ready to start your own case? It takes less than 5 minutes.
            </p>
            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-2">Want to learn more about your rights in Ontario?</p>
              <a 
                href="https://youtube.com/@ongov?si=MuJIB3XqRpfokXuW"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                Visit Ontario Government's YouTube Channel
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
