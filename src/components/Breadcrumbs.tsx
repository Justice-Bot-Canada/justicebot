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
          <Link 
            to="/" 
            itemProp="item"
            className="hover:text-foreground transition-colors flex items-center gap-1"
            aria-label="Home"
          >
            <Home className="h-4 w-4" />
            <span itemProp="name" className="sr-only sm:not-sr-only">Home</span>
          </Link>
          <meta itemProp="position" content="1" />
        </li>
        
        {items.map((item, index) => (
          <li 
            key={index}
            itemProp="itemListElement" 
            itemScope 
            itemType="https://schema.org/ListItem"
            className="flex items-center gap-2"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            {item.href ? (
              <Link 
                to={item.href} 
                itemProp="item"
                className="hover:text-foreground transition-colors"
              >
                <span itemProp="name">{item.label}</span>
              </Link>
            ) : (
              <span 
                itemProp="name" 
                className="text-foreground font-medium"
                aria-current="page"
              >
                {item.label}
              </span>
            )}
            <meta itemProp="position" content={(index + 2).toString()} />
          </li>
        ))}
      </ol>
    </nav>
  );
};
