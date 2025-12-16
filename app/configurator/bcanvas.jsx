'use client'

import { 
    Environment, ContactShadows, useTexture,
    useGLTF, OrbitControls, Center, 
} from "@react-three/drei";
import { useSnapshot } from "valtio";
import { Canvas } from "@react-three/fiber";

import { state } from "./store";

export function BeanBag() {
    const snap = useSnapshot(state);

    return(
        <Canvas shadows camera={{ position: [0, 1.2, 1.75], fov: 45 }} gl={{ preserveDrawingBuffer: true }}>
            <ambientLight intensity={0.5 * Math.PI} />
            
            <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/potsdamer_platz_1k.hdr" />
            
            <Center>
                <Model  />
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

export const Model = ({  }) => {
    const { nodes, materials } = useGLTF('/bean_bag_chair.glb');

    // const texture = useTexture();

    return (
        <group dispose={null}>
            <group scale={0.01}>
                <group
                    position={[-209.596, 86.441, -343.644]}
                    rotation={[-1.619, 0, -1.653]}
                    scale={[115.97, 115.97, 70.467]}
                >
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Cylinder246_Bean_Bag_0.geometry}
                        material={materials.Bean_Bag}
                    >
                        <meshPhysicalMaterial />
                    </mesh>

                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Cylinder246_Bean_Bag_0_1.geometry}
                        material={materials.Bean_Bag}
                    >
                        <meshPhysicalMaterial />
                    </mesh>
                    
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Cylinder246_Bean_Bag_0_2.geometry}
                        material={materials.Bean_Bag}
                    >
                        <meshPhysicalMaterial />
                    </mesh>
                </group>
            </group>
        </group>
    );
};

useGLTF.preload('/cup.glb');
['/react.png', '/three.png', '/starbucks.png', '/onepiece.png', '/mcdonalds.png'].forEach(useTexture.preload);