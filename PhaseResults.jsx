import { COUNTRIES } from '../../data/countries.js';

const AWARD_TITLES = [
  'Best Delegate',
  'Outstanding Delegate',
  'Honorable Mention',
  'Verbal Mention',
];

/**
 * PhaseResults — Final Standings
 * Animated podium for top 3, full leaderboard with per-category breakdown,
 * and restart controls.
 *
 * @param {{ sim: object, scores: array, onRestart: () => void }} props
 */
export default function PhaseResults({ sim, scores, onRestart }) {
  const awardClass = (i) => ['aw-g', 'aw-s', 'aw-b', 'aw-m'][i] ?? 'aw-m';

  const displayName = (s) =>
    s.name === 'You' ? `👤 You — ${sim.userCountry.name}` : s.country;

  const shortName = (s) =>
    (s.name === 'You' ? 'YOU' : s.country).substring(0, 10);

  return (
    <div className="fi">
      {/* Header */}
      <div className="ph-header">
        <div className="ph-badge">◈ SIMULATION COMPLETE ◈</div>
        <h1 className="ph-title">Final Standings</h1>
        <p className="ph-sub">{sim.committee.name} · {sim.agenda}</p>
      </div>

      {/* ── PODIUM ── */}
      <div className="panel mb5">
        <div className="pi" style={{ textAlign: 'center', paddingBottom: 0 }}>
          <div className="xs c3" style={{ letterSpacing: '0.22em', marginBottom: 22 }}>
            CEREMONY PODIUM
          </div>

          <div className="podium-wrap">
            {/* 2nd place */}
            {scores[1] && (
              <div className="p-slot fi1">
                <div className="p-av p2">{scores[1].flag}</div>
                <div className="xs c2 mb1">{shortName(scores[1])}</div>
                <div style={{ fontFamily: 'var(--display)', fontSize: 20, color: '#94A3B8' }}>
                  {scores[1].total}
                </div>
                <div className="p-base p2"><div className="p-rn">2</div></div>
              </div>
            )}

            {/* 1st place */}
            {scores[0] && (
              <div className="p-slot fi">
                <div
                  className="xs"
                  style={{ color: 'var(--gold)', letterSpacing: '0.16em', marginBottom: 8, animation: 'pdot 2s ease-in-out infinite' }}
                >
                  ★ BEST DELEGATE ★
                </div>
                <div className="p-av p1">{scores[0].flag}</div>
                <div className="xs mb1" style={{ color: 'var(--gold)', fontWeight: 700 }}>
                  {shortName(scores[0])}
                </div>
                <div style={{ fontFamily: 'var(--display)', fontSize: 26, color: 'var(--gold)' }}>
                  {scores[0].total}
                </div>
                <div className="p-base p1"><div className="p-rn">1</div></div>
              </div>
            )}

            {/* 3rd place */}
            {scores[2] && (
              <div className="p-slot fi2">
                <div className="p-av p3">{scores[2].flag}</div>
                <div className="xs c2 mb1">{shortName(scores[2])}</div>
                <div style={{ fontFamily: 'var(--display)', fontSize: 20, color: '#B45309' }}>
                  {scores[2].total}
                </div>
                <div className="p-base p3"><div className="p-rn">3</div></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── FULL LEADERBOARD ── */}
      <div className="panel mb5">
        <div className="pi">
          <div className="sl-label">📊 Full Leaderboard</div>

          {scores.map((s, i) => (
            <div
              key={s.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '13px 0',
                borderBottom: i < scores.length - 1 ? '1px solid rgba(124,58,237,0.09)' : 'none',
              }}
            >
              {/* Rank number */}
              <span style={{
                fontFamily: 'var(--display)', fontSize: 20, fontWeight: 700, minWidth: 28,
                color: i === 0 ? 'var(--gold)' : i === 1 ? '#94A3B8' : i === 2 ? '#B45309' : 'var(--txt3)',
              }}>
                {i + 1}
              </span>

              {/* Flag */}
              <span style={{ fontSize: 24 }}>{s.flag}</span>

              {/* Name + award */}
              <div style={{ flex: 1 }}>
                <div className="bold sm">{displayName(s)}</div>
                <div className={`aw mt1 ${awardClass(i)}`} style={{ display: 'inline-flex' }}>
                  {AWARD_TITLES[Math.min(i, 3)]}
                </div>
              </div>

              {/* Per-category scores */}
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                {[
                  { l: 'R', v: s.research },
                  { l: 'D', v: s.debate },
                  { l: 'X', v: s.resolution },
                ].map((col) => (
                  <div key={col.l} style={{ textAlign: 'center', minWidth: 30 }}>
                    <div className="xs c3">{col.l}</div>
                    <div className="bold c2">{col.v}</div>
                  </div>
                ))}

                {/* Total */}
                <div style={{ textAlign: 'center', minWidth: 44, borderLeft: '1px solid var(--border)', paddingLeft: 12 }}>
                  <div className="xs c3">TOTAL</div>
                  <div style={{ fontFamily: 'var(--display)', fontSize: 22, fontWeight: 700, color: 'var(--neon)' }}>
                    {s.total}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RESTART CONTROLS ── */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="btn bs" onClick={onRestart}>↺ New Simulation</button>
        <button className="btn bp" onClick={onRestart}>🌍 Play Again</button>
      </div>
    </div>
  );
}
