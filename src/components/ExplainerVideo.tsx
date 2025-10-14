import { Card } from "@/components/ui/card";
import { VideoSchema } from "@/components/VideoSchema";
import { Play } from "lucide-react";

export const ExplainerVideo = () => {
  return (
    <>
      <VideoSchema
        name="How Justice-Bot Works - AI Legal Help for Canadians"
        description="Watch this quick explainer to see how Justice-Bot provides affordable AI-powered legal assistance for Ontario tribunals, courts, and legal issues."
        thumbnailUrl="https://img.youtube.com/vi/qhgRFgnANn4/maxresdefault.jpg"
        uploadDate="2025-10-03"
        duration="PT1M"
        contentUrl="https://justice-bot.com"
        embedUrl="https://www.youtube.com/watch?v=qhgRFgnANn4"
      />
      
      <section className="py-16 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4">See How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Watch this quick video to understand how Justice-Bot can help you navigate your legal journey.
            </p>
          </div>

          <Card className="max-w-4xl mx-auto overflow-hidden shadow-2xl">
            <div className="relative aspect-[9/16] md:aspect-video bg-black">
              <video
                controls
                className="w-full h-full"
                poster="/how-it-works-thumbnail.jpg"
              >
                <source src="/promo-video.mov" type="video/quicktime" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="p-6 bg-card">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Play className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Get Started in Minutes</h3>
                  <p className="text-muted-foreground">
                    Justice-Bot guides you through every step of your legal process, from form selection to filing instructions.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </>
  );
};
