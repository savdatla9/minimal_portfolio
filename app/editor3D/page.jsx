"use client";

import { 
    useState, useMemo, useRef, 
    Suspense, useEffect, 
} from "react";
import * as THREE from 'three'; 
import { useTheme } from "next-themes";
import { Canvas, useFrame, useThree } from '@react-three/fiber'; 
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing';
import {
    Text3D, useGLTF, Text, Grid, Select, TransformControls,
    OrbitControls, useTexture, GizmoHelper, GizmoViewport, 
    useVideoTexture, PositionalAudio,
} from '@react-three/drei';
import { 
    Plus, BoxIcon, ImageIcon, Film, 
    Upload, Grip, CassetteTape, 
    CaseSensitive, Square, BookImage,
} from 'lucide-react';
import { PlainAnimator } from 'three-plain-animator/lib/plain-animator';
import { Move3d, Rotate3d, Scale3d  } from 'lucide-react';

// function SelectObj({ objectRef, visible=true }) {
//     const { scene } = useThree();
//     const helperRef = useRef(null);
//     const boxRef = useRef(new THREE.Box3());

//     // Create + cleanup helper
//     useEffect(() => {
//         if (!objectRef.current) return;

//         const helper = new THREE.Box3Helper(boxRef.current, '#ffb900');
//         helper.visible = visible;
//         helperRef.current = helper;
//         scene.add(helper);

//         return () => {
//             scene.remove(helper);
//             helper.geometry.dispose();
//             helper.material.dispose();
//         };
//     }, [scene, objectRef]);

//     // React to visible prop
//     useEffect(() => {
//         if (helperRef.current) {
//         helperRef.current.visible = visible;
//         }
//     }, [visible]);

//     // Update bounding box every frame (for moving objects)
//     useFrame(() => {
//         if (!objectRef.current || !helperRef.current) return;
//         boxRef.current.setFromObject(objectRef.current);
//     });

//     return null; // it's a pure helper, nothing to render as JSX
// };

function SelectedBoxHelper({ target }) {
    const { scene } = useThree();
    const helperRef = useRef(null);

    useEffect(() => {
        if (!target) return;

        const helper = new THREE.BoxHelper(target, 0x22c55e); // green
        helperRef.current = helper;
        scene.add(helper);

        return () => {
            scene.remove(helper);
            helper.geometry?.dispose?.();
            helper.material?.dispose?.();
            helperRef.current = null;
        };
    }, [scene, target]);

    useFrame(() => {
        if (!helperRef.current || !target) return;
        helperRef.current.update(); // keeps box in sync while moving/rotating/scaling
    });

    return null;
};

async function exportGLB(root) {
    const { GLTFExporter } = await import("three/examples/jsm/exporters/GLTFExporter.js");
    const exporter = new GLTFExporter();

    // clone & remove noExport objects (grid, floorplan underlay, etc.)
    const clone = root.clone(true);
    const toRemove = [];

    clone.traverse((obj) => {
        if (obj?.userData?.noExport) toRemove.push(obj);
    });

    toRemove.forEach((obj) => obj.parent?.remove(obj));

    return new Promise((resolve, reject) => {
        exporter.parse(
            clone,
            (res) => {
                const arrayBuffer = res;
                const blob = new Blob([arrayBuffer], { type: "model/gltf-binary" });
                resolve(blob);
            },
            (err) => reject(err),
            { binary: true }
        );
    });
};

function Box({
    item,
    isSelected,
    onSelect,
    onPick,
    // mode,
    // onDraggingChange,
    // onChangeTransform,
}) {
    const meshRef = useRef(); 

    if (!isSelected) {
        return (
            <group 
                ref={meshRef}
                position={item.position}
                scale={item.scale}
                rotation={item.rotation || [0, 0, 0]}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(item.id);
                }}
                onPointerDown={(e)=> {e.stopPropagation(); onPick(e.object)}}
            >
                <mesh
                    position={[0, 0.25, 0]}
                    scale={0.5} castShadow receiveShadow
                >
                    <boxGeometry args={[1, 1, 1]} />

                    <meshPhysicalMaterial color={item.color} />
                </mesh>
            </group>
            
        );
    };

    return (
        // <PivotControls rotation={[0, -Math.PI / 2, 0]} anchor={[1, -1, -1]} scale={75} depthTest={false} fixed lineWidth={5}>
            <group 
                ref={meshRef}
                position={item.position}
                scale={item.scale}
                rotation={item.rotation}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(item.id);
                }}
                onPointerDown={(e)=> {e.stopPropagation(); onPick(e.object)}}
            >
                <mesh
                    position={[0, 0.25, 0]}
                    scale={0.5}
                    castShadow receiveShadow
                >
                    <boxGeometry args={[1, 1, 1]} />

                    <meshPhysicalMaterial color={item.color} />
                </mesh>
            </group>
        // </PivotControls>
    );
};

