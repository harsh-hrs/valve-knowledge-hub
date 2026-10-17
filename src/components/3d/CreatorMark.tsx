import React from 'react';
import { AUTHOR } from '@/lib/site';

// Creator's mark shown on every 3D model on the site: HRS = Harsh Raj Singh.
// Same seal as the standalone viewers in public/viewers.
export function CreatorMark({ className = '' }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label={`3D model by ${AUTHOR} (HRS)`}
      title={`3D model by ${AUTHOR}`}
      className={`glass-panel h-11 w-11 shrink-0 rounded-full border-0 shadow-md text-foreground select-none pointer-events-auto ${className}`}
    >
      <svg viewBox="0 0 44 44" className="block h-full w-full" aria-hidden="true">
        <circle cx="22" cy="22" r="20.75" className="fill-none stroke-primary" strokeWidth="1.5" />
        <circle cx="22" cy="22" r="17.25" className="fill-none stroke-primary" strokeWidth="0.75" opacity="0.55" />
        <text x="22" y="26.4" textAnchor="middle" fill="currentColor" fontSize="12.5" fontWeight="800" letterSpacing="0.5">
          HRS
        </text>
      </svg>
    </div>
  );
}
