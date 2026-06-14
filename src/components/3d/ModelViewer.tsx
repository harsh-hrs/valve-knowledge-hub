'use client';

import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { PlaceholderValve } from './PlaceholderValve';
import {
  RotateCw,
  Eye,
  Scissors,
  Maximize2,
  Minimize2,
  Layers,
  Sparkles
} from 'lucide-react';

export function ModelViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Interactive 3D states
  const [explode, setExplode] = useState<number>(0); // 0 to 1
  const [crossSection, setCrossSection] = useState<boolean>(false);
  const [transparency, setTransparency] = useState<boolean>(false);
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Toggle fullscreen state of the container div
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  const componentLabels: Record<string, string> = {
    'body': 'Valve Shell Body',
    'bonnet': 'Retention Bonnet Cover',
    'stem': 'Linear Actuator Stem',
    'seat': 'Metal Seat Rings',
    'gate': 'Linear Sealing Wedge'
  };

  return (
    <div
      ref={containerRef}
      className={`relative rounded-3xl overflow-hidden border border-white/5 bg-slate-950/40 w-full flex flex-col justify-between ${
        isFullscreen ? 'h-screen w-screen rounded-none' : 'h-[500px]'
      }`}
    >
      {/* 3D WebGL Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [6, 8, 10], fov: 45 }}
          gl={{ localClippingEnabled: true }}
        >
          {/* Lighting Settings */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 15, 10]} intensity={1.2} castShadow />
          <directionalLight position={[-10, -5, -10]} intensity={0.4} />
          <pointLight position={[0, 5, 0]} intensity={0.5} />

          {/* Assembly Geometries */}
          <PlaceholderValve
            explode={explode}
            crossSection={crossSection}
            transparency={transparency}
            activeComponent={activeComponent}
            onHoverComponent={setActiveComponent}
            onClickComponent={setActiveComponent}
          />

          {/* Interactive Navigation Camera Controls */}
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            minDistance={4}
            maxDistance={25}
            maxPolarAngle={Math.PI / 1.8}
          />
        </Canvas>
      </div>

      {/* Floating Header UI */}
      <div className="relative z-10 p-5 flex items-center justify-between pointer-events-none">
        {/* Selected Component Status */}
        <div className="glass-panel px-4 py-2 rounded-xl text-xs flex items-center gap-2 pointer-events-auto border border-white/5 shadow-md">
          <Sparkles className="h-4.5 w-4.5 text-primary shrink-0" />
          {activeComponent ? (
            <div>
              Active Element: <span className="font-bold text-primary">{componentLabels[activeComponent] || activeComponent}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">Hover mesh to analyze components</span>
          )}
        </div>

        {/* Fullscreen Trigger */}
        <button
          onClick={toggleFullscreen}
          className="glass-panel p-2.5 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-foreground pointer-events-auto border border-white/5 transition-all shadow-md"
        >
          {isFullscreen ? <Minimize2 className="h-4.5 w-4.5" /> : <Maximize2 className="h-4.5 w-4.5" />}
        </button>
      </div>

      {/* Floating Action Controls Overlay */}
      <div className="relative z-10 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-none">
        
        {/* Exploded View Control */}
        <div className="glass-panel px-4 py-3 rounded-2xl flex items-center gap-3 w-full sm:w-64 pointer-events-auto border border-white/5 shadow-lg">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest shrink-0">Explode</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={explode}
            onChange={(e) => setExplode(Number(e.target.value))}
            className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        {/* Visual Mode Buttons */}
        <div className="flex gap-2.5 pointer-events-auto">
          {/* Transparency Toggle */}
          <button
            onClick={() => setTransparency(!transparency)}
            className={`glass-panel px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
              transparency
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-slate-900/40 text-muted-foreground border-white/5 hover:border-white/10 hover:text-foreground'
            }`}
          >
            <Layers className="h-4 w-4" />
            Transparent Body
          </button>

          {/* Cross Section Toggle */}
          <button
            onClick={() => setCrossSection(!crossSection)}
            className={`glass-panel px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
              crossSection
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-slate-900/40 text-muted-foreground border-white/5 hover:border-white/10 hover:text-foreground'
            }`}
          >
            <Scissors className="h-4 w-4" />
            Cross Section
          </button>
        </div>

      </div>
    </div>
  );
}
