'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { WorkspaceNavbar } from '@/components/workspace/WorkspaceNavbar';
import { PromptInputBox } from '@/components/workspace/PromptInputBox';
import { MusicList } from '@/components/workspace/MusicList';
import { BottomPlayer } from '@/components/workspace/BottomPlayer';
import type { Track } from '@/components/workspace/BottomPlayer';

export default function WorkspacePage() {
  const { user, session, loading } = useAuth();
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [allTracks, setAllTracks] = useState<Track[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth');
    }
  }, [user, loading, router]);

  const handleTracksLoaded = useCallback((tracks: Track[]) => {
    setAllTracks(tracks);
  }, []);

  const handleTrackSelect = useCallback((track: Track | null) => {
    setCurrentTrack(track);
  }, []);

  if (loading || !user) return null;

  const handleSend = async (message: string, options: { lyrics: string; duration: number; batchSize: number }) => {
    const prompt = message.trim();
    if (!prompt || !session) return;

    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch('/api/generate-music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          prompt,
          userId: user.id,
          lyrics: options.lyrics,
          duration: options.duration,
          batchSize: options.batchSize,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');

      setRefreshKey((k) => k + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsGenerating(false);
    }
  };

  const bottomOffset = currentTrack ? 'bottom-[104px]' : 'bottom-6';

  return (
    <div className="flex h-screen w-full flex-col" style={{ backgroundColor: '#171717' }}>
      <WorkspaceNavbar onSearch={setSearchQuery} />

      <main className={`flex flex-1 flex-col overflow-y-auto pt-14 ${currentTrack ? 'pb-48' : 'pb-40'}`}>
        <MusicList
          refreshKey={refreshKey}
          isGenerating={isGenerating}
          error={error}
          currentTrackId={currentTrack?.id ?? null}
          searchQuery={searchQuery}
          onTrackSelect={handleTrackSelect}
          onTracksLoaded={handleTracksLoaded}
        />
      </main>

      <div className={`fixed left-1/2 w-full max-w-2xl -translate-x-1/2 px-4 transition-all duration-300 ${bottomOffset}`}>
        <PromptInputBox onSend={handleSend} isLoading={isGenerating} />
      </div>

      <BottomPlayer
        track={currentTrack}
        tracks={allTracks}
        onTrackChange={handleTrackSelect}
      />
    </div>
  );
}
