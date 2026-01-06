import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useRole } from '@/hooks/useRole';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Loader2, 
  Plus, 
  Copy, 
  ExternalLink, 
  Download, 
  Users, 
  FileCheck, 
  TrendingUp,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { Program } from '@/contexts/ProgramContext';

interface ProgramStats {
  total_cases: number;
  intake_started: number;
  docs_ready: number;
  completed: number;
  avg_merit_score: number | null;
  triage_complete_count: number;
  referral_sources: string[] | null;
  cohort_batches: string[] | null;
}

interface ProgramSummary {
  total_referrals: number;
  intake_started: number;
  docs_ready: number;
  completed: number;
  completion_rate: number;
  doc_readiness_rate: number;
}

export default function AdminProgramDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, loading: roleLoading } = useRole();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [stats, setStats] = useState<ProgramStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newProgram, setNewProgram] = useState({
    slug: '',
    name: '',
    description: '',
    organization: '',
    contact_email: '',
    disable_pricing: true,
    show_no_legal_advice_banner: true,
    disable_ai_beyond_procedural: false,
    cohort_batch: '',
  });

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      navigate('/');
      return;
    }
    if (isAdmin) {
      fetchPrograms();
    }
  }, [isAdmin, roleLoading, navigate]);

  const fetchPrograms = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load programs');
      console.error(error);
    } else {
      setPrograms((data || []) as Program[]);
    }
    setIsLoading(false);
  };

  const fetchProgramStats = async (programId: string) => {
    const { data, error } = await supabase.rpc('get_program_stats', { p_program_id: programId });
    
    if (error) {
      toast.error('Failed to load program stats');
      console.error(error);
    } else {
      setStats(data as unknown as ProgramStats);
    }
  };

  const handleSelectProgram = (program: Program) => {
    setSelectedProgram(program);
    fetchProgramStats(program.id);
  };

  const handleCreateProgram = async () => {
    if (!newProgram.slug || !newProgram.name) {
      toast.error('Slug and name are required');
      return;
    }

    setIsCreating(true);
    const { data, error } = await supabase
      .from('programs')
      .insert({
        slug: newProgram.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        name: newProgram.name,
        description: newProgram.description || null,
        organization: newProgram.organization || null,
        contact_email: newProgram.contact_email || null,
        disable_pricing: newProgram.disable_pricing,
        show_no_legal_advice_banner: newProgram.show_no_legal_advice_banner,
        disable_ai_beyond_procedural: newProgram.disable_ai_beyond_procedural,
        cohort_batch: newProgram.cohort_batch || null,
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to create program: ' + error.message);
    } else {
      toast.success('Program created successfully');
      setShowCreateDialog(false);
      setNewProgram({
        slug: '',
        name: '',
        description: '',
        organization: '',
        contact_email: '',
        disable_pricing: true,
        show_no_legal_advice_banner: true,
        disable_ai_beyond_procedural: false,
        cohort_batch: '',
      });
      fetchPrograms();
    }
    setIsCreating(false);
  };

  const copyReferralLink = (slug: string) => {
    const link = `${window.location.origin}/program/${slug}`;
    navigator.clipboard.writeText(link);
    toast.success('Referral link copied to clipboard');
  };

  const exportProgramSummary = async (programId: string, programName: string) => {
    const { data, error } = await supabase.rpc('export_program_summary', { p_program_id: programId });
    
    if (error) {
      toast.error('Failed to export summary');
      return;
    }

    const summary = (data as ProgramSummary[])[0];
    const csv = [
      ['Metric', 'Value'],
      ['Total Referrals', summary.total_referrals],
      ['Intake Started', summary.intake_started],
      ['Documentation Ready', summary.docs_ready],
      ['Completed', summary.completed],
      ['Completion Rate (%)', summary.completion_rate],
      ['Doc Readiness Rate (%)', summary.doc_readiness_rate],
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${programName.toLowerCase().replace(/\s+/g, '-')}-summary.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Summary exported');
  };

  if (roleLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Program Dashboard</h1>
            <p className="text-muted-foreground">Manage government and agency pilot programs</p>
          </div>
        </div>

        <Tabs defaultValue="programs" className="space-y-6">
          <TabsList>
            <TabsTrigger value="programs">Programs</TabsTrigger>
            <TabsTrigger value="analytics" disabled={!selectedProgram}>
              Analytics {selectedProgram && `- ${selectedProgram.name}`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="programs" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Active Programs</h2>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Program
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Program</DialogTitle>
                    <DialogDescription>
                      Set up a new pilot program for government or agency partners.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="slug">URL Slug *</Label>
                      <Input
                        id="slug"
                        placeholder="e.g., hss-pilot"
                        value={newProgram.slug}
                        onChange={(e) => setNewProgram({ ...newProgram, slug: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Link will be: /program/{newProgram.slug || 'your-slug'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Program Name *</Label>
                      <Input
                        id="name"
                        placeholder="e.g., HSS Tenant Support Pilot"
                        value={newProgram.name}
                        onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organization">Organization</Label>
                      <Input
                        id="organization"
                        placeholder="e.g., Housing Support Services"
                        value={newProgram.organization}
                        onChange={(e) => setNewProgram({ ...newProgram, organization: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Brief description of the program..."
                        value={newProgram.description}
                        onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact_email">Contact Email</Label>
                      <Input
                        id="contact_email"
                        type="email"
                        placeholder="pilot@agency.gov"
                        value={newProgram.contact_email}
                        onChange={(e) => setNewProgram({ ...newProgram, contact_email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cohort">Default Cohort Batch</Label>
                      <Input
                        id="cohort"
                        placeholder="e.g., 2024-Q1"
                        value={newProgram.cohort_batch}
                        onChange={(e) => setNewProgram({ ...newProgram, cohort_batch: e.target.value })}
                      />
                    </div>
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="disable_pricing">Disable Pricing/Upsells</Label>
                        <Switch
                          id="disable_pricing"
                          checked={newProgram.disable_pricing}
                          onCheckedChange={(v) => setNewProgram({ ...newProgram, disable_pricing: v })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show_banner">Show No Legal Advice Banner</Label>
                        <Switch
                          id="show_banner"
                          checked={newProgram.show_no_legal_advice_banner}
                          onCheckedChange={(v) => setNewProgram({ ...newProgram, show_no_legal_advice_banner: v })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="disable_ai">Limit AI to Procedural Only</Label>
                        <Switch
                          id="disable_ai"
                          checked={newProgram.disable_ai_beyond_procedural}
                          onCheckedChange={(v) => setNewProgram({ ...newProgram, disable_ai_beyond_procedural: v })}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateProgram} disabled={isCreating}>
                      {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Create Program
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Program</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Referrals</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {programs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No programs created yet. Create your first program to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    programs.map((program) => (
                      <TableRow key={program.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{program.name}</p>
                            <p className="text-xs text-muted-foreground">/program/{program.slug}</p>
                          </div>
                        </TableCell>
                        <TableCell>{program.organization || '—'}</TableCell>
                        <TableCell>{program.referral_count}</TableCell>
                        <TableCell>
                          <Badge variant={program.is_active ? 'default' : 'secondary'}>
                            {program.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => copyReferralLink(program.slug)}
                              title="Copy referral link"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => window.open(`/program/${program.slug}`, '_blank')}
                              title="View landing page"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSelectProgram(program)}
                            >
                              View Stats
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {selectedProgram && stats && (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">{selectedProgram.name} Analytics</h2>
                  <Button
                    variant="outline"
                    onClick={() => exportProgramSummary(selectedProgram.id, selectedProgram.name)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Total Referrals</CardDescription>
                      <CardTitle className="text-3xl flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        {stats.total_cases}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Intake Started</CardDescription>
                      <CardTitle className="text-3xl">{stats.intake_started}</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Docs Ready</CardDescription>
                      <CardTitle className="text-3xl flex items-center gap-2">
                        <FileCheck className="h-5 w-5 text-green-600" />
                        {stats.docs_ready}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Completed</CardDescription>
                      <CardTitle className="text-3xl flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        {stats.completed}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Completion Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold text-primary">
                        {stats.total_cases > 0 
                          ? Math.round((stats.completed / stats.total_cases) * 100) 
                          : 0}%
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {stats.completed} of {stats.total_cases} cases completed
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Documentation Readiness</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold text-green-600">
                        {stats.total_cases > 0 
                          ? Math.round((stats.docs_ready / stats.total_cases) * 100) 
                          : 0}%
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {stats.docs_ready} cases with documents prepared
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {stats.avg_merit_score && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Average Case Merit Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold">{stats.avg_merit_score}/100</div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Based on {stats.triage_complete_count} triaged cases
                      </p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
