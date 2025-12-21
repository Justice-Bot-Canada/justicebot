import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  Image, 
  X, 
  CheckCircle,
  AlertCircle,
  Loader2,
  File as FileIcon
} from 'lucide-react';
import { toast } from '@/lib/toast-stub';

export interface PendingDocument {
  id: string;
  file: File;
  preview?: string;
  status: 'pending' | 'uploading' | 'uploaded' | 'error';
  progress: number;
  error?: string;
}

interface TriageDocumentUploadProps {
  documents: PendingDocument[];
  onDocumentsChange: (documents: PendingDocument[]) => void;
  disabled?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
}

export function TriageDocumentUpload({
  documents,
  onDocumentsChange,
  disabled = false,
  maxFiles = 10,
  maxSizeMB = 20
}: TriageDocumentUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const remainingSlots = maxFiles - documents.length;
    const filesToAdd = acceptedFiles.slice(0, remainingSlots);
    
    if (filesToAdd.length < acceptedFiles.length) {
      toast.warning(`Only ${maxFiles} files allowed. Some files were not added.`);
    }

    const newDocs: PendingDocument[] = filesToAdd.map(file => ({
      id: crypto.randomUUID(),
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      status: 'pending',
      progress: 0
    }));

    onDocumentsChange([...documents, ...newDocs]);
  }, [documents, onDocumentsChange, maxFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: disabled || documents.length >= maxFiles,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxSize: maxSizeMB * 1024 * 1024,
    onDropRejected: (rejections) => {
      rejections.forEach(rejection => {
        const errors = rejection.errors.map(e => e.message).join(', ');
        toast.error(`${rejection.file.name}: ${errors}`);
      });
    }
  });

  const removeDocument = (id: string) => {
    const doc = documents.find(d => d.id === id);
    if (doc?.preview) {
      URL.revokeObjectURL(doc.preview);
    }
    onDocumentsChange(documents.filter(d => d.id !== id));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (file.type === 'application/pdf') return <FileText className="h-4 w-4" />;
    return <FileIcon className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getStatusBadge = (status: PendingDocument['status']) => {
    switch (status) {
      case 'uploaded':
        return <Badge variant="default" className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />Uploaded</Badge>;
      case 'uploading':
        return <Badge variant="secondary"><Loader2 className="h-3 w-3 mr-1 animate-spin" />Uploading</Badge>;
      case 'error':
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Error</Badge>;
      default:
        return <Badge variant="outline">Ready</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Upload className="h-5 w-5" />
          Upload Supporting Documents
        </CardTitle>
        <CardDescription>
          Upload evidence now - these documents will be saved to your case and available in your Documents library for building your Book of Documents.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
          } ${disabled || documents.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-sm font-medium mb-1">
            {isDragActive ? 'Drop files here...' : 'Drag & drop documents, or click to select'}
          </p>
          <p className="text-xs text-muted-foreground">
            PDF, Images, Word docs, Text files (Max {maxSizeMB}MB each, up to {maxFiles} files)
          </p>
        </div>

        {/* Document List */}
        {documents.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{documents.length} document{documents.length > 1 ? 's' : ''} ready</span>
              {!disabled && documents.length > 1 && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    documents.forEach(d => d.preview && URL.revokeObjectURL(d.preview));
                    onDocumentsChange([]);
                  }}
                >
                  Clear All
                </Button>
              )}
            </div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                >
                  {/* Preview or Icon */}
                  <div className="flex-shrink-0">
                    {doc.preview ? (
                      <img 
                        src={doc.preview} 
                        alt={doc.file.name}
                        className="h-10 w-10 rounded object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                        {getFileIcon(doc.file)}
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.file.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(doc.file.size)}
                      </span>
                      {getStatusBadge(doc.status)}
                    </div>
                    {doc.status === 'uploading' && (
                      <Progress value={doc.progress} className="h-1 mt-1" />
                    )}
                    {doc.error && (
                      <p className="text-xs text-destructive mt-1">{doc.error}</p>
                    )}
                  </div>

                  {/* Remove Button */}
                  {!disabled && doc.status !== 'uploading' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocument(doc.id)}
                      className="flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            <strong>Tip:</strong> Upload any relevant documents like notices, letters, photos, or correspondence. 
            These will be automatically analyzed and organized in your case file for easy reference when building your Book of Documents.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