function Model({
    item,
    isSelected,
    onSelect,
    onPick,
    // mode,
    // onDraggingChange,
    // onChangeTransform,
}) {
    const gltf = useGLTF(item.path);

    const scene = useMemo(() => {
        const s = gltf.scene.clone(true);
        
        s.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            };
        });

        return s;
    }, [gltf.scene]);

    if(!isSelected){
        return <primitive
            object={scene}
            position={item.position} 
            scale={item.scale}
            rotation={item.rotation}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(item.id);
            }}
            onPointerDown={(e)=> {e.stopPropagation(); onPick(e.object)}}
            castShadow receiveShadow
        />
    };

    return (
        <primitive
            object={scene}
            position={item.position} 
            scale={item.scale}
            rotation={item.rotation}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(item.id);
            }}
            onPointerDown={(e)=> {e.stopPropagation(); onPick(e.object)}}
            castShadow receiveShadow
        />
    );
};

function Image({
    item,
    isSelected,
    onSelect,
    // mode,
    // onDraggingChange,
    // onChangeTransform,
}) {
    const texture = useTexture(item.path);

    if (!isSelected) {
        return <group
            position={item.position}
            rotation={item.rotation}
            scale={item.scale}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(item.id);
            }}
        >
            <mesh
                position={[0, 1.25, 0]}
                castShadow receiveShadow
            >
                <planeGeometry args={[3, 2.5]} />

                <meshPhysicalMaterial map={texture} side={THREE.DoubleSide} />
            </mesh>
        </group>
    };

    return (
        // <PivotControls rotation={[0, -Math.PI / 2, 0]} anchor={[1, -1, -1]} scale={75} depthTest={false} fixed lineWidth={2}>
            <group
                position={item.position}
                rotation={item.rotation}
                scale={item.scale}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(item.id);
                }}
            >
                <mesh
                    position={[0, 1.25, 0]}
                    castShadow receiveShadow
                >
                    <planeGeometry args={[3, 2.5]} />

                    <meshPhysicalMaterial map={texture} side={THREE.DoubleSide} />
                </mesh>
            </group>
        // </PivotControls>
    );
};

function TextT({
    item,
    isSelected,
    onSelect,
    onPick,
    // mode,
    // onDraggingChange,
    // onChangeTransform,
}){
    if(!isSelected){
        return <group
            position={item.position}
            rotation={item.rotation}
            scale={item.scale}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(item.id);
            }}
            onPointerDown={(e)=> {e.stopPropagation(); onPick(e.object)}}
        > 
            <mesh
                position={[-0.75, 0, 0]}
                rotation={[0, 0, 0]}
                scale={[0.75, 0.75, 0.15]}
            >
                <Text3D
                    font="/Inter_Regular.json" 
                    size={0.75} height={1.35}
                    curveSegments={12} bevelEnabled
                    bevelThickness={0.02} bevelOffset={0}
                    bevelSize={0.01} bevelSegments={3}
                    letterSpacing={0} lineHeight={0.5} 
                    castShadow receiveShadow
                >
                    {item.name}

                    <meshPhysicalMaterial color={item.color} />
                </Text3D>
            </mesh>
        </group>
    };

    return(
        // <PivotControls rotation={[0, -Math.PI / 2, 0]} anchor={[1, -1, -1]} scale={75} depthTest={false} fixed lineWidth={2}>
            <group
                position={item.position}
                rotation={item.rotation}
                scale={item.scale}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(item.id);
                }}
                onPointerDown={(e)=> {e.stopPropagation(); onPick(e.object)}}
            > 
                <mesh
                    position={[-0.75, 0, 0]}
                    rotation={[0, 0, 0]}
                    scale={[0.75, 0.75, 0.2]}
                >
                    <Text3D
                        font="/Inter_Regular.json" 
                        size={0.75} height={1.35}
                        curveSegments={12} bevelEnabled
                        bevelThickness={0.02} bevelOffset={0}
                        bevelSize={0.01} bevelSegments={3}
                        letterSpacing={0} lineHeight={0.5} 
                        castShadow receiveShadow
                    >
                        {item.name}

                        <meshPhysicalMaterial color={item.color} />
                    </Text3D>
                </mesh>
            </group>
        // </PivotControls>
    );
};

