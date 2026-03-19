'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Music, Play, MoreHorizontal, Pencil, Download, Trash2 } from 'lucide-react';
import { GeneratingIndicator } from './GeneratingIndicator';
import type { Track } from './BottomPlayer';

interface MusicRecord {
  id: string;
  prompt: string;
  file_path: string;
  duration: number | null;
  created_at: string;
}

type TrackWithUrl = MusicRecord & { signedUrl: string };

interface MusicListProps {
  refreshKey: number;
  isGenerating: boolean;
  error: string | null;
  currentTrackId: string | null;
  searchQuery?: string;
  onTrackSelect: (track: Track | null) => void;
  onTracksLoaded: (tracks: Track[]) => void;
}

export function MusicList({
  refreshKey,
  isGenerating,
  error,
  currentTrackId,
  searchQuery = '',
  onTrackSelect,
  onTracksLoaded,
}: MusicListProps) {
  const [tracks, setTracks] = useState<TrackWithUrl[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      const { data: musics, error } = await supabase
        .from('musics')
        .select('id, prompt, file_path, duration, created_at')
        .order('created_at', { ascending: false });

      if (cancelled) return;
      if (error || !musics) { setLoading(false); return; }

      const withUrls = await Promise.all(
        musics.map(async (m: MusicRecord) => {
          const { data } = await supabase.storage
            .from('musics')
            .createSignedUrl(m.file_path, 3600);
          return { ...m, signedUrl: data?.signedUrl ?? '' };
        })
      );

      if (cancelled) return;
      const valid = withUrls.filter((t) => t.signedUrl);
      setTracks(valid);
      onTracksLoaded(valid.map((t) => ({ id: t.id, prompt: t.prompt, signedUrl: t.signedUrl, duration: t.duration })));
      setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, [refreshKey]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  const syncAllTracks = (updated: TrackWithUrl[]) => {
    onTracksLoaded(updated.map((t) => ({ id: t.id, prompt: t.prompt, signedUrl: t.signedUrl, duration: t.duration })));
  };

  const handleRename = async (id: string) => {
    const newName = editingName.trim();
    if (!newName) { setEditingId(null); return; }
    const { error } = await supabase.from('musics').update({ prompt: newName }).eq('id', id);
    if (!error) {
      const updated = tracks.map((t) => t.id === id ? { ...t, prompt: newName } : t);
      setTracks(updated);
      syncAllTracks(updated);
    }
    setEditingId(null);
    setEditingName('');
  };

  const handleDelete = async (id: string, file_path: string) => {
    setOpenMenuId(null);
    await supabase.from('musics').delete().eq('id', id);
    await supabase.storage.from('musics').remove([file_path]);
    const updated = tracks.filter((t) => t.id !== id);
    setTracks(updated);
    syncAllTracks(updated);
    if (currentTrackId === id) {
      onTrackSelect(null);
    }
  };

  const handleDownload = async (signedUrl: string, prompt: string) => {
    setOpenMenuId(null);
    const res = await fetch(signedUrl);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `${prompt.slice(0, 40).trim()}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  };

  const filteredTracks = searchQuery.trim()
    ? tracks.filter((t) => t.prompt.toLowerCase().includes(searchQuery.toLowerCase()))
    : tracks;

  const hasLibrary = loading || tracks.length > 0;
  const showPrompt = !hasLibrary;

  return (
    <div className="flex flex-1 flex-col w-full max-w-2xl mx-auto px-4">

      {/* 트랙이 없을 때만 표시되는 프롬프트 안내 영역 */}
      {showPrompt && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              width: '72px',
              height: '72px',
              background: 'linear-gradient(135deg, #3b3f6e 0%, #2a1f4e 100%)',
            }}
          >
            <Music className="h-8 w-8 text-white/40" />
          </div>
          <p className="text-sm text-white/20">Describe the music you want to create</p>
        </div>
      )}

      {/* 생성 중 인디케이터 */}
      {isGenerating && <GeneratingIndicator />}

      {/* 에러 */}
      {error && !isGenerating && (
        <div className="flex items-center justify-center gap-2 mb-6">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
            <circle cx="7" cy="7" r="6.5" stroke="rgba(239,68,68,0.4)" />
            <path d="M4.5 4.5L9.5 9.5M9.5 4.5L4.5 9.5" stroke="rgba(239,68,68,0.5)" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <span className="text-xs text-red-400/50 truncate max-w-xs">{error}</span>
        </div>
      )}

      {/* 라이브러리 섹션 */}
      {hasLibrary && (
        <div className="pt-8 pb-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 bg-[#2e2e2e]" />
            <span className="text-xs font-medium tracking-widest text-white/20 uppercase">
              내 뮤직 라이브러리
            </span>
            <div className="h-px flex-1 bg-[#2e2e2e]" />
          </div>

          <div className="space-y-2">
            {/* 초기 로딩 스켈레톤 */}
            {loading && tracks.length === 0 && (
              <div className="space-y-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="rounded-xl border border-[#2e2e2e] bg-[#1a1a1a] p-4 animate-pulse flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-white/5 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-2/3 rounded bg-white/5" />
                      <div className="h-2 w-1/4 rounded bg-white/5" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 검색 결과 없음 */}
            {searchQuery.trim() && filteredTracks.length === 0 && !loading && (
              <p className="text-center text-xs text-white/20 py-6">No results for &quot;{searchQuery}&quot;</p>
            )}

            {/* 트랙 목록 */}
            {filteredTracks.map((track) => {
              const isActive = track.id === currentTrackId;
              const isMenuOpen = openMenuId === track.id;
              const isEditing = editingId === track.id;

              return (
                <div
                  key={track.id}
                  className="w-full flex items-center gap-3 rounded-xl border px-4 py-3 transition-all"
                  style={{
                    background: isActive ? '#1f1f2e' : '#1a1a1a',
                    borderColor: isActive ? '#3b3f6e' : '#2e2e2e',
                  }}
                >
                  {/* Clickable area: icon + text */}
                  <button
                    className="flex items-center gap-3 flex-1 min-w-0 text-left"
                    onClick={() => onTrackSelect({ id: track.id, prompt: track.prompt, signedUrl: track.signedUrl, duration: track.duration })}
                  >
                    {/* 아이콘 */}
                    <div
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
                      style={{
                        background: isActive
                          ? 'linear-gradient(135deg, #3b3f6e 0%, #2a1f4e 100%)'
                          : '#212428',
                      }}
                    >
                      {isActive
                        ? <div className="flex gap-[3px] items-end h-4">
                            {[3, 5, 4].map((h, i) => (
                              <div
                                key={i}
                                className="w-[3px] rounded-full bg-white/60"
                                style={{
                                  height: `${h * 3}px`,
                                  animation: `eq-bar 0.8s ease-in-out ${i * 0.15}s infinite alternate`,
                                }}
                              />
                            ))}
                          </div>
                        : <Play className="h-3.5 w-3.5 fill-current text-white/30 translate-x-px" />
                      }
                    </div>

                    {/* 텍스트 (hidden when editing) */}
                    {!isEditing && (
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm truncate ${isActive ? 'text-white/80' : 'text-white/50'}`}>
                          {track.prompt}
                        </p>
                        {track.duration && (
                          <p className="text-xs text-white/25 mt-0.5">
                            {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}
                          </p>
                        )}
                      </div>
                    )}
                  </button>

                  {/* Inline rename input */}
                  {isEditing && (
                    <div className="flex-1 min-w-0 mr-2">
                      <input
                        autoFocus
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRename(track.id);
                          if (e.key === 'Escape') { setEditingId(null); setEditingName(''); }
                        }}
                        onBlur={() => handleRename(track.id)}
                        className="w-full bg-transparent border-b border-white/20 text-sm text-white/80 focus:outline-none focus:border-white/50 py-0.5"
                      />
                    </div>
                  )}

                  {/* "..." menu button */}
                  <div
                    className="relative flex-shrink-0"
                    ref={isMenuOpen ? menuRef : null}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(isMenuOpen ? null : track.id);
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-white/20 transition-colors hover:bg-white/5 hover:text-white/50"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {/* Dropdown menu */}
                    {isMenuOpen && (
                      <div
                        className="absolute bottom-full right-0 mb-1 z-50 min-w-[140px] rounded-lg border border-[#333] bg-[#1a1a1a] shadow-xl py-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => {
                            setOpenMenuId(null);
                            setEditingId(track.id);
                            setEditingName(track.prompt);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white/90 transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Rename
                        </button>
                        <button
                          onClick={() => handleDownload(track.signedUrl, track.prompt)}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white/90 transition-colors"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Download
                        </button>
                        <button
                          onClick={() => handleDelete(track.id, track.file_path)}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400/70 hover:bg-white/5 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
