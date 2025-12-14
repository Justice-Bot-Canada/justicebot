import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2, BookOpen, Download, Crown, FileText, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast-stub';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import { useNavigate } from 'react-router-dom';

interface Exhibit {
  label: string;
  file_name: string;
  description: string | null;
  category: string | null;
  date: string | null;
  summary: string | null;
}

interface ExhibitBookExportProps {
  caseId: string;
  caseTitle: string;
}

export function ExhibitBookExport({ caseId, caseTitle }: ExhibitBookExportProps) {
  const { hasAccess, tier } = usePremiumAccess();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [exhibits, setExhibits] = useState<Exhibit[]>([]);
  const [tableOfContents, setTableOfContents] = useState<any[]>([]);
  const [numberingStyle, setNumberingStyle] = useState<'alphabetical' | 'numerical'>('alphabetical');
  const [includeTableOfContents, setIncludeTableOfContents] = useState(true);

  const isPremium = hasAccess && (tier === 'monthly' || tier === 'yearly');

  const handleGenerateExhibitBook = async () => {
    if (!isPremium) {
      toast.error('Exhibit Book Export is a premium feature');
      return;
    }

    setGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-exhibit-book', {
        body: {
          caseId,
          includeTableOfContents,
          numberingStyle
        }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setExhibits(data.exhibits || []);
      setTableOfContents(data.tableOfContents || []);
      
      toast.success(`Exhibit book generated with ${data.exhibitCount} exhibits`);
    } catch (err: any) {
      console.error('Exhibit book error:', err);
      toast.error(err.message || 'Failed to generate exhibit book');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadAll = () => {
    // Download each exhibit
    exhibits.forEach((exhibit, index) => {
      // In a real implementation, this would download the actual files
      toast.success(`Downloading ${exhibit.label}: ${exhibit.file_name}`);
    });
  };

  if (!isPremium) {
    return (
      <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" />
            Exhibit Book Export
            <Badge className="bg-amber-500">Premium</Badge>
          </CardTitle>
          <CardDescription>
            Export a professionally organized exhibit book with table of contents, labels, and proper numbering for court submission.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground mb-4">
              Upgrade to Monthly or Yearly plan to unlock Exhibit Book Export
            </p>
            <Button onClick={() => navigate('/pricing')} className="gap-2">
              <Crown className="h-4 w-4" />
              Upgrade to Premium
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Exhibit Book Export
          <Badge variant="secondary">Premium</Badge>
        </CardTitle>
        <CardDescription>
          Generate a professionally organized exhibit book ready for court submission
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Options */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Numbering Style</Label>
              <Select value={numberingStyle} onValueChange={(v) => setNumberingStyle(v as 'alphabetical' | 'numerical')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alphabetical">Alphabetical (A, B, C...)</SelectItem>
                  <SelectItem value="numerical">Numerical (1, 2, 3...)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Include Table of Contents</Label>
              <div className="flex items-center gap-2 pt-2">
                <Switch
                  checked={includeTableOfContents}
                  onCheckedChange={setIncludeTableOfContents}
                />
                <span className="text-sm text-muted-foreground">
                  {includeTableOfContents ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleGenerateExhibitBook} 
            disabled={generating}
            className="w-full"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Exhibit Book...
              </>
            ) : (
              <>
                <BookOpen className="h-4 w-4 mr-2" />
                Generate Exhibit Book
              </>
            )}
          </Button>

          {/* Generated Exhibits */}
          {exhibits.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Generated Exhibit Book</h4>
                <Button size="sm" variant="outline" onClick={handleDownloadAll}>
                  <Download className="h-4 w-4 mr-1" />
                  Download All
                </Button>
              </div>

              {includeTableOfContents && tableOfContents.length > 0 && (
                <Card className="bg-muted/50">
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">Table of Contents</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <ScrollArea className="max-h-48">
                      <div className="space-y-1">
                        {tableOfContents.map((item, index) => (
                          <div key={index} className="flex items-center justify-between text-sm py-1 border-b border-muted last:border-0">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">{item.label}</Badge>
                              <span className="truncate max-w-[200px]">{item.title}</span>
                            </div>
                            <span className="text-muted-foreground text-xs">{item.category || 'Document'}</span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-2">
                {exhibits.map((exhibit, index) => (
                  <Card key={index} className="hover:border-primary/50 transition-colors">
                    <CardContent className="py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge className="bg-primary">{exhibit.label}</Badge>
                          <div>
                            <p className="font-medium text-sm">{exhibit.file_name}</p>
                            {exhibit.description && (
                              <p className="text-xs text-muted-foreground truncate max-w-[250px]">
                                {exhibit.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
