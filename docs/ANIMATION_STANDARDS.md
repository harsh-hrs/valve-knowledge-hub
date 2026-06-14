# Animation Standards & Interactive Controls

Animations in the Valve Knowledge Hub are functional, pedagogical aids designed to link user interactive movements directly with internal flow dynamics.

---

## 1. Mechanical Component Timelines

When simulating a valve opening/closing sequence:
- **Linear Actions (Gate, Globe):** Coordinate stem displacement with disc position using a linear or soft-ease curves (`power1.inOut` inside GSAP).
- **Rotary Actions (Ball, Butterfly):** Use precise rotational angles from 0 to 90 degrees ($\frac{\pi}{2}$ radians).
- **Synchronization:** The fluid dynamics flow rate must map directly to the percentage of valve opening.

```javascript
// Synchronized control sequence template
gsap.to(stemRef.current.position, {
  y: targetYPosition,
  duration: 1.5,
  ease: "power2.out",
  onUpdate: () => {
    // Dynamically update the shader flow intensity property
    const pct = getOpeningPercentage(stemRef.current.position.y);
    flowShaderMaterial.uniforms.uVelocity.value = pct * maxVelocity;
  }
});
```

---

## 2. Fluid Flow Vector Shaders

To visualize fluid flowing inside 3D models:
- **Velocity Representation:** Animate texture coordinates ($UV$) moving through a custom fragment shader, scaling coordinate speed relative to pressure/opening values.
- **Color Mapping:** Use color gradients mapping cyan (low velocity) to red (high velocity/throttling sections).
- **Vortices / Cavitation:** At throttling points (e.g., globe valve plug gaps), render turbulent flow path perturbations using noise algorithms inside the shader.

---

## 3. Page Micro-Interactions

Keep interface responses crisp:
- **Hover Transitions:** 200ms ease-out scales for interactive buttons and navigation tabs.
- **Card Expands:** Use Framer Motion layout animations with custom spring stiffness configurations:
  ```typescript
  const spring = { type: "spring", stiffness: 300, damping: 30 };
  ```
