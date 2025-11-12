"use client";

import { useEffect, useRef, useState } from "react";

type Pipe = {
    x: number;
    w: number;
    gapY: number;
    gapH: number;
    passed: boolean; // for scoring once
};

const CANVAS_BASE_W = 360;   // logical width
const CANVAS_BASE_H = 480;   // logical height

export default function FlappyBird() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rafRef = useRef<number | null>(null);

    // game state
    const [running, setRunning] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [best, setBest] = useState<number>(() => {
        if (typeof window === "undefined") return 0;
        const v = localStorage.getItem("flappy_best");
        return v ? parseInt(v) : 0;
    });

    // mutable game refs (avoid rerenders)
    const birdRef = useRef({
        x: 90,
        y: CANVAS_BASE_H / 2,
        r: 14,
        vy: 0,
    });

    const pipesRef = useRef<Pipe[]>([]);
    const tRef = useRef({ last: 0, spawnAcc: 0, speed: 2.4 }); // speed increases a bit over time
    const inputRef = useRef({ justFlapped: false });
    const groundY = CANVAS_BASE_H - 80;

    // helpers
    function flap() {
        if (!running && !gameOver) {
            setRunning(true);
            return;
        };

        if (gameOver) return; // no flap during end screen
        // impulse
        birdRef.current.vy = -6.2;
        inputRef.current.justFlapped = true;
    };

    function reset() {
        setGameOver(false); setScore(0); setRunning(false);
        
        // reset world
        birdRef.current = { x: 90, y: CANVAS_BASE_H / 2, r: 14, vy: 0 };
        pipesRef.current = [];
        tRef.current = { last: 0, spawnAcc: 0, speed: 2.4 };
        // clear frame
        const cv = canvasRef.current!;
        cv.focus();

        const ctx = cv.getContext("2d")!;
        ctx.clearRect(0, 0, cv.width, cv.height);
    };

    // input
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const k = e.key;
            const c = e.code;

            const isSpace =
            c === "Space" || k === " " || k === "Spacebar";

            const isUp =
            c === "ArrowUp" || k === "ArrowUp" || k === "w" || k === "W";

            if (isSpace || isUp) {
                e.preventDefault(); flap();
                return;
            };

            if (k === "p" || k === "P") {
                e.preventDefault(); setRunning((r) => !r);
                return;
            };

            if ((k === "Enter" || k === "r" || k === "R") && gameOver) {
                e.preventDefault(); reset();
                return;
            };
        };
        
        // pointer/touch still fine:
        const onPointer = () => flap();

        document.addEventListener("keydown", onKey, { passive: false });
        window.addEventListener("pointerdown", onPointer);

        return () => {
            document.removeEventListener("keydown", onKey as any);
            window.removeEventListener("pointerdown", onPointer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameOver]);

    // resize & DPR scaling
    useEffect(() => {
        function resize() {
            const cv = canvasRef.current!;
            const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
            // keep aspect ratio while fitting to viewport (with some max)
            const maxW = Math.min(420, window.innerWidth - 16);
            const scale = maxW / CANVAS_BASE_W;
            const cssW = CANVAS_BASE_W * scale;
            const cssH = CANVAS_BASE_H * scale;

            cv.style.width = `${cssW}px`;
            cv.style.height = `${cssH}px`;
            cv.width = Math.floor(CANVAS_BASE_W * dpr);
            cv.height = Math.floor(CANVAS_BASE_H * dpr);
            const ctx = cv.getContext("2d")!;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // draw in logical units
            // clear on resize
            ctx.clearRect(0, 0, CANVAS_BASE_W, CANVAS_BASE_H);
        };
        
        resize();
        
        window.addEventListener("resize", resize);

        return () => window.removeEventListener("resize", resize);
    }, []);

    // main loop
    useEffect(() => {
        const cv = canvasRef.current!;
        const ctx = cv.getContext("2d")!;

        function spawnPipe() {
            // gap varies a bit with score; slightly tighter over time
            const baseGap = 150;
            const tightness = Math.min(60, score * 1.5);
            const gapH = baseGap - tightness;
            const margin = 60;
            const gapY = margin + Math.random() * (groundY - margin - gapH - 20);

            pipesRef.current.push({
                x: CANVAS_BASE_W + 10,
                w: 56,
                gapY,
                gapH,
                passed: false,
            });
        };

        function drawBackground() {
            // Sky is main background (set in page); add a few clouds/hills
            ctx.fillStyle = "#70c5ce";
            ctx.fillRect(0, 0, CANVAS_BASE_W, CANVAS_BASE_H);

            // Distant hills
            ctx.fillStyle = "#aadfe6";
            ctx.beginPath();
            ctx.arc(80, 180, 60, 0, Math.PI * 2);
            ctx.arc(200, 150, 50, 0, Math.PI * 2);
            ctx.arc(300, 190, 70, 0, Math.PI * 2);
            ctx.fill();

            // Ground
            ctx.fillStyle = "#ded48f";
            ctx.fillRect(0, groundY, CANVAS_BASE_W, CANVAS_BASE_H - groundY);
            // subtle ground stripes
            ctx.fillStyle = "rgba(0,0,0,0.06)";

            for (let i = 0; i < CANVAS_BASE_W; i += 14) {
                ctx.fillRect(i, groundY, 8, CANVAS_BASE_H - groundY);
            };
        };

        function drawBird() {
            const b = birdRef.current;
            // body
            ctx.save();
            ctx.translate(b.x, b.y);
            ctx.rotate(Math.atan2(b.vy, 8) * 0.25); // tilt a bit by velocity
            ctx.fillStyle = "#ffde59";
            ctx.beginPath();
            ctx.arc(0, 0, b.r, 0, Math.PI * 2);
            ctx.fill();

            // wing (flap animation if just flapped)
            const wingY = inputRef.current.justFlapped ? -6 : -2;
            ctx.fillStyle = "#ffd24d";
            ctx.beginPath();
            ctx.ellipse(-4, wingY, 8, 6, 0, 0, Math.PI * 2);
            ctx.fill();

            // eye
            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.arc(6, -4, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#333";
            ctx.beginPath();
            ctx.arc(7, -4, 2, 0, Math.PI * 2);
            ctx.fill();

            // beak
            ctx.fillStyle = "#ff914d";
            ctx.beginPath();
            ctx.moveTo(b.r - 2, -2);
            ctx.lineTo(b.r + 8, 0);
            ctx.lineTo(b.r - 2, 2);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
            inputRef.current.justFlapped = false;
        };

        function drawPipes() {
            ctx.fillStyle = "#66bb66";
            ctx.strokeStyle = "#4fa14f";

            pipesRef.current.forEach((p) => {
                // top pipe
                ctx.fillRect(p.x, 0, p.w, p.gapY);
                ctx.strokeRect(p.x, 0, p.w, p.gapY);

                // bottom pipe
                const bottomY = p.gapY + p.gapH;
                ctx.fillRect(p.x, bottomY, p.w, groundY - bottomY);
                ctx.strokeRect(p.x, bottomY, p.w, groundY - bottomY);

                // pipe lips
                ctx.fillRect(p.x - 4, p.gapY - 14, p.w + 8, 14);
                ctx.fillRect(p.x - 4, p.gapY + p.gapH, p.w + 8, 14);
            });
        };

        function drawHUD() {
            ctx.fillStyle = "rgba(0,0,0,0.45)";
            ctx.font = "bold 28px system-ui, -apple-system, Segoe UI, Roboto";
            ctx.textAlign = "center";
            ctx.fillText(String(score), CANVAS_BASE_W / 2, 50);

            ctx.textAlign = "left";
            ctx.font = "12px system-ui, -apple-system, Segoe UI, Roboto";
            ctx.fillText(`Best: ${best}`, 12, 22);

            if (!running && !gameOver) {
                ctx.textAlign = "center";
                ctx.font = "bold 18px system-ui, -apple-system, Segoe UI, Roboto";
                ctx.fillText("Tap / Click / Space to start", CANVAS_BASE_W / 2, CANVAS_BASE_H / 2 - 30);
                ctx.font = "14px system-ui, -apple-system, Segoe UI, Roboto";
                ctx.fillText("Press P to pause | Space/Up to flap", CANVAS_BASE_W / 2, CANVAS_BASE_H / 2);
            };

            if (gameOver) {
                ctx.fillStyle = "rgba(0,0,0,0.6)";
                ctx.fillRect(40, CANVAS_BASE_H / 2 - 80, CANVAS_BASE_W - 80, 160);
                ctx.fillStyle = "#fff";
                ctx.textAlign = "center";
                ctx.font = "bold 22px system-ui, -apple-system, Segoe UI, Roboto";
                ctx.fillText("Game Over", CANVAS_BASE_W / 2, CANVAS_BASE_H / 2 - 36);
                ctx.font = "16px system-ui, -apple-system, Segoe UI, Roboto";
                ctx.fillText(`Score: ${score}   Best: ${best}`, CANVAS_BASE_W / 2, CANVAS_BASE_H / 2 - 6);
                ctx.fillText("Enter / R to restart", CANVAS_BASE_W / 2, CANVAS_BASE_H / 2 + 26);
            };
        };

        function collideCircleRect(cx: number, cy: number, r: number, rx: number, ry: number, rw: number, rh: number) {
            // circle-rect collision
            const testX = Math.max(rx, Math.min(cx, rx + rw));
            const testY = Math.max(ry, Math.min(cy, ry + rh));
            const dx = cx - testX;
            const dy = cy - testY;
            return dx * dx + dy * dy <= r * r;
        };

        const step = (ts: number) => {
            if (!tRef.current.last) tRef.current.last = ts;
            const dt = Math.min(32, ts - tRef.current.last); // clamp large tab switches
            tRef.current.last = ts;

            // draw bg
            drawBackground();

            // update world only if running & not over
            if (running && !gameOver) {
                const b = birdRef.current;

                // gravity & motion
                b.vy += 0.30; // gravity
                b.vy = Math.min(b.vy, 9); // terminal-ish
                b.y += b.vy;

                // spawn pipes every ~1.4s (scaled by speed)
                tRef.current.spawnAcc += dt;

                const spawnEvery = 1400 / (tRef.current.speed / 2.4); // maintain cadence with speed ups
                
                if (tRef.current.spawnAcc >= spawnEvery) {
                    tRef.current.spawnAcc = 0;
                    spawnPipe();
                };

                // move pipes
                for (const p of pipesRef.current) {
                    p.x -= tRef.current.speed;
                };

                // remove offscreen
                pipesRef.current = pipesRef.current.filter((p) => p.x + p.w > -2);

                // score when bird passes center of a pipe
                pipesRef.current.forEach((p) => {
                    if (!p.passed && p.x + p.w < b.x) {
                        p.passed = true;
                        setScore((s) => s + 1);
                        // tiny speed up over time
                        tRef.current.speed = Math.min(4.2, tRef.current.speed + 0.03);
                    };
                });

                // collisions
                // ground / ceiling
                if (b.y + b.r >= groundY || b.y - b.r <= 0) {
                    endGame();
                } else {
                    // with pipes
                    for (const p of pipesRef.current) {
                        const topHit = collideCircleRect(b.x, b.y, b.r, p.x, 0, p.w, p.gapY);
                        const botHit = collideCircleRect(b.x, b.y, b.r, p.x, p.gapY + p.gapH, p.w, groundY - (p.gapY + p.gapH));
                        if (topHit || botHit) {
                            endGame();
                            break;
                        };
                    };
                };
            };

            // draw actors
            drawPipes();
            drawBird();
            drawHUD();

            rafRef.current = requestAnimationFrame(step);
        };

        function endGame() {
            setGameOver(true); setRunning(false);

            setBest((prev) => {
                const next = Math.max(prev, score);
                try {
                    localStorage.setItem("flappy_best", String(next));
                } catch(e) {
                    console.log(e);
                };

                return next;
            });
        };

        rafRef.current = requestAnimationFrame(step);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [running, gameOver, score, best]);

    return (
        <div style={{
            display: "grid",
            gap: 12, padding: 12,
            justifyItems: "center",
            userSelect: "none",
        }}>
            <canvas
                ref={canvasRef} tabIndex={0}
                style={{
                    display: "block",
                    background: "#70c5ce",
                    borderRadius: 12,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                    touchAction: "manipulation",
                }}
                width={CANVAS_BASE_W} height={CANVAS_BASE_H}
                aria-label="Flappy Bird Canvas"
            />

            <div style={{ display: "flex", gap: 8 }}>
                {!running && !gameOver && (
                    <button onClick={() => setRunning(true)} className="border border-b-3 p-2 rounded-md">
                        Start
                    </button>
                )}

                {running && (
                    <button onClick={() => setRunning(false)} className="border border-b-3 p-2 rounded-md">
                        Pause
                    </button>
                )}

                {!running && !gameOver && (
                    <button onClick={() => reset()} className="border border-b-3 p-2 rounded-md">
                        Reset
                    </button>
                )}

                {gameOver && (
                    <button onClick={() => reset()} className="border border-b-3 p-2 rounded-md">
                        Restart
                    </button>
                )}
            </div>

            <p style={{ margin: 0, opacity: 0.8, fontSize: 12 }}>
                Controls: Space/↑ or Tap to flap • P to pause
            </p>
        </div>
    );
};