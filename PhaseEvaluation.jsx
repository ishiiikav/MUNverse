import { useState, useEffect } from 'react';
import { callClaude } from '../../utils/api.js';

const LOADING_STAGES = [
  'Analysing position papers...',
  'Reviewing debate transcripts...',
  'Evaluating draft resolutions...',
  'Computing final scores...',
];

/**
 * PhaseEvaluation — HQ Scoring
 * AI Chair (AI-2) evaluates all four delegates across three dimensions:
 * Research (30), Debate (30), Resolution (30) = 90 points total.
 * Results are sorted by total score descending.
 *
 * @param {{ sim, papers, transcript, resolutions, onResults }} props
 */
export default function PhaseEvaluation({ sim, papers, transcript, resolutions, onResults }) {
  const [scores,  setScores]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [stage,   setStage]   = useState(LOADING_STAGES[0]);

  useEffect(() => { runEvaluation(); }, []);

  const runEvaluation = async () => {
    // Cycle through loading stage labels while waiting for the API
    let stageIdx = 0;
    const stageInterval = setInterval(() => {
      stageIdx++;
      if (stageIdx < LOADING_STAGES.length) setStage(LOADING_STAGES[stageIdx]);
      else clearInterval(stageInterval);
    }, 2000);

    // Build delegate data for the prompt
    const allDelegates = [
      {
        name:    'You',
        country: sim.userCountry,
        paper:   papers.userPaper,
        res:     resolutions.userDraft,
        isUser:  true,
      },
      ...sim.aiDelegates.map((d) => ({
        name:    d.name,
        country: d.country,
        paper:   papers.aiPapers[d.name] || '',
        res:     resolutions.aiResolutions[d.name] || '',
      })),
    ];

    const debateCtx = transcript
      .slice(-8)
      .map((t) => `${t.spk}: ${t.txt.substring(0, 80)}`)
      .join('\n');

    const delegateInput = allDelegates
      .map(
        (d) =>
          `DELEGATE: ${d.name} (${d.country.name})\n` +
          `Paper: ${(d.paper || '').substring(0, 180)}\n` +
          `Resolution: ${(d.res || '').substring(0, 180)}`
      )
      .join('\n---\n');

    const raw = await callClaude([
      {
        role: 'user',
        content:
          `You are AI Chair (AI-2) of ${sim.committee.name} on "${sim.agenda}". ` +
          `Score these 4 delegates. Give integer scores out of 30 for research, debate, resolution. ` +
          `Make scores varied and realistic — not all similar. ` +
          `Award exactly one each of: "Best Delegate", "Outstanding Delegate", "Honorable Mention", "Verbal Mention". ` +
          `Return ONLY a valid JSON array — no extra text:\n` +
          `[{"name":"...","country":"...","research":N,"debate":N,"resolution":N,"total":N,"feedback":"insightful 18-word sentence","award":"..."}]\n\n` +
          `Delegates:\n${delegateInput}\n\n` +
          `Debate context:\n${debateCtx}`,
      },
    ]);

    clearInterval(stageInterval);

    try {
      const clean   = raw.replace(/```json|```/g, '').trim();
      const parsed  = JSON.parse(clean);

      // Attach flag from sim data
      const enriched = parsed
        .map((p) => {
          if (p.name === 'You') return { ...p, flag: sim.userCountry.flag };
          const delegate = sim.aiDelegates.find((a) => a.name === p.name);
          return { ...p, flag: delegate ? delegate.country.flag : '🌐' };
        })
        .sort((a, b) => b.total - a.total);

      setScores(enriched);
    } catch {
      // Graceful fallback if JSON parsing fails
      const fallback = allDelegates
        .map((d, i) => ({
          name:     d.name,
          country:  d.country.name,
          flag:     d.country.flag,
          research: 18 + Math.floor(Math.random() * 12),
          debate:   17 + Math.floor(Math.random() * 12),
          resolution: 18 + Math.floor(Math.random() * 11),
          total:    0,
          feedback: 'Strong diplomatic performance across all phases.',
          award:    ['Best Delegate', 'Outstanding Delegate', 'Honorable Mention', 'Verbal Mention'][i],
        }))
        .map((d) => ({ ...d, total: d.research + d.debate + d.resolution }))
        .sort((a, b) => b.total - a.total);

      setScores(fallback);
    }

    setLoading(false);
  };

  // ── Helpers ──
  const awardClass = (i) => ['aw-g', 'aw-s', 'aw-b', 'aw-m'][i] ?? 'aw-m';
  const awardIcon  = (i) => ['🥇', '🥈', '🥉', '🎖️'][i] ?? '🎖️';

  // ── Loading state ──
  if (loading) {
    return (
      <div className="fi" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: 54, marginBottom: 18, animation: 'float 2s ease-in-out infinite' }}>🛰️</div>
        <h2 style={{ fontFamily: 'var(--display)', fontSize: 26, marginBottom: 12 }}>HQ is Scoring</h2>
        <div className="dots" style={{ justifyContent: 'center', marginBottom: 16 }}>
          <div className="dot" /><div className="dot" /><div className="dot" />
        </div>
        <div className="xs c3" style={{ letterSpacing: '0.12em' }}>{stage}</div>
      </div>
    );
  }

  // ── Scores ──
  return (
    <div className="fi">
      <div className="ph-header">
        <div className="ph-badge">◈ PHASE 05 ◈</div>
        <h1 className="ph-title">HQ Scoring</h1>
        <p className="ph-sub">AI-2 Chair has evaluated all submissions</p>
      </div>

      {scores.map((s, i) => (
        <div key={s.name} className="panel mb4" style={{ animation: `fadeUp 0.44s ${i * 0.12}s ease both` }}>
          <div className="pi">
            {/* Delegate header */}
            <div className="rowb mb3">
              <div className="row">
                <span style={{
                  fontFamily: 'var(--display)', fontSize: 34, fontWeight: 700, minWidth: 40,
                  background: 'linear-gradient(180deg, var(--neon), var(--vio))',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                  {i + 1}
                </span>
                <span style={{ fontSize: 30 }}>{s.flag}</span>
                <div>
                  <div className="bold" style={{ fontSize: 15 }}>
                    {s.name === 'You' ? `You — ${sim.userCountry.name}` : s.country}
                  </div>
                  <div className={`aw mt1 ${awardClass(i)}`}>{awardIcon(i)} {s.award}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--display)', fontSize: 42, fontWeight: 700, color: 'var(--neon)', lineHeight: 1 }}>
                  {s.total}
                </div>
                <div className="xs c3">/90 PTS</div>
              </div>
            </div>

            {/* Score bars */}
            {[
              { l: '📡 Research',   v: s.research   },
              { l: '⚔️ Debate',     v: s.debate     },
              { l: '📜 Resolution', v: s.resolution },
            ].map((row) => (
              <div key={row.l} className="srow">
                <div className="slabel">{row.l}</div>
                <div className="strack">
                  <div className="sfill" style={{ width: `${(row.v / 30) * 100}%` }} />
                </div>
                <div className="sval">
                  {row.v}<span className="xs c3">/30</span>
                </div>
              </div>
            ))}

            {/* Chair feedback */}
            <div style={{
              marginTop: 14, padding: '10px 14px',
              background: 'rgba(124,58,237,0.07)',
              borderRadius: 8, border: '1px solid rgba(124,58,237,0.14)',
            }}>
              <span className="xs" style={{ color: 'var(--neon)', letterSpacing: '0.14em' }}>CHAIR: </span>
              <span className="sm c3">{s.feedback}</span>
            </div>
          </div>
        </div>
      ))}

      <div style={{ textAlign: 'center' }}>
        <button className="btn bg-" onClick={() => onResults(scores)}>
          🏆 Final Leaderboard ›
        </button>
      </div>
    </div>
  );
}
