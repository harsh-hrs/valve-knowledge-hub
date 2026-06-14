'use client';

import React, { createContext, useContext, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { FluidKind, ModelKind } from '@/lib/valve-3d-data';

/* ------------------------------------------------------------------ *
 * Shared model state (open/explode/section + selection highlighting)
 * ------------------------------------------------------------------ */

interface ModelCtx {
  open: number; // 0 = closed, 1 = open
  explode: number; // 0..1
  crossSection: boolean;
  transparency: boolean;
  flow: boolean;
  active: string | null; // hovered ?? selected
  setSelected: (id: string | null) => void;
  setHovered: (id: string | null) => void;
  clipPlanes: THREE.Plane[];
}

const Ctx = createContext<ModelCtx | null>(null);
const useModel = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('Part must be inside <ValveModel>');
  return c;
};

const COLORS = {
  steel: '#8b97a9',
  steelDark: '#5c6677',
  steelLight: '#aeb8c6',
  brass: '#d8a13e',
  red: '#d4453b',
  rubber: '#3b424f',
  spring: '#d6d9de',
  bolt: '#3f4856',
  ptfe: '#e7ebf0',
};

const HIGHLIGHT = '#2dd4bf';

// Standard flow-channel radius shared across inline valves.
const BORE = 0.62;

/* ------------------------------------------------------------------ *
 * Cached bored geometry helpers — every body/flange/seat has a real
 * hole so fluid travels through an actual machined channel.
 * ------------------------------------------------------------------ */

const geoCache = new Map<string, THREE.BufferGeometry>();
function cached(key: string, build: () => THREE.BufferGeometry): THREE.BufferGeometry {
  let g = geoCache.get(key);
  if (!g) {
    g = build();
    g.computeVertexNormals();
    geoCache.set(key, g);
  }
  return g;
}

/** Hollow pipe / washer with its axis along X (the flow axis). */
function boreTubeX(ri: number, ro: number, len: number, seg = 48): THREE.BufferGeometry {
  return cached(`tubeX:${ri},${ro},${len},${seg}`, () => {
    const pts = [
      new THREE.Vector2(ri, -len / 2),
      new THREE.Vector2(ro, -len / 2),
      new THREE.Vector2(ro, len / 2),
      new THREE.Vector2(ri, len / 2),
      new THREE.Vector2(ri, -len / 2),
    ];
    const g = new THREE.LatheGeometry(pts, seg);
    g.rotateZ(Math.PI / 2); // lathe axis Y -> X
    return g;
  });
}

/** Hollow pipe with its axis along Y (vertical valves). */
function boreTubeY(ri: number, ro: number, len: number, seg = 48): THREE.BufferGeometry {
  return cached(`tubeY:${ri},${ro},${len},${seg}`, () => {
    const pts = [
      new THREE.Vector2(ri, -len / 2),
      new THREE.Vector2(ro, -len / 2),
      new THREE.Vector2(ro, len / 2),
      new THREE.Vector2(ri, len / 2),
      new THREE.Vector2(ri, -len / 2),
    ];
    return new THREE.LatheGeometry(pts, seg);
  });
}

/** Rectangular block with a round bore punched through along X. */
function boredBoxX(w: number, h: number, len: number, bore: number): THREE.BufferGeometry {
  return cached(`box:${w},${h},${len},${bore}`, () => {
    const shape = new THREE.Shape();
    shape.moveTo(-w / 2, -h / 2);
    shape.lineTo(w / 2, -h / 2);
    shape.lineTo(w / 2, h / 2);
    shape.lineTo(-w / 2, h / 2);
    shape.lineTo(-w / 2, -h / 2);
    const hole = new THREE.Path();
    hole.absarc(0, 0, bore, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    const g = new THREE.ExtrudeGeometry(shape, { depth: len, bevelEnabled: false, curveSegments: 40, steps: 1 });
    g.translate(0, 0, -len / 2);
    g.rotateY(Math.PI / 2); // extrude axis Z -> X
    return g;
  });
}

/** Hollow cylindrical body with axis along X. */
function boredCylX(ri: number, ro: number, len: number): THREE.BufferGeometry {
  return boreTubeX(ri, ro, len);
}

/* ------------------------------------------------------------------ *
 * Part — a selectable, highlightable, clippable mesh
 * ------------------------------------------------------------------ */

interface PartProps {
  id: string;
  color: string;
  metalness?: number;
  roughness?: number;
  /** treated as an outer shell that fades in x-ray mode */
  shell?: boolean;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number] | number;
  /** soft / non-metallic parts (seals, rubber) */
  soft?: boolean;
  /** explicit cached geometry (preferred for bored parts) */
  geometry?: THREE.BufferGeometry;
  children?: React.ReactNode;
}

