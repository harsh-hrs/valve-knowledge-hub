'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  GraduationCap,
  Play,
  RotateCcw,
  Sparkles,
  Info,
  Layers,
  Activity,
  Gauge
} from 'lucide-react';

// Reusable structural profile mapping valve-specific animation parameters across states
interface AnimationStateDetails {
  offset: number;       // rotary-turn: opening angle in degrees (0-90); linear types: closure retraction in SVG px
  pipeVelocity: number; // Mean line (pipe) velocity in m/s — rises with opening; drives the flow animation speed
  jetVelocity: number;  // Fluid velocity at the valve restriction in m/s (≈ sqrt(2·ΔP/ρ) while throttling) — falls as the valve opens
  pressureDrop: number; // ΔP across the valve (PSI): flowing head loss when open; static line differential held at 0%
  flowColor: string;    // CSS color mapping flow velocity state
  description: string;  // Pedagogical details explaining internal operations
}

interface ValveAnimationProfile {
  id: string;
  name: string;
  mechanismType: 'linear-slide' | 'rotary-turn' | 'linear-plug';
  componentLabel: string; // Closure member label
  states: {
    0: AnimationStateDetails;
    25: AnimationStateDetails;
    50: AnimationStateDetails;
    75: AnimationStateDetails;
    100: AnimationStateDetails;
  };
}

