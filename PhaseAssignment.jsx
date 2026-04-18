import { useState } from 'react';
import { COMMITTEES, AGENDA } from '../../data/committees.js';

/**
 * PhaseAssignment — Mission Briefing
 * Lets the user pick a committee, agenda topic, and timer duration
 * before launching the simulation.
 *
 * @param {{ onStart: (config: object) => void }} props
 */
export default function PhaseAssignment({ onStart }) {
  const [committee, setCommittee] = useState(null);
  const [agenda,    setAgenda]    = useState('');
  const [mins,      setMins]      = useState(10);

  const randomize = () => {
    const c = COMMITTEES[Math.floor(Math.random() * COMMITTEES.length)];
    const topics = AGENDA[c.id];
    setCommittee(c);
    setAgenda(topics[Math.floor(Math.random() * topics.length)]);
  };

  const handleStart = () => {
    onStart({ committee, agenda, timerMinutes: mins });
  };

  return (
    <div className="fi">
      {/* Header */}
      <div className="ph-header">
        <div className="ph-badge">◈ MISSION CONTROL ◈</div>
        <h1 className="ph-title">Mission Briefing</h1>
        <p className="ph-sub">Configure your diplomatic simulation parameters</p>
      </div>

      {/* Committee selector */}
      <div className="panel mb4">
        <div className="pi">
          <div className="sl-label">🏛 Select Committee</div>
          <div className="cg">
            {COMMITTEES.map((c) => (
              <button
                key={c.id}
                className={`cb${committee?.id === c.id ? ' sel' : ''}`}
                onClick={() => { setCommittee(c); setAgenda(''); }}
              >
                <div className="cb-icon">{c.icon}</div>
                <div className="cb-name">{c.short}</div>
                <div className="cb-full">{c.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Agenda topic selector — only shown after committee is chosen */}
      {committee && (
        <div className="panel mb4 fi">
          <div className="pi">
            <div className="sl-label">📡 Agenda Topic</div>
            <select
              className="sl"
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
            >
              <option value="">— SELECT AGENDA TOPIC —</option>
              {AGENDA[committee.id].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Timer slider */}
      <div className="panel mb4">
        <div className="pi">
          <div className="sl-label">⏱ Phase Timer</div>
          <div className="rowb mb2">
            <span className="xs c3">Research &amp; Resolution duration</span>
            <span style={{ fontFamily: 'var(--display)', fontSize: 26, color: 'var(--neon)', fontWeight: 700 }}>
              {mins}
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--txt3)', marginLeft: 4 }}>MIN</span>
            </span>
          </div>
          <input
            type="range"
            min={5}
            max={45}
            value={mins}
            onChange={(e) => setMins(Number(e.target.value))}
          />
          <div className="rowb mt1">
            <span className="xs c3">5 min</span>
            <span className="xs c3">45 min</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="btn bs" onClick={randomize}>
          🎲 Randomize Config
        </button>
        <button
          className="btn bp"
          disabled={!committee || !agenda}
          onClick={handleStart}
        >
          🚀 Launch Simulation
        </button>
      </div>
    </div>
  );
}
