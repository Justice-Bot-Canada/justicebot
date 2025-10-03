import { Helmet } from "react-helmet-async";

interface ArticleSchemaProps {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  url: string;
}

export const ArticleSchema = ({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  author = "Justice-Bot Team",
  url
}: ArticleSchemaProps) => {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": headline,
    "description": description,
    "image": image,
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "author": {
      "@type": "Organization",
      "name": author,
      "url": "https://justice-bot.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Justice-Bot",
      "logo": {
        "@type": "ImageObject",
        "url": "https://justice-bot.com/justice-bot-logo.jpeg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(articleSchema)}
      </script>
    </Helmet>
  );
};
