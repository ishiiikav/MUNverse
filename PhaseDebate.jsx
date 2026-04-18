import { useState, useEffect, useRef } from 'react';
import { callClaude } from './api.js';

const MAX_ROUNDS = 2;

/**
 * PhaseDebate — Diplomatic Duel
 * Turn-based debate: user speaks, then each AI delegate responds in character.
 * After MAX_ROUNDS full rounds, the AI Chair closes the debate.
 *
 * @param {{ sim: object, papers: object, onFinish: (transcript: array) => void }} props
 */
export default function PhaseDebate({ sim, papers, onFinish }) {
  const [transcript, setTranscript] = useState([]);
  const [turnIdx,    setTurnIdx]    = useState(0);
  const [input,      setInput]      = useState('');
  const [loading,    setLoading]    = useState(false);
  const [done,       setDone]       = useState(false);
  const scrollRef = useRef(null);

  // Number of "slots" per round (user + 3 AI delegates)
  const turnSlots = 1 + sim.aiDelegates.length;

  // Auto-scroll speech feed
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  const addSpeech = (spk, txt, type) => {
    setTranscript((prev) => [
      ...prev,
      { spk, txt, type, id: Date.now() + Math.random() },
    ]);
  };

  const deliverSpeech = async () => {
    if (!input.trim()) return;
    const speech = input.trim();
    setInput('');

    // Record user speech
    addSpeech(`${sim.userCountry.flag} ${sim.userCountry.name}`, speech, 'user');
    setLoading(true);

    // Build context from existing transcript
    const ctx = transcript
      .map((t) => `${t.spk}: ${t.txt}`)
      .join('\n');

    // Each AI delegate responds in character
    for (const delegate of sim.aiDelegates) {
      const reply = await callClaude([
        {
          role: 'user',
          content:
            `You are the delegate of ${delegate.country.name} at ${sim.committee.name} ` +
            `discussing "${sim.agenda}". Stance: ${delegate.country.stance}.\n\n` +
            `Previous speeches:\n${ctx}\n\n` +
            `Latest speech by ${sim.userCountry.name}: "${speech}"\n\n` +
            `Deliver a sharp 85-word diplomatic MUN speech. Stay in character. ` +
            `Cite specific points raised by other delegates.`,
        },
      ]);
      addSpeech(`${delegate.country.flag} ${delegate.country.name}`, reply, 'ai');
    }

    const newIdx = turnIdx + 1 + sim.aiDelegates.length;
    setTurnIdx(newIdx);
    setLoading(false);

    // Check if all rounds are complete
    if (Math.floor(newIdx / turnSlots) >= MAX_ROUNDS) {
      const chairRemark = await callClaude([
        {
          role: 'user',
          content:
            `As Chair of ${sim.committee.name}, give a formal 55-word closing remark ` +
            `for the debate on "${sim.agenda}". Acknowledge key positions from all sides. ` +
            `Announce that delegates will now proceed to resolution drafting.`,
        },
      ]);
      addSpeech('⚖️ Chair (AI-2)', chairRemark, 'chair');
      setDone(true);
    }
  };

  const round = Math.min(Math.floor(turnIdx / turnSlots) + 1, MAX_ROUNDS);

  return (
    <div className="fi">
      {/* Header */}
      <div className="ph-header">
        <div className="ph-badge">◈ PHASE 03 ◈</div>
        <h1 className="ph-title">Diplomatic Duel</h1>
        <p className="ph-sub">Structured floor debate — {MAX_ROUNDS} rounds</p>
      </div>

      {/* Status tags */}
      <div className="row mb3" style={{ flexWrap: 'wrap', gap: 8 }}>
        <div className="tag">{sim.committee.icon} {sim.committee.short}</div>
        <div className="tag">Round {round}/{MAX_ROUNDS}</div>
        {!done && (
          <div className="tag" style={{ background: 'rgba(180,95,252,0.14)', borderColor: 'rgba(180,95,252,0.38)', color: 'var(--neon)' }}>
            🎙 Floor Open
          </div>
        )}
        {done && (
          <div className="tag" style={{ background: 'rgba(16,185,129,0.09)', borderColor: 'rgba(16,185,129,0.28)', color: '#10B981' }}>
            ✓ Debate Closed
          </div>
        )}
      </div>

      {/* Speech feed */}
      <div ref={scrollRef} className="sw mb4">
        {transcript.length === 0 && (
          <div style={{ textAlign: 'center', padding: '52px 20px', color: 'var(--txt3)' }}>
            <div style={{ fontSize: 46, marginBottom: 12, opacity: 0.45 }}>🎙️</div>
            <div className="xs" style={{ letterSpacing: '0.14em', marginBottom: 8 }}>THE FLOOR IS OPEN</div>
            <div className="sm c3">You have the first speech. Address the committee.</div>
          </div>
        )}
        {transcript.map((t) => (
          <div key={t.id} className={`sp ${t.type}`}>
            <div
              className="sp-from"
              style={{
                color: t.type === 'user'  ? 'var(--neon)' :
                       t.type === 'chair' ? 'var(--gold)' :
                       'var(--txt3)',
              }}
            >
              <span
                className="sp-dot"
                style={{
                  background: t.type === 'user'  ? 'var(--neon)' :
                              t.type === 'chair' ? 'var(--gold)' :
                              'var(--txt3)',
                }}
              />
              {t.spk}
            </div>
            <div className="sp-txt">{t.txt}</div>
          </div>
        ))}
        {loading && (
          <div className="sp ai">
            <div className="sp-from">
              <span className="sp-dot" style={{ background: 'var(--txt3)' }} />
              AI Delegates responding...
            </div>
            <div className="dots mt1">
              <div className="dot" /><div className="dot" /><div className="dot" />
            </div>
          </div>
        )}
      </div>

      {/* User input area */}
      {!done && !loading && (
        <div className="panel">
          <div className="pi">
            <div className="sl-label">🎙 Your Speech — {sim.userCountry.flag} {sim.userCountry.name}</div>
            <textarea
              className="ta"
              style={{ minHeight: 90 }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Honourable Chair, distinguished delegates... (Ctrl+Enter to deliver)"
              onKeyDown={(e) => { if (e.ctrlKey && e.key === 'Enter') deliverSpeech(); }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
              <span className="xs c3">Ctrl+Enter to submit</span>
              <button className="btn bp" onClick={deliverSpeech} disabled={!input.trim()}>
                ⚡ Deliver Speech
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Debate closed — advance button */}
      {done && (
        <div className="panel fi" style={{ textAlign: 'center' }}>
          <div className="pi" style={{ padding: '30px 24px' }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>⚖️</div>
            <h3 style={{ fontFamily: 'var(--display)', fontSize: 24, marginBottom: 8 }}>Debate Concluded</h3>
            <p className="sm c3 mb4">All proceedings recorded. Advance to resolution drafting.</p>
            <button className="btn bp" onClick={() => onFinish(transcript)}>
              📜 Draft Resolution ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
