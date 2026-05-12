'use client'

import { useEffect, useMemo, useRef, useState } from "react";

const PASSAGES = [
  "React lets you build user interfaces from small and isolated pieces of code called components.",
  "Typing speed tests measure how fast and accurately you can type random text within a short time.",
  "Clean code is simple and direct. It reads like well written prose. The intent should be clear.",
  "Performance matters. Optimize only after measuring and identifying real bottlenecks in your app.",
  "Practice daily to improve touch typing. Focus on accuracy first and speed will naturally follow."
];

const DEFAULT_SECONDS = 60;

export default function App() {
  const [seconds, setSeconds] = useState(DEFAULT_SECONDS);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SECONDS);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const [passageIndex, setPassageIndex] = useState(() =>
    Math.floor(Math.random() * PASSAGES.length)
  );
  const passage = useMemo(() => PASSAGES[passageIndex], [passageIndex]);

  const [input, setInput] = useState("");
  const [typed, setTyped] = useState(""); // mirrors input but we keep separately for clarity

  const inputRef = useRef(null);
  const tickRef = useRef();

  const totalChars = passage.length;
  const typedChars = typed.length;

  // char-by-char correctness
  const correctCount = useMemo(() => {
    let c = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === passage[i]) c++;
    }
    return c;
  }, [typed, passage]);

  const incorrectCount = Math.max(0, typedChars - correctCount);
  const elapsed = seconds - timeLeft;
  const elapsedMinutes = elapsed > 0 ? elapsed / 60 : 1 / 60; // avoid divide-by-zero early

  // Metrics
  const cpm = Math.round(correctCount / elapsedMinutes);
  const wpm = Math.round((correctCount / 5) / elapsedMinutes);
  const accuracy = typedChars ? Math.max(0, Math.round((correctCount / typedChars) * 100)) : 100;

  useEffect(() => {
    if (!started || finished) return;
    tickRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(tickRef.current);
          setFinished(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(tickRef.current);
  }, [started, finished]);

  // Start on first keystroke
  useEffect(() => {
    if (typed.length > 0 && !started) {
      setStarted(true);
    }
  }, [typed, started]);

  const onChange = (e) => {
    if (finished) return;
    const value = e.target.value.replace(/\s+/g, " "); // normalize weird whitespace
    setInput(value);
    setTyped(value.slice(0, totalChars)); // cap to passage length
    // Auto-finish if user completes passage early
    if (value.length >= totalChars) {
      setFinished(true);
      setTimeLeft(0);
      clearInterval(tickRef.current);
    }
  };

  const restart = (newSeconds = seconds) => {
    clearInterval(tickRef.current);
    setSeconds(newSeconds);
    setTimeLeft(newSeconds);
    setStarted(false);
    setFinished(false);
    setInput("");
    setTyped("");
    // change passage for variety
    setPassageIndex((i) => {
      let n = Math.floor(Math.random() * PASSAGES.length);
      return n === i ? (n + 1) % PASSAGES.length : n;
    });
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const setDuration = (s) => {
    restart(s);
  };

  // Render colored passage with caret
  const renderPassage = () => {
    const spans = [];
    for (let i = 0; i < passage.length; i++) {
      const char = passage[i];
      let className = "char";
      if (i < typed.length) {
        className += typed[i] === char ? " correct" : " incorrect";
      } else if (i === typed.length && !finished) {
        className += " caret";
      }
      spans.push(
        <span key={i} className={className}>
          {char}
        </span>
      );
    }
    return spans;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}><a href='/games' className='underline'>🏠︎</a>&nbsp;&nbsp;Typing Speed Test Game</h1>

      <div style={styles.topBar}>
        <Stat label="Time" value={timeLeft} />
        <Stat label="WPM" value={isFinite(wpm) ? wpm : 0} />
        <Stat label="CPM" value={isFinite(cpm) ? cpm : 0} />
        <Stat label="Accuracy" value={`${isFinite(accuracy) ? accuracy : 100 }%`} />
      </div>

      <div style={styles.durationRow}>
        <span style={{ marginRight: 8 }}>Duration:</span>
        {[15, 30, 60, 120].map((s) => (
          <button
            key={s}
            onClick={() => setDuration(s)}
            style={{
              ...styles.chip,
              ...(seconds === s ? styles.chipActive : {}),
            }}
            disabled={started && !finished}
            title={started && !finished ? "Finish current test to change duration" : ""}
          >
            {s}s
          </button>
        ))}
        <button onClick={() => restart()} style={{ ...styles.chip, marginLeft: 12 }}>
          ↻ Restart
        </button>
      </div>

      <div style={styles.passageBox}>
        {renderPassage()}
      </div>

      <textarea
        ref={inputRef}
        value={input}
        onChange={onChange}
        placeholder="Start typing here..."
        spellCheck="false"
        disabled={finished}
        style={styles.textarea}
      />

      {finished && (
        <div style={styles.results}>
          <h2 style={{ margin: 0 }}>Results</h2>
          <div style={styles.resultsGrid}>
            <ResultItem label="WPM" value={isFinite(wpm) ? wpm : 0} />
            <ResultItem label="CPM" value={isFinite(cpm) ? cpm : 0} />
            <ResultItem label="Accuracy" value={`${isFinite(accuracy) ? accuracy : 100}%`} />
            <ResultItem label="Correct" value={correctCount} />
            <ResultItem label="Incorrect" value={incorrectCount} />
          </div>
          <button style={styles.primaryBtn} onClick={() => restart()}>
            Try Another
          </button>
        </div>
      )}

      <footer style={styles.footer}>
        <small>Tip: Accuracy first. Speed follows. Press “↻ Restart” anytime.</small>
      </footer>

      {/* Inline styles for colored chars */}
      <style>{`
        .char { white-space: pre-wrap; }
        .correct { color: #159947; }
        .incorrect { color: #d32f2f; background: rgba(211,47,47,0.08); }
        .caret {
          position: relative;
        }
        .caret::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 100%;
          height: 2px;
          background: #0070f3;
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={styles.stat}>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statValue}>{value}</div>
    </div>
  );
}

function ResultItem({ label, value }) {
  return (
    <div style={styles.resultItem}>
      <div style={{ opacity: 0.7 }}>{label}</div>
      <div style={{ fontWeight: 700, fontSize: 22 }}>{value}</div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 860,
    margin: "40px auto",
    padding: "0 20px",
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
    lineHeight: 1.6,
  },
  title: { textAlign: "center", marginBottom: 12, fontSize: 20, fontWeight: 600 },
  topBar: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 12,
    marginBottom: 16,
  },
  stat: {
    padding: "10px 12px",
    border: "1px solid #e3e3e3",
    borderRadius: 10,
    textAlign: "center",
    background: "transparent",
  },
  statLabel: { fontSize: 12, opacity: 0.7 },
  statValue: { fontSize: 20, fontWeight: 700 },
  durationRow: { display: "flex", alignItems: "center", marginBottom: 14, flexWrap: "wrap" },
  chip: {
    border: "2px solid #ccc",
    borderRadius: 999,
    padding: "6px 12px",
    marginRight: 6,
    cursor: "pointer",
    background: "transparent",
  },
  chipActive: { borderColor: "#0070f3", boxShadow: "0 0 0 2px rgba(0,112,243,0.12)" },
  passageBox: {
    border: "1px solid #e5e5e5",
    borderRadius: 10,
    padding: 16,
    minHeight: 110,
    background: "transparent",
    fontSize: 18,
    letterSpacing: 0.2,
    marginBottom: 12,
    userSelect: "none",
  },
  textarea: {
    width: "100%",
    minHeight: 120,
    resize: "vertical",
    padding: 12,
    fontSize: 18,
    borderRadius: 10,
    border: "1px solid #e5e5e5",
    outline: "none",
  },
  results: {
    marginTop: 16,
    padding: 16,
    border: "1px solid #e5e5e5",
    borderRadius: 10,
    background: "transparent",
  },
  resultsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, minmax(0,1fr))",
    gap: 10,
    margin: "12px 0 16px",
  },
  resultItem: {
    border: "1px solid #ececec",
    borderRadius: 10,
    padding: "10px 12px",
    textAlign: "center",
    background: "transparent",
  },
  primaryBtn: {
    border: 0,
    padding: "10px 14px",
    borderRadius: 8,
    background: "transparent",
    color: "white",
    cursor: "pointer",
  },
  footer: { marginTop: 18, textAlign: "center", opacity: 0.75 },
};