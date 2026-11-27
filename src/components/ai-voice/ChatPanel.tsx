'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Bot, Send, Trash2, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useChatMutation } from '@/features/ai-voice/hooks/use-ai-voice';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatPanelProps {
  className?: string;
  onAssistantReply?: (replyText: string) => void;
}

export function ChatPanel({ className, onAssistantReply }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { mutate: sendChat, isPending } = useChatMutation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isPending]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isPending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    sendChat(trimmed, {
      onSuccess: (data) => {
        const assistantMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        onAssistantReply?.(data.reply);
      },
    });
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div
      className={cn(
        'border border-neutral-200 bg-white rounded-md p-4 flex flex-col h-[480px]',
        className,
      )}
    >
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
        <div>
          <h3 className="text-xs font-semibold text-neutral-900">
            Sarvam Chat Testing (LLM)
          </h3>
          <p className="text-[11px] text-neutral-500">
            Powered by Sarvam Conversational LLM with live business & product context
          </p>
        </div>
        {messages.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearChat}
            className="h-7 px-2 text-xs text-neutral-500 hover:text-neutral-900 gap-1"
          >
            <Trash2 className="h-3 w-3" />
            <span>Clear</span>
          </Button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-neutral-500 py-8">
            <Bot className="h-8 w-8 text-neutral-400 mb-2" />
            <p className="text-xs font-medium text-neutral-700">
              Test your AI Phone Assistant
            </p>
            <p className="text-[11px] text-neutral-500 max-w-xs mt-1">
              Ask about business hours, product pricing, product details, or company policies.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex gap-2.5 max-w-[85%]',
                msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto',
              )}
            >
              <div
                className={cn(
                  'h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px]',
                  msg.role === 'user'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-200 text-neutral-800',
                )}
              >
                {msg.role === 'user' ? (
                  <User className="h-3 w-3" />
                ) : (
                  <Bot className="h-3 w-3" />
                )}
              </div>
              <div
                className={cn(
                  'rounded-md px-3 py-2 text-xs leading-relaxed',
                  msg.role === 'user'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-900 border border-neutral-200',
                )}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <span
                  className={cn(
                    'block text-[9px] mt-1',
                    msg.role === 'user'
                      ? 'text-neutral-400 text-right'
                      : 'text-neutral-500',
                  )}
                >
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))
        )}

        {isPending && (
          <div className="flex gap-2.5 mr-auto max-w-[85%]">
            <div className="h-6 w-6 rounded-full bg-neutral-200 text-neutral-800 flex items-center justify-center flex-shrink-0">
              <Bot className="h-3 w-3" />
            </div>
            <div className="rounded-md px-3 py-2 text-xs bg-neutral-100 border border-neutral-200 text-neutral-600 flex items-center gap-2">
              <Loader2 className="h-3 w-3 animate-spin text-neutral-700" />
              <span>Generating response with Sarvam LLM...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="pt-2 border-t border-neutral-200 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message (e.g. 'What products do you offer?')..."
          disabled={isPending}
          className="text-xs"
        />
        <Button
          type="submit"
          disabled={isPending || !input.trim()}
          size="sm"
          className="px-3"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
