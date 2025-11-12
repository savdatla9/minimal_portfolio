"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { MutableRefObject, useRef } from "react";
import * as THREE from "three";

export default function ChaseCam({ targetRef }: { targetRef: MutableRefObject<THREE.Object3D> }) {
    const { camera } = useThree();
    const vel = useRef(new THREE.Vector3());

    useFrame(() => {
        if (!targetRef.current) return;
        // desired camera position behind and above the car
        const target = targetRef.current;
        const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(target.quaternion).normalize();
        const desired = target.position.clone().addScaledVector(dir, -8).add(new THREE.Vector3(0, 4, 0));

        // smooth follow
        camera.position.lerp(desired, 0.1);
        camera.lookAt(target.position.clone().add(new THREE.Vector3(0, 1, 0)));
    });

    return null;
};