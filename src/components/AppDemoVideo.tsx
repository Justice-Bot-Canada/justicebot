import { Card } from "@/components/ui/card";
import { VideoSchema } from "@/components/VideoSchema";
import { PlayCircle } from "lucide-react";
import howItWorksThumbnail from "@/assets/how-it-works-thumbnail.jpg";

export const AppDemoVideo = () => {
  return (
    <>
      <VideoSchema
        name="Justice-Bot App Demo - How to Use Our Legal Platform"
        description="A 1-minute walkthrough showing how to use Justice-Bot to get legal help, fill forms, and navigate tribunals in Canada. See our AI-powered legal platform in action."
        thumbnailUrl="https://justice-bot.com/how-it-works-thumbnail.jpg"
        uploadDate="2025-10-03"
        duration="PT1M"
        contentUrl="https://justice-bot.com/demo-video"
      />
      
      <section className="py-16 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">See Justice-Bot in Action</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Watch this 1-minute demo to see how easy it is to get legal help, complete forms, and navigate your case.
            </p>
          </div>

          <Card className="max-w-4xl mx-auto overflow-hidden shadow-2xl">
            <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20">
              {/* Video Placeholder - Replace with actual video */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
                <PlayCircle className="w-24 h-24 text-primary animate-pulse" />
                <div className="text-center">
                  <h3 className="text-2xl font-semibold mb-2">App Demo Video</h3>
                  <p className="text-muted-foreground">
                    Coming Soon: 1-minute walkthrough of Justice-Bot
                  </p>
                </div>
              </div>
              
              {/* Actual video element - uncomment when video is ready */}
              {/* <video
                controls
                poster={howItWorksThumbnail}
                className="w-full h-full"
                aria-label="Justice-Bot application demo video"
              >
                <source src="/path-to-your-demo-video.mp4" type="video/mp4" />
                <track
                  kind="captions"
                  src="/path-to-captions.vtt"
                  srcLang="en"
                  label="English captions"
                />
                Your browser does not support the video tag.
              </video> */}
            </div>

            <div className="p-6 bg-card">
              <h3 className="text-xl font-semibold mb-4">What You'll See:</h3>
              <ul className="grid md:grid-cols-2 gap-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Starting a case assessment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Getting your merit score</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Selecting the right legal pathway</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Filling out official forms</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Uploading evidence documents</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Getting ready to file</span>
                </li>
              </ul>
            </div>
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