function Part({
  id,
  color,
  metalness,
  roughness,
  shell = false,
  position,
  rotation,
  scale,
  soft = false,
  geometry,
  children,
}: PartProps) {
  const { active, setSelected, setHovered, transparency, crossSection, clipPlanes } = useModel();
  const highlighted = active === id;
  const xray = transparency && shell;

  return (
    <mesh
      geometry={geometry}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow
      receiveShadow
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(id);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(null);
        document.body.style.cursor = 'auto';
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        setSelected(id);
      }}
    >
      {children}
      <meshStandardMaterial
        color={highlighted ? HIGHLIGHT : color}
        emissive={highlighted ? HIGHLIGHT : '#000000'}
        emissiveIntensity={highlighted ? 0.45 : 0}
        metalness={soft ? 0.1 : metalness ?? 0.55}
        roughness={soft ? 0.7 : roughness ?? 0.32}
        transparent={xray}
        opacity={xray ? 0.16 : 1}
        depthWrite={!xray}
        side={THREE.DoubleSide}
        clippingPlanes={crossSection ? clipPlanes : null}
        clipShadows
        envMapIntensity={1.1}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ *
 * Flow — instanced fluid particles streaming through the bore
 * ------------------------------------------------------------------ */

const FLUID_COLORS: Record<FluidKind, string> = {
  water: '#38bdf8',
  air: '#e6edf5',
  steam: '#cbd5e1',
  oil: '#f0a93a',
};

interface FlowProps {
  open: number;
  fluid: FluidKind;
  axis?: 'x' | 'y';
  from: number;
  closed: number; // furthest point reached when fully closed
  to: number;
  radius?: number;
  count?: number;
}

