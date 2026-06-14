'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { VALVE_3D, getValve3D } from '@/lib/valve-3d-data';
import { Layers, Info, ShieldCheck, Link as LinkIcon, ChevronRight, Boxes } from 'lucide-react';

const ModelViewer = dynamic(() => import('@/components/3d/ModelViewer').then((m) => m.ModelViewer), {
  ssr: false,
  loading: () => (
    <div className="h-[68vh] min-h-[420px] sm:h-[560px] w-full flex flex-col items-center justify-center gap-3 text-muted-foreground bg-slate-950/40 border border-white/10 rounded-3xl">
      <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      <span className="text-sm">Loading 3D engine…</span>
    </div>
  ),
});

const VALVE_LIST = Object.values(VALVE_3D);

function ExploreInner() {
  const params = useSearchParams();
  const urlValve = params.get('valve');
  const initial = urlValve && VALVE_3D[urlValve] ? urlValve : VALVE_LIST[0].id;

  const [valveId, setValveId] = useState(initial);
  const config = getValve3D(valveId);
  // Start unselected so the model shows its true materials; tapping a part highlights it.
  const [selected, setSelected] = useState<string | null>(null);

  // Reset the inspected component when switching valve types
  useEffect(() => {
    setSelected(null);
  }, [valveId]);

  const activeComp = selected ? config.components[selected] : null;

  return (
    <div className="flex flex-col gap-6 py-2 sm:py-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-400 p-2.5 flex items-center justify-center border border-cyan-500/20 shrink-0">
            <Layers className="h-5 w-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Interactive 3D Explorer</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Open, cut away and explode real valve assemblies. Tap any part to study its role and materials.
        </p>
      </div>

      {/* Valve picker */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
        {VALVE_LIST.map((v) => (
          <button
            key={v.id}
            onClick={() => setValveId(v.id)}
            className={`shrink-0 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
              v.id === valveId
                ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_18px_-4px_rgba(6,182,212,0.6)]'
                : 'glass-panel text-muted-foreground border-white/10 hover:text-foreground hover:border-white/20'
            }`}
          >
            {v.name}
          </button>
        ))}
      </div>

      {/* Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Assembly nav: order-2 on mobile (below viewer), left column on desktop */}
        <div className="order-2 lg:order-1 lg:col-span-3">
          <AssemblyNav config={config} selected={selected} onSelect={setSelected} />
        </div>

        {/* Viewer: first on mobile */}
        <div className="order-1 lg:order-2 lg:col-span-6 w-full">
          <ModelViewer valveId={valveId} selected={selected} onSelect={setSelected} />
          <div className="mt-2 flex items-center justify-between gap-2 px-1">
            <span className="text-[11px] text-muted-foreground">{config.motion}</span>
            <Link
              href={`/valve/${valveId}`}
              className="text-[11px] font-bold text-primary hover:underline inline-flex items-center gap-1 shrink-0"
            >
              Full spec sheet <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Details: order-3 */}
        <div className="order-3 lg:col-span-3">
          {activeComp ? (
            <div className="glass-panel rounded-2xl p-5 flex flex-col gap-5 border border-primary/20 bg-primary/[0.02]">
              <div className="flex flex-col gap-1 border-b border-white/5 pb-3">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{activeComp.category}</span>
                <h2 className="text-lg font-bold text-foreground">{activeComp.name}</h2>
              </div>

              <Field icon={<Info className="h-3.5 w-3.5 text-primary" />} label="Description">
                <p className="text-muted-foreground leading-relaxed">{activeComp.description}</p>
              </Field>

              <div className="flex flex-col gap-1.5 text-xs bg-white/5 p-3.5 rounded-xl border border-white/5">
                <span className="font-bold text-primary uppercase tracking-widest text-[9px]">How it works</span>
                <p className="text-muted-foreground leading-relaxed">{activeComp.function}</p>
              </div>

              <Field icon={<ShieldCheck className="h-3.5 w-3.5 text-primary" />} label="Typical materials">
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {activeComp.materials.map((m, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] text-muted-foreground font-semibold"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </Field>

              <div className="flex items-center gap-2 text-[10px] text-muted-foreground border-t border-white/5 pt-3">
                <LinkIcon className="h-3.5 w-3.5 text-primary/70" />
                Part of the {config.name} assembly
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center text-center text-muted-foreground border border-white/5 gap-2">
              <Boxes className="h-6 w-6 text-primary/60" />
              <span className="text-sm">Select a component to inspect details.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 text-xs">
      <span className="font-bold text-muted-foreground uppercase tracking-widest text-[9px] flex items-center gap-1">
        {icon} {label}
      </span>
      {children}
    </div>
  );
}

function AssemblyNav({
  config,
  selected,
  onSelect,
}: {
  config: ReturnType<typeof getValve3D>;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="glass-panel rounded-2xl p-4 border border-white/10">
      <h3 className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground border-b border-white/5 pb-2 mb-3 flex items-center gap-1.5">
        <Boxes className="h-3.5 w-3.5 text-primary" /> Assembly · {config.name}
      </h3>
      <div className="flex flex-wrap gap-x-4 gap-y-3 lg:flex-col">
        {config.groups.map((group) => (
          <div key={group.label} className="basis-full lg:basis-auto flex flex-col gap-1.5">
            <span className="text-[9px] font-bold uppercase tracking-widest text-primary/70">{group.label}</span>
            <div className="flex flex-wrap gap-1.5 lg:flex-col">
              {group.components.map((id) => {
                const comp = config.components[id];
                if (!comp) return null;
                const active = selected === id;
                return (
                  <button
                    key={id}
                    onClick={() => onSelect(id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs font-semibold transition-all ${
                      active
                        ? 'bg-primary/10 text-primary border border-primary/30'
                        : 'text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent'
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-primary' : 'bg-muted-foreground/60'}`} />
                    {comp.name}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-muted-foreground">Loading explorer…</div>}>
      <ExploreInner />
    </Suspense>
  );
}
