'use client';

import { motion } from 'framer-motion';

const ACCENT = '#FECD00';

const cards = [
  {
    id: 1,
    img: '/image/1.jpg',
    tag: 'Copyright-Free',
    title: 'No more copyright strikes.',
    desc: 'Every track is generated fresh for you. No licensing fees, no takedowns — ever.',
  },
  {
    id: 2,
    img: '/image/2.jpg',
    tag: 'On-Demand',
    title: 'Stop downloading random MP3s.',
    desc: 'Forget endless searches for "free" music that still gets claimed. Generate exactly what you need.',
  },
  {
    id: 3,
    img: '/image/3.jpg',
    tag: 'Personalized',
    title: 'Music that fits your taste.',
    desc: 'Describe the vibe in plain words. Upbeat, cinematic, lo-fi — the AI understands your vision.',
  },
  {
    id: 4,
    img: '/image/4.jpg',
    tag: 'Instant',
    title: 'Ready in seconds.',
    desc: 'No waiting days for a composer. Your track is ready before your coffee gets cold.',
  },
  {
    id: 5,
    img: '/image/5.jpg',
    tag: 'Flexible',
    title: 'Any length, any mood.',
    desc: '1 to 3 minutes, instrumental or with lyrics — shaped perfectly around your content.',
  },
  {
    id: 6,
    img: '/image/6.jpg',
    tag: 'Yours Forever',
    title: 'Download and keep it.',
    desc: 'Export as MP3 and use anywhere. YouTube, podcasts, reels, presentations — no strings attached.',
  },
];

function FeatureCard({ card, index }: { card: typeof cards[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Image */}
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={card.img}
          alt={card.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(14,14,14,0.85) 100%)' }}
        />
        {/* Tag */}
        <span
          className="absolute left-4 top-4 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-widest uppercase"
          style={{ background: ACCENT, color: '#000' }}
        >
          {card.tag}
        </span>
      </div>

      {/* Text */}
      <div className="flex flex-1 flex-col gap-2 px-5 py-5">
        <h3 className="text-sm font-semibold leading-snug text-white/85">{card.title}</h3>
        <p className="text-xs leading-relaxed text-white/35">{card.desc}</p>
      </div>
    </motion.div>
  );
}

export function FeaturesSection() {
  return (
    <section
      className="relative w-full"
      style={{ backgroundColor: '#0a0a0a' }}
    >
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
          <p
            className="mb-4 text-xs font-semibold tracking-widest uppercase"
            style={{ color: ACCENT }}
          >
            Features
          </p>
          <h2
            className="text-4xl font-extrabold text-white/90 md:text-5xl"
            style={{ fontFamily: 'var(--font-pirata-one)' }}
          >
            Everything you need.
            <br />
            <span style={{ color: ACCENT }}>Nothing you don't.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-white/35">
            mu8ic gives creators complete control over their soundtrack —
            without the copyright headaches, the waiting, or the compromise.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, i) => (
            <FeatureCard key={card.id} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
