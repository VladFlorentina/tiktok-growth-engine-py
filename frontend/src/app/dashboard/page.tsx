'use client';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { DictKey } from '@/lib/i18n';
import styles from './page.module.css';

const tools: { href: string; icon: string; title: DictKey; desc: DictKey; badge: string }[] = [
  { href: '/dashboard/hooks', icon: '🎣', title: 'nav_hooks', desc: 'desc_hooks', badge: 'badge-pink' },
  { href: '/dashboard/scripts', icon: '🎬', title: 'nav_scripts', desc: 'desc_scripts', badge: 'badge-purple' },
  { href: '/dashboard/trends', icon: '📡', title: 'nav_trends', desc: 'desc_trends', badge: 'badge-green' },
  { href: '/dashboard/competitor', icon: '🔍', title: 'nav_competitor', desc: 'desc_competitor', badge: 'badge-yellow' },
  { href: '/dashboard/ugc', icon: '🤝', title: 'nav_ugc', desc: 'desc_ugc', badge: 'badge-pink' },
];

const recentActivity = [
  { time: '2 min ago', action: 'Generated 5 hooks', topic: 'gym motivation', color: '#ff2d55' },
  { time: '1 hour ago', action: 'Created script', topic: 'healthy meal prep (30s)', color: '#bf5af2' },
  { time: '3 hours ago', action: 'Analyzed trend', topic: '#SmallBusiness on TikTok', color: '#30d158' },
];

export default function DashboardPage() {
  const { t } = useLanguage();

  return (
    <div className={`${styles.page} fade-up`}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('good_morning')}</h1>
          <p className={styles.subtitle}>{t('ai_team_ready')}</p>
        </div>
        <div className={`badge badge-green`} style={{ height: 'fit-content', fontSize: '13px', padding: '6px 14px' }}>
          ● {t('ai_online')}
        </div>
      </div>

      {/* Quick Tools */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('ai_tools')}</h2>
        <div className={styles.toolsGrid}>
          {tools.map((tObj) => (
            <Link key={tObj.href} href={tObj.href} className={`card ${styles.toolCard}`}>
              <div className={styles.toolIcon}>{tObj.icon}</div>
              <div>
                <div className={styles.toolTitle}>{t(tObj.title)}</div>
                <div className={styles.toolDesc}>{t(tObj.desc)}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats row */}
      <section className={styles.section}>
        <div className={styles.statsRow}>
          {[
            { label: t('stats_scripts'), value: '3', icon: '🎬' },
            { label: t('stats_hooks'), value: '15', icon: '🎣' },
            { label: t('stats_trends'), value: '8', icon: '📡' },
          ].map((s) => (
            <div key={s.label} className={`card ${styles.statCard}`}>
              <span className={styles.statIcon}>{s.icon}</span>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('recent_activity')}</h2>
        <div className="card">
          {recentActivity.map((a, i) => (
            <div key={i} className={styles.activityRow} style={{ borderBottom: i < recentActivity.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div className={styles.activityDot} style={{ background: a.color }} />
              <div className={styles.activityContent}>
                <span>{a.action}:</span>
                <span className={styles.activityTopic}> {a.topic}</span>
              </div>
              <span className={styles.activityTime}>{a.time}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
