'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Mic,
  RotateCcw,
  Sparkles,
  Square,
  Volume2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  VoiceStatus,
  VoiceInteractionStep,
} from '@/components/ai-voice/VoiceStatus';
import { AudioPlayer } from '@/components/ai-voice/AudioPlayer';
import { aiApi } from '@/features/ai-voice/api/ai.api';
import { getApiErrorMessage } from '@/lib/api/axios';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface VoiceConversationProps {
  className?: string;
}

/**
 * =============================================================================
 * VOICE CONVERSATION COMPONENT (The Interactive Voice Loop)
 * =============================================================================
 *
 * What this component does:
 * Think of this as a live telephone call with your AI Assistant!
 * When you press "Start Voice Test":
 * 1. Your browser listens to your microphone and records your speech.
 * 2. It sends your audio to the backend, which asks Sarvam Saaras to write it down (STT).
 * 3. It takes that text, feeds it to Sarvam LLM with your business products & info.
 * 4. It asks Sarvam Bulbul to speak the answer aloud in a natural Indian accent (TTS).
 * 5. Your browser automatically plays the generated voice reply!
 */
export function VoiceConversation({ className }: VoiceConversationProps) {
  // Current step in the telephone call (e.g. 'idle' -> 'recording' -> 'transcribing' -> 'thinking' -> 'generating-voice' -> 'playing')
  const [step, setStep] = useState<VoiceInteractionStep>('idle');
  // What the user said (converted from speech to text)
  const [transcript, setTranscript] = useState('');
  // What the AI assistant replied (text from the LLM)
  const [aiReply, setAiReply] = useState('');
  // URL to the AI assistant's generated voice audio file
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  // URL to what you just recorded into the microphone (so you can listen to yourself)
  const [userAudioUrl, setUserAudioUrl] = useState<string | null>(null);
  // Timer showing how many seconds you have been speaking into the microphone
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  // If anything went wrong (like mic denied or network down), store the friendly error message
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // References to keep browser microphone tools alive without triggering re-renders
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const isBusy = step !== 'idle' && step !== 'completed';

  // Cleanup: Free memory when the component closes or when audio changes
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (userAudioUrl) URL.revokeObjectURL(userAudioUrl);
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [audioUrl, userAudioUrl]);

  /**
   * Helper: Check what audio format this browser can record.
   * Chrome/Edge usually like 'audio/webm;codecs=opus', Safari likes 'audio/mp4'.
   */
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
      if (MediaRecorder.isTypeSupported(type)) return type;
    }
    return '';
  };

  /**
   * Step 1: Start Recording
   * Asks the user for microphone permission and starts capturing audio bytes.
   */
  const startVoiceTest = async () => {
    setErrorMsg(null);
    setTranscript('');
    setAiReply('');
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    if (userAudioUrl) {
      URL.revokeObjectURL(userAudioUrl);
      setUserAudioUrl(null);
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone recording is not supported in this browser.');
      }

      // Request browser microphone stream with noise suppression
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

      // Collect audio chunks as the user speaks
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // When the user stops recording:
      mediaRecorder.onstop = () => {
        const finalMime = mediaRecorder.mimeType || 'audio/webm';
        const recordedBlob = new Blob(audioChunksRef.current, {
          type: finalMime,
        });

        // Release the microphone so the red recording dot goes away
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
        }

        // Create a local audio URL so the user can listen to their own recording
        const recordedUrl = URL.createObjectURL(recordedBlob);
        setUserAudioUrl(recordedUrl);

        // Send this recorded audio into our AI pipeline!
        void processVoicePipeline(recordedBlob);
      };

      // Collect audio in 250ms chunks and start the timer
      mediaRecorder.start(250);
      setStep('recording');
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Microphone access denied';
      setErrorMsg(msg);
      toast.error(msg);
      setStep('idle');
    }
  };

  /**
   * User clicks "Finish Speaking": Stops the recorder, which triggers `onstop`.
   */
  const stopRecording = () => {
    if (mediaRecorderRef.current && step === 'recording') {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      mediaRecorderRef.current.stop();
    }
  };

  /**
   * ===========================================================================
   * Step 2, 3 & 4: The Core AI Voice Pipeline (STT -> LLM -> TTS)
   * ===========================================================================
   * This is where data flows step-by-step between frontend and backend:
   */
  const processVoicePipeline = async (audioBlob: Blob) => {
    try {
      // -----------------------------------------------------------------------
      // STAGE A: Speech-to-Text (STT)
      // Frontend sends audio file via Axios -> NestJS backend -> Sarvam Saaras
      // Backend returns: { transcript: "What is your return policy?" }
      // -----------------------------------------------------------------------
      setStep('transcribing');
      const sttResult = await aiApi.transcribe(audioBlob, 'en-IN');
      const transcribedText = sttResult.transcript.trim();

      // If user said nothing or audio was pure silence:
      if (!transcribedText) {
        toast.warning('No spoken text could be detected from the recording.');
        setTranscript('(No speech recognized)');
        setStep('completed');
        return;
      }

      setTranscript(transcribedText);

      // -----------------------------------------------------------------------
      // STAGE B: Chat Completion (LLM Thinking)
      // Frontend sends the text question -> NestJS backend -> Sarvam LLM
      // Backend loads business profile + product catalog from DB to answer
      // Backend returns: { reply: "Our return policy allows 30 days..." }
      // -----------------------------------------------------------------------
      setStep('thinking');
      const chatResult = await aiApi.chat(transcribedText);
      const replyText = chatResult.reply.trim();
      setAiReply(replyText);

      // -----------------------------------------------------------------------
      // STAGE C: Text-to-Speech (TTS Voice Synthesis)
      // Frontend sends the reply text -> NestJS backend -> Sarvam Bulbul
      // Backend returns binary audio bytes (WAV audio blob)
      // -----------------------------------------------------------------------
      setStep('generating-voice');
      const speechBlob = await aiApi.speak(replyText, 'kavya', 'en-IN');
      const speechUrl = URL.createObjectURL(speechBlob);
      setAudioUrl(speechUrl);

      // -----------------------------------------------------------------------
      // STAGE D: Auto-play the synthesized voice response to the user
      // -----------------------------------------------------------------------
      setStep('playing');
    } catch (err: unknown) {
      // If anything fails in any step, catch the error and show a helpful toast
      const msg = getApiErrorMessage(err);
      setErrorMsg(msg);
      toast.error(msg);
      setStep('idle');
    }
  };

  // Called when audio finishes playing: marks the call cycle as completed
  const handleAudioEnded = () => {
    setStep('completed');
  };

  // Reset the conversation back to the beginning
  const resetAll = () => {
    setStep('idle');
    setTranscript('');
    setAiReply('');
    setErrorMsg(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    if (userAudioUrl) {
      URL.revokeObjectURL(userAudioUrl);
      setUserAudioUrl(null);
    }
  };

  return (
    <div
      className={cn(
        'border border-neutral-200 bg-white rounded-md p-6 space-y-6',
        className,
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-neutral-800" />
            <h3 className="text-sm font-semibold text-neutral-900">
              End-to-End Voice Interaction Test
            </h3>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Full telephone IVR flow: Speech-to-Text (Saaras) → Business Context LLM → Text-to-Speech (Bulbul)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {step === 'idle' || step === 'completed' ? (
            <Button
              type="button"
              onClick={startVoiceTest}
              className="gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-medium"
            >
              <Mic className="h-4 w-4" />
              <span>{step === 'completed' ? 'Restart Voice Test' : 'Start Voice Test'}</span>
            </Button>
          ) : step === 'recording' ? (
            <Button
              type="button"
              variant="destructive"
              onClick={stopRecording}
              className="gap-2 bg-red-600 hover:bg-red-700 text-white animate-pulse"
            >
              <Square className="h-4 w-4 fill-white" />
              <span>Finish Speaking ({recordingSeconds}s)</span>
            </Button>
          ) : (
            <Button type="button" disabled variant="outline" className="gap-2">
              <span>Processing turn...</span>
            </Button>
          )}

          {(transcript || aiReply || userAudioUrl) && !isBusy && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={resetAll}
              className="text-neutral-500 hover:text-neutral-900 h-9 px-2"
              title="Reset conversation state"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Progress Status Bar */}
      <VoiceStatus step={step} />

      {errorMsg && (
        <div className="flex items-start gap-2.5 rounded-md border border-red-200 bg-red-50/50 p-3 text-xs text-red-700">
          <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Voice Processing Error</p>
            <p className="mt-0.5 text-red-600">{errorMsg}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={startVoiceTest}
            className="h-7 text-xs bg-white text-red-700 border-red-200 hover:bg-red-50"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Workflow Inspection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step 1: User Voice & Transcript */}
        <div className="border border-neutral-200 rounded-md p-4 bg-neutral-50/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
              <Mic className="h-3.5 w-3.5 text-neutral-600" />
              Caller Input (Your Speech)
            </span>
            <span className="text-[10px] font-mono text-neutral-500 uppercase">
              Saaras STT
            </span>
          </div>

          {userAudioUrl && (
            <AudioPlayer
              src={userAudioUrl}
              title="Your Recorded Voice Input"
              downloadable={false}
              className="bg-white"
            />
          )}

          <div className="rounded border border-neutral-200 bg-white p-3 text-xs min-h-[60px]">
            {transcript ? (
              <p className="text-neutral-900 font-medium whitespace-pre-wrap">
                &ldquo;{transcript}&rdquo;
              </p>
            ) : step === 'recording' ? (
              <span className="text-neutral-500 italic">Listening to your speech...</span>
            ) : step === 'transcribing' ? (
              <span className="text-neutral-500 italic">Transcribing audio via Sarvam Saaras...</span>
            ) : (
              <span className="text-neutral-500 italic">Click &ldquo;Start Voice Test&rdquo; and ask a business question.</span>
            )}
          </div>
        </div>

        {/* Step 2: AI Response & Audio Playback */}
        <div className="border border-neutral-200 rounded-md p-4 bg-neutral-50/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
              <Volume2 className="h-3.5 w-3.5 text-neutral-600" />
              IVR Voice Response (Sarvam Bulbul)
            </span>
            <span className="text-[10px] font-mono text-neutral-500 uppercase">
              LLM + TTS
            </span>
          </div>

          <div className="rounded border border-neutral-200 bg-white p-3 text-xs min-h-[60px]">
            {aiReply ? (
              <p className="text-neutral-900 whitespace-pre-wrap">{aiReply}</p>
            ) : step === 'thinking' ? (
              <span className="text-neutral-500 italic">
                Reasoning with business knowledge & product catalog...
              </span>
            ) : step === 'generating-voice' ? (
              <span className="text-neutral-500 italic">
                Synthesizing natural voice with Sarvam Bulbul...
              </span>
            ) : (
              <span className="text-neutral-500 italic">
                AI response and synthesized voice will appear here.
              </span>
            )}
          </div>

          {audioUrl && (
            <AudioPlayer
              src={audioUrl}
              title="Assistant Audio Output"
              downloadable={true}
              downloadFileName="ivr-response.wav"
              autoPlay={true}
              onEnded={handleAudioEnded}
              className="bg-white"
            />
          )}
        </div>
      </div>
    </div>
  );
}
