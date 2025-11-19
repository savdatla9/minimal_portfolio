"use client";

import React, { useState, useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  TransformControls,
  useGLTF,
} from "@react-three/drei";

/* --------------------------- Basic Box + Gizmo --------------------------- */
function Box({ item, isSelected, onSelect }) {
    return (
        <mesh
            position={item.position}
            scale={item.scale}
            rotation={item.rotation || [0, 0, 0]}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(item.id);
            }}
            castShadow
            receiveShadow
        >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
                color={item.color}
                emissive={isSelected ? "#444444" : "#000000"}
            />
        </mesh>
    );
};

function TransformableBox({
    item,
    isSelected,
    onSelect,
    mode,
    onDraggingChange,
    onChangeTransform,
}) {
    if (!isSelected) {
        return <Box item={item} isSelected={false} onSelect={onSelect} />;
    };

    return (
        <TransformControls
            mode={mode}
            // onMouseDown={(e) => e.stopPropagation()}
            // onTouchStart={(e) => e.stopPropagation()}
            onDraggingChange={(dragging) => {
                onDraggingChange?.(dragging);
            }}
            onObjectChange={(e) => {
                const object = e.target.object;
                onChangeTransform?.(item.id, object);
            }}
        >
            <Box item={item} isSelected={true} onSelect={onSelect} />
        </TransformControls>
    );
};

/* --------------------------- GLB Model + Gizmo --------------------------- */
function Model({ item, isSelected, onSelect }) {
    const gltf = useGLTF(item.path);
    const scene = gltf.scene.clone(true);

    return (
        <primitive
            object={scene}
            position={item.position}
            scale={item.scale}
            rotation={item.rotation || [0, 0, 0]}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(item.id);
            }}
            castShadow={true}
            receiveShadow={true}
        />
    );
};

function TransformableModel({
    item,
    isSelected,
    onSelect,
    mode,
    onDraggingChange,
    onChangeTransform,
}) {
    if (!isSelected) {
        return <Model item={item} isSelected={false} onSelect={onSelect} />;
    };

    return (
        <TransformControls
            mode={mode}
            // onMouseDown={(e) => e.stopPropagation()}
            // onTouchStart={(e) => e.stopPropagation()}
            onDraggingChange={(dragging) => {
                onDraggingChange?.(dragging);
            }}
            onObjectChange={(e) => {
                const object = e.target.object;
                onChangeTransform?.(item.id, object);
            }}
        >
            <Model item={item} isSelected={true} onSelect={onSelect} />
        </TransformControls>
    );
};

/* ------------------------------- Scene View ------------------------------ */
function Scene({
    objects,
    selectedId,
    setSelectedId,
    transformMode,
    onTransformChange,
}) {
    const [isDragging, setIsDragging] = useState(false);

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

            {/* Ground */}
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -0.25, 0]}
                receiveShadow
            >
                <planeGeometry args={[50, 50]} />
                <meshStandardMaterial />
            </mesh>

            {/* Grid */}
            <gridHelper args={[50, 50]} />

            {/* All objects */}
            {objects.map((item) => {
                const commonProps = {
                    key: item.id,
                    item,
                    isSelected: item.id === selectedId,
                    onSelect: setSelectedId,
                    mode: transformMode,
                    onDraggingChange: setIsDragging,
                    onChangeTransform: onTransformChange,
                };

                if (item.type === "model") {
                    return <TransformableModel {...commonProps} />;
                };

                return <TransformableBox {...commonProps} />;
            })}

            {/* Orbit controls (disabled while dragging gizmo) */}
            <OrbitControls
                makeDefault
                enabled={!isDragging}
                target={selected ? selected.position : [0, 0, 0]}
            />
        </>
    );
};

/* --------------------------- Main Editor Page ---------------------------- */
let nextId = 1;

