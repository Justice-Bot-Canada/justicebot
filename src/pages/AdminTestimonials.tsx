import { useState, useEffect } from "react";
import { useRole } from "@/hooks/useRole";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Check, X, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Testimonial {
  id: string;
  name: string;
  location: string | null;
  case_type: string;
  story: string;
  outcome: string | null;
  rating: number;
  status: string;
  featured: boolean;
  created_at: string;
}

export default function AdminTestimonials() {
  const { isAdmin, loading: roleLoading } = useRole();
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      navigate("/");
    } else if (isAdmin) {
      loadTestimonials();
    }
  }, [isAdmin, roleLoading, navigate]);

  const loadTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error("Error loading testimonials:", error);
      toast({ title: "Error loading testimonials", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const updateTestimonial = async (id: string, updates: any) => {
    try {
      const { error } = await supabase
        .from("testimonials")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Testimonial updated" });
      loadTestimonials();
    } catch (error) {
      console.error("Error updating testimonial:", error);
      toast({ title: "Error updating testimonial", variant: "destructive" });
    }
  };

  if (roleLoading || loading) {
    return <div className="container mx-auto p-8">Loading...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Manage Testimonials</h1>

      <div className="space-y-4">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">{testimonial.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {testimonial.location} • {testimonial.case_type}
                </p>
                <div className="flex gap-1 mt-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <Badge
                  variant={
                    testimonial.status === "approved"
                      ? "default"
                      : testimonial.status === "rejected"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {testimonial.status}
                </Badge>
                {testimonial.featured && (
                  <Badge variant="outline" className="gap-1">
                    <Sparkles className="w-3 h-3" />
                    Featured
                  </Badge>
                )}
              </div>
            </div>

            <p className="text-sm mb-2">{testimonial.story}</p>
            {testimonial.outcome && (
              <p className="text-sm font-semibold text-primary mb-4">
                ✓ {testimonial.outcome}
              </p>
            )}

            <div className="flex gap-2">
              {testimonial.status !== "approved" && (
                <Button
                  size="sm"
                  onClick={() =>
                    updateTestimonial(testimonial.id, {
                      status: "approved",
                      approved_at: new Date().toISOString(),
                    })
                  }
                >
                  <Check className="w-4 h-4 mr-1" />
                  Approve
                </Button>
              )}
              {testimonial.status !== "rejected" && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() =>
                    updateTestimonial(testimonial.id, { status: "rejected" })
                  }
                >
                  <X className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  updateTestimonial(testimonial.id, {
                    featured: !testimonial.featured,
                  })
                }
              >
                <Sparkles className="w-4 h-4 mr-1" />
                {testimonial.featured ? "Unfeature" : "Feature"}
              </Button>
            </div>
          </Card>
        ))}

        {testimonials.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No testimonials yet
          </p>
        )}
      </div>
    </div>
  );
}
