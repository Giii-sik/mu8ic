'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { WorkspaceNavbar } from '@/components/workspace/WorkspaceNavbar';
import { PromptInputBox } from '@/components/workspace/PromptInputBox';

export default function WorkspacePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth');
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <div
      className="flex h-screen w-full flex-col"
      style={{ backgroundColor: '#171717' }}
    >
      <WorkspaceNavbar />

      <main className="flex flex-1 items-center justify-center">
        <p className="text-sm text-white/20">workspace</p>
      </main>

      {/* Fixed bottom prompt */}
      <div className="fixed bottom-6 left-1/2 w-full max-w-2xl -translate-x-1/2 px-4">
        <PromptInputBox />
      </div>
    </div>
  );
}
