"use client";

import { useEffect, useRef } from "react";

interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
}

interface ConfettiPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
}

export function Confetti({ active, onComplete }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F"];
    const confettiPieces: ConfettiPiece[] = [];

    // Create confetti pieces
    for (let i = 0; i < 100; i++) {
      confettiPieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        vx: Math.random() * 4 - 2,
        vy: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 10 - 5,
      });
    }

    let animationFrame: number;
    let startTime = Date.now();

    function animate() {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      confettiPieces.forEach((piece) => {
        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate((piece.rotation * Math.PI) / 180);
        ctx.fillStyle = piece.color;
        ctx.fillRect(-5, -5, 10, 10);
        ctx.restore();

        piece.x += piece.vx;
        piece.y += piece.vy;
        piece.rotation += piece.rotationSpeed;
        piece.vy += 0.1; // Gravity
      });

      const elapsed = Date.now() - startTime;
      if (elapsed < 3000) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        onComplete?.();
      }
    }

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
    />
  );
}
