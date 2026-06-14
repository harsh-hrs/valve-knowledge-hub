# UI Design System: Visual Identity & Tokens

The Valve Knowledge Hub must feel like a premium, state-of-the-art engineering interface. This system uses dark-mode defaults, high-contrast engineering accents, and glassmorphic layouts to create a clean visual aesthetic.

---

## 1. Color Palette

We utilize standard CSS variables to enforce design consistency:

```css
:root {
  /* Core Brand Gradients */
  --bg-primary: #0a0e17;      /* Deep midnight blue */
  --bg-secondary: #121824;    /* Slate blue dark card background */
  
  /* Accent States representing engineering flow states */
  --accent-cyan: #06b6d4;     /* Laminar Flow / Low Velocity */
  --accent-amber: #f59e0b;    /* Turbulent Flow / Throttling */
  --accent-red: #ef4444;      /* Cavitation Risk / High Pressure Drop */
  
  /* Text Priorities */
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  
  /* Premium Glassmorphism */
  --glass-bg: rgba(18, 24, 36, 0.7);
  --glass-border: rgba(255, 255, 255, 0.08);
}
```

---

## 2. Typography

We pull fonts from Google Fonts:
- **Display & Interface:** `Inter` or `Outfit` for high-readability clean sans-serif layouts.
- **Monospace/Mathematical:** `Fira Code` or standard monospace fonts for calculators, LaTeX math variables, and fluid formulas.

---

## 3. Premium UI Patterns

### Glassmorphism Panel
```css
.engineering-panel {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}
```

### Flow Level Indicators
Use gradient transitions to color flow indicators:
- **Low Velocity ($< 2 \text{ m/s}$):** Cyan glow effect.
- **Medium Velocity ($2\text{--}5 \text{ m/s}$):** Amber caution glow.
- **High Velocity / Vapor Pressure Limits:** Red pulsing glow representing cavitation hazard zones.
