# Content Guidelines & Pedagogical Standards

To maintain the hub's credibility as a premier education resource, all content must be structured to balance mechanical rigor with intuitive visuals.

---

## 1. Tone & Style

- **Academic yet Accessible:** Avoid marketing speak or commercial sales descriptions. Explain "why" components wear out (e.g., "Seat erosion due to localized high-velocity cavitation bubbles") instead of generic advice ("keep seats clean").
- **Precision Terminology:** Use standardized international engineering terms. Prefer "Stuffing Box" over "stem wrap", "Disc" over "gate stopper", and "Closure Member" when speaking universally.

---

## 2. Curriculum Module Structure

Every lesson file inside `src/app/learn/` must contain:

1. **Quick Fact Box:** Estimated duration, mechanical prerequisite concepts, and learning objectives.
2. **The Mechanism:** An explanation of physical movement (e.g., multi-turn rotation converting to linear stem drop).
3. **Fluid Dynamics Corner:** Detail flow directions, pressure profiles, and potential vulnerabilities (flashing, erosion, throttling behaviors).
4. **Calculations Section (Where Applicable):** Simple formula step-through (e.g., flow coefficient equations).
5. **Interactive Check:** 3-question conceptual check with custom feedback logic explaining incorrect selections.

---

## 3. Mathematical Formatting Standards

All formulas must utilize standard LaTeX formatting to display perfectly across browsers. For example:

- **Flow Coefficient (Liquid):**
  $$C_v = q \sqrt{\frac{SG}{\Delta P}}$$
  Where $q$ is flow rate in GPM, $SG$ is specific gravity, and $\Delta P$ is pressure drop in PSI.

- **Pressure Recovery Factor ($F_L$):**
  $$F_L = \sqrt{\frac{P_1 - P_2}{P_1 - P_v}}$$
  Used to determine susceptibility to cavitation.
