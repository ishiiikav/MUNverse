import { useState } from 'react';
import Timer from './Timer.jsx';
import { callClaude } from './api.js';

/**
 * PhaseResearch — Intel Gathering
 * The user writes a position paper within a countdown timer.
 * When time expires, AI delegates auto-generate their papers.
 *
 * @param {{ sim: object, onSubmit: (papers: object) => void }} props
 */
export default function PhaseResearch({ sim, onSubmit }) {
  const [paper,    setPaper]    = useState('');
  const [expired,  setExpired]  = useState(false);
  const [aiPapers, setAiPapers] = useState({});
  const [loading,  setLoading]  = useState(false);

  // Called when the countdown reaches zero
  const handleExpire = async () => {
    setExpired(true);
    setLoading(true);

    const out = {};
    for (const delegate of sim.aiDelegates) {
      const text = await callClaude([
        {
          role: 'user',
          content:
            `Write a concise 180-word MUN position paper for ${delegate.country.name} ` +
            `on "${sim.agenda}" in ${sim.committee.name}. ` +
            `Country stance: ${delegate.country.stance}. ` +
            `Cover: country policy, relevant past UN actions, proposed solutions. ` +
            `Be direct, diplomatic, and formal.`,
        },
      ]);
      out[delegate.name] = text;
    }

    setAiPapers(out);
    setLoading(false);
  };

  return (
    <div className="fi">
      {/* Header */}
      <div className="ph-header">
        <div className="ph-badge">◈ PHASE 02 ◈</div>
        <h1 className="ph-title">Intel Gathering</h1>
        <p className="ph-sub">Draft your country's position paper before time runs out</p>
      </div>

      {/* Delegate info cards */}
      <div className="dg">
        <div className="dc user">
          <div className="d-flag">{sim.userCountry.flag}</div>
          <div>
            <div className="d-role">▶ YOUR DELEGATION</div>
            <div className="d-name">{sim.userCountry.name}</div>
            <div className="d-stance">{sim.userCountry.stance}</div>
          </div>
        </div>
        <div className="psm" style={{ display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center' }}>
          <div className="row">
            <span style={{ fontSize: 16 }}>{sim.committee.icon}</span>
            <span className="bold c2">{sim.committee.name}</span>
          </div>
          <div className="xs c3" style={{ lineHeight: 1.6 }}>{sim.agenda}</div>
          <div className="xpb"><div className="xpf" style={{ width: '33%' }} /></div>
          <div className="xs c3">Phase 2 of 6</div>
        </div>
      </div>

      {/* Paper writing area */}
      <div className="panel mb4">
        <div className="pi">
          <div className="rowb mb3">
            <div>
              <div className="sl-label">📝 Position Paper</div>
              <div className="xs c3">Policy stance · Past UN actions · Proposed solutions</div>
            </div>
            {!expired
              ? <Timer totalSec={sim.timerMinutes * 60} onExpire={handleExpire} />
              : <div className="tag" style={{ background: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.3)', color: '#10B981' }}>✓ SUBMITTED</div>
            }
          </div>
          <textarea
            className="ta"
            value={paper}
            onChange={(e) => setPaper(e.target.value)}
            disabled={expired}
            style={{ minHeight: 180 }}
            placeholder={
              `// POSITION PAPER — ${sim.userCountry.name.toUpperCase()}\n` +
              `// COMMITTEE: ${sim.committee.short} | AGENDA: ${sim.agenda}\n\n` +
              `Country Policy:\n\nPast UN Actions:\n\nProposed Solutions:`
            }
          />
        </div>
      </div>

      {/* AI papers loading */}
      {loading && (
        <div className="panel mb4 fi" style={{ textAlign: 'center', padding: '28px 0' }}>
          <div className="dots" style={{ justifyContent: 'center', marginBottom: 12 }}>
            <div className="dot" /><div className="dot" /><div className="dot" />
          </div>
          <div className="xs c3">AI delegates composing position papers...</div>
        </div>
      )}

      {/* AI papers reveal */}
      {Object.keys(aiPapers).length > 0 && (
        <div className="panel mb4 fi">
          <div className="pi">
            <div className="sl-label">🤖 AI Delegation Papers</div>
            {sim.aiDelegates.map((d) => (
              <div key={d.name} style={{ marginBottom: 18, paddingBottom: 18, borderBottom: '1px solid rgba(124,58,237,0.1)' }}>
                <div className="row mb2">
                  <span style={{ fontSize: 22 }}>{d.country.flag}</span>
                  <span className="bold">{d.country.name}</span>
                  <span className="tag">{d.name}</span>
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--txt3)', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
                  {aiPapers[d.name]}
                </div>
              </div>
            ))}
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <button
                className="btn bp"
                onClick={() => onSubmit({ userPaper: paper || '[No submission]', aiPapers })}
              >
                📨 Submit All Papers to Chair ›
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
