'use client';
import { useState } from 'react';
import { scriptsApi } from '@/lib/api';
import { useLanguage } from '@/components/LanguageContext';
import styles from './page.module.css';

const NICHES = ['fitness', 'food', 'beauty', 'fashion', 'tech', 'finance', 'education', 'travel', 'gaming', 'lifestyle'];
const DURATIONS = [15, 30, 45, 60];

interface Scene {
  scene_number: number; duration_seconds: number;
  visual_description: string; spoken_text: string; on_screen_text?: string;
}
interface ScriptResult {
  title: string; platform: string; total_duration: number;
  hook: string; scenes: Scene[]; cta: string; filming_tips: string[];
}

export default function ScriptsPage() {
  const [form, setForm] = useState({ topic: '', niche: 'fitness', duration_seconds: 30, platform: 'tiktok', tone: 'energetic', cta: 'Follow for more' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScriptResult | null>(null);
  const [error, setError] = useState('');

  const { t, language } = useLanguage();

  const update = (k: string, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  const handleGenerate = async () => {
    if (!form.topic.trim()) { setError('Please enter a topic.'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const data = await scriptsApi.generate({ ...form, language }) as ScriptResult;
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Generation failed. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.page} fade-up`}>
      <div className={styles.header}>
        <div className={styles.headerIcon}>🎬</div>
        <div>
          <h1 className={styles.title}>{t('scripts_title')}</h1>
          <p className={styles.subtitle}>{t('scripts_subtitle')}</p>
        </div>
      </div>

      <div className={`card ${styles.formCard}`}>
        <div className={styles.formGrid}>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="label">{t('topic_label')}</label>
            <input className="input" placeholder={t('topic_placeholder')} value={form.topic} onChange={(e) => update('topic', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="label">{t('niche')}</label>
            <select className="select" value={form.niche} onChange={(e) => update('niche', e.target.value)}>
              {NICHES.map((n) => <option key={n} value={n}>{n.charAt(0).toUpperCase() + n.slice(1)}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="label">{t('duration_label')}</label>
            <select className="select" value={form.duration_seconds} onChange={(e) => update('duration_seconds', Number(e.target.value))}>
              {DURATIONS.map((d) => <option key={d} value={d}>{d} seconds</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="label">{t('platform')}</label>
            <select className="select" value={form.platform} onChange={(e) => update('platform', e.target.value)}>
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram Reels</option>
            </select>
          </div>
          <div className="form-group">
            <label className="label">{t('tone_label')}</label>
            <select className="select" value={form.tone} onChange={(e) => update('tone', e.target.value)}>
              {['energetic', 'funny', 'emotional', 'educational', 'chill'].map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="label">{t('cta_label')}</label>
            <input className="input" placeholder={t('cta_placeholder')} value={form.cta} onChange={(e) => update('cta', e.target.value)} />
          </div>
        </div>
        {error && <div className={styles.errorMsg}>⚠️ {error}</div>}
        <button className={`btn btn-primary ${styles.generateBtn}`} onClick={handleGenerate} disabled={loading}>
          {loading ? <><span className="spinner" />{t('generating')}</> : t('generate_script_btn')}
        </button>
      </div>

      {result && (
        <div className={`fade-up`}>
          <div className={styles.scriptHeader}>
            <div>
              <h2 className={styles.scriptTitle}>{result.title}</h2>
              <div className={styles.scriptMeta}>
                <span className="badge badge-pink">{result.platform}</span>
                <span className="badge badge-purple">{result.total_duration}s</span>
                <span className="badge badge-green">{result.scenes.length} scenes</span>
              </div>
            </div>
          </div>

          <div className={`card ${styles.hookCard}`}>
            <label className="label">Opening Hook</label>
            <p className={styles.hookText}>"{result.hook}"</p>
          </div>

          <div className={styles.scenes}>
            {result.scenes.map((scene) => (
              <div key={scene.scene_number} className={`card ${styles.sceneCard}`}>
                <div className={styles.sceneNum}>{t('scene')} {scene.scene_number} · {scene.duration_seconds}s</div>
                <div className={styles.sceneGrid}>
                  <div>
                    <div className={styles.sceneLabel}>🎥 {t('visual')}</div>
                    <p>{scene.visual_description}</p>
                  </div>
                  <div>
                    <div className={styles.sceneLabel}>🎙️ {t('say')}</div>
                    <p className={styles.spokenText}>"{scene.spoken_text}"</p>
                  </div>
                  {scene.on_screen_text && (
                    <div style={{ gridColumn: '1 / -1' }}>
                      <div className={styles.sceneLabel}>📝 On-screen text</div>
                      <span className="badge badge-yellow">{scene.on_screen_text}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className={`card ${styles.cta}`}>
            <label className="label">Call to Action</label>
            <p className={styles.ctaText}>"{result.cta}"</p>
          </div>

          {result.filming_tips.length > 0 && (
            <div className={`card ${styles.tips}`}>
              <label className="label">📷 {t('filming_tips')}</label>
              <ul className={styles.tipsList}>
                {result.filming_tips.map((tip, i) => <li key={i}>{tip}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
