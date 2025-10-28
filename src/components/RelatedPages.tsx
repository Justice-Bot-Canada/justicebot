import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Calculator, FileText, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RelatedPage {
  title: string;
  description: string;
  path: string;
  icon?: "book" | "calculator" | "file" | "help";
  category?: string;
}

interface RelatedPagesProps {
  pages: RelatedPage[];
  title?: string;
  description?: string;
}

const iconMap = {
  book: BookOpen,
  calculator: Calculator,
  file: FileText,
  help: HelpCircle,
};

export const RelatedPages = ({ 
  pages, 
  title = "Continue Your Journey",
  description = "Explore related resources to move your case forward"
}: RelatedPagesProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pages.map((page) => {
            const Icon = page.icon ? iconMap[page.icon] : ArrowRight;
            
            return (
              <Card 
                key={page.path}
                className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50"
                onClick={() => navigate(page.path)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-base">{page.title}</CardTitle>
                    </div>
                    {page.category && (
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {page.category}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm text-muted-foreground mb-3">
                    {page.description}
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(page.path)}
                  >
                    Learn More
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RelatedPages;
