'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
  prompt: string;
}

const fmt = (s: number) =>
  `${Math.floor(s / 60).toString().padStart(2, '0')}:${Math.floor(s % 60).toString().padStart(2, '0')}`;

export function AudioPlayer({ src, prompt }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => { if (!isDragging) setCurrentTime(audio.currentTime); };
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [isDragging]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.pause(); } else { audio.play(); }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const getProgressFromEvent = useCallback((e: React.MouseEvent | MouseEvent) => {
    const bar = progressRef.current;
    if (!bar || !duration) return null;
    const rect = bar.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    return (x / rect.width) * duration;
  }, [duration]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const time = getProgressFromEvent(e);
    if (time === null) return;
    const audio = audioRef.current;
    if (audio) audio.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
    if (v === 0) setIsMuted(true);
    else if (isMuted) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.muted = false;
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="rounded-2xl border border-[#2e2e2e] bg-[#1a1a1a] p-5">
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Prompt label */}
      <p className="mb-4 text-sm text-[#9ca3af] leading-relaxed">{prompt}</p>

      {/* Player shell */}
      <div className="rounded-xl bg-[#212428] px-4 py-3 flex flex-col gap-3">

        {/* Progress bar */}
        <div
          ref={progressRef}
          className="group relative h-1.5 w-full cursor-pointer rounded-full bg-[#343a40]"
          onClick={handleProgressClick}
        >
          {/* Filled */}
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-[#6b7280] transition-all duration-100 group-hover:bg-[#9ca3af]"
            style={{ width: `${progress}%` }}
          />
          {/* Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-[#d1d5db] opacity-0 group-hover:opacity-100 transition-opacity shadow"
            style={{ left: `calc(${progress}% - 6px)` }}
          />
        </div>

        {/* Controls row */}
        <div className="flex items-center gap-3">
          {/* Play / Pause */}
          <button
            onClick={togglePlay}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#374151] text-[#e5e7eb] transition-colors hover:bg-[#4b5563]"
          >
            {isPlaying
              ? <Pause className="h-3.5 w-3.5 fill-current" />
              : <Play className="h-3.5 w-3.5 fill-current translate-x-px" />}
          </button>

          {/* Time */}
          <span className="text-xs tabular-nums text-[#6b7280]">
            {fmt(currentTime)}
            <span className="mx-1 text-[#4b5563]">/</span>
            {fmt(duration)}
          </span>

          <div className="flex-1" />

          {/* Volume */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="text-[#6b7280] transition-colors hover:text-[#9ca3af]"
            >
              {isMuted || volume === 0
                ? <VolumeX className="h-4 w-4" />
                : <Volume2 className="h-4 w-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-[#343a40] accent-[#6b7280]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
