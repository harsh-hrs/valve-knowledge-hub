# Valve Hierarchy & Mechanical Classification

To ensure an academically rigorous engineering curriculum, the Valve Knowledge Hub classifies all valves into three major functional categories based on closure member movement.

---

## 1. Linear Motion Valves

Linear valves utilize a closure member (disc, gate, diaphragm) that moves in a straight line to allow, restrict, or shut off flow.

```text
Linear Valves
├── Gate Valve (Isolation)
│   ├── Solid Wedge
│   └── Parallel Slide
├── Globe Valve (Regulation/Throttling)
│   └── Plug, Composition, or Needle Disc
├── Diaphragm Valve (Sanitary/Slurry)
│   └── Weir type or Straight-through type
└── Pinch Valve (Corrosive/Abrasive)
```

### Exploded View Subcomponent Requirements
Every 3D linear valve model must separate out:
1. **Actuator/Handwheel:** Mechanical input interface.
2. **Stem:** Power transfer link (threaded vs smooth).
3. **Gland Packing / Stuffing Box:** Mechanical seal assembly preventing fluid escape.
4. **Bonnet:** Cover assembly housing the stem threads.
5. **Body:** Pressure vessel containing the internal passages.
6. **Disc/Gate/Wedge:** Closure element.
7. **Seats:** Sealing rings contacting the disc.

---

## 2. Rotary Motion Valves

Rotary valves utilize a closure member (ball, disc, plug) that rotates 90 degrees (quarter-turn) to open or close the path.

```text
Rotary Valves
├── Ball Valve (Isolation/Quick acting)
│   ├── Floating Ball vs Trunnion-mounted
│   └── Porting: Full Bore, Reduced Bore, V-Port (for throttling)
├── Butterfly Valve (Isolation/Throttling)
│   ├── Concentric (Resilient-seated)
│   └── Eccentric (Double Offset / Triple Offset)
└── Plug Valve (Slurry/Isolation)
    └── Lubricated vs Non-lubricated
```

### Exploded View Subcomponent Requirements
1. **Lever/Gear Box:** Mechanical leverage inputs.
2. **Trunnion/Stem:** Rotational axes.
3. **Ball/Disc/Plug:** Obstructing body.
4. **Resilient/Metal Seats:** Precision-profiled seals.

---

## 3. Self-Actuated / Non-Return Valves

These valves operate purely on fluid dynamics, pressure differences, or internal mechanical force balances rather than external handles/actuators.

```text
Self-Actuated Valves
├── Check Valve (Backflow prevention)
│   ├── Swing Check
│   └── Lift Check / Piston Check
└── Pressure Relief Valve (Safety)
    └── Spring-loaded vs Pilot-operated
```
