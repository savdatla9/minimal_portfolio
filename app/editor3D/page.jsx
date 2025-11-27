"use client";

import { 
    useState, useMemo, useRef, 
    Suspense, useEffect, 
} from "react";
import * as THREE from 'three'; 
import { Canvas, useFrame } from '@react-three/fiber'; 
// import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing';
import {
    Text3D, useGLTF, Text, Grid, useCursor,
    OrbitControls, useTexture, GizmoHelper, Outlines,
    GizmoViewport, useVideoTexture, PositionalAudio,
} from '@react-three/drei';
import { 
    Plus, BoxIcon, ImageIcon, Film, Upload,
    // BookImage, 
    CassetteTape, CaseSensitive, Square, GridIcon,
} from 'lucide-react';
import { useTheme } from "next-themes";

function Box({
    item,
    isSelected,
    onSelect,
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
            >
                <mesh
                    position={[0, 0.25, 0]}
                    scale={0.5} castShadow receiveShadow
                >
                    <boxGeometry args={[1, 1, 1]} />

                    <meshStandardMaterial color={item.color} />
                </mesh>
            </group>
            
        );
    };

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
        >
            <mesh
                position={[0, 0.25, 0]}
                scale={0.5}
                castShadow receiveShadow
            >
                <boxGeometry args={[1, 1, 1]} />

                <meshStandardMaterial color={item.color} />
            </mesh>
        </group>
    );
};

function Model({
    item,
    isSelected,
    onSelect,
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

    if (!isSelected) {
        return <primitive
            object={scene}
            position={item.position} 
            scale={item.scale}
            rotation={item.rotation}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(item.id);
            }}
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

                <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
            </mesh>
        </group>
    };

    return (
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

                <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
};

function TextT({
    item,
    isSelected,
    onSelect,
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

                    <meshBasicMaterial color={item.color} />
                </Text3D>
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

                    <meshBasicMaterial color={item.color} />
                </Text3D>
            </mesh>
        </group>
    );
};

function Video({ 
    item,
    isSelected,
    onSelect,
    // mode,
    // onDraggingChange,
    // onChangeTransform,
}) {
    if (!item.path) return null;

    const texture = useVideoTexture(item.path, {
        start: false, loop: true, 
        crossOrigin: "anonymous",
    });

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.x = -1;
    texture.offset.x = 1;

    const [isPlaying, setIsPlaying] = useState(false);

    // Control the underlying <video> element
    useEffect(() => {
        const videoEl = texture?.source?.data;
        if (!videoEl) return;

        if (isPlaying) {
            videoEl.muted = false;
            videoEl.play().catch(() => {});
        } else {
            videoEl.pause();
        };
    }, [isPlaying, texture]);

    const width = 3, height = 2;

    // Preserve aspect ratio
    // let planeWidth = 4;
    // let planeHeight = 2.25; // default 16:9
    // let aspect;
    // const videoEl = texture?.source?.data;

    // if (videoEl && videoEl.videoWidth && videoEl.videoHeight) {
    //     aspect = videoEl.videoWidth / videoEl.videoHeight;

    //     planeHeight = planeWidth / aspect; 
    // };

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
            {/* Video plane */}
            <mesh 
                castShadow receiveShadow 
                position={[0, 1, 0]}
            >
                <planeGeometry args={[width, height]} />

                <meshStandardMaterial
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
                    "▶️"
                </Text>
            </mesh>
        </group>
    };

    return (
        <group
            position={item.position}
            rotation={item.rotation}
            scale={item.scale}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(item.id);
            }}
        >
            {/* Video plane */}
            <mesh 
                castShadow receiveShadow 
                position={[0, 1, 0]}
            >
                <planeGeometry args={[width, height]} />

                <meshStandardMaterial
                    map={texture} side={2} 
                    toneMapped={false}
                />
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
                    {isPlaying ? "⏸️" : "▶️"}
                </Text>
            </mesh>
        </group>
    );
};

function Audio({
    item,
    isSelected,
    onSelect,
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
        >
            <mesh 
                position={[0, 0.5, 0]} 
                castShadow receiveShadow
            >
                <planeGeometry args={[1, 1]} />

                <meshBasicMaterial
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
                    "▶️"
                </Text>
            </mesh>
        </group>
    };

    return (
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
                position={[0, 0.5, 0]} 
                castShadow receiveShadow
            >
                <planeGeometry args={[1, 1]} />

                <meshBasicMaterial
                    map={texture} side={2} 
                    toneMapped={false}
                />

                {/* Positional audio attached to this mesh */}
                {play && <PositionalAudio url={item.path} distance={6} loop autoplay /> }
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
    );
};