function Flow({ open, fluid, axis = 'x', from, closed, to, radius = 0.4, count = 44 }: FlowProps) {
  const { flow } = useModel();
  const ref = useRef<THREE.InstancedMesh>(null);
  const acc = useRef(0); // accumulated flow-time, advanced incrementally
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const ang = (i * 2.39996) % (Math.PI * 2); // golden-angle spread
        const rr = radius * Math.sqrt(((i * 17) % count) / count);
        return {
          phase: (i / count + ((i * 7) % 13) / 37) % 1,
          ox: Math.cos(ang) * rr,
          oy: Math.sin(ang) * rr,
          speed: 0.45 + ((i % 6) * 0.09),
          size: 0.06 + ((i % 4) * 0.016),
        };
      }),
    [count, radius],
  );
  const color = FLUID_COLORS[fluid];

  useFrame((_, delta) => {
    const mesh = ref.current;
    if (!mesh) return;
    const reach = THREE.MathUtils.lerp(closed, to, Math.max(0, open));
    const flowing = 0.25 + open * 0.9;
    // Accumulate time scaled by flow rate so changing `open` adjusts speed
    // smoothly instead of retro-scaling all elapsed time (which caused jumps).
    acc.current += Math.min(delta, 0.05) * flowing;
    const t = acc.current;
    for (let i = 0; i < count; i++) {
      const s = seeds[i];
      const p = (t * s.speed + s.phase) % 1;
      const main = THREE.MathUtils.lerp(from, reach, p);
      if (axis === 'x') dummy.position.set(main, s.oy, s.ox);
      else dummy.position.set(s.ox, main, s.oy);
      const fade = Math.sin(p * Math.PI); // smaller at ends
      const sc = s.size * (0.55 + fade * 0.9);
      dummy.scale.setScalar(Math.max(0.0001, sc));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  if (!flow) return null;

  return (
    // renderOrder + depthTest:false keep the fluid visible through bodies, the
    // ball/disc and transparent shells — so flow shows along the whole path.
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false} renderOrder={20}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={fluid === 'air' ? 0.45 : 0.85}
        metalness={0}
        roughness={0.15}
        transparent
        opacity={fluid === 'air' ? 0.7 : 0.95}
        depthWrite={false}
        depthTest={false}
      />
    </instancedMesh>
  );
}

/* ------------------------------------------------------------------ *
 * Reusable bored pipe + flange end connections (bore along X)
 * ------------------------------------------------------------------ */

function InlineEnds({ inner, half = 2.5, ro = 1.0, flange = 1.5, bore = BORE }: { inner: number; half?: number; ro?: number; flange?: number; bore?: number }) {
  const { explode } = useModel();
  const off = explode * 1.4;
  // Stubs bridge flush from the body face (inner) to the flange (half) with a
  // little overlap at each join so there are no gaps at explode 0.
  const stubLen = half - inner + 0.25;
  const stubCenter = (inner + half) / 2;
  return (
    <>
      {/* hollow pipe stubs — flush to the body, overlapping the flange */}
      <Part id="body" color={COLORS.steel} shell geometry={boreTubeX(bore, ro, stubLen)} position={[-(stubCenter + off * 0.5), 0, 0]} />
      <Part id="body" color={COLORS.steel} shell geometry={boreTubeX(bore, ro, stubLen)} position={[stubCenter + off * 0.5, 0, 0]} />
      {/* hollow flanges */}
      <Part id="body" color={COLORS.steelDark} shell geometry={boreTubeX(bore, flange, 0.45)} position={[-(half + off), 0, 0]} />
      <Part id="body" color={COLORS.steelDark} shell geometry={boreTubeX(bore, flange, 0.45)} position={[half + off, 0, 0]} />
    </>
  );
}

/** A pair of seat rings at the bore mouths (real annular holes). */
function SeatRings({ x = 0.6, explode = 0, ri = BORE - 0.04, ro = BORE + 0.16, soft = false, color = COLORS.brass }: {
  x?: number; explode?: number; ri?: number; ro?: number; soft?: boolean; color?: string;
}) {
  return (
    <>
      <Part id="seat" color={color} soft={soft} geometry={boreTubeX(ri, ro, 0.22)} position={[-x - explode * 0.6, 0, 0]} />
      <Part id="seat" color={color} soft={soft} geometry={boreTubeX(ri, ro, 0.22)} position={[x + explode * 0.6, 0, 0]} />
    </>
  );
}

/* ============================ MODELS ============================== */

function GateModel() {
  const { open, explode: e } = useModel();
  const lift = open * 2.3;
  return (
    <group>
      <InlineEnds inner={0.9} half={2.5} />
      {/* central body — bored block with a real flow channel */}
      <Part id="body" color={COLORS.steel} shell geometry={boredBoxX(2.0, 2.0, 1.8, BORE)} position={[0, 0, 0]} />
      {/* neck (slot for the gate) — overlaps the body top and the bonnet base */}
      <Part id="body" color={COLORS.steel} shell position={[0, 1.35, 0]}>
        <boxGeometry args={[1.05, 1.7, 1.05]} />
      </Part>
      <SeatRings x={0.88} explode={e} />
      {/* bonnet — sits flush on the neck */}
      <Part id="bonnet" color={COLORS.steelDark} shell position={[0, 2.35 + e * 1.4, 0]}>
        <cylinderGeometry args={[0.78, 0.95, 1.3, 28]} />
      </Part>
      <Part id="packing" color={COLORS.rubber} soft position={[0, 3.05 + e * 1.7, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.5, 20]} />
      </Part>
      {/* rising stem — spans from the wedge up to the handwheel and travels with the gate */}
      <Part id="stem" color={COLORS.steelLight} position={[0, 3.2 + lift + e * 2.0, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 6.6, 16]} />
      </Part>
      <Part id="handwheel" color={COLORS.red} position={[0, 6.2 + lift + e * 2.4, 0]}>
        <torusGeometry args={[1.05, 0.13, 12, 32]} />
      </Part>
      <Part id="handwheel" color={COLORS.red} position={[0, 6.2 + lift + e * 2.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 2.1, 8]} />
      </Part>
      {/* wedge gate — flat plate across the bore; centred (blocking) when closed, lifted clear when open */}
      <Part id="wedge" color={COLORS.steelLight} position={[0, lift, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[BORE + 0.04, BORE + 0.04, 0.42, 6]} />
      </Part>
      <Flow open={open} fluid="water" from={-3.2} closed={-0.55} to={3.2} radius={0.42} />
    </group>
  );
}

function GlobeModel() {
  const { open, explode: e } = useModel();
  const lift = open * 0.9;
  return (
    <group>
      {/* inlet bore (low) then up-and-over Z-path to outlet */}
      <Part id="body" color={COLORS.steel} shell geometry={boreTubeX(BORE, 1.0, 1.6)} position={[-2.0, -0.55, 0]} />
      <Part id="body" color={COLORS.steelDark} shell geometry={boreTubeX(BORE, 1.45, 0.45)} position={[-2.7 - e * 1.4, -0.55, 0]} />
      <Part id="body" color={COLORS.steel} shell geometry={boreTubeX(BORE, 1.0, 1.6)} position={[2.0, -0.55, 0]} />
      <Part id="body" color={COLORS.steelDark} shell geometry={boreTubeX(BORE, 1.45, 0.45)} position={[2.7 + e * 1.4, -0.55, 0]} />
      {/* globular body shell (hollow) */}
      <Part id="body" color={COLORS.steel} shell geometry={hollowSphere(1.5, 1.15)} position={[0, 0.05, 0]} />
      {/* seat ring (horizontal divider with central orifice the plug throttles) */}
      <Part id="seat" color={COLORS.brass} geometry={boreTubeY(0.5, 0.95, 0.2)} position={[0, -0.35, 0]} />
      {/* bonnet + stem */}
      <Part id="bonnet" color={COLORS.steelDark} shell position={[0, 1.9 + e * 1.3, 0]}>
        <cylinderGeometry args={[0.75, 0.95, 1.3, 28]} />
      </Part>
      <Part id="packing" color={COLORS.rubber} soft position={[0, 2.6 + e * 1.6, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.5, 20]} />
      </Part>
      {/* rising stem — spans from the plug up to the handwheel */}
      <Part id="stem" color={COLORS.steelLight} position={[0, 2.4 + lift + e * 1.9, 0]}>
        <cylinderGeometry args={[0.17, 0.17, 5.4, 16]} />
      </Part>
      <Part id="handwheel" color={COLORS.red} position={[0, 5.0 + lift + e * 2.2, 0]}>
        <torusGeometry args={[1.0, 0.12, 12, 32]} />
      </Part>
      <Part id="handwheel" color={COLORS.red} position={[0, 5.0 + lift + e * 2.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 2.0, 8]} />
      </Part>
      {/* contoured plug seats into the orifice; lifts to open */}
      <Part id="plug" color={COLORS.steelLight} position={[0, 0.0 + lift, 0]}>
        <coneGeometry args={[0.52, 0.7, 24]} />
      </Part>
      {/* flow: in low, up through orifice, out low on the far side */}
      <Flow open={open} fluid="steam" from={-3.0} closed={-0.55} to={3.0} radius={0.36} />
    </group>
  );
}

function BallModel() {
  const { open, explode: e } = useModel();
  // OPEN = bore aligned with flow (rot 0); CLOSED = rotated 90° to block.
  const rot = (1 - open) * (Math.PI / 2);
  return (
    <group>
      <InlineEnds inner={1.0} half={2.4} ro={1.05} bore={BORE} />
      {/* hollow body so you can see into the bore */}
      <Part id="body" color={COLORS.steel} shell geometry={boredCylX(BORE, 1.35, 2.0)} position={[0, 0, 0]} />
      {/* ball: sphere with a real bored port through it */}
      <group rotation={[0, rot, 0]}>
        <Part id="ball" color={COLORS.steelLight} metalness={0.7} roughness={0.18} geometry={boredBallX(1.0, 0.5)} />
      </group>
      <SeatRings x={1.0} explode={e} ri={0.5} ro={0.66} soft color={COLORS.ptfe} />
      <Part id="stem" color={COLORS.steelLight} position={[0, 1.4 + e * 1.0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 1.4, 16]} />
      </Part>
      <Part id="packing" color={COLORS.rubber} soft position={[0, 1.0 + e * 0.6, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.4, 16]} />
      </Part>
      <group rotation={[0, rot, 0]}>
        <Part id="lever" color={COLORS.red} position={[0.9, 2.15 + e * 1.2, 0]}>
          <boxGeometry args={[2.2, 0.22, 0.5]} />
        </Part>
      </group>
      <Flow open={open} fluid="oil" from={-3.0} closed={-0.95} to={3.0} radius={0.38} />
    </group>
  );
}

function ButterflyModel() {
  const { open, explode: e } = useModel();
  const rot = open * (Math.PI / 2);
  return (
    <group>
      {/* hollow wafer body (open bore) */}
      <Part id="body" color={COLORS.steel} shell geometry={boreTubeX(1.25, 1.5, 1.0)} position={[0, 0, 0]} />
      <Part id="body" color={COLORS.steelDark} shell geometry={boreTubeX(1.25, 1.7, 0.22)} position={[-0.55, 0, 0]} />
      <Part id="body" color={COLORS.steelDark} shell geometry={boreTubeX(1.25, 1.7, 0.22)} position={[0.55, 0, 0]} />
      {/* seat ring at the bore */}
      <Part id="seat" color={COLORS.brass} geometry={boreTubeX(1.18, 1.26, 0.5)} position={[0, 0, 0]} />
      {/* disc: a plate that faces the flow (closed) and turns edge-on (open) */}
      <group rotation={[0, rot, 0]}>
        <Part id="disc" color={COLORS.steelLight} metalness={0.65} roughness={0.2} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[1.18, 1.18, 0.14, 36]} />
        </Part>
      </group>
      <Part id="stem" color={COLORS.steelLight} position={[0.1, 1.4 + e * 0.9, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 1.8, 16]} />
      </Part>
      <Part id="packing" color={COLORS.rubber} soft position={[0.1, 0.9 + e * 0.5, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.4, 16]} />
      </Part>
      <Part id="actuator" color={COLORS.steelDark} position={[0.1, 2.5 + e * 1.3, 0]}>
        <boxGeometry args={[1.0, 0.9, 1.0]} />
      </Part>
      <Part id="actuator" color={COLORS.red} position={[0.85, 2.5 + e * 1.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.55, 0.55, 0.3, 20]} />
      </Part>
      <Flow open={open} fluid="steam" from={-2.6} closed={-0.35} to={2.6} radius={0.95} count={60} />
    </group>
  );
}

function CheckModel() {
  const { open, explode: e } = useModel();
  const swing = open * (Math.PI / 2.4);
  return (
    <group>
      <InlineEnds inner={1.1} half={2.6} ro={1.1} />
      {/* hollow body */}
      <Part id="body" color={COLORS.steel} shell geometry={boredCylX(BORE, 1.4, 2.2)} position={[0, 0, 0]} />
      <Part id="cap" color={COLORS.steelDark} shell position={[0, 1.5 + e * 1.2, 0]}>
        <cylinderGeometry args={[0.9, 1.1, 0.9, 28]} />
      </Part>
      {/* angled seat at the bore mouth */}
      <Part id="seat" color={COLORS.brass} geometry={boreTubeX(BORE - 0.02, BORE + 0.2, 0.22)} position={[-0.55, 0, 0]} rotation={[0, 0, 0.18]} />
      <Part id="hinge" color={COLORS.steelLight} position={[0.2, 1.0 + e * 0.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 1.6, 12]} />
      </Part>
      {/* swinging disc + arm */}
      <group position={[0.2, 1.0, 0]} rotation={[0, 0, swing]}>
        <group position={[-0.2, -1.0, 0]}>
          <Part id="hinge" color={COLORS.steelLight} position={[0.0, -0.5, 0]}>
            <boxGeometry args={[0.18, 1.0, 0.18]} />
          </Part>
          <Part id="disc" color={COLORS.steelLight} position={[-0.45, 0, 0]} rotation={[0, 0, Math.PI / 2 + 0.18]}>
            <cylinderGeometry args={[BORE + 0.18, BORE + 0.18, 0.16, 30]} />
          </Part>
        </group>
      </group>
      <Flow open={open} fluid="water" from={-3.0} closed={-0.65} to={3.0} radius={0.42} />
    </group>
  );
}

function DiaphragmModel() {
  const { open, explode: e } = useModel();
  const down = (1 - open) * 0.55;
  return (
    <group>
      <group position={[0, -0.25, 0]}>
        <InlineEnds inner={0.85} half={2.4} ro={1.0} />
      </group>
      {/* bored body (open at top toward the diaphragm chamber) */}
      <Part id="body" color={COLORS.steel} shell geometry={boredBoxX(2.4, 1.3, 1.7, BORE)} position={[0, -0.25, 0]} />
      {/* weir — a raised dam in the channel the diaphragm seals onto */}
      <Part id="weir" color={COLORS.brass} position={[0, -0.5, 0]}>
        <boxGeometry args={[0.5, 0.55, 1.0]} />
      </Part>
      {/* diaphragm membrane (flexes down to seal) */}
      <Part id="diaphragm" color={COLORS.rubber} soft position={[0, 0.32 - down, 0]} scale={[1, 0.5, 1]}>
        <sphereGeometry args={[1.0, 28, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </Part>
      <Part id="bonnet" color={COLORS.steelDark} shell position={[0, 1.4 + e * 1.2, 0]}>
        <cylinderGeometry args={[0.95, 1.15, 1.4, 28]} />
      </Part>
      <Part id="compressor" color={COLORS.steelLight} position={[0, 0.5 - down, 0]}>
        <boxGeometry args={[1.4, 0.35, 1.0]} />
      </Part>
      <Part id="stem" color={COLORS.steelLight} position={[0, 2.0 - down + e * 1.6, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 2.6, 16]} />
      </Part>
      <Part id="handwheel" color={COLORS.red} position={[0, 3.4 + e * 2.0, 0]}>
        <torusGeometry args={[1.0, 0.12, 12, 32]} />
      </Part>
      <Part id="handwheel" color={COLORS.red} position={[0, 3.4 + e * 2.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 2.0, 8]} />
      </Part>
      {/* flow rides over the weir; blocked when the diaphragm is pressed down */}
      <group position={[0, -0.25, 0]}>
        <Flow open={open} fluid="water" from={-3.0} closed={-0.45} to={3.0} radius={0.36} />
      </group>
    </group>
  );
}

function PlugModel() {
  const { open, explode: e } = useModel();
  // OPEN = through-port aligned with flow (rot 0); CLOSED = rotated 90°.
  const rot = (1 - open) * (Math.PI / 2);
  return (
    <group>
      <InlineEnds inner={1.1} half={2.5} ro={1.05} />
      {/* hollow body housing the plug */}
      <Part id="body" color={COLORS.steel} shell geometry={boredCylX(BORE, 1.4, 2.2)} position={[0, 0, 0]} />
      {/* tapered plug + a through-port whose mouths show at the plug surface */}
      <group rotation={[0, rot, 0]}>
        <Part id="plug" color={COLORS.steelLight} metalness={0.65}>
          <cylinderGeometry args={[0.7, 0.95, 2.5, 28]} />
        </Part>
        <Part id="plug" color="#0a0f17" soft rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.47, 0.47, 2.1, 24]} />
        </Part>
      </group>
      <SeatRings x={0.95} explode={e} ri={0.5} ro={0.6} color={COLORS.brass} />
      <group rotation={[0, rot, 0]}>
        <Part id="stem" color={COLORS.steelLight} position={[0, 1.6 + e * 0.9, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 1.2, 16]} />
        </Part>
        <Part id="lever" color={COLORS.red} position={[0.9, 2.3 + e * 1.2, 0]}>
          <boxGeometry args={[2.2, 0.24, 0.45]} />
        </Part>
      </group>
      <Part id="cap" color={COLORS.steelDark} shell position={[0, -1.45 - e * 1.0, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.5, 24]} />
      </Part>
      <Flow open={open} fluid="oil" from={-3.0} closed={-0.95} to={3.0} radius={0.36} />
    </group>
  );
}

function NeedleModel() {
  const { open, explode: e } = useModel();
  const lift = open * 0.85;
  const nb = 0.3; // small bore
  return (
    <group>
      {/* central body block */}
      <Part id="body" color={COLORS.steel} shell position={[0, 0, 0]}>
        <boxGeometry args={[1.4, 1.5, 1.4]} />
      </Part>
      {/* hollow inlet (horizontal) */}
      <Part id="body" color={COLORS.steel} shell geometry={boreTubeX(nb, 0.55, 1.4)} position={[-1.5, 0.1, 0]} />
      <Part id="body" color={COLORS.steelDark} shell geometry={boreTubeX(nb, 0.85, 0.35)} position={[-2.3 - e * 1.2, 0.1, 0]} />
      {/* hollow outlet (down) */}
      <Part id="body" color={COLORS.steel} shell geometry={boreTubeY(nb, 0.55, 1.4)} position={[0, -1.5, 0]} />
      <Part id="body" color={COLORS.steelDark} shell geometry={boreTubeY(nb, 0.85, 0.35)} position={[0, -2.3 - e * 1.2, 0]} />
      {/* seat orifice at the corner */}
      <Part id="seat" color={COLORS.brass} geometry={boreTubeY(nb - 0.08, 0.32, 0.4)} position={[0, -0.5, 0]} />
      <Part id="bonnet" color={COLORS.steelDark} shell position={[0, 1.2 + e * 1.0, 0]}>
        <cylinderGeometry args={[0.6, 0.8, 1.2, 24]} />
      </Part>
      <Part id="packing" color={COLORS.rubber} soft position={[0, 1.7 + e * 1.3, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.4, 16]} />
      </Part>
      {/* fine tapered needle seats into the orifice */}
      <Part id="needle" color={COLORS.steelLight} metalness={0.7} roughness={0.15} position={[0, 0.35 + lift, 0]}>
        <coneGeometry args={[nb - 0.04, 1.8, 20]} />
      </Part>
      <Part id="stem" color={COLORS.steelLight} position={[0, 2.2 + lift + e * 1.5, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 2.0, 16]} />
      </Part>
      <Part id="handwheel" color={COLORS.red} position={[0, 3.4 + lift + e * 1.9, 0]}>
        <cylinderGeometry args={[0.85, 0.85, 0.4, 24]} />
      </Part>
      <Flow open={open} fluid="oil" axis="x" from={-2.2} closed={-0.35} to={0} radius={0.18} count={24} />
      <Flow open={open} fluid="oil" axis="y" from={0} closed={-0.2} to={-2.2} radius={0.18} count={24} />
    </group>
  );
}

function SafetyModel() {
  const { open, explode: e } = useModel();
  const lift = open * 0.7;
  const squeeze = 1 - open * 0.28;
  return (
    <group>
      {/* hollow inlet from below */}
      <Part id="body" color={COLORS.steel} shell geometry={boreTubeY(0.4, 0.95, 1.6)} position={[0, -1.4, 0]} />
      <Part id="body" color={COLORS.steelDark} shell geometry={boreTubeY(0.4, 1.2, 0.4)} position={[0, -2.35 - e * 1.0, 0]} />
      {/* hollow side outlet */}
      <Part id="body" color={COLORS.steel} shell geometry={boreTubeX(0.5, 0.85, 1.8)} position={[1.5, -0.6, 0]} />
      <Part id="body" color={COLORS.steelDark} shell geometry={boreTubeX(0.5, 1.15, 0.4)} position={[2.5 + e * 1.0, -0.6, 0]} />
      {/* nozzle / seat (hollow throat) */}
      <Part id="nozzle" color={COLORS.brass} geometry={boreTubeY(0.38, 0.6, 0.5)} position={[0, -0.55, 0]} />
      {/* central chamber shell (hollow) */}
      <Part id="body" color={COLORS.steel} shell geometry={hollowSphere(1.0, 0.75)} position={[0, 0.0, 0]} />
      {/* disc lifts on overpressure to relieve */}
      <Part id="disc" color={COLORS.steelLight} position={[0, -0.18 + lift, 0]}>
        <cylinderGeometry args={[0.62, 0.62, 0.22, 24]} />
      </Part>
      <Part id="bonnet" color={COLORS.steelDark} shell position={[0, 1.9 + e * 1.4, 0]}>
        <cylinderGeometry args={[0.85, 1.0, 2.4, 28]} />
      </Part>
      <Spring y={1.15 + lift} squeeze={squeeze} explode={e} />
      <Part id="adjuster" color={COLORS.steelLight} position={[0, 3.4 + e * 2.0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.9, 16]} />
      </Part>
      <Part id="adjuster" color={COLORS.red} position={[0, 3.95 + e * 2.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 1.1, 8]} />
      </Part>
      {/* relief flow: up through the nozzle, only when lifted */}
      <Flow open={open} fluid="steam" axis="y" from={-2.2} closed={-0.7} to={0.4} radius={0.3} count={30} />
      <Flow open={open} fluid="steam" axis="x" from={0.4} closed={0.6} to={2.6} radius={0.34} count={20} />
    </group>
  );
}

function Spring({ y, squeeze, explode }: { y: number; squeeze: number; explode: number }) {
  const coils = 6;
  return (
    <group position={[0, y + explode * 1.0, 0]}>
      {Array.from({ length: coils }, (_, i) => (
        <Part
          key={i}
          id="spring"
          color={COLORS.spring}
          metalness={0.7}
          roughness={0.25}
          position={[0, (i - (coils - 1) / 2) * 0.28 * squeeze, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[0.5, 0.07, 8, 24]} />
        </Part>
      ))}
    </group>
  );
}

function AirModel() {
  const { open, explode: e } = useModel();
  const floatY = -0.4 - open * 0.9;
  return (
    <group>
      {/* hollow chamber — float is visible inside without x-ray */}
      <Part id="body" color={COLORS.steel} shell geometry={hollowCylY(1.0, 1.12, 3.0)} position={[0, 0, 0]} />
      {/* hollow inlet from below */}
      <Part id="body" color={COLORS.steelDark} shell geometry={boreTubeY(0.45, 0.7, 0.8)} position={[0, -1.8 - e * 0.8, 0]} />
      <Part id="body" color={COLORS.steelDark} shell geometry={boreTubeY(0.45, 1.0, 0.35)} position={[0, -2.3 - e * 1.0, 0]} />
      {/* cover with the discharge orifice */}
      <Part id="cap" color={COLORS.steelDark} shell geometry={boreTubeY(0.16, 1.12, 0.7)} position={[0, 1.75 + e * 1.2, 0]} />
      <Part id="orifice" color={COLORS.steelLight} geometry={boreTubeY(0.13, 0.22, 0.7)} position={[0, 2.35 + e * 1.6, 0]} />
      <Part id="seat" color={COLORS.rubber} soft position={[0, 1.45 + e * 1.0, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.16, 16]} />
      </Part>
      {/* float ball rides the water level */}
      <Part id="float" color={COLORS.ptfe} metalness={0.3} roughness={0.4} position={[0, floatY, 0]}>
        <sphereGeometry args={[0.7, 28, 22]} />
      </Part>
      <Flow open={open} fluid="air" axis="y" from={floatY + 0.7} closed={floatY + 0.8} to={2.6} radius={0.18} count={26} />
      <Flow open={1 - open} fluid="water" axis="y" from={-2.2} closed={floatY} to={floatY} radius={0.55} count={22} />
    </group>
  );
}

/* ---- extra cached geometries used by specific models ---- */

/** Sphere with a cylindrical bore drilled through along X (ball / plug port). */
function boredBallX(r: number, bore: number): THREE.BufferGeometry {
  return cached(`ball:${r},${bore}`, () => {
    // approximate with a lathe profile: a sphere arc capped to leave a bore hole on each pole
    const seg = 28;
    const pts: THREE.Vector2[] = [];
    const aMin = Math.asin(Math.min(0.99, bore / r));
    for (let i = 0; i <= seg; i++) {
      const a = aMin + (Math.PI - 2 * aMin) * (i / seg) - Math.PI / 2;
      pts.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r));
    }
    // inner bore wall back down
    pts.push(new THREE.Vector2(bore, Math.cos(aMin) * 0 + Math.sqrt(Math.max(0, r * r - bore * bore))));
    pts.push(new THREE.Vector2(bore, -Math.sqrt(Math.max(0, r * r - bore * bore))));
    const g = new THREE.LatheGeometry(pts, 36);
    g.rotateZ(Math.PI / 2); // bore axis Y -> X
    return g;
  });
}

