"use client";

export default function BotBackground({
  signText = "AUTOMATING YOUR WORKDAY",
}: {
  signText?: string;
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <svg
        viewBox="0 0 900 800"
        style={{
          position: "absolute",
          top: "50%",
          right: "-6%",
          width: "min(72vw, 820px)",
          height: "auto",
          transform: "translateY(-50%)",
          opacity: 0.22,
          animation: "botFloat 7s ease-in-out infinite",
        }}
      >
        <defs>
          <radialGradient id="botGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7c6fff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#7c6fff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ambient glow */}
        <circle cx="420" cy="380" r="320" fill="url(#botGlow)" />

        {/* antenna */}
        <line x1="400" y1="120" x2="400" y2="70" stroke="#7c6fff" strokeWidth="3" />
        <circle cx="400" cy="60" r="10" fill="none" stroke="#c8ff00" strokeWidth="3">
          <animate attributeName="r" values="8;13;8" dur="2.4s" repeatCount="indefinite" />
        </circle>

        {/* head */}
        <rect x="290" y="130" width="220" height="180" rx="28" fill="none" stroke="#7c6fff" strokeWidth="3" />
        <circle cx="355" cy="215" r="16" fill="#4a9eff">
          <animate attributeName="opacity" values="1;0.3;1" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="445" cy="215" r="16" fill="#4a9eff">
          <animate attributeName="opacity" values="1;0.3;1" dur="3s" begin="0.4s" repeatCount="indefinite" />
        </circle>
        <line x1="330" y1="265" x2="470" y2="265" stroke="#7c6fff" strokeWidth="2" opacity="0.6" />
        <line x1="330" y1="278" x2="470" y2="278" stroke="#7c6fff" strokeWidth="2" opacity="0.4" />

        {/* neck */}
        <line x1="400" y1="310" x2="400" y2="345" stroke="#7c6fff" strokeWidth="3" />

        {/* torso */}
        <rect x="255" y="345" width="290" height="260" rx="24" fill="none" stroke="#7c6fff" strokeWidth="3" />

        {/* chest core */}
        <circle cx="400" cy="460" r="46" fill="none" stroke="#c8ff00" strokeWidth="3">
          <animate attributeName="r" values="42;50;42" dur="2.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="400" cy="460" r="14" fill="#c8ff00" opacity="0.8" />

        {[
          [400, 414, 400, 360],
          [400, 506, 400, 570],
          [354, 460, 280, 460],
        ].map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#7c6fff" strokeWidth="2" strokeDasharray="4 6" opacity="0.5">
            <animate attributeName="stroke-dashoffset" values="20;0" dur="1.6s" repeatCount="indefinite" />
          </line>
        ))}

        {/* left arm — relaxed at side */}
        <line x1="255" y1="400" x2="185" y2="450" stroke="#7c6fff" strokeWidth="3" />
        <circle cx="176" cy="456" r="10" fill="none" stroke="#4a9eff" strokeWidth="3" />

        {/* right arm — raised, holding sign pole */}
        <line x1="545" y1="390" x2="625" y2="330" stroke="#7c6fff" strokeWidth="3" />
        <circle cx="636" cy="322" r="10" fill="none" stroke="#4a9eff" strokeWidth="3" />

        {/* legs */}
        <line x1="330" y1="605" x2="320" y2="690" stroke="#7c6fff" strokeWidth="3" />
        <line x1="470" y1="605" x2="480" y2="690" stroke="#7c6fff" strokeWidth="3" />

        {/* orbiting particles around chest */}
        {[0, 120, 240].map((deg, i) => (
          <circle key={i} r="4" fill="#c8ff00" opacity="0.7">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`${deg} 400 460`}
              to={`${deg + 360} 400 460`}
              dur={`${9 + i * 2}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}

        {/* ── SIGNBOARD ── */}
        <g style={{ transformOrigin: "636px 322px" }}>
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="-2 636 322; 2 636 322; -2 636 322"
            dur="4s"
            repeatCount="indefinite"
          />
          {/* pole */}
          <line x1="636" y1="322" x2="655" y2="160" stroke="#7c6fff" strokeWidth="3" />

          {/* board */}
          <rect
            x="500"
            y="60"
            width="310"
            height="105"
            rx="10"
            fill="#0f0f22"
            fillOpacity="0.9"
            stroke="#c8ff00"
            strokeWidth="2.5"
          />
          {/* corner bolts */}
          <circle cx="514" cy="74" r="3.5" fill="#c8ff00" />
          <circle cx="796" cy="74" r="3.5" fill="#c8ff00" />
          <circle cx="514" cy="151" r="3.5" fill="#c8ff00" />
          <circle cx="796" cy="151" r="3.5" fill="#c8ff00" />

          {/* sign text, wrapped across up to 3 lines */}
          <text
            x="655"
            y="102"
            textAnchor="middle"
            fill="#c8ff00"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="18"
            fontWeight="700"
            letterSpacing="0.03em"
          >
            <tspan x="655" dy="0">{signText.split(" ").slice(0, 2).join(" ")}</tspan>
            <tspan x="655" dy="24">{signText.split(" ").slice(2, 5).join(" ")}</tspan>
            <tspan x="655" dy="24">{signText.split(" ").slice(5).join(" ")}</tspan>
          </text>
        </g>
      </svg>
    </div>
  );
}