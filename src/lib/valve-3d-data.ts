// Per-valve 3D metadata. The `id` of every component here matches a selectable
// part id inside the corresponding 3D model in components/3d/ValveModels.tsx.
// This single source of truth drives the 3D highlighting AND the explore panel.

export type ModelKind =
  | 'gate'
  | 'globe'
  | 'ball'
  | 'butterfly'
  | 'check'
  | 'diaphragm'
  | 'plug'
  | 'needle'
  | 'safety'
  | 'air';

export type FluidKind = 'water' | 'air' | 'steam' | 'oil';

export interface Valve3DComponent {
  id: string;
  name: string;
  category: string;
  description: string;
  function: string;
  materials: string[];
}

export interface Valve3DConfig {
  id: string;
  name: string;
  kind: ModelKind;
  /** Short tagline shown under the model. */
  motion: string;
  fluid: FluidKind;
  /** 'inline' = horizontal bore, 'vertical' = bottom-to-top, 'angle' = bottom-to-side. */
  flowPath: 'inline' | 'vertical' | 'angle';
  /** Label for the open/close slider, e.g. "Lift", "Rotation", "Swing". */
  actuationLabel: string;
  /** Ordered assembly groups for the explore tree. */
  groups: { label: string; components: string[] }[];
  components: Record<string, Valve3DComponent>;
}

// Reusable component fragments shared across many valve types.
const BODY = (extra?: Partial<Valve3DComponent>): Valve3DComponent => ({
  id: 'body',
  name: 'Valve Body',
  category: 'Primary Pressure Shell',
  description:
    'The body is the primary pressure boundary containing the internal flow passage and connecting to the pipeline.',
  function:
    'Directs fluid through the ports, houses the seats, and anchors the end connections (flanged, welded or threaded).',
  materials: ['ASTM A216 WCB (Carbon Steel)', 'ASTM A351 CF8M (316 SS)', 'Ductile Iron'],
  ...extra,
});

const BONNET: Valve3DComponent = {
  id: 'bonnet',
  name: 'Bonnet',
  category: 'Pressure Retaining Cover',
  description:
    'The bonnet covers the opening in the body and forms the second most critical pressure boundary.',
  function: 'Retains system pressure, houses the stem packing chamber, and guides stem travel.',
  materials: ['ASTM A216 WCB', 'ASTM A351 CF8M', 'Forged ASTM A105'],
};

const STEM: Valve3DComponent = {
  id: 'stem',
  name: 'Stem',
  category: 'Motion Linkage',
  description: 'The rod transmitting thrust or torque from the actuator to the closure member.',
  function: 'Converts actuator input into closure-member motion while passing through the packing seals.',
  materials: ['SS410', 'SS316', '17-4PH Stainless'],
};

const PACKING: Valve3DComponent = {
  id: 'packing',
  name: 'Stem Packing',
  category: 'Sealing Interface',
  description: 'Compressed rings around the stem inside the stuffing box that block fugitive leakage.',
  function: 'Seals the dynamic stem penetration to prevent process fluid escaping to atmosphere.',
  materials: ['Flexible Graphite', 'PTFE V-Rings', 'Carbon Fibre Braid'],
};

const SEAT: Valve3DComponent = {
  id: 'seat',
  name: 'Seat Rings',
  category: 'Sealing Interface',
  description: 'The matching sealing surfaces the closure member contacts to shut off flow.',
  function: 'Provides metal-to-metal or soft sealing to stop downstream leakage when closed.',
  materials: ['Stellite 6 Hardfacing', 'PTFE', 'PEEK', 'SS316'],
};

const HANDWHEEL: Valve3DComponent = {
  id: 'handwheel',
  name: 'Handwheel',
  category: 'Manual Actuator',
  description: 'The wheel that the operator turns to drive the stem threads.',
  function: 'Provides mechanical advantage to convert hand torque into stem thrust.',
  materials: ['Ductile Iron', 'Carbon Steel', 'Aluminium'],
};

