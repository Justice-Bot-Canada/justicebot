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
import { Mail, Phone, Building } from "lucide-react";
import { TurnstileWidget } from "@/components/TurnstileWidget";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address").max(255, "Email must be less than 255 characters"),
  organization: z.string().min(2, "Organization name is required").max(100, "Organization name must be less than 100 characters"),
  phone: z.string().optional(),
  inquiryType: z.enum(["media", "partnership", "government"], {
    required_error: "Please select an inquiry type",
  }),
  subject: z.string().min(5, "Subject must be at least 5 characters").max(200, "Subject must be less than 200 characters"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message must be less than 2000 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  className?: string;
}

export const ContactForm = ({ className }: ContactFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      organization: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    if (!turnstileToken) {
      toast({
        title: "Verification required",
        description: "Please complete the security check",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch(
        `https://vkzquzjtewqhcisvhsvg.supabase.co/functions/v1/submit-contact`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...data, turnstileToken }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit contact form');
      }

      const result = await response.json();
      
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 1-2 business days.",
      });
      
      form.reset();
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast({
        title: "Error sending message",
        description: "Please try again later or email us directly at admin@justice-bot.com",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInquiryTypeLabel = (type: string) => {
    switch (type) {
      case "media":
        return "Media & Press";
      case "partnership":
        return "Business Partnership";
      case "government":
        return "Government & Public Sector";
      default:
        return "Select inquiry type";
    }
  };

  const getInquiryTypeDescription = (type: string) => {
    switch (type) {
      case "media":
        return "Press inquiries, interviews, and media coverage";
      case "partnership":
        return "Business collaborations and partnership opportunities";
      case "government":
        return "Government relations and public sector initiatives";
      default:
        return "";
    }
  };

  return (
    <Card className={`w-full max-w-2xl mx-auto ${className}`}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Get in Touch</CardTitle>
        <CardDescription>
          Reach out for media inquiries, partnership opportunities, or government collaboration
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
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
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
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="your.email@example.com" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="organization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Your organization" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="+1 (555) 123-4567" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="inquiryType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inquiry Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the type of inquiry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="media">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{getInquiryTypeLabel("media")}</span>
                          <span className="text-sm text-muted-foreground">{getInquiryTypeDescription("media")}</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="partnership">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{getInquiryTypeLabel("partnership")}</span>
                          <span className="text-sm text-muted-foreground">{getInquiryTypeDescription("partnership")}</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="government">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{getInquiryTypeLabel("government")}</span>
                          <span className="text-sm text-muted-foreground">{getInquiryTypeDescription("government")}</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief description of your inquiry" {...field} />
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
                      placeholder="Please provide details about your inquiry, including any specific requirements or deadlines"
                      className="min-h-[120px] resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <TurnstileWidget 
              onSuccess={(token) => setTurnstileToken(token)}
              onError={() => {
                toast({
                  title: "Verification failed",
                  description: "Please refresh the page and try again",
                  variant: "destructive",
                });
              }}
            />

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || !turnstileToken}
              size="lg"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              We typically respond to inquiries within 1-2 business days. For urgent matters, 
              please call us directly at <span className="font-medium">1-800-JUSTICE</span>.
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};