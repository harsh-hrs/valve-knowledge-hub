'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  GraduationCap,
  Settings2,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Gauge,
  Wind,
  Layers,
  ListFilter,
  Play,
  RotateCcw
} from 'lucide-react';

// Valve data for interactive search/showcase path
const VALVES = [
  {
    id: 'gate-valve-wedge',
    name: 'Wedge Gate Valve',
    category: 'Linear',
    subcategory: 'Gate',
    description: 'Sliding-disc valve designed for strict on-off isolation with minimal flow restriction.',
    advantages: ['Near-zero pressure drop when fully open', 'Bi-directional operation', 'High-pressure sealing'],
    typicalApplications: ['Oil and gas trunk pipelines', 'Municipal water mains', 'Steam systems'],
    color: 'from-blue-600 to-cyan-500',
    spec: 'ASME Class 150 - 2500'
  },
  {
    id: 'globe-valve-standard',
    name: 'Standard Globe Valve',
    category: 'Linear',
    subcategory: 'Globe',
    description: 'Spherical cavity valve with tortuous Z-shaped flow path optimized for throttling control.',
    advantages: ['Precise flow regulation', 'Shorter stem travel than gate valves', 'In-line seats repair'],
    typicalApplications: ['Cooling loops bypass', 'Boiler feed systems', 'Chemical dosing lines'],
    color: 'from-purple-600 to-indigo-500',
    spec: 'High Delta-P Throttling'
  },
  {
    id: 'ball-valve-floating',
    name: 'Floating Ball Valve',
    category: 'Rotary',
    subcategory: 'Ball',
    description: 'Quarter-turn valve using a rotating sphere to deliver quick, reliable isolation.',
    advantages: ['Fast 90-degree shutoff', 'High flow capacity', 'Self-cleaning seat interface'],
    typicalApplications: ['Chemical processing manifolds', 'High-speed gas isolation', 'Water distribution loops'],
    color: 'from-emerald-600 to-teal-500',
    spec: 'Quarter-Turn Tight Shutoff'
  },
  {
    id: 'butterfly-valve-triple-offset',
    name: 'Triple Offset Butterfly Valve',
    category: 'Rotary',
    subcategory: 'Butterfly',
    description: 'High-performance rotary valve utilizing geometric offsets to eliminate seat friction.',
    advantages: ['Zero-leakage metal sealing', 'Compact wafer space saving', 'Low operational torque'],
    typicalApplications: ['Cryogenic liquid natural gas', 'High-temp power plant steam', 'Refinery cooling loops'],
    color: 'from-amber-600 to-orange-500',
    spec: 'Zero Friction Metal Seat'
  },
  {
    id: 'check-valve-swing',
    name: 'Swing Check Valve',
    category: 'Self-Actuated',
    subcategory: 'Check',
    description: 'Automatic backflow prevention valve operating purely on system fluid kinetics.',
    advantages: ['No external actuator needed', 'Low fluid flow resistance', 'Gravity-assisted seating'],
    typicalApplications: ['Pump discharge manifolds', 'Sewage mains backflow prevention', 'Cooling loops safety'],
    color: 'from-rose-600 to-pink-500',
    spec: 'Backflow Prevention'
  },
  {
    id: 'diaphragm-valve',
    name: 'Weir Diaphragm Valve',
    category: 'Linear',
    subcategory: 'Diaphragm',
    description: 'Flexible membrane seals onto a weir, fully isolating fluid from the working parts.',
    advantages: ['Zero stem leakage', 'Handles slurries and corrosives', 'Crevice-free & sterilisable'],
    typicalApplications: ['Pharma & biotech sterile lines', 'Corrosive chemical dosing', 'Ultra-pure water'],
    color: 'from-green-600 to-emerald-500',
    spec: 'Contamination-Free Sealing'
  },
  {
    id: 'plug-valve-lubricated',
    name: 'Lubricated Plug Valve',
    category: 'Rotary',
    subcategory: 'Plug',
    description: 'Tapered quarter-turn plug sealed by an injected lubricant film across full contact.',
    advantages: ['Fast quarter-turn shutoff', 'Excellent in dirty/gas service', 'Sealant frees a stuck plug'],
    typicalApplications: ['Gas gathering manifolds', 'Viscous hydrocarbon lines', 'Pipeline diverting'],
    color: 'from-yellow-600 to-amber-500',
    spec: 'Full-Contact Sealing'
  },
  {
    id: 'needle-valve',
    name: 'Needle Valve',
    category: 'Linear',
    subcategory: 'Needle',
    description: 'Fine-tapered needle on a fine-pitch thread for precise low-flow metering.',
    advantages: ['Very fine low-flow control', 'Compact high-pressure body', 'Metering plus shutoff'],
    typicalApplications: ['Instrument isolation', 'Sample take-off lines', 'Calibration rigs'],
    color: 'from-sky-600 to-cyan-500',
    spec: 'Precision Metering'
  },
  {
    id: 'safety-valve-spring',
    name: 'Spring-Loaded Safety Valve',
    category: 'Self-Actuated',
    subcategory: 'Relief',
    description: 'Self-acting overpressure relief that pops open at a calibrated set pressure.',
    advantages: ['Fully self-acting failsafe', 'Fast pop-action capacity', 'Adjustable set pressure'],
    typicalApplications: ['Steam boiler protection', 'Pressure vessel relief', 'Compressor discharge'],
    color: 'from-red-600 to-orange-500',
    spec: 'Overpressure Protection'
  },
  {
    id: 'air-release-valve',
    name: 'Automatic Air Release Valve',
    category: 'Self-Actuated',
    subcategory: 'Air Release',
    description: 'Float-operated valve that continuously vents trapped air from pipeline high points.',
    advantages: ['Automatic under line pressure', 'Prevents air-binding', 'Self-cleaning float'],
    typicalApplications: ['Water transmission high points', 'Pump station headers', 'Irrigation mains'],
    color: 'from-teal-600 to-cyan-500',
    spec: 'Air Venting'
  }
];

