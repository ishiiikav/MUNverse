import { useState, useEffect, useRef } from 'react';

/**
 * Timer
 * Circular SVG countdown ring.
 * Changes colour: violet → amber (60s) → red (30s).
 * Calls onExpire when it reaches zero.
 *
 * @param {{ totalSec: number, onExpire: () => void }} props
 */
export default function Timer({ totalSec, onExpire }) {
  const [left, setLeft] = useState(totalSec);
  const intervalRef = useRef(null);

  useEffect(() => {
    setLeft(totalSec);

    intervalRef.current = setInterval(() => {
      setLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [totalSec]);

  const minutes = Math.floor(left / 60).toString().padStart(2, '0');
  const seconds = (left % 60).toString().padStart(2, '0');

  const pct    = left / totalSec;
  const radius = 40;
  const circ   = 2 * Math.PI * radius;

  const danger  = left < 30;
  const warning = left < 60;
  const colour  = danger ? '#F43F5E' : warning ? '#F59E0B' : 'url(#tg)';
  const glow    = danger
    ? 'drop-shadow(0 0 8px #F43F5E)'
    : 'drop-shadow(0 0 8px #A855F7)';

  return (
    <div className="timer-w">
      <svg className="timer-svg" width="92" height="92" viewBox="0 0 92 92">
        <defs>
          <linearGradient id="tg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#C084FC" />
          </linearGradient>
        </defs>

        {/* Background ring */}
        <circle className="t-bg" cx="46" cy="46" r={radius} />

        {/* Progress arc */}
        <circle
          className="t-track"
          cx="46"
          cy="46"
          r={radius}
          stroke={colour}
          strokeDasharray={`${circ * pct} ${circ}`}
          style={{ filter: glow }}
        />
      </svg>

      <div className="timer-inner">
        <div className="t-num" style={{ color: colour }}>
          {minutes}:{seconds}
        </div>
        <div className="t-lbl">LEFT</div>
      </div>
    </div>
  );
}
