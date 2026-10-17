'use client';

import React from 'react';
import Link from 'next/link';
import { AUTHOR } from '@/lib/site';

export function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-background py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground text-center md:text-left">
          <div>
            © {new Date().getFullYear()} <span className="text-foreground font-semibold">{AUTHOR}</span>. All rights reserved.
          </div>
          <div className="text-xs mt-1">ValveHub is designed and built by {AUTHOR} for technical education.</div>
        </div>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <Link href="/explore" className="hover:text-primary transition-colors">Explorer</Link>
          <Link href="/learn" className="hover:text-primary transition-colors">Academy</Link>
          <Link href="/tools" className="hover:text-primary transition-colors">Tools</Link>
        </div>
      </div>
    </footer>
  );
}
