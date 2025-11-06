import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type DocumentType = 'demand_letter' | 'affidavit' | 'witness_statement' | 'settlement_offer';
export type ToneType = 'formal' | 'assertive' | 'conciliatory';

export interface CaseContext {
  caseType?: string;
  province?: string;
  parties?: {
    applicant?: string;
    respondent?: string;
  };
  facts?: string;
  issues?: string;
  evidence?: string[];
  desiredOutcome?: string;
}

export interface GenerateDocumentParams {
  documentType: DocumentType;
  tone: ToneType;
  caseContext: CaseContext;
}

export function useSmartDocument() {
  const [loading, setLoading] = useState(false);
  const [document, setDocument] = useState<string | null>(null);

  const generateDocument = async ({ documentType, tone, caseContext }: GenerateDocumentParams) => {
    setLoading(true);
    try {
      console.log('Generating smart document:', { documentType, tone });

      const { data, error } = await supabase.functions.invoke('generate-smart-document', {
        body: {
          documentType,
          tone,
          caseContext,
        },
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate document');
      }

      setDocument(data.document);
      
      toast({
        title: "Document Generated",
        description: `Your ${documentType.replace('_', ' ')} has been created successfully.`,
      });

      return data.document;
    } catch (error: any) {
      console.error('Error generating document:', error);
      
      toast({
        title: "Generation Error",
        description: error.message || 'Failed to generate document',
        variant: "destructive",
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearDocument = () => {
    setDocument(null);
  };

  return {
    loading,
    document,
    generateDocument,
    clearDocument,
  };
}
