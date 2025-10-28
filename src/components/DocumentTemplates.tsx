import { useState, useEffect } from "react";
import { FileText, Download, Search, Filter, Lock, Crown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { usePremiumAccess } from "@/hooks/usePremiumAccess";

interface DocumentTemplate {
  id: string;
  title: string;
  description: string | null;
  category: string;
  template_type: string;
  file_path: string;
  preview_content: string | null;
  download_count: number;
  is_premium: boolean;
  tags: string[] | null;
}

export default function DocumentTemplates() {
  const { user } = useAuth();
  const { hasAccess, isPremium, loading: accessLoading } = usePremiumAccess();
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [searchQuery, selectedCategory, templates]);

  const loadTemplates = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('document_templates')
      .select('*')
      .order('title');

    if (error) {
      console.error('Error loading templates:', error);
      toast.error('Failed to load document templates');
    } else {
      setTemplates(data || []);
    }
    setLoading(false);
  };

  const filterTemplates = () => {
    let filtered = templates;

    if (searchQuery) {
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }

    setFilteredTemplates(filtered);
  };

  const handleDownload = async (template: DocumentTemplate) => {
    if (!user) {
      toast.error('Please sign in to download templates');
      return;
    }

    // Check if template is premium and user doesn't have access
    if (template.is_premium && !hasAccess) {
      setSelectedTemplate(template);
      setShowUpgradeDialog(true);
      return;
    }

    try {
      // Increment download count
      await supabase
        .from('document_templates')
        .update({ download_count: template.download_count + 1 })
        .eq('id', template.id);

      // Download file
      window.open(template.file_path, '_blank');
      toast.success('Template downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download template');
    }
  };

  const categories = Array.from(new Set(templates.map(t => t.category)));

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-4 bg-muted rounded mb-4" />
            <div className="h-3 bg-muted rounded mb-2 w-3/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search templates..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[200px]" aria-label="Filter templates by category">
            <Filter className="w-4 h-4 mr-2" />
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

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <Card className="p-8 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">No templates found</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="p-6 hover:shadow-xl transition-all">
              <div className="flex items-start justify-between mb-3">
                <FileText className="w-8 h-8 text-primary" />
                {template.is_premium && (
                  <Badge variant="default">Premium</Badge>
                )}
              </div>
              <h3 className="font-semibold mb-2">{template.title}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {template.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">{template.category}</Badge>
                {template.tags?.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {template.download_count} downloads
                </span>
                <Button 
                  size="sm" 
                  onClick={() => handleDownload(template)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      </div>

      {/* Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-6 h-6 text-primary" />
              <DialogTitle>Premium Template</DialogTitle>
            </div>
            <DialogDescription>
              This template requires a premium subscription to download.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">{selectedTemplate?.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedTemplate?.description}
                  </p>
                </div>
              </div>
            </Card>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Get Premium Access:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Unlimited premium template downloads
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Access to all legal forms and documents
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Priority support and updates
                </li>
              </ul>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowUpgradeDialog(false)}
              className="w-full sm:w-auto"
            >
              Maybe Later
            </Button>
            <Button
              onClick={() => {
                setShowUpgradeDialog(false);
                window.location.href = '/pricing';
              }}
              className="w-full sm:w-auto"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
