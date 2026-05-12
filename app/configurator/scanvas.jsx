'use client'

import { 
    Environment, ContactShadows,
    useGLTF, OrbitControls, Center,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useSnapshot } from "valtio";

import { state } from "./store";

export function Shoe() {
    const snap = useSnapshot(state);

    const { nodes, materials } = useGLTF("/shoe-draco.glb");

    // Apply color
    materials.laces.color.set(snap.laces);
    materials.mesh.color.set(snap.mesh);
    materials.caps.color.set(snap.caps);
    materials.inner.color.set(snap.inner);
    materials.sole.color.set(snap.sole);
    materials.stripes.color.set(snap.stripes);
    materials.band.color.set(snap.band);
    materials.patch.color.set(snap.patch);

    return(
       <Canvas shadows camera={{ position: [0, 0, 2.5], fov: 25 }} gl={{ preserveDrawingBuffer: true }}>
            <ambientLight intensity={0.5 * Math.PI} />
            
            <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/potsdamer_platz_1k.hdr" />
            
            <Center>
                <group scale={0.5} dispose={null}>
                    <mesh castShadow receiveShadow geometry={nodes.shoe.geometry} material={materials.laces} />
                    <mesh castShadow receiveShadow geometry={nodes.shoe_1.geometry} material={materials.mesh} />
                    <mesh castShadow receiveShadow geometry={nodes.shoe_2.geometry} material={materials.caps} />
                    <mesh castShadow receiveShadow geometry={nodes.shoe_3.geometry} material={materials.inner} />
                    <mesh castShadow receiveShadow geometry={nodes.shoe_4.geometry} material={materials.sole} />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.shoe_5.geometry}
                        material={materials.stripes}
                    />
                    <mesh castShadow receiveShadow geometry={nodes.shoe_6.geometry} material={materials.band} />
                    <mesh castShadow receiveShadow geometry={nodes.shoe_7.geometry} material={materials.patch} />
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

useGLTF.preload('/shoe-draco.glb');