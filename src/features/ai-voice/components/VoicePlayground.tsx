'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight, FileText, Loader2, Sparkles, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VoiceRecorder } from '@/components/ai-voice/VoiceRecorder';
import { AudioUploader } from '@/components/ai-voice/AudioUploader';
import { AudioPlayer } from '@/components/ai-voice/AudioPlayer';
import { TranscriptionPanel } from '@/components/ai-voice/TranscriptionPanel';
import {
  useChatMutation,
  useSpeakMutation,
  useTranscribeMutation,
} from '@/features/ai-voice/hooks/use-ai-voice';
import { toast } from 'sonner';

export function VoicePlayground() {
  const [activeTab, setActiveTab] = useState<'record' | 'upload'>('record');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [inputAudioUrl, setInputAudioUrl] = useState<string | null>(null);

  const [transcript, setTranscript] = useState('');
  const [languageCode, setLanguageCode] = useState('en-IN');
  const [aiReply, setAiReply] = useState('');
  const [outputAudioUrl, setOutputAudioUrl] = useState<string | null>(null);

  const { mutate: transcribe, isPending: isTranscribing } =
    useTranscribeMutation();
  const { mutate: chat, isPending: isThinking } = useChatMutation();
  const { mutate: speak, isPending: isSpeaking } = useSpeakMutation();

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      if (inputAudioUrl) URL.revokeObjectURL(inputAudioUrl);
      if (outputAudioUrl) URL.revokeObjectURL(outputAudioUrl);
    };
  }, [inputAudioUrl, outputAudioUrl]);

  const handleRecordingComplete = (blob: Blob) => {
    if (inputAudioUrl) URL.revokeObjectURL(inputAudioUrl);
    setRecordedBlob(blob);
    setSelectedFile(null);
    const url = URL.createObjectURL(blob);
    setInputAudioUrl(url);
    toast.success('Audio recording captured successfully');
  };

  const handleFileSelected = (file: File | null) => {
    if (inputAudioUrl) URL.revokeObjectURL(inputAudioUrl);
    setSelectedFile(file);
    setRecordedBlob(null);
    if (file) {
      const url = URL.createObjectURL(file);
      setInputAudioUrl(url);
      toast.success(`Selected file "${file.name}"`);
    } else {
      setInputAudioUrl(null);
    }
  };

  const handleTranscribe = () => {
    const audioPayload = selectedFile || recordedBlob;
    if (!audioPayload) {
      toast.error('Please record or upload an audio file first.');
      return;
    }

    transcribe(
      { file: audioPayload, languageCode: 'en-IN' },
      {
        onSuccess: (data) => {
          setTranscript(data.transcript);
          setLanguageCode(data.languageCode || 'en-IN');
          toast.success('Speech transcribed via Sarvam Saaras');
        },
      },
    );
  };

  const handleGenerateReplyAndVoice = () => {
    if (!transcript.trim()) {
      toast.error('Please transcribe audio first to get a message.');
      return;
    }

    chat(transcript.trim(), {
      onSuccess: (chatData) => {
        setAiReply(chatData.reply);
        toast.success('Generated response from Sarvam LLM');

        // Automatically synthesize speech
        speak(
          { text: chatData.reply, speaker: 'kavya', languageCode: 'en-IN' },
          {
            onSuccess: (speechBlob) => {
              if (outputAudioUrl) URL.revokeObjectURL(outputAudioUrl);
              const url = URL.createObjectURL(speechBlob);
              setOutputAudioUrl(url);
              toast.success('Voice synthesized with Sarvam Bulbul');
            },
          },
        );
      },
    });
  };

  const currentAudio = selectedFile || recordedBlob;

  return (
    <div className="border border-neutral-200 bg-white rounded-md p-6 space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-neutral-900">
          Section A — Voice Playground
        </h3>
        <p className="text-xs text-neutral-500 mt-0.5">
          Step-by-step audio input, transcription with Sarvam Saaras, and voice synthesis
        </p>
      </div>

      {/* Input Selector Tabs */}
      <div className="flex border-b border-neutral-200 gap-4 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('record')}
          className={`pb-2 font-medium transition-colors border-b-2 ${
            activeTab === 'record'
              ? 'border-neutral-900 text-neutral-900 font-semibold'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Microphone Recording
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`pb-2 font-medium transition-colors border-b-2 ${
            activeTab === 'upload'
              ? 'border-neutral-900 text-neutral-900 font-semibold'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Upload Audio File
        </button>
      </div>

      {/* Input Action Area */}
      {activeTab === 'record' ? (
        <VoiceRecorder onRecordingComplete={handleRecordingComplete} />
      ) : (
        <AudioUploader
          selectedFile={selectedFile}
          onFileSelected={handleFileSelected}
        />
      )}

      {/* Playback of Input Audio */}
      {inputAudioUrl && (
        <div className="space-y-3">
          <AudioPlayer
            src={inputAudioUrl}
            title={
              selectedFile
                ? `Uploaded File: ${selectedFile.name}`
                : 'Recorded Microphone Audio'
            }
            downloadable={true}
            downloadFileName={selectedFile?.name || 'recorded-speech.webm'}
          />

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={handleTranscribe}
              disabled={isTranscribing || !currentAudio}
              size="sm"
              className="gap-2"
            >
              {isTranscribing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Transcribing with Saaras...</span>
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  <span>Transcribe Speech (Sarvam Saaras)</span>
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Transcription Results */}
      <TranscriptionPanel
        transcript={transcript}
        languageCode={languageCode}
        isTranscribing={isTranscribing}
      />

      {/* Continue to LLM + TTS */}
      {transcript && (
        <div className="border-t border-neutral-200 pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-900">
              Query Assistant with Transcribed Text
            </span>
            <Button
              type="button"
              onClick={handleGenerateReplyAndVoice}
              disabled={isThinking || isSpeaking}
              size="sm"
              className="gap-2 bg-neutral-900 hover:bg-neutral-800"
            >
              {isThinking ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generating LLM Response...</span>
                </>
              ) : isSpeaking ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Synthesizing Voice (Bulbul)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Send to Assistant & Synthesize Voice</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </>
              )}
            </Button>
          </div>

          {aiReply && (
            <div className="rounded-md border border-neutral-200 bg-neutral-50/50 p-4 space-y-2">
              <span className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
                <Volume2 className="h-3.5 w-3.5 text-neutral-600" />
                AI Assistant Spoken Response
              </span>
              <p className="text-xs leading-relaxed text-neutral-900 whitespace-pre-wrap">
                {aiReply}
              </p>
            </div>
          )}

          {outputAudioUrl && (
            <AudioPlayer
              src={outputAudioUrl}
              title="Assistant Synthesized Voice (Bulbul)"
              downloadable={true}
              downloadFileName="assistant-response.wav"
              autoPlay={true}
            />
          )}
        </div>
      )}
    </div>
  );
}
