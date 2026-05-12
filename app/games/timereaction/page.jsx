"use client"

import { useEffect, useRef, useState } from "react";

export default function ReactionTimer() {
  const [phase, setPhase] = useState("idle"); // idle | waiting | go | early | done
  const [message, setMessage] = useState("Click START, then wait for green.");
  const [results, setResults] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("rt-results");
      if (saved) {
        setResults(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load results from localStorage", e);
    }
  }, []);

  const startRef = useRef(0);

  const timerRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  function startRound() {
    clearTimeout(timerRef.current);

    setPhase("waiting"); setMessage("Wait for green…");
    
    const delay = 700 + Math.random() * 2800; // 0.7s–3.5s

    timerRef.current = setTimeout(() => {
      setPhase("go");
      setMessage("CLICK!");
      startRef.current = performance.now();
    }, delay);
  };

  function handleClick() {
    if (phase === "idle" || phase === "done") return;

    if (phase === "waiting") {
      // Clicked too soon
      clearTimeout(timerRef.current); setPhase("early");

      setMessage("Too soon! Don’t click until it turns green.");
      
      return;
    };

    if (phase === "go") {
      const took = Math.round(performance.now() - startRef.current);

      const newResults = [...results, took].slice(-10); // keep last 10
      
      setResults(newResults);
      
      localStorage.setItem("rt-results", JSON.stringify(newResults));
      
      setPhase("done");
      
      setMessage(`Your time: ${took} ms`);
    };
  };

  function reset() {
    clearTimeout(timerRef.current); setPhase("idle");

    setMessage("Click START, then wait for green.");
  };

  const best = results.length ? Math.min(...results) : null;

  const avg = results.length ? 
    Math.round(results.reduce((a, b) => a + b, 0) / results.length) : null;

  return(
    <div style={styles.wrap}>
      <h2 className="text-[28px] font-semibold">
        <a href="/games" className="underline">🏠︎</a>&nbsp;&nbsp; Reaction Timer
      </h2>

      <div
        role="button" tabIndex={0} onClick={handleClick}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleClick()}
        style={{
          ...styles.panel,
          background:
            phase === "go"
            ? "#22c55e" // green
            : phase === "waiting"
            ? "#f59e0b" // amber
            : phase === "early"
            ? "#ef4444" // red
            : "#0ea5e9", // blue (idle/done)
          cursor: phase === "waiting" || phase === "go" ? "pointer" : "default",
        }}
        aria-label="Reaction panel"
      >
        <div style={styles.panelText}>{message}</div>
      </div>

      <div style={styles.controls}>
        <button
          style={styles.btn}
          onClick={startRound}
          disabled={phase === "waiting" || phase === "go"}
          aria-disabled={phase === "waiting" || phase === "go"}
        >
          START
        </button>

        <button style={styles.btnGhost} onClick={reset}>
          Reset
        </button>

        <button
          style={styles.btnGhost}
          onClick={() => { localStorage.removeItem("rt-results"); setResults([]) }}
        >
          Clear Stats
        </button>
      </div>

      <div style={styles.stats}>
        <Stat label="Attempts" value={results.length || 0} />

        <Stat label="Best" value={best != null ? `${best} ms` : "—"} />
        
        <Stat label="Average" value={avg != null ? `${avg} ms` : "—"} />
      </div>

      {!!results.length && (
        <div style={styles.listWrap}>
          <h4 style={{ margin: "0 0 6px" }}>Last {results.length} attempts</h4>

          <ol style={styles.list}>
            {results.slice().reverse().map((r, i) => (
              <li key={i} style={styles.listItem}>
                {r} ms
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

function Stat({ label, value }) {
  return (
    <div style={styles.stat}>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statValue}>{value}</div>
    </div>
  );
};

const styles = {
  wrap: {
    maxWidth: 520,
    margin: "40px auto",
    padding: 16,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
  },
  panel: {
    userSelect: "none",
    height: 180,
    borderRadius: 14,
    display: "grid",
    placeItems: "center",
    boxShadow: "0 6px 20px rgba(0,0,0,.12)",
    transition: "background .15s ease",
  },
  panelText: {
    fontSize: 24,
    fontWeight: 700,
    color: "white",
    letterSpacing: 0.3,
    textAlign: "center",
    padding: "0 16px",
  },
  controls: {
    display: "flex",
    gap: 10,
    justifyContent: "center",
    marginTop: 14,
  },
  btn: {
    padding: "10px 16px",
    borderRadius: 10,
    border: "none",
    fontWeight: 700,
    color: "white",
    background: "#0ea5e9",
    cursor: "pointer",
  },
  btnGhost: {
    padding: "10px 16px",
    borderRadius: 10,
    border: "1px solid #cbd5e1",
    background: "white",
    cursor: "pointer",
  },
  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 10,
    marginTop: 16,
  },
  stat: {
    padding: 12,
    borderRadius: 10,
    background: "#f8fafc",
    textAlign: "center",
    border: "1px solid #e2e8f0",
  },
  statLabel: { fontSize: 12, color: "#475569" },
  statValue: { marginTop: 6, fontSize: 18, fontWeight: 800 },
  listWrap: { marginTop: 14 },
  list: {
    margin: 0,
    padding: "0 0 0 18px",
    display: "grid",
    gridTemplateColumns: "repeat(5, minmax(0,1fr))",
    gap: 6,
  },
  listItem: {
    background: "#f1f5f9",
    padding: "6px 8px",
    borderRadius: 8,
    textAlign: "center",
    border: "1px solid #e2e8f0",
  },
};