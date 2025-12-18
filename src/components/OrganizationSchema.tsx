import { Helmet } from "react-helmet-async";

interface OrganizationSchemaProps {
  name?: string;
  description?: string;
  url?: string;
  logo?: string;
  sameAs?: string[];
}

export const OrganizationSchema = ({
  name = "Justice-Bot",
  description = "AI-powered legal information and form-help software for Canadians. Not a law firm and not legal advice.",
  url = "https://www.justice-bot.com",
  logo = "https://www.justice-bot.com/justice-bot-logo.jpeg",
  sameAs = ["https://www.facebook.com/profile.php?id=61579916761955"],
}: OrganizationSchemaProps) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": name,
    "description": description,
    "url": url,
    "logo": logo,
    "sameAs": sameAs,
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "areaServed": "CA-ON",
      "availableLanguage": ["en", "fr"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressRegion": "ON",
      "addressCountry": "CA"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};
