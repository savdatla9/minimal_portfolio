"use client";

import { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, RotateCcw, Music, Layers, HelpCircle, 
  Sparkles, Piano, Keyboard, Disc, Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

// --- Types & Data Interfaces ---
// interface PianoKey {
//   note: string;
//   freq: number;
//   trigger: string;
//   label: string;
//   isBlack: boolean;
//   whiteIndex: number; // Index in the white keys sequence (0-14)
// }

interface RecordedNote {
  note: string;
  time: number; // delay offset in ms since start of recording
  duration: number; // duration in ms
}

interface InstrumentPreset {
  name: string;
  type: string; // wave type
  color: string; // hex neon theme color
  accentClass: string; // Tailwind class
  glowClass: string;
  description: string;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  filterCutoff: number;
  filterQ: number;
}

// --- Key Mapping Setup (25 Keys, 2 Octaves: C4 to C6) ---
const WHITE_KEYS = [
  { note: "C4", freq: 261.63, trigger: "A", label: "C" },
  { note: "D4", freq: 293.66, trigger: "S", label: "D" },
  { note: "E4", freq: 329.63, trigger: "D", label: "E" },
  { note: "F4", freq: 349.23, trigger: "F", label: "F" },
  { note: "G4", freq: 392.00, trigger: "G", label: "G" },
  { note: "A4", freq: 440.00, trigger: "H", label: "A" },
  { note: "B4", freq: 493.88, trigger: "J", label: "B" },
  { note: "C5", freq: 523.25, trigger: "K", label: "C" },
  { note: "D5", freq: 587.33, trigger: "L", label: "D" },
  { note: "E5", freq: 659.25, trigger: ";", label: "E" },
  { note: "F5", freq: 698.46, trigger: "'", label: "F" },
  { note: "G5", freq: 783.99, trigger: "Z", label: "G" }, // Extended map
  { note: "A5", freq: 880.00, trigger: "X", label: "A" },
  { note: "B5", freq: 987.77, trigger: "C", label: "B" },
  { note: "C6", freq: 1046.50, trigger: "V", label: "C" },
];

const BLACK_KEYS = [
  { note: "C#4", freq: 277.18, trigger: "W", label: "C#", leftPercent: 6.666 },
  { note: "D#4", freq: 311.13, trigger: "E", label: "D#", leftPercent: 13.333 },
  // Gap between E4 and F4 (index 2 * 6.666 = 13.333)
  { note: "F#4", freq: 369.99, trigger: "T", label: "F#", leftPercent: 26.666 },
  { note: "G#4", freq: 415.30, trigger: "Y", label: "G#", leftPercent: 33.333 },
  { note: "A#4", freq: 466.16, trigger: "U", label: "A#", leftPercent: 40.000 },
  // Gap between B4 and C5 (index 6 * 6.666 = 40.0)
  { note: "C#5", freq: 554.37, trigger: "O", label: "C#", leftPercent: 53.333 },
  { note: "D#5", freq: 622.25, trigger: "P", label: "D#", leftPercent: 60.000 },
  // Gap between E5 and F5
  { note: "F#5", freq: 739.99, trigger: "[", label: "F#", leftPercent: 73.333 },
  { note: "G#5", freq: 830.61, trigger: "]", label: "G#", leftPercent: 80.000 },
  { note: "A#5", freq: 932.33, trigger: "1", label: "A#", leftPercent: 86.666 },
];

// All keys in flat access map
const ALL_KEYS_MAP = new Map<string, { note: string; freq: number; trigger: string; isBlack: boolean; whiteIndex: number }>();
WHITE_KEYS.forEach((k, idx) => {
  ALL_KEYS_MAP.set(k.note, { ...k, isBlack: false, whiteIndex: idx });
  ALL_KEYS_MAP.set(k.trigger.toUpperCase(), { ...k, isBlack: false, whiteIndex: idx });
});
BLACK_KEYS.forEach((k, idx) => {
  // Associate with white index for visual bursts
  let assocIdx = 0;
  if (k.note.startsWith("C#")) assocIdx = k.note.endsWith("4") ? 0 : 7;
  else if (k.note.startsWith("D#")) assocIdx = k.note.endsWith("4") ? 1 : 8;
  else if (k.note.startsWith("F#")) assocIdx = k.note.endsWith("4") ? 3 : 10;
  else if (k.note.startsWith("G#")) assocIdx = k.note.endsWith("4") ? 4 : 11;
  else if (k.note.startsWith("A#")) assocIdx = k.note.endsWith("4") ? 5 : 12;

  ALL_KEYS_MAP.set(k.note, { ...k, isBlack: true, whiteIndex: assocIdx });
  ALL_KEYS_MAP.set(k.trigger.toUpperCase(), { ...k, isBlack: true, whiteIndex: assocIdx });
});

// --- Preloaded Demos ---
const DEMO_SONGS = [
  {
    name: "Fur Elise (Theme)",
    notes: [
      { note: "E5", time: 0, duration: 250 },
      { note: "D#5", time: 300, duration: 250 },
      { note: "E5", time: 600, duration: 250 },
      { note: "D#5", time: 900, duration: 250 },
      { note: "E5", time: 1200, duration: 250 },
      { note: "B4", time: 1500, duration: 250 },
      { note: "D5", time: 1800, duration: 250 },
      { note: "C5", time: 2100, duration: 250 },
      { note: "A4", time: 2400, duration: 500 },
      
      { note: "C4", time: 3000, duration: 250 },
      { note: "E4", time: 3300, duration: 250 },
      { note: "A4", time: 3600, duration: 250 },
      { note: "B4", time: 3900, duration: 500 },
      
      { note: "E4", time: 4500, duration: 250 },
      { note: "G#4", time: 4800, duration: 250 },
      { note: "B4", time: 5100, duration: 250 },
      { note: "C5", time: 5400, duration: 500 },
    ]
  },
  {
    name: "Ode to Joy",
    notes: [
      { note: "E4", time: 0, duration: 350 },
      { note: "E4", time: 400, duration: 350 },
      { note: "F4", time: 800, duration: 350 },
      { note: "G4", time: 1200, duration: 350 },
      { note: "G4", time: 1600, duration: 350 },
      { note: "F4", time: 2000, duration: 350 },
      { note: "E4", time: 2400, duration: 350 },
      { note: "D4", time: 2800, duration: 350 },
      { note: "C4", time: 3200, duration: 350 },
      { note: "C4", time: 3600, duration: 350 },
      { note: "D4", time: 4000, duration: 350 },
      { note: "E4", time: 4400, duration: 350 },
      { note: "E4", time: 4800, duration: 500 },
      { note: "D4", time: 5300, duration: 150 },
      { note: "D4", time: 5500, duration: 600 },
    ]
  },
  {
    name: "Retro Arpeggio",
    notes: [
      { note: "C4", time: 0, duration: 150 },
      { note: "E4", time: 150, duration: 150 },
      { note: "G4", time: 300, duration: 150 },
      { note: "C5", time: 450, duration: 150 },
      { note: "E5", time: 600, duration: 150 },
      { note: "G5", time: 750, duration: 150 },
      { note: "C6", time: 900, duration: 300 },
      
      { note: "A4", time: 1300, duration: 150 },
      { note: "C5", time: 1450, duration: 150 },
      { note: "E5", time: 1600, duration: 150 },
      { note: "A5", time: 1750, duration: 150 },
      { note: "C6", time: 1900, duration: 400 },
    ]
  }
];

// --- Instrument Definitions ---
const INSTRUMENTS: InstrumentPreset[] = [
  {
    name: "Classic Grand",
    type: "triangle",
    color: "#f59e0b", // Amber
    accentClass: "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)] border-amber-400",
    glowClass: "shadow-[0_0_30px_-5px_rgba(245,158,11,0.6)] text-amber-500",
    description: "Warm acoustic piano timbre layered with harmonics and resonant filter mapping.",
    attack: 0.005,
    decay: 1.2,
    sustain: 0.1,
    release: 0.8,
    filterCutoff: 1500,
    filterQ: 1.5,
  },
  {
    name: "Retro Wave Lead",
    type: "sawtooth",
    color: "#ec4899", // Pink/Magenta
    accentClass: "bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)] border-pink-400",
    glowClass: "shadow-[0_0_30px_-5px_rgba(236,72,153,0.6)] text-pink-500",
    description: "Fat dual-sawtooth synthesis with broad chorus detune and high cutoff envelope.",
    attack: 0.04,
    decay: 0.4,
    sustain: 0.7,
    release: 0.5,
    filterCutoff: 2600,
    filterQ: 5.5,
  },
  {
    name: "Ambient Pad",
    type: "triangle",
    color: "#06b6d4", // Cyan
    accentClass: "bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)] border-cyan-400",
    glowClass: "shadow-[0_0_30px_-5px_rgba(6,182,212,0.6)] text-cyan-500",
    description: "Slow swelling, dreamlike pad featuring deep sub-harmonics and long tail echoes.",
    attack: 0.45,
    decay: 2.0,
    sustain: 0.85,
    release: 2.2,
    filterCutoff: 900,
    filterQ: 0.8,
  },
  {
    name: "8-Bit Arcade",
    type: "square",
    color: "#10b981", // Emerald
    accentClass: "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] border-emerald-400",
    glowClass: "shadow-[0_0_30px_-5px_rgba(16,185,129,0.6)] text-emerald-500",
    description: "Vintage square wave synth with instant envelopes and a brief introductory pitch glide.",
    attack: 0.001,
    decay: 0.18,
    sustain: 0.0,
    release: 0.05,
    filterCutoff: 5000,
    filterQ: 1.0,
  }
];

export default function MusicPianoPage() {
  // --- UI States ---
  const [selectedInstIdx, setSelectedInstIdx] = useState(0);
  const currentInst = INSTRUMENTS[selectedInstIdx];

  // ADSR states, initialized by selected instrument
  const [volume, setVolume] = useState(0.7);
  const [attack, setAttack] = useState(currentInst.attack);
  const [decay, setDecay] = useState(currentInst.decay);
  const [sustain, setSustain] = useState(currentInst.sustain);
  const [release, setRelease] = useState(currentInst.release);
  const [cutoff, setCutoff] = useState(currentInst.filterCutoff);
  const [delayFeedback, setDelayFeedback] = useState(0.3); // delay echo intensity
  const [octaveShift, setOctaveShift] = useState(0); // -1, 0, +1
  
  // Interactive Toggles
  const [labelMode, setLabelMode] = useState<"none" | "note" | "key">("note");
  const [visualMode, setVisualMode] = useState<"oscilloscope" | "spectrum">("oscilloscope");
  const [isSustainEnabled, setIsSustainEnabled] = useState(false);

  // Piano Playing State
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordedSequence, setRecordedSequence] = useState<RecordedNote[]>([]);
  const [isPlayingRecording, setIsPlayingRecording] = useState(false);
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [selectedDemoIdx, setSelectedDemoIdx] = useState(0);

  // Audio Context Active Status
  const [isAudioActive, setIsAudioActive] = useState(false);

  // Record timing
  const recordStartTimeRef = useRef<number>(0);
  const noteStartTimesRef = useRef<Map<string, number>>(new Map());

  // --- Web Audio Refs ---
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterVolumeRef = useRef<GainNode | null>(null);
  const delayNodeRef = useRef<DelayNode | null>(null);
  const delayGainRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  
  // Tracking active sound oscillators
  // key: noteName, value: active nodes list to release later
  const activeNodesRef = useRef<Map<string, { oscs: OscillatorNode[]; gain: GainNode }>>(new Map());

  // --- Canvas Visualizer Refs ---
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<any[]>([]);

  // Update knob controls if instrument preset changes
  useEffect(() => {
    setAttack(currentInst.attack);
    setDecay(currentInst.decay);
    setSustain(currentInst.sustain);
    setRelease(currentInst.release);
    setCutoff(currentInst.filterCutoff);
    if (selectedInstIdx === 2) {
      // pad presets automatically increase echo
      setDelayFeedback(0.55);
    } else if (selectedInstIdx === 3) {
      // 8-bit has no delay
      setDelayFeedback(0);
    } else {
      setDelayFeedback(0.3);
    }
  }, [selectedInstIdx]);

  // --- Initializing Web Audio ---
  const initAudio = () => {
    if (audioCtxRef.current) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Master Gain
      const masterVol = ctx.createGain();
      masterVol.gain.value = volume;
      masterVolumeRef.current = masterVol;

      // Resonant Lowpass Filter
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = cutoff;
      filter.Q.value = currentInst.filterQ;
      filterNodeRef.current = filter;

      // Echo Delay Line
      const delay = ctx.createDelay(2.0);
      delay.delayTime.value = 0.35; // 350ms delay
      const feedback = ctx.createGain();
      feedback.gain.value = delayFeedback;
      
      delayNodeRef.current = delay;
      delayGainRef.current = feedback;

      // Analyser Node for Visualizer
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      analyserRef.current = analyser;

      // Routing:
      // Synthesis Source -> Filter -> Master Gain -> Analyser -> Destination
      // Filter -> Delay -> Feedback Gain -> Delay (loop)
      // Delay -> Master Gain
      filter.connect(masterVol);
      
      // Hook up Delay circuit
      filter.connect(delay);
      delay.connect(feedback);
      feedback.connect(delay);
      feedback.connect(masterVol);

      masterVol.connect(analyser);
      analyser.connect(ctx.destination);

      setIsAudioActive(true);
    } catch (e) {
      console.error("Failed to initialize Web Audio API: ", e);
    }
  };

  // Keep live controls synchronized in Web Audio nodes
  useEffect(() => {
    if (masterVolumeRef.current && audioCtxRef.current) {
      masterVolumeRef.current.gain.setTargetAtTime(volume, audioCtxRef.current.currentTime, 0.05);
    }
  }, [volume]);

  useEffect(() => {
    if (filterNodeRef.current && audioCtxRef.current) {
      filterNodeRef.current.frequency.setTargetAtTime(cutoff, audioCtxRef.current.currentTime, 0.05);
    }
  }, [cutoff]);

  useEffect(() => {
    if (delayGainRef.current && audioCtxRef.current) {
      delayGainRef.current.gain.setTargetAtTime(delayFeedback, audioCtxRef.current.currentTime, 0.05);
    }
  }, [delayFeedback]);

  // --- Particle Spawner ---
  const spawnParticles = (whiteKeyIdx: number) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    
    // Width per white key (15 keys total)
    const keyWidth = canvas.width / 15;
    const xBase = whiteKeyIdx * keyWidth + keyWidth / 2;
    
    // Spawn 8 beautiful neon bubbles rising
    for (let i = 0; i < 8; i++) {
      particlesRef.current.push({
        x: xBase + (Math.random() - 0.5) * (keyWidth * 0.6),
        y: canvas.height - 10,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -Math.random() * 2.5 - 1.0,
        radius: Math.random() * 6 + 2,
        life: 0,
        maxLife: Math.random() * 60 + 40,
        color: currentInst.color,
        alpha: Math.random() * 0.7 + 0.3
      });
    }
  };

  // --- Synth Sound Play Trigger ---
  const playNote = (noteName: string) => {
    initAudio(); // Initialize on click if not done yet
    
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const keyData = ALL_KEYS_MAP.get(noteName);
    if (!keyData) return;

    // Shift frequency depending on Octave Shift setting
    let shiftedFreq = keyData.freq;
    if (octaveShift === 1) shiftedFreq *= 2;
    else if (octaveShift === 2) shiftedFreq *= 4;
    else if (octaveShift === -1) shiftedFreq /= 2;
    else if (octaveShift === -2) shiftedFreq /= 4;

    // Stop active note node if re-triggering to prevent node clutter
    if (activeNodesRef.current.has(noteName)) {
      releaseNote(noteName, true);
    }

    const now = ctx.currentTime;

    // Create dynamic Envelope Gain Node
    const noteGain = ctx.createGain();
    noteGain.gain.setValueAtTime(0, now);

    // Instrument Timbre Synthesis: Layering multiple oscillators for premium depth!
    const oscs: OscillatorNode[] = [];

    if (currentInst.type === "triangle" && selectedInstIdx === 0) {
      // --- Preset 0: Premium Warm Grand Piano ---
      // Fundamental triangle wave
      const osc1 = ctx.createOscillator();
      osc1.type = "triangle";
      osc1.frequency.setValueAtTime(shiftedFreq, now);
      
      // Secondary sine harmonic (double freq, brighter pitch spark)
      const osc2 = ctx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(shiftedFreq * 2, now);

      // Low subtone for depth (1/2 frequency)
      const osc3 = ctx.createOscillator();
      osc3.type = "sine";
      osc3.frequency.setValueAtTime(shiftedFreq / 2, now);

      osc1.connect(noteGain);
      osc2.connect(noteGain);
      osc3.connect(noteGain);

      oscs.push(osc1, osc2, osc3);
      
      // Piano hammer strike envelope (Instant peak, quick slight decay)
      noteGain.gain.linearRampToValueAtTime(0.8, now + attack);
      noteGain.gain.exponentialRampToValueAtTime(sustain + 0.05, now + attack + decay);

    } else if (currentInst.type === "sawtooth") {
      // --- Preset 1: Fat Retro Sawtooth Lead ---
      // Two sawtooth waves slightly detuned (+6 and -6 cents) for chorus stereo thickness
      const osc1 = ctx.createOscillator();
      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(shiftedFreq, now);
      osc1.detune.setValueAtTime(8, now);

      const osc2 = ctx.createOscillator();
      osc2.type = "sawtooth";
      osc2.frequency.setValueAtTime(shiftedFreq, now);
      osc2.detune.setValueAtTime(-8, now);

      // Deep sub octave
      const osc3 = ctx.createOscillator();
      osc3.type = "triangle";
      osc3.frequency.setValueAtTime(shiftedFreq / 2, now);

      osc1.connect(noteGain);
      osc2.connect(noteGain);
      osc3.connect(noteGain);

      oscs.push(osc1, osc2, osc3);

      noteGain.gain.linearRampToValueAtTime(0.7, now + attack);
      noteGain.gain.exponentialRampToValueAtTime(sustain, now + attack + decay);

    } else if (selectedInstIdx === 2) {
      // --- Preset 2: Ambient Space Swell Pad ---
      // Double triangle waves slightly out of phase, and a deep sub sine
      const osc1 = ctx.createOscillator();
      osc1.type = "triangle";
      osc1.frequency.setValueAtTime(shiftedFreq, now);
      osc1.detune.setValueAtTime(4, now);

      const osc2 = ctx.createOscillator();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(shiftedFreq * 1.005, now);
      osc2.detune.setValueAtTime(-4, now);

      const osc3 = ctx.createOscillator();
      osc3.type = "sine";
      osc3.frequency.setValueAtTime(shiftedFreq / 2, now);

      osc1.connect(noteGain);
      osc2.connect(noteGain);
      osc3.connect(noteGain);

      oscs.push(osc1, osc2, osc3);

      // Slow rising swell envelope
      noteGain.gain.linearRampToValueAtTime(0.7, now + attack);
      noteGain.gain.linearRampToValueAtTime(sustain, now + attack + decay);

    } else if (selectedInstIdx === 3) {
      // --- Preset 3: 8-Bit Retro Chiptune ---
      const osc = ctx.createOscillator();
      osc.type = "square";
      
      // Retro pitch bend envelope! Slide pitch from 1.3x down to note freq very quickly
      osc.frequency.setValueAtTime(shiftedFreq * 1.35, now);
      osc.frequency.exponentialRampToValueAtTime(shiftedFreq, now + 0.06);

      // Add a vintage vibrato LFO!
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 8; // 8Hz vibrato
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 6; // vibrato pitch depth
      
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start(now);
      
      osc.connect(noteGain);
      oscs.push(osc);
      
      // Keep reference of LFO to stop it later
      (osc as any).lfo = lfo;

      // Ultra sharp ADSR
      noteGain.gain.linearRampToValueAtTime(0.7, now + attack);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay);
    }

    // Connect note to master filter
    if (filterNodeRef.current) {
      noteGain.connect(filterNodeRef.current);
    }

    // Start all note oscillators
    oscs.forEach(osc => osc.start(now));

    // Store in live tracking map
    activeNodesRef.current.set(noteName, { oscs, gain: noteGain });

    // UI Feedback
    setActiveNotes(prev => {
      const next = new Set(prev);
      next.add(noteName);
      return next;
    });

    // Particle Feedback
    spawnParticles(keyData.whiteIndex);

    // Recording Logic
    if (isRecording) {
      const recordOffset = Date.now() - recordStartTimeRef.current;
      noteStartTimesRef.current.set(noteName, recordOffset);
    }
  };

  // --- Synth Sound Release Trigger ---
  const releaseNote = (noteName: string, forceInstant = false) => {
    const ctx = audioCtxRef.current;
    const nodeGroup = activeNodesRef.current.get(noteName);
    
    if (!ctx || !nodeGroup) return;

    // Sustain Pedal Logic: If sustain is on, ignore release unless forced
    if (isSustainEnabled && !forceInstant) {
      return;
    }

    const { oscs, gain } = nodeGroup;
    const now = ctx.currentTime;
    const currentRelease = forceInstant ? 0.01 : release;

    try {
      // Prevent sound pops by ramping to 0 smoothly
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + currentRelease);

      // Clean up nodes after release ring decays completely
      oscs.forEach(osc => {
        setTimeout(() => {
          try {
            osc.stop();
            osc.disconnect();
            if ((osc as any).lfo) {
              (osc as any).lfo.stop();
              (osc as any).lfo.disconnect();
            }
          } catch (err) {}
        }, currentRelease * 1000 + 100);
      });
    } catch (e) {
      console.warn("Error releasing audio nodes:", e);
    }

    activeNodesRef.current.delete(noteName);

    // UI Feedback
    setActiveNotes(prev => {
      const next = new Set(prev);
      next.delete(noteName);
      return next;
    });

    // Recording playback complete tracking
    if (isRecording) {
      const startTime = noteStartTimesRef.current.get(noteName);
      if (startTime !== undefined) {
        const duration = (Date.now() - recordStartTimeRef.current) - startTime;
        setRecordedSequence(prev => [
          ...prev,
          { note: noteName, time: startTime, duration: Math.max(duration, 50) }
        ]);
        noteStartTimesRef.current.delete(noteName);
      }
    }
  };

  // --- Sustain Pedal Cleanup ---
  // When turning off sustain, release all notes that have been released by mouse/keyboard
  const triggerSustainOff = () => {
    setIsSustainEnabled(false);
    // Release active keys that are no longer pressed down in QWERTY/Clicks
    // For simplicity, we just trigger release on everything in our active nodes ref
    activeNodesRef.current.forEach((value, noteName) => {
      // If the note isn't physically being held down, release it!
      // To simplify, we can clear notes that aren't clicked
      releaseNote(noteName, true);
    });
  };

  // --- Keyboard Event Handlers ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key events if typing in form controls or modifier key held (Ctrl+C, etc)
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) return;

      const keyPressed = e.key.toUpperCase();
      
      // Match key trigger
      let noteToPlay: string | null = null;
      WHITE_KEYS.forEach(k => {
        if (k.trigger.toUpperCase() === keyPressed) noteToPlay = k.note;
      });
      BLACK_KEYS.forEach(k => {
        if (k.trigger.toUpperCase() === keyPressed) noteToPlay = k.note;
      });

      if (noteToPlay) {
        e.preventDefault();
        playNote(noteToPlay);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const keyPressed = e.key.toUpperCase();
      let noteToRelease: string | null = null;
      
      WHITE_KEYS.forEach(k => {
        if (k.trigger.toUpperCase() === keyPressed) noteToRelease = k.note;
      });
      BLACK_KEYS.forEach(k => {
        if (k.trigger.toUpperCase() === keyPressed) noteToRelease = k.note;
      });

      if (noteToRelease) {
        e.preventDefault();
        releaseNote(noteToRelease);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [selectedInstIdx, octaveShift, isSustainEnabled, isRecording, release]);

  // --- Drag/Glissando Support ---
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [lastDraggedNote, setLastDraggedNote] = useState<string | null>(null);

  const handleKeyMouseDown = (noteName: string) => {
    setIsMouseDown(true);
    setLastDraggedNote(noteName);
    playNote(noteName);
  };

  const handleKeyMouseEnter = (noteName: string) => {
    if (!isMouseDown) return;
    if (lastDraggedNote && lastDraggedNote !== noteName) {
      releaseNote(lastDraggedNote);
    }
    setLastDraggedNote(noteName);
    playNote(noteName);
  };

  const handleKeyMouseUpOrLeave = (noteName: string) => {
    if (!isMouseDown) return;
    releaseNote(noteName);
    if (lastDraggedNote === noteName) {
      setLastDraggedNote(null);
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsMouseDown(false);
      if (lastDraggedNote) {
        releaseNote(lastDraggedNote);
        setLastDraggedNote(null);
      }
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, [lastDraggedNote]);

  // --- Recording Control Panel Functions ---
  const toggleRecording = () => {
    initAudio();
    if (!isRecording) {
      // Start recording
      setRecordedSequence([]);
      noteStartTimesRef.current.clear();
      recordStartTimeRef.current = Date.now();
      setIsRecording(true);
    } else {
      // Stop recording
      setIsRecording(false);
      // Clean up any notes still playing at stop time
      const endTime = Date.now() - recordStartTimeRef.current;
      noteStartTimesRef.current.forEach((startTime, noteName) => {
        setRecordedSequence(prev => [
          ...prev,
          { note: noteName, time: startTime, duration: endTime - startTime }
        ]);
      });
      noteStartTimesRef.current.clear();
    }
  };

  const playRecordedSong = () => {
    if (recordedSequence.length === 0) return;
    initAudio();
    setIsPlayingRecording(true);

    recordedSequence.forEach(item => {
      // Schedule playNote
      setTimeout(() => {
        playNote(item.note);
      }, item.time);

      // Schedule releaseNote
      setTimeout(() => {
        releaseNote(item.note, true);
      }, item.time + item.duration);
    });

    // Reset play button state after song ends
    const songLength = Math.max(...recordedSequence.map(n => n.time + n.duration), 0);
    setTimeout(() => {
      setIsPlayingRecording(false);
    }, songLength + 200);
  };

  const playDemoSong = (songIdx: number) => {
    initAudio();
    if (isPlayingDemo || isPlayingRecording) return;
    setIsPlayingDemo(true);
    
    const song = DEMO_SONGS[songIdx];
    
    song.notes.forEach(item => {
      setTimeout(() => {
        playNote(item.note);
      }, item.time);

      setTimeout(() => {
        releaseNote(item.note, true);
      }, item.time + item.duration);
    });

    const songLength = Math.max(...song.notes.map(n => n.time + n.duration), 0);
    setTimeout(() => {
      setIsPlayingDemo(false);
    }, songLength + 200);
  };

  // --- Live HTML5 Canvas Rendering ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      // Handle high-dpi sizing
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width || canvas.height !== rect.height) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw glowing background grid
      ctx.strokeStyle = "rgba(63, 63, 70, 0.15)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // 2. Plot Real-Time Waveform / Frequency Spectrum from Analyser
      if (analyserRef.current && isAudioActive) {
        const analyser = analyserRef.current;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        if (visualMode === "oscilloscope") {
          analyser.getByteTimeDomainData(dataArray);
          
          // Draw continuous neon glowing line
          ctx.strokeStyle = currentInst.color;
          ctx.shadowBlur = 12;
          ctx.shadowColor = currentInst.color;
          ctx.lineWidth = 3.5;
          ctx.beginPath();

          const sliceWidth = canvas.width / bufferLength;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0; // range 0 to 2
            const y = (v * canvas.height) / 2;

            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
            x += sliceWidth;
          }
          
          ctx.lineTo(canvas.width, canvas.height / 2);
          ctx.stroke();
          ctx.shadowBlur = 0; // reset
        } else {
          // FFT frequency bars
          analyser.getByteFrequencyData(dataArray);
          
          const barWidth = (canvas.width / bufferLength) * 2.5;
          let barHeight;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] * 0.75;

            // Gradient fill
            const grad = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
            grad.addColorStop(0, "rgba(24, 24, 27, 0.5)");
            grad.addColorStop(1, currentInst.color);
            ctx.fillStyle = grad;
            
            ctx.shadowBlur = 6;
            ctx.shadowColor = currentInst.color;
            ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
            
            x += barWidth + 1;
          }
          ctx.shadowBlur = 0;
        }
      } else {
        // Fallback: draw flat ambient centerline when silent
        ctx.strokeStyle = "rgba(113, 113, 122, 0.4)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      }

      // 3. Draw & Animate interactive rising bubble particles
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        
        const opacity = p.alpha * (1 - p.life / p.maxLife);
        
        ctx.save();
        ctx.globalAlpha = opacity > 0 ? opacity : 0;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Delete dead bubbles
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [selectedInstIdx, visualMode, isAudioActive]);

  // Clean up Web Audio completely on page destroy
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <main className="min-h-screen pb-16 pt-4 text-zinc-100 flex flex-col items-center">
      {/* --- Page Header Banner --- */}
      <section className="w-full text-center mb-8 flex flex-col items-center">
        <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-zinc-900/60 border border-zinc-800 backdrop-blur-md mb-3">
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Next-Gen Web Synthesizer
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-linear-to-r from-zinc-100 via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
          NeoSynth Studio
        </h1>
        <p className="text-sm md:text-base text-zinc-400 max-w-xl mt-2 px-4 leading-relaxed">
          An immersive Web Audio virtual studio. Click, touch, or type on your computer keyboard to trigger gorgeous responsive soundscapes.
        </p>
      </section>

      {/* --- Main Dashboard Container --- */}
      <section className="w-full max-w-5xl px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Instrument Timbres & Presets */}
        <div className="space-y-6">
          <Card className="p-6 bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2 text-zinc-200">
                  <Layers className="w-5 h-5 text-cyan-400" />
                  Instrument Preset
                </h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400">
                  Active
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {INSTRUMENTS.map((inst, idx) => {
                  const isActive = selectedInstIdx === idx;
                  return (
                    <button
                      key={inst.name}
                      onClick={() => setSelectedInstIdx(idx)}
                      className={`relative p-3 rounded-xl border text-left transition-all duration-300 ${
                        isActive 
                          ? `bg-zinc-800 border-zinc-700 ${inst.glowClass}` 
                          : "bg-zinc-950/60 border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/30"
                      }`}
                    >
                      {isActive && (
                        <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${inst.accentClass}`} />
                      )}
                      <Piano className={`w-6 h-6 mb-2 ${isActive ? "" : "text-zinc-600"} transition-colors`} style={{ color: isActive ? inst.color : undefined }} />
                      <div className="font-bold text-xs leading-none">{inst.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-800/60 text-xs text-zinc-400 leading-relaxed min-h-[50px]">
              {currentInst.description}
            </div>
          </Card>

          {/* Sound Controls Board */}
          <Card className="p-6 bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 space-y-5">
            <h3 className="font-bold text-lg flex items-center gap-2 text-zinc-200">
              <Sliders className="w-5 h-5 text-pink-400" />
              Synthesizer Panel
            </h3>

            {/* Volume */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-zinc-400">
                <span>Output Volume</span>
                <span>{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-200"
              />
            </div>

            {/* ADSR Sliders */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] text-zinc-500 font-mono">
                  <span>Attack</span>
                  <span>{attack.toFixed(2)}s</span>
                </div>
                <input
                  type="range"
                  min="0.001"
                  max="1.5"
                  step="0.02"
                  value={attack}
                  onChange={(e) => setAttack(parseFloat(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-zinc-400"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] text-zinc-500 font-mono">
                  <span>Release</span>
                  <span>{release.toFixed(2)}s</span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="3"
                  step="0.05"
                  value={release}
                  onChange={(e) => setRelease(parseFloat(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-zinc-400"
                />
              </div>
            </div>

            {/* Cutoff Filter */}
            <div className="space-y-2 pt-2 border-t border-zinc-800/60">
              <div className="flex justify-between text-xs font-semibold text-zinc-400">
                <span>Lowpass Cutoff</span>
                <span>{cutoff} Hz</span>
              </div>
              <input
                type="range"
                min="100"
                max="8000"
                step="50"
                value={cutoff}
                onChange={(e) => setCutoff(parseInt(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-200"
              />
            </div>

            {/* Echo delay */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-zinc-400">
                <span>Echo Feedback</span>
                <span>{Math.round(delayFeedback * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.85"
                step="0.05"
                value={delayFeedback}
                disabled={selectedInstIdx === 3} // Disabled for 8-bit
                onChange={(e) => setDelayFeedback(parseFloat(e.target.value))}
                className={`w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-200 ${
                  selectedInstIdx === 3 ? "opacity-30 cursor-not-allowed" : ""
                }`}
              />
            </div>
          </Card>
        </div>

        {/* MIDDLE & RIGHT COLUMNS: Canvas Waveform Visualizer & Key Controllers */}
        <div className="lg:col-span-2 space-y-6">
          {/* Audio Canvas Display Card */}
          <Card className="relative overflow-hidden bg-zinc-950/80 border border-zinc-900 shadow-inner p-2 rounded-2xl flex flex-col">
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className={`text-[10px] h-7 px-2.5 bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white transition-colors`}
                style={{ borderColor: visualMode === "oscilloscope" ? currentInst.color : undefined }}
                onClick={() => setVisualMode("oscilloscope")}
              >
                Oscilloscope
              </Button>
              <Button
                size="sm"
                variant="outline"
                className={`text-[10px] h-7 px-2.5 bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white transition-colors`}
                style={{ borderColor: visualMode === "spectrum" ? currentInst.color : undefined }}
                onClick={() => setVisualMode("spectrum")}
              >
                Spectrum Analyzer
              </Button>
            </div>

            <canvas
              ref={canvasRef}
              className="w-full h-40 md:h-48 rounded-xl bg-zinc-950 border border-zinc-900/60"
            />
          </Card>

          {/* Recorder, Autoplayer & Key settings bar */}
          <Card className="p-4 bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 flex flex-wrap gap-4 items-center justify-between">
            {/* Recording Deck */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={toggleRecording}
                className={`h-9 px-3 flex items-center gap-1.5 bg-zinc-950/60 text-xs font-semibold hover:bg-zinc-900 transition-colors ${
                  isRecording 
                    ? "border-red-500/80 text-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.2)]" 
                    : "border-zinc-800 text-zinc-300"
                }`}
              >
                <Disc className={`w-4 h-4 ${isRecording ? "text-red-500" : "text-zinc-500"}`} />
                {isRecording ? "Stop Rec" : "Record Live"}
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                disabled={recordedSequence.length === 0 || isPlayingRecording}
                onClick={playRecordedSong}
                className={`h-9 px-3 flex items-center gap-1.5 bg-zinc-950/60 text-xs font-semibold border-zinc-800 text-zinc-300 disabled:opacity-40`}
              >
                <Play className="w-4 h-4 text-emerald-500" />
                Play Rec
              </Button>
              
              {recordedSequence.length > 0 && (
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setRecordedSequence([])}
                  className="h-9 w-9 bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-white"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>

            {/* Song Autoplayer */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-zinc-500 text-xs mr-1 font-semibold">
                <Music className="w-3.5 h-3.5 text-pink-500" />
                <span>Demos:</span>
              </div>
              <select
                value={selectedDemoIdx}
                onChange={(e) => setSelectedDemoIdx(parseInt(e.target.value))}
                className="bg-zinc-950 text-xs text-zinc-300 border border-zinc-800 rounded px-2 py-1.5 h-9 focus:outline-none focus:ring-1 focus:ring-zinc-700 cursor-pointer"
              >
                {DEMO_SONGS.map((song, idx) => (
                  <option key={song.name} value={idx}>{song.name}</option>
                ))}
              </select>
              <Button
                size="sm"
                variant="outline"
                disabled={isPlayingDemo || isPlayingRecording}
                onClick={() => playDemoSong(selectedDemoIdx)}
                className="h-9 px-3 bg-zinc-950 border-zinc-800 text-zinc-300 text-xs font-semibold"
              >
                Demo Play
              </Button>
            </div>

            {/* Label Modes & Sustain Pedal Toggle */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-zinc-500 font-mono">Labels:</span>
                <select
                  value={labelMode}
                  onChange={(e) => setLabelMode(e.target.value as any)}
                  className="bg-zinc-950 text-[11px] text-zinc-400 border border-zinc-800 rounded px-1.5 py-1 focus:outline-none cursor-pointer"
                >
                  <option value="none">None</option>
                  <option value="note">Notes</option>
                  <option value="key">PC Keys</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-zinc-950/40 px-2.5 py-1 rounded border border-zinc-800/80">
                <span className="text-[11px] text-zinc-500 font-mono">Sustain</span>
                <Switch
                  checked={isSustainEnabled}
                  onCheckedChange={(checked) => checked ? setIsSustainEnabled(true) : triggerSustainOff()}
                  className="scale-90"
                />
              </div>
            </div>
          </Card>

          {/* Octave Selector & Keyboard Guides */}
          <div className="flex justify-between items-center bg-zinc-900/10 border border-zinc-800/60 p-3.5 rounded-xl text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-500">Octave Shift:</span>
              <div className="flex gap-1">
                {[-2, -1, 0, 1, 2].map((shift) => (
                  <button
                    key={shift}
                    onClick={() => setOctaveShift(shift)}
                    className={`px-2.5 py-1 rounded font-mono text-[11px] border transition-colors ${
                      octaveShift === shift
                        ? "bg-zinc-100 text-zinc-950 border-zinc-200"
                        : "bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-400"
                    }`}
                  >
                    {shift > 0 ? `+${shift}` : shift}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-zinc-500 text-[11px]">
              <Keyboard className="w-4 h-4 text-zinc-600" />
              <span>Map: QWERTY Row 2 (A to L) + Row 1 (W to U)</span>
            </div>
          </div>

          {/* --- THE 3D PIANO KEYBOARD WRAPPER --- */}
          <div className="relative select-none w-full bg-zinc-950 p-2.5 md:p-4 rounded-3xl border border-zinc-900 shadow-2xl">
            {/* The Keyboard Frame */}
            <div className="relative flex w-full border-t-8 border-zinc-900/80 rounded-t shadow-inner min-h-[220px] sm:min-h-[250px] md:min-h-[280px]">
              
              {/* WHITE KEYS LAYER */}
              {WHITE_KEYS.map((k) => {
                const isActive = activeNotes.has(k.note);
                return (
                  <div
                    key={k.note}
                    onMouseDown={() => handleKeyMouseDown(k.note)}
                    onMouseEnter={() => handleKeyMouseEnter(k.note)}
                    onMouseLeave={() => handleKeyMouseUpOrLeave(k.note)}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      playNote(k.note);
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      releaseNote(k.note);
                    }}
                    className={`
                      relative flex-1 flex flex-col justify-end items-center pb-4
                      border-r border-zinc-300/40 last:border-0 rounded-b-lg
                      transition-all duration-75 cursor-pointer origin-top select-none
                      ${
                        isActive
                          ? "bg-zinc-100 translate-y-0.5 shadow-[inset_0_-8px_10px_-4px_rgba(0,0,0,0.15)]"
                          : "bg-white shadow-[0_4px_3px_rgba(0,0,0,0.1),inset_0_-4px_6px_-2px_rgba(0,0,0,0.15)] hover:bg-zinc-50"
                      }
                    `}
                    style={{
                      // When active, white keys glow based on instrument color
                      borderBottom: isActive ? `5px solid ${currentInst.color}` : "5px solid #d4d4d8"
                    }}
                  >
                    {/* Visual Key Labels */}
                    {labelMode === "note" && (
                      <span className={`text-[10px] md:text-xs font-bold font-mono tracking-tighter ${isActive ? "text-zinc-900" : "text-zinc-400"}`}>
                        {k.note}
                      </span>
                    )}
                    {labelMode === "key" && (
                      <span className={`text-[10px] md:text-xs font-bold font-mono ${isActive ? "text-zinc-900" : "text-zinc-500"}`}>
                        {k.trigger}
                      </span>
                    )}
                  </div>
                );
              })}

              {/* BLACK KEYS LAYER */}
              {BLACK_KEYS.map((k) => {
                const isActive = activeNotes.has(k.note);
                return (
                  <div
                    key={k.note}
                    onMouseDown={(e) => {
                      e.stopPropagation(); // Stop white key trigger
                      handleKeyMouseDown(k.note);
                    }}
                    onMouseEnter={(e) => {
                      e.stopPropagation();
                      handleKeyMouseEnter(k.note);
                    }}
                    onMouseLeave={(e) => {
                      e.stopPropagation();
                      handleKeyMouseUpOrLeave(k.note);
                    }}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      playNote(k.note);
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      releaseNote(k.note);
                    }}
                    className={`
                      absolute top-0 z-25 w-6 sm:w-8 md:w-10 rounded-b-lg
                      transition-all duration-75 cursor-pointer origin-top select-none
                      ${
                        isActive
                          ? "bg-zinc-800 translate-y-0.5 shadow-[inset_0_-4px_6px_rgba(0,0,0,0.4)]"
                          : "bg-zinc-950 shadow-[0_4px_3px_rgba(0,0,0,0.4),inset_0_-2px_4px_-1px_rgba(255,255,255,0.06)] hover:bg-zinc-900"
                      }
                    `}
                    style={{
                      height: "60%",
                      left: `calc(${k.leftPercent}% - (clamp(24px, 2.5vw, 40px) / 2))`,
                      borderBottom: isActive ? `4px solid ${currentInst.color}` : "4px solid #18181b"
                    }}
                  >
                    {/* Visual Black Key Labels */}
                    <div className="h-full flex flex-col justify-end items-center pb-2">
                      {labelMode === "note" && (
                        <span className={`text-[8px] md:text-[10px] font-bold font-mono tracking-tighter ${isActive ? "text-zinc-100" : "text-zinc-500"}`}>
                          {k.note}
                        </span>
                      )}
                      {labelMode === "key" && (
                        <span className={`text-[8px] md:text-[10px] font-bold font-mono ${isActive ? "text-zinc-100" : "text-zinc-600"}`}>
                          {k.trigger}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

            </div>
          </div>
        </div>
      </section>

      {/* --- Help Section Banner --- */}
      <section className="w-full max-w-5xl px-4 mt-8">
        <Card className="p-6 bg-zinc-900/20 border border-zinc-900/80 rounded-2xl flex flex-col md:flex-row items-center gap-6">
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-900 flex items-center justify-center">
            <HelpCircle className="w-8 h-8 text-indigo-400" />
          </div>
          <div className="space-y-1.5 flex-1">
            <h4 className="font-bold text-sm text-zinc-200">How to Play?</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Use your mouse clicks or swipe down/drag across keys to play smoothly. If you are on laptop or desktop, map your hands onto the key grid. White keys map to <kbd className="px-1 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-semibold">A</kbd> through <kbd className="px-1 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-semibold">L</kbd> plus <kbd className="px-1 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-semibold">Z</kbd>, <kbd className="px-1 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-semibold">X</kbd>, <kbd className="px-1 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-semibold">C</kbd>, <kbd className="px-1 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-semibold">V</kbd>. Black keys map to QWERTY row characters above them (<kbd className="px-1 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-semibold">W</kbd>, <kbd className="px-1 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-semibold">E</kbd>, etc.). Adjust envelope parameters like <strong className="text-zinc-300">Attack</strong> or <strong className="text-zinc-300">Release</strong> to create short plucks or long ambient soundscapes!
            </p>
          </div>
        </Card>
      </section>
    </main>
  );
};