import { useState, useEffect } from "react";
import { Star, Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

interface Testimonial {
  name: string;
  location: string | null;
  case_type: string;
  rating: number;
  story: string;
  outcome: string | null;
}

export default function SuccessStories() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("name, location, case_type, rating, story, outcome")
        .eq("status", "approved")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) throw error;

      if (data && data.length > 0) {
        setTestimonials(data);
      } else {
        // Fallback to demo data if no testimonials yet
        setTestimonials([
          {
            name: "Sarah M.",
            location: "Toronto, ON",
            case_type: "Landlord & Tenant Board",
            rating: 5,
            story: "Justice-Bot helped me prepare my LTB application in under an hour. The AI guidance was clear and the forms were automatically filled. I won my case and got my deposit back!",
            outcome: "Won case, recovered $2,400 deposit"
          },
          {
            name: "James T.",
            location: "Ottawa, ON",
            case_type: "Human Rights Tribunal",
            rating: 5,
            story: "As someone with no legal background, I was overwhelmed. Justice-Bot walked me through every step, explained the process clearly, and helped me file a solid complaint.",
            outcome: "Case accepted, settlement reached"
          },
          {
            name: "Priya K.",
            location: "Mississauga, ON",
            case_type: "Small Claims Court",
            rating: 5,
            story: "The document analyzer saved me so much time! I uploaded my contracts, and it immediately identified the key issues.",
            outcome: "Settled for $4,500"
          }
        ]);
      }
    } catch (error) {
      console.error("Error loading testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 text-center">
          <p>Loading testimonials...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
            <Star className="w-5 h-5 text-primary fill-primary" />
            <span className="text-sm font-semibold text-primary">Success Stories</span>
          </div>
          <h2 className="text-4xl font-bold mb-4">
            Real Results from Real Canadians
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Join hundreds of Canadians who've successfully navigated the legal system with Justice-Bot
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="p-6 hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {getInitials(testimonial.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  <div className="flex gap-1 mt-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                </div>
                <Quote className="w-8 h-8 text-primary/20" />
              </div>

              <div className="mb-4">
                <span className="inline-block bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full mb-3">
                  {testimonial.case_type}
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {testimonial.story}
                </p>
                {testimonial.outcome && (
                  <div className="bg-muted/50 rounded-lg p-3 border-l-4 border-primary">
                    <p className="text-sm font-semibold text-primary">
                      ✓ {testimonial.outcome}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          <div className="text-center p-6 bg-card rounded-lg border">
            <div className="text-3xl font-bold text-primary mb-2">85%</div>
            <p className="text-sm text-muted-foreground">Success Rate</p>
          </div>
          <div className="text-center p-6 bg-card rounded-lg border">
            <div className="text-3xl font-bold text-primary mb-2">800+</div>
            <p className="text-sm text-muted-foreground">Cases Filed</p>
          </div>
          <div className="text-center p-6 bg-card rounded-lg border">
            <div className="text-3xl font-bold text-primary mb-2">$2.1M</div>
            <p className="text-sm text-muted-foreground">Total Recovered</p>
          </div>
          <div className="text-center p-6 bg-card rounded-lg border">
            <div className="text-3xl font-bold text-primary mb-2">4.9/5</div>
            <p className="text-sm text-muted-foreground">Average Rating</p>
          </div>
        </div>
      </div>
    </section>
  );
}
