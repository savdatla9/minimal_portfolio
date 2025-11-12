"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const GRID = 20; // 20x20 grid
const INITIAL_SPEED_MS = 160; // lower = faster
const SPEED_MIN = 80;
const SPEED_MAX = 300;
const START_LENGTH = 3;

type Cell = { x: number; y: number };

type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";

const DIR_VECTORS: Record<Dir, Cell> = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 },
};

function isOpposite(a: Dir, b: Dir) {
    return (
        (a === "UP" && b === "DOWN") ||
        (a === "DOWN" && b === "UP") ||
        (a === "LEFT" && b === "RIGHT") ||
        (a === "RIGHT" && b === "LEFT")
    );
};

function sameCell(a: Cell, b: Cell) {
    return a.x === b.x && a.y === b.y;
};

function randInt(n: number) {
    return Math.floor(Math.random() * n);
};

function spawnFood(snake: Cell[]): Cell {
    while (true) {
        const f = { x: randInt(GRID), y: randInt(GRID) };
        if (!snake.some((c) => sameCell(c, f))) return f;
    }
};

function useLocalStorageNumber(key: string, initial: number) {
    const [value, setValue] = useState<number>(() => {
        if (typeof window === "undefined") return initial;
        const v = window.localStorage.getItem(key);
        return v ? Number(v) : initial;
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.localStorage.setItem(key, String(value));
        };
    }, [key, value]);
    return [value, setValue] as const;
};

