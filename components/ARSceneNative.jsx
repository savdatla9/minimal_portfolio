'use client'

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useGLTF, Center, OrbitControls } from '@react-three/drei';
import { 
  Scan, Sparkles, ArrowLeft, AlertTriangle, 
  Chrome, RefreshCw, Volume2, ShieldAlert
} from 'lucide-react';

// Web Audio API Sound Generator for futuristic sound effects
const playSoundCue = (type) => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'found') {
      const now = ctx.currentTime;
      osc.type = 'sine';
      
      // Futuristic synth arpeggio (C5 -> E5 -> G5)
      osc.frequency.setValueAtTime(523.25, now); // C5
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.1, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      
      osc.frequency.setValueAtTime(659.25, now + 0.06); // E5
      gain.gain.setValueAtTime(0.1, now + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

      osc.frequency.setValueAtTime(783.99, now + 0.12); // G5
      gain.gain.setValueAtTime(0.12, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'lost') {
      const now = ctx.currentTime;
      osc.type = 'sine';
      
      // Downward sweep (G4 -> C4)
      osc.frequency.setValueAtTime(392.00, now); // G4
      osc.frequency.exponentialRampToValueAtTime(261.63, now + 0.25); // C4
      
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch (err) {
    console.warn("Could not play sound cue:", err);
  }
};

// 3D Models Config
function ReactLogo3D() {
  const groupRef = useRef(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 1.5;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.6) * 0.2;
    }
  });

  return (
    <group ref={groupRef} scale={1.8}>
      {/* Central nucleus */}
      <mesh>
        <sphereGeometry args={[0.016, 32, 32]} />
        <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={3} roughness={0.1} />
      </mesh>
      
      {/* Ring 1 */}
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.06, 0.002, 8, 64]} />
        <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={1.2} roughness={0.2} />
      </mesh>
      
      {/* Ring 2 */}
      <mesh rotation={[Math.PI / 3, Math.PI / 3, 0]}>
        <torusGeometry args={[0.06, 0.002, 8, 64]} />
        <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={1.2} roughness={0.2} />
      </mesh>
      
      {/* Ring 3 */}
      <mesh rotation={[Math.PI / 3, -Math.PI / 3, 0]}>
        <torusGeometry args={[0.06, 0.002, 8, 64]} />
        <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={1.2} roughness={0.2} />
      </mesh>
      
      {/* Sci-Fi Floor Grid */}
      <gridHelper args={[0.3, 10, '#00f3ff', '#002b33']} position={[0, -0.06, 0]} opacity={0.4} transparent />
    </group>
  );
}

function ShoeModel() {
  const { scene } = useGLTF("/shoe-draco.glb");
  const modelRef = useRef(null);

  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y = state.clock.getElapsedTime() * 0.8;
    }
  });

  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      scale={0.45} 
      position={[0, 0, 0]} 
      rotation={[0, 0, 0]}
    />
  );
}

function CupModel() {
  const { scene } = useGLTF("/cup.glb");
  const modelRef = useRef(null);

  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y = state.clock.getElapsedTime() * 0.8;
    }
  });

  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      scale={0.65} 
      position={[0, -0.05, 0]} 
    />
  );
}

function FallbackMesh() {
  const meshRef = useRef(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime();
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 1.5;
    }
  });
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[0.06, 0.06, 0.06]} />
      <meshStandardMaterial color="#00f3ff" wireframe />
    </mesh>
  );
}

