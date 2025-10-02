import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Scale, 
  Users, 
  DollarSign,
  Building2,
  ArrowRight,
  Menu
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface FormCategory {
  id: string;
  title: string;
  description: string;
  icon: any;
  forms: string[];
  price: number;
  venue: string;
}

const formCategories: FormCategory[] = [
  {
    id: "ltb",
    title: "Application to Landlord & Tenant Board",
    description: "File disputes about rent, evictions, or repairs",
    icon: Building2,
    forms: ["Form A1 - Tenant Application", "Form A2 - Landlord Application"],
    price: 5.99,
    venue: "ltb"
  },
  {
    id: "hrto",
    title: "Human Rights Application",
    description: "File discrimination or human rights complaints",
    icon: Users,
    forms: ["Form 1 - Application", "Supporting Documents Guide"],
    price: 5.99,
    venue: "hrto"
  },
  {
    id: "small-claims",
    title: "Small Claims Court",
    description: "File claims under $35,000",
    icon: Scale,
    forms: ["Plaintiff's Claim", "Defence Form"],
    price: 5.99,
    venue: "small-claims"
  }
];

const Forms = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("forms");

  const handlePurchase = (category: FormCategory) => {
    if (!user) {
      toast.error("Please sign in to purchase forms");
      navigate("/");
      return;
    }
    
    // Navigate to the form selector for that venue
    navigate(`/forms/${category.venue}`);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    switch (value) {
      case "cases":
        navigate("/dashboard");
        break;
      case "payments":
        navigate("/pricing");
        break;
      case "profile":
        navigate("/profile");
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="cases" className="flex items-center gap-2">
                <Scale className="h-4 w-4" />
                Cases
              </TabsTrigger>
              <TabsTrigger value="forms" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Forms
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Payments
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Profile
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Form Categories */}
          <div className="space-y-6">
            {formCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-3">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{category.title}</CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Form List */}
                    <div className="flex flex-wrap gap-2">
                      {category.forms.map((form, idx) => (
                        <Badge key={idx} variant="outline" className="text-sm">
                          {form}
                        </Badge>
                      ))}
                    </div>

                    {/* Price and Purchase */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-baseline gap-1">
                        <span className="text-muted-foreground text-sm">Price:</span>
                        <span className="text-lg font-bold text-primary">
                          ${category.price.toFixed(2)}
                        </span>
                      </div>
                      
                      <Button 
                        onClick={() => handlePurchase(category)}
                        className="gap-2"
                      >
                        Purchase
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Help Section */}
          <Card className="mt-8 bg-muted/30">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Need Help Choosing?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Not sure which form is right for you? Start with our case assessment for personalized recommendations.
              </p>
              <Button variant="outline" onClick={() => navigate("/triage")}>
                Start Case Assessment
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Forms;