// function Sprite({ 
//     item,
//     isSelected,
//     onSelect,
// }) {
//     if(!item.path) return null;

//     // const texture = useTexture(item.path);

//     // if (!texture) return null;

//     // // Good defaults for sprites
//     // texture.encoding = THREE.sRGBEncoding;
//     // texture.needsUpdate = true;

//     const texture = useTexture(item.path);

//     console.log("Sprite texture:", texture);

//     if(!isSelected){
//         return <group
//             position={item.position}
//             rotation={item.rotation}
//             scale={item.scale}
//             onClick={(e) => {
//                 e.stopPropagation();
//                 onSelect(item.id);
//             }}
//             castShadow receiveShadow
//             // id={key}
//         >
//             <sprite position={[0, 1.5, 0]}>
//                 <spriteMaterial
//                     map={texture}
//                     // transparent
//                     depthWrite={false}
//                     sizeAttenuation={true}
//                 />
//             </sprite>
//         </group>  
//     };

//     return (
//         <group
//             position={item.position}
//             rotation={item.rotation}
//             scale={item.scale}
//             onClick={(e) => {
//                 e.stopPropagation();
//                 onSelect(item.id);
//             }}
//             castShadow receiveShadow
//             // id={key}
//         >
//             <sprite 
//                 position={[0, 1.3, 0]}
//                 scale={2.5}
//             >
//                 <spriteMaterial
//                     map={texture}
//                     // transparent
//                     depthWrite={false}
//                     // setValues={item.size}
//                     sizeAttenuation={true}
//                 />
//             </sprite>

//             <SpriteAnimator
//                 position={[0, 1.5, 0]}
//                 startFrame={0}
//                 meshProps={{ frustumCulled: false, scale: item.size }}
//                 autoPlay={true}
//                 loop={true}
//                 numberOfFrames={16}
//                 textureImageURL={item.path}
//             />
//         </group>  
//     );
// };

function Particles({ 
    item, 
    isSelected, 
    onSelect, 
}) {
    const pointsRef = useRef();
    const texture = useTexture(item.path);

    // Pre-generate random positions
    const initialPositions = useMemo(() => {
        const positions = new Float32Array(item.count * 3);

        for (let i = 0; i < item.count; i++) {
            const i3 = i * 3;
            positions[i3 + 0] = (Math.random() - 0.5) * item.spread; // x
            positions[i3 + 1] = Math.random() * item.spread * 0.5;   // y (0 to spread/2)
            positions[i3 + 2] = (Math.random() - 0.5) * item.spread; // z
        };

        return positions;
    }, [item.count, item.spread]);

    useFrame((_, delta) => {
        if (!pointsRef.current) return;
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
    });

    if(!isSelected){
        return <points 
            ref={pointsRef} 
            position={item.position}
            rotation={item.rotation}
            scale={item.scale}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(item.id);
            }}
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
                blending={THREE.AdditiveBlending}
            />
        </points>
    };

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
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