function Video({ 
    item,
    isSelected,
    onSelect,
    onPick,
    // mode,
    // onDraggingChange,
    // onChangeTransform,
}) {
    if (!item.path) return null;

    const [isPlaying, setIsPlaying] = useState(false);

    const texture = useVideoTexture(item.path, {
        start: isPlaying, loop: true, 
        crossOrigin: "anonymous",
        muted: !isPlaying, volume: 1.0,
    });

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.x = -1;
    texture.offset.x = 1;

    // Control the underlying <video> element
    useEffect(() => {
        const videoEl = texture?.source?.data;
        if (!videoEl) return;

        if (isPlaying) {
            videoEl.play().catch(() => {});
        } else {
            videoEl.pause();
        };
    }, [isPlaying, texture]);

    useFrame(() => {
        texture.muted = false
    });

    const width = 3, height = 2;

    if (!isSelected) {
        return <group
            position={item.position}
            rotation={item.rotation}
            scale={item.scale}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(item.id);
            }}
            onPointerDown={(e)=> {e.stopPropagation(); onPick(e.object)}}
        >
            {/* Video plane */}
            <mesh 
                castShadow receiveShadow 
                position={[0, 1, 0]}
            >
                <planeGeometry args={[width, height]} />

                <meshPhysicalMaterial
                    map={texture} side={2} 
                    toneMapped={false}
                />
            </mesh>

            {/* Play/Pause button "on" the plane (just below it) */}
            <mesh
                position={[0, 1, 0.05]}
            >
                <Text
                    fontSize={0.25}
                    position={[0, 0, 0.01]}
                    anchorX="center"
                    anchorY="middle"
                    color="#ffb900"
                >
                    ▶️
                </Text>
            </mesh>
        </group>
    };
    
    return (
        // <PivotControls rotation={[0, -Math.PI / 2, 0]} anchor={[1, -1, -1]} scale={75} depthTest={false} fixed lineWidth={2}>
            <group
                position={item.position}
                rotation={item.rotation}
                scale={item.scale}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(item.id);
                }}
                onPointerDown={(e)=> {e.stopPropagation(); onPick(e.object)}}
            >
                {/* Video plane */}
                <mesh 
                    castShadow receiveShadow 
                    position={[0, 1, 0]}
                >
                    <planeGeometry args={[width, height]} />

                    <meshPhysicalMaterial
                        map={texture} side={2} 
                        toneMapped={false}
                    />

                    {/* <PositionalAudio 
                        url={item.path} loop 
                        distance={6} autoplay
                    /> */}
                </mesh>

                {/* Play/Pause button "on" the plane (just below it) */}
                <mesh
                    position={[0, 1, 0.05]}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsPlaying((p) => !p);
                    }}
                >
                    <Text
                        fontSize={0.25}
                        position={[0, 0, 0.01]}
                        anchorX="center"
                        anchorY="middle"
                        color="#ffb900"
                    >
                        {isPlaying ? '⏸️' : '▶️'}
                    </Text>
                </mesh>
            </group>
        // </PivotControls>
    );
};

function Audio({
    item,
    isSelected,
    onSelect,
    onPick,
    // mode,
    // onDraggingChange,
    // onChangeTransform,
}){
    if (!item.path) return null;

    const [play, setPlay] = useState(false);

    const texture = useTexture("/music.png");

    // A small glowing sphere as the sound source
    if(!isSelected){   
        return <group 
            position={item.position}
            rotation={item.rotation}
            scale={item.scale}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(item.id);
            }}
            onPointerDown={(e)=> {e.stopPropagation(); onPick(e.object)}}
        >
            <mesh 
                position={[0, 0.5, 0]} 
                castShadow receiveShadow
            >
                <planeGeometry args={[1, 1]} />

                <meshPhysicalMaterial
                    map={texture} side={2} 
                    toneMapped={false}
                />
            </mesh>

            <mesh
                position={[0, 0.5, 0.05]}
            >
                <Text
                    fontSize={0.25}
                    position={[0, 0, 0.01]}
                    anchorX="center"
                    anchorY="middle"
                    color="#ffb900"
                >
                    ▶️
                </Text>
            </mesh>
        </group>
    };

    return (
        // <PivotControls rotation={[0, -Math.PI / 2, 0]} anchor={[1, -1, -1]} scale={75} depthTest={false} fixed lineWidth={2}>
            <group 
                position={item.position}
                rotation={item.rotation}
                scale={item.scale}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(item.id);
                }}
                onPointerDown={(e)=> {e.stopPropagation(); onPick(e.object)}}
            >
                <mesh 
                    position={[0, 0.5, 0]} 
                    castShadow receiveShadow
                >
                    <planeGeometry args={[1, 1]} />

                    <meshPhysicalMaterial
                        map={texture} side={2} 
                        toneMapped={false}
                    />

                    {/* Positional audio attached to this mesh */}
                    {play && <PositionalAudio 
                            url={item.path} 
                            distance={6} 
                            loop autoplay 
                        /> 
                    }
                </mesh>

                <mesh
                    position={[0, 0.5, 0.05]}
                    onClick={(e) => {
                        e.stopPropagation();
                        setPlay((p) => !p);
                    }}
                >
                    <Text
                        fontSize={0.25}
                        position={[0, 0, 0.01]}
                        anchorX="center"
                        anchorY="middle"
                        color="#ffb900"
                    >
                        {play ? "⏸️" : "▶️"}
                    </Text>
                </mesh>
            </group>
        // </PivotControls>
    );
};

