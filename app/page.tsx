'use client';

import { MinimalistHero } from '@/components/ui/minimalist-hero';
import { ExampleSection } from '@/components/ui/example-section';
import { FeaturesSection } from '@/components/ui/features-section';
import { PricingSection } from '@/components/ui/pricing-section';
import { CtaSection } from '@/components/ui/cta-section';
import { Footer } from '@/components/ui/footer';

export default function Home() {
  const navLinks = [
    { label: 'HOW IT WORKS', href: '#' },
    { label: 'PRICING', href: '#' },
    { label: 'ABOUT', href: '#' },
  ];

  return (
    <>
      <MinimalistHero
        logoText="mu8ic."
        navLinks={navLinks}
        mainText="Generate royalty-free music for your YouTube videos in seconds. Powered by AI, crafted for creators."
        imageSrc="https://ik.imagekit.io/fpxbgsota/image%2013.png?updatedAt=1753531863793"
        imageAlt="AI-generated music visualization"
        overlayText={{
          part1: 'Create',
          part2: 'Your Sound',
        }}
      />
      <ExampleSection />
      <FeaturesSection />
      <PricingSection />
      <CtaSection />
      <Footer />
    </>
  );
}
