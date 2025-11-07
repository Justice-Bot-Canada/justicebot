import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";

const blogPosts = [
  {
    slug: "ontario-small-claims-court-2025",
    title: "Ontario Small Claims Court Guide (2025 Update)",
    description: "Plain-language steps for filing, settlement, trial, and enforcement — updated for 2025 changes.",
    date: "November 2025",
    category: "Legal Help & Self-Representation",
    image: "https://images.unsplash.com/photo-1555375771-14b2a63968a6",
    readTime: "8 min read"
  }
];

export default function BlogList() {
  return (
    <>
      <Helmet>
        <title>Legal Help Blog - Justice-Bot Canada</title>
        <meta name="description" content="Free legal guides, how-tos, and updates for Ontarians representing themselves in court. Plain-language help for small claims, tribunals, and more." />
        <meta name="keywords" content="legal blog ontario, legal help canada, small claims court guide, self-representation, legal guides" />
        <link rel="canonical" href="https://justice-bot.com/blog" />
        <meta property="og:title" content="Legal Help Blog - Justice-Bot Canada" />
        <meta property="og:description" content="Free legal guides, how-tos, and updates for Ontarians representing themselves in court." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://justice-bot.com/blog" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Legal Help Blog
              </h1>
              <p className="text-xl text-muted-foreground">
                Free guides and resources for self-represented litigants in Ontario
              </p>
            </div>

            <div className="grid gap-8">
              {blogPosts.map((post) => (
                <Link 
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="block group"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>
                      <div className="md:w-2/3">
                        <CardHeader>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {post.date}
                            </span>
                            <span>·</span>
                            <span>{post.readTime}</span>
                            <span>·</span>
                            <span className="text-primary">{post.category}</span>
                          </div>
                          <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                            {post.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-base mb-4">
                            {post.description}
                          </CardDescription>
                          <div className="flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
                            Read full guide
                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {blogPosts.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No blog posts yet. Check back soon!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
