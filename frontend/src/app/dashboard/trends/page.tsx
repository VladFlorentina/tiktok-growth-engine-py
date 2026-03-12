'use client';
import { useState, useEffect } from 'react';
import { trendsApi } from '@/lib/api';
import { useLanguage } from '@/components/LanguageContext';
import styles from './page.module.css';

interface Trend {
  id: string; name: string; category: string; platform: string;
  viral_score: number; growth_rate: string; description: string; best_niches: string[];
}

const categoryColors: Record<string, string> = {
  sound: 'badge-pink', hashtag: 'badge-purple', format: 'badge-green', challenge: 'badge-yellow',
};

export default function TrendsPage() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);
  const [platform, setPlatform] = useState('all');
  const [category, setCategory] = useState('all');
  const [region, setRegion] = useState('global');
  const { t } = useLanguage();

  const fetchTrends = async () => {
    setLoading(true);
    try {
      // NOTE: We pass region to the list api
      const data = await trendsApi.list(platform, category, region) as Trend[];
      setTrends(data);
    } catch {
      setTrends([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTrends(); }, [platform, category, region]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#ff2d55';
    if (score >= 75) return '#bf5af2';
    return '#30d158';
  };

  return (
    <div className={`${styles.page} fade-up`}>
      <div className={styles.header}>
        <div className={styles.headerIcon}>📡</div>
        <div>
          <h1 className={styles.title}>{t('trends_title')}</h1>
          <p className={styles.subtitle}>{t('trends_subtitle')}</p>
        </div>
        <button className="btn btn-secondary" onClick={fetchTrends} style={{ marginLeft: 'auto', flexShrink: 0 }}>
          🔄 {t('refresh')}
        </button>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className="form-group">
          <label className="label">{t('platform')}</label>
          <select className="select" value={platform} onChange={(e) => setPlatform(e.target.value)}>
            <option value="all">{t('all_platforms')}</option>
            <option value="tiktok">TikTok</option>
            <option value="instagram">Instagram</option>
          </select>
        </div>
        <div className="form-group">
          <label className="label">{t('category')}</label>
          <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">{t('all_types')}</option>
            <option value="sound">{t('sounds')}</option>
            <option value="hashtag">{t('hashtags')}</option>
            <option value="format">{t('formats')}</option>
          </select>
        </div>
        <div className="form-group">
          <label className="label">{t('region')}</label>
          <select className="select" value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="global">{t('region_global')}</option>
            <option value="North America">{t('region_na')}</option>
            <option value="Western Europe">{t('region_we')}</option>
            <option value="Eastern Europe">{t('region_ee')}</option>
            <option value="Asia">{t('region_asia')}</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingState}>
          <span className="spinner" style={{ width: 32, height: 32 }} />
          <p>{t('scanning_trends')}</p>
        </div>
      ) : (
        <div className={styles.trendsList}>
          {trends.map((trend, i) => (
            <div key={trend.id} className={`card ${styles.trendCard} fade-up fade-up-${Math.min(i + 1, 5)}`}>
              <div className={styles.trendLeft}>
                <div className={styles.trendRank}>#{i + 1}</div>
                <div>
                  <div className={styles.trendName}>{trend.name}</div>
                  <div className={styles.trendDesc}>{trend.description}</div>
                  <div className={styles.trendNiches}>
                    {trend.best_niches.slice(0, 4).map((n) => (
                      <span key={n} className={`badge badge-purple ${styles.nicheBadge}`}>{n}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className={styles.trendRight}>
                <div className={styles.trendBadges}>
                  <span className={`badge ${categoryColors[trend.category] || 'badge-pink'}`}>{trend.category}</span>
                  <span className={`badge badge-purple`}>{trend.platform}</span>
                </div>
                <div className={styles.growthRate} style={{ color: getScoreColor(trend.viral_score) }}>
                  {trend.growth_rate}
                </div>
                <div className={styles.viralScoreWrap}>
                  <div className={styles.viralScoreLabel}>{t('viral_score')}</div>
                  <div className={styles.viralScoreNum} style={{ color: getScoreColor(trend.viral_score) }}>
                    {trend.viral_score}
                  </div>
                  <div className="score-bar-bg" style={{ width: '100px' }}>
                    <div className="score-bar-fill" style={{ width: `${trend.viral_score}%`, background: `linear-gradient(90deg, ${getScoreColor(trend.viral_score)}, ${getScoreColor(trend.viral_score)}aa)` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
