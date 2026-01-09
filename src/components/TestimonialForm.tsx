import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function TestimonialForm({ caseId, caseType }: { caseId?: string; caseType?: string }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    story: "",
    outcome: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({ title: "Please sign in", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("testimonials").insert({
        name: formData.name,
        location: formData.location,
        case_type: caseType || "General",
        story: formData.story,
        outcome: formData.outcome,
        rating,
        content: formData.story,
      });

      if (error) throw error;

      toast({
        title: "Thank you for your feedback!",
        description: "Your testimonial will be reviewed and published soon.",
      });

      // Reset form
      setFormData({ name: "", location: "", story: "", outcome: "" });
      setRating(5);
    } catch (error: unknown) {
      console.error("Error submitting testimonial:", error);
      toast({
        title: "Error",
        description: "Failed to submit testimonial",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-2xl font-bold mb-4">Share Your Success Story</h3>
      <p className="text-muted-foreground mb-6">
        Help others by sharing your experience with Justice-Bot
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Your Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="First name or initials"
            required
          />
        </div>

        <div>
          <Label htmlFor="location">Location (Optional)</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="City, Province"
          />
        </div>

        <div>
          <Label>Rating</Label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    star <= rating
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="story">Your Story</Label>
          <Textarea
            id="story"
            value={formData.story}
            onChange={(e) => setFormData({ ...formData, story: e.target.value })}
            placeholder="Tell us about your experience with Justice-Bot..."
            rows={4}
            required
          />
        </div>

        <div>
          <Label htmlFor="outcome">Outcome (Optional)</Label>
          <Input
            id="outcome"
            value={formData.outcome}
            onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
            placeholder="e.g., Won case, recovered $2,400"
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Submitting..." : "Submit Testimonial"}
        </Button>
      </form>
    </Card>
  );
}