export default function Home() {
  // 1. Simulator state controls
  const [opening, setOpening] = useState(50); // 0% to 100%
  const [pressure, setPressure] = useState(60); // 10 to 150 PSI
  
  // 2. Search & Tab state controls
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Linear' | 'Rotary' | 'Self-Actuated'>('All');

  // Math equations simulating fluid flow through an orifice
  const flowSimulation = useMemo(() => {
    const openingFraction = opening / 100;
    
    // Flow coefficient approximation mapping opening size
    const Cv = Math.round(50 * Math.pow(openingFraction, 2) * 10) / 10;
    
    // Flow rate: Q = Cv * sqrt(dP)
    const deltaP = Math.max(1, Math.round(pressure * (1 - openingFraction) * 10) / 10);
    const flowRate = Math.round(Cv * Math.sqrt(deltaP) * 10) / 10;
    
    // Velocity approximation: V = Q / Area
    const velocity = Math.round((flowRate * 0.4) * 10) / 10;

    // Diagnose state bounds
    let flowState: 'Laminar' | 'Turbulent' | 'Cavitation' = 'Laminar';
    let statusColor = 'text-cyan-400';
    let statusBg = 'bg-cyan-500/10 border-cyan-500/20';

    if (velocity > 12 && opening < 30) {
      flowState = 'Cavitation';
      statusColor = 'text-rose-400';
      statusBg = 'bg-rose-500/10 border-rose-500/20';
    } else if (velocity > 4 || openingFraction < 0.7) {
      flowState = 'Turbulent';
      statusColor = 'text-amber-400';
      statusBg = 'bg-amber-500/10 border-amber-500/20';
    }

    return { Cv, deltaP, flowRate, velocity, flowState, statusColor, statusBg };
  }, [opening, pressure]);

  // Filtered valve collection
  const filteredValves = useMemo(() => {
    return VALVES.filter((valve) => {
      const matchesSearch =
        valve.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        valve.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        valve.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || valve.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="flex flex-col gap-24 py-8">
      {/* 1. Immersive Engineering Hero & Title */}
      <section className="relative flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
        <div className="flex-1 flex flex-col gap-6 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold self-start tracking-wider uppercase">
            <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
            Global Engineering Standard
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.15]">
            The World&apos;s Most Advanced{' '}
            <span className="bg-gradient-to-r from-primary via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Valve Academy
            </span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Bridge academic theory and piping station metrics. Interact with high-fidelity WebGL models, run flow velocity math, and study components in real time.
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <Link
              href="/explore"
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:cyan-glow transition-all duration-300 flex items-center gap-2 group"
            >
              Launch 3D Explorer
              <Compass className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
            </Link>
            <Link
              href="/learn"
              className="px-6 py-3 rounded-xl bg-secondary hover:bg-muted font-semibold border border-white/5 transition-all duration-200"
            >
              Start Academy Course
            </Link>
          </div>
        </div>

        {/* Interactive Fluid Physics Card */}
        <div className="flex-1 w-full max-w-md lg:max-w-xl glass-panel rounded-3xl p-6 flex flex-col gap-6 relative overflow-hidden border border-white/10">
          <div className="absolute right-0 top-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -z-10" />
          
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-primary" />
              <span className="font-semibold text-sm">Interactive Fluid Solver</span>
            </div>
            <div className={`px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase ${flowSimulation.statusBg} ${flowSimulation.statusColor}`}>
              {flowSimulation.flowState} Flow
            </div>
          </div>

          {/* SVG Piping Animation Frame */}
          <div className="h-32 bg-slate-950/50 rounded-xl relative overflow-hidden flex items-center justify-center border border-white/5">
            <svg className="w-full h-full px-4" viewBox="0 0 400 100">
              {/* Piping Outline */}
              <path d="M 10,40 L 160,40 L 160,20 L 240,20 L 240,40 L 390,40 L 390,60 L 240,60 L 240,80 L 160,80 L 160,60 L 10,60 Z" fill="none" stroke="#1e293b" strokeWidth="2" />
              
              {/* Dynamic Flow Line */}
              <path
                d="M 10,50 L 180,50 L 200,50 L 390,50"
                fill="none"
                stroke={
                  flowSimulation.flowState === 'Cavitation'
                    ? '#ef4444'
                    : flowSimulation.flowState === 'Turbulent'
                    ? '#f59e0b'
                    : '#06b6d4'
                }
                strokeWidth={Math.max(2, flowSimulation.flowRate / 3)}
                strokeDasharray="10 5"
                strokeDashoffset={-(flowSimulation.velocity * 3)}
                className="transition-all duration-100"
                style={{
                  animation: `flowAnim ${Math.max(0.1, 2 - flowSimulation.velocity / 5)}s linear infinite`
                }}
              />
              
              {/* Disc Indicator */}
              <rect
                x="195"
                y={20 + (opening / 100) * 35}
                width="10"
                height="30"
                fill="#334155"
                stroke="#64748b"
                strokeWidth="1"
                className="transition-all duration-200"
              />
            </svg>
            <span className="absolute bottom-2 right-3 text-[10px] text-muted-foreground font-mono">
              Fluid Path (Water)
            </span>
          </div>

          {/* Controls Panel */}
          <div className="flex flex-col gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Valve Opening Position</span>
                <span className="text-primary font-mono">{opening}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={opening}
                onChange={(e) => setOpening(Number(e.target.value))}
                className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Inlet Pressure</span>
                <span className="text-primary font-mono">{pressure} PSI</span>
              </div>
              <input
                type="range"
                min="10"
                max="150"
                value={pressure}
                onChange={(e) => setPressure(Number(e.target.value))}
                className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>

          {/* Visual Output Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-950/30 border border-white/5 rounded-xl p-3 text-center">
              <div className="text-[10px] text-muted-foreground font-medium mb-1">Flow Rate</div>
              <div className="text-sm font-bold font-mono text-primary">{flowSimulation.flowRate} GPM</div>
            </div>
            <div className="bg-slate-950/30 border border-white/5 rounded-xl p-3 text-center">
              <div className="text-[10px] text-muted-foreground font-medium mb-1">Pressure Drop</div>
              <div className="text-sm font-bold font-mono text-primary">{flowSimulation.deltaP} ΔPSI</div>
            </div>
            <div className="bg-slate-950/30 border border-white/5 rounded-xl p-3 text-center">
              <div className="text-[10px] text-muted-foreground font-medium mb-1">Fluid Velocity</div>
              <div className="text-sm font-bold font-mono text-primary">{flowSimulation.velocity} m/s</div>
            </div>
          </div>

          {/* Physics Warnings */}
          <AnimatePresence mode="wait">
            {flowSimulation.flowState === 'Cavitation' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex gap-2.5 items-center p-3 rounded-lg border border-rose-500/20 bg-rose-500/5 text-rose-400 text-xs"
              >
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span><strong>Cavitation Warning:</strong> High delta pressure and localized throttling speeds risk vapor bubble collapse, damaging seats.</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Classification Categories quick-links */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl md:text-3xl font-extrabold">Primary Classifications</h2>
          <p className="text-muted-foreground text-sm">
            Select a classification category to research structural principles, design limitations, and calculations.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {[
            { id: 'isolation', name: 'Isolation Valves', desc: 'On-Off Shutoff', color: 'border-blue-500/20 hover:border-blue-500/50 bg-blue-500/5' },
            { id: 'check', name: 'Check Valves', desc: 'Backflow Prevention', color: 'border-rose-500/20 hover:border-rose-500/50 bg-rose-500/5' },
            { id: 'control', name: 'Control Valves', desc: 'Flow Regulation', color: 'border-purple-500/20 hover:border-purple-500/50 bg-purple-500/5' },
            { id: 'air', name: 'Air Valves', desc: 'Vacuum Protection', color: 'border-cyan-500/20 hover:border-cyan-500/50 bg-cyan-500/5' },
            { id: 'safety', name: 'Safety & Relief', desc: 'Vessels Protection', color: 'border-amber-500/20 hover:border-amber-500/50 bg-amber-500/5' }
          ].map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
              className={`glass-panel p-5 rounded-2xl flex flex-col gap-2 transition-all duration-300 border hover:-translate-y-1 group ${cat.color}`}
            >
              <div className="font-bold text-sm text-primary group-hover:text-primary transition-colors">{cat.name}</div>
              <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{cat.desc}</div>
              <div className="text-[10px] text-primary flex items-center gap-1 font-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                Study specs <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 2. Structured Search & Category Showcase */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl md:text-3xl font-extrabold">Complete Valve Taxonomy</h2>
          <p className="text-muted-foreground text-sm">
            Search our comprehensive, class-validated database of industrial valve engineering types.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Tab Categories */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/5 self-start md:self-auto overflow-x-auto max-w-full">
            {(['All', 'Linear', 'Rotary', 'Self-Actuated'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  selectedCategory === cat ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search components or standards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-sm focus:outline-none focus:border-primary focus:cyan-glow transition-all"
            />
          </div>
        </div>

        {/* Valve Grid View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredValves.map((valve) => (
              <motion.div
                key={valve.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="glass-panel rounded-2xl p-6 flex flex-col justify-between border border-white/10 group cursor-pointer relative overflow-hidden"
              >
                <div className={`absolute right-0 top-0 w-24 h-24 rounded-full bg-gradient-to-br ${valve.color} opacity-5 blur-2xl group-hover:opacity-10 transition-opacity`} />
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold tracking-wider uppercase bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                      {valve.category}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">{valve.spec}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                    {valve.name}
                  </h3>
                  <p className="text-muted-foreground text-xs leading-relaxed mb-6">
                    {valve.description}
                  </p>

                  <div className="flex flex-col gap-2 mb-6">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Advantages</div>
                    {valve.advantages.map((adv, aIdx) => (
                      <div key={aIdx} className="flex gap-2 items-center text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>{adv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/explore?valve=${valve.id}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-primary group-hover:underline mt-auto self-start"
                >
                  Explore 3D Cutaway
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* 3. Learning Academy Pathways */}
      <section className="glass-panel rounded-3xl p-8 md:p-12 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="max-w-3xl flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl md:text-3xl font-extrabold">Your Interactive Pathway</h2>
            <p className="text-muted-foreground text-sm">
              Follow our curriculum pipeline designed to map theoretical physics to actual plant equipment installation.
            </p>
          </div>

          <div className="flex flex-col gap-8 relative border-l border-white/5 pl-6 ml-3">
            {/* Step 1 */}
            <div className="relative">
              <div className="absolute -left-[35px] top-1 h-4.5 w-4.5 rounded-full bg-primary border-4 border-background" />
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Stage 1: Mechanical Basics</span>
                <h4 className="font-bold text-sm">Valve Structures & Assembly Taxonomy</h4>
                <p className="text-muted-foreground text-xs leading-relaxed max-w-lg">
                  Learn about standard pressure ratings, stem movements, linear-vs-rotary seat closure configurations, and components like stuffing box seals.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="absolute -left-[35px] top-1 h-4.5 w-4.5 rounded-full bg-slate-800 border-4 border-background" />
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Stage 2: Fluid Physics</span>
                <h4 className="font-bold text-sm">Flow Sizing, Cavitation & Delta-P Throttling</h4>
                <p className="text-muted-foreground text-xs leading-relaxed max-w-lg">
                  Master flow coefficient (Cv/Kv) equations. Study liquid recovery thresholds to model and avoid pipeline cavitation and sound choke points.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="absolute -left-[35px] top-1 h-4.5 w-4.5 rounded-full bg-slate-800 border-4 border-background" />
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Stage 3: Systems & Actuation</span>
                <h4 className="font-bold text-sm">Actuators, Automation & Diagnostics</h4>
                <p className="text-muted-foreground text-xs leading-relaxed max-w-lg">
                  Dive into pneumatic positioners, safety solenoid controls, spring-return sizing, and diagnosing seat leak rates in field installations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Styled animation frames using normal CSS inline inject */}
      <style jsx global>{`
        @keyframes flowAnim {
          from {
            stroke-dashoffset: 0;
          }
          to {
            stroke-dashoffset: -100;
          }
        }
      `}</style>
    </div>
  );
}
