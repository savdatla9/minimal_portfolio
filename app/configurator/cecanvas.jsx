'use client'

import { 
    Environment, ContactShadows, useTexture,
    useGLTF, OrbitControls, Center, Decal,
} from "@react-three/drei";
import { useSnapshot } from "valtio";
import { Canvas } from "@react-three/fiber";

import { state } from "./store";

export function Cup() {
    const snap = useSnapshot(state);

    return(
        <Canvas shadows camera={{ position: [0, 1.2, 1.75], fov: 45 }} gl={{ preserveDrawingBuffer: true }}>
            <ambientLight intensity={0.5 * Math.PI} />
            
            <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/potsdamer_platz_1k.hdr" />
            
            <Center>
                <Model color={snap.cup} decal={snap.cupdecal} />
            </Center>

            <ContactShadows
                position={[0, -0.8, 0]}
                opacity={0.4}
                width={4} height={4}
                blur={2.5} far={3}
            />

            <OrbitControls 
                enablePan={false} autoRotate={true}
                maxDistance={4} minDistance={1.5} 
            />
        </Canvas>
    );
};

export const Model = ({color, decal}) => {
    const { nodes, materials } = useGLTF("/cup.glb");

    const texture = useTexture(`/${decal}.png`);

    return(
        <group scale={0.75} position={[0, 0.75, 0]} dispose={null}>
            <mesh
                castShadow receiveShadow
                geometry={nodes.coffee_cup_top_16oz.geometry}
                material={materials['13 - Default']}
            >
                {/* Override GLTF material with your own so color is controllable */}
                <meshPhysicalMaterial
                    color={color}
                    roughness={0.35}
                    metalness={0.1}
                />

                <Decal 
                    position={[0, 0.776, 0.339]} 
                    rotation={[0, 0, 0]} 
                    scale={0.58} map={texture} 
                    depthTest depthWrite
                />

                <Decal 
                    position={[0, 0.776, -0.429]} 
                    rotation={[0, Math.PI, 0]} 
                    scale={0.58} map={texture} 
                    depthTest depthWrite
                />
            </mesh>
        </group>
    );
};

useGLTF.preload('/cup.glb');
['/react.png', '/three.png', '/starbucks.png', '/onepiece.png', '/mcdonalds.png'].forEach(useTexture.preload);