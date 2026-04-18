import { useState } from 'react';
import Timer from '../Timer.jsx';
import { callClaude } from '../../utils/api.js';

/**
 * PhaseResolution — Draft Protocol
 * The user drafts a formal resolution within a countdown timer.
 * On expiry, AI delegates generate their own resolutions using debate context.
 *
 * @param {{ sim: object, papers: object, transcript: array, onSubmit: (resolutions: object) => void }} props
 */
export default function PhaseResolution({ sim, papers, transcript, onSubmit }) {
  const [draft,   setDraft]   = useState('');
  const [expired, setExpired] = useState(false);
  const [aiRes,   setAiRes]   = useState({});
  const [loading, setLoading] = useState(false);

  const handleExpire = async () => {
    setExpired(true);
    setLoading(true);

    // Use the last 6 speeches as debate context for AI resolution generation
    const snippet = transcript
      .slice(-6)
      .map((t) => `${t.spk}: ${t.txt.substring(0, 100)}`)
      .join('\n');

    const out = {};
    for (const delegate of sim.aiDelegates) {
      const text = await callClaude([
        {
          role: 'user',
          content:
            `Write a 150-word formal MUN draft resolution for ${delegate.country.name} ` +
            `on "${sim.agenda}" in ${sim.committee.name}. ` +
            `Country stance: ${delegate.country.stance}. ` +
            `Reference these debate highlights:\n${snippet}\n\n` +
            `Include 3 preambulatory clauses (Recognizing/Noting/Affirming) ` +
            `and 3 operative clauses (Calls upon/Urges/Recommends). Formal UN style.`,
        },
      ]);
      out[delegate.name] = text;
    }

    setAiRes(out);
    setLoading(false);
  };

  return (
    <div className="fi">
      {/* Header */}
      <div className="ph-header">
        <div className="ph-badge">◈ PHASE 04 ◈</div>
        <h1 className="ph-title">Draft Protocol</h1>
        <p className="ph-sub">Craft your resolution before the window closes</p>
      </div>

      {/* Draft textarea */}
      <div className="panel mb4">
        <div className="pi">
          <div className="rowb mb3">
            <div>
              <div className="sl-label">📜 Resolution Draft — {sim.userCountry.flag} {sim.userCountry.name}</div>
              <div className="xs c3">Preambulatory · Operative clauses · Justified positions</div>
            </div>
            {!expired
              ? <Timer totalSec={sim.timerMinutes * 60} onExpire={handleExpire} />
              : (
                <div className="tag" style={{ background: 'rgba(16,185,129,0.09)', borderColor: 'rgba(16,185,129,0.28)', color: '#10B981' }}>
                  ✓ FILED
                </div>
              )
            }
          </div>
          <textarea
            className="ta"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            disabled={expired}
            style={{ minHeight: 200 }}
            placeholder={
              `DRAFT RESOLUTION — ${sim.committee.short}\n` +
              `AGENDA: ${sim.agenda}\n` +
              `SPONSOR: ${sim.userCountry.name.toUpperCase()}\n\n` +
              `PREAMBULATORY:\n` +
              `Recognizing that...\n` +
              `Noting with concern...\n` +
              `Affirming...\n\n` +
              `OPERATIVE:\n` +
              `1. Calls upon...\n` +
              `2. Urges...\n` +
              `3. Recommends...`
            }
          />
        </div>
      </div>

      {/* AI resolutions loading */}
      {loading && (
        <div className="panel mb4 fi" style={{ textAlign: 'center', padding: '28px 0' }}>
          <div className="dots" style={{ justifyContent: 'center', marginBottom: 12 }}>
            <div className="dot" /><div className="dot" /><div className="dot" />
          </div>
          <div className="xs c3">AI delegates filing resolutions...</div>
        </div>
      )}

      {/* AI resolutions reveal */}
      {Object.keys(aiRes).length > 0 && (
        <div className="panel mb4 fi">
          <div className="pi">
            <div className="sl-label">📜 AI Draft Resolutions</div>
            {sim.aiDelegates.map((d) => (
              <div key={d.name} style={{ marginBottom: 18, paddingBottom: 18, borderBottom: '1px solid rgba(124,58,237,0.1)' }}>
                <div className="row mb2">
                  <span style={{ fontSize: 22 }}>{d.country.flag}</span>
                  <span className="bold">{d.country.name}</span>
                  <span className="tag">{d.name}</span>
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--txt3)', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
                  {aiRes[d.name]}
                </div>
              </div>
            ))}
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <button
                className="btn bp"
                onClick={() => onSubmit({ userDraft: draft || '[No submission]', aiResolutions: aiRes })}
              >
                ⚖️ Submit to Chair for Scoring ›
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