function Sprites({ 
    item,
    isSelected,
    onSelect,
    onPick,
}) {
    if(!item.path) return null;

    // Good defaults for sprites
        // const spriteTexture = new  THREE.TextureLoader().load(texturePath)
    const spriteTexture = useTexture(item.path);
    const animator =  new  PlainAnimator(spriteTexture, item.row, item.col, item.frames, item.fps);
    const texture = animator.init();    

    useFrame(()=>{
        animator.animate();
    });

    if(!isSelected){
        return <group
            position={item.position}
            rotation={item.rotation}
            scale={item.scale}
            onClick={(e) => {
                e.stopPropagation();    
                onSelect(item.id);
            }}
            onPointerDown={(e)=> {e.stopPropagation(); onPick(e.object)}}
            castShadow receiveShadow
        >
            <mesh 
                scale={[0.1, 0.1, 0.1]}
                position={[0, 1.26, 0]}
            >
                <planeGeometry args={[25, 25]} />

                <meshPhysicalMaterial map={texture} depthTest={false} side={2} transparent />
            </mesh>
        </group>
    };

    return(
        <group
            position={item.position}
            rotation={item.rotation}
            scale={item.scale}
            onClick={(e) => {
                e.stopPropagation();    
                onSelect(item.id);
            }}
            onPointerDown={(e)=> {e.stopPropagation(); onPick(e.object)}}
            castShadow receiveShadow
        >
            <mesh 
                scale={[0.1, 0.1, 0.1]}
                position={[0, 1.26, 0]}
            >
                <planeGeometry args={[25, 25]} />

                <meshPhysicalMaterial map={texture} depthTest={false} side={2} transparent />
            </mesh>
        </group>
    );
};

function Particles({ 
    item, 
    isSelected, 
    onSelect, 
    onPick,
}) {
    const pointsRef = useRef();
    const texture = useTexture(item.path);

    // Pre-generate random positions
    const initialPositions = useMemo(() => {
        const positions = new Float32Array(item.count * 3);

        for (let i = 0; i < item.count; i++) {
            let i3 = i * 3;

            positions[i3 + 0] = (Math.random() - 0.5) * item.spread; // x
            positions[i3 + 1] = Math.random() * (item.spread * 0.5);   // y (0 to spread/2)
            positions[i3 + 2] = (Math.random() - 0.5) * item.spread; // z
        };

        return positions;
    }, [item.count, item.spread]);

    useFrame((_, delta) => {
        if (!pointsRef.current) return;

        if(isSelected){
            const pos = pointsRef.current.geometry.attributes.position;
            const arr = pos.array;

            for(let i = 0; i < item.count; i++){
                const i3 = i * 3;

                // Move particles upward in Y
                arr[i3 + 1] += delta * item.speed;

                // If too high, wrap back down
                if (arr[i3 + 1] > item.spread * 0.5) {
                    arr[i3 + 1] = 0;
                };
            };

            pos.needsUpdate = true;
        };
    });

    return (
        <points 
            ref={pointsRef} 
            position={item.position}
            rotation={item.rotation}
            scale={item.scale}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(item.id);
            }}
            onPointerDown={(e)=> {e.stopPropagation(); onPick(e.object)}}
            castShadow receiveShadow
        >
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    array={initialPositions}
                    count={item.count}
                    itemSize={3}
                />
            </bufferGeometry>
            
            <pointsMaterial
                map={texture} size={item.size} color={item.color}
                sizeAttenuation={true} depthWrite={false} 
                opacity={1} blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

function Scene({
    objects,
    selectedId,
    setSelectedId,
    theme, ref, mode
}) {
    const [isDragging, setIsDragging] = useState(false);

    const selected = useMemo(
        () => objects.find((o) => o.id === selectedId),
        [objects, selectedId]
    );

    const [select, setSelect] = useState(null);

    const { camera, gl } = useThree();

    const tctrl = useRef(null);

    // Attach TransformControls to the selected object
    useEffect(() => {
        if (!tctrl.current) return;
        if (select) tctrl.current.attach(select);
        else tctrl.current.detach();
    }, [select]);

    return (
        <>
            {/* Lights */}
            <ambientLight intensity={.5} />

            <directionalLight
                position={[5, 10, 5]}
                intensity={1}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
            />

            <EffectComposer>
                <Bloom luminanceThreshold={2} mipmapBlur />

                <ToneMapping />
            </EffectComposer>

            <Grid 
                position={[0, 0, 0]} args={[10, 10]} cellSize={0.5} renderOrder={-1}
                cellThickness={0.75} sectionSize={10} sectionThickness={1.5} side={THREE.DoubleSide}
                fadeDistance={30} fadeStrength={1} followCamera={false} infiniteGrid={true} raycast={null}
                cellColor={theme==='dark'?'lightskyblue':'grey'} sectionColor={theme==='dark'?'dodgerblue':'black'}
                // onPointerDown={()=>setSelect(null)}
            />

            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />

                <shadowMaterial transparent color={theme==='dark'?'grey':'black'} opacity={0.4} />
            </mesh>

            {/* All objects */}
            <Suspense fallback={null}>
                <Select multiple={false} onChange={setSelectedId}>
                    <group ref={ref}>
                        {objects.map((item) => {
                            const commonProps = {
                                key: item.id, item,
                                isSelected: item.id === selectedId,
                                onSelect: setSelectedId, 
                                onPick: (obj)=>setSelect(obj),
                                // mode: transformMode,
                                // onDraggingChange: setIsDragging,
                                // onChangeTransform: onTransformChange,
                            };

                            if (item.type === "model") {
                                return <Model {...commonProps} />
                            };

                            if(item.type === "image") {
                                return <Image {...commonProps} />
                            };

                            if(item.type === "text") {
                                return <TextT {...commonProps} />
                            };

                            if(item.type === "video") {
                                return <Video {...commonProps} />
                            };

                            if(item.type === "audio") {
                                return <Audio {...commonProps} />
                            };

                            if(item.type === "sprite") {
                                return <Sprites {...commonProps} />
                            };

                            if(item.type === "particles") {
                                return <Particles {...commonProps} />
                            };

                            return <Box {...commonProps} />
                        })}
                    </group>
                </Select>
            </Suspense>     

            <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                <GizmoViewport 
                    axisHeadScale={1} 
                    axisColors={['red', 'green', 'blue']} 
                />
            </GizmoHelper>

            {/* TransformControls (attach/detach via ref) */}
            {(selected && select!==null) && <TransformControls
                ref={tctrl}
                args={[camera, gl.domElement]}
                mode={mode}
                onDraggingChange={(dragging) => setIsDragging(dragging)}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
            />}

            {/* Box helper for selected */}
            {selected && <SelectedBoxHelper target={select} />}

            {/* Orbit controls (disabled while dragging gizmo) */}
            <OrbitControls
                makeDefault
                enabled={!isDragging}
                target={selected ? selected.position : [0, 0, 0]}
            />
        </>
    );
};

