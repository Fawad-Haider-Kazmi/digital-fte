"use client";
import { useEffect, useRef, useState } from "react";

export interface GraphNode {
  id: string;
  label: string;
  type: "thought" | "tool" | "result" | "final";
  iteration: number;
}

const C = { thought:"#7c6fff", tool:"#c8ff00", result:"#4a9eff", final:"#ff6b6b" };
const I = { thought:"◆", tool:"⚙", result:"◉", final:"★" };

interface P extends GraphNode { x: number; y: number }

export default function NeuralGraph({ nodes }: { nodes: GraphNode[] }) {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef<number>(0);
  const [pts, setPts] = useState<P[]>([]);
  const [tip, setTip] = useState<{ node: P; x: number; y: number } | null>(null);

  useEffect(() => {
    const W = 300;
    setPts(nodes.map((n, i) => {
      const bx = ({ thought:55, tool:W/2, result:W-55, final:W/2 }[n.type]) ?? W/2;
      const jx = Math.sin(i*2.9+n.type.length)*24;
      return { ...n, x: Math.max(44, Math.min(W-44, bx+jx)), y: 50+i*80 };
    }));
  }, [nodes]);

  useEffect(() => {
    const canvas = cvs.current;
    if (!canvas || !pts.length) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i-1], b = pts[i], col = C[b.type];
        const cpx = (a.x+b.x)/2+Math.sin(t*0.0007+i)*16, cpy = (a.y+b.y)/2;
        const off = -(t*0.035)%13;
        ctx.save();
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.quadraticCurveTo(cpx,cpy,b.x,b.y);
        ctx.strokeStyle=col+"20"; ctx.lineWidth=5; ctx.setLineDash([]); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.quadraticCurveTo(cpx,cpy,b.x,b.y);
        ctx.strokeStyle=col+"55"; ctx.lineWidth=1.5; ctx.setLineDash([5,8]); ctx.lineDashOffset=off; ctx.stroke();
        ctx.restore();
      }
      pts.forEach(n => {
        const col = C[n.type], pulse = 0.6+0.4*Math.sin(t*0.0016+n.iteration*1.2);
        const g = ctx.createRadialGradient(n.x,n.y,3,n.x,n.y,22);
        g.addColorStop(0, col+Math.round(0.38*pulse*255).toString(16).padStart(2,"0")); g.addColorStop(1,"transparent");
        ctx.beginPath(); ctx.arc(n.x,n.y,22,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
      });
      raf.current = requestAnimationFrame(draw);
    };
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [pts]);

  const H = Math.max(300, nodes.length*80+70);

  return (
    <div style={{ position:"relative", width:"100%", height:H }}
      onMouseMove={e => {
        const r = e.currentTarget.getBoundingClientRect();
        const mx=e.clientX-r.left, my=e.clientY-r.top, sc=r.width/300;
        const f = pts.find(n => { const dx=n.x*sc-mx,dy=n.y-my; return Math.sqrt(dx*dx+dy*dy)<20; });
        setTip(f ? {node:f,x:mx,y:my} : null);
      }}
      onMouseLeave={() => setTip(null)}>
      <canvas ref={cvs} width={300} height={H} style={{width:"100%",height:H}} />
      {pts.map(n => (
        <div key={n.id} style={{ position:"absolute", left:`${(n.x/300)*100}%`, top:n.y, transform:"translate(-50%,-50%)", animation:"nodeIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both", pointerEvents:"none", zIndex:2 }}>
          <div style={{ width:34, height:34, borderRadius:"50%", background:C[n.type]+"18", border:`2px solid ${C[n.type]}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, color:C[n.type], backdropFilter:"blur(6px)", boxShadow:`0 0 10px ${C[n.type]}44` }}>{I[n.type]}</div>
        </div>
      ))}
      {tip && (
        <div style={{ position:"absolute", left:tip.x, top:tip.y-44, transform:"translateX(-50%)", background:"#13132a", border:"1px solid #2d2d55", borderRadius:7, padding:"5px 11px", fontSize:10, fontFamily:"'JetBrains Mono',monospace", color:C[tip.node.type], whiteSpace:"nowrap", pointerEvents:"none", zIndex:10, boxShadow:`0 0 16px ${C[tip.node.type]}33` }}>
          {tip.node.label}
        </div>
      )}
    </div>
  );
}