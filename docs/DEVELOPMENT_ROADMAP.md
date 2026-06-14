# Project Development Roadmap

This roadmap breaks down the development of the Valve Knowledge Hub into five structured, trackable engineering phases.

---

## Phase 1: Database Setup & Curricular Foundation

- [ ] Initialize Next.js project with Tailwind CSS & custom design variable variables.
- [ ] Connect Prisma client to database instance.
- [ ] Write seed scripts introducing standard valve models (Ball, Gate, Globe) and basic definitions.
- [ ] Set up lesson markdown rendering layout pages.

---

## Phase 2: Core 3D Viewport & Asset Loader

- [ ] Set up Canvas wrapper component using React Three Fiber.
- [ ] Implement asset loading indicator UI.
- [ ] Add base interactive camera controls (OrbitControls, panning limits).
- [ ] Set up component highlights: Change material emissive glow on cursor hover over specific valve parts (e.g. Stem, Packing Gland).

---

## Phase 3: Shaders & Fluid Simulation Dynamics

- [ ] Write custom fragment shader simulating moving liquid flow vectors.
- [ ] Link shader velocity uniforms to a progress slider representing percentage of valve open state.
- [ ] Implement color gradient maps (Cyan for low-velocity laminar flow, Amber/Red for high-velocity turbulent throttling).
- [ ] Create exploded-view translation animations triggered by UI toggle buttons.

---

## Phase 4: Engineering Calculations & Interactive Tools

- [ ] Code flow coefficient formulas ($C_v/K_v$) for liquid, gas, and steam applications.
- [ ] Integrate Chart.js or Recharts to map pressure drop curves dynamically based on calculator inputs.
- [ ] Design and code interactive material chemical compatibility table filters.

---

## Phase 5: Production Optimization & SEO Tuning

- [ ] Optimize 3D assets using Draco compression pipelines.
- [ ] Run audits on WebGL component unmount processes to verify complete GPU garbage collection.
- [ ] Configure dynamic meta-tags and JSON-LD structural markup for engineering lessons.
