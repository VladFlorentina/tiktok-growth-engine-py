'use client';
import Link from 'next/link';
import styles from './page.module.css';

const features = [
  { icon: '🎣', title: 'AI Hook Generator', desc: 'Stop the scroll with high-retention openings generated in seconds. Get 5 variants per topic.', badge: 'Most Popular' },
  { icon: '🎬', title: 'Viral Script Engine', desc: 'Full 15–60 second scripts with scene-by-scene filming instructions. TikTok-optimized.', badge: 'AI Powered' },
  { icon: '📡', title: 'Trend Radar', desc: 'See exploding TikTok sounds and hashtags before they peak. Beat the algorithm.', badge: 'Real-Time' },
  { icon: '🔍', title: 'Competitor Analysis', desc: 'Understand exactly why competitor videos went viral and steal their winning formula.', badge: 'Data-Driven' },
  { icon: '🤝', title: 'UGC Bridge', desc: 'Connect brands with vetted micro-creators for authentic, high-converting content.', badge: 'New' },
  { icon: '🤖', title: 'Powered by Gemini', desc: 'Google Gemini AI understands TikTok culture, trends, and what makes content viral.', badge: 'Gemini AI' },
];

const stats = [
  { value: '10M+', label: 'Videos analyzed' },
  { value: '340%', label: 'Avg. view increase' },
  { value: '2 sec', label: 'Hook generation time' },
  { value: '50K+', label: 'Creators using it' },
];

export default function Home() {
  return (
    <main className={styles.main}>
      {/* ── Nav ─────────────────────────────────── */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <span className={styles.logo}>⚡ TikGrowth</span>
          <div className={styles.navLinks}>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/dashboard/trends">Trends</Link>
            <Link href="/dashboard/ugc">UGC Bridge</Link>
          </div>
          <div className={styles.navActions}>
            <Link href="/login" className="btn btn-ghost">Sign in</Link>
            <Link href="/dashboard" className="btn btn-primary">Start Free →</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <div className={`badge badge-pink fade-up fade-up-1 ${styles.heroBadge}`}>
            🔥 Powered by Google Gemini AI
          </div>
          <h1 className={`${styles.heroTitle} fade-up fade-up-2`}>
            Dominate TikTok &<br />
            <span className="gradient-text">Instagram</span> with AI
          </h1>
          <p className={`${styles.heroSub} fade-up fade-up-3`}>
            Generate viral scripts, trending hooks, and data-driven strategies in seconds.
            Stop guessing. Start growing.
          </p>
          <div className={`${styles.heroCta} fade-up fade-up-4`}>
            <Link href="/dashboard" className="btn btn-primary" style={{ fontSize: '17px', padding: '14px 32px' }}>
              Launch Dashboard →
            </Link>
            <Link href="/dashboard/hooks" className="btn btn-secondary">
              Try Hook Generator
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────── */}
      <section className={styles.statsSection}>
        <div className="container">
          <div className={styles.statsGrid}>
            {stats.map((s) => (
              <div key={s.label} className={styles.statCard}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────── */}
      <section className={styles.features}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Everything you need to go <span className="gradient-text">viral</span></h2>
          <p className={styles.sectionSub}>AI tools built specifically for TikTok and Instagram growth</p>
          <div className={`${styles.featuresGrid} grid-3`}>
            {features.map((f, i) => (
              <div key={f.title} className={`card fade-up fade-up-${Math.min(i + 1, 5)}`}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <div className={`badge badge-pink ${styles.featureBadge}`}>{f.badge}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────── */}
      <section className={styles.ctaBanner}>
        <div className="container">
          <div className={styles.ctaCard}>
            <h2>Ready to go viral?</h2>
            <p>Join thousands of creators using AI to grow faster than ever.</p>
            <Link href="/dashboard" className="btn btn-primary" style={{ fontSize: '17px', padding: '14px 36px' }}>
              Start for Free →
            </Link>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© 2026 TikGrowth · Built with ⚡ FastAPI + Gemini AI + Next.js</p>
      </footer>
    </main>
  );
}
