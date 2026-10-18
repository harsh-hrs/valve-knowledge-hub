import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EQUIPMENT } from '@/lib/equipment-data';
import { EmbeddedViewer } from '@/components/equipment/EmbeddedViewer';
import { AUTHOR, pageOpenGraph } from '@/lib/site';
import { ArrowLeft, MousePointerClick, GraduationCap, Info } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Pre-render a static page for every model at build time (required for `output: export`).
export function generateStaticParams() {
  return Object.keys(EQUIPMENT).map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const eq = EQUIPMENT[id];
  if (!eq) return {};
  const title = `${eq.name} 3D Model - ValveHub`;
  const description = `${eq.tagline} 3D model by ${AUTHOR}.`;
  return { title, description, authors: [{ name: AUTHOR }], openGraph: pageOpenGraph(title, description, `/equipment/${id}/`) };
}

export default async function EquipmentDetailPage({ params }: PageProps) {
  const eq = EQUIPMENT[(await params).id];
  if (!eq) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8 py-2 sm:py-4">
      <div className="flex flex-col gap-3">
        <Link
          href="/equipment"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors self-start"
        >
          <ArrowLeft className="h-4 w-4" />
          Equipment Lab
        </Link>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">{eq.category} &bull; Interactive 3D</span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{eq.name}</h1>
          <p className="text-muted-foreground text-sm max-w-3xl">{eq.tagline}</p>
          <p className="text-xs text-muted-foreground">
            3D model created by <span className="text-foreground font-semibold">{AUTHOR}</span>
          </p>
        </div>
      </div>

      <EmbeddedViewer src={eq.viewerSrc} title={`${eq.name} 3D model`} />

      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {eq.stats.map((s) => (
          <div key={s.label} className="glass-panel rounded-xl p-4 text-center">
            <div className="text-xl font-bold font-mono text-primary">
              {s.value}
              {s.unit && <span className="text-xs text-muted-foreground ml-1">{s.unit}</span>}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </section>

      <section className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col gap-3">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          What it is
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">{eq.summary}</p>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col gap-4">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <MousePointerClick className="h-5 w-5 text-primary" />
            What you can do in the model
          </h2>
          <ul className="flex flex-col gap-3">
            {eq.features.map((f) => (
              <li key={f.title} className="flex flex-col gap-0.5 text-sm">
                <span className="font-semibold text-foreground">{f.title}</span>
                <span className="text-muted-foreground text-xs leading-relaxed">{f.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col gap-4">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            What you will learn
          </h2>
          <ol className="flex flex-col gap-2">
            {eq.learn.map((topic, i) => (
              <li key={topic} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="h-6 w-6 shrink-0 rounded-md bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="pt-0.5">{topic}</span>
              </li>
            ))}
          </ol>
          <p className="text-xs text-muted-foreground border-t border-white/5 pt-3">
            Press <span className="text-foreground font-semibold">Guided tour</span> inside the model to walk through these in order.
          </p>
        </div>
      </section>

      <p className="text-[11px] text-muted-foreground">{eq.note}</p>
    </div>
  );
}
