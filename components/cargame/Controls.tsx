"use client";

import { create } from "zustand";
import { useEffect } from "react";

type Keys = {
    forward: boolean; backward: boolean; left: boolean; right: boolean;
    brake: boolean; reset: number;
    setKey: (k: Partial<Keys>) => void;
};

export const useControls = create<Keys>((set) => ({
    forward: false, backward: false, left: false, right: false, brake: false, reset: 0,
    setKey: (k) => set(k),
}));

const keyMap: Record<string, keyof Keys> = {
    ArrowUp: "forward", KeyW: "forward",
    ArrowDown: "backward", KeyS: "backward",
    ArrowLeft: "left", KeyA: "left",
    ArrowRight: "right", KeyD: "right",
    Space: "brake",
};

export default function Controls() {
    const setKey = useControls((s) => s.setKey);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
        
            if (e.code === "KeyR") setKey({ reset: Date.now() });
            const k = keyMap[e.code]; if (!k) return;
            setKey({ [k]: true } as Partial<Keys>);
        };

        const up = (e: KeyboardEvent) => {
            const k = keyMap[e.code]; if (!k) return;
            setKey({ [k]: false } as Partial<Keys>);
        };

        window.addEventListener("keydown", down);
        window.addEventListener("keyup", up);
        
        return () => { 
            window.removeEventListener("keydown", down); 
            window.removeEventListener("keyup", up);
        };
    }, [setKey]);

    // Touch helpers for HUD buttons
    const press = (k: keyof Keys) => () => setKey({ [k]: true } as any);
    const release = (k: keyof Keys) => () => setKey({ [k]: false } as any);

    return (
        <div className="hud">
            {/* Mobile / touch buttons */}
            <div className="btnpad" style={{ display: "grid" }}>
                <button className="btn" onTouchStart={press("left")} onTouchEnd={release("left")}>&larr;</button>
                <button className="btn" onTouchStart={press("forward")} onTouchEnd={release("forward")}>&uarr;</button>
                <button className="btn" onTouchStart={press("right")} onTouchEnd={release("right")}>&rarr;</button>
                <div style={{ gridColumn: "1 / span 3", display: "flex", gap: 8 }}>
                    <button className="btn" style={{ flex: 1 }} onTouchStart={press("backward")} onTouchEnd={release("backward")}>REV</button>
                    <button className="btn" style={{ flex: 1 }} onTouchStart={press("brake")} onTouchEnd={release("brake")}>BRK</button>
                </div>
            </div>

            {/* Desktop hint */}
            <div className="centerTop">WASD / Arrows, Space=Brake, R=Reset</div>
        </div>
    );
};