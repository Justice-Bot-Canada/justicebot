import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, Volume2, VolumeX, Settings, Subtitles } from "lucide-react";

interface VideoProps {
  src: string;
  poster?: string;
  title: string;
  description?: string;
  captions?: Array<{
    start: number;
    end: number;
    text: string;
  }>;
  transcript?: string;
}

export const AccessibleVideo = ({ 
  src, 
  poster, 
  title, 
  description, 
  captions = [], 
  transcript 
}: VideoProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [currentCaption, setCurrentCaption] = useState("");
  const [showTranscript, setShowTranscript] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateCaption = () => {
      const currentTime = video.currentTime;
      const activeCaption = captions.find(
        caption => currentTime >= caption.start && currentTime <= caption.end
      );
      setCurrentCaption(activeCaption?.text || "");
    };

    const handleTimeUpdate = () => {
      updateCaption();
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [captions]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleCaptions = () => {
    setShowCaptions(!showCaptions);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-0">
          <div className="relative video-container">
            <video
              ref={videoRef}
              src={src}
              poster={poster}
              className="w-full h-auto rounded-t-lg"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              aria-label={title}
              aria-describedby={description ? "video-description" : undefined}
            >
              <track
                kind="captions"
                src="/captions.vtt"
                srcLang="en"
                label="English"
                default
              />
              Your browser does not support the video tag.
            </video>

            {/* Custom Captions Overlay */}
            {showCaptions && currentCaption && (
              <div 
                className="video-captions"
                role="region"
                aria-live="polite"
                aria-label="Video captions"
              >
                {currentCaption}
              </div>
            )}

            {/* Video Controls */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2 bg-black/70 rounded p-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePlay}
                  className="text-white hover:bg-white/20"
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20"
                  aria-label={isMuted ? "Unmute video" : "Mute video"}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleCaptions}
                  className={`text-white hover:bg-white/20 ${showCaptions ? 'bg-white/30' : ''}`}
                  aria-label={showCaptions ? "Hide captions" : "Show captions"}
                  aria-pressed={showCaptions}
                >
                  <Subtitles className="h-4 w-4" />
                </Button>

                {transcript && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowTranscript(!showTranscript)}
                    className={`text-white hover:bg-white/20 ${showTranscript ? 'bg-white/30' : ''}`}
                    aria-label={showTranscript ? "Hide transcript" : "Show transcript"}
                    aria-pressed={showTranscript}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            {description && (
              <p id="video-description" className="text-sm text-muted-foreground mb-3">
                {description}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Video Transcript */}
      {transcript && showTranscript && (
        <Card>
          <CardContent className="p-4">
            <h4 className="text-lg font-semibold mb-3">Video Transcript</h4>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-line text-sm leading-relaxed">
                {transcript}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AccessibleVideo;