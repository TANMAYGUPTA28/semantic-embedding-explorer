import React, { useEffect, useRef } from 'react';

export default function FlowingBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Organic Sine Wave Flow Field Particles
    const count = 65;
    const particles = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      baseSpeed: 0.25 + Math.random() * 0.35,
      angle: Math.random() * Math.PI * 2,
      radius: 0.8 + Math.random() * 1.6,
      alpha: 0.12 + Math.random() * 0.28,
      seed: i * 0.1
    }));

    let time = 0;

    const render = () => {
      time += 0.008;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Fluid trigonometric field drift
        const flowAngle = Math.sin(p.x * 0.002 + time) * Math.cos(p.y * 0.002 + time) * Math.PI * 2;
        p.x += Math.cos(flowAngle) * p.baseSpeed;
        p.y += Math.sin(flowAngle) * p.baseSpeed + 0.1;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 242, 255, ${p.alpha})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < 16000) { // dist < 126px
            const dist = Math.sqrt(distSq);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.1 * (1 - dist / 126)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="ambient-quantum-canvas" />
      <div className="liquid-mesh-aura aura-cyan" />
      <div className="liquid-mesh-aura aura-violet" />
      <div className="liquid-mesh-aura aura-amber" />
    </>
  );
}
