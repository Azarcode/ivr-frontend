'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, FileAudio, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AudioUploaderProps {
  onFileSelected: (file: File | null) => void;
  disabled?: boolean;
  selectedFile: File | null;
  className?: string;
}

const ACCEPTED_TYPES = '.wav,.mp3,.webm,.ogg,.m4a,.aac,.flac';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function AudioUploader({
  onFileSelected,
  disabled = false,
  selectedFile,
  className,
}: AudioUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const validateAndSelect = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File exceeds maximum size limit of 10MB');
      return;
    }
    onFileSelected(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndSelect(file);
    }
  };

  const clearFile = () => {
    onFileSelected(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={cn('space-y-2', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
        id="audio-upload-input"
      />

      {selectedFile ? (
        <div className="flex items-center justify-between border border-neutral-200 bg-neutral-50/50 rounded-md p-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <FileAudio className="h-5 w-5 text-neutral-700 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-neutral-900 truncate">
                {selectedFile.name}
              </p>
              <p className="text-[11px] text-neutral-500">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearFile}
            disabled={disabled}
            className="h-7 w-7 p-0 text-neutral-500 hover:text-neutral-900"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={cn(
            'border border-dashed rounded-md p-5 text-center cursor-pointer transition-colors',
            isDragging
              ? 'border-neutral-900 bg-neutral-50'
              : 'border-neutral-300 hover:border-neutral-400 bg-white',
            disabled && 'opacity-50 cursor-not-allowed',
          )}
        >
          <UploadCloud className="h-6 w-6 text-neutral-400 mx-auto mb-1.5" />
          <p className="text-xs font-medium text-neutral-800">
            Click to upload or drag audio file here
          </p>
          <p className="text-[11px] text-neutral-500 mt-1">
            Supported: WAV, MP3, WebM, OGG, M4A, AAC (Max 10MB)
          </p>
        </div>
      )}
    </div>
  );
}
