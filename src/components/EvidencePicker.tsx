import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { EvidenceHub } from './EvidenceHub';

interface Evidence {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  metadata?: {
    doc_type?: string;
    category?: string;
    extracted_summary?: string;
  };
}

interface EvidencePickerProps {
  open: boolean;
  onClose: () => void;
  caseId: string;
  onSelect: (evidence: Evidence[]) => void;
  maxSelection?: number;
  preselectedIds?: string[];
}

export function EvidencePicker({
  open,
  onClose,
  caseId,
  onSelect,
  maxSelection,
  preselectedIds = []
}: EvidencePickerProps) {
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence[]>([]);

  const handleConfirm = () => {
    onSelect(selectedEvidence);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Evidence</DialogTitle>
          <DialogDescription>
            Choose existing evidence to attach to this section
            {maxSelection && ` (max ${maxSelection})`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <EvidenceHub
            caseId={caseId}
            onEvidenceSelect={setSelectedEvidence}
            selectionMode={true}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={selectedEvidence.length === 0 || (maxSelection && selectedEvidence.length > maxSelection)}
          >
            Attach {selectedEvidence.length} Evidence
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
