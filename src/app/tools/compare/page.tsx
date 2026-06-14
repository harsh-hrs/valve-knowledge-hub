'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Settings2,
  Check,
  X,
  Gauge,
  CircleDollarSign,
  TrendingDown,
  Wrench,
  GaugeCircle,
  ShieldAlert,
  ShieldCheck,
  Layers,
  ArrowRightLeft
} from 'lucide-react';

interface ValveComparisonData {
  id: string;
  name: string;
  category: string;
  cost: 'Low' | 'Medium' | 'High';
  pressureDrop: 'Minimal' | 'Moderate' | 'High';
  maintenance: 'Low' | 'Moderate' | 'High';
  flowChar: string;
  leakage: string;
  speed: string;
  weight: 'Light' | 'Medium' | 'Heavy';
  idealFor: string;
}

const VALVES_TO_COMPARE: Record<string, ValveComparisonData> = {
  'gate': {
    id: 'gate',
    name: 'Wedge Gate Valve',
    category: 'Linear',
    cost: 'Medium',
    pressureDrop: 'Minimal',
    maintenance: 'Moderate',
    flowChar: 'On-Off Isolation Only',
    leakage: 'Metal-to-Metal (API 598)',
    speed: 'Slow (Multi-turn)',
    weight: 'Heavy',
    idealFor: 'Full-flow trunk pipelines and isolated steam loops'
  },
  'globe': {
    id: 'globe',
    name: 'Standard Globe Valve',
    category: 'Linear',
    cost: 'High',
    pressureDrop: 'High',
    maintenance: 'High',
    flowChar: 'Linear & Throttling Regulating',
    leakage: 'Class IV / V Tight',
    speed: 'Moderate (Multi-turn)',
    weight: 'Heavy',
    idealFor: 'Boiler feedwater control and pressure reduction bypass'
  },
  'ball': {
    id: 'ball',
    name: 'Floating Ball Valve',
    category: 'Rotary',
    cost: 'Low',
    pressureDrop: 'Minimal',
    maintenance: 'Low',
    flowChar: 'Quick On-Off Isolation',
    leakage: 'Zero Leakage (Class VI Soft Seat)',
    speed: 'Fast (90° Quarter-turn)',
    weight: 'Light',
    idealFor: 'Manifold chemical systems and general water utility loops'
  },
  'butterfly': {
    id: 'butterfly',
    name: 'Triple Offset Butterfly',
    category: 'Rotary',
    cost: 'High',
    pressureDrop: 'Minimal',
    maintenance: 'Moderate',
    flowChar: 'Equal Percentage / Throttling',
    leakage: 'Zero Leakage (Metal-to-Metal API 6D)',
    speed: 'Fast (90° Quarter-turn)',
    weight: 'Medium',
    idealFor: 'Cryogenic liquid gas and high-pressure steam distribution'
  },
  'check': {
    id: 'check',
    name: 'Swing Check Valve',
    category: 'Self-Actuated',
    cost: 'Low',
    pressureDrop: 'Minimal',
    maintenance: 'Moderate',
    flowChar: 'Non-Return Auto Flow',
    leakage: 'Metal-to-Metal Backflow Sealing',
    speed: 'Automatic (Fluid Driven)',
    weight: 'Medium',
    idealFor: 'Pump discharge prevention lines and sewage loops'
  }
};