function Scene({
    objects,
    selectedId,
    setSelectedId,
    // transformMode,
    // onTransformChange,
    theme, 
    // exportRef,
}) {
    // const [isDragging, setIsDragging] = useState(false);

    const selected = useMemo(
        () => objects.find((o) => o.id === selectedId),
        [objects, selectedId]
    );

    return (
        <>
            {/* Lights */}
            <ambientLight intensity={0.5} />

            <directionalLight
                position={[5, 10, 5]}
                intensity={1}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
            />

            {/* <EffectComposer>
                <Bloom luminanceThreshold={2} mipmapBlur />

                <ToneMapping />
            </EffectComposer> */}

            <Grid 
                position={[0, 0, 0]} args={[10, 10]} cellSize={0.5} renderOrder={-1}
                cellThickness={1.5} cellColor={theme==='dark'?'lightskyblue':'grey'}
                sectionSize={10} sectionThickness={1.5} sectionColor={theme==='dark'?'dodgerblue':'black'}
                fadeDistance={30} fadeStrength={1} followCamera={false} infiniteGrid={true} 
                side={THREE.DoubleSide}
            />

            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />

                <shadowMaterial transparent color={theme==='dark'?'white':'black'} opacity={0.4} />
            </mesh>

            {/* All objects */}
            <Suspense fallback={null}>
                <group>
                 {/* ref={exportRef} */}
                    {objects.map((item) => {
                        const commonProps = {
                            key: item.id, item,
                            isSelected: item.id === selectedId,
                            onSelect: setSelectedId, 
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

                        // if(item.type === "sprite") {
                        //     return <Sprite {...commonProps} />
                        // };

                        if(item.type === "particles") {
                            return <Particles {...commonProps} />
                        };

                        return <Box {...commonProps} />
                    })}
                </group>
            </Suspense>     

            <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
                <GizmoViewport 
                    axisHeadScale={1} labelColor={'white'}
                    axisColors={['red', 'green', 'blue']} 
                />
            </GizmoHelper>

            {/* Orbit controls (disabled while dragging gizmo) */}
            <OrbitControls
                makeDefault
                // enabled={!isDragging}
                target={selected ? selected.position : [0, 0, 0]}
            />
        </>
    );
};

let nextId = 1;

export default function ThreeEditorPage() {
    const [objects, setObjects] = useState([]);
    const [selectedId, setSelectedId] = useState(0);
    // const [transformMode, setTransformMode] = useState("translate"); // translate | rotate | scale
    
    const fileInputRef1 = useRef(null);
    const fileInputRef2 = useRef(null);
    const fileInputRef3 = useRef(null);
    const fileInputRef4 = useRef(null);
    // const fileInputRef5 = useRef(null);
    const fileInputRef6 = useRef(null);
    // const exportRef = useRef(null);

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
            position: [0, 0.5, 0],
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

    // function handleUploadSprite(e) {
    //     const file = e.target.files?.[0];
    //     if (!file) return;
    //     const url = URL.createObjectURL(file);

    //     const id = nextId++;
    //     const newSprite = {
    //         id,
    //         type: "sprite",
    //         name: file.name,
    //         size: 1.5 ,
    //         path: url, // blob URL
    //         position: [0, 0, 0],
    //         scale: [1, 1, 1],
    //         rotation: [0, 0, 0],
    //     };
    //     setObjects((prev) => [...prev, newSprite]);
    //     setSelectedId(id);

    //     console.log("Added sprite:", newSprite);

    //     // reset input so same file can be selected again later
    //     e.target.value = "";
    // };

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

    // function handleUploadSpriteClick() {
    //     fileInputRef5.current?.click();
    // };

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
                        <span className="text-md font-bold">Objects</span>
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
                        {/* <div>
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
                        </div> */}

                        {/* Upload Particle Effects  */}
                        <div>
                            <button
                                onClick={handleUploadParticleClick}
                                className="p-1.5 rounded flex items-center border cursor-pointer text-sm"
                            >
                                <Upload absoluteStrokeWidth />&nbsp;<GridIcon absoluteStrokeWidth />
                            </button>

                            <input
                                ref={fileInputRef6} type="file" accept="image/png,image/jpeg"
                                style={{ display: "none" }} onChange={handleUploadParticles}
                            />
                        </div>
                    </div>
                
                    {/* <div style={{ marginBottom: 8 }}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: 6,
                                alignItems: "center",
                            }}
                        >
                            <span style={{ fontSize: 13, fontWeight: 600 }}>Scene</span>
                        </div>
                        <button
                            onClick={handleExportScene}
                            style={{
                                padding: "4px 8px",
                                borderRadius: 4,
                                border: "1px solid",
                                cursor: "pointer",
                                fontSize: 12,
                            }}
                        >
                            Export Scene (GLB)
                        </button>
                    </div> */}

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
                                <label className="block text-xs mb-1">
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
                                <div>
                                    <label className="block text-xs mb-1">
                                        Size
                                    </label>

                                    <input
                                        type="range"
                                        min={0.5} max={5} step={0.1}
                                        value={selected.size} className="w-full text-sm"
                                        onChange={(e) => updateSelected({ size: parseFloat(e.target.value) })}
                                    />
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
                                            type='number' 
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
                                            type='number' 
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
                                            type='number' 
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
                <Canvas
                    shadows dpr={[1, 2]}
                    camera={{ position: [6, 6, 6], fov: 45 }}
                >
                    <Scene
                        objects={objects}
                        selectedId={selectedId}
                        setSelectedId={setSelectedId}
                        // transformMode={transformMode}
                        // onTransformChange={handleTransformChange}
                        theme={theme} 
                        // exportRef={exportRef}
                    />
                </Canvas>
            </div>
        </div>
    );
};