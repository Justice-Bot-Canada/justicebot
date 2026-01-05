import { useState } from "react";
import { Play, Clock, Users, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "react-router-dom";

// Import tutorial videos
import ltbTutorialVideo from "@/assets/tutorials/ltb-filing-tutorial.mp4";
import hrtoTutorialVideo from "@/assets/tutorials/hrto-complaint-tutorial.mp4";
import smallClaimsTutorialVideo from "@/assets/tutorials/small-claims-tutorial.mp4";

interface TutorialVideoData {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  category: string;
  pathwayType: string;
  durationSeconds: number;
  journeyLink: string;
}

const tutorialVideos: TutorialVideoData[] = [
  {
    id: "ltb-tutorial",
    title: "How to File an LTB Application",
    description: "Step-by-step walkthrough of filing a Landlord and Tenant Board application in Ontario. Learn how to complete forms, gather evidence, and submit your case.",
    videoUrl: ltbTutorialVideo,
    category: "LTB Tutorials",
    pathwayType: "ltb",
    durationSeconds: 300,
    journeyLink: "/ltb-journey"
  },
  {
    id: "hrto-tutorial",
    title: "Filing an HRTO Complaint",
    description: "Complete guide to filing a Human Rights Tribunal of Ontario complaint. Understand the discrimination claim process from start to finish.",
    videoUrl: hrtoTutorialVideo,
    category: "HRTO Tutorials",
    pathwayType: "hrto",
    durationSeconds: 300,
    journeyLink: "/hrto-journey"
  },
  {
    id: "small-claims-tutorial",
    title: "Small Claims Court Filing Guide",
    description: "Learn how to file a Small Claims Court case for claims under $35,000. Includes evidence organization and filing instructions.",
    videoUrl: smallClaimsTutorialVideo,
    category: "Small Claims Tutorials",
    pathwayType: "small-claims",
    durationSeconds: 300,
    journeyLink: "/small-claims-journey"
  }
];

interface VideoShowcaseProps {
  pathwayType?: string;
  showAll?: boolean;
  limit?: number;
}

export default function VideoShowcase({ pathwayType, showAll = false, limit }: VideoShowcaseProps) {
  const [selectedVideo, setSelectedVideo] = useState<TutorialVideoData | null>(null);

  const filteredVideos = pathwayType 
    ? tutorialVideos.filter(v => v.pathwayType === pathwayType)
    : tutorialVideos;

  const displayVideos = limit ? filteredVideos.slice(0, limit) : filteredVideos;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Group videos by category for display
  const videosByCategory = displayVideos.reduce((acc, video) => {
    if (!acc[video.category]) {
      acc[video.category] = [];
    }
    acc[video.category].push(video);
    return acc;
  }, {} as Record<string, TutorialVideoData[]>);

  return (
    <>
      <div className="space-y-12">
        {Object.entries(videosByCategory).map(([category, categoryVideos]) => (
          <div key={category}>
            <h3 className="text-xl font-bold mb-6 text-primary flex items-center gap-2">
              <Play className="w-5 h-5" />
              {category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryVideos.map((video) => (
                <Card 
                  key={video.id}
                  className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group border-border/50 bg-card"
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className="relative">
                    <div className="w-full h-48 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                          <Play className="w-10 h-10 text-primary-foreground ml-1" />
                        </div>
                      </div>
                    </div>
                    <Badge 
                      className="absolute top-3 right-3"
                      variant="secondary"
                    >
                      {video.pathwayType.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold mb-2 line-clamp-2 text-foreground">
                      {video.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {video.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(video.durationSeconds)}
                      </div>
                      <Link 
                        to={video.journeyLink}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        Start Journey <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showAll && (
        <div className="text-center mt-8">
          <Button asChild variant="outline">
            <Link to="/tutorials">
              View All Tutorials
            </Link>
          </Button>
        </div>
      )}

      {/* Video Player Dialog */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Play className="w-5 h-5 text-primary" />
              {selectedVideo?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            {selectedVideo && (
              <video 
                src={selectedVideo.videoUrl} 
                controls 
                autoPlay
                className="w-full h-full"
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground flex-1">
              {selectedVideo?.description}
            </p>
            {selectedVideo && (
              <Button asChild size="sm" className="ml-4">
                <Link to={selectedVideo.journeyLink}>
                  Start This Journey
                </Link>
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
