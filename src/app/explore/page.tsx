'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';

const ModelViewer = dynamic(() => import('@/components/3d/ModelViewer').then(mod => mod.ModelViewer), {
  ssr: false,
  loading: () => (
    <div className="h-[550px] w-full flex items-center justify-center text-muted-foreground bg-slate-950/40 border border-white/5 rounded-3xl">
      Loading 3D Viewport Engine...
    </div>
  )
});
import {
  Layers,
  Link as LinkIcon,
  BookOpen,
  GitBranch,
  ShieldCheck,
  MousePointerClick,
  Info,
  Maximize2
} from 'lucide-react';

// Detailed component metadata mapping descriptions, relationships, and materials
interface ValveComponentData {
  id: string;
  name: string;
  category: string;
  description: string;
  functionality: string;
  materials: string[];
  relationships: {
    connectedTo: string[];
    purpose: string;
  }[];
  svgPathHighlight: string; // Identifier matching SVG paths
}

const COMPONENTS: Record<string, ValveComponentData> = {
  'bonnet': {
    id: 'bonnet',
    name: 'Bonnet',
    category: 'Pressure Retaining Cover',
    description: 'The bonnet acts as the cover for the opening in the valve body. It is the second most critical pressure boundary of a valve.',
    functionality: 'It retains internal system pressure, houses the stem packing box chamber, and provides structural alignment guides for the stem travel.',
    materials: ['ASTM A216 WCB (Carbon Steel)', 'ASTM A351 CF8M (Stainless Steel)', 'Forged Steel ASTM A105'],
    relationships: [
      { connectedTo: ['body'], purpose: 'Bolted or welded to body to form a leak-proof pressure boundary.' },
      { connectedTo: ['stem'], purpose: 'Guides stem passage and contains stuffing box packing seals around it.' }
    ],
    svgPathHighlight: 'bonnet-path'
  },
  'body': {
    id: 'body',
    name: 'Valve Body',
    category: 'Primary Pressure Shell',
    description: 'The body (or shell) is the primary pressure boundary containing the internal fluid passage channels.',
    functionality: 'Directs fluid flow through the valve ports, houses the seat rings, and anchors piping connection ends (flanged, welded, threaded).',
    materials: ['Cast Carbon Steel', 'Stainless Steel 316', 'Cast Iron', 'Duplex Steel'],
    relationships: [
      { connectedTo: ['bonnet'], purpose: 'Connects to upper cover bonnet.' },
      { connectedTo: ['seat'], purpose: 'Directly houses and supports the seat rings inside the flow channel orifice.' }
    ],
    svgPathHighlight: 'body-path'
  },
  'stem': {
    id: 'stem',
    name: 'Stem',
    category: 'Motion Linkage',
    description: 'The stem is the rod that transmits mechanical torque or thrust from the actuator handle to the internal closure member.',
    functionality: 'Converts rotary or linear actuator inputs into closure member alignment, sliding through packing seals.',
    materials: ['SS410', 'SS316', 'Monel K500', '17-4PH Stainless'],
    relationships: [
      { connectedTo: ['gate', 'disc', 'ball'], purpose: 'Directly slots into the closure member to lift, lower, or rotate it.' },
      { connectedTo: ['bonnet'], purpose: 'Passes through bonnet stuffing box sealing rings.' }
    ],
    svgPathHighlight: 'stem-path'
  },
  'seat': {
    id: 'seat',
    name: 'Seat Rings',
    category: 'Sealing Interface',
    description: 'Seat rings provide the matching sealing surfaces that contact the closure member to shut off flow.',
    functionality: 'Provides tight metal-to-metal or soft polymer sealing to prevent downstream leakage in the closed position.',
    materials: ['Stellite 6 (Hardfacing)', 'PTFE (Teflon)', 'PEEK', 'SS316'],
    relationships: [
      { connectedTo: ['gate', 'disc', 'ball'], purpose: 'Forms a tight contact boundary against the closure member when shut.' },
      { connectedTo: ['body'], purpose: 'Threaded or welded directly into the body orifice flow path.' }
    ],
    svgPathHighlight: 'seat-path'
  },
  'gate': {
    id: 'gate',
    name: 'Gate / Wedge',
    category: 'Linear Closure Member',
    description: 'The gate (or wedge) is the flat or tapered sliding closure member used in gate valves for absolute isolation.',
    functionality: 'Slides perpendicular to flow direction to block or permit passage. Sealing is enhanced by tapered seat engagement.',
    materials: ['ASTM A216 WCB with 13% Cr trim', 'Solid Stainless Steel CF8M'],
    relationships: [
      { connectedTo: ['stem'], purpose: 'Lifted or lowered by the stem thread travel.' },
      { connectedTo: ['seat'], purpose: 'Compresses against seat rings when fully driven down.' }
    ],
    svgPathHighlight: 'closure-path'
  }
};