// Simulator Manager inside the <Canvas>
function SimulatorManager({ activeModel, isSimulatedState, simulateWobble }) {
  const groupRef = useRef(null);

  useFrame((state) => {
    if (groupRef.current) {
      if (simulateWobble) {
        const t = state.clock.getElapsedTime();
        groupRef.current.position.x = Math.sin(t * 1.5) * 0.008 + Math.cos(t * 2.5) * 0.005;
        groupRef.current.position.y = Math.cos(t * 1.5) * 0.008 + Math.sin(t * 3.5) * 0.005;
        groupRef.current.position.z = Math.sin(t * 2) * 0.006;
      } else {
        groupRef.current.position.set(0, 0, 0);
      }

      // Apply opacity depending on state (tracked vs emulated)
      groupRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.transparent = true;
          child.material.opacity = isSimulatedState === 'emulated' ? 0.45 : 1.0;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      <Suspense fallback={<FallbackMesh />}>
        {activeModel === 'react-logo' && <ReactLogo3D />}
        {activeModel === 'shoe' && <ShoeModel />}
        {activeModel === 'cup' && <CupModel />}
      </Suspense>

      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 10, 5]} intensity={2.5} castShadow />
      <pointLight position={[-5, 5, -5]} intensity={1} />
    </group>
  );
}

// Child Canvas component exporting WebGLRenderer gl to the React parent
function GlExporter({ onGlReady }) {
  const { gl } = useThree();
  useEffect(() => {
    onGlReady(gl);
  }, [gl, onGlReady]);
  return null;
}

// AR Manager inside the <Canvas>
function ARManager({ activeModel, onTrackingChanged }) {
  const { gl } = useThree();
  const groupRef = useRef(null);
  const currentTrackingState = useRef('lost');

  useFrame(() => {
    const frame = gl.xr.getFrame();
    const referenceSpace = gl.xr.getReferenceSpace();

    if (frame && referenceSpace) {
      if (typeof frame.getImageTrackingResults === 'function') {
        const results = frame.getImageTrackingResults();
        let trackingState = 'lost';
        let foundPose = null;

        for (const result of results) {
          if (result.trackingState === 'tracked' || result.trackingState === 'emulated') {
            const pose = frame.getPose(result.imageSpace, referenceSpace);
            if (pose) {
              trackingState = result.trackingState;
              foundPose = pose;
              break; // Handle first detected image target
            }
          }
        }

        if (trackingState !== 'lost' && foundPose) {
          groupRef.current.matrix.fromArray(foundPose.transform.matrix);
          groupRef.current.matrixAutoUpdate = false;
          groupRef.current.updateMatrixWorld(true); // Force world transform recalculation
          groupRef.current.visible = true;

          // Fade materials when in emulated state (as defined in W3C WebXR Image Tracking DRAFT)
          groupRef.current.traverse((child) => {
            if (child.isMesh && child.material) {
              child.material.transparent = true;
              child.material.opacity = trackingState === 'emulated' ? 0.45 : 1.0;
            }
          });
        } else {
          groupRef.current.visible = false;
        }

        if (trackingState !== currentTrackingState.current) {
          const oldState = currentTrackingState.current;
          currentTrackingState.current = trackingState;
          onTrackingChanged(trackingState);
          
          // Sound cue on transition state
          if (trackingState === 'tracked' || (trackingState === 'emulated' && oldState === 'lost')) {
            playSoundCue('found');
          } else if (trackingState === 'lost') {
            playSoundCue('lost');
          }
        }
      }
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      <Suspense fallback={<FallbackMesh />}>
        {activeModel === 'react-logo' && <ReactLogo3D />}
        {activeModel === 'shoe' && <ShoeModel />}
        {activeModel === 'cup' && <CupModel />}
      </Suspense>

      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 10, 5]} intensity={2.5} castShadow />
      <pointLight position={[-5, 5, -5]} intensity={1} />
    </group>
  );
}

