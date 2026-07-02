import Link from "next/link";
import BotBackground from "@/components/BotBackground";

export const metadata = {
  title: "Digital FTE",
  description: "Autonomous AI Agent",
};

export default function Landing() {
  return (
    <main
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <BotBackground signText="POSTS · EMAILS RESEARCH · SUMMARIES ON DEMAND" />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 640, padding: "0 24px", margin: "0 auto" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 11,
            color: "#8888b0",
            letterSpacing: "0.14em",
            border: "1px solid #2d2d55",
            borderRadius: 999,
            padding: "5px 14px",
            marginBottom: 28,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#c8ff00",
              boxShadow: "0 0 8px #c8ff00",
              animation: "blink 1.4s ease-in-out infinite",
            }}
          />
          AGENT ONLINE
        </div>

        <h1
          style={{
            fontFamily: "'Chakra Petch', sans-serif",
            fontSize: "clamp(38px, 6vw, 64px)",
            fontWeight: 600,
            lineHeight: 1.08,
            margin: "0 0 20px",
            letterSpacing: "-0.01em",
          }}
        >
          Hire your first
          <br />
          <span style={{ color: "#7c6fff" }}>Digital&nbsp;FTE.</span>
        </h1>

        <p style={{ fontSize: 15, lineHeight: 1.7, color: "#a8a8c8", maxWidth: 460, margin: "0 0 36px" }}>
          Give it a task in plain language. It reasons through the problem, picks the right
          tool, executes, and hands you a finished result — no back-and-forth, no
          micromanagement, no onboarding.
        </p>

        <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <Link
            href="/agent"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "13px 26px",
              background: "#7c6fff",
              color: "#fff",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.03em",
              textDecoration: "none",
            }}
          >
            ▶ LAUNCH AGENT
          </Link>
          <span style={{ fontSize: 11, color: "#5a5a80" }}>writes posts, drafts emails, researches, and more</span>
        </div>

        <div style={{ display: "flex", gap: 28, marginTop: 56 }}>
          {[
            ["8", "max reasoning steps"],
            ["6", "built-in tools"],
            ["24/7", "always on shift"],
          ].map(([n, label]) => (
            <div key={label}>
              <div style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: 24, fontWeight: 600, color: "#e4e4f0" }}>
                {n}
              </div>
              <div style={{ fontSize: 10.5, color: "#5a5a80", letterSpacing: "0.05em" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}