'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';

const ACCENT = '#FECD00';

const tracks = [
  { id: 1, src: '/music/1.mp3', label: 'Cinematic Intro', genre: 'Orchestral' },
  { id: 2, src: '/music/2.mp3', label: 'Chill Lo-Fi',     genre: 'Lo-Fi Beat'  },
  { id: 3, src: '/music/3.mp3', label: 'Epic Drop',        genre: 'Electronic'  },
];

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

function TrackCard({ track, globalPlaying, onPlay }: {
  track: typeof tracks[0];
  globalPlaying: number | null;
  onPlay: (id: number | null) => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const isPlaying = globalPlaying === track.id;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrent(audioRef.current.currentTime);
  };

  const handleLoaded = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleEnded = () => onPlay(null);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = ratio * duration;
  };

  const progress = duration ? current / duration : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: track.id * 0.1 }}
      className="relative flex flex-col gap-4 rounded-2xl p-5"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <audio
        ref={audioRef}
        src={track.src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoaded}
        onEnded={handleEnded}
        preload="metadata"
      />

      {/* Top row */}
      <div className="flex items-center gap-4">
        {/* Play button */}
        <button
          onClick={() => onPlay(isPlaying ? null : track.id)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-transform active:scale-95"
          style={{ background: ACCENT }}
        >
          {isPlaying
            ? <Pause className="h-4 w-4 text-black" fill="black" />
            : <Play  className="h-4 w-4 text-black translate-x-px" fill="black" />
          }
        </button>

        {/* Track info */}
        <div className="min-w-0">
          <p className="text-sm font-medium text-white/80 truncate">{track.label}</p>
          <p className="text-xs text-white/30 mt-0.5">{track.genre}</p>
        </div>

        {/* Duration */}
        <span className="ml-auto text-xs tabular-nums text-white/25 shrink-0">
          {duration ? formatTime(duration) : '--:--'}
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="relative h-1 w-full cursor-pointer rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.08)' }}
        onClick={handleSeek}
      >
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all"
          style={{ width: `${progress * 100}%`, background: ACCENT }}
        />
      </div>

      {/* Time row */}
      <div className="flex justify-between text-[10px] tabular-nums text-white/20 -mt-2">
        <span>{formatTime(current)}</span>
        <span>{duration ? formatTime(duration) : ''}</span>
      </div>
    </motion.div>
  );
}

export function ExampleSection() {
  const [globalPlaying, setGlobalPlaying] = useState<number | null>(null);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: '#0e0e0e' }}
    >
      {/* Subtle top divider */}
      <div className="w-full h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

      <div className="mx-auto max-w-7xl px-8 py-24 md:py-32">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-24 items-center">

          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Label */}
            <p
              className="mb-4 text-xs font-semibold tracking-widest uppercase"
              style={{ color: ACCENT }}
            >
              Examples
            </p>

            <h2
              className="text-4xl font-extrabold leading-tight text-white/90 md:text-5xl"
              style={{ fontFamily: 'var(--font-pirata-one)' }}
            >
              Perfect music
              <br />
              <span style={{ color: ACCENT }}>for your video.</span>
            </h2>

            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/45">
              Describe the mood, genre, or scene — and mu8ic instantly generates
              royalty-free tracks tailored to your content.
              No music skills required.
            </p>

            <a
              href="/auth"
              className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-semibold tracking-widest text-black transition-opacity hover:opacity-80"
              style={{ backgroundColor: ACCENT }}
            >
              GET STARTED
            </a>
          </motion.div>

          {/* Right — track cards */}
          <div className="flex flex-col gap-3">
            {tracks.map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                globalPlaying={globalPlaying}
                onPlay={setGlobalPlaying}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
