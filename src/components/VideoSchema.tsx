import { Helmet } from "react-helmet-async";

interface VideoSchemaProps {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration?: string; // ISO 8601 format, e.g., "PT5M30S" for 5 minutes 30 seconds
  contentUrl?: string;
  embedUrl?: string;
}

export const VideoSchema = ({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  duration = "PT10M",
  contentUrl,
  embedUrl
}: VideoSchemaProps) => {
  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": name,
    "description": description,
    "thumbnailUrl": thumbnailUrl,
    "uploadDate": uploadDate,
    "duration": duration,
    ...(contentUrl && { "contentUrl": contentUrl }),
    ...(embedUrl && { "embedUrl": embedUrl }),
    "publisher": {
      "@type": "Organization",
      "name": "Justice-Bot",
      "logo": {
        "@type": "ImageObject",
        "url": "https://justice-bot.com/justice-bot-logo.jpeg"
      }
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(videoSchema)}
      </script>
    </Helmet>
  );
};