/** Hollow sphere shell (globe / safety chamber) — open enough to see inside. */
function hollowSphere(ro: number, ri: number): THREE.BufferGeometry {
  return cached(`hsph:${ro},${ri}`, () => {
    const g = new THREE.SphereGeometry(ro, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.62);
    g.rotateX(Math.PI); // open the bottom toward the flow path
    return g;
  });
}

/** Thin-wall vertical chamber (open top + bottom) you can see into. */
function hollowCylY(ri: number, ro: number, len: number): THREE.BufferGeometry {
  return boreTubeY(ri, ro, len);
}

/* ------------------------------------------------------------------ *
 * Dispatcher
 * ------------------------------------------------------------------ */

const RENDERERS: Record<ModelKind, React.FC> = {
  gate: GateModel,
  globe: GlobeModel,
  ball: BallModel,
  butterfly: ButterflyModel,
  check: CheckModel,
  diaphragm: DiaphragmModel,
  plug: PlugModel,
  needle: NeedleModel,
  safety: SafetyModel,
  air: AirModel,
};

export interface ValveModelProps {
  kind: ModelKind;
  open: number;
  explode: number;
  crossSection: boolean;
  transparency: boolean;
  flow: boolean;
  selected: string | null;
  onSelect: (id: string | null) => void;
}

export function ValveModel({
  kind,
  open,
  explode,
  crossSection,
  transparency,
  flow,
  selected,
  onSelect,
}: ValveModelProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const clipPlanes = useMemo(() => [new THREE.Plane(new THREE.Vector3(0, 0, -1), 0)], []);

  const ctx: ModelCtx = {
    open,
    explode,
    crossSection,
    transparency,
    flow,
    active: hovered ?? selected,
    setSelected: onSelect,
    setHovered,
    clipPlanes,
  };

  const Renderer = RENDERERS[kind] ?? GateModel;

  return (
    <Ctx.Provider value={ctx}>
      <group onPointerMissed={() => onSelect(null)}>
        <Renderer />
      </group>
    </Ctx.Provider>
  );
}
