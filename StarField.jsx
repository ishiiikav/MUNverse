import { useEffect, useRef } from 'react';

/**
 * StarField
 * Renders 220 twinkling stars on a fixed canvas behind everything.
 * Uses requestAnimationFrame for smooth opacity pulsing.
 */
export default function StarField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let W, H;

    // Generate stars with random positions and twinkle speeds
    const stars = Array.from({ length: 220 }, () => ({
      x:     Math.random(),
      y:     Math.random(),
      r:     Math.random() * 1.4 + 0.2,
      speed: Math.random() * 0.006 + 0.001,
      a:     Math.random(),
      dir:   Math.random() > 0.5 ? 1 : -1,
    }));

    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      for (const star of stars) {
        // Pulse alpha
        star.a += star.speed * star.dir;
        if (star.a > 1 || star.a < 0) star.dir *= -1;

        ctx.beginPath();
        ctx.arc(star.x * W, star.y * H, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196, 181, 253, ${Math.max(0, Math.min(1, star.a))})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas id="star-canvas" ref={canvasRef} />;
}
