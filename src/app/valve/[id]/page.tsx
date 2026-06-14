import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { VALVE_DETAILS } from '@/lib/valve-detail-data';
import {
  ArrowLeft,
  Settings,
  ShieldAlert,
  Wrench,
  Activity,
  Award,
  Layers,
  ChevronRight,
  TrendingDown
} from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ValveDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const valve = VALVE_DETAILS[resolvedParams.id];

  if (!valve) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-12 py-8 max-w-5xl mx-auto">
      {/* 1. Header Navigation & Identity */}
      <div className="flex flex-col gap-4 border-b border-white/5 pb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors self-start"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              {valve.category} &bull; {valve.subcategory} Motion
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{valve.name}</h1>
          </div>
          <Link
            href={`/explore?valve=${valve.id}`}
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:cyan-glow transition-all self-start md:self-auto flex items-center gap-2 group"
          >
            Launch 3D Explorer
            <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* 2. Overview & Working Principle */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col gap-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Overview
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{valve.overview}</p>
        </div>

        <div className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col gap-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Working Principle
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{valve.workingPrinciple}</p>
        </div>
      </section>

      {/* 3. Advantages & Limitations */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Advantages */}
        <div className="glass-panel rounded-2xl p-6 border-l-4 border-l-primary flex flex-col gap-4">
          <h4 className="font-bold text-sm text-primary uppercase tracking-widest">Mechanical Advantages</h4>
          <ul className="flex flex-col gap-3">
            {valve.advantages.map((adv, idx) => (
              <li key={idx} className="flex gap-2.5 items-start text-sm text-muted-foreground">
                <span className="h-5 w-5 shrink-0 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                  &checkmark;
                </span>
                <span className="leading-relaxed">{adv}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Limitations */}
        <div className="glass-panel rounded-2xl p-6 border-l-4 border-l-rose-500 flex flex-col gap-4">
          <h4 className="font-bold text-sm text-rose-400 uppercase tracking-widest">Operational Limitations</h4>
          <ul className="flex flex-col gap-3">
            {valve.limitations.map((lim, idx) => (
              <li key={idx} className="flex gap-2.5 items-start text-sm text-muted-foreground">
                <ShieldAlert className="h-4.5 w-4.5 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{lim}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Applications */}
      <section className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col gap-4">
        <h3 className="font-bold text-lg">Common Applications</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {valve.applications.map((app, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-primary uppercase">Service Area {idx + 1}</span>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">{app}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Internal Components */}
      <section className="flex flex-col gap-4">
        <h3 className="font-bold text-lg">Internal Assemblies & Component Roles</h3>
        <div className="overflow-hidden glass-panel rounded-2xl border border-white/5">
          <div className="grid grid-cols-3 gap-4 bg-white/5 p-4 text-xs font-bold text-muted-foreground border-b border-white/5 uppercase tracking-wider">
            <div>Component</div>
            <div>Functionality</div>
            <div>Typical Materials</div>
          </div>
          <div className="divide-y divide-white/5 text-xs text-muted-foreground">
            {valve.components.map((comp, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-4 p-4 hover:bg-white/5 transition-colors">
                <div className="font-semibold text-primary">{comp.name}</div>
                <div>{comp.function}</div>
                <div>{comp.typicalMaterials.join(', ')}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Materials Selection */}
      <section className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col gap-4">
        <h3 className="font-bold text-lg">Material Specifications</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-muted-foreground">
          <div className="flex flex-col gap-2">
            <span className="font-bold text-primary uppercase tracking-wider">Body Materials</span>
            <ul className="list-disc pl-4 space-y-1.5">
              {valve.materials.body.map((mat, idx) => <li key={idx}>{mat}</li>)}
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-bold text-primary uppercase tracking-wider">Trim Materials</span>
            <ul className="list-disc pl-4 space-y-1.5">
              {valve.materials.trim.map((mat, idx) => <li key={idx}>{mat}</li>)}
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-bold text-primary uppercase tracking-wider">Seals & Gaskets</span>
            <ul className="list-disc pl-4 space-y-1.5">
              {valve.materials.seals.map((mat, idx) => <li key={idx}>{mat}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* 7. Governing Standards */}
      <section className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col gap-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Governing Codes & Standards
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {valve.standards.map((std, idx) => (
            <span key={idx} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-semibold text-muted-foreground">
              {std}
            </span>
          ))}
        </div>
      </section>

      {/* 8. Maintenance Schedule */}
      <section className="flex flex-col gap-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Wrench className="h-5 w-5 text-primary" />
          Maintenance Schedule
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {valve.maintenance.map((task, idx) => (
            <div key={idx} className="glass-panel rounded-xl p-5 flex flex-col gap-2 border border-white/5">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Task {idx + 1}</span>
                <span className="text-[10px] text-muted-foreground font-mono bg-white/5 px-2 py-0.5 rounded">{task.interval}</span>
              </div>
              <div className="text-sm font-bold text-foreground mt-1">{task.action}</div>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1">{task.rationale}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Failure Modes & Troubleshooting */}
      <section className="flex flex-col gap-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-rose-400" />
          Failure Modes & Mitigation
        </h3>
        <div className="overflow-hidden glass-panel rounded-2xl border border-white/5">
          <div className="grid grid-cols-3 gap-4 bg-white/5 p-4 text-xs font-bold text-muted-foreground border-b border-white/5 uppercase tracking-wider">
            <div>Failure Mode</div>
            <div>Primary Cause</div>
            <div>Mitigation & Prevention</div>
          </div>
          <div className="divide-y divide-white/5 text-xs text-muted-foreground">
            {valve.failureModes.map((fm, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-4 p-4 hover:bg-white/5 transition-colors">
                <div className="font-semibold text-rose-400">{fm.mode}</div>
                <div>{fm.cause}</div>
                <div>{fm.prevention}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Comparison Section */}
      <section className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-lg">Engineering Comparison</h3>
          <p className="text-xs text-muted-foreground">{valve.comparison.summary}</p>
        </div>

        <div className="overflow-hidden rounded-xl border border-white/5 text-xs text-muted-foreground">
          <div className="grid grid-cols-3 gap-4 bg-white/5 p-3.5 font-bold uppercase border-b border-white/5">
            <div>Parameter</div>
            <div className="text-primary">{valve.name} (This)</div>
            <div>Comparison Alternative</div>
          </div>
          <div className="divide-y divide-white/5">
            {valve.comparison.metrics.map((metric, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-4 p-3.5 hover:bg-white/5 transition-all">
                <div className="font-semibold">{metric.parameter}</div>
                <div className="text-primary font-mono">{metric.thisValveValue}</div>
                <div>
                  <span className="font-semibold text-foreground">{metric.alternativeValveName}</span>
                  <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{metric.alternativeValveValue}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center border-t border-white/5 pt-8">
        <Link
          href="/"
          className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
        >
          &larr; Back to Catalog
        </Link>
        <span className="text-[10px] text-muted-foreground font-mono">
          ValveHub Spec Sheet v1.0
        </span>
      </div>
    </div>
  );
}
