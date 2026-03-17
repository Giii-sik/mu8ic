'use client';

import { MinimalistHero } from '@/components/ui/minimalist-hero';

export default function Home() {
  const navLinks = [
    { label: 'HOW IT WORKS', href: '#' },
    { label: 'PRICING', href: '#' },
    { label: 'ABOUT', href: '#' },
  ];

  return (
    <MinimalistHero
      logoText="mu8ic."
      navLinks={navLinks}
      mainText="Generate royalty-free music for your YouTube videos in seconds. Powered by AI, crafted for creators."
      readMoreLink="#"
      imageSrc="https://ik.imagekit.io/fpxbgsota/image%2013.png?updatedAt=1753531863793"
      imageAlt="AI-generated music visualization"
      overlayText={{
        part1: 'Create',
        part2: 'Your Sound',
      }}
    />
  );
}