export default function ThreeEditorPage() {
    const [objects, setObjects] = useState([]);
    const [selectedId, setSelectedId] = useState(0);
    const [transformMode, setTransformMode] = useState("translate"); // translate | rotate | scale
    const fileInputRef = useRef(null);

    const selected =
        objects.find((o) => o.id === selectedId) || (objects.length ? objects[0] : null);

    /* ---- Helpers ---- */
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

    // function handleAddModel() {
    //     const id = nextId++;
    //     const newModel = {
    //         id,
    //         type: "model",
    //         name: `Robot ${id}`,
    //         path: "/models/robot.glb", // put robot.glb under /public/models/
    //         position: [Math.random() * 4 - 2, 0.5, Math.random() * 4 - 2],
    //         scale: [1, 1, 1],
    //         rotation: [0, 0, 0],
    //     };
    //     setObjects((prev) => [...prev, newModel]);
    //     setSelectedId(id);
    // };

    function handleUploadButtonClick() {
        fileInputRef.current?.click();
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

    function handleDeleteSelected() {
        if (!selected) return;

        setObjects((prev) => prev.filter((obj) => obj.id !== selected.id));

        setSelectedId((prevId) => {
            const remaining = objects.filter((o) => o.id !== prevId);
            return remaining.length ? remaining[0].id : null;
        });
    };

    // Called when TransformControls moves object
    function handleTransformChange(id, object) {
        const position = object.position.toArray();
        const scale = object.scale.toArray();
        const rotation = [object.rotation.x, object.rotation.y, object.rotation.z];

        setObjects((prev) =>
            prev.map((obj) =>
                obj.id === id ? { ...obj, position, scale, rotation } : obj
            )
        );
    };

  const modes = ["translate", "rotate", "scale"];

  return (
    <div
        style={{
            display: "flex", height: "85vh",
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
            border: '1px solid', borderBottom: '3px solid',
            borderRadius: 5,
        }}
    >
      {/* ------------------------- Left Panel (UI) ------------------------- */}
        <div
            style={{
                width: 320,
                padding: 16,
                boxSizing: "border-box",
                borderRight: "1px solid",
                display: "flex",
                flexDirection: "column",
                gap: 16,
            }}
        >
            <div>
                <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, textAlign: 'center' }}>Three Js Editor</h1>
            </div>

            {/* Objects list + add buttons */}
            <div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 8,
                        alignItems: "center",
                    }}
                >
                    <span style={{ fontSize: 13, fontWeight: 600 }}>Objects</span>
                    
                    <div style={{ display: "flex", gap: 4 }}>
                        <button
                            onClick={handleAddBox}
                            style={{
                                padding: "4px 8px",
                                borderRadius: 4,
                                border: "1px solid",
                                cursor: "pointer",
                                fontSize: 12,
                            }}
                        >
                            + Box
                        </button>
                    </div>
                </div>

                <div
                    style={{
                        borderRadius: 6,
                        border: "1px solid",
                        maxHeight: 160,
                        overflowY: "auto",
                    }}
                >
                    {objects.length === 0 && (
                        <div style={{ padding: 8, fontSize: 12 }}>
                            No objects. Use buttons above to add one.
                        </div>
                    )}
                
                    {objects.map((obj) => {
                        const active = obj.id === selectedId;
                        return (
                            <div
                                key={obj.id}
                                onClick={() => setSelectedId(obj.id)}
                                style={{
                                    padding: "6px 8px",
                                    fontSize: 12,
                                    cursor: "pointer",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    background: active ? "#1f2937" : "transparent",
                                    borderBottom: "1px solid",
                                }}
                            >
                                <span>
                                    [{obj.type === "box" ? "Box" : "Model"}] {obj.name}
                                </span>

                                {obj.type === "box" ? (
                                    <span
                                    style={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: 999,
                                        background: obj.color,
                                        border: "1px solid #111827",
                                    }}
                                    />
                                ) : (
                                    <span style={{ fontSize: 10, color: "#9ca3af" }}>GLB</span>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Upload GLB */}
                <div style={{ marginTop: 8 }}>
                    <button
                        onClick={handleUploadButtonClick}
                        style={{
                            width: "100%",
                            padding: "4px 8px",
                            borderRadius: 4,
                            border: "1px solid #4b5563",
                            background: "#111827",
                            color: "#e5e7eb",
                            cursor: "pointer",
                            fontSize: 12,
                        }}
                    >
                        Upload .glb / .gltf
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".glb,.gltf"
                        style={{ display: "none" }}
                        onChange={handleUploadModel}
                    />
                </div>
            </div>

            {/* Properties panel */}
            <div>
                <div
                    style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                    alignItems: "center",
                    }}
                >
                    <span style={{ fontSize: 13, fontWeight: 600 }}>Properties</span>
                    <button
                    onClick={handleDeleteSelected}
                    disabled={!selected}
                    style={{
                        padding: "4px 8px",
                        borderRadius: 4,
                        border: "1px solid #b91c1c",
                        background: "#7f1d1d",
                        color: "#fee2e2",
                        cursor: selected ? "pointer" : "not-allowed",
                        fontSize: 12,
                        opacity: selected ? 1 : 0.4,
                    }}
                    >
                    Delete
                    </button>
                </div>

                {selected ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {/* Name */}
                        <div>
                            <label
                                style={{
                                    display: "block",
                                    fontSize: 11,
                                    marginBottom: 4,
                                    color: "#9ca3af",
                                }}
                            >
                                Name
                            </label>
                            <input
                                type="text"
                                value={selected.name}
                                onChange={(e) => updateSelected({ name: e.target.value })}
                                style={{
                                    width: "100%",
                                    padding: "4px 6px",
                                    fontSize: 12,
                                    borderRadius: 4,
                                    border: "1px solid",
                                }}
                            />
                        </div>

                        {/* Path (read-only for models) */}
                        {selected.type === "model" && (
                            <div>
                                <label
                                    style={{
                                        display: "block",
                                        fontSize: 11,
                                        marginBottom: 4,
                                    }}
                                >
                                    Path
                                </label>
                                <div
                                    style={{
                                        fontSize: 11,
                                        padding: "4px 6px",
                                        borderRadius: 4,
                                        border: "1px solid",
                                        wordBreak: "break-all",
                                    }}
                                >
                                    {selected.path}
                                </div>
                            </div>
                        )}

                        {/* Color only for boxes */}
                        {selected.type === "box" && (
                            <div>
                                <label
                                    style={{
                                        display: "block",
                                        fontSize: 11,
                                        marginBottom: 4,
                                    }}
                                >
                                    Color
                                </label>
                                <input
                                    type="color"
                                    value={selected.color}
                                    onChange={(e) => updateSelected({ color: e.target.value })}
                                    style={{
                                        width: "100%",
                                        height: 32,
                                        padding: 0,
                                        borderRadius: 4,
                                        border: "1px solid",
                                    }}
                                />
                            </div>
                        )}

                    {/* Position inputs */}
                    <h2>Position</h2>

                    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly'}}>
                        {["X", "Y", "Z"].map((axis, index) => (
                            <div key={axis}>
                                <input 
                                    type='number' 
                                    value={selected.position[index]} 
                                    onChange={(e) => {
                                        const value = parseFloat(e.target.value);
                                        const newPos = [...selected.position];
                                        newPos[index] = value;
                                        updateSelected({ position: newPos });
                                    }} 
                                    style={{ width: '80px', border: '1px solid', borderRadius: '5px', padding: 2 }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Rotation inputs */}
                    <h2>Rotation </h2>

                    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly'}}>
                        {["X", "Y", "Z"].map((axis, index) => (
                            <div key={axis}>           
                                <input 
                                    type='number' 
                                    value={selected.rotation[index]} 
                                    onChange={(e) => {
                                        const value = parseFloat(e.target.value);
                                        const newRotate = [...selected.rotation];
                                        newRotate[index] = value;
                                        updateSelected({ scale: newRotate });
                                    }} 
                                    style={{ width: '80px', border: '1px solid', borderRadius: '5px', padding: 2 }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Scale inputs */}
                    <h2>Scale</h2>

                    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly'}}>
                        {["X", "Y", "Z"].map((axis, index) => (
                            <div key={axis}>
                                <input 
                                    type='number' 
                                    value={selected.scale[index]} 
                                    onChange={(e) => {
                                        const value = parseFloat(e.target.value);
                                        const newScale = [...selected.scale];
                                        newScale[index] = value;
                                        updateSelected({ scale: newScale });
                                    }} 
                                    style={{ width: '80px', border: '1px solid', borderRadius: '5px', padding: 2 }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div style={{ fontSize: 12, color: "#6b7280" }}>
                No object selected.
                </div>
            )}
            </div>

            <div style={{ fontSize: 10, color: "#4b5563", marginTop: "auto" }}>
            Tip: Drag with left mouse to orbit, right mouse to pan, scroll to
            zoom. Use gizmo to transform the selected object.
            </div>
        </div>

        {/* -------------------------- Right Panel (3D) ------------------------ */}
        <div style={{ flex: 1 }}>
            <Canvas
                shadows
                camera={{ position: [6, 6, 6], fov: 45 }}
            >
                <Scene
                    objects={objects}
                    selectedId={selectedId}
                    setSelectedId={setSelectedId}
                    transformMode={transformMode}
                    onTransformChange={handleTransformChange}
                />
            </Canvas>
        </div>
    </div>
  );
}

/* Optional: Preload static models from /public */
// useGLTF.preload("/models/robot.glb");