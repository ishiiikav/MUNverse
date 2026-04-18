import { useState } from 'react';

import { COUNTRIES }        from './data/countries.js';
import { AI_NAMES, PHASES } from './data/phases.js';

import StarField         from './components/StarField.jsx';
import Navbar            from './components/Navbar.jsx';
import PhaseAssignment   from './components/phases/PhaseAssignment.jsx';
import PhaseResearch     from './components/phases/PhaseResearch.jsx';
import PhaseDebate       from './components/phases/PhaseDebate.jsx';
import PhaseResolution   from './components/phases/PhaseResolution.jsx';
import PhaseEvaluation   from './components/phases/PhaseEvaluation.jsx';
import PhaseResults      from './components/phases/PhaseResults.jsx';

import './styles/global.css';

/**
 * App — Root component and simulation state machine.
 *
 * State flow:
 *   assignment → research → debate → resolution → evaluation → results
 *
 * All simulation data (assigned countries, papers, transcript, resolutions,
 * scores) is lifted here so each phase can read from and write to shared state.
 */
export default function App() {
  // ── Phase routing ──
  const [phase, setPhase] = useState('assignment');

  // ── Shared simulation state ──
  const [sim,         setSim]         = useState(null);   // committee, agenda, timer, countries
  const [papers,      setPapers]      = useState(null);   // position papers (user + AI)
  const [transcript,  setTranscript]  = useState([]);     // debate speeches
  const [resolutions, setResolutions] = useState(null);   // draft resolutions (user + AI)
  const [scores,      setScores]      = useState(null);   // chair evaluation results

  // ── Kick off a new simulation ──
  const handleStart = ({ committee, agenda, timerMinutes }) => {
    // Randomly assign countries — user gets the first one
    const shuffled  = [...COUNTRIES].sort(() => Math.random() - 0.5);
    const [userCountry, ...rest] = shuffled;
    const aiDelegates = rest
      .slice(0, 3)
      .map((country, i) => ({ name: AI_NAMES[i], country }));

    setSim({ committee, agenda, timerMinutes, userCountry, aiDelegates });
    setPhase('research');
  };

  // ── Reset everything back to the start screen ──
  const handleRestart = () => {
    setPhase('assignment');
    setSim(null);
    setPapers(null);
    setTranscript([]);
    setResolutions(null);
    setScores(null);
  };

  return (
    <>
      {/* ── Background layers ── */}
      <StarField />
      <div className="grid-bg" />
      <div className="scan" />

      {/* ── Navigation ── */}
      <Navbar phase={phase} />

      {/* ── Phase content ── */}
      <main className="content">
        {phase === 'assignment' && (
          <PhaseAssignment onStart={handleStart} />
        )}

        {phase === 'research' && sim && (
          <PhaseResearch
            sim={sim}
            onSubmit={(p) => { setPapers(p); setPhase('debate'); }}
          />
        )}

        {phase === 'debate' && sim && papers && (
          <PhaseDebate
            sim={sim}
            papers={papers}
            onFinish={(t) => { setTranscript(t); setPhase('resolution'); }}
          />
        )}

        {phase === 'resolution' && sim && (
          <PhaseResolution
            sim={sim}
            papers={papers}
            transcript={transcript}
            onSubmit={(r) => { setResolutions(r); setPhase('evaluation'); }}
          />
        )}

        {phase === 'evaluation' && sim && papers && resolutions && (
          <PhaseEvaluation
            sim={sim}
            papers={papers}
            transcript={transcript}
            resolutions={resolutions}
            onResults={(s) => { setScores(s); setPhase('results'); }}
          />
        )}

        {phase === 'results' && sim && scores && (
          <PhaseResults
            sim={sim}
            scores={scores}
            onRestart={handleRestart}
          />
        )}
      </main>

      {/* ── Watermark ── */}
      <div className="wm">✦ made and designed by ikki</div>
    </>
  );
}
