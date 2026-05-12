'use client'

import { 
    Environment, ContactShadows, useTexture,
    useGLTF, OrbitControls, Center, 
} from "@react-three/drei";
import { useSnapshot } from "valtio";
import { Canvas } from "@react-three/fiber";
import * as THREE from 'three';
import { useMemo } from "react";

import { state } from "./store";

export function BeanBag() {
    const snap = useSnapshot(state);

    return(
        <Canvas shadows camera={{ position: [0, 3.2, 2.5], fov: 45 }} gl={{ preserveDrawingBuffer: true }}>
            <ambientLight intensity={0.5} />

            <directionalLight 
                position={[0, 10, 0]} 
                intensity={0.15} 
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}    
                shadow-camera-far={50}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
            />
            
            <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/potsdamer_platz_1k.hdr" />
            
            <Center>
                <Model mats={snap.beanbag} />
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

const Model = ({ mats }) => {
    let color = '#c69c6d';

    const { nodes, materials } = useGLTF('/bean_bag_chair.glb');

    const texture = useTexture('/'+mats+'.png');

    if(mats==='denimblue' || mats==='denimlightblue'){
        color = '#cccccc';

    }else if(mats==='denimblack'){
        color = '#696969';
    }else{
        color = '#c69c6d';
    }

    // Basic texture settings (optional but recommended)
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    // texture.repeat.set(1, 1);

    // Clone material and apply texture
    const material = useMemo(() => {
        const mat = materials.Bean_Bag.clone();
        mat.map = texture;
        mat.needsUpdate = true;
        mat.roughness = 1;
        mat.normalScale.set(0.4, 0.4);
        mat.opacity = 2;
        mat.color.set(color);  // keep white for true PNG colors
        return mat;
    }, [materials, texture]);

    return (
        <group dispose={null}>
            <group scale={0.01}>
                <group
                    position={[-209.596, 86.441, -343.644]}
                    rotation={[-1.619, 0, -1.653]}
                    scale={[115.97, 115.97, 70.467]}
                >
                    <mesh geometry={nodes.Cylinder246_Bean_Bag_0.geometry} material={material} />

                    <mesh geometry={nodes.Cylinder246_Bean_Bag_0_1.geometry} material={material} />
                    
                    <mesh geometry={nodes.Cylinder246_Bean_Bag_0_2.geometry} material={material} />
                </group>
            </group>
        </group>
    );
};

useGLTF.preload('/bean_bag_chair.glb');
['/leatherbrown.png', '/carrybag.png', '/denimblack.png', '/denimblue.png', '/leatherjacket.png', '/denimlightblue.png'].forEach(useTexture.preload);