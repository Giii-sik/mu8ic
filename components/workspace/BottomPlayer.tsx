'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from 'lucide-react';

export interface Track {
  id: string;
  prompt: string;
  signedUrl: string;
  duration: number | null;
}

interface BottomPlayerProps {
  track: Track | null;
  tracks: Track[];
  onTrackChange: (track: Track | null) => void;
}

const fmt = (s: number) =>
  `${Math.floor(s / 60).toString().padStart(2, '0')}:${Math.floor(s % 60).toString().padStart(2, '0')}`;

export function BottomPlayer({ track, tracks, onTrackChange }: BottomPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const desktopProgressRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !track) return;
    audio.src = track.signedUrl;
    audio.load();
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    setCurrentTime(0);
  }, [track?.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoaded = () => setDuration(audio.duration);
    const onEnded = () => {
      setIsPlaying(false);
      const idx = tracks.findIndex((t) => t.id === track?.id);
      if (idx !== -1 && idx < tracks.length - 1) onTrackChange(tracks[idx + 1]);
    };
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('ended', onEnded);
    };
  }, [track?.id, tracks, onTrackChange]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.pause(); setIsPlaying(false); }
    else { audio.play(); setIsPlaying(true); }
  };

  const seekOnBar = useCallback((e: React.MouseEvent<HTMLDivElement>, ref: React.RefObject<HTMLDivElement | null>) => {
    const bar = ref.current;
    const audio = audioRef.current;
    if (!bar || !audio || !duration) return;
    const rect = bar.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const time = (x / rect.width) * duration;
    audio.currentTime = time;
    setCurrentTime(time);
  }, [duration]);

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
    if (v === 0) setIsMuted(true);
    else if (isMuted) { setIsMuted(false); if (audioRef.current) audioRef.current.muted = false; }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const currentIdx = tracks.findIndex((t) => t.id === track?.id);
  const hasPrev = currentIdx > 0;
  const hasNext = currentIdx < tracks.length - 1;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!track) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50" style={{ background: '#0f0f0f', borderTop: '1px solid #2a2a2a' }}>
      <audio ref={audioRef} preload="metadata" />

      {/* ── Mobile layout (Spotify-style) ── */}
      <div className="md:hidden">
        {/* Progress bar — thin strip at top, tappable */}
        <div
          ref={progressRef}
          onClick={(e) => seekOnBar(e, progressRef)}
          className="relative h-[3px] w-full cursor-pointer bg-[#2a2a2a]"
        >
          <div
            className="absolute left-0 top-0 h-full bg-white/60 transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Main row */}
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Album thumbnail */}
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
            style={{ background: 'linear-gradient(135deg, #3b3f6e 0%, #2a1f4e 100%)' }}
          >
            <Music className="h-4 w-4 text-white/40" />
          </div>

          {/* Track title */}
          <p className="flex-1 min-w-0 text-sm font-medium text-white/75 truncate leading-tight">
            {track.prompt}
          </p>

          {/* Controls */}
          <div className="flex flex-shrink-0 items-center gap-4">
            <button
              onClick={() => hasPrev && onTrackChange(tracks[currentIdx - 1])}
              disabled={!hasPrev}
              className="text-white/45 transition-opacity active:opacity-50 disabled:opacity-20"
            >
              <SkipBack className="h-5 w-5 fill-current" />
            </button>

            <button
              onClick={togglePlay}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black active:scale-95 transition-transform"
            >
              {isPlaying
                ? <Pause className="h-[18px] w-[18px] fill-current" />
                : <Play className="h-[18px] w-[18px] fill-current translate-x-px" />}
            </button>

            <button
              onClick={() => hasNext && onTrackChange(tracks[currentIdx + 1])}
              disabled={!hasNext}
              className="text-white/45 transition-opacity active:opacity-50 disabled:opacity-20"
            >
              <SkipForward className="h-5 w-5 fill-current" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Desktop layout (3-column) ── */}
      <div className="hidden items-center gap-4 px-6 md:flex" style={{ height: '80px' }}>
        {/* Track info */}
        <div className="flex w-[28%] min-w-0 items-center gap-3">
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
            style={{ background: 'linear-gradient(135deg, #3b3f6e 0%, #2a1f4e 100%)' }}
          >
            <Music className="h-4 w-4 text-white/40" />
          </div>
          <p className="truncate text-sm text-white/60 leading-snug">{track.prompt}</p>
        </div>

        {/* Center controls + progress */}
        <div className="flex flex-1 flex-col items-center gap-2">
          <div className="flex items-center gap-5">
            <button
              onClick={() => hasPrev && onTrackChange(tracks[currentIdx - 1])}
              disabled={!hasPrev}
              className="text-white/40 transition-colors hover:text-white/80 disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <SkipBack className="h-4 w-4 fill-current" />
            </button>

            <button
              onClick={togglePlay}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-105"
            >
              {isPlaying
                ? <Pause className="h-4 w-4 fill-current" />
                : <Play className="h-4 w-4 fill-current translate-x-px" />}
            </button>

            <button
              onClick={() => hasNext && onTrackChange(tracks[currentIdx + 1])}
              disabled={!hasNext}
              className="text-white/40 transition-colors hover:text-white/80 disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <SkipForward className="h-4 w-4 fill-current" />
            </button>
          </div>

          <div className="flex w-full max-w-md items-center gap-2">
            <span className="w-8 text-right text-[11px] tabular-nums text-white/30">{fmt(currentTime)}</span>
            <div
              ref={desktopProgressRef}
              onClick={(e) => seekOnBar(e, desktopProgressRef)}
              className="group relative h-1 flex-1 cursor-pointer rounded-full bg-[#2e2e2e]"
            >
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-[#6b7280] transition-colors group-hover:bg-white/60"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white opacity-0 shadow transition-opacity group-hover:opacity-100"
                style={{ left: `calc(${progress}% - 6px)` }}
              />
            </div>
            <span className="w-8 text-[11px] tabular-nums text-white/30">{fmt(duration)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="flex w-[28%] items-center justify-end gap-2">
          <button onClick={toggleMute} className="text-white/40 transition-colors hover:text-white/70">
            {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={handleVolume}
            className="h-1 w-24 cursor-pointer appearance-none rounded-full bg-[#2e2e2e] accent-white/60"
          />
        </div>
      </div>
    </div>
  );
}
