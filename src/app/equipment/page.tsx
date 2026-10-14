import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { EQUIPMENT_LIST } from '@/lib/equipment-data';
import { Factory, Rotate3d, ChevronRight, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Equipment Lab - ValveHub',
  description: 'Interactive 3D models of the plant equipment that valves work with: pumps, intakes and more.',
};

export default function EquipmentPage() {
  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-400 p-2.5 flex items-center justify-center border border-cyan-500/20 shrink-0">
            <Factory className="h-5 w-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Equipment Lab</h1>
        </div>
        <p className="text-muted-foreground text-sm max-w-2xl">
          Valves never work alone. Explore the equipment around them in 3D: open it up, cut it in half,
          explode it into parts and watch it run.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EQUIPMENT_LIST.map((eq) => (
          <Link
            key={eq.id}
            href={`/equipment/${eq.id}`}
            className="group glass-panel rounded-2xl p-6 flex flex-col gap-4 border border-white/10 hover:border-primary/30 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{eq.category}</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold">
                <Rotate3d className="h-3 w-3" /> 3D
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <h2 className="text-lg font-bold">{eq.name}</h2>
              <p className="text-muted-foreground text-xs leading-relaxed">{eq.tagline}</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {eq.stats.slice(0, 3).map((s) => (
                <div key={s.label} className="bg-slate-950/30 border border-white/5 rounded-xl p-2.5 text-center">
                  <div className="text-sm font-bold font-mono text-foreground">
                    {s.value}
                    {s.unit && <span className="text-[10px] text-muted-foreground ml-0.5">{s.unit}</span>}
                  </div>
                  <div className="text-[10px] text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
            <span className="mt-auto inline-flex items-center gap-1 text-xs font-bold text-primary">
              Open 3D model
              <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          </Link>
        ))}

        <div className="rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-2 border border-dashed border-white/10 text-muted-foreground min-h-[220px]">
          <Sparkles className="h-5 w-5 text-primary/60" />
          <span className="text-sm font-semibold">More equipment coming soon</span>
          <span className="text-xs">New 3D models are added to the lab as they are built.</span>
        </div>
      </div>
    </div>
  );
}
