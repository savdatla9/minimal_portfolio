"use client";

import { usePlane, useBox } from "@react-three/cannon";
import { useMemo } from "react";
// import { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

export default function Track() {
    // Ground
    usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0] }));

    // Simple walls (rectangular loop) as static boxes
    const walls = useMemo(() => {
        const h = 1.5, t = 1.0, L = 80, W = 40; // length/width of track bounds
        return [
        // Z+
        { args: [L, h, t], position: [0, h / 2, W / 2] },
        // Z-
        { args: [L, h, t], position: [0, h / 2, -W / 2] },
        // X+
        { args: [t, h, W], position: [L / 2, h / 2, 0] },
        // X-
        { args: [t, h, W], position: [-L / 2, h / 2, 0] },
        ];
    }, []);

    return (
        <group>
            {/* Visual ground */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[160, 100, 1, 1]} />
                <meshStandardMaterial color="#2c363f" />
            </mesh>

            {/* Asphalt track strip */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[120, 30, 1, 1]} />
                <meshStandardMaterial color="#1c1c1c" />
            </mesh>

            {/* Lap gate (a thin invisible box firing event when crossed) */}
            <LapGate position={[ -50, 0.25, 0 ]} />

            {/* Barriers */}
            {walls.map((w, i) => (
                <Wall key={i} args={w.args as [number, number, number]} position={w.position as [number, number, number]} />
            ))}
        </group>
    );
};

function Wall({ args, position }: { args: [number, number, number]; position: [number, number, number] }) {
    useBox(() => ({ type: "Static", args, position }));

    return (
        <mesh position={position} castShadow receiveShadow>
            <boxGeometry args={args} />
            <meshStandardMaterial color="#6d7278" metalness={0.1} roughness={0.8} />
        </mesh>
    );
};

function LapGate({ position = [0, 0, 0] as [number, number, number] }) {
    // just a thin tall frame to visualize the gate
    const frameMat = new THREE.MeshStandardMaterial({ color: "#b6e05c" });

    return (
        <group position={position}>
            <mesh position={[0, 1.2, 0]}>
                <boxGeometry args={[0.5, 2.4, 0.5]} />
                <primitive object={frameMat} attach="material" />
            </mesh>

            <mesh position={[0, 2.4, 0]}>
                <boxGeometry args={[6, 0.4, 0.5]} />
                <primitive object={frameMat} attach="material" />
            </mesh>

            <mesh position={[0, 1.2, 0]}>
                <boxGeometry args={[0.5, 2.4, 0.5]} />
                <primitive object={frameMat} attach="material" />
            </mesh>

            {/* Invisible sensor plane (no physics), we just catch pointer events as proxy */}
            <mesh
                position={[0, 1.2, 0]}
                // onPointerEnter={(e: ThreeEvent<PointerEvent>) => {
                // // little hack: camera rays won't hit usually; we’ll dispatch from car instead (see Car)
                // }}
                visible={false}
            >
                <boxGeometry args={[5.6, 2.2, 0.5]} />
                <meshBasicMaterial transparent opacity={0} />
            </mesh>
        </group>
    );
}
