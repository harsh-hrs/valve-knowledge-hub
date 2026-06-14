'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { VALVE_DETAILS, ValveDetail } from '@/lib/valve-detail-data';
import {
  Search,
  ArrowRight,
  Filter,
  Layers,
  Award,
  ShieldCheck,
  Cpu,
  Info
} from 'lucide-react';

interface SearchResult {
  valve: ValveDetail;
  matchType: 'name' | 'component' | 'material' | 'application' | 'standard';
  matchSnippet: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'name' | 'component' | 'material' | 'application' | 'standard'>('all');

  // Multi-field search indexing logic
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase().trim();
    const results: SearchResult[] = [];

    Object.values(VALVE_DETAILS).forEach((valve) => {
      // 1. Search Valve Name / Subcategory
      if (valve.name.toLowerCase().includes(lowerQuery) || valve.subcategory.toLowerCase().includes(lowerQuery)) {
        if (activeFilter === 'all' || activeFilter === 'name') {
          results.push({
            valve,
            matchType: 'name',
            matchSnippet: `Matched valve profile name: "${valve.name}"`
          });
          return; // Prevent duplicate results for same valve
        }
      }

      // 2. Search Internal Components
      const matchingComponent = valve.components.find(
        c => c.name.toLowerCase().includes(lowerQuery) || c.function.toLowerCase().includes(lowerQuery)
      );
      if (matchingComponent) {
        if (activeFilter === 'all' || activeFilter === 'component') {
          results.push({
            valve,
            matchType: 'component',
            matchSnippet: `Component: "${matchingComponent.name}" - ${matchingComponent.function}`
          });
          return;
        }
      }

      // 3. Search Fabrication Materials
      const allMaterials = [
        ...valve.materials.body,
        ...valve.materials.trim,
        ...valve.materials.seals
      ];
      const matchingMaterial = allMaterials.find(m => m.toLowerCase().includes(lowerQuery));
      if (matchingMaterial) {
        if (activeFilter === 'all' || activeFilter === 'material') {
          results.push({
            valve,
            matchType: 'material',
            matchSnippet: `Material spec: "${matchingMaterial}"`
          });
          return;
        }
      }

      // 4. Search Applications
      const matchingApp = valve.applications.find(a => a.toLowerCase().includes(lowerQuery));
      if (matchingApp) {
        if (activeFilter === 'all' || activeFilter === 'application') {
          results.push({
            valve,
            matchType: 'application',
            matchSnippet: `Application: "${matchingApp}"`
          });
          return;
        }
      }

      // 5. Search Standards
      const matchingStd = valve.standards.find(s => s.toLowerCase().includes(lowerQuery));
      if (matchingStd) {
        if (activeFilter === 'all' || activeFilter === 'standard') {
          results.push({
            valve,
            matchType: 'standard',
            matchSnippet: `Governing Standard: "${matchingStd}"`
          });
          return;
        }
      }
    });

    return results;
  }, [query, activeFilter]);

  const filterButtons = [
    { id: 'all', label: 'All Fields', icon: Filter },
    { id: 'name', label: 'Valve Name', icon: Cpu },
    { id: 'component', label: 'Component', icon: Layers },
    { id: 'material', label: 'Material', icon: ShieldCheck },
    { id: 'application', label: 'Application', icon: Info },
    { id: 'standard', label: 'Standard', icon: Award }
  ] as const;

  return (
    <div className="flex flex-col gap-10 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Valve Knowledge Finder</h1>
        <p className="text-muted-foreground text-sm">
          Run deep indexing queries across valve specifications, structural components, governing standards, and chemical trim materials.
        </p>
      </div>

      {/* Main Search Input */}
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by valve, material (e.g. PTFE, CF8M), standard (e.g. API 600) or application..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/5 text-base focus:outline-none focus:border-primary focus:cyan-glow transition-all"
        />
      </div>

      {/* Filter Chips Row */}
      <div className="flex flex-wrap gap-2 items-center overflow-x-auto max-w-full pb-2">
        {filterButtons.map((btn) => {
          const Icon = btn.icon;
          const isActive = activeFilter === btn.id;
          return (
            <button
              key={btn.id}
              onClick={() => setActiveFilter(btn.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border shrink-0 ${
                isActive
                  ? 'bg-primary text-primary-foreground border-primary shadow'
                  : 'bg-white/5 text-muted-foreground border-white/5 hover:border-white/10 hover:text-foreground'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {btn.label}
            </button>
          );
        })}
      </div>

      {/* Results Container */}
      <div className="flex flex-col gap-4">
        <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-white/5 pb-2">
          {query.trim() ? `Search Results (${searchResults.length})` : 'Search Index Catalog'}
        </h3>

        <AnimatePresence mode="wait">
          {searchResults.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-4"
            >
              {searchResults.map((result, idx) => (
                <Link
                  key={`${result.valve.id}-${idx}`}
                  href={`/valve/${result.valve.id}`}
                  className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-primary/20 hover:-translate-y-0.5 transition-all flex justify-between items-center group cursor-pointer"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">
                        {result.valve.category}
                      </span>
                      <h4 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                        {result.valve.name}
                      </h4>
                    </div>
                    {/* Highlighted Match Snippet */}
                    <div className="text-xs text-muted-foreground bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 self-start">
                      <span className="text-primary font-bold uppercase text-[9px]">{result.matchType}:</span>
                      <span className="font-mono text-[11px]">{result.matchSnippet}</span>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                </Link>
              ))}
            </motion.div>
          ) : query.trim() ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-muted-foreground text-sm bg-white/5 rounded-2xl border border-dashed border-white/10"
            >
              No matching records found. Try modifying your filters or search keywords.
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.01] flex flex-col gap-2">
                <h4 className="font-bold text-sm text-foreground">Standard Codes</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Search index includes governing bodies like **API 6D**, **API 600**, and **ASME B16.34**.
                </p>
              </div>
              <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.01] flex flex-col gap-2">
                <h4 className="font-bold text-sm text-foreground">Material Compounds</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Query seal limits by searching compounds like **PTFE**, **Stellite 6**, and body casts like **CF8M**.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
