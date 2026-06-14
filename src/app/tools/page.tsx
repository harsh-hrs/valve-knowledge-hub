'use client';

import React from 'react';
import Link from 'next/link';
import { Settings2, Binary } from 'lucide-react';

export default function ToolsPage() {
  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 p-2.5 flex items-center justify-center border border-amber-500/20">
            <Settings2 className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-bold">Engineering Tools</h1>
        </div>
        <p className="text-muted-foreground">
          Perform analytical fluid sizing operations, pressure drop limits, and material verification.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
          <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center text-primary border border-white/5">
            <Binary className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold">Flow Coefficient (Cv/Kv)</h3>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Calculate control valve sizing requirements for liquid, gas, and steam applications based on standard ISA-75 equations.
          </p>
          <button className="px-3.5 py-2 rounded-lg bg-white/5 text-muted-foreground border border-white/5 text-xs font-semibold self-start mt-auto">
            Opening Soon
          </button>
        </div>

        <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
          <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center text-primary border border-white/5">
            <Settings2 className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold">Valve Comparison Matrix</h3>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Run side-by-side engineering comparisons for weight, cost, speed, pressure drop, and leakage specs.
          </p>
          <Link href="/tools/compare" className="px-3.5 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 text-center text-xs font-bold transition-all self-start mt-auto">
            Compare Valves
          </Link>
        </div>

        <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
          <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center text-primary border border-white/5">
            <Settings2 className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold">Chemical Compatibility</h3>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Verify seat and gasket material options (PTFE, EPDM, Viton, Stellite) across process chemical types.
          </p>
          <button className="px-3.5 py-2 rounded-lg bg-white/5 text-muted-foreground border border-white/5 text-xs font-semibold self-start mt-auto">
            Opening Soon
          </button>
        </div>
      </div>
    </div>
  );
}
