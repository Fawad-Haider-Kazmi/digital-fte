"use client";
import { useState, useRef } from "react";
import AgentOrb, { OrbStatus } from "@/components/AgentOrb";
import NeuralGraph, { GraphNode } from "@/components/NeuralGraph";

interface Log {
  type: "thought" | "tool" | "result" | "error";
  text: string;
}

const EXAMPLE_TASKS = [
  {
    label: "LinkedIn post",
    task: "Write a LinkedIn post announcing our startup just closed a $2M seed round, tone should be professional and inspirational",
  },
  {
    label: "Product tweet",
    task: "Generate a witty Twitter post launching our new AI-powered coffee maker",
  },
  {
    label: "Follow-up email",
    task: "Draft a friendly follow-up email to a client named Sarah about a delayed project deadline",
  },
  {
    label: "Summarize article",
    task: "Summarize this text into 4 bullet points: Remote work has fundamentally changed how companies think about productivity. Studies show hybrid teams report higher satisfaction but face challenges with communication and culture-building. Leaders are now investing more in async tools and intentional in-person gatherings.",
  },
  {
    label: "Sentiment check",
    task: "Analyze the sentiment of this customer review: 'The product works fine but shipping took way too long and support never replied to my email.'",
  },
  {
    label: "Market research",
    task: "Research the current state of the electric vehicle charging infrastructure market",
  },
];

