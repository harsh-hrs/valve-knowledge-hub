export interface CategoryValve {
  id: string;
  name: string;
  description: string;
  workingPrinciple: string;
  advantages: string[];
  limitations: string[];
}

export interface CategoryDetails {
  id: string;
  name: string;
  subtitle: string;
  overview: string;
  whyExists: string;
  applications: string[];
  valves: CategoryValve[];
}

export const CATEGORIES_DATA: Record<string, CategoryDetails> = {
  'isolation': {
    id: 'isolation',
    name: 'Isolation Valves',
    subtitle: 'On-Off Fluid Shutoff Solutions',
    overview: 'Isolation valves are designed to entirely block or permit fluid flow in pipelines. They are characterized by low pressure drop when fully open and are not meant for throttling.',
    whyExists: 'Piping systems require positive shutoff boundaries to perform maintenance, isolate plant segments during emergencies, and control sequence routing without leaking fluid downstream.',
    applications: [
      'Chemical reactor safety shutoff',
      'Municipal water loop division',
      'Gas pipeline distribution manifolds',
      'Process pump inlet and outlet isolation'
    ],
    valves: [
      {
        id: 'gate-valve-wedge',
        name: 'Wedge Gate Valve',
        description: 'Linear movement wedge sealing against tapered body seats.',
        workingPrinciple: 'A threaded stem drives a metal wedge downwards perpendicular to flow direction, pressing into seats to block fluid.',
        advantages: ['Zero flow restriction when open', 'Double sealing capability', 'High pressure rating bounds'],
        limitations: ['Extremely slow operation cycles', 'Erosion of seat if used for throttling', 'Susceptible to thermal lockups']
      },
      {
        id: 'ball-valve-floating',
        name: 'Floating Ball Valve',
        description: 'Quarter-turn rotary sphere nested in soft polymer seats.',
        workingPrinciple: 'Stem rotates the inner ball 90 degrees. Upstream pressure shifts the ball downstream to compress the soft polymer seal.',
        advantages: ['Instant manual shutoff', 'Self-wiping seat mechanism', 'High Cv capacity'],
        limitations: ['Prone to seat distortion at partial open states', 'Traps high pressure inside the body cavity', 'Temperature limited by soft seats']
      },
      {
        id: 'butterfly-valve-triple-offset',
        name: 'Triple Offset Butterfly Valve',
        description: 'Rotary action disc with triple eccentric offset sealing for high performance.',
        workingPrinciple: 'The stem rotates a thin circular disc 90 degrees. The triple offset shaft alignment ensures the disc makes contact with the seat ring only at final shutoff, eliminating seat friction.',
        advantages: ['Compact lightweight design', 'Bi-directional zero-leakage shutoff', 'Low torque requirements'],
        limitations: ['Disc sits in the flow stream, creating minor flow resistance', 'Susceptible to cavitation damage under high pressure drop throttling', 'Cavity near seat can collect solid debris']
      },
      {
        id: 'diaphragm-valve',
        name: 'Weir Diaphragm Valve',
        description: 'Flexible membrane pressed onto a weir, fully isolating the fluid from the working parts.',
        workingPrinciple: 'A non-wetted stem lowers a compressor onto a flexible diaphragm, flexing it down onto a raised weir to throttle or shut off flow with zero stem leakage.',
        advantages: ['Total fluid isolation (zero emissions)', 'Handles slurries and corrosives', 'Crevice-free and sterilisable'],
        limitations: ['Low pressure and temperature limits', 'Diaphragm is a wear item', 'Not for high-pressure isolation']
      },
      {
        id: 'plug-valve-lubricated',
        name: 'Lubricated Plug Valve',
        description: 'Tapered quarter-turn plug sealed by an injected lubricant film over full contact.',
        workingPrinciple: 'A wrench rotates a tapered plug 90 degrees so its through-port aligns with or blocks the bore; injected sealant lubricates and renews the seal across the taper.',
        advantages: ['Compact, fast quarter-turn', 'Excellent shutoff in dirty/gas service', 'Sealant frees a stuck plug'],
        limitations: ['Needs periodic sealant injection', 'Higher torque in large sizes', 'Sealant compatibility constraints']
      }
    ]
  },
  'check': {
    id: 'check',
    name: 'Check Valves',
    subtitle: 'Automatic Backflow Prevention Assemblies',
    overview: 'Check valves permit fluid movement in only one direction, closing automatically if the flow slows down or reverses.',
    whyExists: 'Reverse flow can spin pumps backward, cause water hammer shockwaves, contaminate clean fluids, and damage upstream piping components.',
    applications: [
      'Pump discharge protection loops',
      'Boiler water feed systems',
      'Water treatment anti-contamination lines',
      'Compressor system pressure isolation'
    ],
    valves: [
      {
        id: 'check-valve-swing',
        name: 'Swing Check Valve',
        description: 'Pivoting flap hanging from a hinge pin near the port entry.',
        workingPrinciple: 'Forward flow pressure lifts the clapper off the seat. Gravity and reverse pressure swing the clapper back to shut off reverse flow.',
        advantages: ['Automatic self-operation', 'Minimal pressure drop', 'Simple mechanical structure'],
        limitations: ['Prone to water hammer slamming during sudden reversals', 'Cannot be installed pointing downward', 'Hinge pin wear in turbulent lines']
      }
    ]
  },
  'control': {
    id: 'control',
    name: 'Control Valves',
    subtitle: 'Throttling & Process Regulation Systems',
    overview: 'Control valves regulate pressure, flow rate, or temperature by dynamically adjusting the flow opening area in response to actuator signals.',
    whyExists: 'Processes must adapt to changing pressure demands, balance fluid proportions, and maintain system metrics under varying loads.',
    applications: [
      'Boiler steam feed regulation',
      'Chemical reactor ingredient proportioning',
      'Oil refinery distillation columns feed control',
      'Pipeline pressure reduction stations'
    ],
    valves: [
      {
        id: 'globe-valve-standard',
        name: 'Standard Globe Valve',
        description: 'Z-body path configuration with linear regulating plug.',
        workingPrinciple: 'The stem drives a contoured plug into a central seat ring. The fluid path shifts twice through the orifice, matching plug depth.',
        advantages: ['Exceptional throttling precision', 'Short stem stroke path', 'Easy seat refurbishment'],
        limitations: ['High inherent pressure drop', 'Requires high actuator closing forces', 'Susceptible to cavitation damage']
      },
      {
        id: 'needle-valve',
        name: 'Needle Valve',
        description: 'Fine-tapered needle on a fine-pitch thread for precise low-flow metering.',
        workingPrinciple: 'Many turns of a fine-thread stem advance a slender tapered needle into a small seat orifice, changing the flow area in tiny increments for repeatable control.',
        advantages: ['Very fine low-flow control', 'Compact high-pressure body', 'Metering plus positive shutoff'],
        limitations: ['Low flow capacity only', 'High pressure drop', 'Tip and seat damaged by particulates']
      }
    ]
  },
  'air': {
    id: 'air',
    name: 'Air Valves',
    subtitle: 'Pipeline Exhaust & Vacuum Protection',
    overview: 'Air valves exhaust accumulated air pockets in water lines and admit air into draining systems to prevent pipe collapse.',
    whyExists: 'Entrained air pockets reduce flow capacity and trigger pressure surges, while vacuum states can cause structural pipes to buckle inward.',
    applications: [
      'High points in water transmission pipelines',
      'Long pipeline incline peaks',
      'Municipal wastewater transmission loops',
      'Dumping manifolds protection'
    ],
    valves: [
      {
        id: 'air-release-valve',
        name: 'Automatic Air Release Valve',
        description: 'Float-operated small-orifice exhaust system.',
        workingPrinciple: 'Accumulated air forces the water level down inside the chamber. The floating ball drops, opening a small orifice to exhaust air.',
        advantages: ['Works continuously under system pressure', 'Prevents air binding flow locks', 'Compact mechanical body'],
        limitations: ['Small discharge capacity limits bulk venting', 'Vulnerable to sticky slurry fluids clogging the float seat', 'Single function operation']
      }
    ]
  },
  'safety': {
    id: 'safety',
    name: 'Safety & Relief Valves',
    subtitle: 'Overpressure System Protection Devices',
    overview: 'Safety valves automatically pop open at a set pressure limit to discharge fluid and prevent vessel explosions.',
    whyExists: 'Pressure vessels, boilers, and piping loops can experience pressure spikes that exceed their structural limits, risking catastrophic explosions.',
    applications: [
      'Steam boilers headers',
      'Chemical storage gas tanks protection',
      'Piping loops thermal expansion relief',
      'Refining safety venting stacks'
    ],
    valves: [
      {
        id: 'safety-valve-spring',
        name: 'Spring-Loaded Safety Valve',
        description: 'Pop-action overpressure venting valve.',
        workingPrinciple: 'An adjustable spring holds the disc against the seat. When fluid pressure exceeds spring force, the disc lifts instantly to vent.',
        advantages: ['Fast pop-action relief', 'Independent failsafe operation', 'High discharge rate capacity'],
        limitations: ['Spring calibration drifts over time', 'Slamming shut can score metal seats', 'Relatively large physical envelope']
      }
    ]
  }
};
