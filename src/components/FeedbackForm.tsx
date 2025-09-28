import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Star, Send } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const feedbackSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address").max(255, "Email must be less than 255 characters"),
  feedback_type: z.enum(["bug_report", "feature_request", "testimonial", "complaint", "suggestion"], {
    required_error: "Please select a feedback type",
  }),
  rating: z.number().min(1, "Please provide a rating").max(5, "Rating must be between 1 and 5").optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters").max(200, "Subject must be less than 200 characters"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message must be less than 2000 characters"),
  is_public: z.boolean().default(false)
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

interface FeedbackFormProps {
  className?: string;
  caseId?: string;
}

export const FeedbackForm = ({ className, caseId }: FeedbackFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      name: "",
      email: user?.email || "",
      subject: "",
      message: "",
      is_public: false,
    },
  });

  const selectedFeedbackType = form.watch("feedback_type");
  const rating = form.watch("rating");

  const onSubmit = async (data: FeedbackFormData) => {
    setIsSubmitting(true);
    
    try {
      const feedbackData = {
        user_id: user?.id || null,
        email: data.email,
        name: data.name,
        feedback_type: data.feedback_type,
        rating: data.rating || null,
        subject: data.subject,
        message: data.message,
        case_id: caseId || null,
        is_public: data.is_public
      };

      const { error } = await supabase
        .from('user_feedback')
        .insert(feedbackData);

      if (error) throw error;
      
      toast({
        title: "Feedback submitted successfully!",
        description: "Thank you for your feedback. We'll review it and get back to you if needed.",
      });
      
      form.reset();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Error submitting feedback",
        description: "Please try again later or email us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFeedbackTypeLabel = (type: string) => {
    switch (type) {
      case "bug_report":
        return "Bug Report";
      case "feature_request":
        return "Feature Request";
      case "testimonial":
        return "Testimonial";
      case "complaint":
        return "Complaint";
      case "suggestion":
        return "Suggestion";
      default:
        return "Select feedback type";
    }
  };

  const getFeedbackTypeDescription = (type: string) => {
    switch (type) {
      case "bug_report":
        return "Report a bug or technical issue";
      case "feature_request":
        return "Request a new feature or improvement";
      case "testimonial":
        return "Share your positive experience";
      case "complaint":
        return "Report a problem or issue";
      case "suggestion":
        return "General suggestions for improvement";
      default:
        return "";
    }
  };

  const shouldShowRating = selectedFeedbackType === "testimonial" || selectedFeedbackType === "complaint";

  return (
    <Card className={`w-full max-w-2xl mx-auto ${className}`}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Share Your Feedback</CardTitle>
        <CardDescription>
          Help us improve Justice Bot by sharing your experience and suggestions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="feedback_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feedback Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the type of feedback" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["bug_report", "feature_request", "testimonial", "complaint", "suggestion"].map((type) => (
                        <SelectItem key={type} value={type}>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{getFeedbackTypeLabel(type)}</span>
                            <span className="text-sm text-muted-foreground">{getFeedbackTypeDescription(type)}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {shouldShowRating && (
              <>
                <Separator />
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating (1-5 stars)</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => field.onChange(star)}
                              className="focus:outline-none focus:ring-2 focus:ring-primary rounded"
                            >
                              <Star
                                className={`h-6 w-6 ${
                                  rating && rating >= star
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300 hover:text-yellow-400"
                                } transition-colors`}
                              />
                            </button>
                          ))}
                          {rating && (
                            <span className="ml-2 text-sm text-muted-foreground">
                              {rating} out of 5 stars
                            </span>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator />
              </>
            )}

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief description of your feedback" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Please provide detailed feedback. Include steps to reproduce if reporting a bug."
                      className="min-h-[120px] resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
              size="lg"
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              Your feedback helps us improve Justice Bot. We typically review feedback within 
              2-3 business days and may reach out for clarification if needed.
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};