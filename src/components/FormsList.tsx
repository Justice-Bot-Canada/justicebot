import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Search, DollarSign, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
// ❌ REMOVED - Sonner causing runtime errors
// import { toast } from "sonner";
import { toast } from "@/lib/toast-stub";
import { useAuth } from "@/hooks/useAuth";
import { usePremiumAccess } from "@/hooks/usePremiumAccess";

interface Form {
  id: string;
  form_code: string;
  title: string;
  description: string;
  category: string;
  tribunal_type: string;
  price_cents: number;
  pdf_url: string | null;
  is_active: boolean;
  purchasable: boolean;
}

export function FormsList() {
  const { user } = useAuth();
  const { hasAccess } = usePremiumAccess();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [purchasedFormIds, setPurchasedFormIds] = useState<Set<string>>(new Set());
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);

  useEffect(() => {
    loadForms();
    if (user) {
      loadPurchasedForms();
    }
  }, [user]);

  const loadForms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('forms')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('title', { ascending: true });

      if (error) throw error;
      setForms(data || []);
    } catch (error: any) {
      console.error('Error loading forms:', error);
      toast.error('Failed to load forms');
    } finally {
      setLoading(false);
    }
  };

  const loadPurchasedForms = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('payments')
        .select('form_id')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .not('form_id', 'is', null);

      if (error) throw error;
      
      const formIds = new Set(data?.map(p => p.form_id).filter(Boolean) || []);
      setPurchasedFormIds(formIds);
    } catch (error) {
      console.error('Error loading purchased forms:', error);
    }
  };

  const handlePurchase = async (form: Form) => {
    if (!user) {
      toast.error("Please sign in to purchase forms");
      return;
    }

    setProcessingPayment(form.id);

    try {
      // Create payment record
      const { data: paymentData, error: paymentError } = await supabase
        .from('payments')
        .insert([{
          user_id: user.id,
          form_id: form.id,
          amount: form.price_cents / 100,
          amount_cents: form.price_cents,
          currency: 'CAD',
          plan_type: 'form_purchase',
          status: 'pending',
          payment_id: `form_${form.id}_${Date.now()}`,
          payment_provider: 'paypal'
        }])
        .select()
        .single();

      if (paymentError) throw paymentError;

      // Call payment function
      const { data: sessionData, error: sessionError } = await supabase.functions.invoke('create-form-payment', {
        body: {
          formId: form.id,
          paymentId: paymentData.id
        }
      });

      if (sessionError) throw sessionError;

      if (sessionData?.url) {
        window.open(sessionData.url, '_blank');
        toast.success("Payment window opened. Complete payment to download form.");
      } else {
        throw new Error('No payment URL received');
      }
    } catch (error: any) {
      console.error('Error processing payment:', error);
      toast.error(error.message || 'Failed to process payment');
    } finally {
      setProcessingPayment(null);
    }
  };

  const handleDownload = async (form: Form) => {
    if (!form.pdf_url) {
      toast.error("Download URL not available");
      return;
    }

    try {
      // Track download
      await supabase
        .from('form_usage')
        .insert({
          form_id: form.id,
          user_id: user?.id,
          completion_status: 'downloaded'
        });

      // Open download link
      window.open(form.pdf_url, '_blank');
      toast.success("Form download started");
    } catch (error) {
      console.error('Error downloading form:', error);
      toast.error("Failed to download form");
    }
  };

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.form_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || form.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(forms.map(f => f.category)));

  const canAccessForm = (form: Form) => {
    // Premium users get free access
    if (hasAccess) return true;
    // Check if already purchased
    if (purchasedFormIds.has(form.id)) return true;
    // Check if free form
    if (form.price_cents === 0) return true;
    return false;
  };

  const getPrice = (form: Form) => {
    if (hasAccess) return "FREE (Premium)";
    if (purchasedFormIds.has(form.id)) return "Purchased";
    if (form.price_cents === 0) return "FREE";
    return `$${(form.price_cents / 100).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search forms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Forms Grid */}
      {filteredForms.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No forms found matching your criteria</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredForms.map((form) => {
            const hasAccess = canAccessForm(form);
            const isPurchased = purchasedFormIds.has(form.id);

            return (
              <Card key={form.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary">{form.form_code}</Badge>
                    <Badge variant={hasAccess ? "default" : "outline"}>
                      {getPrice(form)}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{form.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {form.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Category:</span>
                      <Badge variant="outline">{form.category}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tribunal:</span>
                      <span className="font-medium">{form.tribunal_type}</span>
                    </div>

                    {hasAccess ? (
                      <Button
                        onClick={() => handleDownload(form)}
                        className="w-full"
                        disabled={!form.pdf_url}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Form
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handlePurchase(form)}
                        className="w-full"
                        disabled={!form.purchasable || processingPayment === form.id}
                      >
                        {processingPayment === form.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <DollarSign className="w-4 h-4 mr-2" />
                            Purchase & Download
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
