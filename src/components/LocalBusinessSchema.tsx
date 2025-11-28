import { Helmet } from "react-helmet-async";

const LocalBusinessSchema = () => {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "name": "Justice-Bot",
    "description": "AI-powered legal assistance platform for Canadians. Affordable legal help with document automation, case analysis, and step-by-step legal guidance.",
    "url": "https://www.justice-bot.com",
    "logo": "https://www.justice-bot.com/justice-bot-logo.jpeg",
    "image": "https://www.justice-bot.com/justice-bot-logo.jpeg",
    "telephone": "+1-800-JUSTICE",
    "email": "info@justice-bot.com",
    "priceRange": "$19-$99",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "CA",
      "addressRegion": "ON"
    },
    "areaServed": [
      {
        "@type": "Country",
        "name": "Canada"
      },
      {
        "@type": "State",
        "name": "Ontario"
      },
      {
        "@type": "State",
        "name": "British Columbia"
      },
      {
        "@type": "State",
        "name": "Alberta"
      },
      {
        "@type": "State",
        "name": "Quebec"
      }
    ],
    "serviceType": [
      "Small Claims Court Assistance",
      "Landlord Tenant Board (LTB) Help",
      "Human Rights Tribunal Support",
      "Family Law Guidance",
      "Legal Document Automation",
      "Case Merit Analysis",
      "AI Legal Chat"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Legal Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Monthly Access",
            "description": "Standard legal assistance with document automation and AI guidance"
          },
          "price": "19.00",
          "priceCurrency": "CAD",
          "availability": "https://schema.org/InStock"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Yearly Access",
            "description": "Full professional legal assistance with priority support"
          },
          "price": "99.99",
          "priceCurrency": "CAD",
          "availability": "https://schema.org/InStock"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "One-Time Form Purchase",
            "description": "Individual legal form with AI-assisted completion"
          },
          "price": "29.99",
          "priceCurrency": "CAD",
          "availability": "https://schema.org/InStock"
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "sameAs": [
      "https://twitter.com/justicebot",
      "https://linkedin.com/company/justice-bot"
    ],
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
    </Helmet>
  );
};

export default LocalBusinessSchema;
