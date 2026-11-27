'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Download, Pause, Play, RotateCcw, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
  src: string | null;
  title?: string;
  downloadable?: boolean;
  downloadFileName?: string;
  className?: string;
  autoPlay?: boolean;
  onEnded?: () => void;
}

export function AudioPlayer({
  src,
  title = 'Audio Playback',
  downloadable = true,
  downloadFileName = 'sarvam-audio.wav',
  className,
  autoPlay = false,
  onEnded,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [prevSrc, setPrevSrc] = useState(src);

  // Synchronize state during render when src changes (React 19 compliant)
  if (src !== prevSrc) {
    setPrevSrc(src);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }

  useEffect(() => {
    if (src && autoPlay && audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Autoplay blocked by browser policy
          setIsPlaying(false);
        });
    }
  }, [src, autoPlay]);

  if (!src) return null;

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const restartAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      className={cn(
        'border border-neutral-200 bg-neutral-50/50 rounded-md p-3.5 space-y-2.5',
        className,
      )}
    >
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          setIsPlaying(false);
          onEnded?.();
        }}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-neutral-600" />
          <span className="text-xs font-medium text-neutral-800">{title}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {downloadable && (
            <a
              href={src}
              download={downloadFileName}
              title="Download audio file"
            >
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs gap-1 border-neutral-200 bg-white"
              >
                <Download className="h-3 w-3" />
                <span>Save</span>
              </Button>
            </a>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={togglePlay}
          className="h-8 w-8 p-0 rounded-full bg-white border-neutral-300"
        >
          {isPlaying ? (
            <Pause className="h-3.5 w-3.5 text-neutral-900" />
          ) : (
            <Play className="h-3.5 w-3.5 text-neutral-900 ml-0.5" />
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={restartAudio}
          className="h-8 w-8 p-0 text-neutral-500 hover:text-neutral-900"
          title="Restart audio"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>

        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="flex-1 h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-900"
        />

        <span className="text-[11px] font-mono text-neutral-500 min-w-[65px] text-right">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}