export default function CompareToolPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>(['gate', 'globe', 'ball']);

  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter(x => x !== id));
      }
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const comparedValves = selectedIds.map(id => VALVES_TO_COMPARE[id]);

  const parameters = [
    { label: 'Cost Basis', key: 'cost', icon: CircleDollarSign },
    { label: 'Pressure Drop', key: 'pressureDrop', icon: TrendingDown },
    { label: 'Maintenance Demand', key: 'maintenance', icon: Wrench },
    { label: 'Flow Characteristic', key: 'flowChar', icon: GaugeCircle },
    { label: 'Leakage Performance', key: 'leakage', icon: ShieldCheck },
    { label: 'Operating Speed', key: 'speed', icon: Gauge },
    { label: 'Relative Weight', key: 'weight', icon: Layers }
  ] as const;

  return (
    <div className="flex flex-col gap-12 py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-white/5 pb-8">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors self-start"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tools
        </Link>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 p-2.5 flex items-center justify-center border border-amber-500/20">
            <ArrowRightLeft className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-bold">Valve Comparison Matrix</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Select up to 3 valve configurations to run side-by-side engineering comparisons.
        </p>
      </div>

      {/* Valve Selection Selector */}
      <div className="flex flex-wrap gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
        {Object.values(VALVES_TO_COMPARE).map((valve) => {
          const isSelected = selectedIds.includes(valve.id);
          return (
            <button
              key={valve.id}
              onClick={() => toggleSelection(valve.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                isSelected
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-slate-900/40 text-muted-foreground border-white/5 hover:border-white/10 hover:text-foreground'
              }`}
            >
              {isSelected ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5 text-muted-foreground/40" />}
              {valve.name}
            </button>
          );
        })}
      </div>

      {/* Main Side-by-Side Table Grid */}
      <div className="overflow-hidden glass-panel rounded-2xl border border-white/5">
        
        {/* Table Header Row */}
        <div className="grid grid-cols-4 gap-4 bg-white/5 p-5 text-xs font-bold border-b border-white/5 text-muted-foreground uppercase tracking-widest">
          <div>Parameter</div>
          {comparedValves.map(valve => (
            <div key={valve.id} className="text-foreground flex flex-col gap-1">
              <span className="text-sm font-extrabold text-primary">{valve.name}</span>
              <span className="text-[10px] text-muted-foreground font-mono normal-case font-medium">Category: {valve.category}</span>
            </div>
          ))}
          {/* Pad empty columns if less than 3 selected */}
          {Array.from({ length: 3 - comparedValves.length }).map((_, idx) => (
            <div key={idx} className="text-muted-foreground/20 italic flex items-center">
              Empty Slot
            </div>
          ))}
        </div>

        {/* Dynamic Spec Rows */}
        <div className="divide-y divide-white/5 text-xs text-muted-foreground">
          {parameters.map((param) => {
            const Icon = param.icon;
            return (
              <div key={param.key} className="grid grid-cols-4 gap-4 p-5 items-center hover:bg-white/5 transition-colors">
                <div className="font-semibold text-foreground flex items-center gap-2">
                  <Icon className="h-4.5 w-4.5 text-primary shrink-0" />
                  {param.label}
                </div>
                {comparedValves.map(valve => {
                  const val = valve[param.key];
                  return (
                    <div key={valve.id} className="font-medium text-foreground">
                      {val === 'High' ? (
                        <span className="text-rose-400 font-bold">{val}</span>
                      ) : val === 'Low' || val === 'Minimal' ? (
                        <span className="text-emerald-400 font-bold">{val}</span>
                      ) : (
                        <span>{val}</span>
                      )}
                    </div>
                  );
                })}
                {/* Pad empty columns */}
                {Array.from({ length: 3 - comparedValves.length }).map((_, idx) => (
                  <div key={idx} className="text-muted-foreground/10">&mdash;</div>
                ))}
              </div>
            );
          })}

          {/* Ideal Application Row */}
          <div className="grid grid-cols-4 gap-4 p-5 items-start bg-primary/[0.01]">
            <div className="font-semibold text-foreground flex items-center gap-2 mt-1">
              <ShieldCheck className="h-4.5 w-4.5 text-primary shrink-0" />
              Ideal Service
            </div>
            {comparedValves.map(valve => (
              <div key={valve.id} className="text-[11px] text-muted-foreground leading-relaxed">
                {valve.idealFor}
              </div>
            ))}
            {/* Pad empty columns */}
            {Array.from({ length: 3 - comparedValves.length }).map((_, idx) => (
              <div key={idx} className="text-muted-foreground/10">&mdash;</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
