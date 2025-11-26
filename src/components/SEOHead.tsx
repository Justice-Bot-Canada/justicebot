import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  structuredData?: object;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  articleSection?: string;
}

const SEOHead = ({ 
  title, 
  description, 
  keywords, 
  canonicalUrl,
  ogImage = "https://justice-bot.com/og-image.jpg",
  structuredData,
  author = "Justice-Bot Team",
  publishedTime,
  modifiedTime,
  articleSection
}: SEOHeadProps) => {
  const location = useLocation();
  const fullTitle = `${title} | Justice-Bot - Affordable Legal Help`;
  
  // Build clean canonical URL - no query params, no trailing slash, always https://justice-bot.com
  const cleanCanonical = canonicalUrl || `https://justice-bot.com${location.pathname.replace(/\/$/, '')}`;
  const currentUrl = cleanCanonical;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={articleSection ? "article" : "website"} />
      <meta property="og:site_name" content="Justice-Bot" />
      <meta property="og:locale" content="en_CA" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {articleSection && <meta property="article:section" content={articleSection} />}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:site" content="@JusticeBot" />
      <meta name="twitter:creator" content="@JusticeBot" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="geo.region" content="CA-ON" />
      <meta name="geo.placename" content="Ontario" />
      <meta name="geo.position" content="43.651070;-79.347015" />
      <meta name="ICBM" content="43.651070, -79.347015" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;