export default function Home() {
  const [task, setTask] = useState("");
  const [status, setStatus] = useState<OrbStatus>("idle");
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [answer, setAnswer] = useState("");
  const [copied, setCopied] = useState(false);
  const idCounter = useRef(0);

  const runAgent = async (overrideTask?: string) => {
    const activeTask = overrideTask ?? task;
    if (!activeTask.trim()) return;

    setTask(activeTask);
    setStatus("thinking");
    setNodes([]);
    setLogs([]);
    setAnswer("");
    setCopied(false);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task: activeTask }),
    });

    if (!res.body) {
      setStatus("error");
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const chunks = buffer.split("\n\n");
      buffer = chunks.pop() ?? "";

      for (const chunk of chunks) {
        if (!chunk.startsWith("data: ")) continue;
        const { event, data } = JSON.parse(chunk.slice(6));

        if (event === "thought") {
          setStatus("thinking");
          setNodes((n) => [...n, { id: `t${idCounter.current++}`, label: data.text.slice(0, 40), type: "thought", iteration: data.i }]);
          setLogs((l) => [...l, { type: "thought", text: data.text }]);
        }
        if (event === "tool_start") {
          setStatus("working");
          setNodes((n) => [...n, { id: `tool${idCounter.current++}`, label: data.name, type: "tool", iteration: data.i }]);
          setLogs((l) => [...l, { type: "tool", text: `Calling ${data.name}(${Object.values(data.input).map(String).join(", ").slice(0, 60)})` }]);
        }
        if (event === "tool_result") {
          setNodes((n) => [...n, { id: `r${idCounter.current++}`, label: `${data.name} done`, type: "result", iteration: data.i }]);
          setLogs((l) => [...l, { type: "result", text: `${data.name} → done` }]);
        }
        if (event === "final") {
          setStatus("done");
          setAnswer(data.answer);
          setNodes((n) => [...n, { id: `f${idCounter.current++}`, label: "Final Answer", type: "final", iteration: data.iterations }]);
        }
        if (event === "error") {
          setStatus("error");
          setLogs((l) => [...l, { type: "error", text: data.message }]);
        }
      }
    }
  };

  const copyAnswer = () => {
    navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const busy = status === "thinking" || status === "working";

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 4 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: "0.02em" }}>
          DIGITAL <span style={{ color: "#7c6fff" }}>FTE</span>
        </h1>
        <span style={{ fontSize: 11, color: "#5a5a80", letterSpacing: "0.1em" }}>v1.0 · AUTONOMOUS AGENT</span>
      </div>
      <p style={{ fontSize: 13, color: "#8888b0", margin: "0 0 32px", maxWidth: 560 }}>
        Give it a task in plain language. It reasons, picks a tool, executes, and delivers a finished result — no back-and-forth required.
      </p>

      <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* Left column */}
        <div style={{ flex: "1 1 480px", minWidth: 320 }}>
          <textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Describe a task for your Digital FTE..."
            rows={4}
            style={{
              width: "100%",
              background: "#13132a",
              color: "#e4e4f0",
              border: "1px solid #2d2d55",
              borderRadius: 10,
              padding: 14,
              fontFamily: "inherit",
              fontSize: 13,
              resize: "vertical",
            }}
          />

          <div style={{ display: "flex", gap: 10, marginTop: 12, alignItems: "center" }}>
            <button
              onClick={() => runAgent()}
              disabled={busy}
              style={{
                padding: "10px 22px",
                background: busy ? "#3d3870" : "#7c6fff",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: busy ? "default" : "pointer",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.03em",
                transition: "background 0.15s",
              }}
            >
              {busy ? "RUNNING..." : "▶ RUN AGENT"}
            </button>
            {status === "error" && (
              <span style={{ color: "#ff6b6b", fontSize: 12 }}>Something went wrong — check the backend logs.</span>
            )}
          </div>

          {/* Example task chips */}
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 10, color: "#5a5a80", letterSpacing: "0.12em", marginBottom: 8 }}>
              TRY AN EXAMPLE
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {EXAMPLE_TASKS.map((ex) => (
                <button
                  key={ex.label}
                  onClick={() => runAgent(ex.task)}
                  disabled={busy}
                  style={{
                    padding: "6px 12px",
                    background: "#13132a",
                    border: "1px solid #2d2d55",
                    borderRadius: 999,
                    color: "#a8a8d0",
                    fontSize: 11,
                    cursor: busy ? "default" : "pointer",
                    opacity: busy ? 0.5 : 1,
                  }}
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>

          {/* Activity log */}
          {logs.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 10, color: "#5a5a80", letterSpacing: "0.12em", marginBottom: 8 }}>
                ACTIVITY LOG
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 220, overflowY: "auto" }}>
                {logs.map((log, i) => {
                  const color = { thought: "#7c6fff", tool: "#c8ff00", result: "#4a9eff", error: "#ff6b6b" }[log.type];
                  return (
                    <div
                      key={i}
                      style={{
                        fontSize: 11.5,
                        color: "#c0c0e0",
                        padding: "6px 10px",
                        background: "#0f0f22",
                        borderLeft: `2px solid ${color}`,
                        borderRadius: 4,
                        animation: "fadeUp 0.3s ease both",
                      }}
                    >
                      <span style={{ color, marginRight: 6 }}>
                        {{ thought: "◆", tool: "⚙", result: "◉", error: "✕" }[log.type]}
                      </span>
                      {log.text}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Final answer */}
          {answer && (
            <div style={{ marginTop: 24, animation: "fadeUp 0.4s ease both" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 10, color: "#4a9eff", letterSpacing: "0.12em" }}>★ FINAL OUTPUT</span>
                <button
                  onClick={copyAnswer}
                  style={{
                    fontSize: 10,
                    background: "transparent",
                    border: "1px solid #2d2d55",
                    color: copied ? "#c8ff00" : "#8888b0",
                    borderRadius: 6,
                    padding: "4px 10px",
                    cursor: "pointer",
                  }}
                >
                  {copied ? "COPIED ✓" : "COPY"}
                </button>
              </div>
              <div
                style={{
                  padding: 18,
                  background: "#0f0f22",
                  border: "1px solid #2d2d55",
                  borderRadius: 10,
                  whiteSpace: "pre-wrap",
                  fontSize: 13.5,
                  lineHeight: 1.65,
                  color: "#e4e4f0",
                }}
              >
                {answer}
              </div>
            </div>
          )}
        </div>

        {/* Right column: orb + graph */}
        <div style={{ width: 260, display: "flex", flexDirection: "column", alignItems: "center", gap: 20, flexShrink: 0 }}>
          <div style={{ background: "#0f0f22", border: "1px solid #2d2d55", borderRadius: 12, padding: "24px 16px", width: "100%", display: "flex", justifyContent: "center" }}>
            <AgentOrb status={status} />
          </div>
          {nodes.length > 0 && (
            <div style={{ background: "#0f0f22", border: "1px solid #2d2d55", borderRadius: 12, padding: 12, width: "100%" }}>
              <NeuralGraph nodes={nodes} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}