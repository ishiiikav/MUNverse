import { PHASES, PHASE_META } from '../data/phases.js';

/**
 * Navbar
 * Sticky top bar with the MUNverse logo and a 6-step phase progress stepper.
 */
export default function Navbar({ phase }) {
  const phaseIdx = PHASES.indexOf(phase);

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo">
        <div className="logo-orb">🌐</div>
        <div>
          <div className="logo-name">MUNVERSE</div>
          <div className="logo-tag">AI Diplomatic Simulator</div>
        </div>
      </div>

      {/* Phase stepper */}
      <div className="stepper">
        {PHASES.map((p, i) => (
          <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {i > 0 && (
              <div className={`st-line${i <= phaseIdx ? ' done' : ''}`} />
            )}
            <div
              className={`st${i < phaseIdx ? ' done' : i === phaseIdx ? ' active' : ' pend'}`}
              title={PHASE_META[p].label}
            >
              {i < phaseIdx ? '✓' : PHASE_META[p].icon}
            </div>
          </div>
        ))}
      </div>

      {/* Current phase label */}
      <div className="xs c3" style={{ letterSpacing: '0.14em' }}>
        {PHASE_META[phase].label}
      </div>
    </nav>
  );
}
