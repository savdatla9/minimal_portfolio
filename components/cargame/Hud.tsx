"use client"

import { useEffect, useState } from "react";

export default function Hud() {
    const [speed, setSpeed] = useState(0);
    const [lap, setLap] = useState(1);
    const [time, setTime] = useState(0);

    // simple timer
    useEffect(() => {
        const t = setInterval(() => setTime((v) => v + 0.1), 100);
        
        return () => clearInterval(t);
    }, []);

    // Custom event from Car to update HUD
    useEffect(() => {
        const onSpeed = (e: any) => setSpeed(e.detail);
        
        const onLap = (e: any) => setLap((v) => v + 1);

        window.addEventListener("car-speed", onSpeed as any);
        window.addEventListener("lap-complete", onLap as any);

        return () => {
            window.removeEventListener("car-speed", onSpeed as any);
            window.removeEventListener("lap-complete", onLap as any);
        };
    }, []);

    return (
        <div className="hud">
            <div className="panel">
                <div><b>Speed</b>: {speed.toFixed(0)} km/h</div>
                <div><b>Lap</b>: {lap}</div>
                <div><b>Time</b>: {time.toFixed(1)} s</div>
            </div>
        </div>
    );
};