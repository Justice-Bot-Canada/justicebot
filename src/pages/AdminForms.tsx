import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Loader2, ArrowLeft, Search, Plus, ExternalLink, FileText } from "lucide-react";
import { toast } from "@/lib/toast-stub";

interface FormRecord {
  id: string;
  form_code: string;
  title: string;
  tribunal_type: string;
  category: string;
  province: string | null;
  is_active: boolean;
  pdf_url: string | null;
  price_cents: number;
  usage_count: number | null;
}

const AdminForms = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useRole();
  const [loading, setLoading] = useState(true);
  const [forms, setForms] = useState<FormRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVenue, setFilterVenue] = useState('all');

  useEffect(() => {
    if (authLoading || roleLoading) return;
    if (!user) {
      navigate('/welcome');
      return;
    }
    if (!isAdmin) {
      toast.error('Admin access required');
      navigate('/dashboard');
      return;
    }
    loadForms();
  }, [user, authLoading, isAdmin, roleLoading]);

  const loadForms = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('forms')
        .select('*')
        .order('form_code', { ascending: true });
      
      if (error) throw error;
      setForms(data || []);
    } catch (error) {
      console.error('Error loading forms:', error);
      toast.error('Failed to load forms');
    } finally {
      setLoading(false);
    }
  };

  const toggleFormActive = async (formId: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from('forms')
        .update({ is_active: !currentState })
        .eq('id', formId);
      
      if (error) throw error;
      
      setForms(prev => prev.map(f => 
        f.id === formId ? { ...f, is_active: !currentState } : f
      ));
      toast.success(`Form ${!currentState ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error toggling form:', error);
      toast.error('Failed to update form');
    }
  };

  const filteredForms = forms.filter(form => {
    const matchesSearch = 
      form.form_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVenue = filterVenue === 'all' || form.tribunal_type.toLowerCase().includes(filterVenue.toLowerCase());
    return matchesSearch && matchesVenue;
  });

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Forms Management | Admin | Justice-Bot</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Forms Management</h1>
              <p className="text-muted-foreground">{forms.length} forms in database</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/admin/forms-sync')}>
              Sync Forms
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Form
            </Button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by form code or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterVenue}
            onChange={(e) => setFilterVenue(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="all">All Venues</option>
            <option value="ltb">LTB</option>
            <option value="hrto">HRTO</option>
            <option value="small claims">Small Claims</option>
            <option value="family">Family</option>
            <option value="superior">Superior Court</option>
          </select>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Form Code</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Usage</TableHead>
                    <TableHead className="text-center">Active</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredForms.map((form) => (
                    <TableRow key={form.id}>
                      <TableCell className="font-mono font-medium">{form.form_code}</TableCell>
                      <TableCell className="max-w-xs truncate">{form.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{form.tribunal_type}</Badge>
                      </TableCell>
                      <TableCell>{form.category}</TableCell>
                      <TableCell className="text-right">
                        {form.price_cents > 0 ? `$${(form.price_cents / 100).toFixed(2)}` : 'Free'}
                      </TableCell>
                      <TableCell className="text-right">{form.usage_count || 0}</TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={form.is_active}
                          onCheckedChange={() => toggleFormActive(form.id, form.is_active)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {form.pdf_url && (
                            <Button variant="ghost" size="icon" asChild>
                              <a href={form.pdf_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => navigate(`/form/${form.id}`)}>
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredForms.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No forms found matching your criteria
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminForms;
