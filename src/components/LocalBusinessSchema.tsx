import { Helmet } from "react-helmet-async";

const LocalBusinessSchema = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Justice-Bot",
    "description": "AI-powered legal information platform for Canadians. Form helpers, procedure guides, and self-help tools for LTB, HRTO, family court and more. Not a law firm - a practical guide to help you prepare.",
    "url": "https://www.justice-bot.com",
    "logo": "https://www.justice-bot.com/justice-bot-logo.jpeg",
    "image": "https://www.justice-bot.com/justice-bot-logo.jpeg",
    "email": "admin@justice-bot.com",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "CA",
      "addressRegion": "ON"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Canada"
    },
    "sameAs": [
      "https://twitter.com/justicebot",
      "https://linkedin.com/company/justice-bot"
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
    </Helmet>
  );
};

export default LocalBusinessSchema;
