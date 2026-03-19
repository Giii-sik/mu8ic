import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy — mu8ic',
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-10">
    <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/40">
      {title}
    </h2>
    <div className="space-y-3 text-sm leading-relaxed text-white/60">
      {children}
    </div>
  </section>
);

export default function PrivacyPage() {
  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: '#181818' }}>
      {/* Header */}
      <header className="fixed top-0 left-0 z-50 flex w-full items-center justify-between border-b px-8 py-4"
        style={{ borderColor: 'rgba(255,255,255,0.06)', backgroundColor: 'rgba(24,24,24,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
      >
        <Link
          href="/"
          className="text-base font-bold tracking-wider text-white/90 transition-opacity hover:opacity-70"
          style={{ fontFamily: 'var(--font-schoolbell)' }}
        >
          mu8ic
        </Link>
        <Link
          href="/"
          className="text-xs text-white/30 transition-colors hover:text-white/60"
        >
          ← Back
        </Link>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-2xl px-6 pb-24 pt-28">
        <div className="mb-12">
          <h1 className="text-2xl font-bold text-white/90">Privacy Policy</h1>
          <p className="mt-2 text-xs text-white/25">Effective date: March 19, 2026</p>
        </div>

        <Section title="Overview">
          <p>
            mu8ic ("we", "our", or "us") operates the AI music generation service available at mu8ic. This Privacy Policy explains how we collect, use, and protect your information when you use our service.
          </p>
          <p>
            By using mu8ic, you agree to the collection and use of information in accordance with this policy.
          </p>
        </Section>

        <Section title="Information We Collect">
          <p>
            <span className="text-white/80">Account information.</span> When you sign in with Google, we receive your name, email address, and profile picture from Google OAuth. We store your email address and account details in our database to manage your account and credits.
          </p>
          <p>
            <span className="text-white/80">Generated content.</span> Music files you generate are stored in our cloud storage (Supabase Storage) and associated with your account. The text prompts you enter are stored alongside the generated music for your library.
          </p>
          <p>
            <span className="text-white/80">Payment information.</span> Payments are processed by Polar. We do not store your credit card details. We receive and store transaction records including the amount paid and credits allocated.
          </p>
          <p>
            <span className="text-white/80">Usage data.</span> We collect basic usage information such as generation requests and credit consumption to operate and improve the service.
          </p>
        </Section>

        <Section title="How We Use Your Information">
          <p>We use the information we collect to:</p>
          <ul className="ml-4 space-y-2 list-disc list-outside marker:text-white/20">
            <li>Provide and maintain the music generation service</li>
            <li>Manage your account, credit balance, and payment history</li>
            <li>Store and serve your generated music files</li>
            <li>Communicate important service updates or account notices</li>
            <li>Detect and prevent fraud or misuse of the service</li>
          </ul>
          <p>We do not sell your personal information to third parties.</p>
        </Section>

        <Section title="Third-Party Services">
          <p>We use the following third-party services to operate mu8ic:</p>
          <ul className="ml-4 space-y-2 list-disc list-outside marker:text-white/20">
            <li><span className="text-white/80">Google OAuth</span> — for authentication</li>
            <li><span className="text-white/80">Supabase</span> — for database and file storage</li>
            <li><span className="text-white/80">Replicate</span> — for AI music generation (your prompts are sent to Replicate's servers)</li>
            <li><span className="text-white/80">Polar</span> — for payment processing</li>
          </ul>
          <p>
            Each of these services has their own privacy policies. We encourage you to review them.
          </p>
        </Section>

        <Section title="Data Retention">
          <p>
            We retain your account information and generated music for as long as your account is active. You may delete individual tracks at any time from within the workspace.
          </p>
          <p>
            If you wish to delete your account and all associated data, please contact us. We will process your request within 30 days.
          </p>
        </Section>

        <Section title="Security">
          <p>
            We implement industry-standard security measures including row-level security on our database, encrypted connections (HTTPS), and secure token-based authentication. However, no method of transmission over the internet is 100% secure.
          </p>
        </Section>

        <Section title="Children's Privacy">
          <p>
            mu8ic is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately.
          </p>
        </Section>

        <Section title="Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page with an updated effective date. Continued use of the service after changes constitutes your acceptance of the updated policy.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            If you have any questions about this Privacy Policy, please contact us at{' '}
            <a
              href="mailto:privacy@mu8ic.app"
              className="text-white/50 underline decoration-dotted hover:text-white/80 transition-colors"
            >
              privacy@mu8ic.app
            </a>
            .
          </p>
        </Section>

        <div className="mt-16 border-t pt-8 text-xs text-white/20" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between">
            <span style={{ fontFamily: 'var(--font-schoolbell)' }}>mu8ic</span>
            <div className="flex gap-4">
              <Link href="/terms" className="hover:text-white/40 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
