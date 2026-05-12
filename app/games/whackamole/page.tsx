// File: app/whack-a-mole/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// --- Types
type DifficultyKey = "easy" | "normal" | "hard";

// --- Config
const GRID = { rows: 3, cols: 3 } as const;
const HOLES = GRID.rows * GRID.cols;

const DIFFICULTY: Record<DifficultyKey, { name: string; spawnEveryMs: number; upMinMs: number; upMaxMs: number }> = {
    easy: { name: "Easy", spawnEveryMs: 750, upMinMs: 900, upMaxMs: 1200 },
    normal: { name: "Normal", spawnEveryMs: 600, upMinMs: 700, upMaxMs: 1000 },
    hard: { name: "Hard", spawnEveryMs: 450, upMinMs: 450, upMaxMs: 750 },
};

const GAME_DURATION_MS = 30_000; // 30s

// Utility
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export default function Page() {
    // --- State
    const [difficulty, setDifficulty] = useState<DifficultyKey>("normal");
    const [running, setRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION_MS);
    const [score, setScore] = useState(0);
    const [best, setBest] = useState(0);

    // track which holes currently have a mole up
    const [up, setUp] = useState<boolean[]>(() => Array(HOLES).fill(false));

    // refs for timers
    const spawnIntervalRef = useRef<number | null>(null);
    const timerIntervalRef = useRef<number | null>(null);
    const hideTimeoutsRef = useRef<Record<number, number>>({}); // holeIdx -> timeout id
    const justWhackedRef = useRef<Record<number, number>>({}); // debouncing rapid clicks per mole pop

    const cfg = useMemo(() => DIFFICULTY[difficulty], [difficulty]);

    // --- Start / Reset
    const start = () => {
        stop(); setScore(0);
        setTimeLeft(GAME_DURATION_MS);
        setUp(Array(HOLES).fill(false));
        setRunning(true);

        // game countdown
        timerIntervalRef.current = window.setInterval(() => {
        setTimeLeft((ms) => {
            const next = Math.max(0, ms - 100);
            if (next === 0) {
                stop();
            };
            
            return next;
        });
        }, 100);

        // spawn moles periodically
        spawnIntervalRef.current = window.setInterval(() => spawnOne(), cfg.spawnEveryMs);
    };

    const stop = () => {
        setRunning(false);
        if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current);
        spawnIntervalRef.current = null;
        }
        if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
        }
        // clear all hide timeouts
        Object.values(hideTimeoutsRef.current).forEach((id) => clearTimeout(id));
        hideTimeoutsRef.current = {};
    };

    useEffect(() => {
        return () => stop(); // cleanup on unmount
    }, []);

    // --- Spawning logic
    const spawnOne = () => {
        setUp((curr) => {
        // choose a hole that is currently down
        const downIndices = curr.map((v, i) => (!v ? i : -1)).filter((i) => i !== -1) as number[];
        if (downIndices.length === 0) return curr; // all busy
        const idx = downIndices[rand(0, downIndices.length - 1)];
        const next = [...curr];
        next[idx] = true;

        // schedule hide
        const upFor = rand(cfg.upMinMs, cfg.upMaxMs);
        const timeoutId = window.setTimeout(() => hide(idx), upFor);
        hideTimeoutsRef.current[idx] = timeoutId;

        // mark a fresh mole pop to avoid multi-counting double-clicks
        justWhackedRef.current[idx] = 0;
        return next;
        });
    };

    const hide = (idx: number) => {
        setUp((curr) => {
        if (!curr[idx]) return curr; // already hidden
        const next = [...curr];
        next[idx] = false;
        // cleanup any hide timeouts for this hole
        const t = hideTimeoutsRef.current[idx];
        if (t) delete hideTimeoutsRef.current[idx];
        // reset debouncer for this idx
        delete justWhackedRef.current[idx];
        return next;
        });
    };

    // --- Hit handling
    const whack = (idx: number) => {
        if (!running) return;
        if (!up[idx]) return; // miss: do nothing, we only score hits

        // avoid scoring multiple times per single pop (e.g., mashing)
        if (justWhackedRef.current[idx] === 1) return;
        justWhackedRef.current[idx] = 1;

        setScore((s) => {
        const ns = s + 1;
        if (ns > best) setBest(ns);
        return ns;
        });

        // immediately hide the mole
        const to = hideTimeoutsRef.current[idx];
        if (to) {
        clearTimeout(to);
        delete hideTimeoutsRef.current[idx];
        }
        hide(idx);

        // fun micro animation via CSS variable pulse
        const el = document.getElementById(`hole-${idx}`);
        el?.classList.add("hit");
        window.setTimeout(() => el?.classList.remove("hit"), 150);
    };

    // --- Keyboard controls (1-9)
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
        const num = parseInt(e.key, 10);
        if (!isNaN(num) && num >= 1 && num <= HOLES) {
            whack(num - 1);
        }
        if (e.key.toLowerCase() === "r") start();
        if (e.key.toLowerCase() === "s") (running ? stop() : start());
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [running, difficulty]);

    // --- Derived display
    const secs = (timeLeft / 1000).toFixed(1);

    return (
        <div className="flex flex-col items-center justify-center p-6 gap-6">
            <header className="text-center">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight"><a href='/games' className='underline'>🏠︎</a>&nbsp;&nbsp;Whack‑a‑Mole</h1>
                <p className="text-slate-400 mt-2 text-sm">Press <kbd className="px-1 py-0.5 rounded bg-slate-700">1‑9</kbd> to whack • <kbd className="px-1 py-0.5 rounded bg-slate-700">R</kbd> restart • <kbd className="px-1 py-0.5 rounded bg-slate-700">S</kbd> start/stop</p>
            </header>

            <section className="w-full max-w-xl grid grid-cols-3 gap-4 select-none">
                {Array.from({ length: HOLES }).map((_, i) => (
                    <button
                        key={i}
                        id={`hole-${i}`}
                        onClick={() => whack(i)}
                        className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all bg-slate-800/80 border border-slate-700"
                        aria-pressed={up[i]}
                    >
                        {/* ground */}
                        <div className="absolute inset-0">
                            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient from-amber-900/70 via-amber-800/60 to-amber-700/40"></div>
                            <div className="absolute bottom-0 left-0 right-0 h-1/4 blur-xl bg-amber-900/40" />
                        </div>

                        {/* hole rim */}
                        <div className="absolute bottom-[22%] left-1/2 -translate-x-1/2 w-[78%] h-[18%] rounded-full bg-slate-950/80 ring-2 ring-black/30" />

                        {/* mole */}
                        <div
                            className={
                                "absolute left-1/2 -translate-x-1/2 w-[68%] max-w-[180px] transition-transform duration-150 will-change-transform" +
                                (up[i] ? " translate-y-[5%]" : " translate-y-[115%]")
                            }
                        >
                            <div className="relative mx-auto w-full aspect-[1/1.1] rounded-t-3xl bg-emerald-600/95 shadow-2xl flex items-center justify-center text-5xl">
                                <span role="img" aria-label="mole">🐹</span>
                                {/* eyes */}
                                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-black rounded-full" />
                                <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-black rounded-full" />
                            </div>
                        </div>

                        {/* hit pulse */}
                        <div className="absolute inset-0 pointer-events-none hit:animate-[pop_150ms_ease-out]" />

                        {/* index label */}
                        <span className="absolute top-1.5 left-1.5 text-[10px] px-1 py-0.5 rounded bg-slate-700/70">{i + 1}</span>
                    </button>
                ))}
            </section>

            <section className="w-full max-w-xl grid grid-cols-2 md:grid-cols-4 gap-3 items-center">
                <Stat label="Score" value={score} />
                <Stat label="Best" value={best} />
                <Stat label="Time" value={`${secs}s`} />
                <div className="flex items-center gap-2 justify-end">
                    <select
                        className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm"
                        value={difficulty}
                        disabled={running}
                        onChange={(e) => setDifficulty(e.target.value as DifficultyKey)}
                    >
                        {Object.entries(DIFFICULTY).map(([k, v]) => (
                        <option key={k} value={k}>
                            {v.name}
                        </option>
                        ))}
                    </select>

                    <button
                        onClick={() => (running ? stop() : start())}
                        className={(running ? "bg-rose-600" : "bg-emerald-600") + " rounded-xl px-4 py-2 font-semibold shadow hover:opacity-90 transition"}
                    >
                        {running ? "Stop" : "Start"}
                    </button>

                    <button
                        onClick={start}
                        className="bg-slate-700 rounded-xl px-4 py-2 font-semibold shadow hover:opacity-90 transition"
                    >
                        Restart
                    </button>
                </div>
            </section>

            {/* Local styles */}
            <style jsx global>{`
                @keyframes pop { from { transform: scale(1); } 50% { transform: scale(1.05); } to { transform: scale(1); } }
                .hit { outline: 2px solid rgba(16, 185, 129, 0.9); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0.25) inset; }
            `}</style>

            {/* Footer / Help */}
            <footer className="text-xs text-slate-400/80 mt-2">
               Mobile‑friendly: tap holes; desktop: click or use keys 1‑9.
            </footer>
        </div>
    );
};

function Stat({ label, value }: { label: string; value: number | string }) {
    return (
        <div className="bg-slate-800/70 border border-slate-700 rounded-2xl px-4 py-3 flex flex-col items-center text-center shadow">
            <span className="text-[11px] uppercase tracking-wide text-slate-400">{label}</span>
            <span className="text-2xl font-extrabold leading-none mt-0.5">{value}</span>
        </div>
    );
}