export default function ExplorePage() {
  const [selectedComp, setSelectedComp] = useState<string>('body');
  const [hoveredComp, setHoveredComp] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'pressure-boundary': true,
    'internals': true
  });

  const activeComp = COMPONENTS[selectedComp];

  // Helper toggle for tree nodes
  const toggleNode = (node: string) => {
    setExpandedNodes((prev) => ({ ...prev, [node]: !prev[node] }));
  };

  return (
    <div className="flex flex-col gap-8 py-4 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-400 p-2.5 flex items-center justify-center border border-cyan-500/20">
            <Layers className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-bold">Interactive Component Explorer</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Map assemblies, trace material specs, and analyze connection relationships between critical components.
        </p>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Expandable Assembly Tree (4 cols) */}
        <div className="lg:col-span-3 glass-panel rounded-2xl p-5 flex flex-col gap-4 border border-white/5 h-[550px] overflow-y-auto">
          <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-white/5 pb-2">
            Assembly Hierarchy
          </h3>

          <div className="flex flex-col gap-4 text-xs font-semibold">
            {/* Pressure Boundary Node */}
            <div>
              <button
                onClick={() => toggleNode('pressure-boundary')}
                className="flex items-center gap-2 text-primary hover:text-cyan-300 w-full text-left"
              >
                <GitBranch className={`h-4.5 w-4.5 transition-transform ${expandedNodes['pressure-boundary'] ? 'rotate-90' : ''}`} />
                Pressure Boundary Shell
              </button>
              
              <AnimatePresence initial={false}>
                {expandedNodes['pressure-boundary'] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="pl-5 flex flex-col gap-1.5 mt-2 border-l border-white/5 ml-2"
                  >
                    {['body', 'bonnet'].map((id) => (
                      <button
                        key={id}
                        onClick={() => setSelectedComp(id)}
                        className={`flex items-center gap-2 p-2 rounded-lg text-left transition-all ${
                          selectedComp === id ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${selectedComp === id ? 'bg-primary animate-ping' : 'bg-muted-foreground'}`} />
                        {COMPONENTS[id].name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Internal Trims Node */}
            <div>
              <button
                onClick={() => toggleNode('internals')}
                className="flex items-center gap-2 text-primary hover:text-cyan-300 w-full text-left"
              >
                <GitBranch className={`h-4.5 w-4.5 transition-transform ${expandedNodes['internals'] ? 'rotate-90' : ''}`} />
                Internal Trim Components
              </button>
              
              <AnimatePresence initial={false}>
                {expandedNodes['internals'] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="pl-5 flex flex-col gap-1.5 mt-2 border-l border-white/5 ml-2"
                  >
                    {['stem', 'seat', 'gate'].map((id) => (
                      <button
                        key={id}
                        onClick={() => setSelectedComp(id)}
                        className={`flex items-center gap-2 p-2 rounded-lg text-left transition-all ${
                          selectedComp === id ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${selectedComp === id ? 'bg-primary animate-ping' : 'bg-muted-foreground'}`} />
                        {COMPONENTS[id].name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Center Column: 3D WebGL Model Viewer (5 cols) */}
        <div className="lg:col-span-5 h-[550px] w-full flex flex-col justify-between">
          <ModelViewer />
        </div>

        {/* Right Column: Dynamic Component Specs & Relationships (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4 h-[550px] overflow-y-auto">
          {activeComp ? (
            <div className="glass-panel rounded-2xl p-6 flex flex-col gap-6 border border-primary/20 bg-primary/[0.02]">
              {/* Identity Header */}
              <div className="flex flex-col gap-1 border-b border-white/5 pb-4">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                  {activeComp.category}
                </span>
                <h2 className="text-xl font-bold text-foreground">{activeComp.name}</h2>
              </div>

              {/* Detailed Description */}
              <div className="flex flex-col gap-1.5 text-xs">
                <span className="font-bold text-muted-foreground uppercase tracking-widest text-[9px] flex items-center gap-1">
                  <Info className="h-3.5 w-3.5 text-primary" /> Technical Description
                </span>
                <p className="text-muted-foreground leading-relaxed">{activeComp.description}</p>
              </div>

              {/* Functionality Role */}
              <div className="flex flex-col gap-1.5 text-xs bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="font-bold text-primary uppercase tracking-widest text-[9px]">
                  Mechanical Function
                </span>
                <p className="text-muted-foreground leading-relaxed">{activeComp.functionality}</p>
              </div>

              {/* Common Materials */}
              <div className="flex flex-col gap-1.5 text-xs">
                <span className="font-bold text-muted-foreground uppercase tracking-widest text-[9px] flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Fabrication Materials
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {activeComp.materials.map((mat, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] text-muted-foreground font-semibold">
                      {mat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Relationships */}
              <div className="flex flex-col gap-2.5 text-xs">
                <span className="font-bold text-muted-foreground uppercase tracking-widest text-[9px] flex items-center gap-1">
                  <LinkIcon className="h-3.5 w-3.5 text-primary" /> Assembly Relationships
                </span>
                <div className="flex flex-col gap-2.5">
                  {activeComp.relationships.map((rel, idx) => (
                    <div key={idx} className="flex flex-col gap-1 p-3 rounded-lg bg-slate-950/40 border border-white/5">
                      <div className="text-[9px] font-bold text-primary uppercase flex items-center gap-1.5">
                        Connects to: {rel.connectedTo.map(c => COMPONENTS[c]?.name || c).join(', ')}
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{rel.purpose}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center text-center text-muted-foreground h-full border border-white/5">
              Select a component to inspect details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
