import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

interface EnhancedSEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  structuredData?: object;
  articleData?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  breadcrumbs?: Array<{
    name: string;
    url: string;
  }>;
  faqData?: Array<{
    question: string;
    answer: string;
  }>;
}

const EnhancedSEO = ({ 
  title, 
  description, 
  keywords, 
  canonicalUrl,
  ogImage = "https://www.justice-bot.com/justice-bot-logo.jpeg",
  structuredData,
  articleData,
  breadcrumbs,
  faqData
}: EnhancedSEOProps) => {
  const location = useLocation();
  const fullTitle = `${title} | Justice-Bot - Affordable Legal Help`;
  
  // Build clean canonical URL - no query params, no trailing slash
  const cleanCanonical = canonicalUrl || `https://www.justice-bot.com${location.pathname.replace(/\/$/, '')}`;
  const currentUrl = cleanCanonical;

  // Generate Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Justice-Bot",
    "url": "https://www.justice-bot.com",
    "logo": "https://www.justice-bot.com/justice-bot-logo.jpeg",
    "sameAs": [
      "https://twitter.com/justicebot",
      "https://linkedin.com/company/justice-bot"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-800-JUSTICE",
      "contactType": "customer service",
      "areaServed": "CA",
      "availableLanguage": ["English", "French"]
    }
  };

  // Generate Website Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Justice-Bot",
    "url": "https://www.justice-bot.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.justice-bot.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  // Generate Breadcrumb Schema
  const breadcrumbSchema = breadcrumbs ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  } : null;

  // Generate FAQ Schema
  const faqSchema = faqData ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  } : null;

  // Generate Article Schema
  const articleSchema = articleData ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": ogImage,
    "author": {
      "@type": "Organization",
      "name": articleData.author || "Justice-Bot"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Justice-Bot",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.justice-bot.com/justice-bot-logo.jpeg"
      }
    },
    "datePublished": articleData.publishedTime,
    "dateModified": articleData.modifiedTime || articleData.publishedTime,
    "articleSection": articleData.section,
    "keywords": articleData.tags?.join(", ")
  } : null;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#1a365d" />
      
      {/* Language and Locale */}
      <meta httpEquiv="content-language" content="en-CA" />
      <meta property="og:locale" content="en_CA" />
      
      {/* Canonical URL */}
      {currentUrl && <link rel="canonical" href={currentUrl} />}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1080" />
      <meta property="og:image:height" content="1080" />
      <meta property="og:image:alt" content="Justice-Bot - Affordable Legal Help" />
      {currentUrl && <meta property="og:url" content={currentUrl} />}
      <meta property="og:type" content={articleData ? "article" : "website"} />
      <meta property="og:site_name" content="Justice-Bot" />
      
      {/* Article-specific Open Graph */}
      {articleData && (
        <>
          {articleData.publishedTime && (
            <meta property="article:published_time" content={articleData.publishedTime} />
          )}
          {articleData.modifiedTime && (
            <meta property="article:modified_time" content={articleData.modifiedTime} />
          )}
          {articleData.author && (
            <meta property="article:author" content={articleData.author} />
          )}
          {articleData.section && (
            <meta property="article:section" content={articleData.section} />
          )}
          {articleData.tags?.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content="Justice-Bot - Affordable Legal Help" />
      <meta name="twitter:site" content="@justicebot" />
      <meta name="twitter:creator" content="@justicebot" />
      
      {/* Additional Meta Tags */}
      <meta name="author" content="Justice-Bot" />
      <meta name="publisher" content="Justice-Bot" />
      <meta name="application-name" content="Justice-Bot" />
      <meta name="apple-mobile-web-app-title" content="Justice-Bot" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Performance Hints */}
      <link rel="dns-prefetch" href="//vkzquzjtewqhcisvhsvg.supabase.co" />
      <link rel="preconnect" href="https://vkzquzjtewqhcisvhsvg.supabase.co" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
      {faqSchema && (
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      )}
      {articleSchema && (
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      )}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default EnhancedSEO;