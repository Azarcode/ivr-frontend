'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Mic, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob, durationSeconds: number) => void;
  disabled?: boolean;
  className?: string;
  isExternalRecording?: boolean;
}

export function VoiceRecorder({
  onRecordingComplete,
  disabled = false,
  className,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const getSupportedMimeType = (): string => {
    if (typeof MediaRecorder === 'undefined') return '';
    const candidates = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4',
      'audio/wav',
    ];
    for (const type of candidates) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return '';
  };

  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error('Microphone recording is not supported in this browser.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      const mimeType = getSupportedMimeType();
      const options = mimeType ? { mimeType } : undefined;
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const finalMime = mediaRecorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, {
          type: finalMime,
        });
        onRecordingComplete(audioBlob, recordingDuration);

        // Stop all audio tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.start(250); // collect 250ms chunks
      setIsRecording(true);
      setRecordingDuration(0);

      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Microphone access denied';
      toast.error(`Could not access microphone: ${errorMessage}`);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      className={cn(
        'border border-neutral-200 bg-white rounded-md p-4 flex flex-col items-center justify-center gap-3',
        className,
      )}
    >
      <div className="flex items-center gap-3">
        {isRecording ? (
          <Button
            type="button"
            variant="destructive"
            onClick={stopRecording}
            className="gap-2 bg-red-600 hover:bg-red-700 text-white animate-pulse"
          >
            <Square className="h-4 w-4 fill-white" />
            <span>Stop Recording ({formatDuration(recordingDuration)})</span>
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={startRecording}
            disabled={disabled}
            className="gap-2 border-neutral-300 text-neutral-800 hover:bg-neutral-50"
          >
            <Mic className="h-4 w-4 text-neutral-600" />
            <span>Record from Microphone</span>
          </Button>
        )}
      </div>

      <p className="text-[11px] text-neutral-500 text-center">
        {isRecording
          ? 'Listening... Click stop when finished speaking (up to 30s).'
          : 'Click to record your voice using your web browser microphone.'}
      </p>
    </div>
  );
}
