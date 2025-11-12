"use client"

import { useState } from "react";

export default function CoinToss(){
  const [face, setFace] = useState("Heads");
  const [spinning, setSpinning] = useState(false);
  const [stats, setStats] = useState({ Heads: 0, Tails: 0 });
  const [history, setHistory] = useState([]);

  function flip() {
    if (spinning) return;
    setSpinning(true);
    const next = Math.random() < 0.5 ? "Heads" : "Tails";
    setTimeout(() => {
      setFace(next); setStats((s) => ({ ...s, [next]: s[next] + 1 }));
      setHistory((h) => [next, ...h].slice(0, 10)); setSpinning(false);
    }, 700);
  };

  return (
    <div style={cStyles.wrap}>
      <h2 className="text-[28px] font-bold">
        <a href='/games' className="underline">🏠︎</a>&nbsp;&nbsp;Coin Toss
      </h2>

      <div style={cStyles.coinWrap}>
        <div style={{
          ...cStyles.coin, transform: spinning ? "rotateX(720deg)" : "rotateX(0deg)",
        }}>
          <div style={{ ...cStyles.side, ...cStyles.obv }}>Heads</div>
          <div style={{ ...cStyles.side, ...cStyles.rev }}>Tails</div>
        </div>
      </div>

      <button style={cStyles.btn} onClick={flip} disabled={spinning}>
        {spinning ? "Flipping..." : "Flip Coin"}
      </button>

      <div style={cStyles.stats}>
        <span>Heads: <b>{stats.Heads}</b></span>
        <span>Tails: <b>{stats.Tails}</b></span>
      </div>

      <p style={{ marginTop: 6, opacity: 0.7 }}>
        Last 10: {history.join(" · ")}
      </p>
    </div>
  );
};

const cStyles = {
  wrap: {
    fontFamily: "system-ui, Segoe UI, Roboto, sans-serif",
    display: "grid",
    placeItems: "center",
    gap: 12,
    padding: 16,
  },
  coinWrap: {
    perspective: "800px",
    height: 140,
    display: "grid",
    placeItems: "center",
  },
  coin: {
    width: 140,
    height: 140,
    position: "relative",
    transformStyle: "preserve-3d",
    transition: "transform 650ms ease",
  },
  side: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    fontWeight: 700,
    fontSize: 24,
    backfaceVisibility: "hidden",
    boxShadow: "inset 0 0 0 4px #e2e8f0, 0 12px 20px rgba(0,0,0,.12)",
  },
  obv: { background: "linear-gradient(#fff7d6,#ffe08a)" },
  rev: { background: "linear-gradient(#e6f0ff,#bcd2ff)", transform: "rotateX(180deg)" },
  btn: {
    padding: "10px 16px",
    borderRadius: 15,
    border: "2px solid",
    borderBottom: "5px solid",
    background: "transparent",
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(0,0,0,.06)",
  },
  stats: { display: "flex", gap: 16, marginTop: 8 },
};