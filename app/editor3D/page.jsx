"use client";

import { useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, TransformControls } from "@react-three/drei";

function Box({ item, isSelected, onSelect }) {
    return (
        <mesh
            position={item.position}
            scale={item.scale}
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
}) {
    // If not selected, just render plain box (no gizmo)
    if (!isSelected) {
        return <Box item={item} isSelected={false} onSelect={onSelect} />;
    }

  // If selected, wrap in TransformControls
    return (
        <TransformControls
            mode={mode}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onDraggingChange={(event) => {
                // event is boolean in drei wrapper
                onDraggingChange?.(event);
            }}
        >
            <Box item={item} isSelected={true} onSelect={onSelect} />
        </TransformControls>
    );
};

function Scene({ objects, selectedId, setSelectedId, transformMode }) {
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
                position={[0, -0.5, 0]}
                receiveShadow
            >
                <planeGeometry args={[50, 50]} />
                <meshStandardMaterial color="#222222" />
            </mesh>

            {/* Grid */}
            <gridHelper args={[50, 50, "#555", "#333"]} />

            {/* Objects (selected one gets TransformControls) */}
            {objects.map((item) => (
                <TransformableBox
                    key={item.id}
                    item={item}
                    isSelected={item.id === selectedId}
                    onSelect={setSelectedId}
                    mode={transformMode}
                    onDraggingChange={setIsDragging}
                />
            ))}

            {/* Camera controls - disabled while dragging gizmo */}
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
    const [objects, setObjects] = useState([
        {
            id: 0,
            name: "Box 0",
            color: "#ff0055",
            position: [0, 0.5, 0],
            scale: [1, 1, 1],
        },
    ]);
    const [selectedId, setSelectedId] = useState(0);
    const [transformMode, setTransformMode] = useState("translate"); // "translate" | "rotate" | "scale"

    const selected = objects.find((o) => o.id === selectedId) || objects[0];

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
            name: `Box ${id}`,
            color: "#00aaff",
            position: [Math.random() * 4 - 2, 0.5, Math.random() * 4 - 2],
            scale: [1, 1, 1],
        };
        setObjects((prev) => [...prev, newBox]);

        setSelectedId(id);
    };

    function handleDeleteSelected() {
        if (!selected) return;
        setObjects((prev) => prev.filter((obj) => obj.id !== selected.id));

        setSelectedId((prevId) => {
            const remaining = objects.filter((o) => o.id !== prevId);
            return remaining.length ? remaining[0].id : null;
        });
    };

    const modes = ["translate", "rotate", "scale"];

    return (
        <div
            style={{
                display: "flex", height: "80vh", padding: 5,
                border: '2px solid', borderBottom: '5px solid',
                borderRadius: 15,
            }}
        >
            {/* Left panel: UI */}
            <div
                style={{
                    width: 300,
                    padding: 16,
                    boxSizing: "border-box",
                    borderRight: "1px solid #374151",
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    // background: "#020617",
                    borderTopLeftRadius: 15,
                    borderBottomLeftRadius: 15,
                }}
            >
                <div>
                    <h1 style={{ fontSize: 18, marginBottom: 4 }}>Three.js Editor</h1>
                </div>

                {/* Objects list */}
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
                        <button
                            onClick={handleAddBox}
                            style={{
                                padding: "4px 8px",
                                borderRadius: 4,
                                border: "1px solid",
                                // background: "#111827",
                                // color: "#e5e7eb",
                                cursor: "pointer",
                                fontSize: 12,
                            }}
                        >
                            + Add Box
                        </button>
                    </div>

                    <div
                        style={{
                            borderRadius: 6,
                            border: "1px solid #374151",
                            maxHeight: 150,
                            overflowY: "auto",
                        }}
                    >
                        {objects.length === 0 && (
                            <div style={{ padding: 8, fontSize: 12, color: "#6b7280" }}>
                                No objects. Click &quot;Add Box&quot; to create one.
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
                                        borderBottom: "1px solid #111827",
                                    }}
                                >
                                    <span>{obj.name}</span>

                                    <span
                                        style={{
                                            width: 12,
                                            height: 12,
                                            borderRadius: 999,
                                            background: obj.color,
                                            border: "1px solid #111827",
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Transform mode buttons */}
                <div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 8,
                            alignItems: "center",
                        }}
                    >
                        <span style={{ fontSize: 13, fontWeight: 600 }}>Transform Mode</span>
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                        {modes.map((mode) => {
                            const active = transformMode === mode;

                            return (
                                <button
                                    key={mode}
                                    onClick={() => setTransformMode(mode)}
                                    style={{
                                        flex: 1,
                                        padding: "4px 6px",
                                        fontSize: 11,
                                        borderRadius: 4,
                                        border: active
                                        ? "1px solid #10b981"
                                        : "1px solid #4b5563",
                                        background: active ? "#064e3b" : "#111827",
                                        color: active ? "#a7f3d0" : "#e5e7eb",
                                        cursor: "pointer",
                                        textTransform: "capitalize",
                                    }}
                                >
                                    {mode}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Selected object properties */}
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
                                background: "red",
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
                                    }}
                                >
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

                            {/* Color */}
                            <div>
                                <label
                                    style={{
                                        display: "block",
                                        fontSize: 11, marginBottom: 4,
                                    }}
                                >
                                    Color
                                </label>
                                <input
                                    type="color" value={selected.color}
                                    onChange={(e) => updateSelected({ color: e.target.value })}
                                    style={{
                                        width: "100%", height: 32,
                                        padding: 0, borderRadius: 4,
                                        border: "2px solid",
                                    }}
                                />
                            </div>

                            {/* Position sliders */}
                            {["X", "Y", "Z"].map((axis, index) => (
                                <div key={axis}>
                                    <label
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            fontSize: 11,
                                            marginBottom: 2,
                                        }}
                                    >
                                        <span>Position {axis}</span>
                                        <span>{selected.position[index].toFixed(2)}</span>
                                    </label>
                                    <input
                                        type="range"
                                        min={-5} max={5}
                                        step={0.1} value={selected.position[index]}
                                        onChange={(e) => {
                                            const value = parseFloat(e.target.value);
                                            const newPos = [...selected.position];
                                            newPos[index] = value;
                                            updateSelected({ position: newPos });
                                        }}
                                        style={{ width: "100%" }}
                                    />
                                </div>
                            ))}

                            {/* Uniform scale */}
                            <div>
                                <label
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        fontSize: 11,
                                        marginBottom: 2,
                                    }}
                                >
                                    <span>Scale (uniform)</span>
                                    <span>{selected.scale[0].toFixed(2)}</span>
                                </label>
                                <input
                                    type="range"
                                    min={0.1} max={3}
                                    step={0.1} value={selected.scale[0]}
                                    onChange={(e) => {
                                        const value = parseFloat(e.target.value);
                                        const newScale = [value, value, value];
                                        updateSelected({ scale: newScale });
                                    }}
                                    style={{ width: "100%" }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div style={{ fontSize: 12, }}>
                            No object selected.
                        </div>
                    )}
                </div>

                <div style={{ fontSize: 11, marginTop: "auto" }}>
                    <b>Tip:</b> Drag with left mouse to orbit, right mouse to pan, scroll to
                    zoom. Use gizmo to transform the selected object.
                </div>
            </div>

            {/* Right panel: Canvas */}
            <div style={{ flex: 1 }}>
                <Canvas
                    shadows
                    camera={{ position: [6, 6, 6], fov: 45 }}
                    style={{ borderTopRightRadius: 15, borderBottomRightRadius: 15  }}
                >
                    <Scene
                        objects={objects}
                        selectedId={selectedId}
                        setSelectedId={setSelectedId}
                        transformMode={transformMode}
                    />
                </Canvas>
            </div>
        </div>
    );
};