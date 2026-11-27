'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AudioPlayer } from '@/components/ai-voice/AudioPlayer';
import { cn } from '@/lib/utils';
import { useSpeakMutation } from '@/features/ai-voice/hooks/use-ai-voice';
import { toast } from 'sonner';

interface TtsPanelProps {
  initialText?: string;
  className?: string;
}

const SPEAKERS = [
  { id: 'kavya', label: 'Kavya (Female)' },
  { id: 'shubh', label: 'Shubh (Male)' },
  { id: 'simran', label: 'Simran (Female)' },
  { id: 'aditya', label: 'Aditya (Male)' },
  { id: 'priya', label: 'Priya (Female)' },
  { id: 'rahul', label: 'Rahul (Male)' },
];

export function TtsPanel({ initialText = '', className }: TtsPanelProps) {
  const [text, setText] = useState(initialText);
  const [prevInitialText, setPrevInitialText] = useState(initialText);
  const [speaker, setSpeaker] = useState('kavya');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Synchronize state during render when initialText prop changes
  if (initialText !== prevInitialText) {
    setPrevInitialText(initialText);
    setText(initialText);
  }

  const { mutate: speak, isPending } = useSpeakMutation();

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handleGenerateSpeech = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isPending) return;

    if (trimmed.length > 1000) {
      toast.error('Text exceeds maximum limit of 1000 characters');
      return;
    }

    speak(
      { text: trimmed, speaker, languageCode: 'en-IN' },
      {
        onSuccess: (blob) => {
          if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
          }
          const newUrl = URL.createObjectURL(blob);
          setAudioUrl(newUrl);
          toast.success('Speech generated with Sarvam Bulbul');
        },
      },
    );
  };

  return (
    <div
      className={cn(
        'border border-neutral-200 bg-white rounded-md p-4 space-y-4',
        className,
      )}
    >
      <div>
        <h3 className="text-xs font-semibold text-neutral-900">
          Text-to-Speech Synthesis (Sarvam Bulbul)
        </h3>
        <p className="text-[11px] text-neutral-500">
          Convert written text into natural human-like voice using Sarvam Bulbul
        </p>
      </div>

      <form onSubmit={handleGenerateSpeech} className="space-y-3">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to synthesize into speech (e.g. 'Welcome to our store. How can I assist you today?')..."
          rows={3}
          maxLength={1000}
          disabled={isPending}
          className="text-xs resize-none"
        />

        <div className="flex items-center justify-between text-[11px] text-neutral-500">
          <div className="flex items-center gap-2">
            <label htmlFor="speaker-select" className="font-medium text-neutral-700">
              Voice:
            </label>
            <select
              id="speaker-select"
              value={speaker}
              onChange={(e) => setSpeaker(e.target.value)}
              disabled={isPending}
              className="rounded border border-neutral-200 bg-white px-2 py-1 text-xs text-neutral-800 focus:outline-none"
            >
              {SPEAKERS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <span>{text.length}/1000 chars</span>
        </div>

        <Button
          type="submit"
          disabled={isPending || !text.trim()}
          size="sm"
          className="w-full gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Synthesizing Voice...</span>
            </>
          ) : (
            <>
              <Volume2 className="h-4 w-4" />
              <span>Generate Speech (Bulbul)</span>
            </>
          )}
        </Button>
      </form>

      {audioUrl && (
        <AudioPlayer
          src={audioUrl}
          title={`Generated Speech (${speaker})`}
          downloadable={true}
          downloadFileName={`sarvam-tts-${speaker}.wav`}
          autoPlay={true}
        />
      )}
    </div>
  );
}
