import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

/**
 * Component to automatically add canonical URLs to pages
 * Helps prevent duplicate content issues and consolidates SEO signals
 * Strips trailing slashes and query parameters for clean URLs
 */
export const CanonicalURL = () => {
  const location = useLocation();
  
  // Build canonical URL - always use www, https, no trailing slash, no query params
  const cleanPath = location.pathname.replace(/\/$/, '');
  const canonicalUrl = `https://www.justice-bot.com${cleanPath}`;
  
  return (
    <Helmet>
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
};

export default CanonicalURL;
