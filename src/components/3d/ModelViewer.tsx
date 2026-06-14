'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Lightformer, ContactShadows } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { ValveModel } from './ValveModels';
import { getValve3D } from '@/lib/valve-3d-data';
import {
  Maximize2,
  Minimize2,
  Layers,
  Scissors,
  Waves,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Move3d,
} from 'lucide-react';

interface ModelViewerProps {
  valveId: string;
  selected: string | null;
  onSelect: (id: string | null) => void;
}

export function ModelViewer({ valveId, selected, onSelect }: ModelViewerProps) {
  const config = getValve3D(valveId);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const [open, setOpen] = useState(1);
  const [explode, setExplode] = useState(0);
  const [crossSection, setCrossSection] = useState(false);
  const [transparency, setTransparency] = useState(false);
  const [flow, setFlow] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Auto open/close animation loop
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = (now - start) / 1000;
      // ease in/out triangle for a satisfying stroke
      const v = 0.5 - 0.5 * Math.cos((t * Math.PI) / 2.2);
      setOpen(Math.min(1, Math.max(0, v)));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const resetView = () => {
    controlsRef.current?.reset();
  };

  const activeLabel = selected ? config.components[selected]?.name ?? selected : null;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden border border-white/10 bg-[radial-gradient(circle_at_50%_30%,#16233b_0%,#070b14_70%)] w-full flex flex-col ${
        isFullscreen ? 'h-screen rounded-none' : 'rounded-3xl h-[68vh] min-h-[420px] sm:h-[560px]'
      }`}
    >
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [7, 5, 9], fov: 42 }}
          gl={{ localClippingEnabled: true, antialias: true, alpha: true }}
        >
          <color attach="background" args={['#0a1120']} />

          {/* Balanced light rig — guarantees no black metals */}
          <ambientLight intensity={0.7} />
          <hemisphereLight args={['#bcd3ff', '#1b2437', 0.7]} />
          <directionalLight position={[8, 12, 6]} intensity={2.0} castShadow shadow-mapSize={[1024, 1024]} />
          <directionalLight position={[-8, 4, -6]} intensity={0.7} color="#7dd3fc" />
          <pointLight position={[0, -4, 4]} intensity={0.4} />

          {/* Offline procedural environment so metallic surfaces have something to reflect */}
          <Environment resolution={256} frames={1}>
            <Lightformer intensity={3} position={[0, 6, -6]} scale={[14, 14, 1]} color="#cfe0ff" />
            <Lightformer intensity={1.4} position={[-6, 2, 4]} scale={[8, 8, 1]} color="#ffffff" />
            <Lightformer intensity={2} position={[6, 3, 3]} scale={[8, 8, 1]} color="#9fe7ff" />
            <Lightformer intensity={1} position={[0, -6, 2]} scale={[12, 12, 1]} color="#3b4a66" />
          </Environment>

          <group position={[0, -0.3, 0]}>
            <ValveModel
              kind={config.kind}
              open={open}
              explode={explode}
              crossSection={crossSection}
              transparency={transparency}
              flow={flow}
              selected={selected}
              onSelect={onSelect}
            />
          </group>

          <ContactShadows position={[0, -3.2, 0]} opacity={0.45} scale={20} blur={2.4} far={8} color="#000000" />

          <OrbitControls
            ref={controlsRef}
            makeDefault
            enableDamping
            dampingFactor={0.07}
            minDistance={5}
            maxDistance={26}
            maxPolarAngle={Math.PI / 1.7}
            enablePan={false}
          />
        </Canvas>
      </div>

      {/* Top bar */}
      <div className="relative z-10 p-3 sm:p-4 flex items-start justify-between gap-2 pointer-events-none">
        <div className="glass-panel px-3 py-2 rounded-xl text-[11px] sm:text-xs flex items-center gap-2 pointer-events-auto border border-white/10 shadow-md max-w-[70%]">
          <Sparkles className="h-4 w-4 text-primary shrink-0" />
          {activeLabel ? (
            <span className="truncate">
              <span className="text-muted-foreground">Selected: </span>
              <span className="font-bold text-primary">{activeLabel}</span>
            </span>
          ) : (
            <span className="text-muted-foreground hidden sm:inline">Tap any part to inspect it</span>
          )}
          {!activeLabel && <span className="text-muted-foreground sm:hidden">Tap a part</span>}
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={resetView}
            className="glass-panel p-2.5 rounded-xl hover:bg-white/10 text-muted-foreground hover:text-foreground border border-white/10 transition-all shadow-md"
            aria-label="Reset camera"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="glass-panel p-2.5 rounded-xl hover:bg-white/10 text-muted-foreground hover:text-foreground border border-white/10 transition-all shadow-md"
            aria-label="Toggle fullscreen"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="flex-1" />

      {/* Hint badge */}
      <div className="relative z-10 px-3 sm:px-4 pointer-events-none">
        <div className="glass-panel inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] text-muted-foreground border border-white/10">
          <Move3d className="h-3.5 w-3.5 text-primary/70" />
          Drag to orbit · pinch / scroll to zoom
        </div>
      </div>

      {/* Bottom control deck */}
      <div className="relative z-10 p-3 sm:p-4 flex flex-col gap-2.5 pointer-events-none">
        {/* Sliders row */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          {/* Open / close */}
          <div className="glass-panel px-3 py-2.5 rounded-2xl flex items-center gap-3 flex-1 pointer-events-auto border border-white/10 shadow-lg">
            <button
              onClick={() => setPlaying((p) => !p)}
              className="shrink-0 h-8 w-8 rounded-lg bg-primary/15 text-primary border border-primary/30 flex items-center justify-center hover:bg-primary/25 transition-colors"
              aria-label={playing ? 'Pause' : 'Animate'}
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <div className="flex flex-col gap-1 w-full">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="text-muted-foreground">{config.actuationLabel}</span>
                <span className="text-primary font-mono">{open < 0.04 ? 'CLOSED' : open > 0.96 ? 'OPEN' : `${Math.round(open * 100)}%`}</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={open}
                onChange={(e) => {
                  setPlaying(false);
                  setOpen(Number(e.target.value));
                }}
                className="valve-range w-full"
              />
            </div>
          </div>

          {/* Explode */}
          <div className="glass-panel px-3 py-2.5 rounded-2xl flex items-center gap-3 flex-1 pointer-events-auto border border-white/10 shadow-lg">
            <Layers className="h-4 w-4 text-primary shrink-0" />
            <div className="flex flex-col gap-1 w-full">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="text-muted-foreground">Explode</span>
                <span className="text-primary font-mono">{Math.round(explode * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={explode}
                onChange={(e) => setExplode(Number(e.target.value))}
                className="valve-range w-full"
              />
            </div>
          </div>
        </div>

        {/* Toggle buttons row */}
        <div className="flex gap-2 pointer-events-auto overflow-x-auto no-scrollbar -mx-1 px-1">
          <ToggleBtn active={flow} onClick={() => setFlow((v) => !v)} icon={<Waves className="h-4 w-4" />} label="Flow" />
          <ToggleBtn active={transparency} onClick={() => setTransparency((v) => !v)} icon={<Layers className="h-4 w-4" />} label="X-Ray" />
          <ToggleBtn active={crossSection} onClick={() => setCrossSection((v) => !v)} icon={<Scissors className="h-4 w-4" />} label="Section" />
        </div>
      </div>
    </div>
  );
}

function ToggleBtn({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
        active
          ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_18px_-4px_rgba(6,182,212,0.6)]'
          : 'glass-panel text-muted-foreground border-white/10 hover:text-foreground hover:border-white/20'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
