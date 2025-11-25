"use client";

import React, { 
    useState, useMemo, 
    useEffect, useRef, 
    Suspense 
} from "react";
import * as THREE from 'three'; 
import { Canvas } from '@react-three/fiber'; 

import {
    Text3D, useGLTF, Text,
    OrbitControls, useTexture,
    GizmoHelper, GizmoViewport,
    useVideoTexture, PositionalAudio,
} from '@react-three/drei';
import { Plus } from 'lucide-react';
import { useTheme } from "next-themes";
// import { GLTFExporter } from "three-stdlib";

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
            <mesh
                ref={meshRef}
                position={item.position}
                scale={item.scale}
                rotation={item.rotation || [0, 0, 0]}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(item.id);
                }}
                castShadow receiveShadow
            >
                <boxGeometry args={[1, 1, 1]} />

                <meshStandardMaterial color={item.color} />
            </mesh>
        );
    };

    return (
        <mesh
            ref={meshRef}
            position={item.position}
            scale={item.scale}
            rotation={item.rotation || [0, 0, 0]}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(item.id);
            }}
            castShadow receiveShadow
        >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={item.color} />
        </mesh>
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
            }
        });

        return s;
    }, [gltf.scene]);

    if (!isSelected) {
        return <primitive
            object={scene}
            position={item.position} scale={item.scale}
            rotation={item.rotation || [0, 0, 0]}
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
            position={item.position} scale={item.scale}
            rotation={item.rotation || [0, 0, 0]}
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

    const width = 4;
    const height = 2.25; // 16:9 aspect

    if (!isSelected) {
        return <mesh
            position={item.position}
            rotation={item.rotation}
            scale={item.scale}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(item.id);
            }}
            castShadow receiveShadow
        >
            <planeGeometry args={[width, height]} />

            <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
        </mesh>;
    };

    return (
        <mesh
            position={item.position}
            rotation={item.rotation}
            scale={item.scale}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(item.id);
            }}
            castShadow receiveShadow
        >
            <planeGeometry args={[width, height]} />

            <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
        </mesh>
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
        <mesh
            position={item.position}
            rotation={item.rotation}
            scale={item.scale}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(item.id);
            }}
        >
            <Text3D
                font="/Inter_Regular.json" 
                size={1.5} height={0.75}
                curveSegments={12} bevelEnabled
                bevelThickness={0.02} bevelOffset={0}
                bevelSize={0.01} bevelSegments={3}
                letterSpacing={-0.1} lineHeight={0.5} 
                castShadow receiveShadow
            >
                {item.name}

                <meshStandardMaterial color={item.color} />
            </Text3D>
        </mesh>
    };

    return(
        <mesh
            position={item.position}
            rotation={item.rotation}
            scale={item.scale}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(item.id);
            }}
        >
            <Text3D
                font="/Inter_Regular.json" 
                size={1.5} height={0.75}
                curveSegments={12} bevelEnabled
                bevelThickness={0.02} bevelOffset={0}
                bevelSize={0.01} bevelSegments={3}
                letterSpacing={-0.05} lineHeight={0.5} 
                castShadow receiveShadow
            >
                {item.name}

                <meshStandardMaterial color={item.color} />
            </Text3D>
        </mesh>
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
    const texture = useVideoTexture(item.path, {
        start: false,     // we control play/pause manually
        muted: true,
        loop: true,
        crossOrigin: "anonymous",
    });

    const [isPlaying, setIsPlaying] = useState(false);

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
        return (
            <group
                position={item.position}
                rotation={item.rotation}
                scale={item.scale}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(item.id);
                }}
                castShadow receiveShadow
                id={item.id}
            >
                {/* Video plane */}
                <mesh castShadow receiveShadow position={[0, 1, 0]}>
                    <planeGeometry args={[4, 2]} />

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

    return (
        <group
            position={item.position}
            rotation={item.rotation}
            scale={item.scale}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(item.id);
            }}
            castShadow receiveShadow
            id={item.id}
        >
            {/* Video plane */}
            <mesh castShadow receiveShadow position={[0, 1, 0]}>
                <planeGeometry args={[4, 2]} />

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

    const playRef = useRef(null);

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
            castShadow receiveShadow
            id={item.id}
        >
            <mesh position={[2, 1, 0]} castShadow>
                <planeGeometry args={[4, 2]} />

                <meshStandardMaterial
                    color="orange"
                    emissive="orange"
                    emissiveIntensity={0.8}
                />

                {/* Positional audio attached to this mesh */}
                <PositionalAudio ref={playRef} url={item.path} distance={6} loop autoplay />
            </mesh>

            {/* <mesh
                position={[0, 1, 0.05]}
                onClick={(e) => {
                    e.stopPropagation();
                    playRef.current.isPlaying ? playRef.current.pause() : playRef.current.play();
                }}
            >
                <Text
                    fontSize={0.25}
                    position={[0, 0, 0.01]}
                    anchorX="center"
                    anchorY="middle"
                    color="#ffb900"
                >
                    {playRef.current.isPlaying ? "⏸️" : "▶️"}
                </Text>
            </mesh> */}
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
            castShadow receiveShadow
            id={item.id}
        >
            <mesh position={[2, 1, 0]} castShadow>
                <planeGeometry args={[4, 2]} />

                <meshStandardMaterial
                    color="orange"
                    emissive="orange"
                    emissiveIntensity={0.8}
                />

                {/* Positional audio attached to this mesh */}
                <PositionalAudio ref={playRef} url={item.path} distance={6} loop autoplay />
            </mesh>

            {/* <mesh
                position={[0, 1, 0.05]}
                onClick={(e) => {
                    e.stopPropagation();
                    playRef.current.isPlaying ? playRef.current.pause() : playRef.current.play();
                }}
            >
                <Text
                    fontSize={0.25}
                    position={[0, 0, 0.01]}
                    anchorX="center"
                    anchorY="middle"
                    color="#ffb900"
                >
                    {playRef.current.play ? "⏸️" : "▶️"}
                </Text>
            </mesh> */}
        </group>
    );
};