const ANIMATION_PROFILES: Record<string, ValveAnimationProfile> = {
  'gate': {
    id: 'gate',
    name: 'Wedge Gate Valve',
    mechanismType: 'linear-slide',
    componentLabel: 'Gate Wedge',
    states: {
      0: { offset: 0, pipeVelocity: 0, jetVelocity: 0, pressureDrop: 60, flowColor: 'stroke-slate-700', description: 'Fully closed. The gate wedge blocks the flow path and holds the full static line differential (~60 psi) at zero flow — that differential presses the wedge onto the downstream seat for absolute isolation.' },
      25: { offset: 8, pipeVelocity: 0.8, jetVelocity: 24.9, pressureDrop: 45, flowColor: 'stroke-rose-500', description: '25% open. Severe throttling: the 45 psi drop drives a ~25 m/s jet under the gate. If downstream pressure is low, local pressure at the vena contracta can fall below vapor pressure, causing cavitation and seat erosion — gate valves should not be used to throttle.' },
      50: { offset: 16, pipeVelocity: 2.3, jetVelocity: 16.6, pressureDrop: 20, flowColor: 'stroke-amber-500', description: '50% open. Restricted flow. Significant vortices shed downstream of the partially inserted wedge — the classic poor throttling behaviour of gate valves.' },
      75: { offset: 24, pipeVelocity: 2.8, jetVelocity: 10.5, pressureDrop: 8, flowColor: 'stroke-cyan-500', description: '75% open. The wedge is nearly clear of the bore; line velocity approaches its maximum and turbulence from the gate is dropping.' },
      100: { offset: 32, pipeVelocity: 3.0, jetVelocity: 3.2, pressureDrop: 0.1, flowColor: 'stroke-cyan-400', description: '100% open. Smooth, fully developed turbulent flow — water in industrial lines is turbulent at virtually any practical velocity (Re ~ 10^4–10^5; laminar flow in a 2-inch line would require under ~0.05 m/s) — with an undisturbed velocity profile. The gate is completely out of the flow stream: near-zero pressure drop across the body orifice (K ≈ 0.15–0.2).' }
    }
  },
  'ball': {
    id: 'ball',
    name: 'Floating Ball Valve',
    mechanismType: 'rotary-turn',
    componentLabel: 'Spherical Ball',
    states: {
      0: { offset: 0, pipeVelocity: 0, jetVelocity: 0, pressureDrop: 60, flowColor: 'stroke-slate-700', description: 'Closed position. Ball bore is perpendicular to pipe axis. Zero flow means zero dynamic pressure loss, but the ball now holds the full static line differential (~60 psi) — upstream pressure floats the ball into the downstream seat, and seating force equals ΔP times the seat area.' },
      25: { offset: 22.5, pipeVelocity: 0.9, jetVelocity: 26.3, pressureDrop: 50, flowColor: 'stroke-rose-500', description: '25% open (22.5°). High-velocity jets (~26 m/s at a 50 psi drop) cut through the narrow crescent-shaped port openings, risking seat erosion and wire-drawing damage — with cavitation when downstream pressure is low.' },
      50: { offset: 45, pipeVelocity: 2.2, jetVelocity: 18.6, pressureDrop: 25, flowColor: 'stroke-amber-500', description: '50% open (45°). Moderate flow. Strong shear layers shed from the port edges split the stream into vortices downstream of the bore.' },
      75: { offset: 67.5, pipeVelocity: 2.7, jetVelocity: 11.8, pressureDrop: 10, flowColor: 'stroke-cyan-500', description: '75% open (67.5°). The port is nearly aligned with the pipe; turbulence is confined to the shear layers shed from the port edges.' },
      100: { offset: 90, pipeVelocity: 3.0, jetVelocity: 3.1, pressureDrop: 0.05, flowColor: 'stroke-cyan-400', description: '100% open (90°). Full-bore straight-through flow. The ball port aligns with the pipeline and the valve behaves like a continuous pipe segment (K ≈ 0.05–0.1 for full-bore balls).' }
    }
  },
  'globe': {
    id: 'globe',
    name: 'Standard Globe Valve',
    mechanismType: 'linear-plug',
    componentLabel: 'Contoured Plug',
    states: {
      0: { offset: 0, pipeVelocity: 0, jetVelocity: 0, pressureDrop: 60, flowColor: 'stroke-slate-700', description: 'Closed. Stem thrust seats the contoured plug on the body seat ring; the valve holds the full static system differential (~60 psi) at zero flow.' },
      25: { offset: 8, pipeVelocity: 0.9, jetVelocity: 27.6, pressureDrop: 55, flowColor: 'stroke-rose-500', description: '25% open. Controlled throttling. The symmetrical annular gap between plug and seat gives precise flow control, but the 55 psi drop concentrates at the vena contracta just downstream of the seat — the highest-risk condition for cavitation; severe service uses multi-stage anti-cavitation trim.' },
      50: { offset: 16, pipeVelocity: 2.0, jetVelocity: 22.0, pressureDrop: 35, flowColor: 'stroke-amber-500', description: '50% open. Medium flow. Fluid turns twice through the Z-body orifice; the tortuous path keeps the resistance coefficient high, so the pressure drop scales with velocity squared (ΔP = K·ρ·v²/2) — it varies with flow rate, it is not constant.' },
      75: { offset: 24, pipeVelocity: 2.4, jetVelocity: 17.4, pressureDrop: 22, flowColor: 'stroke-amber-400', description: '75% open. High flow capacity, but the two 90° turns of the Z-path keep the permanent (unrecovered) pressure loss higher than a gate or ball valve.' },
      100: { offset: 32, pipeVelocity: 2.9, jetVelocity: 8.6, pressureDrop: 4.8, flowColor: 'stroke-cyan-500', description: '100% open. Maximum flow. Even at full stroke the Z-path keeps K ≈ 6–10, so the globe retains a measurable pressure drop (~5 psi at ~2.9 m/s line velocity) — the price of precise throttling control.' }
    }
  }
};

