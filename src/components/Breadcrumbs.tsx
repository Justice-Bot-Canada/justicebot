import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol 
        className="flex items-center flex-wrap gap-2 text-sm text-muted-foreground"
        itemScope 
        itemType="https://schema.org/BreadcrumbList"
      >
        <li 
          itemProp="itemListElement" 
          itemScope 
          itemType="https://schema.org/ListItem"
          className="flex items-center"
        >
          <a 
            href="https://www.justice-bot.com/"
            itemProp="item"
            className="hover:text-foreground transition-colors flex items-center gap-1"
            aria-label="Home"
          >
            <Home className="h-4 w-4" />
            <span itemProp="name" className="sr-only sm:not-sr-only">Home</span>
          </a>
          <meta itemProp="position" content="1" />
        </li>
        
        {items.map((item, index) => {
          const itemUrl = item.href 
            ? `https://www.justice-bot.com${item.href.replace(/\/$/, '')}` 
            : `https://www.justice-bot.com${typeof window !== 'undefined' ? window.location.pathname.replace(/\/$/, '') : ''}`;
          
          return (
            <li 
              key={index}
              itemProp="itemListElement" 
              itemScope 
              itemType="https://schema.org/ListItem"
              className="flex items-center gap-2"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
              {item.href ? (
                <a 
                  href={itemUrl}
                  itemProp="item"
                  className="hover:text-foreground transition-colors"
                >
                  <span itemProp="name">{item.label}</span>
                </a>
              ) : (
                <>
                  <a href={itemUrl} itemProp="item" className="hidden" aria-hidden="true">
                    <span>{item.label}</span>
                  </a>
                  <span 
                    itemProp="name" 
                    className="text-foreground font-medium"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                </>
              )}
              <meta itemProp="position" content={(index + 2).toString()} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
