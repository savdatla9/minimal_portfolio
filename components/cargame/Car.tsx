"use client";

import * as THREE from "three";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import { useBox, useRaycastVehicle, useCylinder } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { useControls } from "./Controls";

type CarHandle = THREE.Group;

const WHEEL_RADIUS = 0.4;
const WHEEL_WIDTH = 0.3;

const Car = forwardRef<CarHandle>((_, ref) => {
    // Car chassis body
    const [chassisRef, chassisApi] = useBox(() => ({
        allowSleep: true,
        args: [1.6, 0.5, 3.2],
        mass: 450,
        position: [-45, 1, 0],
        angularDamping: 0.5,
        linearDamping: 0.05,
    }));

    // Four wheels (visual + physics)
    const wheelInfos = useMemo(() => {
        const halfWidth = 0.75;
        const frontZ = 1.2;
        const backZ = -1.2;

        return [
            { isFrontWheel: true, position: [-halfWidth, -0.2, frontZ] }, // FL
            { isFrontWheel: true, position: [ halfWidth, -0.2, frontZ] }, // FR
            { isFrontWheel: false, position: [-halfWidth, -0.2, backZ] }, // RL
            { isFrontWheel: false, position: [ halfWidth, -0.2, backZ] }, // RR
        ].map((w) => ({
            ...w,
            radius: WHEEL_RADIUS,
            directionLocal: [0, -1, 0],
            axleLocal: [-1, 0, 0],
            suspensionStiffness: 30,
            suspensionRestLength: 0.35,
            maxSuspensionForce: 100000,
            dampingRelaxation: 2.3,
            dampingCompression: 4.4,
            frictionSlip: 2.0,
            rollInfluence: 0.01,
            customSlidingRotationalSpeed: -30,
            useCustomSlidingRotationalSpeed: true,
        }));
    }, []);

    const [wheelFL, wheelApiFL] = useWheel();
    const [wheelFR, wheelApiFR] = useWheel();
    const [wheelRL, wheelApiRL] = useWheel();
    const [wheelRR, wheelApiRR] = useWheel();

    const wheels = [wheelFL, wheelFR, wheelRL, wheelRR] as any;

    const [vehicleRef, vehicleApi] = useRaycastVehicle(() => ({
        chassisBody: chassisRef,
        wheels,
        wheelInfos,
        indexForwardAxis: 2,
        indexRightAxis: 0,
        indexUpAxis: 1,
    }));

    // expose vehicle group to parent for chase cam
    useImperativeHandle(ref, () => vehicleRef.current as unknown as THREE.Group, [vehicleRef]);

    // Controls
    const { forward, backward, left, right, brake, reset } = useControls();

    // Driving params
    const engineForce = 1600; // Nm-like
    const maxSteer = 0.35;    // radians
    const brakeForce = 40;

    useEffect(() => {
        if (!reset) return;
        chassisApi.position.set(-45, 1, 0);
        chassisApi.velocity.set(0, 0, 0);
        chassisApi.angularVelocity.set(0, 0, 0);
        chassisApi.rotation.set(0, 0, 0);
    }, [reset, chassisApi]);

    useFrame((_, dt) => {
        // steering (front wheels 0,1)
        const steerValue = (left ? 1 : 0) - (right ? 1 : 0);
        const steering = steerValue * maxSteer;
        vehicleApi.setSteeringValue(steering, 0);
        vehicleApi.setSteeringValue(steering, 1);

        // engine force (rear wheels 2,3)
        const force = (forward ? 1 : 0) - (backward ? 1 : 0);
        const applied = force * engineForce;
        vehicleApi.applyEngineForce(applied, 2);
        vehicleApi.applyEngineForce(applied, 3);

        // braking (all wheels)
        const brk = brake ? brakeForce : 0;
        for (let i = 0; i < 4; i++) vehicleApi.setBrake(brk, i);

        // HUD speed event
        const linVel = new THREE.Vector3();
        chassisApi.velocity.subscribe((v) => linVel.set(v[0], v[1], v[2]));
        const kmh = linVel.length() * 3.6;
        window.dispatchEvent(new CustomEvent("car-speed", { detail: kmh }));

        // simple lap gate trigger: when x < -49 near z≈0 and heading forward
        let pos = new THREE.Vector3();
        (chassisRef.current as any)?.getWorldPosition(pos);
        if (pos.x < -49.5 && Math.abs(pos.z) < 2.5 && Math.abs(kmh) > 5) {
            window.dispatchEvent(new CustomEvent("lap-complete"));
        }
    });

    return (
        <group ref={vehicleRef as any}>
            {/* Chassis */}
            <mesh ref={chassisRef} castShadow receiveShadow>
                <boxGeometry args={[1.6, 0.5, 3.2]} />
                <meshStandardMaterial color="#4db3ff" metalness={0.4} roughness={0.6} />
            </mesh>

            {/* Wheels (visuals only; physics bodies are separate) */}
            <WheelVisual refObj={wheelFL} />
            <WheelVisual refObj={wheelFR} />
            <WheelVisual refObj={wheelRL} />
            <WheelVisual refObj={wheelRR} />
        </group>
    );
});

export default Car;

// ---- helpers ----

function useWheel() {
    return useCylinder(() => ({
        mass: 10,
        args: [WHEEL_RADIUS, WHEEL_RADIUS, WHEEL_WIDTH, 14],
        type: "Kinematic",
        collisionFilterGroup: 0, // wheels shouldn't collide
    }));
}

function WheelVisual({ refObj }: { refObj: any }) {
    return (
        <mesh ref={refObj} castShadow receiveShadow rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[WHEEL_RADIUS, WHEEL_RADIUS, WHEEL_WIDTH, 16]} />
            <meshStandardMaterial color="#111" />
        </mesh>
    );
};