let nextId = 1;

export default function ThreeEditorPage() {
    const [objects, setObjects] = useState([]);
    const [selectedId, setSelectedId] = useState(0);
    const [transformMode, setTransformMode] = useState("translate"); // translate | rotate | scale
    
    const fileInputRef1 = useRef(null);
    const fileInputRef2 = useRef(null);
    const fileInputRef3 = useRef(null);
    const fileInputRef4 = useRef(null);
    const fileInputRef5 = useRef(null);
    const fileInputRef6 = useRef(null);
    // const exportRef = useRef(null);
    const groupRef = useRef(null);

    const { theme } = useTheme();

    const selected = objects.find((o) => o.id === selectedId) || (objects.length ? objects[0] : null);

    function updateSelected(partial) {
        if (!selected) return;
        setObjects((prev) =>
            prev.map((obj) =>
                obj.id === selected.id ? { ...obj, ...partial } : obj
            )
        );
    };

    function handleAddBox() {
        const id = nextId++;
        const newBox = {
            id,
            type: "box",
            name: `Box ${id}`,
            color: "#00aaff",
            position: [parseFloat((Math.random() * 4 - 2).toFixed(2)), 0, parseFloat((Math.random() * 4 - 2).toFixed(2))],
            scale: [1, 1, 1],
            rotation: [0, 0, 0],
        };

        setObjects((prev) => [...prev, newBox]);
        setSelectedId(id);
    };

    function handleAddText(){
        const id = nextId++;

        const newText = {
            id,
            type: "text",
            name: "Enter Text",
            color: "#ff4500",
            position: [0, 0, 0],
            scale: [1, 1, 1],
            rotation: [0, 0, 0],
        };
        setObjects((prev) => [...prev, newText]);
        setSelectedId(id);
    };

    function handleUploadVideo(e){
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);

        const id = nextId++;    
        const newVideo = {
            id,
            type: "video",
            name: file.name,
            path: url, // blob URL
            position: [0, 0, 0],
            scale: [1, 1, 1],
            rotation: [0, 0, 0],       
        };
        setObjects((prev) => [...prev, newVideo]);
        setSelectedId(id);

        // reset input so same file can be selected again later
        e.target.value = "";
    };

    function handleUploadAudio(e){
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);

        const id = nextId++;    
        const newAudio = {
            id,
            type: "audio",
            name: file.name,
            path: url, // blob URL
            position: [0, 0, 0],
            scale: [1, 1, 1],
            rotation: [0, 0, 0],       
        };
        setObjects((prev) => [...prev, newAudio]);
        setSelectedId(id);

        // reset input so same file can be selected again later
        e.target.value = "";
    };
    
    function handleUploadModel(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);

        const id = nextId++;
        const newModel = {
            id,
            type: "model",
            name: file.name,
            path: url, // blob URL
            position: [0, 0.15, 0],
            scale: [1, 1, 1],
            rotation: [0, 0, 0],
        };
        setObjects((prev) => [...prev, newModel]);
        setSelectedId(id);

        // reset input so same file can be selected again later
        e.target.value = "";
    };

    function handleUploadImage(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);

        const id = nextId++;
        const newImage = {
            id,
            type: "image",
            name: file.name,
            path: url, // blob URL
            position: [0, 0, 0],
            scale: [1, 1, 1],
            rotation: [0, 0, 0],
        };
        setObjects((prev) => [...prev, newImage]);
        setSelectedId(id);

        // reset input so same file can be selected again later
        e.target.value = "";
    };

    function handleUploadSprite(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);

        const id = nextId++;
        const newSprite = {
            id,
            type: "sprite",
            name: file.name,
            path: url, // blob URL
            frames: 4, // total frames horizontally
            fps: 8, // frames per second
            play: true,
            loop: true,
            row: 2, // number of rows
            col: 2, // number of columns
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
        };
        setObjects((prev) => [...prev, newSprite]);
        setSelectedId(id);

        // reset input so same file can be selected again later
        e.target.value = "";
    };

    function handleUploadParticles(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);

        const id = nextId++;
        const newParticle = {
            id,
            type: "particles",
            name: file.name,
            path: url, // blob URL
            size: 0.5,
            count: 2500,
            spread: 100,
            speed: 1,
            color: "#ffffff",
            position: [0, 0.25, 0],
            scale: [1, 1, 1],
            rotation: [0, 0, 0],
        };
        setObjects((prev) => [...prev, newParticle]);
        setSelectedId(id);

        // reset input so same file can be selected again later
        e.target.value = "";
    };

    function handleUploadModelClick() {
        fileInputRef1.current?.click();
    };

    function handleUploadImageClick() {
        fileInputRef2.current?.click();
    };

    function handleUploadVideoClick() {
        fileInputRef3.current?.click();
    };

    function handleUploadAudioClick() {
        fileInputRef4.current?.click();
    };

    function handleUploadSpriteClick() {
        fileInputRef5.current?.click();
    };

    function handleUploadParticleClick() {
        fileInputRef6.current?.click();
    };

    function handleDeleteSelected() {
        if (!selected) return;

        setObjects((prev) => prev.filter((obj) => obj.id !== selected.id));

        setSelectedId((prevId) => {
            const remaining = objects.filter((o) => o.id !== prevId);
            return remaining.length ? remaining[0].id : null;
        });
    };

    async function doExport() {
        if (!groupRef.current) return;

        try {
            const blob = await exportGLB(groupRef.current);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "house.glb";
            a.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error(e);
            console.warn("Export failed. Check console.");
        };
    };

    // function handleTransformChange(id, object) {
    //     const position = [object.position.x, object.position.y, object.position.z];
    //     const rotation = [object.rotation.x, object.rotation.y, object.rotation.z];
    //     const scale = [object.scale.x, object.scale.y, object.scale.z];

    //     setObjects((prev) =>
    //         prev.map((obj) =>
    //             obj.id === id ? { ...obj, position, scale, rotation } : obj
    //         )
    //     );
    // };

    return (
        <div className="flex h-[82vh] rounded-sm border border-b-5">
            {/* ------------------------- Left Panel (UI) ------------------------- */}
            <div className="w-[30%] p-4 h-full overflow-y-auto border-r flex flex-col gap-3.5">
                <h1 className="text-2xl font-bold underline text-center">Three Js Editor</h1>

                {/* Objects list + add buttons */}
                <div>
                    <div className="flex justify-between mb-1.5 underline underline-offset items-center">
                        <span className="text-md font-bold">Objects</span> <span onClick={doExport}>Export Object</span>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center mb-2">
                        {/* Add Box/Cube 3D */}
                        <div>
                            <button
                                onClick={handleAddBox}
                                className="p-1.5 rounded flex items-center border cursor-pointer text-sm"
                            >
                                <Plus absoluteStrokeWidth />&nbsp;<Square absoluteStrokeWidth />
                            </button>
                        </div>

                        {/* Add Text 3D */}
                        <div>
                            <button
                                onClick={handleAddText}
                                className="p-1.5 rounded flex items-center border cursor-pointer text-sm"
                            >
                                <Plus absoluteStrokeWidth />&nbsp;<CaseSensitive absoluteStrokeWidth />
                            </button>
                        </div>

                        {/* Upload GLB */}
                        <div>
                            <button
                                onClick={handleUploadModelClick}
                                className="p-1.5 rounded flex items-center border cursor-pointer text-sm"
                            >
                                <Upload absoluteStrokeWidth />&nbsp;<BoxIcon absoluteStrokeWidth />
                            </button>

                            <input
                                ref={fileInputRef1} type="file" accept=".glb,.gltf"
                                style={{ display: "none" }} onChange={handleUploadModel}
                            />
                        </div>

                        {/* Upload Image */}
                        <div>
                            <button
                                onClick={handleUploadImageClick}
                                className="p-1.5 rounded flex items-center border cursor-pointer text-sm"
                            >
                                <Upload absoluteStrokeWidth />&nbsp;<ImageIcon absoluteStrokeWidth />
                            </button>

                            <input
                                ref={fileInputRef2} type="file" accept="image/*"
                                style={{ display: "none" }} onChange={handleUploadImage}
                            />
                        </div>

                        {/* Upload Video */}
                        <div>
                            <button
                                onClick={handleUploadVideoClick}
                                className="p-1.5 rounded flex items-center border cursor-pointer text-sm"
                            >
                                <Upload absoluteStrokeWidth />&nbsp;<Film absoluteStrokeWidth />
                            </button>

                            <input
                                ref={fileInputRef3} type="file" accept="video/*"
                                style={{ display: "none" }} onChange={handleUploadVideo}
                            />
                        </div>

                        {/* Upload Audio */}
                        <div>
                            <button
                                onClick={handleUploadAudioClick}
                                className="p-1.5 rounded flex items-center border cursor-pointer text-sm"
                            >
                                <Upload absoluteStrokeWidth />&nbsp;<CassetteTape absoluteStrokeWidth />
                            </button>

                            <input
                                ref={fileInputRef4} type="file" accept="audio/*"
                                style={{ display: "none" }} onChange={handleUploadAudio}
                            />
                        </div>

                        {/* Upload Sprite */}
                        <div>
                            <button
                                onClick={handleUploadSpriteClick}
                                className="p-1.5 rounded flex items-center border cursor-pointer text-sm"
                            >
                                <Upload absoluteStrokeWidth />&nbsp;<BookImage absoluteStrokeWidth />
                            </button>

                            <input
                                ref={fileInputRef5} type="file" accept="image/*"
                                style={{ display: "none" }} onChange={handleUploadSprite}
                            />
                        </div>

                        {/* Upload Particle Effects  */}
                        <div>
                            <button
                                onClick={handleUploadParticleClick}
                                className="p-1.5 rounded flex items-center border cursor-pointer text-sm"
                            >
                                <Upload absoluteStrokeWidth />&nbsp;<Grip absoluteStrokeWidth />
                            </button>

                            <input
                                ref={fileInputRef6} type="file" accept="image/png,image/jpeg"
                                style={{ display: "none" }} onChange={handleUploadParticles}
                            />
                        </div>
                    </div>

                    <div className="rounded border max-h-40 overflow-y-auto">
                        {objects.length === 0 ? (
                            <div className="p-4 text-md text-center">
                                No objects. Use buttons above to add one.
                            </div>
                        ) : objects.map((obj) => {
                            const active = obj.id === selectedId;

                            return (
                                <div
                                    key={obj.id}
                                    onClick={() => setSelectedId(obj.id)}
                                    className="p-0.5 text-sm cursor-pointer flex items-center justify-between"
                                    style={{ fontWeight: active ? 'bold' : 'normal' }}
                                >
                                    <span>
                                        {obj.name.length<20 ? obj.name : obj.name.substring(0, 20)+' ...'}
                                    </span>

                                    {obj.type === "box" && <span
                                    className="mr-0.5"
                                        style={{ backgroundColor: obj.color, width: 12, height: 12 }}
                                    >&nbsp;</span>}

                                    {obj.type === "model" && <span 
                                        className="text-sm"
                                    >
                                        🧊
                                    </span>} 

                                    {obj.type === "text" && <span 
                                        className="text-sm"
                                    >
                                        𝐓𝐭
                                    </span>} 
                                    
                                    {obj.type === "image" && <span 
                                        className="text-sm"
                                    >
                                        🖼️
                                    </span>}

                                    {obj.type === "video" && <span 
                                        className="text-sm"
                                    >
                                        🎞️
                                    </span>}

                                    {obj.type === "audio" && <span 
                                        className="text-sm"
                                    >
                                        ♪
                                    </span>}

                                    {obj.type === "sprite" && <span 
                                        className="text-sm"
                                    >
                                        🖼️
                                    </span>}

                                    {obj.type === "particles" && <span 
                                        className="text-sm"
                                    >
                                        ✨
                                    </span>}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Properties panel */}
                <div>
                    <div className="flex justify-between mb-2 items-center">
                        <span className="text-sm font-bold underline">Properties</span>

                        <button
                            onClick={handleDeleteSelected}
                            disabled={!selected}
                            className="text-white p-2 rounded font-bold bg-[red] text-sm"
                            style={{ cursor: selected ? "pointer" : "not-allowed", opacity: selected ? 1 : 0.4 }}
                        >
                            Delete
                        </button>
                    </div>

                    {selected ? (
                        <div className="flex flex-col gap-3">
                            {/* Name */}
                            <div>
                                <label className="block text-xs font-bold mb-1">
                                    Name
                                </label>

                                <input
                                    type="text"
                                    value={selected.name}
                                    onChange={(e) => updateSelected({ name: e.target.value })}
                                    className="h-8 p-0 border rounded w-full text-sm"
                                />
                            </div>

                            {/* Color only for boxes */}
                            {selected.type === "box" && (
                                <div>
                                    <label className="block text-xs mb-1">
                                        Color
                                    </label>

                                    <input
                                        type="color"
                                        value={selected.color}
                                        onChange={(e) => updateSelected({ color: e.target.value })}
                                        className="h-8 p-0 border rounded w-full text-sm"
                                    />
                                </div>
                            )}

                            {/* Color only for Text 3D */}
                            {selected.type === "text" && (
                                <div>
                                    <label className="block text-xs mb-1">
                                        Color
                                    </label>

                                    <input
                                        type="color"
                                        value={selected.color}
                                        onChange={(e) => updateSelected({ color: e.target.value })}
                                        className="h-8 p-0 border rounded w-full text-sm"
                                    />
                                </div>
                            )}

                            {/* Size for Sprite */}
                            {selected.type === "sprite" && (
                                <div className="flex flex-wrap gap-2">
                                    <div>
                                        <label className="block text-xs font-bold mb-1">
                                            Frames
                                        </label>

                                        <input
                                            type="number"
                                            min={1} step={1} value={selected.frames} 
                                            className="w-17 border text-sm rounded p-1"
                                            onChange={(e) => updateSelected({ frames: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold mb-1">
                                            F.P.S
                                        </label>

                                        <input
                                            type="number"
                                            min={1} step={1} value={selected.fps} 
                                            className="w-17 border text-sm rounded p-1"
                                            onChange={(e) => updateSelected({ fps: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold mb-1">
                                            Rows
                                        </label>

                                        <input
                                            type="number"
                                            min={0} step={1} value={selected.row} 
                                            className="w-17 border text-sm rounded p-1"
                                            onChange={(e) => updateSelected({ row: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold mb-1">
                                            Cols
                                        </label>

                                        <input
                                            type="number"
                                            min={0} step={1} value={selected.col} 
                                            className="w-16 border text-sm rounded p-1"
                                            onChange={(e) => updateSelected({ col: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Spead, Spped, Size, Count for Particles */}
                            {selected.type === "particles" && (
                                <div className="flex flex-wrap justify-between">
                                    <div>
                                        <label className="block text-xs mb-1">
                                            Speed
                                        </label>

                                        <input
                                            type="number"
                                            max={10} step={0.25}
                                            value={selected.speed} className="w-20 text-sm border rounded p-0.5"
                                            onChange={(e) => updateSelected({ speed: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs mb-1">
                                            Spread
                                        </label>

                                        <input
                                            type="number" step={1}
                                            value={selected.spread} className="w-20 text-sm border rounded p-0.5"
                                            onChange={(e) => updateSelected({ spread: e.target.value })}
                                        />
                                    </div>
                            
                                    <div>
                                        <label className="block text-xs mb-1">
                                            Size
                                        </label>        
                                        
                                        <input
                                            type="number" 
                                            min={0.1} max={10} step={0.1}
                                            value={selected.size} className="w-20 text-sm border rounded p-0.5"
                                            onChange={(e) => updateSelected({ size: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Position inputs */}
                            <span className="text-xs font-bold -mb-1.5">Position</span>

                            <div className="flex flex-wrap justify-between">
                                {["X", "Y", "Z"].map((axis, index) => (
                                    <div key={axis}>
                                        <input 
                                            type='number' min={0} step={0.1}
                                            value={selected.position[index]} 
                                            onChange={(e) => {
                                                if(e.target.value){
                                                    const value = parseFloat(e.target.value);
                                                    const newPos = [...selected.position];
                                                    newPos[index] = value;
                                                    updateSelected({ position: newPos });
                                                };
                                            }} 
                                            className="border rounded p-0.75 w-20"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Rotation inputs */}
                            <span className="text-xs font-bold -mb-1.5">Rotation</span>

                            <div className="flex flex-wrap justify-between">
                                {["X", "Y", "Z"].map((axis, index) => (
                                    <div key={axis}>           
                                        <input 
                                            type='number' min={0} step={0.1}
                                            value={selected.rotation[index]} 
                                            onChange={(e) => {
                                                if(e.target.value){
                                                    const value = parseFloat(e.target.value);
                                                    const newRotate = [...selected.rotation];
                                                    newRotate[index] = value;
                                                    updateSelected({ rotation: newRotate });
                                                };
                                            }} 
                                            className="border rounded p-0.75 w-20"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Scale inputs */}
                            <span className="text-xs font-bold -mb-1.5">Scale</span>

                            <div className="flex flex-wrap justify-between">
                                {["X", "Y", "Z"].map((axis, index) => (
                                    <div key={axis}>
                                        <input 
                                            type='number' min={0} step={0.1} 
                                            value={selected.scale[index]} 
                                            onChange={(e) => {
                                                if(e.target.value){
                                                    const value = parseFloat(e.target.value);
                                                    const newScale = [...selected.scale];
                                                    newScale[index] = value;
                                                    updateSelected({ scale: newScale });
                                                };
                                            }} 
                                            className="border rounded p-0.75 w-20"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-xs">
                            No object selected.
                        </div>
                    )}
                </div>

                <div className="text-xs mt-auto">
                    <b>Tip:</b> Drag with left mouse to orbit, right mouse to pan, scroll to
                    zoom. Use gizmo to transform the selected object.
                </div>
            </div>

            {/* -------------------------- Right Panel (3D) ------------------------ */}
            <div className="w-[70%] flex flex-1">
                <div className="absolute top-[12.5vh] left-[50vw] flex flex-row justify-evenly gap-3 z-20">
                    <div className="border-2 rounded-3xl p-[5px]" onClick={()=>setTransformMode('translate')}>
                        <Move3d />
                    </div>

                    <div className="border-2 rounded-3xl p-[5px]" onClick={()=>setTransformMode('rotate')}>
                        <Rotate3d />
                    </div>

                    <div className="border-2 rounded-3xl p-[5px]" onClick={()=>setTransformMode('scale')}>
                        <Scale3d />
                    </div>
                </div>

                <Canvas
                    shadows dpr={[1, 2]}
                    camera={{ position: [6, 6, 6], fov: 45 }}
                    style={theme==='dark' ? {background: '#0a0a0a'} : {background: '#f1f1f1'}}
                >
                    <Scene
                        objects={objects} selectedId={selectedId} ref={groupRef}
                        setSelectedId={setSelectedId} theme={theme} mode={transformMode}
                    />
                </Canvas>
            </div>
        </div>
    );
};