export default function AnimationsPage() {
  const [selectedValveId, setSelectedValveId] = useState<string>('gate');
  const [openingState, setOpeningState] = useState<0 | 25 | 50 | 75 | 100>(50);

  const activeValve = ANIMATION_PROFILES[selectedValveId];
  const currentState = activeValve.states[openingState];

  return (
    <div className="flex flex-col gap-12 py-8 max-w-5xl mx-auto">
      {/* Header Navigation */}
      <div className="flex flex-col gap-4 border-b border-white/5 pb-8">
        <Link
          href="/learn"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors self-start"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Academy
        </Link>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-400 p-2.5 flex items-center justify-center border border-purple-500/20">
            <GraduationCap className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-bold">Valve Animation Sandbox</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Simulate mechanical movements, investigate velocity profiles, and study flow lines at varying stroke depths.
        </p>
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Hand: Controls & Selection (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Valve Type Selector */}
          <div className="glass-panel rounded-2xl p-5 flex flex-col gap-3 border border-white/5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Select Valve Mechanism</span>
            <div className="flex flex-col gap-2">
              {Object.values(ANIMATION_PROFILES).map((valve) => (
                <button
                  key={valve.id}
                  onClick={() => setSelectedValveId(valve.id)}
                  className={`px-4 py-3 rounded-xl text-left text-xs font-bold transition-all border ${
                    selectedValveId === valve.id
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-white/5 text-muted-foreground border-white/5 hover:border-white/10 hover:text-foreground'
                  }`}
                >
                  {valve.name}
                </button>
              ))}
            </div>
          </div>

          {/* Stroke Position Selector */}
          <div className="glass-panel rounded-2xl p-5 flex flex-col gap-4 border border-white/5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Stroke Position (Opening)</span>
            <div className="grid grid-cols-5 gap-1.5 bg-white/5 p-1 rounded-xl border border-white/5">
              {([0, 25, 50, 75, 100] as const).map((pos) => (
                <button
                  key={pos}
                  onClick={() => setOpeningState(pos)}
                  className={`py-2 rounded-lg text-[10px] font-bold transition-all ${
                    openingState === pos
                      ? 'bg-primary text-primary-foreground shadow'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {pos}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Hand: Visual Viewport (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Animated SVG Pipeline Frame */}
          <div className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col items-center justify-between border border-white/5 bg-slate-950/40 relative min-h-[380px]">
            
            <div className="flex items-center justify-between w-full border-b border-white/5 pb-4 mb-4">
              <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
                <Activity className="h-4.5 w-4.5 text-primary" /> Inside Viewport Analysis
              </span>
              <span className="text-[10px] font-mono text-muted-foreground uppercase">
                Mode: Cross-Section Cutaway
              </span>
            </div>

            {/* Animation SVG Canvas */}
            <div className="w-full flex-1 flex items-center justify-center py-6">
              <svg className="w-full max-h-[260px] px-4" viewBox="0 0 300 150">
                {/* Piping Background Boundary */}
                <path d="M 10,60 L 120,60 L 120,24 L 180,24 L 180,60 L 290,60 L 290,90 L 180,90 L 180,120 L 120,120 L 120,90 L 10,90 Z" fill="none" stroke="#1e293b" strokeWidth="2.5" />
                
                {/* Seat Rings Reference (gate & ball; the globe draws its own Z-body seat) */}
                {activeValve.mechanismType !== 'linear-plug' && (
                  <g>
                    <rect x="117" y="58" width="4" height="34" fill="#f59e0b" stroke="#d97706" strokeWidth="0.5" />
                    <rect x="179" y="58" width="4" height="34" fill="#f59e0b" stroke="#d97706" strokeWidth="0.5" />
                  </g>
                )}

                {/* Flow line (speed driven by mean pipe velocity; Z-path routing for the globe) */}
                <path
                  d={activeValve.mechanismType === 'linear-plug'
                    ? 'M 10,75 L 118,75 Q 126,84 134,84 L 140,84 Q 150,84 150,70 Q 150,60 160,66 Q 168,72 176,75 L 290,75'
                    : 'M 10,75 L 130,75 C 140,75 145,75 150,75 C 155,75 160,75 170,75 L 290,75'}
                  fill="none"
                  className={currentState.flowColor}
                  strokeWidth={openingState === 0 ? 0.5 : Math.max(1, 5 - currentState.pressureDrop / 12)}
                  strokeDasharray="8 4"
                  style={{
                    animation: openingState === 0 ? 'none' : `flowAnim ${(2.4 / currentState.pipeVelocity).toFixed(2)}s linear infinite`
                  }}
                />

                {/* Component closure member based on mechanism profiles */}
                {activeValve.mechanismType === 'linear-slide' && (
                  <g>
                    {/* Stem & Wedge moves up/down on offset */}
                    <rect
                      x="147"
                      y={10 - currentState.offset}
                      width="6"
                      height="48"
                      fill="#475569"
                    />
                    <path
                      d={`M 130,${58 - currentState.offset} L 170,${58 - currentState.offset} L 165,${92 - currentState.offset} L 135,${92 - currentState.offset} Z`}
                      fill="#94a3b8"
                      stroke="#475569"
                      strokeWidth="1"
                    />
                  </g>
                )}

                {activeValve.mechanismType === 'rotary-turn' && (
                  <g transform="translate(150, 75)">
                    {/* Spherical ball rotates on angular offset */}
                    <g transform={`rotate(${currentState.offset - 90})`}>
                      <circle cx="0" cy="0" r="18" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
                      {/* Internal Bore Cutout */}
                      <rect x="-18" y="-6" width="36" height="12" fill="#060913" />
                    </g>
                    {/* Stem Linkage */}
                    <rect x="-3" y="-55" width="6" height="36" fill="#475569" />
                  </g>
                )}

                {activeValve.mechanismType === 'linear-plug' && (
                  <g>
                    {/* Z-body partition: inlet baffle, seat deck, orifice lips, downstream drop wall */}
                    <rect x="124" y="58" width="4" height="19" fill="#1e293b" />
                    <rect x="124" y="73" width="17" height="4" fill="#1e293b" />
                    <rect x="139" y="74" width="3" height="4" fill="#f59e0b" stroke="#d97706" strokeWidth="0.5" />
                    <rect x="158" y="74" width="3" height="4" fill="#f59e0b" stroke="#d97706" strokeWidth="0.5" />
                    <rect x="158" y="75" width="4" height="16" fill="#1e293b" />
                    {/* Globe contoured plug lifts linearly */}
                    <rect
                      x="147"
                      y={10 - currentState.offset}
                      width="6"
                      height="60"
                      fill="#475569"
                    />
                    <path
                      d={`M 132,${70 - currentState.offset} L 168,${70 - currentState.offset} Q 150,${85 - currentState.offset} 132,${70 - currentState.offset}`}
                      fill="#94a3b8"
                      stroke="#475569"
                      strokeWidth="1"
                    />
                  </g>
                )}
              </svg>
            </div>

            {/* Micro Metrics Panel */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full mt-4 border-t border-white/5 pt-4">
              <div className="bg-slate-950/30 border border-white/5 rounded-xl p-3 text-center">
                <div className="text-[10px] text-muted-foreground font-medium mb-1">Line Velocity</div>
                <div className="text-sm font-bold font-mono text-primary">
                  {currentState.pipeVelocity} m/s
                </div>
              </div>
              <div className="bg-slate-950/30 border border-white/5 rounded-xl p-3 text-center">
                <div className="text-[10px] text-muted-foreground font-medium mb-1">Jet Velocity (at restriction)</div>
                <div className="text-sm font-bold font-mono text-primary">
                  {openingState === 0 ? '—' : `${currentState.jetVelocity} m/s`}
                </div>
              </div>
              <div className="bg-slate-950/30 border border-white/5 rounded-xl p-3 text-center">
                <div className="text-[10px] text-muted-foreground font-medium mb-1">{openingState === 0 ? 'Static ΔP (no flow)' : 'Pressure Loss'}</div>
                <div className="text-sm font-bold font-mono text-primary">
                  {currentState.pressureDrop} ΔPSI
                </div>
              </div>
              <div className="bg-slate-950/30 border border-white/5 rounded-xl p-3 text-center">
                <div className="text-[10px] text-muted-foreground font-medium mb-1">Internal Status</div>
                <div className="text-xs font-bold text-foreground flex items-center justify-center h-5">
                  {openingState === 0 ? 'Blocked' : openingState === 100 ? 'Clear Flow' : 'Throttling'}
                </div>
              </div>
            </div>
          </div>

          {/* Educational Annotation Panel */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col gap-3 border border-primary/20 bg-primary/[0.01]">
            <h4 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
              <Info className="h-4 w-4" />
              Pedagogical Analysis ({openingState}% Stroke)
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {currentState.description}
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes flowAnim {
          from {
            stroke-dashoffset: 0;
          }
          to {
            stroke-dashoffset: -120;
          }
        }
      `}</style>
    </div>
  );
}
