import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
// ❌ REMOVED - Sonner causing runtime errors
// import { toast } from "sonner";
import { toast } from "@/lib/toast-stub";
import { RefreshCw, Download, AlertCircle, CheckCircle } from "lucide-react";

interface SyncResult {
  success: boolean;
  summary: {
    total: number;
    created: number;
    updated: number;
    errors: number;
  };
  forms?: Array<{ code: string; title: string }>;
  message: string;
}

const AdminFormsSync = () => {
  const [loading, setLoading] = useState(false);
  const [selectedSite, setSelectedSite] = useState<string>("ontariocourtforms");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [result, setResult] = useState<SyncResult | null>(null);

  const sites = [
    { value: "ontariocourtforms", label: "Ontario Court Forms" },
    { value: "tribunalsontario", label: "Tribunals Ontario" }
  ];

  const categories = {
    ontariocourtforms: [
      { value: "all", label: "All Categories" },
      { value: "family", label: "Family Law" },
      { value: "smallClaims", label: "Small Claims" },
      { value: "criminal", label: "Criminal" },
      { value: "civil", label: "Civil" }
    ],
    tribunalsontario: [
      { value: "all", label: "All Tribunals" },
      { value: "ltb", label: "Landlord Tenant Board" },
      { value: "hrto", label: "Human Rights Tribunal" }
    ]
  };

  const handleScrapeAndSync = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      toast.info("Starting form sync...", {
        description: `Scraping ${selectedSite}`
      });

      const { data, error } = await supabase.functions.invoke('scrape-court-forms', {
        body: { 
          site: selectedSite,
          category: selectedCategory === 'all' ? undefined : selectedCategory
        }
      });

      if (error) throw error;

      setResult(data as SyncResult);
      
      if (data.success) {
        toast.success("Forms synced successfully!", {
          description: data.message
        });
      } else {
        toast.error("Sync completed with errors", {
          description: data.message
        });
      }
    } catch (error: any) {
      console.error('Sync error:', error);
      toast.error("Sync failed", {
        description: error.message || "Failed to sync forms"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLegacySync = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      toast.info("Starting legacy form sync...");

      const { data, error } = await supabase.functions.invoke('sync-ontario-forms', {
        body: {}
      });

      if (error) throw error;

      setResult(data as SyncResult);
      
      toast.success("Legacy forms synced!", {
        description: data.message
      });
    } catch (error: any) {
      console.error('Legacy sync error:', error);
      toast.error("Legacy sync failed", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Court Forms Sync</h1>
            <p className="text-muted-foreground">
              Automatically scrape and sync court forms from official websites
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Dynamic Form Scraper</CardTitle>
              <CardDescription>
                Scrape forms directly from court websites and sync to database
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Website</label>
                  <Select value={selectedSite} onValueChange={setSelectedSite}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sites.map(site => (
                        <SelectItem key={site.value} value={site.value}>
                          {site.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories[selectedSite as keyof typeof categories].map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This will scrape forms from the selected website and automatically create/update them in your database.
                  Existing forms will be updated, new forms will be created.
                </AlertDescription>
              </Alert>

              <Button 
                onClick={handleScrapeAndSync} 
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Scraping...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Scrape & Sync Forms
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Legacy Hardcoded Sync</CardTitle>
              <CardDescription>
                Sync from hardcoded form list (backup option)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleLegacySync} 
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Sync Legacy Forms
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {result && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {result.success ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Sync Results
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                      Sync Completed with Errors
                    </>
                  )}
                </CardTitle>
                <CardDescription>{result.message}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">{result.summary.total}</div>
                    <div className="text-sm text-muted-foreground">Total</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {result.summary.created}
                    </div>
                    <div className="text-sm text-muted-foreground">Created</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {result.summary.updated}
                    </div>
                    <div className="text-sm text-muted-foreground">Updated</div>
                  </div>
                </div>

                {result.summary.errors > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {result.summary.errors} forms failed to sync. Check logs for details.
                    </AlertDescription>
                  </Alert>
                )}

                {result.forms && result.forms.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Synced Forms:</h3>
                    <div className="max-h-64 overflow-y-auto space-y-1">
                      {result.forms.map((form, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm p-2 border rounded">
                          <Badge variant="outline">{form.code}</Badge>
                          <span className="text-muted-foreground">{form.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
    </>
  );
};

export default AdminFormsSync;
