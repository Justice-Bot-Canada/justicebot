import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

/**
 * Component to automatically add canonical URLs to pages
 * Helps prevent duplicate content issues and consolidates SEO signals
 */
export const CanonicalURL = () => {
  const location = useLocation();
  
  // Build canonical URL - always use non-www, https
  const canonicalUrl = `https://justice-bot.com${location.pathname}`;
  
  return (
    <Helmet>
      <link rel="canonical" href={canonicalUrl} />
      {/* Prevent indexing of duplicate www version */}
      <link rel="alternate" href={canonicalUrl} hrefLang="en-CA" />
    </Helmet>
  );
};

export default CanonicalURL;
