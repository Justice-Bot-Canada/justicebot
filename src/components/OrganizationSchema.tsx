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
  description = "AI-powered legal assistance for Ontario residents. Free legal help with LTB forms, family court, HRTO applications, and more.",
  url = "https://justice-bot.com",
  logo = "https://justice-bot.com/justice-bot-logo.jpeg",
  sameAs = [
    "https://twitter.com/justicebot",
    "https://www.facebook.com/justicebot",
    "https://www.linkedin.com/company/justicebot"
  ]
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
