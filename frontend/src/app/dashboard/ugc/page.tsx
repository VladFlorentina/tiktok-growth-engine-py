'use client';
import { useState, useEffect } from 'react';
import { ugcApi } from '@/lib/api';
import styles from './page.module.css';

interface Creator {
  id: string; name: string; niche: string; platform: string;
  follower_count: number; avg_views: number; rate_per_video: number;
  contact_email: string; bio?: string;
}

const NICHES = ['all', 'fitness', 'food', 'beauty', 'fashion', 'tech', 'finance', 'education', 'travel', 'gaming', 'lifestyle'];

const formatNum = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

export default function UGCPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [niche, setNiche] = useState('all');
  const [platform, setPlatform] = useState('all');

  const fetchCreators = async () => {
    setLoading(true);
    try {
      const data = await ugcApi.listCreators(niche, platform) as Creator[];
      setCreators(data);
    } catch { setCreators([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCreators(); }, [niche, platform]);

  return (
    <div className={`${styles.page} fade-up`}>
      <div className={styles.header}>
        <div className={styles.headerIcon}>🤝</div>
        <div>
          <h1 className={styles.title}>UGC Bridge</h1>
          <p className={styles.subtitle}>Connect with vetted micro-creators for authentic, high-converting content</p>
        </div>
      </div>

      <div className={styles.filters}>
        <div className="form-group">
          <label className="label">Niche</label>
          <select className="select" value={niche} onChange={(e) => setNiche(e.target.value)}>
            {NICHES.map((n) => <option key={n} value={n}>{n === 'all' ? 'All Niches' : n.charAt(0).toUpperCase() + n.slice(1)}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="label">Platform</label>
          <select className="select" value={platform} onChange={(e) => setPlatform(e.target.value)}>
            <option value="all">All Platforms</option>
            <option value="tiktok">TikTok</option>
            <option value="instagram">Instagram</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingState}>
          <span className="spinner" style={{ width: 32, height: 32 }} />
          <p>Loading creators...</p>
        </div>
      ) : (
        <div className={styles.creatorGrid}>
          {creators.map((c, i) => (
            <div key={c.id} className={`card ${styles.creatorCard} fade-up fade-up-${Math.min(i + 1, 5)}`}>
              <div className={styles.avatar}>{c.name.charAt(0)}</div>
              <div className={styles.creatorInfo}>
                <div className={styles.creatorName}>{c.name}</div>
                <div className={styles.creatorMeta}>
                  <span className="badge badge-pink">{c.niche}</span>
                  <span className="badge badge-purple">{c.platform}</span>
                </div>
                {c.bio && <p className={styles.creatorBio}>{c.bio}</p>}
              </div>
              <div className={styles.stats}>
                <div className={styles.statItem}>
                  <div className={styles.statVal}>{formatNum(c.follower_count)}</div>
                  <div className={styles.statLab}>Followers</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statVal}>{formatNum(c.avg_views)}</div>
                  <div className={styles.statLab}>Avg Views</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statVal}>${c.rate_per_video}</div>
                  <div className={styles.statLab}>Per Video</div>
                </div>
              </div>
              <a
                href={`mailto:${c.contact_email}`}
                className={`btn btn-primary ${styles.contactBtn}`}
              >
                Contact →
              </a>
            </div>
          ))}
        </div>
      )}

      {!loading && creators.length === 0 && (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🔍</div>
          <p>No creators found for the selected filters.</p>
        </div>
      )}
    </div>
  );
}
