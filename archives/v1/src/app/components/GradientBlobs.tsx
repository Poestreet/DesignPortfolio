import { useEffect, useRef } from "react";

interface Blob {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

export function GradientBlobs({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blobsRef = useRef<Blob[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = [
      "rgba(139, 92, 246, 0.45)",   // violet
      "rgba(59, 130, 246, 0.4)",    // blue
      "rgba(236, 72, 153, 0.4)",    // pink
      "rgba(16, 185, 129, 0.35)",   // emerald
      "rgba(245, 158, 11, 0.35)",   // amber
      "rgba(99, 102, 241, 0.4)",    // indigo
      "rgba(244, 63, 94, 0.35)",    // rose
    ];

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    blobsRef.current = colors.map((color) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: 150 + Math.random() * 200,
      color,
    }));

    let time = 0;
    const animate = () => {
      time += 0.003;
      const cw = canvas.offsetWidth;
      const ch = canvas.offsetHeight;

      ctx.save();
      ctx.setTransform(2, 0, 0, 2, 0, 0);
      // Transparent background — let the page bg show through
      ctx.clearRect(0, 0, cw, ch);
      ctx.globalCompositeOperation = "source-over";

      blobsRef.current.forEach((blob, i) => {
        // Organic movement with sine waves
        blob.x += blob.vx + Math.sin(time * 1.2 + i * 1.7) * 0.5;
        blob.y += blob.vy + Math.cos(time * 0.9 + i * 2.1) * 0.5;

        // Wrap around edges
        if (blob.x < -blob.radius) blob.x = cw + blob.radius;
        if (blob.x > cw + blob.radius) blob.x = -blob.radius;
        if (blob.y < -blob.radius) blob.y = ch + blob.radius;
        if (blob.y > ch + blob.radius) blob.y = -blob.radius;

        // Pulsing radius
        const r = blob.radius + Math.sin(time * 2 + i) * 30;

        const gradient = ctx.createRadialGradient(
          blob.x,
          blob.y,
          0,
          blob.x,
          blob.y,
          r
        );
        gradient.addColorStop(0, blob.color);
        gradient.addColorStop(0.4, blob.color.replace(/[\d.]+\)$/, "0.15)"));
        gradient.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`block ${className}`}
      style={{ width: "100%", height: "100%" }}
    />
  );
}