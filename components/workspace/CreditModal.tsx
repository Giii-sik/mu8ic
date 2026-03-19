'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface CreditModalProps {
  onClose: () => void;
}

const plans = [
  {
    name: 'Pro',
    price: '$5',
    credits: '100 credits',
    productId: process.env.NEXT_PUBLIC_POLAR_PRO_PRODUCT_ID!,
    glow: 'radial-gradient(circle at 50% 80%, rgba(139, 92, 246, 0.35) 0%, transparent 70%)',
    border: 'rgba(139, 92, 246, 0.2)',
    highlight: 'rgba(139, 92, 246, 0.08)',
  },
  {
    name: 'Ultra',
    price: '$50',
    credits: '1,100 credits',
    productId: process.env.NEXT_PUBLIC_POLAR_ULTRA_PRODUCT_ID!,
    glow: 'radial-gradient(circle at 50% 80%, rgba(251, 191, 36, 0.3) 0%, transparent 70%)',
    border: 'rgba(251, 191, 36, 0.2)',
    highlight: 'rgba(251, 191, 36, 0.06)',
  },
];

export function CreditModal({ onClose }: CreditModalProps) {
  const { user } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleCheckout = async (plan: typeof plans[0]) => {
    setLoadingPlan(plan.name);
    setError(null);
    try {
      const successUrl = `${window.location.origin}/workspace?checkout=success`;
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: plan.productId,
          customerEmail: user?.email,
          customerId: user?.id,
          successUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create checkout');
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoadingPlan(null);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm mx-4 rounded-2xl p-6"
        style={{
          background: 'rgba(20, 20, 22, 0.95)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full text-white/30 transition-colors hover:bg-white/5 hover:text-white/60"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Title */}
        <p className="text-sm font-semibold text-white/80 mb-1">Get credits</p>
        <p className="text-xs text-white/30 mb-6">Choose a plan to generate more music</p>

        {/* Cards */}
        <div className="flex gap-3">
          {plans.map((plan) => {
            const isLoading = loadingPlan === plan.name;
            const isDisabled = loadingPlan !== null;
            return (
              <button
                key={plan.name}
                onClick={() => handleCheckout(plan)}
                disabled={isDisabled}
                className="relative flex-1 rounded-xl p-5 text-left overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  background: plan.highlight,
                  border: `1px solid ${plan.border}`,
                }}
              >
                {/* Glow background */}
                <div
                  className="absolute inset-0 z-0"
                  style={{ backgroundImage: plan.glow, opacity: 0.8 }}
                />

                <div className="relative z-10 flex flex-col gap-3">
                  <span className="text-xs font-medium text-white/50 tracking-wider uppercase">
                    {plan.name}
                  </span>
                  <span className="text-3xl font-bold text-white/90 tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-xs text-white/40">{plan.credits}</span>

                  {isLoading && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <Loader2 className="h-3 w-3 text-white/40 animate-spin" />
                      <span className="text-xs text-white/30">Redirecting...</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <p className="mt-4 text-xs text-red-400/60 text-center">{error}</p>
        )}
      </div>
    </div>,
    document.body,
  );
}
