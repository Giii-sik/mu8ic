'use client';

import { motion } from 'framer-motion';
import { Zap, Check } from 'lucide-react';

const ACCENT = '#FECD00';

const plans = [
  {
    name: 'Pro',
    price: '$5',
    credits: 100,
    perCredit: '$0.05',
    color: '#a855f7',
    glow: 'radial-gradient(circle at 50% 100%, rgba(139,92,246,0.3) 0%, transparent 70%)',
    border: 'rgba(139,92,246,0.25)',
    highlight: 'rgba(139,92,246,0.06)',
    href: '/auth',
    perks: [
      'Up to 100 AI-generated tracks',
      '1–3 min per track',
      'Batch generation (up to ×4)',
      'MP3 download',
      'Royalty-free forever',
    ],
  },
  {
    name: 'Ultra',
    price: '$50',
    credits: 1100,
    perCredit: '$0.045',
    color: '#FECD00',
    glow: 'radial-gradient(circle at 50% 100%, rgba(254,205,0,0.25) 0%, transparent 70%)',
    border: 'rgba(254,205,0,0.25)',
    highlight: 'rgba(254,205,0,0.05)',
    href: '/auth',
    badge: 'Best Value',
    perks: [
      'Up to 1,100 AI-generated tracks',
      '1–3 min per track',
      'Batch generation (up to ×4)',
      'MP3 download',
      'Royalty-free forever',
      '10× more credits for power creators',
    ],
  },
];

export function PricingSection() {
  return (
    <section className="relative w-full" style={{ backgroundColor: '#080808' }}>
      <div className="w-full h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />

      <div className="mx-auto max-w-7xl px-8 py-24 md:py-32">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="mb-4 text-xs font-semibold tracking-widest uppercase" style={{ color: ACCENT }}>
            Pricing
          </p>
          <h2
            className="text-4xl font-extrabold text-white/90 md:text-5xl"
            style={{ fontFamily: 'var(--font-pirata-one)' }}
          >
            Pay only for what
            <br />
            <span style={{ color: ACCENT }}>you create.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-white/35">
            No subscriptions. No monthly fees. Buy credits once and use them
            whenever inspiration strikes.
          </p>
        </motion.div>

        {/* Credit pill */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-10 flex justify-center"
        >
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs"
            style={{
              background: 'rgba(254,205,0,0.08)',
              border: '1px solid rgba(254,205,0,0.2)',
              color: ACCENT,
            }}
          >
            <Zap className="h-3.5 w-3.5" fill={ACCENT} />
            <span>1 credit = 1 generation · use anytime, never expires</span>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative flex flex-col overflow-hidden rounded-2xl"
              style={{
                background: plan.highlight,
                border: `1px solid ${plan.border}`,
              }}
            >
              {/* Glow */}
              <div className="pointer-events-none absolute inset-0 z-0" style={{ backgroundImage: plan.glow }} />

              <div className="relative z-10 flex flex-col gap-6 p-6">
                {/* Name + badge */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: plan.color }}>
                    {plan.name}
                  </span>
                  {plan.badge && (
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide"
                      style={{ background: ACCENT, color: '#000' }}
                    >
                      {plan.badge}
                    </span>
                  )}
                </div>

                {/* Price */}
                <div>
                  <div className="flex items-end gap-1.5">
                    <span className="text-5xl font-bold tracking-tight text-white/90">{plan.price}</span>
                    <span className="mb-1.5 text-xs text-white/30">one-time</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <Zap className="h-3 w-3" style={{ color: plan.color, fill: plan.color }} />
                    <span className="text-sm font-semibold" style={{ color: plan.color }}>
                      {plan.credits.toLocaleString()} credits
                    </span>
                    <span className="text-xs text-white/25">· {plan.perCredit} each</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px w-full" style={{ background: 'rgba(255,255,255,0.06)' }} />

                {/* Perks */}
                <ul className="space-y-2.5">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2.5 text-xs text-white/50">
                      <Check className="mt-px h-3.5 w-3.5 shrink-0" style={{ color: plan.color }} />
                      {perk}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href={plan.href}
                  className="mt-auto flex w-full items-center justify-center rounded-xl py-3 text-sm font-semibold transition-opacity hover:opacity-80"
                  style={
                    plan.name === 'Ultra'
                      ? { background: ACCENT, color: '#000' }
                      : { background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)', border: `1px solid ${plan.border}` }
                  }
                >
                  Get {plan.credits.toLocaleString()} Credits
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 text-center text-xs text-white/20"
        >
          Secure payment via Polar · Credits never expire · No subscription required
        </motion.p>
      </div>
    </section>
  );
}
