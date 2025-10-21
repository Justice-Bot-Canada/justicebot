import { Helmet } from "react-helmet-async";

interface LegalServiceSchemaProps {
  serviceName: string;
  description: string;
  serviceType: string[];
  price?: string;
  venue?: string;
}

export const LegalServiceSchema = ({
  serviceName,
  description,
  serviceType,
  price = "5.99",
  venue
}: LegalServiceSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "name": serviceName,
    "description": description,
    "provider": {
      "@type": "Organization",
      "name": "Justice-Bot",
      "url": "https://justice-bot.com",
      "logo": "https://justice-bot.com/justice-bot-logo.jpeg",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "CA",
        "addressRegion": "ON"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "email": "admin@justice-bot.com"
      }
    },
    "serviceType": serviceType,
    "areaServed": {
      "@type": "Country",
      "name": "Canada"
    },
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": "CAD",
      "availability": "https://schema.org/InStock"
    },
    "termsOfService": "https://justice-bot.com/terms",
    "audience": {
      "@type": "Audience",
      "audienceType": "Canadian residents facing legal issues"
    }
  };

  // Add venue-specific information
  if (venue) {
    Object.assign(schema, {
      "availableChannel": {
        "@type": "ServiceChannel",
        "name": venue
      }
    });
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};