export const VALVE_3D: Record<string, Valve3DConfig> = {
  'gate-valve-wedge': {
    id: 'gate-valve-wedge',
    name: 'Wedge Gate Valve',
    kind: 'gate',
    motion: 'Linear rising stem · on/off isolation',
    fluid: 'water',
    flowPath: 'inline',
    actuationLabel: 'Gate Lift',
    groups: [
      { label: 'Pressure Boundary', components: ['body', 'bonnet'] },
      { label: 'Actuation', components: ['handwheel', 'stem', 'packing'] },
      { label: 'Internals', components: ['wedge', 'seat'] },
    ],
    components: {
      body: BODY(),
      bonnet: BONNET,
      handwheel: HANDWHEEL,
      stem: STEM,
      packing: PACKING,
      seat: { ...SEAT, description: 'Tapered body seat rings that match the wedge angle to establish the seal.' },
      wedge: {
        id: 'wedge',
        name: 'Wedge Gate',
        category: 'Linear Closure Member',
        description: 'A tapered sliding closure that lowers perpendicular to flow for absolute isolation.',
        function: 'Slides into matching tapered seats; mechanical wedging compresses the metal seal faces.',
        materials: ['ASTM A216 WCB + 13% Cr', 'Solid CF8M'],
      },
    },
  },

  'globe-valve-standard': {
    id: 'globe-valve-standard',
    name: 'Standard Globe Valve',
    kind: 'globe',
    motion: 'Linear plug · precise throttling',
    fluid: 'steam',
    flowPath: 'inline',
    actuationLabel: 'Plug Lift',
    groups: [
      { label: 'Pressure Boundary', components: ['body', 'bonnet'] },
      { label: 'Actuation', components: ['handwheel', 'stem', 'packing'] },
      { label: 'Internals', components: ['plug', 'seat'] },
    ],
    components: {
      body: BODY({
        description:
          'A spherical body with a Z-shaped internal path. The fluid changes direction twice across a central seat.',
      }),
      bonnet: BONNET,
      handwheel: HANDWHEEL,
      stem: STEM,
      packing: PACKING,
      seat: { ...SEAT, description: 'The stationary orifice ring the plug throttles against.' },
      plug: {
        id: 'plug',
        name: 'Contoured Plug',
        category: 'Linear Regulating Member',
        description: 'A profiled plug that varies the annular flow area for fine control.',
        function: 'Moves linearly into the seat ring; plug-to-seat distance sets the flow rate.',
        materials: ['F316 + Stellite Overlay', 'CF8M'],
      },
    },
  },

  'ball-valve-floating': {
    id: 'ball-valve-floating',
    name: 'Floating Ball Valve',
    kind: 'ball',
    motion: 'Quarter-turn rotary · fast shutoff',
    fluid: 'oil',
    flowPath: 'inline',
    actuationLabel: 'Rotation',
    groups: [
      { label: 'Pressure Boundary', components: ['body'] },
      { label: 'Actuation', components: ['lever', 'stem', 'packing'] },
      { label: 'Internals', components: ['ball', 'seat'] },
    ],
    components: {
      body: BODY({ description: 'A two- or three-piece body cradling the ball between soft seats.' }),
      lever: {
        id: 'lever',
        name: 'Lever Handle',
        category: 'Manual Actuator',
        description: 'A flat handle giving a clear visual indication of open/closed in a 90° sweep.',
        function: 'Rotates the stem a quarter-turn; aligned with the pipe means open.',
        materials: ['Coated Carbon Steel', 'Stainless Steel'],
      },
      stem: { ...STEM, description: 'A blow-out proof stem with an internal shoulder that rotates the ball.' },
      packing: PACKING,
      seat: {
        ...SEAT,
        name: 'Soft Seats',
        description: 'Polymer rings that cradle the ball and seal as upstream pressure floats it downstream.',
        materials: ['PTFE', 'RPTFE', 'PEEK'],
      },
      ball: {
        id: 'ball',
        name: 'Floating Ball',
        category: 'Rotary Closure Member',
        description: 'A bored sphere that aligns with the bore to open, or rotates 90° to block flow.',
        function: 'Floats downstream under line pressure to compress the soft seat for a bubble-tight seal.',
        materials: ['CF8M', 'Carbon Steel + ENP'],
      },
    },
  },

  'butterfly-valve-triple-offset': {
    id: 'butterfly-valve-triple-offset',
    name: 'Triple Offset Butterfly Valve',
    kind: 'butterfly',
    motion: 'Quarter-turn rotary · frictionless cam seal',
    fluid: 'steam',
    flowPath: 'inline',
    actuationLabel: 'Rotation',
    groups: [
      { label: 'Pressure Boundary', components: ['body'] },
      { label: 'Actuation', components: ['actuator', 'stem', 'packing'] },
      { label: 'Internals', components: ['disc', 'seat'] },
    ],
    components: {
      body: BODY({ description: 'A compact wafer/lug body that clamps between pipe flanges.' }),
      actuator: {
        id: 'actuator',
        name: 'Gear Actuator',
        category: 'Actuator',
        description: 'A worm-gear or pneumatic actuator providing high torque for the offset cam action.',
        function: 'Rotates the shaft 90°, camming the disc clear of the seat then back into it.',
        materials: ['Cast Iron Housing', 'Alloy Steel Gearset'],
      },
      stem: { ...STEM, name: 'Offset Shaft', description: 'The shaft, offset from bore and seal plane, that cams the disc.' },
      packing: PACKING,
      seat: {
        ...SEAT,
        name: 'Laminated Seat',
        description: 'A solid metal seat matched by a laminated seal ring on the disc for fire-safe shutoff.',
        materials: ['Stellite 6 on body', 'SS316 / Graphite laminate'],
      },
      disc: {
        id: 'disc',
        name: 'Offset Disc',
        category: 'Rotary Closure Member',
        description: 'An eccentric disc whose three offsets lift it free of the seat until final closure.',
        function: 'Rotates with a camming motion so it only touches the seat at the last few degrees — no friction.',
        materials: ['CF8M', 'Carbon Steel + Stellite'],
      },
    },
  },

  'check-valve-swing': {
    id: 'check-valve-swing',
    name: 'Swing Check Valve',
    kind: 'check',
    motion: 'Self-acting hinged flap · backflow stop',
    fluid: 'water',
    flowPath: 'inline',
    actuationLabel: 'Disc Swing',
    groups: [
      { label: 'Pressure Boundary', components: ['body', 'cap'] },
      { label: 'Internals', components: ['disc', 'hinge', 'seat'] },
    ],
    components: {
      body: BODY({ description: 'A through-body with a seat angled so the disc rests shut under gravity.' }),
      cap: {
        id: 'cap',
        name: 'Bonnet Cap',
        category: 'Pressure Cover',
        description: 'A bolted cover giving access to the disc and hinge for maintenance.',
        function: 'Seals the top opening and supports the hinge pin bosses.',
        materials: ['ASTM A216 WCB', 'CF8M'],
      },
      hinge: {
        id: 'hinge',
        name: 'Hinge Pin & Arm',
        category: 'Motion Linkage',
        description: 'The pivot from which the disc swings open and closed.',
        function: 'Lets the disc lift on forward flow and fall back onto the seat on reversal.',
        materials: ['SS410', 'SS316'],
      },
      seat: { ...SEAT, description: 'The seating face the clapper drops onto to block reverse flow.' },
      disc: {
        id: 'disc',
        name: 'Disc (Clapper)',
        category: 'Self-Acting Closure',
        description: 'A pivoting flap that opens with forward flow and slams shut on reversal.',
        function: 'Forward flow lifts it off the seat; gravity and back-pressure swing it shut — no operator needed.',
        materials: ['ASTM A216 WCB', 'CF8M'],
      },
    },
  },

  'diaphragm-valve': {
    id: 'diaphragm-valve',
    name: 'Weir Diaphragm Valve',
    kind: 'diaphragm',
    motion: 'Linear compressor · flexible seal',
    fluid: 'water',
    flowPath: 'inline',
    actuationLabel: 'Compressor',
    groups: [
      { label: 'Pressure Boundary', components: ['body', 'bonnet'] },
      { label: 'Actuation', components: ['handwheel', 'stem', 'compressor'] },
      { label: 'Sealing', components: ['diaphragm', 'weir'] },
    ],
    components: {
      body: BODY({
        description: 'A lined body with a raised weir; the wetted path is fully isolated from the working parts.',
        materials: ['Cast Iron + Rubber Lining', 'PFA-Lined Steel', 'CF8M'],
      }),
      bonnet: BONNET,
      handwheel: HANDWHEEL,
      stem: { ...STEM, description: 'A non-wetted stem that drives the compressor down onto the diaphragm.' },
      compressor: {
        id: 'compressor',
        name: 'Compressor',
        category: 'Force Distributor',
        description: 'A saddle that spreads stem thrust evenly across the diaphragm back.',
        function: 'Presses the diaphragm down onto the weir to throttle or shut off flow.',
        materials: ['Aluminium', 'Ductile Iron'],
      },
      diaphragm: {
        id: 'diaphragm',
        name: 'Flexible Diaphragm',
        category: 'Closure & Seal',
        description: 'An elastomer or PTFE membrane that flexes onto the weir, isolating fluid from the bonnet.',
        function: 'Acts as both closure member and primary seal — ideal for corrosive or sanitary service.',
        materials: ['EPDM', 'PTFE-Faced', 'Butyl Rubber'],
      },
      weir: {
        id: 'weir',
        name: 'Weir',
        category: 'Sealing Surface',
        description: 'A raised dam cast into the body that the diaphragm seals against.',
        function: 'Reduces diaphragm travel and provides a clean, drainable sealing surface.',
        materials: ['Lined Cast Body', 'Solid CF8M'],
      },
    },
  },

  'plug-valve-lubricated': {
    id: 'plug-valve-lubricated',
    name: 'Lubricated Plug Valve',
    kind: 'plug',
    motion: 'Quarter-turn tapered plug',
    fluid: 'oil',
    flowPath: 'inline',
    actuationLabel: 'Rotation',
    groups: [
      { label: 'Pressure Boundary', components: ['body', 'cap'] },
      { label: 'Actuation', components: ['lever', 'stem'] },
      { label: 'Internals', components: ['plug', 'seat'] },
    ],
    components: {
      body: BODY({ description: 'A cylindrical/tapered body bore that the plug seats into across its full length.' }),
      cap: {
        id: 'cap',
        name: 'Bottom Cap',
        category: 'Pressure Cover',
        description: 'Retains the plug and provides the sealant injection / adjustment point.',
        function: 'Sets plug-to-body clearance and closes the pressure boundary.',
        materials: ['ASTM A216 WCB', 'Forged A105'],
      },
      lever: {
        id: 'lever',
        name: 'Lever / Wrench',
        category: 'Manual Actuator',
        description: 'A wrench head that rotates the plug a quarter-turn.',
        function: 'Turns the plug so its through-port aligns with — or blocks — the bore.',
        materials: ['Ductile Iron', 'Carbon Steel'],
      },
      stem: { ...STEM, description: 'A short stem integral to the plug, sealed at the top.' },
      seat: {
        ...SEAT,
        description: 'The full tapered contact between plug and body, kept sealed by injected lubricant.',
        materials: ['Lubricant Film', 'PTFE Sleeve', 'Nitrided Steel'],
      },
      plug: {
        id: 'plug',
        name: 'Tapered Plug',
        category: 'Rotary Closure Member',
        description: 'A tapered cylinder with a through-port that rotates within the body.',
        function: 'A quarter-turn aligns the port for flow or rotates it solid-side to the bore for shutoff.',
        materials: ['Carbon Steel + ENP', 'CF8M'],
      },
    },
  },

  'needle-valve': {
    id: 'needle-valve',
    name: 'Needle Valve',
    kind: 'needle',
    motion: 'Fine-thread tapered needle · precise metering',
    fluid: 'oil',
    flowPath: 'angle',
    actuationLabel: 'Needle Travel',
    groups: [
      { label: 'Pressure Boundary', components: ['body', 'bonnet'] },
      { label: 'Actuation', components: ['handwheel', 'stem', 'packing'] },
      { label: 'Internals', components: ['needle', 'seat'] },
    ],
    components: {
      body: BODY({
        description: 'A compact forged body, often angle-pattern, sized for instrument and sample lines.',
        materials: ['Forged 316 SS', 'Monel', 'Hastelloy'],
      }),
      bonnet: BONNET,
      handwheel: { ...HANDWHEEL, name: 'Knurled Handle', description: 'A fine knurled knob for sensitive adjustment.' },
      stem: { ...STEM, description: 'A fine-pitch threaded stem giving many turns over a tiny travel.' },
      packing: PACKING,
      seat: { ...SEAT, description: 'A small honed orifice that the needle point closes against.' },
      needle: {
        id: 'needle',
        name: 'Tapered Needle',
        category: 'Metering Closure',
        description: 'A long, slender, sharply tapered plug that meters flow with high precision.',
        function: 'Each turn advances the needle a tiny amount, finely varying a small orifice area.',
        materials: ['17-4PH Stainless', 'Hardened 316'],
      },
    },
  },

  'safety-valve-spring': {
    id: 'safety-valve-spring',
    name: 'Spring-Loaded Safety Valve',
    kind: 'safety',
    motion: 'Self-acting pop-action overpressure relief',
    fluid: 'steam',
    flowPath: 'angle',
    actuationLabel: 'Disc Lift',
    groups: [
      { label: 'Pressure Boundary', components: ['body', 'bonnet'] },
      { label: 'Setpoint', components: ['spring', 'adjuster'] },
      { label: 'Internals', components: ['disc', 'nozzle'] },
    ],
    components: {
      body: BODY({ description: 'An angle body: inlet from the protected vessel below, discharge to the side.' }),
      bonnet: { ...BONNET, name: 'Spring Housing', description: 'The upper housing enclosing and protecting the setpoint spring.' },
      spring: {
        id: 'spring',
        name: 'Helical Spring',
        category: 'Setpoint Force',
        description: 'A calibrated coil spring that holds the disc shut until the set pressure is reached.',
        function: 'Its preload defines the relieving pressure; overpressure compresses it and the disc pops open.',
        materials: ['Chrome-Vanadium Steel', 'Inconel X-750 (high temp)'],
      },
      adjuster: {
        id: 'adjuster',
        name: 'Adjusting Screw',
        category: 'Calibration',
        description: 'Sets spring preload and therefore the relieving (set) pressure.',
        function: 'Turning it changes spring compression to dial in the exact set pressure.',
        materials: ['Alloy Steel', 'Stainless Steel'],
      },
      nozzle: {
        id: 'nozzle',
        name: 'Nozzle / Seat',
        category: 'Sealing Interface',
        description: 'The inlet orifice and seating surface the disc seals against.',
        function: 'Forms the seal at rest and the throat through which relief flow accelerates.',
        materials: ['Stellite-faced SS', '316 Stainless'],
      },
      disc: {
        id: 'disc',
        name: 'Disc & Huddling Chamber',
        category: 'Self-Acting Closure',
        description: 'The closure that lifts sharply once set pressure is exceeded.',
        function: 'A huddling chamber captures extra area at lift, giving the rapid "pop" action and reseating.',
        materials: ['Stellite-faced SS', 'Nimonic'],
      },
    },
  },

  'air-release-valve': {
    id: 'air-release-valve',
    name: 'Automatic Air Release Valve',
    kind: 'air',
    motion: 'Float-operated · vents trapped air',
    fluid: 'air',
    flowPath: 'vertical',
    actuationLabel: 'Float Level',
    groups: [
      { label: 'Pressure Boundary', components: ['body', 'cap'] },
      { label: 'Internals', components: ['float', 'orifice', 'seat'] },
    ],
    components: {
      body: BODY({ description: 'A vertical chamber mounted at pipeline high points where air collects.' }),
      cap: {
        id: 'cap',
        name: 'Cover & Orifice Housing',
        category: 'Pressure Cover',
        description: 'Tops the chamber and carries the small discharge orifice and lever mechanism.',
        function: 'Closes the chamber and locates the orifice the float seals against.',
        materials: ['Ductile Iron', 'Reinforced Nylon', 'CF8M'],
      },
      float: {
        id: 'float',
        name: 'Float Ball',
        category: 'Self-Acting Closure',
        description: 'A buoyant ball that rides the liquid level inside the chamber.',
        function: 'Air pushes the water level down → the float drops → the orifice opens to vent air; water lifts it shut.',
        materials: ['Hollow Stainless Steel', 'Reinforced Polypropylene'],
      },
      orifice: {
        id: 'orifice',
        name: 'Discharge Orifice',
        category: 'Vent Port',
        description: 'A small calibrated port through which accumulated air escapes to atmosphere.',
        function: 'Sized to vent air without letting pressurised water blow straight through.',
        materials: ['Stainless Steel', 'Brass'],
      },
      seat: {
        ...SEAT,
        name: 'Orifice Seat',
        description: 'The soft seat the float lever presses against to close the orifice.',
        materials: ['EPDM', 'Buna-N', 'Viton'],
      },
    },
  },
};

export function getValve3D(id: string): Valve3DConfig {
  return VALVE_3D[id] ?? VALVE_3D['gate-valve-wedge'];
}

export const VALVE_3D_IDS = Object.keys(VALVE_3D);
