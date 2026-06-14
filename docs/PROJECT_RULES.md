# Project Rules & Development Standards

This document establishes the code quality rules, engineering standards, file naming conventions, and programming paradigms to be strictly followed in the Valve Knowledge Hub.

---

## 1. Programming Languages & Frameworks

- **Frontend:** React 18+ inside Next.js 14+ (App Router structure).
- **TypeScript:** Strict type checks enabled (`strict: true`). Avoid using `any` type overrides at all costs; specify proper component props and WebGL event definitions.
- **Styling:** CSS variables defined globally in `globals.css` with Tailwind CSS classes representing layout scaffolding. Use vanilla CSS inline styles only for real-time reactive properties (e.g., matching a CSS custom property to a 3D animation timeline position).

---

## 2. File & Component Naming Conventions

### File Directories & Structure
- **Pages/Routes:** Always lowercase directories using Next.js app router patterns (e.g. `app/explore/page.tsx`).
- **Components:** PascalCase for React components (e.g. `src/components/3d/ModelViewer.tsx`).
- **Styles:** lowercase kebab-case (e.g. `src/styles/design-system.css`).

### TypeScript / Coding Standards
- Export React components using named exports:
  ```typescript
  export function ValveModelViewer() { ... }
  ```
- Component files must house only a single major component, with small subcomponents kept inside the same file if local, or moved to a shared component subdirectory if reused.

---

## 3. WebGL & R3F Performance Rules

- **Resource Disposal:** Ensure all loaded geometries, textures, and custom shader materials are properly disposed of on component unmount to prevent GPU memory leaks.
- **Asset Loading:** Always utilize Three's `<Suspense>` wrapper alongside preloaded loader helpers:
  ```typescript
  useGLTF.preload('/models/ball-valve.glb')
  ```
- **Frame Rate Optimization:** Avoid triggering React state updates on frame loops (`useFrame`). Instead, mutate references (`useRef`) to achieve 60fps animations.
