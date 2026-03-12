'use client';
import { useState } from 'react';
import { hooksApi } from '@/lib/api';
import { useLanguage } from '@/components/LanguageContext';
import styles from './page.module.css';

const NICHES = ['fitness', 'food', 'beauty', 'fashion', 'tech', 'finance', 'education', 'travel', 'gaming', 'lifestyle'];
const TONES = ['energetic', 'funny', 'emotional', 'educational', 'shocking', 'relatable'];

interface HookVariant {
  id: number; hook: string; style: string; why_it_works: string;
}

export default function HooksPage() {
  const [topic, setTopic] = useState('');
  const [niche, setNiche] = useState('fitness');
  const [tone, setTone] = useState('energetic');
  const [platform, setPlatform] = useState('tiktok');
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ topic: string; variants: HookVariant[] } | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<number | null>(null);
  
  const { t, language } = useLanguage();

  const handleGenerate = async () => {
    if (!topic.trim()) { setError('Please enter a topic first.'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const data = await hooksApi.generate({ topic, niche, tone, platform, count, language }) as { topic: string; variants: HookVariant[] };
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Generation failed. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const copyHook = (hook: string, id: number) => {
    navigator.clipboard.writeText(hook);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const styleColors: Record<string, string> = {
    curiosity_gap: 'badge-pink', shocking_stat: 'badge-yellow',
    bold_claim: 'badge-purple', relatable_pov: 'badge-green', story_teaser: 'badge-pink',
  };

  return (
    <div className={`${styles.page} fade-up`}>
      <div className={styles.header}>
        <div className={styles.headerIcon}>🎣</div>
        <div>
          <h1 className={styles.title}>{t('hooks_title')}</h1>
          <p className={styles.subtitle}>{t('hooks_subtitle')}</p>
        </div>
      </div>

      {/* Form */}
      <div className={`card ${styles.formCard}`}>
        <div className={styles.formGrid}>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="label">{t('topic_label')}</label>
            <input
              className="input"
              placeholder={t('topic_placeholder')}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
          </div>
          <div className="form-group">
            <label className="label">Niche</label>
            <select className="select" value={niche} onChange={(e) => setNiche(e.target.value)}>
              {NICHES.map((n) => <option key={n} value={n}>{n.charAt(0).toUpperCase() + n.slice(1)}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="label">Tone</label>
            <select className="select" value={tone} onChange={(e) => setTone(e.target.value)}>
              {TONES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="label">Platform</label>
            <select className="select" value={platform} onChange={(e) => setPlatform(e.target.value)}>
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram</option>
            </select>
          </div>
          <div className="form-group">
            <label className="label">Variants</label>
            <select className="select" value={count} onChange={(e) => setCount(Number(e.target.value))}>
              {[3, 5, 7, 10].map((n) => <option key={n} value={n}>{n} hooks</option>)}
            </select>
          </div>
        </div>

        {error && <div className={styles.errorMsg}>⚠️ {error}</div>}

        <button
          className={`btn btn-primary ${styles.generateBtn}`}
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? <><span className="spinner" />{t('generating')}</> : `⚡ ${t('generate_hooks_btn')}`}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className={`${styles.results} fade-up`}>
          <h2 className={styles.resultsTitle}>
            {result.variants.length} hooks for <span className="gradient-text">"{result.topic}"</span>
          </h2>
          <div className={styles.hooksList}>
            {result.variants.map((v) => (
              <div key={v.id} className={`card ${styles.hookCard}`}>
                <div className={styles.hookTop}>
                  <span className={`badge ${styleColors[v.style] || 'badge-pink'}`}>
                    {v.style.replace(/_/g, ' ')}
                  </span>
                  <button
                    className={`btn btn-secondary ${styles.copyBtn}`}
                    onClick={() => copyHook(v.hook, v.id)}
                  >
                    {copied === v.id ? '✓ Copied!' : '📋 Copy'}
                  </button>
                </div>
                <p className={styles.hookText}>"{v.hook}"</p>
                <p className={styles.hookWhy}>💡 {v.why_it_works}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