export default function SnakePage() {
    const [direction, setDirection] = useState<Dir>("RIGHT");
    const pendingDir = useRef<Dir>("RIGHT"); // buffered direction from input
    const [snake, setSnake] = useState<Cell[]>(() => {
        const cx = Math.floor(GRID / 2);
        return Array.from({ length: START_LENGTH }, (_, i) => ({ x: cx - i, y: cx }));
    });
    const [food, setFood] = useState<Cell>(() => spawnFood([]));
    const [running, setRunning] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED_MS);
    const [score, setScore] = useState(0);
    const [best, setBest] = useLocalStorageNumber("snake_best", 0);

    const cells = useMemo(() => GRID * GRID, []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const k = e.key.toLowerCase();

            if (["arrowup", "w"].includes(k)) pendingDir.current = "UP";
            else if (["arrowdown", "s"].includes(k)) pendingDir.current = "DOWN";
            else if (["arrowleft", "a"].includes(k)) pendingDir.current = "LEFT";
            else if (["arrowright", "d"].includes(k)) pendingDir.current = "RIGHT";
            else if (k === " ") toggleRun();
        };

        window.addEventListener("keydown", onKey);

        return () => window.removeEventListener("keydown", onKey);
    }, []);

    useEffect(() => {
        if (!running || gameOver) return;

        const id = setInterval(() => {
            setSnake((prev) => {
                setDirection((cur) => {
                    const next = pendingDir.current;
                    if (!isOpposite(cur, next)) return next;
                    return cur;
                });
                const curDir = pendingDir.current;
                const head = prev[0];
                const vec = DIR_VECTORS[curDir];
                const nextHead = { x: head.x + vec.x, y: head.y + vec.y };

                if (nextHead.x < 0 || nextHead.x >= GRID || nextHead.y < 0 || nextHead.y >= GRID) {
                    endGame();
                    return prev;
                };

                if (prev.some((c) => sameCell(c, nextHead))) {
                    endGame();
                    return prev;
                };

                const ate = sameCell(nextHead, food);
                const grown = [nextHead, ...prev];
                if (!ate) grown.pop();

                if (ate) {
                    setFood(spawnFood(grown));
                    setScore((s) => s + 10);
                };

                return grown;
            });
        }, speed);

        return () => clearInterval(id);
    }, [running, gameOver, speed, food]);

    const endGame = useCallback(() => {
        setRunning(false);
        setGameOver(true);
        setBest((b) => (score > b ? score : b));
    }, [score, setBest]);

    const reset = useCallback(() => {
        const cx = Math.floor(GRID / 2);
        setSnake(Array.from({ length: START_LENGTH }, (_, i) => ({ x: cx - i, y: cx })));
        setDirection("RIGHT");
        pendingDir.current = "RIGHT";
        setFood(spawnFood([]));
        setScore(0);
        setGameOver(false);
        setRunning(false);
    }, []);

    const toggleRun = useCallback(() => setRunning((r) => !r), []);

    // === Render helpers ===
    const snakeSet = useMemo(() => new Set(snake.map((c) => `${c.x},${c.y}`)), [snake]);

    const cellNode = (i: number) => {
        const x = i % GRID;
        const y = Math.floor(i / GRID);
        const key = `${x},${y}`;

        const isHead = snake.length && snake[0].x === x && snake[0].y === y;
        const isBody = snakeSet.has(key);
        const isFood = food.x === x && food.y === y;

        return (
            <div
                key={i}
                className={
                    "aspect-square border border-neutral-800 flex items-center justify-center " +
                    (isHead
                        ? "bg-emerald-500 shadow-[inset_0_0_8px_rgba(0,0,0,0.45)]"
                        : isBody
                        ? "bg-emerald-700"
                        : isFood
                        ? "bg-rose-500"
                        : "bg-neutral-900/30"
                    )
                }
            />
        );
    };

    const DPad = () => (
        <div className="flex flex-col justify-center gap-2 w-40 mx-auto select-none">
            <div className="flex justify-center-safe">
                <button
                    onClick={() => (pendingDir.current = "UP")}
                    className="col-start-2 px-3 py-2 rounded-xl bg-neutral-800/50 hover:bg-neutral-700/30 active:scale-95"
                >
                    ↑
                </button>
            </div>

            <div className="">
                <button
                    onClick={() => (pendingDir.current = "LEFT")}
                    className="m-2 px-3 py-2 rounded-xl bg-neutral-800/50 hover:bg-neutral-700/30 active:scale-95"
                >
                    ←
                </button>

                <button
                    onClick={() => (pendingDir.current = "DOWN")}
                    className="m-2 px-3 py-2 rounded-xl bg-neutral-800/50 hover:bg-neutral-700/30 active:scale-95"
                >
                    ↓
                </button>

                <button
                    onClick={() => (pendingDir.current = "RIGHT")}
                    className="m-2 px-3 py-2 rounded-xl bg-neutral-800/50 hover:bg-neutral-700/30 active:scale-95"
                >
                    →
                </button>
            </div>
        </div>
    );

    return(
        <main className="flex items-center justify-center p-4">
            <div className="w-full max-w-3xl grid gap-4">
                <header className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-[28px] font-semibold">
                        <a href="/games" className="underline">🏠︎</a>&nbsp;&nbsp;🐍 Snake
                    </h2>

                    <div className="flex items-center gap-3 text-sm">
                        <span className="px-3 py-1 rounded-full bg-emerald-900/40 border border-emerald-700">Score: {score}</span>
                        <span className="px-3 py-1 rounded-full bg-transparent border border-neutral-700">Best: {best}</span>
                    </div>
                </header>

                <section className="grid lg:grid-cols-[1fr_auto] gap-4">
                    <div className="grid place-items-center">
                        {/* Board */}
                        <div
                            className="grid w-full max-w-[min(92vw,520px)]"
                            style={{ gridTemplateColumns: `repeat(${GRID}, minmax(0,1fr))` }}
                        >
                            {Array.from({ length: cells }, (_, i) => cellNode(i))}
                        </div>
                    </div>

                    {/* Controls */}
                    <aside className="min-w-[220px] grid gap-3 content-start">
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={toggleRun}
                                className={`px-3 py-2 rounded-lg border ${
                                running
                                    ? "bg-amber-600/30 border-amber-600 hover:bg-amber-600/50"
                                    : "bg-emerald-600/30 border-emerald-600 hover:bg-emerald-600/50"
                                }`}
                            >
                                {running ? "Pause" : "Start"}
                            </button>

                            <button
                                onClick={reset}
                                className="px-3 py-2 rounded-lg border bg-neutral-800/50 border-neutral-600 hover:bg-neutral-700/30"
                            >
                                Reset
                            </button>
                        </div>

                        <label className="text-sm">Speed ({speed} ms)
                            <input
                                type="range"
                                min={SPEED_MIN}
                                max={SPEED_MAX}
                                value={speed}
                                onChange={(e) => setSpeed(Number(e.target.value))}
                                className="w-full"
                            />
                        </label>

                        <div className="mt-2">
                            <p className="text-xs opacity-80 mb-1">Controls</p>
                            
                            <ul className="text-xs space-y-1 opacity-80 list-disc list-inside">
                                <li>Keyboard: Arrow keys / WASD</li>
                                <li>Space: Start/Pause</li>
                                <li>Mobile: Use the D‑pad below</li>
                            </ul>
                        </div>

                        <div className="mt-2">
                            <DPad />
                        </div>

                        {gameOver && (
                            <div className="mt-2 p-3 rounded-lg border border-rose-700 bg-rose-900/30">
                                <p className="font-medium">Game Over</p>
                                <p className="text-sm opacity-90">Your score: {score}</p>
                            </div>
                        )}
                    </aside>
                </section>

                <footer className="text-xs opacity-70">
                    Tip: Avoid 180° turns. Score +10 per food. Best saved in localStorage.
                </footer>
            </div>
        </main>
    );
};