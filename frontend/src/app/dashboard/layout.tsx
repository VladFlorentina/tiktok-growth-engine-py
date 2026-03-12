'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './layout.module.css';

import { useLanguage } from '@/components/LanguageContext';
import { DictKey } from '@/lib/i18n';

interface NavItem { href: string; icon: string; labelKey: DictKey }

const navItems: NavItem[] = [
  { href: '/dashboard', icon: '🏠', labelKey: 'Dashboard' as unknown as DictKey },
  { href: '/dashboard/hooks', icon: '🎣', labelKey: 'nav_hooks' },
  { href: '/dashboard/scripts', icon: '🎬', labelKey: 'nav_scripts' },
  { href: '/dashboard/trends', icon: '📡', labelKey: 'nav_trends' },
  { href: '/dashboard/competitor', icon: '🔍', labelKey: 'nav_competitor' },
  { href: '/dashboard/ugc', icon: '🤝', labelKey: 'nav_ugc' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className={styles.shell}>
      {/* ── Sidebar ──────────────────────────── */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <Link href="/" className={styles.logo}>⚡ TikGrowth</Link>
          <div className={styles.demoBadge} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="badge badge-green">● Demo Mode</span>
            <button 
              onClick={() => setLanguage(language === 'en' ? 'ro' : 'en')}
              className="badge" 
              style={{ cursor: 'pointer', border: '1px solid var(--border)' }}
            >
              {language === 'en' ? '🇷🇴 RO' : '🇬🇧 EN'}
            </button>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span>{(item.labelKey as string) === 'Dashboard' ? 'Dashboard' : t(item.labelKey)}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarBottom}>
          <div className={styles.planCard}>
            <div className={styles.planName}>Free Plan</div>
            <div className={styles.planUsage}>
              <div className="score-bar-bg" style={{ width: '100%' }}>
                <div className="score-bar-fill" style={{ width: '30%' }} />
              </div>
              <span className={styles.planUsageText}>3 / 10 generations</span>
            </div>
            <Link href="/" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '12px', fontSize: '13px', padding: '10px' }}>
              Upgrade to Pro ✨
            </Link>
          </div>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────── */}
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}
