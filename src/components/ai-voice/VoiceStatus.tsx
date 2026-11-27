'use client';

import React from 'react';
import {
  CheckCircle2,
  Cpu,
  Loader2,
  Mic,
  Volume2,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type VoiceInteractionStep =
  | 'idle'
  | 'recording'
  | 'transcribing'
  | 'thinking'
  | 'generating-voice'
  | 'playing'
  | 'completed';

interface VoiceStatusProps {
  step: VoiceInteractionStep;
  className?: string;
}

const stepsConfig: Record<
  VoiceInteractionStep,
  { label: string; description: string; icon: React.ComponentType<{ className?: string }> }
> = {
  idle: {
    label: 'Ready',
    description: 'Start a voice test or record your audio',
    icon: Mic,
  },
  recording: {
    label: 'Recording Speech...',
    description: 'Listening to your voice input via microphone',
    icon: Mic,
  },
  transcribing: {
    label: 'Transcribing Audio...',
    description: 'Converting speech to text with Sarvam Saaras',
    icon: FileText,
  },
  thinking: {
    label: 'Thinking & Consulting Business Profile...',
    description: 'Querying Sarvam Chat Completion with live database context',
    icon: Cpu,
  },
  'generating-voice': {
    label: 'Generating Voice...',
    description: 'Synthesizing voice response with Sarvam Bulbul',
    icon: Volume2,
  },
  playing: {
    label: 'Playing Voice Response',
    description: 'Streaming generated speech to audio output',
    icon: Volume2,
  },
  completed: {
    label: 'Turn Completed',
    description: 'Voice interaction cycle finished successfully',
    icon: CheckCircle2,
  },
};

export function VoiceStatus({ step, className }: VoiceStatusProps) {
  if (step === 'idle') return null;

  const current = stepsConfig[step];
  const Icon = current.icon;
  const isBusy =
    step === 'transcribing' ||
    step === 'thinking' ||
    step === 'generating-voice';

  return (
    <div
      className={cn(
        'border rounded-md p-3.5 flex items-center justify-between transition-colors',
        step === 'recording'
          ? 'border-red-200 bg-red-50/50 text-red-900'
          : step === 'completed'
            ? 'border-green-200 bg-green-50/50 text-green-900'
            : 'border-neutral-200 bg-neutral-50/50 text-neutral-900',
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'h-8 w-8 rounded-full flex items-center justify-center',
            step === 'recording'
              ? 'bg-red-100 text-red-600'
              : step === 'completed'
                ? 'bg-green-100 text-green-700'
                : 'bg-neutral-200 text-neutral-800',
          )}
        >
          {isBusy ? (
            <Loader2 className="h-4 w-4 animate-spin text-neutral-800" />
          ) : (
            <Icon className="h-4 w-4" />
          )}
        </div>
        <div>
          <p className="text-xs font-semibold leading-tight">{current.label}</p>
          <p className="text-[11px] text-neutral-500 mt-0.5 leading-tight">
            {current.description}
          </p>
        </div>
      </div>

      <span
        className={cn(
          'text-[10px] font-mono uppercase px-2 py-0.5 rounded border',
          step === 'recording'
            ? 'border-red-300 text-red-700 bg-white'
            : step === 'completed'
              ? 'border-green-300 text-green-800 bg-white'
              : 'border-neutral-300 text-neutral-700 bg-white',
        )}
      >
        {step}
      </span>
    </div>
  );
}
