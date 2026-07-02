"use client";
import { useEffect, useRef } from "react";

export type OrbStatus = "idle" | "thinking" | "working" | "done" | "error";

const CFG: Record<OrbStatus, { color: string; label: string; speed: number }> = {
  idle:     { color: "#3d3870", label: "STANDBY",   speed: 0.0005 },
  thinking: { color: "#7c6fff", label: "REASONING", speed: 0.002  },
  working:  { color: "#c8ff00", label: "EXECUTING", speed: 0.0035 },
  done:     { color: "#4a9eff", label: "COMPLETE",  speed: 0.0008 },
  error:    { color: "#ff6b6b", label: "ERROR",     speed: 0.002  },
};

export default function AgentOrb({ status }: { status: OrbStatus }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height, cx = W/2, cy = H/2, R = 36;
    const { color, speed } = CFG[status];
    const active = status === "thinking" || status === "working";

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      const p = t * speed;

      for (let i = 4; i >= 1; i--) {
        const r = R + i*13 + (active ? Math.sin(p*3+i)*5 : 0);
        const a = active ? (0.06 - i*0.012) * (0.5 + 0.5*Math.sin(p*2)) : 0.025;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2);
        ctx.fillStyle = color + Math.round(a*255).toString(16).padStart(2,"0");
        ctx.fill();
      }

      const g = ctx.createRadialGradient(cx-10, cy-10, 2, cx, cy, R);
      g.addColorStop(0, color+"ff"); g.addColorStop(0.55, color+"cc"); g.addColorStop(1, color+"22");
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI*2); ctx.fillStyle = g; ctx.fill();

      const s = ctx.createRadialGradient(cx-11, cy-11, 1, cx-9, cy-9, 14);
      s.addColorStop(0, "rgba(255,255,255,0.6)"); s.addColorStop(1, "rgba(255,255,255,0)");
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI*2); ctx.fillStyle = s; ctx.fill();

      if (active) {
        const n = status === "working" ? 7 : 5;
        for (let i = 0; i < n; i++) {
          const angle = p*(status==="working"?2.5:1.4) + (i/n)*Math.PI*2;
          const or = R+15+Math.sin(p*2.5+i*1.3)*5;
          ctx.beginPath();
          ctx.arc(cx+Math.cos(angle)*or, cy+Math.sin(angle)*or, 2.2+Math.sin(p*4+i)*0.8, 0, Math.PI*2);
          ctx.fillStyle = color; ctx.fill();
        }
        const rp = (p*0.5)%1;
        ctx.beginPath(); ctx.arc(cx, cy, R+rp*38, 0, Math.PI*2);
        ctx.strokeStyle = color + Math.round((1-rp)*0.35*255).toString(16).padStart(2,"0");
        ctx.lineWidth = 1.5; ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [status]);

  const { color, label } = CFG[status];

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
      <canvas ref={canvasRef} width={120} height={120} />
      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
        <div style={{ width:6, height:6, borderRadius:"50%", background:color, boxShadow:`0 0 8px ${color}`, animation: status!=="idle"?"blink 1.1s ease-in-out infinite":"none" }} />
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, letterSpacing:"0.16em", color }}>{label}</span>
      </div>
    </div>
  );
}