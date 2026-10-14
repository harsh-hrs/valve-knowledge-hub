'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Maximize } from 'lucide-react';

interface EmbeddedViewerProps {
  src: string;
  title: string;
}

// Hosts a standalone 3D viewer page in an iframe, with a loading state and a
// full-screen button (falls back to a new tab where element full screen is unsupported).
export function EmbeddedViewer({ src, title }: EmbeddedViewerProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [isFull, setIsFull] = useState(false);

  useEffect(() => {
    // The static HTML starts loading the iframe before React hydrates, so onLoad may already have fired.
    if (frameRef.current?.contentDocument?.readyState === 'complete') setLoaded(true);
    const onChange = () => setIsFull(document.fullscreenElement === wrapRef.current);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const goFull = () => {
    const el = wrapRef.current;
    if (el && document.fullscreenEnabled) {
      el.requestFullscreen().catch(() => window.open(src, '_blank', 'noopener'));
    } else {
      window.open(src, '_blank', 'noopener');
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={wrapRef}
        className={`relative w-full overflow-hidden bg-slate-950 ${
          isFull ? 'h-full' : 'h-[78svh] min-h-[480px] max-h-[900px] rounded-3xl border border-white/10'
        }`}
      >
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            <span className="text-sm">Loading 3D model…</span>
          </div>
        )}
        <iframe
          ref={frameRef}
          src={src}
          title={title}
          allow="fullscreen"
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-1">
        <span className="text-[11px] text-muted-foreground">
          Drag to rotate · Pinch or scroll to zoom · Tap a part for details
        </span>
        <div className="flex items-center gap-4 shrink-0">
          <button
            type="button"
            onClick={goFull}
            className="text-[11px] font-bold text-primary hover:underline inline-flex items-center gap-1"
          >
            Full screen <Maximize className="h-3.5 w-3.5" />
          </button>
          <a
            href={src}
            target="_blank"
            rel="noopener"
            className="text-[11px] font-bold text-primary hover:underline inline-flex items-center gap-1"
          >
            Open in new tab <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
