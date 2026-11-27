'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { VoiceConversation } from '@/components/ai-voice/VoiceConversation';
import { VoicePlayground } from '@/features/ai-voice/components/VoicePlayground';
import { ChatPanel } from '@/components/ai-voice/ChatPanel';
import { TtsPanel } from '@/components/ai-voice/TtsPanel';
import { AudioWaveform, MessageSquare, Mic, Volume2 } from 'lucide-react';

export function AiVoicePage() {
  const [activeTab, setActiveTab] = useState<'full' | 'stt' | 'chat' | 'tts'>('full');

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="AI Voice Playground"
        description="Test speech-to-text, LLM conversational intelligence, and voice synthesis exclusively powered by Sarvam AI"
      />

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-neutral-200 gap-6 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('full')}
          className={`flex items-center gap-1.5 pb-2.5 font-medium transition-colors border-b-2 ${
            activeTab === 'full'
              ? 'border-neutral-900 text-neutral-900 font-semibold'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <AudioWaveform className="h-4 w-4" />
          <span>Full Voice Interaction (Section D)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('stt')}
          className={`flex items-center gap-1.5 pb-2.5 font-medium transition-colors border-b-2 ${
            activeTab === 'stt'
              ? 'border-neutral-900 text-neutral-900 font-semibold'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Mic className="h-4 w-4" />
          <span>Voice Playground (Section A)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-1.5 pb-2.5 font-medium transition-colors border-b-2 ${
            activeTab === 'chat'
              ? 'border-neutral-900 text-neutral-900 font-semibold'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>Text Chat Testing (Section B)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tts')}
          className={`flex items-center gap-1.5 pb-2.5 font-medium transition-colors border-b-2 ${
            activeTab === 'tts'
              ? 'border-neutral-900 text-neutral-900 font-semibold'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Volume2 className="h-4 w-4" />
          <span>Text-to-Speech (Section C)</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'full' && <VoiceConversation />}
      {activeTab === 'stt' && <VoicePlayground />}
      {activeTab === 'chat' && <ChatPanel />}
      {activeTab === 'tts' && <TtsPanel />}
    </div>
  );
}
