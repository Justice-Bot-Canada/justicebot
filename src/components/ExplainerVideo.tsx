import { Card } from "@/components/ui/card";
import { VideoSchema } from "@/components/VideoSchema";
import { Play } from "lucide-react";

export const ExplainerVideo = () => {
  return (
    <>
      <VideoSchema
        name="How Justice-Bot Works - AI Legal Help for Canadians"
        description="Watch this quick explainer to see how Justice-Bot provides affordable AI-powered legal assistance for Ontario tribunals, courts, and legal issues."
        thumbnailUrl="https://justice-bot.com/how-it-works-thumbnail.jpg"
        uploadDate="2025-10-03"
        duration="PT2M"
        embedUrl="https://app.heygen.com/embedded-player/29aae8c531a8443db23b13be0f4ccf6f"
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
              <iframe 
                width="100%" 
                height="100%" 
                src="https://app.heygen.com/embedded-player/29aae8c531a8443db23b13be0f4ccf6f" 
                title="How Justice-Bot Works - HeyGen video player" 
                frameBorder="0" 
                allow="encrypted-media; fullscreen;" 
                allowFullScreen
                className="absolute inset-0"
                aria-label="How Justice-Bot Works - Explainer Video"
              />
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
