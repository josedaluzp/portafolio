'use client';

import { useEffect, useRef } from 'react';

const CHARS = '01アイウエオカキクケコ:;{}[]<>/=+*#@'.split('');
const FONT_SIZE = 14;

export default function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let columns: number;
    let drops: number[];

    function initBg() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(window.innerWidth / FONT_SIZE);
      drops = Array.from({ length: columns }, () => Math.random() * -50);
    }

    function drawBg() {
      if (!canvas || !ctx) return;

      const W = canvas.width;
      const H = canvas.height;

      ctx.fillStyle = 'rgba(3, 3, 6, 0.06)';
      ctx.fillRect(0, 0, W, H);
      ctx.font = `${FONT_SIZE}px monospace`;

      for (let i = 0; i < columns; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * FONT_SIZE;
        const y = drops[i] * FONT_SIZE;

        const brightness = Math.random();
        if (brightness > 0.97) {
          ctx.fillStyle = '#ffffff';
        } else if (brightness > 0.9) {
          ctx.fillStyle = 'rgba(0, 212, 255, 0.9)';
        } else {
          ctx.fillStyle = 'rgba(0, 100, 140, 0.25)';
        }

        ctx.fillText(char, x, y);

        if (y > H && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 0.4 + Math.random() * 0.3;
      }

      animationFrameRef.current = requestAnimationFrame(drawBg);
    }

    initBg();
    animationFrameRef.current = requestAnimationFrame(drawBg);

    function handleResize() {
      initBg();
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        display: 'block',
      }}
    />
  );
}
