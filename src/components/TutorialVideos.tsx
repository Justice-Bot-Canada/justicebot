import { useState, useEffect } from "react";
import { Play, Clock, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TutorialVideo {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string | null;
  category: string;
  pathway_type: string;
  step_number: number | null;
  duration_seconds: number | null;
  view_count: number;
}

interface TutorialVideosProps {
  pathwayType?: string;
  category?: string;
}

export default function TutorialVideos({ pathwayType, category }: TutorialVideosProps) {
  const [videos, setVideos] = useState<TutorialVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<TutorialVideo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, [pathwayType, category]);

  const loadVideos = async () => {
    setLoading(true);
    let query = supabase
      .from('tutorial_videos')
      .select('*')
      .eq('is_active', true)
      .order('step_number', { ascending: true });

    if (pathwayType) {
      query = query.eq('pathway_type', pathwayType);
    }
    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error loading videos:', error);
      toast.error('Failed to load tutorial videos');
    } else {
      setVideos(data || []);
    }
    setLoading(false);
  };

  const handleVideoClick = async (video: TutorialVideo) => {
    setSelectedVideo(video);
    
    // Increment view count
    await supabase
      .from('tutorial_videos')
      .update({ view_count: video.view_count + 1 })
      .eq('id', video.id);
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="bg-muted h-48 rounded-lg mb-4" />
            <div className="h-4 bg-muted rounded mb-2" />
            <div className="h-3 bg-muted rounded w-2/3" />
          </Card>
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Play className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground">No tutorial videos available yet</p>
      </Card>
    );
  }

  // Group videos by category
  const videosByCategory = videos.reduce((acc, video) => {
    const category = video.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(video);
    return acc;
  }, {} as Record<string, TutorialVideo[]>);

  return (
    <>
      <div className="space-y-12">
        {Object.entries(videosByCategory).map(([category, categoryVideos]) => (
          <div key={category}>
            <h2 className="text-2xl font-bold mb-6 text-primary">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryVideos.map((video) => (
          <Card 
            key={video.id} 
            className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
            onClick={() => handleVideoClick(video)}
          >
            <div className="relative">
              {video.thumbnail_url ? (
                <img 
                  src={video.thumbnail_url} 
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Play className="w-16 h-16 text-primary" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Play className="w-16 h-16 text-white" />
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2 line-clamp-2">{video.title}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {video.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {video.duration_seconds && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDuration(video.duration_seconds)}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {video.view_count} views
                </div>
              </div>
            </div>
          </Card>
        ))}
            </div>
          </div>
        ))}
      </div>

      {/* Video Player Dialog */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedVideo?.title}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            {selectedVideo && (
              <video 
                src={selectedVideo.video_url} 
                controls 
                autoPlay
                className="w-full h-full"
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {selectedVideo?.description}
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
