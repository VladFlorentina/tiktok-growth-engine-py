'use client';
import { useState } from 'react';
import { competitorApi } from '@/lib/api';
import { useLanguage } from '@/components/LanguageContext';
import styles from './page.module.css';

const NICHES = ['fitness', 'food', 'beauty', 'fashion', 'tech', 'finance', 'education', 'travel', 'gaming', 'lifestyle'];

interface Insight { strength: string; why_it_worked: string; steal_this: string; }
interface AnalysisResult {
  overall_score: number; insights: Insight[];
  hook_analysis: string; pacing_analysis: string; cta_analysis: string;
  recommended_actions: string[];
}

export default function CompetitorPage() {
  const [videoUrl, setVideoUrl] = useState('');
  const [niche, setNiche] = useState('fitness');
  const [platform, setPlatform] = useState('tiktok');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  const { t, language } = useLanguage();

  const handleAnalyze = async () => {
    if (!videoUrl.trim()) { setError('Please enter a valid TikTok or Instagram URL.'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const data = await competitorApi.analyze({ video_url: videoUrl, competitor_niche: niche, platform, language }) as AnalysisResult;
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Analysis failed. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score: number) => score >= 85 ? '#ff2d55' : score >= 70 ? '#bf5af2' : '#30d158';

  return (
    <div className={`${styles.page} fade-up`}>
      <div className={styles.header}>
        <div className={styles.headerIcon}>🔍</div>
        <div>
          <h1 className={styles.title}>{t('competitor_title')}</h1>
          <p className={styles.subtitle}>{t('competitor_subtitle')}</p>
        </div>
      </div>

      <div className={`card ${styles.formCard}`}>
        <div className="form-group" style={{ marginBottom: 16 }}>
          <label className="label">{t('video_url_label')}</label>
          <input type="text" className="input" placeholder={t('video_url_placeholder')} value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
        </div>
        <div className={styles.formRow}>
          <div className="form-group">
            <label className="label">{t('niche')}</label>
            <select className="select" value={niche} onChange={(e) => setNiche(e.target.value)}>
              {NICHES.map((n) => <option key={n} value={n}>{n.charAt(0).toUpperCase() + n.slice(1)}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="label">{t('platform')}</label>
            <select className="select" value={platform} onChange={(e) => setPlatform(e.target.value)}>
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram</option>
            </select>
          </div>
        </div>
        {error && <div className={styles.errorMsg}>⚠️ {error}</div>}
        <button className={`btn btn-primary ${styles.analyzeBtn}`} onClick={handleAnalyze} disabled={loading}>
          {loading ? <><span className="spinner" />{t('analyzing')}</> : t('analyze_video_btn')}
        </button>
      </div>

      {result && (
        <div className="fade-up">
          {/* Score */}
          <div className={`card ${styles.scoreCard}`}>
            <div className={styles.scoreLeft}>
              <div className={styles.scoreNum} style={{ color: scoreColor(result.overall_score) }}>{result.overall_score}</div>
              <div className={styles.scoreLabel}>{t('score')}</div>
            </div>
            <div className={styles.analyses}>
              {[
                { label: `🎣 ${t('hook_analysis')}`, text: result.hook_analysis },
                { label: `⚡ ${t('pacing_analysis')}`, text: result.pacing_analysis },
                { label: `📣 ${t('cta_analysis')}`, text: result.cta_analysis },
              ].map((a) => (
                <div key={a.label} className={styles.analysisPill}>
                  <span className={styles.analysisLabel}>{a.label}</span>
                  <p className={styles.analysisText}>{a.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <h2 className={styles.sectionTitle}>{t('what_worked')}</h2>
          <div className={styles.insightsList}>
            {result.insights.map((ins, i) => (
              <div key={i} className={`card ${styles.insightCard}`}>
                <div className={styles.insightStrength}>✅ {ins.strength}</div>
                <p className={styles.insightWhy}>💡 {ins.why_it_worked}</p>
                <div className={styles.stealThis}>
                  <span>🎯 {t('steal_this')}</span> {ins.steal_this}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className={`card ${styles.actionsCard}`}>
            <h3 className={styles.actionsTitle}>{t('action_plan')}</h3>
            <ol className={styles.actionsList}>
              {result.recommended_actions.map((a, i) => <li key={i}>{a}</li>)}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