// function ExportHelper({ registerExporter }) {
//     const { scene } = useThree();

//     React.useEffect(() => {
//         if (!registerExporter) return;

//         // expose a function that will export the current scene
//         const exportFn = () => {
//             const exporter = new GLTFExporter();

//             exporter.parse(
//                 scene,
//                 (gltf) => {
//                     let blob;
//                     let filename;

//                     if (gltf instanceof ArrayBuffer) {
//                         // binary .glb
//                         blob = new Blob([gltf], { type: "model/gltf-binary" });
//                         filename = "scene.glb";
//                     } else {
//                         // JSON .gltf
//                         const json = JSON.stringify(gltf, null, 2);
//                         blob = new Blob([json], { type: "model/gltf+json" });
//                         filename = "scene.gltf";
//                     };

//                     const url = URL.createObjectURL(blob);
//                     const a = document.createElement("a");
//                     a.href = url;
//                     a.download = filename;
//                     a.click();
//                     URL.revokeObjectURL(url);
//                 },
//                 { binary: true, } // set false if you prefer .gltf + .bin
//             );
//         };

//         // hand the export function back to the parent (page) via callback
//         registerExporter(exportFn);
//     }, [scene, registerExporter]);

//     return null;
// };

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
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
            />

            <fog attach="fog" args={theme==='dark'?['#0a0a0a', 15, 22.5]:['white', 15, 22.5]} />

            {/* Grid */}
            <gridHelper args={theme==='dark' ? [50, 50, 'dodgerblue', 'skyblue'] : [50, 50, 'dimgrey', 'gainsboro']} />

            {/* Shadow */}
            <mesh 
                position={[0, -0.05, 0]} receiveShadow
                rotation={[Math.PI/2, 0, 0]}
            >
                <meshStandardMaterial side={THREE.BackSide} color={theme==='dark'?'gainsboro':'whitesmoke'} />

                <planeGeometry args={[50, 50]} />
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
            position: [Math.random() * 4 - 2, 0.5, Math.random() * 4 - 2],
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
            position: [0, 0.15, 0],
            scale: [1, 1, 0.5],
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
            position: [0, 0.5, 0],
            scale: [1, 1, 1],
            rotation: [0, 0, 0],
        };
        setObjects((prev) => [...prev, newImage]);
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

    function handleDeleteSelected() {
        if (!selected) return;

        setObjects((prev) => prev.filter((obj) => obj.id !== selected.id));

        setSelectedId((prevId) => {
            const remaining = objects.filter((o) => o.id !== prevId);
            return remaining.length ? remaining[0].id : null;
        });
    };

    // function handleExportScene() {
    //     if (exportRef.current) {
    //         exportRef.current(); // triggers GLTF export
    //     } else {
    //         console.warn("Exporter not ready yet");
    //     };
    // };

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
        <div
            style={{
                display: "flex", height: "82vh", borderRadius: 5,
                border: '1px solid', borderBottom: '3px solid',
            }}
        >
            {/* ------------------------- Left Panel (UI) ------------------------- */}
            <div style={{
                width: 320, padding: 16, height: "100%", overflowY: "auto",
                boxSizing: "border-box", borderRight: "1px solid",
                display: "flex", flexDirection: "column", gap: 16,
            }}>
                <div>
                    <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, textAlign: 'center' }}>Three Js Editor</h1>
                </div>

                {/* Objects list + add buttons */}
                <div>
                    <div
                        style={{
                            display: "flex", justifyContent: "space-between",
                            marginBottom: 8, alignItems: "center",
                        }}
                    >
                        <span style={{ fontSize: 13, fontWeight: 600 }}>Objects</span>
                        
                        <div style={{ display: "flex", gap: 4 }}>
                            <button
                                onClick={handleAddBox}
                                style={{
                                    padding: "4px 8px", borderRadius: 4, display: 'flex',
                                    border: "1px solid", cursor: "pointer", fontSize: 12,
                                }}
                            >
                                <Plus size={18} absoluteStrokeWidth />&nbsp;Box
                            </button>

                            <button
                                onClick={handleAddText}
                                style={{
                                    padding: "4px 8px", borderRadius: 4, display: 'flex',
                                    border: "1px solid", cursor: "pointer", fontSize: 12,
                                }}
                            >
                                <Plus size={18} absoluteStrokeWidth />&nbsp;Text
                            </button>
                        </div>
                    </div>

                    {/* Upload GLB */}
                    <div style={{ marginBottom: 8 }}>
                        <button
                            onClick={handleUploadModelClick}
                            style={{
                                width: "100%", padding: "4px 8px",
                                borderRadius: 4, fontSize: 12,
                                border: "1px solid", cursor: "pointer",
                            }}
                        >
                            Upload .glb / .gltf
                        </button>

                        <input
                            ref={fileInputRef1} type="file" accept=".glb,.gltf"
                            style={{ display: "none" }} onChange={handleUploadModel}
                        />
                    </div>

                    {/* Upload Image */}
                    <div style={{ marginBottom: 8 }}>
                        <button
                            onClick={handleUploadImageClick}
                            style={{
                                width: "100%", padding: "4px 8px",
                                borderRadius: 4, fontSize: 12,
                                border: "1px solid", cursor: "pointer",
                            }}
                        >
                            Upload image
                        </button>

                        <input
                            ref={fileInputRef2} type="file" accept="image/*"
                            style={{ display: "none" }} onChange={handleUploadImage}
                        />
                    </div>

                    {/* Upload Video */}
                    <div style={{ marginBottom: 8 }}>
                        <button
                            onClick={handleUploadVideoClick}
                            style={{
                                width: "100%", padding: "4px 8px",
                                borderRadius: 4, fontSize: 12,
                                border: "1px solid", cursor: "pointer",
                            }}
                        >
                            Upload video
                        </button>

                        <input
                            ref={fileInputRef3} type="file" accept="video/*"
                            style={{ display: "none" }} onChange={handleUploadVideo}
                        />
                    </div>

                    {/* Upload Audio */}
                    <div style={{ marginBottom: 8 }}>
                        <button
                            onClick={handleUploadAudioClick}
                            style={{
                                width: "100%", padding: "4px 8px",
                                borderRadius: 4, fontSize: 12,
                                border: "1px solid", cursor: "pointer",
                            }}
                        >
                            Upload audio
                        </button>

                        <input
                            ref={fileInputRef4} type="file" accept="audio/*"
                            style={{ display: "none" }} onChange={handleUploadAudio}
                        />
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

                    <div style={{
                        borderRadius: 6, border: "1px solid",
                        maxHeight: 160, overflowY: "auto",
                    }}>
                        {objects.length === 0 ? (
                            <div style={{ padding: 8, fontSize: 12.5, textAlign: 'center' }}>
                                No objects. Use buttons above to add one.
                            </div>
                        ) : objects.map((obj) => {
                            const active = obj.id === selectedId;

                            return (
                                <div
                                    key={obj.id}
                                    onClick={() => setSelectedId(obj.id)}
                                    style={{
                                        padding: "6px 8px", fontSize: 12, cursor: "pointer", 
                                        display: "flex", justifyContent: "space-between",
                                        alignItems: "center", fontWeight: active ? 'bold' : 'normal',
                                    }}
                                >
                                    <span>
                                        {obj.name.length<20 ? obj.name : obj.name.substring(0, 20)+' ...'}
                                    </span>

                                    {obj.type === "box" && <span
                                        style={{
                                            width: 12, height: 12, background: obj.color,
                                            borderRadius: 999, border: "1px solid",
                                        }}
                                    />}

                                    {obj.type === "model" && <span 
                                        style={{ fontSize: 10 }}
                                    >
                                        GLB
                                    </span>} 

                                    {obj.type === "text" && <span 
                                        style={{ fontSize: 10 }}
                                    >
                                        text
                                    </span>} 
                                    
                                    {obj.type === "image" && <span 
                                        style={{ fontSize: 10 }}
                                    >
                                        Img
                                    </span>}

                                    {obj.type === "video" && <span 
                                        style={{ fontSize: 10 }}
                                    >
                                        Clip
                                    </span>}

                                    {obj.type === "audio" && <span 
                                        style={{ fontSize: 10 }}
                                    >
                                        Song
                                    </span>}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Properties panel */}
                <div>
                    <div style={{
                        display: "flex", justifyContent: "space-between",
                        marginBottom: 8, alignItems: "center",
                    }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>Properties</span>

                        <button
                            onClick={handleDeleteSelected}
                            disabled={!selected}
                            style={{
                                color: '#ffffff', padding: "4px 8px", borderRadius: 4, 
                                fontWeight: 'bold', background: "red",
                                cursor: selected ? "pointer" : "not-allowed",
                                fontSize: 12, opacity: selected ? 1 : 0.4,
                            }}
                        >
                            Delete
                        </button>
                    </div>

                    {selected ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {/* Name */}
                            <div>
                                <label style={{ display: "block", fontSize: 12, marginBottom: 4 }}>
                                    Name
                                </label>

                                <input
                                    type="text"
                                    value={selected.name}
                                    onChange={(e) => updateSelected({ name: e.target.value })}
                                    style={{
                                        width: "100%", padding: "4px 6px",
                                        fontSize: 12, borderRadius: 4,
                                        border: "1px solid",
                                    }}
                                />
                            </div>

                            {/* Color only for boxes */}
                            {selected.type === "box" && (
                                <div>
                                    <label style={{ display: "block", fontSize: 12, marginBottom: 4 }}>
                                        Color
                                    </label>

                                    <input
                                        type="color"
                                        value={selected.color}
                                        onChange={(e) => updateSelected({ color: e.target.value })}
                                        style={{
                                            width: "100%", height: 32,
                                            padding: 0, borderRadius: 4,
                                            border: "1px solid",
                                        }}
                                    />
                                </div>
                            )}

                            {/* Color only for Text 3D */}
                            {selected.type === "text" && (
                                <div>
                                    <label style={{ display: "block", fontSize: 12, marginBottom: 4 }}>
                                        Color
                                    </label>

                                    <input
                                        type="color"
                                        value={selected.color}
                                        onChange={(e) => updateSelected({ color: e.target.value })}
                                        style={{
                                            width: "100%", height: 32,
                                            padding: 0, borderRadius: 4,
                                            border: "1px solid",
                                        }}
                                    />
                                </div>
                            )}

                            {/* Position inputs */}
                            <span style={{marginBottom: '-0.5rem', fontSize: 13, fontWeight: 600 }}>Position</span>

                            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly'}}>
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
                                            style={{ width: '80px', border: '1px solid', borderRadius: '5px', padding: 2 }}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Rotation inputs */}
                            <span style={{marginBottom: '-0.5rem', fontSize: 13, fontWeight: 600 }}>Rotation </span>

                            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly', padding: 0}}>
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
                                            style={{ width: '80px', border: '1px solid', borderRadius: '5px', padding: 2 }}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Scale inputs */}
                            <span style={{marginBottom: '-0.5rem', fontSize: 13, fontWeight: 600 }}>Scale</span>

                            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly', padding: 0}}>
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
                                            style={{ width: '80px', border: '1px solid', borderRadius: '5px', padding: 2 }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div style={{ fontSize: 12 }}>
                            No object selected.
                        </div>
                    )}
                </div>

                <div style={{ fontSize: 11, marginTop: "auto" }}>
                    <b>Tip:</b> Drag with left mouse to orbit, right mouse to pan, scroll to
                    zoom. Use gizmo to transform the selected object.
                </div>
            </div>

            {/* -------------------------- Right Panel (3D) ------------------------ */}
            <div style={{ flex: 1 }}>
                {/* <div style={{
                    display: 'flex', justifyContent: 'center', gap: '10px', 
                    padding: 5, position: 'absolute', zIndex: 20, top: '12vh', left: '55vw'
                }}>
                    <div 
                        style={{border: '2px solid', borderRadius: 25, padding: '1%'}}
                        onClick={()=>setTransformMode('translate')}
                    >
                        <Move3d />
                    </div>

                    <div 
                        style={{border: '2px solid', borderRadius: 25, padding: '1%'}}
                        onClick={()=>setTransformMode('rotate')}
                    >
                        <Rotate3d />
                    </div>

                    <div 
                        style={{border: '2px solid', borderRadius: 25, padding: '1%'}}
                        onClick={()=>setTransformMode('scale')}
                    >
                        <Scale3d />
                    </div>
                </div> */}

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

                    {/* <ExportHelper
                        registerExporter={(fn) => {
                            exportRef.current = fn;
                        }}
                    /> */}
                </Canvas>
            </div>
        </div>
    );
};