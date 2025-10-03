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
        thumbnailUrl="https://justice-bot.com/how-it-works-thumbnail.jpg"
        uploadDate="2025-10-03"
        duration="PT5M"
        contentUrl="https://justice-bot.com/demo-video"
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

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              Ready to start your own case? It takes less than 5 minutes.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};
