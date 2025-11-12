"use client";

import { useState } from "react";

export default function DiceRoller() {
    const [value, setValue] = useState(1);
    const [rolling, setRolling] = useState(false);

    function roll() {
        if (rolling) return;
        setRolling(true);

        const target = 1 + Math.floor(Math.random() * 6);
        let ticks = 12;

        const timer = setInterval(() => {
            setValue((v) => (v % 6) + 1); ticks -= 1;

            if (ticks === 0) {
                clearInterval(timer);
                setValue(target);
                setRolling(false);
            };
        }, 60);
    };

    return (
        <div style={dStyles.wrap}>
            <h2 className="text-[28px] font-semibold">
                <a href='/games' className="underline">🏠︎</a> Guess Dice Roll 🎲
            </h2>

            <div style={dStyles.cubeWrap}>
                <div
                    style={{
                        ...dStyles.cube, transform: rolling
                        ? "rotate3d(1,1,0,540deg)"
                        : "rotate3d(0,0,0,0deg)",
                    }} aria-label={`Rolled ${value}`}
                >
                    <DieFace n={value} />
                </div>
            </div>

            <button onClick={roll} style={dStyles.btn} disabled={rolling}>
                {rolling ? "Rolling..." : "Roll Dice"}
            </button>
        </div>
    );
};

function Dot({ x, y }) {
    return (
        <span style={{
            position: "absolute",
            width: 14, height: 14,
            borderRadius: "50%",
            background: "#111",
            left: `${x}%`, top: `${y}%`,
            transform: "translate(-50%, -50%)",
        }} />
    );
};

function DieFace({ n }) {
    // draws pips for face 1..6 on a square
    const P = [15, 50, 85]; // left/center/right and top/middle/bottom
    const TL = [P[0], P[0]], TC = [P[1], P[0]], TR = [P[2], P[0]];
    const ML = [P[0], P[1]], MC = [P[1], P[1]], MR = [P[2], P[1]];
    const BL = [P[0], P[2]], BC = [P[1], P[2]], BR = [P[2], P[2]];

    // standard dice layouts (1..6)
    const layouts = {
        1: [MC],
        2: [TL, BR],
        3: [TL, MC, BR],
        4: [TL, TR, BL, BR],
        5: [TL, TR, MC, BL, BR],
        6: [TL, TR, ML, MR, BL, BR],
    };

    const base = {
        position: "relative",
        width: 120,
        height: 120,
        borderRadius: 16,
        background: "silver",
        boxShadow: "0 10px 20px rgba(0,0,0,.12), inset 0 0 0 4px #e2e8f0",
    };

    return (
        <div style={base}>
            {layouts[n].map(([x, y], i) => (
                <Dot key={i} x={x} y={y} />
            ))}
        </div>
    );
};

const dStyles = {
    wrap: {
        fontFamily: "system-ui, Segoe UI, Roboto, sans-serif",
        display: "grid",
        placeItems: "center",
        gap: 12,
        padding: 16,
    },
    cubeWrap: {
        perspective: "800px",
        height: 160,
        display: "grid",
        placeItems: "center",
    },
    cube: {
        transition: "transform 600ms cubic-bezier(.2,.8,.2,1)",
    },
    btn: {
        padding: "10px 16px",
        borderRadius: 12,
        border: "2px solid",
        borderBottom: "5px solid", 
        background: "transparent",
        cursor: "pointer",
        boxShadow: "0 2px 6px rgba(0,0,0,.06)",
    },
};