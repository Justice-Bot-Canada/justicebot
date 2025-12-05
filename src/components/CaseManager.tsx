import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Upload, FileText, Scale, TrendingUp, AlertCircle, ArrowRight, Target, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/lib/toast-stub";
import { useNavigate } from "react-router-dom";
import LegalPathwayGuide from "./LegalPathwayGuide";
import { CaseWorkspace } from "./CaseWorkspace";

interface Case {
  id: string;
  title: string;
  description: string;
  province: string;
  municipality: string;
  law_section: string;
  merit_score: number;
  status: string;
  created_at: string;
}

interface Evidence {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  description: string;
}

interface LegalPathway {
  id: string;
  pathway_type: string;
  recommendation: string;
  confidence_score: number;
  relevant_laws: any; // JSON field from database
  next_steps: any; // JSON field from database
}

interface CaseWithMetrics extends Case {
  evidence_count: number;
  latest_event: { title: string; event_date: string } | null;
  next_step: string | null;
}

const CaseManager = ({ onCaseSelect }: { onCaseSelect?: (caseId: string | null) => void }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cases, setCases] = useState<CaseWithMetrics[]>([]);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [pathways, setPathways] = useState<LegalPathway[]>([]);
  const [showNewCase, setShowNewCase] = useState(false);
  const [showPathwayGuide, setShowPathwayGuide] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetchingCases, setFetchingCases] = useState(false);

  const [newCase, setNewCase] = useState({
    title: '',
    description: '',
    province: '',
    municipality: '',
    law_section: '',
    venue: ''
  });

  useEffect(() => {
    if (user) {
      fetchCases();
    }
  }, [user]);

  useEffect(() => {
    if (selectedCase) {
      fetchEvidence(selectedCase.id);
      fetchPathways(selectedCase.id);
    }
  }, [selectedCase]);

  const fetchCases = async () => {
    if (fetchingCases) {
      console.log('[CaseManager] Already fetching cases, skipping');
      return;
    }
    
    console.log('[CaseManager] Starting fetchCases');
    setFetchingCases(true);
    
    try {
      const { data: casesData, error } = await supabase
        .from('cases')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log('[CaseManager] Fetched cases:', casesData?.length);
      
      // Fetch additional metrics for each case
      const casesWithMetrics = await Promise.all(
        (casesData || []).map(async (case_) => {
          // Get evidence count
          const { count: evidenceCount } = await supabase
            .from('evidence')
            .select('*', { count: 'exact', head: true })
            .eq('case_id', case_.id);

          // Get latest timeline event
          const { data: latestEvent } = await supabase
            .from('case_events')
            .select('title, event_date')
            .eq('case_id', case_.id)
            .order('event_date', { ascending: false })
            .limit(1)
            .single();

          // Get next recommended step from pathways
          const { data: pathway } = await supabase
            .from('legal_pathways')
            .select('next_steps')
            .eq('case_id', case_.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          const nextStep = pathway?.next_steps?.[0] || null;

          return {
            ...case_,
            evidence_count: evidenceCount || 0,
            latest_event: latestEvent || null,
            next_step: nextStep
          };
        })
      );

      setCases(casesWithMetrics);
      console.log('[CaseManager] Cases loaded successfully:', casesWithMetrics.length);
    } catch (error) {
      console.error('[CaseManager] Error fetching cases:', error);
      toast.error('Failed to fetch cases');
    } finally {
      setFetchingCases(false);
    }
  };

  const fetchEvidence = async (caseId: string) => {
    try {
      const { data, error } = await supabase
        .from('evidence')
        .select('*')
        .eq('case_id', caseId)
        .order('upload_date', { ascending: false });

      if (error) throw error;
      setEvidence(data || []);
    } catch (error) {
      console.error('Error fetching evidence:', error);
      toast.error('Failed to fetch evidence');
    }
  };

  const fetchPathways = async (caseId: string) => {
    try {
      const { data, error } = await supabase
        .from('legal_pathways')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPathways(data || []);
    } catch (error) {
      console.error('Error fetching pathways:', error);
    }
  };

  const createCase = async () => {
    if (!user || !newCase.title || !newCase.description || !newCase.province || !newCase.venue) {
      toast.error('Please fill in all required fields including case type');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cases')
        .insert({
          ...newCase,
          user_id: user.id,
          status: 'analyzing'
        })
        .select()
        .single();

      if (error) throw error;

      // Start analysis
      const analysisResponse = await supabase.functions.invoke('analyze-legal-case', {
        body: {
          caseId: data.id,
          description: newCase.description,
          province: newCase.province,
          municipality: newCase.municipality,
          lawSection: newCase.law_section,
          evidenceFiles: []
        }
      });

      if (analysisResponse.error) {
        console.error('Analysis error:', analysisResponse.error);
      }

      setNewCase({ title: '', description: '', province: '', municipality: '', law_section: '', venue: '' });
      setShowNewCase(false);
      fetchCases();
      toast.success('Case created and analysis started');
    } catch (error) {
      console.error('Error creating case:', error);
      toast.error('Failed to create case');
    } finally {
      setLoading(false);
    }
  };

  const deleteCase = async (caseId: string) => {
    try {
      // Delete related records first (foreign key constraints)
      await supabase.from('evidence').delete().eq('case_id', caseId);
      await supabase.from('legal_pathways').delete().eq('case_id', caseId);
      await supabase.from('case_events').delete().eq('case_id', caseId);
      await supabase.from('case_deadlines').delete().eq('case_id', caseId);
      
      const { error } = await supabase
        .from('cases')
        .delete()
        .eq('id', caseId)
        .eq('user_id', user?.id);

      if (error) throw error;
      
      if (selectedCase?.id === caseId) {
        setSelectedCase(null);
        onCaseSelect?.(null);
      }
      
      fetchCases();
      toast.success('Case deleted successfully');
    } catch (error) {
      console.error('Error deleting case:', error);
      toast.error('Failed to delete case');
    }
  };

  const uploadEvidence = async (file: File, description: string) => {
    if (!selectedCase || !user) return;

    setUploading(true);
    try {
      const fileName = `${user.id}/${selectedCase.id}/${Date.now()}_${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('evidence')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('evidence')
        .insert({
          case_id: selectedCase.id,
          file_name: file.name,
          file_path: fileName,
          file_type: file.type,
          description
        });

      if (dbError) throw dbError;

      fetchEvidence(selectedCase.id);
      fetchPathways(selectedCase.id); // Refresh pathways after evidence upload
      toast.success('Evidence uploaded successfully');
    } catch (error) {
      console.error('Error uploading evidence:', error);
      toast.error('Failed to upload evidence');
    } finally {
      setUploading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'analyzing': return 'bg-warning text-warning-foreground';
      case 'pending': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPathwayTitle = (pathwayType: string) => {
    switch (pathwayType) {
      case 'criminal': return 'Criminal Court';
      case 'landlord-tenant': return 'Landlord & Tenant Board';
      case 'human-rights-workplace': return 'Human Rights (Workplace)';
      case 'human-rights': return 'Human Rights Tribunal';
      case 'employment': return 'Employment Standards';
      default: return 'Civil Court';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  if (showPathwayGuide && selectedCase) {
    return (
      <LegalPathwayGuide 
        caseId={selectedCase.id} 
        onBack={() => setShowPathwayGuide(false)} 
      />
    );
  }

  // Show focused workspace when a case is selected
  if (selectedCase) {
    return (
      <CaseWorkspace 
        caseId={selectedCase.id}
        onBack={() => {
          setSelectedCase(null);
          onCaseSelect?.(null);
        }}
      />
    );
  }
  // Auth check is now handled by ProtectedRoute

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Case Management</h1>
          <p className="text-muted-foreground">Manage your legal cases and evidence</p>
        </div>
        <Button onClick={() => setShowNewCase(true)} className="flex items-center gap-2" aria-label="Create new case">
          <Scale className="h-4 w-4" aria-hidden="true" />
          New Case
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cases List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Your Cases</CardTitle>
              <CardDescription>Select a case to view details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cases.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No cases yet</p>
              ) : (
                cases.map((case_) => (
                  <Card
                    key={case_.id}
                    className={`overflow-hidden transition-all hover:shadow-md ${
                      selectedCase?.id === case_.id ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <CardContent className="p-4 space-y-3">
                      {/* Header */}
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-semibold text-base line-clamp-2 flex-1">{case_.title}</h3>
                        <Badge className={getStatusColor(case_.status)} variant="secondary">
                          {case_.status}
                        </Badge>
                      </div>

                      {/* Merit Score */}
                      {case_.merit_score > 0 && (
                        <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Merit Score:</span>
                          <span className={`font-bold ${getScoreColor(case_.merit_score)}`}>
                            {case_.merit_score}%
                          </span>
                        </div>
                      )}

                      {/* Evidence Count */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span>{case_.evidence_count} {case_.evidence_count === 1 ? 'document' : 'documents'}</span>
                      </div>

                      {/* Timeline Preview */}
                      {case_.latest_event && (
                        <div className="p-2 bg-primary/5 rounded-md border border-primary/10">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Latest Event</p>
                          <p className="text-sm font-medium line-clamp-1">{case_.latest_event.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(case_.latest_event.event_date).toLocaleDateString()}
                          </p>
                        </div>
                      )}

                      {/* Next Step */}
                      {case_.next_step && (
                        <div className="p-2 bg-accent/10 rounded-md border border-accent/20">
                          <p className="text-xs font-medium text-accent-foreground mb-1">Next Step</p>
                          <p className="text-sm line-clamp-2">{case_.next_step}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="default"
                          className="flex-1"
                          onClick={() => {
                            setSelectedCase(case_);
                            onCaseSelect?.(case_.id);
                          }}
                        >
                          <ArrowRight className="h-4 w-4 mr-1" />
                          Resume Case
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/case-timeline?caseId=${case_.id}`)}
                        >
                          <Target className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive hover:text-destructive-foreground">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Case</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{case_.title}"? This will permanently delete the case and all associated evidence, events, and pathways. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => deleteCase(case_.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Case Details */}
        <div className="lg:col-span-2">
          {selectedCase ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5" />
                    {selectedCase.title}
                  </CardTitle>
                  <CardDescription>
                    {selectedCase.province} • Created {new Date(selectedCase.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Description</Label>
                    <p className="text-sm mt-1">{selectedCase.description}</p>
                  </div>
                  
                  {selectedCase.merit_score > 0 && (
                    <div>
                      <Label>Merit Score</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <Progress value={selectedCase.merit_score} className="flex-1" />
                        <span className={`font-bold ${getScoreColor(selectedCase.merit_score)}`}>
                          {selectedCase.merit_score}%
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Province</Label>
                      <p className="text-sm mt-1">{selectedCase.province}</p>
                    </div>
                    <div>
                      <Label>Municipality</Label>
                      <p className="text-sm mt-1">{selectedCase.municipality || 'Not specified'}</p>
                    </div>
                  </div>

                  {selectedCase.law_section && (
                    <div>
                      <Label>Law Section</Label>
                      <p className="text-sm mt-1">{selectedCase.law_section}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Evidence Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Evidence ({evidence.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {evidence.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.file_name}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Drag and drop files here or click to upload evidence
                      </p>
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        id="evidence-upload"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          files.forEach(file => {
                            const description = prompt(`Add description for ${file.name}:`);
                            if (description) {
                              uploadEvidence(file, description);
                            }
                          });
                        }}
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => document.getElementById('evidence-upload')?.click()}
                        disabled={uploading}
                      >
                        {uploading ? 'Uploading...' : 'Upload Evidence'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Legal Pathways Section */}
              {pathways.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Available Legal Pathways
                    </CardTitle>
                    <CardDescription>Choose the best pathway for your case</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pathways.map((pathway) => (
                      <div 
                        key={pathway.id} 
                        className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => setShowPathwayGuide(true)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{getPathwayTitle(pathway.pathway_type)}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getScoreColor(pathway.confidence_score)}>
                              {pathway.confidence_score}% Confidence
                            </Badge>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {pathway.recommendation.substring(0, 150)}...
                        </p>
                        <div className="flex items-center gap-2">
                          <Scale className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{pathway.relevant_laws[0]}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Scale className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a Case</h3>
                <p className="text-muted-foreground">Choose a case from the list to view details and manage evidence.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* New Case Modal */}
      {showNewCase && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Create New Case</CardTitle>
              <CardDescription>Provide details about your legal case</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Case Title *</Label>
                <Input
                  id="title"
                  value={newCase.title}
                  onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
                  placeholder="Brief case title"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={newCase.description}
                  onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
                  placeholder="Detailed case description"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="venue">Case Type *</Label>
                <Select value={newCase.venue} onValueChange={(value) => setNewCase({ ...newCase, venue: value })}>
                  <SelectTrigger id="venue">
                    <SelectValue placeholder="Select case type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HRTO">Human Rights Tribunal (HRTO)</SelectItem>
                    <SelectItem value="LTB">Landlord Tenant Board (LTB)</SelectItem>
                    <SelectItem value="SMALL_CLAIMS">Small Claims Court</SelectItem>
                    <SelectItem value="FAMILY">Family Court</SelectItem>
                    <SelectItem value="SUPERIOR">Superior Court</SelectItem>
                    <SelectItem value="CRIMINAL">Criminal Court</SelectItem>
                    <SelectItem value="LABOUR">Labour Relations Board</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="province">Province *</Label>
                <Input
                  id="province"
                  value={newCase.province}
                  onChange={(e) => setNewCase({ ...newCase, province: e.target.value })}
                  placeholder="e.g., Ontario, Quebec"
                />
              </div>

              <div>
                <Label htmlFor="municipality">Municipality</Label>
                <Input
                  id="municipality"
                  value={newCase.municipality}
                  onChange={(e) => setNewCase({ ...newCase, municipality: e.target.value })}
                  placeholder="City or municipality (optional)"
                />
              </div>

              <div>
                <Label htmlFor="lawSection">Law Section</Label>
                <Input
                  id="lawSection"
                  value={newCase.law_section}
                  onChange={(e) => setNewCase({ ...newCase, law_section: e.target.value })}
                  placeholder="Relevant law section (optional)"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={createCase} disabled={loading} className="flex-1 min-h-[44px]" aria-label={loading ? 'Creating case' : 'Create case'}>
                  {loading ? 'Creating...' : 'Create Case'}
                </Button>
                <Button variant="outline" onClick={() => setShowNewCase(false)} className="min-h-[44px]" aria-label="Cancel case creation">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CaseManager;