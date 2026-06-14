import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CATEGORIES_DATA } from '@/lib/category-data';
import {
  ArrowLeft,
  Settings2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  Compass,
  ArrowRight
} from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Pre-render a static page for every category at build time (required for `output: export`).
export function generateStaticParams() {
  return Object.keys(CATEGORIES_DATA).map((id) => ({ id }));
}

export default async function CategoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const category = CATEGORIES_DATA[resolvedParams.id];

  if (!category) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-16 py-8">
      {/* Visual Navigation Header */}
      <div className="flex flex-col gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors self-start"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary p-2.5 flex items-center justify-center border border-primary/20">
              <Settings2 className="h-5 w-5" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold">{category.name}</h1>
          </div>
          <p className="text-primary font-medium text-sm">{category.subtitle}</p>
        </div>
      </div>

      {/* Two Column Overview / Why it Exists */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Overview Panel */}
        <div className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col gap-4 border border-white/5">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-cyan-400" />
            Overview & Design
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {category.overview}
          </p>
        </div>

        {/* Why it exists Panel */}
        <div className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col gap-4 border border-white/5">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            Pedagogical Rationale
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {category.whyExists}
          </p>
        </div>
      </section>

      {/* Common Applications List */}
      <section className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col gap-4 border border-white/5">
        <h2 className="text-xl font-bold">Standard Industry Applications</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          {category.applications.map((app, idx) => (
            <div key={idx} className="flex gap-3 items-start p-3 bg-white/5 rounded-xl border border-white/5">
              <span className="h-5 w-5 shrink-0 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                {idx + 1}
              </span>
              <span className="text-xs text-muted-foreground leading-relaxed">{app}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Valve Cards Showcase */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold">Category Valve Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {category.valves.map((valve) => (
            <div
              key={valve.id}
              className="glass-panel rounded-2xl p-6 flex flex-col justify-between border border-white/5 relative overflow-hidden group hover:border-primary/30 transition-all duration-300"
            >
              <div>
                <h3 className="text-xl font-bold mb-1 text-primary">{valve.name}</h3>
                <p className="text-xs text-muted-foreground mb-4 font-medium">{valve.description}</p>
                
                <div className="bg-slate-950/40 rounded-xl p-4 mb-6 border border-white/5">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Working Principle</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{valve.workingPrinciple}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {/* Advantages */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Advantages</span>
                    {valve.advantages.map((adv, aIdx) => (
                      <div key={aIdx} className="flex gap-2 items-center text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>{adv}</span>
                      </div>
                    ))}
                  </div>

                  {/* Limitations */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Limitations</span>
                    {valve.limitations.map((lim, lIdx) => (
                      <div key={lIdx} className="flex gap-2 items-center text-xs text-muted-foreground">
                        <AlertTriangle className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                        <span>{lim}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Link
                href={`/explore?valve=${valve.id}`}
                className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline mt-auto self-start"
              >
                Inspect 3D Assembly
                <Compass className="h-4 w-4 text-primary" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Visual Navigation: Cross Category Routing Links */}
      <section className="border-t border-white/5 pt-12">
        <h3 className="text-lg font-bold mb-6">Compare Other Categories</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {Object.values(CATEGORIES_DATA)
            .filter((c) => c.id !== resolvedParams.id)
            .map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                className="glass-panel p-4 rounded-xl text-center flex flex-col gap-1 group border border-white/5 hover:border-primary/20 transition-all"
              >
                <span className="text-xs font-bold group-hover:text-primary transition-colors">
                  {cat.name}
                </span>
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider">
                  View Specs
                </span>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
