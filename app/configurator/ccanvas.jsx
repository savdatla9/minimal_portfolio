'use client'

import { 
    Environment, ContactShadows,
    useGLTF, OrbitControls, Center,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useSnapshot } from "valtio";

import { state } from "./store";

export function Cap() {
    const snap = useSnapshot(state);

    const { nodes, materials } = useGLTF("/cap.glb");

    // Apply color
    materials.baseballCap.color.set(snap.cap);
    materials.plastic.color.set(snap.plastic);

    return(
        <Canvas shadows camera={{ position: [0, 0, 2.5], fov: 25 }} gl={{ preserveDrawingBuffer: true }}>
            <ambientLight intensity={0.5 * Math.PI} />
            
            <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/potsdamer_platz_1k.hdr" />
            
            <Center>
                <group scale={0.1} position={[0, 0.75, 0]} dispose={null}>
                    <mesh
                        castShadow receiveShadow geometry={nodes.baseballCap.geometry} material={materials.baseballCap}
                    />
                    <mesh
                        castShadow receiveShadow geometry={nodes.baseballCap_1.geometry} material={materials.baseballCap}
                    />
                    <mesh
                        castShadow receiveShadow geometry={nodes.plastic.geometry} material={materials.plastic}
                    />
                    <mesh
                        castShadow receiveShadow geometry={nodes.plastic_1.geometry} material={materials.plastic}
                    />
                    <mesh
                        castShadow receiveShadow geometry={nodes.baseballCap_2.geometry} material={materials.baseballCap}
                    />
                    <mesh
                        castShadow receiveShadow geometry={nodes.blinn1SG.geometry} material={materials.blinn1SG}
                    />

                    <mesh
                        castShadow receiveShadow geometry={nodes.baseballCap_3.geometry} material={materials.baseballCap}
                    />
                </group>
            </Center>

            <ContactShadows
                position={[0, -0.8, 0]}
                opacity={0.4}
                width={4} height={4}
                blur={2.5} far={3}
            />

            <OrbitControls enablePan={false} maxDistance={4} autoRotate={true} minDistance={1.5} />
        </Canvas>
    );
};

useGLTF.preload('/cap.glb');