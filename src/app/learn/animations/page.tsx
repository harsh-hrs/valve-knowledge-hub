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
  offset: number;       // Linear translation (Y-offset) or angular rotation (Degrees)
  velocity: number;     // Fluid speed scale for animation (1 to 10)
  turbulence: number;   // Turbulence perturbation amplitude (0 to 20)
  pressureDrop: number; // Pressure drop indicator (PSI)
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
      0: { offset: 0, velocity: 0, turbulence: 0, pressureDrop: 0, flowColor: 'stroke-slate-700', description: 'Fully closed. The gate wedge blocks the flow path. Line pressure presses the gate against downstream seat for absolute isolation.' },
      25: { offset: 12, velocity: 10, turbulence: 20, pressureDrop: 45, flowColor: 'stroke-rose-500', description: '25% open. Severe throttling. High velocity flow under the gate causes severe cavitation bubbles and seat erosion.' },
      50: { offset: 25, velocity: 7, turbulence: 12, pressureDrop: 20, flowColor: 'stroke-amber-500', description: '50% open. Restricted flow. Significant vortices generate downstream of the wedge block.' },
      75: { offset: 37, velocity: 5, turbulence: 5, pressureDrop: 8, flowColor: 'stroke-cyan-500', description: '75% open. Transitioning to stable flow. Flow path is clearing, and turbulence levels are dropping.' },
      100: { offset: 50, velocity: 3, turbulence: 1, pressureDrop: 1, flowColor: 'stroke-cyan-400', description: '100% open. Stable laminar flow. Gate is completely out of flow stream. Near-zero pressure drop across the body orifice.' }
    }
  },
  'ball': {
    id: 'ball',
    name: 'Floating Ball Valve',
    mechanismType: 'rotary-turn',
    componentLabel: 'Spherical Ball',
    states: {
      0: { offset: 0, velocity: 0, turbulence: 0, pressureDrop: 0, flowColor: 'stroke-slate-700', description: 'Closed position. Ball bore is perpendicular to pipe axis. Upstream fluid pressure shifts the ball into downstream seat.' },
      25: { offset: 22.5, velocity: 10, turbulence: 20, pressureDrop: 50, flowColor: 'stroke-rose-500', description: '25% open. High velocity fluid cuts through narrow crescent-shaped seat openings, risking seat tearing.' },
      50: { offset: 45, velocity: 8, turbulence: 15, pressureDrop: 25, flowColor: 'stroke-amber-500', description: '50% open. Moderate flow. Flow is split into two vortices around the edge of the ball bore.' },
      75: { offset: 67.5, velocity: 6, turbulence: 6, pressureDrop: 10, flowColor: 'stroke-cyan-500', description: '75% open. Flow stream aligns with ball port. Turbulence is restricted to boundary seat walls.' },
      100: { offset: 90, velocity: 3, turbulence: 0.5, pressureDrop: 0.2, flowColor: 'stroke-cyan-400', description: '100% open. Full-bore straight-through flow. The ball port is aligned with the pipeline, acting as continuous pipe segment.' }
    }
  },
  'globe': {
    id: 'globe',
    name: 'Standard Globe Valve',
    mechanismType: 'linear-plug',
    componentLabel: 'Contoured Plug',
    states: {
      0: { offset: 0, velocity: 0, turbulence: 0, pressureDrop: 0, flowColor: 'stroke-slate-700', description: 'Closed. Stem thrust drives the plug flat into the body seat ring, sealing against full system differential pressure.' },
      25: { offset: 8, velocity: 7, turbulence: 14, pressureDrop: 55, flowColor: 'stroke-rose-500', description: '25% open. Controlled throttling. Symmetrical annular flow gap allows precise flow control, limiting cavitation.' },
      50: { offset: 16, velocity: 6, turbulence: 10, pressureDrop: 35, flowColor: 'stroke-amber-500', description: '50% open. Medium flow. Fluid turns twice through Z-body orifice, generating constant pressure drop.' },
      75: { offset: 24, velocity: 5, turbulence: 7, pressureDrop: 22, flowColor: 'stroke-amber-400', description: '75% open. High flow capacity. Flow path is open but flow direction shifts generate minor turbulence.' },
      100: { offset: 32, velocity: 4, turbulence: 5, pressureDrop: 15, flowColor: 'stroke-cyan-500', description: '100% open. Maximum flow rate. Standard Z-path profile maintains moderate pressure restriction even at full stroke.' }
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
                <path d="M 10,60 L 120,60 L 120,30 L 180,30 L 180,60 L 290,60 L 290,90 L 180,90 L 180,120 L 120,120 L 120,90 L 10,90 Z" fill="none" stroke="#1e293b" strokeWidth="2.5" />
                
                {/* Seat Rings Reference */}
                <rect x="117" y="58" width="4" height="34" fill="#f59e0b" stroke="#d97706" strokeWidth="0.5" />
                <rect x="179" y="58" width="4" height="34" fill="#f59e0b" stroke="#d97706" strokeWidth="0.5" />

                {/* Flow lines (Dynamic velocity and turbulence) */}
                <path
                  d="M 10,75 L 130,75 C 140,75 145,75 150,75 C 155,75 160,75 170,75 L 290,75"
                  fill="none"
                  className={currentState.flowColor}
                  strokeWidth={openingState === 0 ? 0.5 : Math.max(1, 5 - currentState.pressureDrop / 12)}
                  strokeDasharray="8 4"
                  style={{
                    animation: openingState === 0 ? 'none' : `flowAnim ${Math.max(0.1, 1.5 - currentState.velocity / 6.5)}s linear infinite`
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
                      height="65"
                      fill="#475569"
                    />
                    <path
                      d={`M 130,${75 - currentState.offset} L 170,${75 - currentState.offset} L 165,${95 - currentState.offset} L 135,${95 - currentState.offset} Z`}
                      fill="#94a3b8"
                      stroke="#475569"
                      strokeWidth="1"
                    />
                  </g>
                )}

                {activeValve.mechanismType === 'rotary-turn' && (
                  <g transform="translate(150, 75)">
                    {/* Spherical ball rotates on angular offset */}
                    <g transform={`rotate(${currentState.offset})`}>
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
            <div className="grid grid-cols-3 gap-3 w-full mt-4 border-t border-white/5 pt-4">
              <div className="bg-slate-950/30 border border-white/5 rounded-xl p-3 text-center">
                <div className="text-[10px] text-muted-foreground font-medium mb-1">Flow Velocity</div>
                <div className="text-sm font-bold font-mono text-primary">
                  {openingState === 0 ? '0' : currentState.velocity} m/s
                </div>
              </div>
              <div className="bg-slate-950/30 border border-white/5 rounded-xl p-3 text-center">
                <div className="text-[10px] text-muted-foreground font-medium mb-1">Pressure Loss</div>
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
