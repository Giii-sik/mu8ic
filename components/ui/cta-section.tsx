'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const Silk = dynamic(() => import('./silk').then((m) => m.Silk), { ssr: false });

export function CtaSection() {
  return (
    <section className="relative w-full overflow-hidden" style={{ height: '540px' }}>

      {/* Silk background */}
      <div className="absolute inset-0 z-0">
        <Silk
          color="#292106"
          speed={3}
          scale={1.4}
          noiseIntensity={1.2}
          rotation={0.3}
        />
      </div>

      {/* Dark overlay — fades edges into adjacent sections */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0) 20%, rgba(0,0,0,0.72) 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24"
        style={{ background: 'linear-gradient(to bottom, #080808, transparent)' }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24"
        style={{ background: 'linear-gradient(to top, #080808, transparent)' }}
      />

      {/* Content */}
      <div className="relative z-20 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-xs font-semibold uppercase tracking-widest"
          style={{ color: '#FECD00' }}
        >
          Start creating
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="max-w-xl text-4xl font-extrabold leading-tight text-white/90 md:text-5xl"
          style={{ fontFamily: 'var(--font-pirata-one)' }}
        >
          Your next video
          <br />
          <span style={{ color: '#FECD00' }}>deserves better music.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="mt-5 max-w-sm text-sm leading-relaxed text-white/40"
        >
          Generate royalty-free tracks in seconds.
          No subscriptions. No copyright strikes. Just your sound.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.24 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="/auth"
            className="rounded-full px-8 py-3 text-sm font-bold tracking-wide text-black transition-opacity hover:opacity-85"
            style={{ backgroundColor: '#FECD00' }}
          >
            Get Started Free
          </a>
          <a
            href="#"
            className="rounded-full border px-8 py-3 text-sm font-medium text-white/60 transition-colors hover:border-white/30 hover:text-white/90"
            style={{ borderColor: 'rgba(255,255,255,0.12)' }}
          >
            See Pricing
          </a>
        </motion.div>
      </div>
    </section>
  );
}
