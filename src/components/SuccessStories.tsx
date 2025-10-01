import { Star, Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function SuccessStories() {
  const testimonials = [
    {
      name: "Sarah M.",
      location: "Toronto, ON",
      caseType: "Landlord & Tenant Board",
      rating: 5,
      story: "Justice-Bot helped me prepare my LTB application in under an hour. The AI guidance was clear and the forms were automatically filled. I won my case and got my deposit back!",
      initials: "SM",
      outcome: "Won case, recovered $2,400 deposit"
    },
    {
      name: "James T.",
      location: "Ottawa, ON",
      caseType: "Human Rights Tribunal",
      rating: 5,
      story: "As someone with no legal background, I was overwhelmed. Justice-Bot walked me through every step, explained the process clearly, and helped me file a solid complaint. Highly recommend!",
      initials: "JT",
      outcome: "Case accepted, settlement reached"
    },
    {
      name: "Priya K.",
      location: "Mississauga, ON",
      caseType: "Small Claims Court",
      rating: 5,
      story: "The document analyzer saved me so much time! I uploaded my contracts, and it immediately identified the key issues. The merit score gave me confidence to proceed.",
      initials: "PK",
      outcome: "Settled for $4,500"
    },
    {
      name: "Michael R.",
      location: "Hamilton, ON",
      caseType: "Small Claims Court",
      rating: 5,
      story: "I couldn't afford a lawyer for a $3,000 dispute. Justice-Bot cost me $50 and helped me prepare professional court documents. The judge was impressed with my submission.",
      initials: "MR",
      outcome: "Full judgment in my favor"
    },
    {
      name: "Chen L.",
      location: "Markham, ON",
      caseType: "Landlord & Tenant Board",
      rating: 5,
      story: "The AI chatbot answered all my questions about Ontario rental law at 2am when I was panicking about an eviction notice. It explained my rights and helped me respond properly.",
      initials: "CL",
      outcome: "Eviction prevented"
    },
    {
      name: "Amanda W.",
      location: "London, ON",
      caseType: "Human Rights Tribunal",
      rating: 5,
      story: "Filing an HRTO complaint felt impossible until I found Justice-Bot. The step-by-step guidance and timeline tracker kept me organized throughout the entire process.",
      initials: "AW",
      outcome: "Complaint filed successfully"
    }
  ];

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
                    {testimonial.initials}
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
                  {testimonial.caseType}
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {testimonial.story}
                </p>
                <div className="bg-muted/50 rounded-lg p-3 border-l-4 border-primary">
                  <p className="text-sm font-semibold text-primary">
                    ✓ {testimonial.outcome}
                  </p>
                </div>
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
