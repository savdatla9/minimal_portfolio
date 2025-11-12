"use client";

import * as THREE from "three";
import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { StatsGl, Sky, Environment } from "@react-three/drei";

// Components of 
import Car from "@/components/cargame/Car";
import Hud from "@/components/cargame/Hud";
import Track from "@/components/cargame/Track";
import ChaseCam from "@/components/cargame/ChaseCam";
import Controls from "@/components/cargame/Controls";

export default function Page() {
    const carRef = useRef<THREE.Object3D>(null);

    return(
        <>
            <Canvas
                gl={{ antialias: true }}
                shadows
                camera={{ position: [0, 6, 12], fov: 60 }}
                style={{ width: "100vw", height: "100vh" }}
            >
                <color attach="background" args={["#0b0e13"]} />

                <fog attach="fog" args={["#0b0e13", 50, 180]} />

                {/* Nice sky & lighting */}
                <Sky inclination={0.49} azimuth={0.25} />

                <ambientLight intensity={0.4} />
                
                <directionalLight
                    position={[20, 25, 10]}
                    castShadow
                    intensity={1.2}
                    shadow-mapSize={[2048, 2048]}
                />

                <Suspense fallback={null}>
                    <Physics
                        broadphase="SAP"
                        allowSleep
                        gravity={[0, -9.81, 0]}
                    >
                        <Track />

                        <Car ref={carRef} />
                    </Physics>

                    <Environment preset="warehouse" />
                </Suspense>

                <ChaseCam targetRef={carRef} />
                
                <StatsGl />
            </Canvas>

            <Hud />

            <Controls />
        </>
    );
};