export interface Lesson {
  id: string;
  title: string;
  estimatedTime: string;
  content: string; // Markdown / Text details
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface AcademyModule {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  context: string; // Typical usage context
}

export const ACADEMY_CURRICULUM: AcademyModule[] = [
  {
    id: 'basics',
    title: 'Module 1: Valve Mechanics & Classifications',
    description: 'Master standard terminology, linear vs rotary actions, and structural pressure rating bodies.',
    lessons: [
      {
        id: 'intro-mechanics',
        title: 'Introduction to Valving Mechanics',
        estimatedTime: '8 min',
        content: 'Valves are mechanical devices that control the flow and pressure of fluids within a system. At their core, they perform three basic functions: starting or stopping flow, regulating (throttling) flow, and preventing backflow. The pressure-retaining boundary (known as the pressure boundary or shell) consists of the body, bonnet, and closure element. Standard codes like ASME B16.34 govern wall thicknesses, flange designs, and material limits. Inside the body, the trim represents the elements that contact the fluid directly (disc, stem, seats, and guides) and are subject to wear, erosion, and corrosion.',
        quiz: [
          {
            question: 'Which component is considered the primary pressure-retaining shell of a valve?',
            options: ['Stuffing Box Gland', 'Valve Body', 'Handwheel Actuator', 'Stem Linkage'],
            correctIndex: 1,
            explanation: 'The valve body (or shell) is the primary pressure boundary that contains the internal fluid passages and seals the piping connection ends.'
          },
          {
            question: 'What is the primary function of the valve bonnet?',
            options: [
              'To actuate the flow control element',
              'To connect the valve body to the downstream pipe segment',
              'To serve as a removable cover for the body, housing the packing chamber and stem mechanism',
              'To prevent seat leakage under high differential pressures'
            ],
            correctIndex: 2,
            explanation: 'The bonnet is the removable top cover of a valve body. It provides access to the internals and houses the stem seal (packing) to prevent fluid leakage along the stem.'
          }
        ]
      },
      {
        id: 'linear-rotary',
        title: 'Linear vs Rotary Motion Assemblies',
        estimatedTime: '10 min',
        content: 'Valves are classified by the movement of their closure member. Linear valves (Gate, Globe, Diaphragm, Pinch) utilize a disc, plug, or wedge that moves in a straight line relative to the flow orifice. They often require multiple turns of a threaded stem to cycle from fully open to closed. This gradual action prevents water hammer but requires more space. Rotary valves (Ball, Butterfly, Plug) utilize a closure member that rotates 90 degrees (quarter-turn) around an internal axis. This allows fast actuation, smaller profiles, and less stem wear, but can induce flow shock if shut too rapidly.',
        quiz: [
          {
            question: 'What is a typical advantage of quarter-turn rotary valves over multi-turn linear valves?',
            options: ['Higher pressure drop limits', 'Fast open/close operational cycling', 'Better suitability for high-temp steam throttling', 'Shorter sealing seat wear paths'],
            correctIndex: 1,
            explanation: 'Quarter-turn rotary valves (like ball or butterfly valves) require only a 90-degree shaft rotation, allowing extremely rapid operations.'
          },
          {
            question: 'Which of the following is classified as a linear motion valve?',
            options: ['Butterfly Valve', 'Eccentric Plug Valve', 'Globe Valve', 'Segmented Ball Valve'],
            correctIndex: 2,
            explanation: 'A globe valve uses a disk or plug moving linearly perpendicular to the plane of the seat ring to regulate flow.'
          }
        ]
      }
    ]
  },
  {
    id: 'dynamics',
    title: 'Module 2: Fluid Dynamics & Flow Control',
    description: 'Study Cv sizing calculations, pressure drop curves, and managing cavitation bubbles.',
    lessons: [
      {
        id: 'understanding-cv',
        title: 'Understanding Flow Coefficient (Cv/Kv)',
        estimatedTime: '12 min',
        content: 'The flow coefficient (Cv) represents the volume of water (in US Gallons Per Minute) at 60°F that will flow through a fully open valve at a differential pressure drop of 1 PSI. The metric equivalent is Kv (measured in m³/h at 1 bar drop, where Cv = 1.156 * Kv). Cv is critical for sizing control valves: sizing a valve too small restricts capacity and causes high-velocity erosion, while sizing it too large causes "hunting" (control oscillations near the seat), leading to poor system stability and accelerated seat wear.',
        quiz: [
          {
            question: 'What does a Cv rating of 45 signify?',
            options: [
              'The valve will withstand 45 PSI before leaking',
              'The valve will flow 45 Gallons Per Minute of water at a 1 PSI pressure drop',
              'The valve plug travel distance is 45 millimeters',
              'The flow velocity is restricted to 45 meters per second'
            ],
            correctIndex: 1,
            explanation: 'By engineering definition, Cv is the flow rate in GPM of water at 60°F that passes through a valve under a differential pressure of 1 PSI.'
          },
          {
            question: 'What is the most likely consequence of significantly oversizing a control valve?',
            options: [
              'The valve will operate too close to its fully open limit',
              'The pressure drop across the valve will drop to zero',
              'The controller will "hunt" (oscillate) and damage the seating surfaces',
              'Fugitive packing emissions will increase'
            ],
            correctIndex: 2,
            explanation: 'An oversized valve achieves the required flow at very small openings. In this regime, even tiny stem movements cause huge changes in flow, causing the control system to oscillate ("hunt") constantly.'
          }
        ]
      },
      {
        id: 'cavitation-flashing',
        title: 'Analyzing Cavitation & Flashing',
        estimatedTime: '15 min',
        content: 'Cavitation occurs when fluid pressure drops below vapor pressure as it throttles through the valve orifice (at the vena contracta, the narrowest point of the flow path), forming vapor bubbles. When the fluid exits the orifice, pressure recovers above the vapor pressure, causing these bubbles to collapse violently. This generates localized shockwaves (micro-jets up to 100,000 PSI) that score metal seats. Flashing differs in that the downstream pressure remains below the vapor pressure, causing the fluid to exit the valve as a mixture of liquid and vapor, causing smooth sandblasting-like erosion.',
        quiz: [
          {
            question: 'What physical event initiates localized cavitation wear on valve seats?',
            options: [
              'Solid particulate sand friction',
              'Violent collapse of vapor bubbles during downstream pressure recovery',
              'Thermal expansion of stem threads',
              'High-frequency packing box vibrations'
            ],
            correctIndex: 1,
            explanation: 'Cavitation damage is caused by the mechanical shockwaves generated when vapor bubbles collapse against adjacent metal boundaries.'
          },
          {
            question: 'How does flashing differ from cavitation in terms of downstream state?',
            options: [
              'Flashing recovers pressure above vapor pressure',
              'Flashing results in a permanent liquid-vapor state downstream because pressure does not recover',
              'Flashing only occurs in gaseous or dry steam systems',
              'Flashing generates much higher high-frequency noise levels than cavitation'
            ],
            correctIndex: 1,
            explanation: 'In flashing, the downstream pressure remains below the vapor pressure of the liquid, so the fluid remains a two-phase liquid-vapor mixture as it exits the valve.'
          }
        ]
      }
    ]
  },
  {
    id: 'sizing-selection',
    title: 'Module 3: Valve Sizing & Selection',
    description: 'Learn to size for compressible fluids, select fail-safe actuators, and design trim features.',
    lessons: [
      {
        id: 'compressible-flow',
        title: 'Sizing for Compressible vs Incompressible Fluids',
        estimatedTime: '15 min',
        content: 'Sizing valves for gases, steam, or vapors (compressible fluids) differs from liquids (incompressible). Gas density changes with pressure. As the differential pressure across the valve increases, the flow rate increases until it reaches the speed of sound at the vena contracta. At this point, the flow is "choked," and further decreases in downstream pressure will not increase flow. Choked flow is accompanied by severe noise, aerodynamic vibration, and shockwaves. To prevent damage, engineers select multi-stage pressure reduction cage trims that distribute pressure drops across multiple steps, preventing the velocity from reaching sonic limits.',
        quiz: [
          {
            question: 'What happens when a control valve experiences choked flow?',
            options: [
              'The flow rate drops to zero immediately',
              'Further increases in pressure drop across the valve will not increase the flow rate',
              'The fluid freezes due to rapid expansion',
              'The valve stem automatically locks to prevent damage'
            ],
            correctIndex: 1,
            explanation: 'Choked flow occurs when velocity reaches the speed of sound at the vena contracta. At this point, reducing downstream pressure further has no effect on flow rate.'
          },
          {
            question: 'What trim style is ideal for handling high-pressure gas pressure drops without excessive noise?',
            options: [
              'Standard flat seat disc trim',
              'Double-seated plug trim',
              'Multi-stage, multi-path cage trim',
              'Soft elastomer face sleeve trim'
            ],
            correctIndex: 2,
            explanation: 'Multi-stage cage trims break down the total pressure drop into smaller steps, preventing the velocity from exceeding sonic levels and reducing aerodynamic noise.'
          }
        ]
      },
      {
        id: 'actuation-automation',
        title: 'Actuator Selection & Automation',
        estimatedTime: '12 min',
        content: 'Actuators provide the mechanical force to move the valve closure member. The primary types are: Pneumatic (spring-diaphragm or piston, offering reliable fail-safe positions by utilizing spring tension to close or open on loss of instrument air), Electric (motor-driven gearboxes, offering high precision and clean operation, but requiring battery/capacitor backup for fail-safe modes), and Hydraulic (offering high thrust for massive valves). Smart digital positioners compare the electronic controller command signal (e.g., 4-20mA or digital bus) with the actual stem position via feedback linkages, adjusting pressure output to overcome stem friction and fluid forces.',
        quiz: [
          {
            question: 'Why are pneumatic spring-diaphragm actuators widely used in safety-critical systems?',
            options: [
              'They require no external piping or hoses',
              'They inherently support mechanical fail-safe positions (fail-open or fail-closed) on power/air loss via spring tension',
              'They operate faster than electric solenoid valves',
              'They do not require calibration'
            ],
            correctIndex: 1,
            explanation: 'Pneumatic spring-diaphragm actuators contain compressed springs. If control air pressure is lost, the spring expands to automatically drive the valve to its designated safe state (fully open or fully closed).'
          },
          {
            question: 'What is the primary role of a digital valve positioner?',
            options: [
              'To step down voltage to the actuator motor',
              'To compare the incoming control signal with the actual valve stem position and adjust air pressure to match',
              'To log maintenance events to the cloud',
              'To shut down flow if line pressure exceeds threshold limits'
            ],
            correctIndex: 1,
            explanation: 'A positioner acts as a local feedback controller. It senses the actual stem position and modulates air pressure to the actuator until the stem position matches the input control signal.'
          }
        ]
      }
    ]
  },
  {
    id: 'diagnostics-maintenance',
    title: 'Module 4: Diagnostics, Failures & Standards',
    description: 'Troubleshoot gate binding, learn leakage testing classes, and establish packing integrity.',
    lessons: [
      {
        id: 'troubleshooting-failures',
        title: 'Common Failure Modes & Troubleshooting',
        estimatedTime: '14 min',
        content: 'Industrial valves operate under demanding conditions, leading to several classic failure modes: 1) Thermal Binding: occurrs in solid wedge gate valves. The valve is closed tightly while hot, and as it cools, the body contracts, wedging the disc tightly between seats. 2) Stem Packing Leakage: caused by friction wear on graphite or PTFE rings, allowing fugitive emissions. 3) Stem Galling: wear between sliding metal threads on stems without proper lubrication. Live-loaded packing glands (incorporating Belleville disc springs) are utilized to apply a continuous sealing force, compensating for wear and thermal cycles.',
        quiz: [
          {
            question: 'What is thermal binding in wedge gate valves?',
            options: [
              'The fluid freezes inside the valve body, cracking the shell',
              'A hot valve is closed tightly, and body contraction during cooling wedges the gate permanently shut',
              'The stem threads melt under extreme piping heat',
              'High temperatures expand the packing rings, locking the stem'
            ],
            correctIndex: 1,
            explanation: 'Thermal binding happens when solid wedge gates are closed in hot systems. When the system cools down, the body contracts faster than the wedge, locking it between seats.'
          },
          {
            question: 'What component is added to stem packing glands to provide continuous compression and prevent emissions?',
            options: [
              'Double-acting bypass piping',
              'Belleville spring washers (live loading)',
              'Stellite hardfacing alloys',
              'Pneumatic pressure seals'
            ],
            correctIndex: 1,
            explanation: 'Live-loading uses Belleville spring washers on the packing gland studs to maintain a constant compressive stress on the packing, preventing leakage due to thermal cycling or wear.'
          }
        ]
      },
      {
        id: 'leakage-standards',
        title: 'Testing Standards & Seat Leakage Classifications',
        estimatedTime: '12 min',
        content: 'Valves must meet specific design and testing standards. ANSI/FCI 70-2 defines seat leakage classifications for control valves. Class I has no testing requirement, Class IV is the industrial standard (metal-to-metal seats, permitting a maximum leakage of 0.01% of full open capacity), and Class VI provides the tightest shutoff (bubble-tight, utilizing soft elastomer seats like PTFE or Viton, tested with air or nitrogen). Design limits and wall thicknesses are governed by ASME B16.34, while API 598 defines testing procedures and leakage rates for isolation valves.',
        quiz: [
          {
            question: 'Which ANSI/FCI 70-2 leakage class specifies a "bubble-tight" shutoff utilizing soft seats?',
            options: ['Class II', 'Class IV', 'Class V', 'Class VI'],
            correctIndex: 3,
            explanation: 'Class VI specifies the tightest standard leakage class (often called bubble-tight or zero-leakage) and is typically achieved using resilient soft seats.'
          },
          {
            question: 'What is the primary scope of the ASME B16.34 standard?',
            options: [
              'It defines standard symbol representations on process flow diagrams (P&IDs)',
              'It establishes design, materials, wall thickness, and pressure-temperature ratings for valves',
              'It governs standard environmental emission testing techniques',
              'It lists standard actuator sizing guidelines'
            ],
            correctIndex: 1,
            explanation: 'ASME B16.34 is the standard that regulates pressure-temperature ratings, wall thicknesses, dimensions, and materials for flanged, threaded, and welding-end valves.'
          }
        ]
      }
    ]
  }
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Cavitation',
    definition: 'A two-stage process where localized low pressure vaporizes liquid into bubbles, which subsequently collapse violently as pressure recovers downstream, causing structural erosion.',
    context: 'Standard Globe control valves experience seat cavitation during high-differential throttling.'
  },
  {
    term: 'Flow Coefficient (Cv)',
    definition: 'The rate of flow in US Gallons Per Minute (GPM) of water at 60°F that will pass through a valve at a differential pressure drop of 1 PSI.',
    context: 'Engineers check Cv ratings to select proper control valve trim sizes.'
  },
  {
    term: 'Stuffing Box',
    definition: 'The chamber inside the valve bonnet surrounding the stem, containing compressed packing material rings to seal against fugitive emissions.',
    context: 'Tightening the packing gland compresses rings inside the stuffing box to seal the stem.'
  },
  {
    term: 'Trim',
    definition: 'The internal components of a valve that come into contact with the system fluid, typically consisting of the stem, closure member, seat rings, and guides.',
    context: 'Stainless steel trim is standard for corrosion resistance in carbon steel body valves.'
  },
  {
    term: 'Thermal Binding',
    definition: 'A condition where a gate valve is closed tightly while hot, and subsequently cannot be opened after cooling due to thermal contraction of the body seats around the wedge.',
    context: 'Flexible wedges are used in high-temp steam systems to prevent thermal binding.'
  },
  {
    term: 'Live Loading',
    definition: 'The application of a constant compressive force to a valve packing gland using Belleville spring washers to maintain stem sealing despite packing wear and thermal expansion.',
    context: 'Live-loaded packing systems are critical for reducing fugitive emissions in refinery applications.'
  },
  {
    term: 'Choked Flow',
    definition: 'A fluid dynamics condition where the flow rate through a valve cannot increase further, even if downstream pressure drops, because fluid velocity has reached sonic speed.',
    context: 'Gas regulator valves must be sized carefully to avoid choked flow noise and piping vibrations.'
  },
  {
    term: 'Vena Contracta',
    definition: 'The point of minimum cross-sectional area and maximum velocity in a fluid stream as it passes through a valve orifice.',
    context: 'In control valves, the fluid pressure is lowest at the vena contracta, where cavitation vapor bubbles form.'
  },
  {
    term: 'Fugitive Emissions',
    definition: 'Unintentional leaks of volatile organic compounds (VOCs) or hazardous air pollutants from valves, flanges, and piping seals.',
    context: 'Valves equipped with bellows-seal bonnets offer near-zero fugitive emissions for high-toxicity lines.'
  },
  {
    term: 'Stellite',
    definition: 'A cobalt-chromium alloy designed for wear resistance, commonly used as a hardfacing material welded onto valve seats and discs to prevent erosion.',
    context: 'Globe valves in high-pressure steam lines require Stellite-faced seat rings to withstand erosion.'
  }
];

