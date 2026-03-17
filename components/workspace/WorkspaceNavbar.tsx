'use client';

import { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function WorkspaceNavbar() {
  const { user, signOut } = useAuth();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setPopoverOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const displayName = (user?.user_metadata?.full_name ?? user?.email ?? '') as string;
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <header className="fixed top-0 left-0 z-50 flex w-full items-center justify-between px-6 py-3">
      {/* Logo */}
      <span
        className="shrink-0 text-base font-bold tracking-wider text-white/90"
        style={{ fontFamily: 'var(--font-schoolbell)' }}
      >
        mu8ic
      </span>

      {/* Search */}
      <div className="relative flex w-72 items-center">
        <Search
          className="pointer-events-none absolute left-3 z-10 text-white/25"
          size={13}
          strokeWidth={2}
        />
        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-xl py-2 pl-8 pr-4 text-xs text-white/70 placeholder-white/25 outline-none"
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07)',
            caretColor: 'rgba(255,255,255,0.6)',
          }}
          readOnly
        />
      </div>

      {/* Profile Popover */}
      <div className="relative shrink-0" ref={popoverRef}>
        <button
          onClick={() => setPopoverOpen((prev) => !prev)}
          className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full transition-opacity hover:opacity-80 focus:outline-none"
          style={{
            border: '1.5px solid rgba(255,255,255,0.15)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          }}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="avatar" className="h-full w-full object-cover" />
          ) : (
            <span className="text-[10px] font-semibold text-white/70">{initials}</span>
          )}
        </button>

        {/* Popover */}
        {popoverOpen && (
          <div
            className="absolute right-0 top-[calc(100%+10px)] w-52 rounded-2xl p-1 transition-all"
            style={{
              background: 'rgba(30, 30, 30, 0.75)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow:
                '0 16px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
            {/* User info */}
            <div className="flex items-center gap-3 px-3 py-3">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full"
                style={{ border: '1.5px solid rgba(255,255,255,0.12)' }}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="avatar" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs font-semibold text-white/70">{initials}</span>
                )}
              </div>
              <div className="min-w-0">
                {displayName && (
                  <p className="truncate text-xs font-medium text-white/80">{displayName}</p>
                )}
                <p className="truncate text-[10px] text-white/35">{user?.email}</p>
              </div>
            </div>

            {/* Divider */}
            <div className="mx-2 my-1" style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

            {/* Sign out */}
            <button
              onClick={signOut}
              className="flex w-full items-center rounded-xl px-3 py-2.5 text-xs text-white/50 transition-colors hover:bg-white/5 hover:text-white/80"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
