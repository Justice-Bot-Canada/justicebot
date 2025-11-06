import { Card } from "@/components/ui/card";
import { VideoSchema } from "@/components/VideoSchema";
import { Play } from "lucide-react";

export const ExplainerVideo = () => {
  return (
    <>
      <VideoSchema
        name="How Justice-Bot Works - AI Legal Help for Canadians"
        description="Watch this quick explainer to see how Justice-Bot provides affordable AI-powered legal assistance for Ontario tribunals, courts, and legal issues."
        thumbnailUrl="https://justice-bot.com/video-thumbnail-800.webp"
        uploadDate="2025-10-03"
        duration="PT2M"
        contentUrl="https://justice-bot.com/justice-bot-explainer.mp4"
        embedUrl="https://justice-bot.com/justice-bot-explainer.mp4"
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
            <div className="relative aspect-video bg-black">
              <video
                className="w-full h-full"
                controls
                preload="metadata"
                poster="/video-thumbnail-800.webp"
                aria-label="How Justice-Bot Works - Explainer Video"
              >
                <source src="/justice-bot-explainer.mp4" type="video/mp4" />
                <track kind="captions" label="English captions" />
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
