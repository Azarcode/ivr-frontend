'use client';

import React, { useState } from 'react';
import { Copy, Check, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface TranscriptionPanelProps {
  transcript: string;
  languageCode?: string;
  isTranscribing?: boolean;
  className?: string;
}

export function TranscriptionPanel({
  transcript,
  languageCode,
  isTranscribing = false,
  className,
}: TranscriptionPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!transcript) return;
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    toast.success('Transcript copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        'border border-neutral-200 bg-white rounded-md p-4 space-y-3',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-neutral-600" />
          <span className="text-xs font-semibold text-neutral-900">
            Transcribed Text (Sarvam Saaras)
          </span>
        </div>
        <div className="flex items-center gap-2">
          {languageCode && (
            <Badge variant="outline" className="text-[10px] font-mono">
              {languageCode}
            </Badge>
          )}
          {transcript && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-7 px-2 text-xs text-neutral-600 hover:text-neutral-900"
              title="Copy transcript"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="min-h-[70px] rounded-md border border-neutral-200 bg-neutral-50/50 p-3 text-xs leading-relaxed text-neutral-800">
        {isTranscribing ? (
          <span className="text-neutral-500 italic">
            Transcribing speech with Sarvam Saaras model...
          </span>
        ) : transcript ? (
          <p className="whitespace-pre-wrap">{transcript}</p>
        ) : (
          <span className="text-neutral-500 italic">
            No audio transcribed yet. Record your voice or upload an audio file.
          </span>
        )}
      </div>
    </div>
  );
}