// Main Client Component
export default function ARSceneNative() {
  const [glInstance, setGlInstance] = useState(null);
  const [inAR, setInAR] = useState(false);
  const [isTracking, setIsTracking] = useState('lost'); // 'tracked' | 'emulated' | 'lost'
  const [activeModel, setActiveModel] = useState('react-logo');
  const [activeTarget, setActiveTarget] = useState('react'); // 'react' | 'starbucks' | 'onepiece' | 'photo'
  const [targetScore, setTargetScore] = useState('unknown'); // 'trackable' | 'untrackable' | 'unknown'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [compatibility, setCompatibility] = useState({
    webxr: false,
    imageTracking: false
  });

  // Desktop Simulator State
  const [simulatorActive, setSimulatorActive] = useState(false);
  const [simulatedState, setSimulatedState] = useState('lost'); // 'tracked' | 'emulated' | 'lost'
  const [wobble, setWobble] = useState(true);
  const [webcamStream, setWebcamStream] = useState(null);
  const videoRef = useRef(null);

  // Check feature compatibility on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const webxrSupported = 'xr' in navigator;
      const imageTrackingSupported = webxrSupported && 'XRFrame' in window && typeof XRFrame.prototype.getImageTrackingResults === 'function';
      
      setCompatibility({
        webxr: webxrSupported,
        imageTracking: imageTrackingSupported
      });

      const url = window.location.href;
      setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(url)}&color=00f3ff&bgcolor=09090b`);
    }
  }, []);

  // WebXR Session Management
  useEffect(() => {
    if (!glInstance) return;

    const handleSessionStart = () => {
      setInAR(true);
      setIsTracking('lost');
    };

    const handleSessionEnd = () => {
      setInAR(false);
      setIsTracking('lost');
    };

    glInstance.xr.addEventListener('sessionstart', handleSessionStart);
    glInstance.xr.addEventListener('sessionend', handleSessionEnd);

    return () => {
      glInstance.xr.removeEventListener('sessionstart', handleSessionStart);
      glInstance.xr.removeEventListener('sessionend', handleSessionEnd);
    };
  }, [glInstance]);

  const handleStartAR = async () => {
    if (!glInstance) return;
    try {
      setLoading(true);
      setError(null);
      setTargetScore('unknown');

      // 1. Fetch & decode the target image dynamically
      const targetPath = activeTarget === 'starbucks' ? '/starbucks.png'
                       : activeTarget === 'onepiece' ? '/onepiece.png'
                       : activeTarget === 'photo' ? '/CDSC_0433.jpg'
                       : '/react.png';

      const img = new Image();
      img.src = targetPath;
      await img.decode();
      const imageBitmap = await createImageBitmap(img);

      // 2. Request XR Session with DOM Overlay and Image Tracking
      const session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: [],
        optionalFeatures: ['image-tracking', 'dom-overlay'],
        domOverlay: { root: document.getElementById('xr-overlay') },
        trackedImages: [
          {
            image: imageBitmap,
            widthInMeters: 0.15 // 15cm target size (standard for mobile scans from screens)
          }
        ]
      });

      // 3. Set the session to WebGLRenderer
      glInstance.xr.enabled = true;
      glInstance.xr.setReferenceSpaceType('local');
      await glInstance.xr.setSession(session);

      // 4. Check image scores (W3C WebXR Image Tracking explainer)
      if (typeof session.getTrackedImageScores === 'function') {
        try {
          const scores = await session.getTrackedImageScores();
          console.log("WebXR Target Image scores:", scores);
          if (scores && scores.length > 0) {
            setTargetScore(scores[0]);
            if (scores[0] === 'untrackable') {
              setError("Warning: Selected target image is untrackable. The AR engine may fail to detect it. Try the Starbucks or One Piece logo instead.");
            }
          }
        } catch (scoreErr) {
          console.warn("Failed to retrieve image tracking scores:", scoreErr);
          setTargetScore('error');
        }
      } else {
        setTargetScore('unsupported');
      }

      setInAR(true);
    } catch (err) {
      console.error("WebXR Activation Failed:", err);
      setError(
        err.name === 'NotSupportedError' || err.message?.includes('Unsupported feature')
          ? "Native WebXR Image Tracking is not supported on this device/browser. Please ensure WebXR Incubations is enabled in Chrome settings."
          : `Failed to start WebXR Session: ${err.message || err}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExitAR = async () => {
    if (glInstance && glInstance.xr.getSession()) {
      await glInstance.xr.getSession().end();
    }
  };

  const handleStartSimulator = async (useWebcam = true) => {
    try {
      setLoading(true);
      setError(null);

      if (useWebcam) {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          const isInsecure = typeof window !== 'undefined' && 
                             window.location.protocol !== 'https:' && 
                             window.location.hostname !== 'localhost' && 
                             window.location.hostname !== '127.0.0.1';
          if (isInsecure) {
            setError("Camera access is blocked because the page is served over HTTP. Mobile browsers strictly require HTTPS or localhost (via ngrok or port forwarding) to open the camera.");
          } else {
            setError("Camera API is not available on this browser/context. Please check your browser privacy permissions.");
          }
          setLoading(false);
          return;
        }
        
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: 480, height: 360 }
        });
        setWebcamStream(stream);
        // Bind the stream to the video element shortly after mounting
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }, 150);
      }

      setSimulatorActive(true);
      setSimulatedState('lost');
    } catch (err) {
      console.error("Webcam streaming failed:", err);
      setSimulatorActive(true);
      setSimulatedState('lost');
      
      const isInsecure = typeof window !== 'undefined' && 
                         window.location.protocol !== 'https:' && 
                         window.location.hostname !== 'localhost' && 
                         window.location.hostname !== '127.0.0.1';
      
      if (isInsecure) {
        setError("Camera access is blocked because the page is served over HTTP. Mobile browsers strictly require a secure context (HTTPS) or localhost (via ngrok or port forwarding) to open the camera.");
      } else {
        setError(`Webcam access was denied or is unavailable: ${err.message || err}. Running virtual 3D simulator instead.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExitSimulator = () => {
    if (webcamStream) {
      webcamStream.getTracks().forEach(track => track.stop());
      setWebcamStream(null);
    }
    setSimulatorActive(false);
    setSimulatedState('lost');
  };

  const handleSetSimulatedState = (stateVal) => {
    const oldState = simulatedState;
    setSimulatedState(stateVal);
    
    // Play sound cue matching target state transition
    if (stateVal === 'tracked' || (stateVal === 'emulated' && oldState === 'lost')) {
      playSoundCue('found');
    } else if (stateVal === 'lost') {
      playSoundCue('lost');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans overflow-x-hidden flex flex-col">
      {/* Header */}
      <header className="border-b border-white/5 bg-zinc-900/40 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/" className="hover:text-[#00f3ff] transition flex items-center gap-1.5 text-sm font-semibold text-white/70">
            <ArrowLeft size={16} /> Portfolio
          </a>
          <span className="text-white/20">|</span>
          <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-[#00f3ff] bg-clip-text text-transparent">
            Native WebXR Image AR
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-zinc-800/80 px-3 py-1 rounded-full border border-white/5 text-xs text-neutral-400 font-medium">
            <span className={`w-2 h-2 rounded-full ${compatibility.imageTracking ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'}`}></span>
            {compatibility.imageTracking ? 'Compatible' : 'Incompatible'}
          </div>
        </div>
      </header>

      {/* Main Panel */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative">
        
        {/* Left column: target & instructions */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col gap-6 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#00f3ff]/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
            
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <Scan className="text-[#00f3ff]" /> Target Image
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-xl">
              Point your compatible AR camera at the selected target. WebXR will overlay the 3D model directly on top of it.
            </p>

            {/* Target Image Selector */}
            <div className="space-y-2">
              <label className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Select AR Tracking Target:</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-zinc-950 p-1.5 rounded-xl border border-white/5">
                {[
                  { id: 'react', label: 'React (Symmetric)' },
                  { id: 'starbucks', label: 'Starbucks (Detail)' },
                  { id: 'onepiece', label: 'One Piece (High-Cont)' },
                  { id: 'photo', label: 'Photo Card (Max)' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTarget(t.id)}
                    className={`py-2 px-1 rounded-lg text-xs font-semibold transition ${activeTarget === t.id ? 'bg-[#00f3ff] text-zinc-950 shadow-[0_0_12px_rgba(0,243,255,0.4)]' : 'text-neutral-400 hover:text-white'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Glowing Scan Container */}
            <div className="relative border border-[#00f3ff]/20 bg-zinc-950/60 rounded-2xl p-8 flex items-center justify-center group overflow-hidden max-w-md mx-auto w-full aspect-square">
              {/* Sci-Fi Corners */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00f3ff] rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#00f3ff] rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#00f3ff] rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#00f3ff] rounded-br-lg"></div>
              
              {/* Moving laser scan line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00f3ff] to-transparent shadow-[0_0_12px_#00f3ff] animate-[scan_3s_ease-in-out_infinite] pointer-events-none"></div>

              <img 
                src={activeTarget === 'starbucks' ? '/starbucks.png'
                   : activeTarget === 'onepiece' ? '/onepiece.png'
                   : activeTarget === 'photo' ? '/CDSC_0433.jpg'
                   : '/react.png'} 
                alt="AR Target" 
                className="w-56 h-56 object-contain filter drop-shadow-[0_0_30px_rgba(0,243,255,0.15)] group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
            
            <p className="text-center text-xs text-neutral-500 italic">
              Scanning target image ({activeTarget === 'starbucks' ? 'starbucks.png' : activeTarget === 'onepiece' ? 'onepiece.png' : activeTarget === 'photo' ? 'CDSC_0433.jpg' : 'react.png'})
            </p>
          </div>
        </section>

        {/* Right column: Action / Device setup */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Activation Card */}
          <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col gap-6 backdrop-blur-sm relative h-full">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="text-[#00f3ff]" /> Launch AR View
            </h2>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex gap-3 text-rose-300 text-sm">
                <ShieldAlert size={20} className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Activation Error</p>
                  <p className="text-rose-300/80 mt-1 leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            {/* Compatibility Guides */}
            {!compatibility.imageTracking ? (
              <div className="flex-1 flex flex-col justify-between gap-6">
                <div className="bg-zinc-950/40 border border-amber-500/10 p-5 rounded-2xl flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-amber-500 font-bold text-sm">
                    <AlertTriangle size={18} /> Experimental API Required
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    This browser does not support the W3C WebXR Image Tracking draft API by default. Pointing this page out is standard for WebXR development.
                  </p>

                  <div className="space-y-3 mt-1">
                    <div className="flex items-start gap-2.5 text-xs text-neutral-300">
                      <Chrome size={14} className="text-[#00f3ff] mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Chrome on Android</strong>: Visit <code className="bg-zinc-800 text-white/90 px-1 py-0.5 rounded text-[10px]">chrome://flags</code>, enable <strong>WebXR Incubations</strong>, and relaunch.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Model Selector Card for Simulator */}
                <div className="space-y-2">
                  <label className="text-xs text-neutral-400 font-semibold">Select 3D Overlay Model:</label>
                  <div className="grid grid-cols-3 gap-2 bg-zinc-950 p-1.5 rounded-xl border border-white/5">
                    {[
                      { id: 'react-logo', label: 'React Logo' },
                      { id: 'shoe', label: 'Shoe Model' },
                      { id: 'cup', label: 'Coffee Cup' }
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setActiveModel(m.id)}
                        className={`py-2 px-1 rounded-lg text-xs font-semibold transition ${activeModel === m.id ? 'bg-[#00f3ff] text-zinc-950 shadow-[0_0_12px_rgba(0,243,255,0.4)]' : 'text-neutral-400 hover:text-white'}`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={() => handleStartSimulator(true)}
                    className="w-full bg-[#00f3ff]/10 hover:bg-[#00f3ff]/20 text-[#00f3ff] border border-[#00f3ff]/30 font-bold py-3 px-5 rounded-2xl flex items-center justify-center gap-2 transition duration-300 active:scale-[0.98]"
                  >
                    <Volume2 size={16} /> Start Webcam Simulator
                  </button>
                  <button
                    onClick={() => handleStartSimulator(false)}
                    className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-5 rounded-2xl flex items-center justify-center gap-2 transition duration-300 active:scale-[0.98]"
                  >
                    <RefreshCw size={16} /> Start 3D Viewer (No Camera)
                  </button>
                </div>

                <div className="flex flex-col items-center gap-4 bg-zinc-950/50 p-6 rounded-2xl border border-white/5 text-center">
                  <p className="text-xs text-neutral-400 font-semibold max-w-xs">
                    Scan with an Android device using Google Chrome to test this WebXR experience:
                  </p>
                  {qrCodeUrl ? (
                    <div className="bg-white p-2.5 rounded-xl inline-block shadow-lg border border-[#00f3ff]/30 shadow-[#00f3ff]/5">
                      <img src={qrCodeUrl} alt="QR Code Link" className="w-36 h-36" />
                    </div>
                  ) : (
                    <div className="w-36 h-36 bg-zinc-900 rounded-xl flex items-center justify-center">
                      <RefreshCw size={24} className="animate-spin text-neutral-500" />
                    </div>
                  )}
                  <p className="text-[10px] text-neutral-500 font-mono select-all">
                    {typeof window !== 'undefined' ? window.location.href : ''}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    Ready to launch! Point the camera at the Target image on the left screen. Choose a 3D model configuration before entering AR:
                  </p>
                  
                  {/* Model Selector Card */}
                  <div className="grid grid-cols-3 gap-2 bg-zinc-950 p-1.5 rounded-xl border border-white/5">
                    {[
                      { id: 'react-logo', label: 'React Logo' },
                      { id: 'shoe', label: 'Shoe Model' },
                      { id: 'cup', label: 'Coffee Cup' }
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setActiveModel(m.id)}
                        className={`py-2 px-1 rounded-lg text-xs font-semibold transition ${activeModel === m.id ? 'bg-[#00f3ff] text-zinc-950 shadow-[0_0_12px_rgba(0,243,255,0.4)]' : 'text-neutral-400 hover:text-white'}`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleStartAR}
                    disabled={loading}
                    className="w-full bg-[#00f3ff] hover:bg-[#00d7e6] text-zinc-950 font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2.5 shadow-[0_0_30px_rgba(0,243,255,0.25)] hover:shadow-[#00f3ff]/40 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base active:scale-[0.98]"
                  >
                    {loading ? (
                      <>
                        <RefreshCw size={20} className="animate-spin" /> Preparing AR...
                      </>
                    ) : (
                      <>
                        <Scan size={20} /> Enter WebXR Image AR
                      </>
                    )}
                  </button>
                  <p className="text-center text-[10px] text-neutral-500">
                    Requires camera permission access.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* R3F Invisible Canvas for holding gl instance */}
      <div className="absolute w-[1px] h-[1px] opacity-0 overflow-hidden pointer-events-none">
        <Canvas>
          <GlExporter onGlReady={setGlInstance} />
        </Canvas>
      </div>

      {/* WEBXR LIVE STREAM VIEWPORT (Renders when session is active) */}
      {inAR && (
        <div className="fixed inset-0 z-50 bg-black">
          <Canvas gl={{ alpha: true }}>
            <ARManager activeModel={activeModel} onTrackingChanged={setIsTracking} />
          </Canvas>
        </div>
      )}

      {/* DESKTOP/FALLBACK WEBCAM SIMULATOR VIEWPORT */}
      {simulatorActive && (
        <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col justify-between select-none">
          {/* Webcam Element */}
          {webcamStream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover z-0 opacity-70"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center z-0">
              <div className="text-center space-y-3 p-6 max-w-sm bg-zinc-950/60 border border-white/5 rounded-3xl backdrop-blur-md">
                <AlertTriangle size={32} className="mx-auto text-[#00f3ff] animate-pulse" />
                <h3 className="font-bold text-sm">Virtual 3D Simulator Mode</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Webcam is disabled. Showing overlays in a 3D studio environment. You can rotate and zoom using mouse controls.
                </p>
              </div>
            </div>
          )}

          {/* Transparent Canvas Overlay */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <Canvas gl={{ alpha: true }} camera={{ position: [0, 0.15, 0.45], fov: 45 }} className="pointer-events-auto">
              {simulatedState !== 'lost' && (
                <SimulatorManager
                  activeModel={activeModel}
                  isSimulatedState={simulatedState}
                  simulateWobble={wobble}
                />
              )}
              <OrbitControls enablePan={true} enableZoom={true} />
            </Canvas>
          </div>

          {/* Simulator Control Overlay HTML */}
          <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-6">
            
            {/* Top Bar */}
            <div className="flex justify-between items-center w-full pointer-events-auto">
              <button
                onClick={handleExitSimulator}
                className="bg-black/75 text-white border border-white/20 px-4 py-2 rounded-full backdrop-blur-md text-sm font-semibold flex items-center gap-2 hover:bg-black/90 transition active:scale-95"
              >
                <ArrowLeft size={16} /> Exit Simulator
              </button>
              <div className="bg-black/75 text-[#00f3ff] border border-[#00f3ff]/20 px-4 py-1.5 rounded-full backdrop-blur-md text-xs font-mono font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#00f3ff] rounded-full animate-ping"></span>
                WebAR Simulator
              </div>
            </div>

            {/* Middle simulator instructions & status feedback */}
            <div className="flex flex-col items-center justify-center gap-4">
              {simulatedState === 'lost' ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-52 h-52 border-2 border-dashed border-[#00f3ff]/40 rounded-3xl flex items-center justify-center bg-black/40">
                    <Scan size={44} className="text-[#00f3ff]/60" />
                  </div>
                  <p className="text-white text-xs text-center font-medium bg-black/60 px-4 py-1.5 rounded-full border border-white/5">
                    Click <strong>Detect Target</strong> below to place the model
                  </p>
                </div>
              ) : simulatedState === 'emulated' ? (
                <div className="bg-amber-500/90 text-white border border-amber-400/20 px-5 py-2.5 rounded-full shadow-lg backdrop-blur-md text-sm font-bold flex items-center gap-2 animate-pulse">
                  <AlertTriangle size={16} /> Simulator: Tracking Emulated
                </div>
              ) : (
                <div className="bg-emerald-500/90 text-white border border-emerald-400/20 px-5 py-2.5 rounded-full shadow-lg backdrop-blur-md text-sm font-bold flex items-center gap-2 animate-bounce">
                  <Sparkles size={16} /> Simulator: Target Tracked
                </div>
              )}
            </div>

            {/* Bottom Panel containing toggles and switcher */}
            <div className="flex flex-col items-center gap-4 pointer-events-auto w-full max-w-md mx-auto">
              
              {/* Simulator State Controller Toggles */}
              <div className="flex justify-center gap-2 bg-black/85 border border-white/20 p-2 rounded-full backdrop-blur-md w-full">
                <button
                  onClick={() => handleSetSimulatedState('lost')}
                  className={`flex-1 py-1.5 rounded-full text-xs font-bold transition ${simulatedState === 'lost' ? 'bg-rose-500 text-white font-extrabold shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'text-white/60 hover:text-white'}`}
                >
                  Lost Target
                </button>
                <button
                  onClick={() => handleSetSimulatedState('emulated')}
                  className={`flex-1 py-1.5 rounded-full text-xs font-bold transition ${simulatedState === 'emulated' ? 'bg-amber-500 text-zinc-950 font-extrabold shadow-[0_0_8px_rgba(245,158,11,0.4)]' : 'text-white/60 hover:text-white'}`}
                >
                  Emulate
                </button>
                <button
                  onClick={() => handleSetSimulatedState('tracked')}
                  className={`flex-1 py-1.5 rounded-full text-xs font-bold transition ${simulatedState === 'tracked' ? 'bg-emerald-500 text-white font-extrabold shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'text-white/60 hover:text-white'}`}
                >
                  Detect Target
                </button>
              </div>

              {/* Model Switcher and wobble toggler */}
              <div className="flex items-center gap-3 w-full bg-black/85 border border-white/10 p-3 rounded-2xl backdrop-blur-md">
                <button
                  onClick={() => setWobble(!wobble)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition border ${wobble ? 'bg-[#00f3ff]/10 border-[#00f3ff]/30 text-[#00f3ff]' : 'border-white/10 text-white/50'}`}
                >
                  Wobble: {wobble ? 'ON' : 'OFF'}
                </button>
                <span className="text-white/10">|</span>
                <div className="flex-1 flex gap-1">
                  {[
                    { id: 'react-logo', label: 'React' },
                    { id: 'shoe', label: 'Shoe' },
                    { id: 'cup', label: 'Cup' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setActiveModel(m.id)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${activeModel === m.id ? 'bg-[#00f3ff] text-zinc-950 font-bold' : 'text-white/60 hover:text-white'}`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* WebXR DOM Overlay - Must always be present in DOM for WebXR initializer */}
      <div 
        id="xr-overlay" 
        className={`fixed inset-0 pointer-events-none z-50 flex-col justify-between p-6 select-none ${inAR ? 'flex' : 'hidden'}`}
      >
        {/* Top Bar */}
        <div className="flex justify-between items-center w-full pointer-events-auto">
          <button 
            onClick={handleExitAR}
            className="bg-black/70 text-white border border-white/20 px-4 py-2 rounded-full backdrop-blur-md text-sm font-semibold flex items-center gap-2 hover:bg-black/90 transition active:scale-95"
          >
            <ArrowLeft size={16} /> Exit AR
          </button>
          <div className="bg-black/70 text-white/90 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md text-xs font-mono flex items-center gap-1.5">
            <span>WebXR AR</span>
            <span className="text-white/25">|</span>
            <span className={targetScore === 'trackable' ? 'text-emerald-400 font-bold' : targetScore === 'untrackable' ? 'text-rose-400 font-bold animate-pulse' : 'text-amber-400 font-bold'}>
              Target: {targetScore.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Middle scanning helper */}
        <div className="flex flex-col items-center justify-center gap-4">
          {isTracking === 'lost' ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-52 h-52 border-2 border-dashed border-[#00f3ff]/60 rounded-3xl animate-pulse flex items-center justify-center bg-black/10">
                <Scan size={48} className="text-[#00f3ff] animate-ping" />
              </div>
              <p className="text-[#00f3ff] font-medium text-center text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] bg-zinc-950/80 px-4 py-1.5 rounded-full border border-[#00f3ff]/20">
                Point camera at {activeTarget === 'react' ? 'React Logo' : activeTarget === 'starbucks' ? 'Starbucks Logo' : activeTarget === 'onepiece' ? 'One Piece Logo' : 'Photo Card'}
              </p>
            </div>
          ) : isTracking === 'emulated' ? (
            <div className="bg-amber-500/90 text-white border border-amber-400/20 px-5 py-2.5 rounded-full shadow-lg backdrop-blur-md text-sm font-bold flex items-center gap-2 animate-pulse">
              <AlertTriangle size={16} /> Tracking Emulated
            </div>
          ) : (
            <div className="bg-emerald-500/90 text-white border border-emerald-400/20 px-5 py-2.5 rounded-full shadow-lg backdrop-blur-md text-sm font-bold flex items-center gap-2 animate-bounce">
              <Sparkles size={16} /> Target Tracked
            </div>
          )}
        </div>

        {/* Bottom model switcher */}
        <div className="flex flex-col items-center gap-3 pointer-events-auto w-full max-w-sm mx-auto">
          <div className="flex justify-center gap-2 bg-black/85 border border-white/20 p-2 rounded-full backdrop-blur-md w-full">
            {[
              { id: 'react-logo', label: 'React' },
              { id: 'shoe', label: 'Shoe' },
              { id: 'cup', label: 'Cup' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveModel(m.id)}
                className={`flex-1 py-2 rounded-full text-xs font-bold transition ${activeModel === m.id ? 'bg-[#00f3ff] text-zinc-950 font-extrabold shadow-[0_0_12px_rgba(0,243,255,0.4)]' : 'text-white/60 hover:text-white'}`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Styled Scanning Laser keyframe styles */}
      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(382px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
