'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PlaceholderValveProps {
  explode: number; // 0 to 1
  crossSection: boolean;
  transparency: boolean;
  activeComponent: string | null;
  onHoverComponent: (id: string | null) => void;
  onClickComponent: (id: string) => void;
}

export function PlaceholderValve({
  explode,
  crossSection,
  transparency,
  activeComponent,
  onHoverComponent,
  onClickComponent
}: PlaceholderValveProps) {
  
  // Custom clipping planes for Cross Section View
  const clipPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));

  // Determine material attributes based on highlights and transparency
  const getMaterialProps = (componentId: string, baseColor: string) => {
    const isHighlighted = activeComponent === componentId;
    const opacityVal = transparency && componentId === 'body' ? 0.25 : 1.0;
    
    return {
      color: isHighlighted ? '#06b6d4' : baseColor,
      emissive: isHighlighted ? '#06b6d4' : '#000000',
      emissiveIntensity: isHighlighted ? 0.4 : 0,
      transparent: opacityVal < 1.0,
      opacity: opacityVal,
      roughness: 0.2,
      metalness: 0.8,
      clippingPlanes: crossSection ? [clipPlane.current] : []
    };
  };

  return (
    <group>
      {/* 1. Valve Body - Slits into half for cross section if clipping is active */}
      <mesh
        onPointerOver={(e) => { e.stopPropagation(); onHoverComponent('body'); }}
        onPointerOut={() => onHoverComponent(null)}
        onClick={(e) => { e.stopPropagation(); onClickComponent('body'); }}
        position={[0, 0, 0]}
      >
        <cylinderGeometry args={[2.5, 2.5, 4, 32]} />
        <meshStandardMaterial {...getMaterialProps('body', '#334155')} />
      </mesh>

      {/* Piping Flanges (Body extensions) */}
      <mesh position={[-3 - explode * 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[2, 2, 2, 16]} />
        <meshStandardMaterial {...getMaterialProps('body', '#334155')} />
      </mesh>
      <mesh position={[3 + explode * 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[2, 2, 2, 16]} />
        <meshStandardMaterial {...getMaterialProps('body', '#334155')} />
      </mesh>

      {/* 2. Valve Bonnet - Translates upward on Y-axis for exploded view */}
      <mesh
        onPointerOver={(e) => { e.stopPropagation(); onHoverComponent('bonnet'); }}
        onPointerOut={() => onHoverComponent(null)}
        onClick={(e) => { e.stopPropagation(); onClickComponent('bonnet'); }}
        position={[0, 3 + explode * 3, 0]}
      >
        <cylinderGeometry args={[1.8, 2.2, 2, 32]} />
        <meshStandardMaterial {...getMaterialProps('bonnet', '#475569')} />
      </mesh>

      {/* 3. Valve Stem - Moves further up for exploded view */}
      <mesh
        onPointerOver={(e) => { e.stopPropagation(); onHoverComponent('stem'); }}
        onPointerOut={() => onHoverComponent(null)}
        onClick={(e) => { e.stopPropagation(); onClickComponent('stem'); }}
        position={[0, 5 + explode * 5, 0]}
      >
        <cylinderGeometry args={[0.3, 0.3, 5, 16]} />
        <meshStandardMaterial {...getMaterialProps('stem', '#94a3b8')} />
      </mesh>

      {/* Handwheel */}
      <mesh position={[0, 7.5 + explode * 6, 0]}>
        <torusGeometry args={[1.5, 0.2, 8, 24]} />
        <meshStandardMaterial {...getMaterialProps('stem', '#ef4444')} />
      </mesh>

      {/* 4. Wedge / Gate - Linear sliding component */}
      <mesh
        onPointerOver={(e) => { e.stopPropagation(); onHoverComponent('gate'); }}
        onPointerOut={() => onHoverComponent(null)}
        onClick={(e) => { e.stopPropagation(); onClickComponent('gate'); }}
        position={[0, explode * 2, 0]}
      >
        <boxGeometry args={[1.2, 2.4, 0.4]} />
        <meshStandardMaterial {...getMaterialProps('gate', '#64748b')} />
      </mesh>

      {/* 5. Seat Rings - Displaces along X-axis for exploded view */}
      <mesh
        onPointerOver={(e) => { e.stopPropagation(); onHoverComponent('seat'); }}
        onPointerOut={() => onHoverComponent(null)}
        onClick={(e) => { e.stopPropagation(); onClickComponent('seat'); }}
        position={[-1.2 - explode * 1.5, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <torusGeometry args={[1.1, 0.15, 8, 16]} />
        <meshStandardMaterial {...getMaterialProps('seat', '#f59e0b')} />
      </mesh>
      <mesh
        onPointerOver={(e) => { e.stopPropagation(); onHoverComponent('seat'); }}
        onPointerOut={() => onHoverComponent(null)}
        onClick={(e) => { e.stopPropagation(); onClickComponent('seat'); }}
        position={[1.2 + explode * 1.5, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <torusGeometry args={[1.1, 0.15, 8, 16]} />
        <meshStandardMaterial {...getMaterialProps('seat', '#f59e0b')} />
      </mesh>
    </group>
  );
}
