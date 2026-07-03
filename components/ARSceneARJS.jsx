'use client'

import { useState, useEffect, useRef } from 'react';
import { 
  Scan, Sparkles, ArrowLeft,
  RefreshCw, ShieldAlert, MapPin, 
  Compass, QrCode, Target, Info,
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
      gain.gain.linearRampToValueAtTime(0.15, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      
      osc.frequency.setValueAtTime(659.25, now + 0.06); // E5
      gain.gain.setValueAtTime(0.15, now + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

      osc.frequency.setValueAtTime(783.99, now + 0.12); // G5
      gain.gain.setValueAtTime(0.18, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'lost') {
      const now = ctx.currentTime;
      osc.type = 'sine';
      
      // Downward sweep (G4 -> C4)
      osc.frequency.setValueAtTime(392.00, now); // G4
      osc.frequency.exponentialRampToValueAtTime(261.63, now + 0.25); // C4
      
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch (err) {
    console.warn("Could not play sound cue:", err);
  }
};

export default function ARSceneARJS() {
  const [arMode, setArMode] = useState('marker'); // 'marker' | 'location'
  const [activeModel, setActiveModel] = useState('react-logo');
  const [isTracking, setIsTracking] = useState(false);
  const [isIframeReady, setIsIframeReady] = useState(false);
  
  // Geolocation & Simulation state
  const [useMockLocation, setUseMockLocation] = useState(true);
  const [coords, setCoords] = useState({ lat: 37.7749, lng: -122.4194 }); // default San Francisco
  const [customLat, setCustomLat] = useState('37.7749');
  const [customLng, setCustomLng] = useState('-122.4194');
  const [gpsError, setGpsError] = useState(null);
  const [gpsStatus, setGpsStatus] = useState('idle');
  
  // UI states
  const [showQrModal, setShowQrModal] = useState(false);
  const [showHiroModal, setShowHiroModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  
  const iframeRef = useRef(null);

  // Generate QR Code on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(url)}&color=00f3ff&bgcolor=09090b`);
    }
  }, []);

  // Set up message event listeners from the iframe
  useEffect(() => {
    const handleIframeMessage = (event) => {
      if (!event.data) return;

      if (event.data.type === 'marker-found') {
        setIsTracking(true);
        playSoundCue('found');
      } else if (event.data.type === 'marker-lost') {
        setIsTracking(false);
        playSoundCue('lost');
      } else if (event.data.type === 'ar-ready') {
        setIsIframeReady(true);
      }
    };

    window.addEventListener('message', handleIframeMessage);
    return () => {
      window.removeEventListener('message', handleIframeMessage);
    };
  }, []);

  // Post model changes to marker iframe when activeModel changes
  useEffect(() => {
    if (arMode === 'marker' && iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'change-model',
        model: activeModel
      }, '*');
    }
  }, [activeModel, arMode, isIframeReady]);

  // Request actual geolocation coordinates
  const handleQueryGps = () => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser.");
      setGpsStatus('error');
      return;
    }

    setGpsStatus('acquiring');
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setCoords(newCoords);
        setCustomLat(newCoords.lat.toFixed(6));
        setCustomLng(newCoords.lng.toFixed(6));
        setUseMockLocation(false);
        setGpsStatus('ready');
      },
      (error) => {
        let msg = "Could not retrieve GPS coordinates.";
        if (error.code === 1) msg = "Location permission denied. Please enable location services in your browser settings.";
        else if (error.code === 2) msg = "GPS signal lost or unavailable.";
        else if (error.code === 3) msg = "Geolocation timeout.";
        setGpsError(msg);
        setGpsStatus('error');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleApplyCustomCoords = () => {
    const latNum = parseFloat(customLat);
    const lngNum = parseFloat(customLng);
    if (isNaN(latNum) || isNaN(lngNum)) {
      alert("Please enter valid decimal degrees.");
      return;
    }
    setCoords({ lat: latNum, lng: lngNum });
    setUseMockLocation(true);
    setGpsStatus('ready');
  };

  // Switch between Marker and Location AR modes
  const handleToggleMode = (mode) => {
    setIsIframeReady(false);
    setIsTracking(false);
    setArMode(mode);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans overflow-hidden flex flex-col h-screen">
      
      {/* HUD Header */}
      <header className="border-b border-white/5 bg-zinc-900/40 backdrop-blur-md px-6 py-4 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <a href="/" className="hover:text-[#00f3ff] transition flex items-center gap-1.5 text-sm font-semibold text-white/70">
            <ArrowLeft size={16} /> Portfolio
          </a>
          <span className="text-white/20">|</span>
          <h1 className="text-lg font-bold tracking-wider bg-gradient-to-r from-white via-neutral-200 to-[#00f3ff] bg-clip-text text-transparent flex items-center gap-2">
            <Target className="text-[#00f3ff] animate-pulse" size={18} />
            AR 
          </h1>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-zinc-950 border border-white/10 p-1 rounded-xl">
          <button
            onClick={() => handleToggleMode('marker')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${arMode === 'marker' ? 'bg-[#00f3ff] text-zinc-950 shadow-[0_0_12px_rgba(0,243,255,0.4)]' : 'text-neutral-400 hover:text-white'}`}
          >
            Marker-Based (Hiro)
          </button>
          <button
            onClick={() => handleToggleMode('location')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${arMode === 'location' ? 'bg-[#00f3ff] text-zinc-950 shadow-[0_0_12px_rgba(0,243,255,0.4)]' : 'text-neutral-400 hover:text-white'}`}
          >
            Location-Based (GPS)
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden">
        
        {/* AR WebGL/Webcam Viewport (Fills screen behind UI controls) */}
        <div className="flex-1 relative bg-zinc-900 border-r border-white/5 h-1/2 md:h-full">
          {/* A-Frame embedded iframe */}
          <iframe
            key={arMode + (arMode === 'location' ? `-${coords.lat}-${coords.lng}` : '')}
            ref={iframeRef}
            src={
              arMode === 'marker'
                ? `/ar-marker.html?model=${activeModel}`
                : `/ar-location.html?lat=${coords.lat}&lng=${coords.lng}`
            }
            className="w-full h-full border-0 absolute inset-0 z-10"
            allow="camera; geolocation"
          />

          {/* Futuristic Scan overlay */}
          <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-6">
            {/* Top Stats */}
            <div className="flex justify-between items-start">
              {arMode === 'marker' ? (
                <div className={`px-4 py-1.5 rounded-lg text-xs font-bold font-mono tracking-wider border transition-all ${isTracking ? 'bg-emerald-500/90 text-white border-emerald-400/30 animate-bounce' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'}`}>
                  {isTracking ? 'TARGET LOCKED' : 'SCANNING FOR MARKER'}
                </div>
              ) : (
                <div className="bg-[#00f3ff]/10 border border-[#00f3ff]/30 text-[#00f3ff] px-4 py-1.5 rounded-lg text-xs font-bold font-mono animate-pulse">
                  RADAR PORTALS INJECTED (4)
                </div>
              )}
            </div>

            {/* Glowing Scan laser line (only for marker mode scanning) */}
            {arMode === 'marker' && !isTracking && (
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#00f3ff] to-transparent shadow-[0_0_15px_#00f3ff] animate-[scan_4s_ease-in-out_infinite]"></div>
            )}

            {/* Centered crosshair */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-25">
              <div className="w-16 h-16 border border-[#00f3ff] rounded-full flex items-center justify-center relative">
                <div className="w-2 h-2 bg-[#00f3ff] rounded-full"></div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 w-[1px] h-3 bg-[#00f3ff]"></div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 w-[1px] h-3 bg-[#00f3ff]"></div>
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 h-[1px] w-3 bg-[#00f3ff]"></div>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-y-2 w-3 h-[1px] bg-[#00f3ff]"></div>
              </div>
            </div>

            {/* Bottom HUD Feedback */}
            <div className="flex justify-center">
              {arMode === 'marker' ? (
                <div className="bg-black/80 border border-white/10 px-5 py-2.5 rounded-full text-xs font-mono text-center text-neutral-400">
                  {isTracking 
                    ? "3D Model locked onto Hiro Marker. Move camera to view from different angles." 
                    : "Point your camera at the Hiro Marker. Click 'Show Marker Pattern' below to display it."
                  }
                </div>
              ) : (
                <div className="bg-black/80 border border-white/10 px-5 py-2.5 rounded-full text-xs font-mono text-center text-neutral-400">
                  Look around (or drag with mouse) to locate the glowing portals placed North, South, East, and West.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Control Dashboard Side Panel */}
        <aside className="w-full md:w-[380px] bg-zinc-900/90 border-t md:border-t-0 md:border-l border-white/5 p-6 flex flex-col justify-between overflow-y-auto shrink-0 z-20 relative h-1/2 md:h-full">
          <div className="space-y-6">
            
            {/* Header info */}
            <div>
              <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                {arMode === 'marker' ? 'Marker Controller' : 'GPS Location Controller'}
              </h2>
              <p className="text-xs text-neutral-500 leading-relaxed">
                {arMode === 'marker' 
                  ? "Loads A-Frame and AR.js marker tracking. Point your device camera at the printed or digital Hiro pattern."
                  : "Tracks coordinates. Connects relative direction vectors and positions 3D anchors near your location."
                }
              </p>
            </div>

            {/* 3D Model Configuration (For Marker Mode) */}
            {arMode === 'marker' && (
              <div className="space-y-3">
                <label className="text-xs text-neutral-400 font-bold uppercase tracking-wide flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#00f3ff]" /> Select 3D Asset
                </label>
                <div className="grid grid-cols-1 gap-2 bg-zinc-950 p-2 rounded-2xl border border-white/5">
                  {[
                    { id: 'react-logo', name: 'Procedural React Logo', desc: 'Glowing neon nodes' },
                    { id: 'shoe', name: 'Nike Shoe', desc: 'GLTF model - 3D assets' },
                    { id: 'cup', name: 'Coffee Cup', desc: 'GLTF model - 3D assets' }
                  ].map((model) => (
                    <button
                      key={model.id}
                      onClick={() => setActiveModel(model.id)}
                      className={`flex flex-col text-left p-3 rounded-xl transition ${activeModel === model.id ? 'bg-[#00f3ff] text-zinc-950 shadow-[0_0_15px_rgba(0,243,255,0.25)]' : 'hover:bg-white/5 text-neutral-300'}`}
                    >
                      <span className="text-xs font-bold">{model.name}</span>
                      <span className={`text-[10px] ${activeModel === model.id ? 'text-zinc-800' : 'text-neutral-500'}`}>{model.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Location AR Coordinate Settings */}
            {arMode === 'location' && (
              <div className="space-y-4 bg-zinc-950 p-4 rounded-2xl border border-white/5">
                <h3 className="text-xs font-bold uppercase tracking-wide text-neutral-400 flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#00f3ff]" /> Location Parameters
                </h3>
                
                {/* Coordinates Readout */}
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-zinc-900 p-2 rounded-lg border border-white/5">
                    <div className="text-[10px] text-neutral-500 uppercase font-mono">Latitude</div>
                    <div className="text-sm font-semibold text-[#00f3ff] font-mono">{coords.lat.toFixed(6)}</div>
                  </div>
                  <div className="bg-zinc-900 p-2 rounded-lg border border-white/5">
                    <div className="text-[10px] text-neutral-500 uppercase font-mono">Longitude</div>
                    <div className="text-sm font-semibold text-[#00f3ff] font-mono">{coords.lng.toFixed(6)}</div>
                  </div>
                </div>

                {/* GPS Status feedback */}
                {gpsStatus === 'acquiring' && (
                  <div className="flex items-center justify-center gap-2 text-xs text-amber-400">
                    <RefreshCw size={14} className="animate-spin" /> Querying GPS signal...
                  </div>
                )}
                {gpsError && (
                  <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg text-[10px] text-rose-300 flex items-start gap-2">
                    <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                    <div>{gpsError}</div>
                  </div>
                )}

                {/* GPS Controls */}
                <div className="flex flex-col gap-2 pt-1">
                  <button
                    onClick={handleQueryGps}
                    className="w-full bg-[#00f3ff]/10 hover:bg-[#00f3ff]/20 text-[#00f3ff] border border-[#00f3ff]/30 font-bold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition duration-300"
                  >
                    <Compass size={14} /> Fetch Device GPS Coords
                  </button>

                  <div className="text-neutral-500 text-[10px] text-center italic font-mono">- OR SIMULATE LOCATION -</div>

                  {/* Manual simulation fields */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customLat}
                      onChange={(e) => setCustomLat(e.target.value)}
                      placeholder="Latitude"
                      className="bg-zinc-900 text-white border border-white/10 rounded-lg py-1.5 px-3 text-xs w-1/2 font-mono outline-none focus:border-[#00f3ff]"
                    />
                    <input
                      type="text"
                      value={customLng}
                      onChange={(e) => setCustomLng(e.target.value)}
                      placeholder="Longitude"
                      className="bg-zinc-900 text-white border border-white/10 rounded-lg py-1.5 px-3 text-xs w-1/2 font-mono outline-none focus:border-[#00f3ff]"
                    />
                  </div>
                  <button
                    onClick={handleApplyCustomCoords}
                    className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2 rounded-xl text-xs transition"
                  >
                    Apply Coordinates
                  </button>
                </div>

                <div className="text-[10px] text-neutral-500 leading-relaxed flex gap-1.5 items-start">
                  <Info size={14} className="shrink-0 mt-0.5 text-neutral-400" />
                  <span>
                    Locations are simulated on desktop. Look around the 3D space using your mouse. On a mobile phone, enable real GPS to overlay portals in your actual neighborhood!
                  </span>
                </div>
              </div>
            )}

            {/* Desktop Helper Actions */}
            <div className="space-y-2">
              {arMode === 'marker' && (
                <button
                  onClick={() => setShowHiroModal(true)}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 border border-white/5 transition"
                >
                  <Scan size={14} /> Show Marker Pattern
                </button>
              )}
              <button
                onClick={() => setShowQrModal(true)}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 border border-white/5 transition"
              >
                <QrCode size={14} /> Mobile Scanner QR Code
              </button>
            </div>

          </div>

          {/* Footer branding */}
          <div className="pt-6 border-t border-white/5 text-[10px] text-neutral-500 font-mono flex flex-col gap-1 shrink-0">
            <div>AR LIBRARY: AR.js A-Frame</div>
            <div>STATUS: INTEGRATED</div>
          </div>
        </aside>
      </div>

      {/* MODAL: HIRO PATTERN DISPLAY */}
      {showHiroModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6 backdrop-blur-md">
          <div className="bg-zinc-900 border border-white/10 max-w-sm w-full p-6 rounded-3xl text-center space-y-4">
            <h3 className="text-lg font-bold">Hiro AR Marker Pattern</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Show this marker on your computer monitor or print it out, then point your mobile browser's AR camera at it to load the 3D assets.
            </p>
            <div className="bg-white p-6 rounded-2xl inline-block border-4 border-[#00f3ff]/20">
              <img 
                src="https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/HIRO.jpg" 
                alt="Hiro Marker" 
                className="w-48 h-48 object-contain"
              />
            </div>
            <div className="flex gap-2">
              <a 
                href="https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/HIRO.jpg" 
                target="_blank" 
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold py-2.5 rounded-xl text-center"
              >
                Open Original Image
              </a>
              <button
                onClick={() => setShowHiroModal(false)}
                className="flex-1 bg-[#00f3ff] hover:bg-[#00d7e6] text-zinc-950 text-xs font-bold py-2.5 rounded-xl"
              >
                Close Marker
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: MOBILE SCANNER QR CODE */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6 backdrop-blur-md">
          <div className="bg-zinc-900 border border-white/10 max-w-sm w-full p-6 rounded-3xl text-center space-y-4">
            <h3 className="text-lg font-bold">Scan to Launch on Mobile</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Location-based and marker-based AR experiences work best on native mobile web browsers with camera permissions.
            </p>
            {qrCodeUrl ? (
              <div className="bg-white p-4 rounded-2xl inline-block border border-[#00f3ff]/20">
                <img src={qrCodeUrl} alt="QR Code Link" className="w-40 h-40" />
              </div>
            ) : (
              <div className="w-40 h-40 bg-zinc-950 rounded-2xl flex items-center justify-center mx-auto">
                <RefreshCw size={24} className="animate-spin text-neutral-500" />
              </div>
            )}
            <div className="text-[10px] text-neutral-500 font-mono select-all break-all border border-white/5 p-2 rounded bg-zinc-950">
              {typeof window !== 'undefined' ? window.location.href : ''}
            </div>
            <button
              onClick={() => setShowQrModal(false)}
              className="w-full bg-[#00f3ff] hover:bg-[#00d7e6] text-zinc-950 text-xs font-bold py-2.5 rounded-xl"
            >
              Back to AR Studio
            </button>
          </div>
        </div>
      )}

      {/* Styled Scanning Laser keyframe styles */}
      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(100vh); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
