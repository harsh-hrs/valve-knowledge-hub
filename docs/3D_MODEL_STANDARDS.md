# 3D Model Standards & Assets Pipeline

To maintain high visual fidelity alongside instant loading times across both mobile and desktop screens, all 3D assets must adhere to these mechanical modeling guidelines.

---

## 1. Mesh Topology & Polycounts

- **Universal Polycount Budget:** Keep a single valve assembly model under **50,000 polygons (triangles)**.
- **Geometries:** Avoid complex CAD thread details on stems or bolts. Represent threaded stems through normal/bump mapping instead of high-polygon geometries.
- **Exploded View Hierarchy:** Model every component (Stem, Disc, Ball, Handwheel) as a separate mesh under a single parent group to allow translational displacement along coordinates ($X, Y, Z$).

---

## 2. Textures & Materials

- **Material Configurations:** Use standard Physical Material (PBR) workflows to represent structural properties:
  - **Cast Iron / Carbon Steel Body:** Rough metal texture (Roughness: `0.6`, Metalness: `0.8`).
  - **Stainless Steel Stem / Disc:** High metallic sheen (Roughness: `0.1`, Metalness: `1.0`).
  - **PTFE Seals / Gaskets:** Smooth plastic appearance (Roughness: `0.4`, Metalness: `0.0`).
  - **Liquid/Water Volume:** Semi-transparent material using refraction indices.
- **Texture Resolutions:** Standardize on **1024x1024 px** PNG/WebP maps (limit normal/roughness textures to 1K resolution to save memory).

---

## 3. Format & Optimization Pipelines

All models must be exported as **GLB/GLTF** format and optimized using command-line compression utilities before being committed to production assets:

```bash
# Process model through gltf-pipeline for Draco compression
npx gltf-pipeline -i input.gltf -o public/models/valve-assembly.glb -d
```

Ensure all pivot points (origins) are centered exactly at the rotation or translational center of the valve core assembly (e.g., center of the ball rotation for a ball valve).
