'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Star, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { CreditModal } from './CreditModal';

export function WorkspaceNavbar({ onSearch }: { onSearch?: (q: string) => void }) {
  const { user, credits, signOut } = useAuth();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [creditModalOpen, setCreditModalOpen] = useState(false);
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
  const isLowCredits = credits < 10;

  return (
    <header className="fixed top-0 left-0 z-50 flex w-full items-center justify-between px-4 py-3 md:grid md:grid-cols-3 md:px-6">
      {/* Logo */}
      <span
        className="shrink-0 text-base font-bold tracking-wider text-white/90"
        style={{ fontFamily: 'var(--font-schoolbell)' }}
      >
        mu8ic
      </span>

      {/* Search — 정가운데 (모바일 숨김) */}
      <div className="relative hidden w-72 items-center justify-self-center md:flex">
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
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>

      {/* Right: Credits + Profile */}
      <div className="flex items-center justify-end gap-2">
        {/* Credits */}
        <div className="flex items-center gap-1.5">
          <Zap
            className="h-3.5 w-3.5"
            style={{ color: isLowCredits ? '#fbbf24' : '#a855f7', fill: isLowCredits ? '#fbbf24' : '#a855f7' }}
          />
          <span className={`text-xs font-medium tabular-nums ${isLowCredits ? 'text-amber-400' : 'text-white/60'}`}>
            {credits.toLocaleString()}
          </span>
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
                boxShadow: '0 16px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
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

              {/* Credits row */}
              <div className="mx-1 mb-1 flex items-center justify-between rounded-xl px-3 py-2.5"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <div className="flex items-center gap-1.5">
                  <Zap
                    className="h-3.5 w-3.5"
                    style={{ color: isLowCredits ? '#fbbf24' : '#a855f7', fill: isLowCredits ? '#fbbf24' : '#a855f7' }}
                  />
                  <span className="text-xs text-white/50">Credits</span>
                </div>
                <span className={`text-xs font-semibold tabular-nums ${isLowCredits ? 'text-amber-400' : 'text-white/70'}`}>
                  {credits.toLocaleString()}
                </span>
              </div>

              {/* Divider */}
              <div className="mx-2 my-1" style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

              {/* Upgrade */}
              <button
                onClick={() => { setPopoverOpen(false); setCreditModalOpen(true); }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-xs text-white/50 transition-colors hover:bg-white/5 hover:text-white/80"
              >
                <Star className="h-3.5 w-3.5" />
                Upgrade
              </button>

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
      </div>

      {creditModalOpen && <CreditModal onClose={() => setCreditModalOpen(false)} />}
    </header>
  );
}
