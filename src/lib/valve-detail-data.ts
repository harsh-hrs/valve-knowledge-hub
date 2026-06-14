export interface ValveComponentDetail {
  name: string;
  function: string;
  typicalMaterials: string[];
}

export interface MaintenanceTask {
  interval: string;
  action: string;
  rationale: string;
}

export interface FailureMode {
  mode: string;
  cause: string;
  prevention: string;
}

export interface ComparisonMetric {
  parameter: string;
  thisValveValue: string;
  alternativeValveName: string;
  alternativeValveValue: string;
}

export interface ValveDetail {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  overview: string;
  workingPrinciple: string;
  applications: string[];
  advantages: string[];
  limitations: string[];
  components: ValveComponentDetail[];
  materials: {
    body: string[];
    trim: string[];
    seals: string[];
  };
  standards: string[];
  maintenance: MaintenanceTask[];
  failureModes: FailureMode[];
  comparison: {
    summary: string;
    metrics: ComparisonMetric[];
  };
}

export const VALVE_DETAILS: Record<string, ValveDetail> = {
  'gate-valve-wedge': {
    id: 'gate-valve-wedge',
    name: 'Wedge Gate Valve',
    category: 'Isolation',
    subcategory: 'Gate',
    overview: 'A Wedge Gate Valve is a linear-motion valve utilizing a wedge-shaped gate to completely stop or permit fluid flow. Characterized by a straight-through flow pathway that minimizes friction losses and flow restriction. The closure element (wedge) has tapered seating faces that lock into matching seat angles to secure a seal. It is specifically designed for fully open or fully closed service and must never be utilized for throttling, as high-velocity flow scours the seats and induces severe chattering.',
    workingPrinciple: 'The valve operates via a threaded stem (either rising or non-rising design) connected to the gate wedge. Turning the handwheel or actuator drives the stem threads, converting rotational torque into linear thrust. This thrust slides the wedge perpendicular to the flow axis. At final closure, the wedge is wedged into tapered body seat rings, utilizing mechanical force to compress the metal-to-metal seating surfaces for a tight shutoff.',
    applications: [
      'High-pressure main steam isolating loops in power plants',
      'Crude oil pipeline block and isolation stations',
      'Municipal water distribution networks and intake lines',
      'High-temperature refinery hydrocarbon feed lines'
    ],
    advantages: [
      'Minimal pressure drop and friction loss when fully open',
      'Excellent bi-directional bubble-tight metal-to-metal sealing',
      'Straight-through flow path reduces turbulence and fluid erosion'
    ],
    limitations: [
      'Entirely unsuitable for throttling (flow velocity causes seat chattering and wire-drawing erosion)',
      'Slow operational stroke cycle due to multi-turn stem threads',
      'Prone to thermal binding and pressure lockups under temperature spikes'
    ],
    components: [
      { name: 'Wedge Gate', function: 'The tapered sliding closure element that blocks the fluid path.', typicalMaterials: ['ASTM A216 WCB', 'CF8M Stainless Steel'] },
      { name: 'Stem', function: 'Transmits linear force from the handwheel to raise/lower the wedge.', typicalMaterials: ['ASTM A276 Type 410', 'SS316'] },
      { name: 'Seat Rings', function: 'Tapered internal rings that match the wedge angles to establish sealing.', typicalMaterials: ['Carbon Steel with Stellite 6 Overlay', 'ASTM A182 F316'] },
      { name: 'Stuffing Box Packing', function: 'Compressed graphite rings that seal around the stem to prevent fugitive leaks.', typicalMaterials: ['Flexible Graphite with corrosion inhibitors', 'PTFE'] }
    ],
    materials: {
      body: ['ASTM A216 WCB (Carbon Steel)', 'ASTM A351 CF8M (316 Stainless Steel)', 'ASTM A352 LCB (Low Temp Carbon Steel)'],
      trim: ['ASME B16.34 Trim 8 (13% Cr / Stellite)', 'ASME B16.34 Trim 5 (Full Stellite)', 'Trim 12 (316 / Stellite)'],
      seals: ['Flexible Graphite Gaskets', 'PTFE Rings', 'Spiral Wound SS316 with Graphite Fill']
    },
    standards: [
      'API 600 (Steel Gate Valves - Flanged and Butt-welding Ends)',
      'ASME B16.34 (Valves - Flanged, Threaded, and Welding End)',
      'API 598 (Valve Inspection and Testing)',
      'ISO 10434 (Bolted Bonnet Steel Gate Valves)'
    ],
    maintenance: [
      { interval: 'Semi-Annually', action: 'Lubricate stem threads with lithium grease and cycle the valve.', rationale: 'Prevents thread friction, galling, and binding during operation.' },
      { interval: 'Annually', action: 'Check packing gland loading and tighten gland bolts slightly if wear is present.', rationale: 'Maintains sealing compression on graphite rings to prevent fugitive emission leaks.' },
      { interval: 'Overhaul Shutdown', action: 'Lap the body seat rings and gate faces using grinding paste.', rationale: 'Restores the flat, metal-to-metal seating profile to eliminate internal leakage.' }
    ],
    failureModes: [
      { mode: 'Thermal Binding', cause: 'The valve is closed tight while hot; subsequent cooling contracts the body faster than the wedge, jamming the gate.', prevention: 'Avoid overtightening when hot, or install flexible wedge designs or bypass purge lines.' },
      { mode: 'Seat Wire-Drawing (Erosion)', cause: 'Using the valve for throttling allows high-velocity fluid to cut channels across the seats.', prevention: 'Enforce strict operational rules prohibiting partial open states.' },
      { mode: 'Pressure Lockup', cause: 'Liquid trapped in the bonnet cavity expands due to process heat, raising pressure beyond limits.', prevention: 'Drill a small pressure relief hole in the upstream face of the gate wedge.' }
    ],
    comparison: {
      summary: 'Compared to Globe Valves, Gate Valves offer significantly lower flow resistance but are entirely unsuitable for throttling applications.',
      metrics: [
        { parameter: 'Pressure Drop (Delta P)', thisValveValue: 'Near Zero (Straight-through flow path)', alternativeValveName: 'Standard Globe Valve', alternativeValveValue: 'High (Z-shaped tortuous path)' },
        { parameter: 'Throttling Suitability', thisValveValue: 'Not Recommended (Triggers seat erosion and vibration)', alternativeValveName: 'Standard Globe Valve', alternativeValveValue: 'Excellent (Regulated contoured plug)' },
        { parameter: 'Seat Tightness', thisValveValue: 'Very High (Double face metal seal)', alternativeValveName: 'Triple Offset Butterfly Valve', alternativeValveValue: 'Excellent (Frictionless offset seal)' }
      ]
    }
  },
  'butterfly-valve-triple-offset': {
    id: 'butterfly-valve-triple-offset',
    name: 'Triple Offset Butterfly Valve',
    category: 'Isolation',
    subcategory: 'Butterfly',
    overview: 'A Triple Offset Butterfly Valve is a high-performance, quarter-turn rotary valve designed for tight isolation in severe service. By utilizing three independent offsets (eccentricities) in the shaft and seating geometry, it achieves frictionless rotation until the exact point of closure. This eliminates seat wear, reduces operating torque, and allows bubble-tight metal-to-metal shutoff at extreme temperatures and pressures.',
    workingPrinciple: 'The stem is offset from the center of the valve bore (Offset 1) and from the disc sealing plane (Offset 2). Additionally, the sealing cone axis is inclined relative to the shaft axis (Offset 3). During rotation, these offsets create a camming effect, lifting the disc completely clear of the seat throughout its 90-degree travel. Sealing is achieved by mechanical compression of the laminated seal ring against the solid seat, rather than friction, ensuring bi-directional tight shutoff.',
    applications: [
      'High-pressure steam isolation and process distribution lines',
      'LNG cryogenic storage and transport terminals',
      'Hydrocarbon and chemical refinery block lines',
      'District heating and cooling networks'
    ],
    advantages: [
      'Compact, lightweight wafer/lug profile reduces piping weight',
      'Frictionless rotary action extends seal life significantly',
      'Metal-to-metal bubble-tight sealing capable of fire-safe operation'
    ],
    limitations: [
      'Disc remains in the flow stream, creating slight flow resistance and turbulence',
      'Susceptible to cavitation damage under high pressure drop throttling',
      'Cavities near the seat pocket can accumulate solids in slurry service'
    ],
    components: [
      { name: 'Offset Disc', function: 'The rotating closure element that houses the seal ring.', typicalMaterials: ['ASTM A351 CF8M', 'Carbon Steel with Stellite'] },
      { name: 'Laminated Seal Ring', function: 'Flexible layered seal that seats against the solid body seat.', typicalMaterials: ['Duplex SS + Graphite Layers', 'Monel + Graphite'] },
      { name: 'Stem (Shaft)', function: 'Transmits rotary torque from the actuator to the disc.', typicalMaterials: ['ASTM A564 Gr. 630 (17-4PH)', 'XM-19'] },
      { name: 'Body Seat', function: 'Solid metal seat built into the body, matching the inclined cone geometry.', typicalMaterials: ['Stellite 6 Hardfacing on WCB/CF8M'] }
    ],
    materials: {
      body: ['ASTM A216 WCB', 'ASTM A351 CF8M', 'ASTM A494 (Monel/Inconel for severe corrosion)'],
      trim: ['XM-19 Stem', 'CF8M Disc', 'Stellite 6 Solid Seat'],
      seals: ['SS316/Graphite Laminate', 'Inconel/Graphite Laminate']
    },
    standards: [
      'API 609 (Butterfly Valves: Double Flanged, Lug and Wafer Type)',
      'ASME B16.34 (Valves - Flanged, Threaded, and Welding End)',
      'API 598 (Valve Testing)',
      'API 607 (Fire Test for Soft-Seated Quarter-Turn Valves)'
    ],
    maintenance: [
      { interval: 'Quarterly', action: 'Inspect the valve shaft bearings and clean the packing box area.', rationale: 'Prevents stem contamination and extends packing life.' },
      { interval: 'Annually', action: 'Perform visual inspection of seat/seal interfaces and replace stem packing if leaks are detected.', rationale: 'Maintains sealing compression and prevents fugitive emissions.' },
      { interval: 'Turnaround Period', action: 'Inspect and replace the laminated disc seal ring if scored.', rationale: 'Restores bubble-tight sealing without needing to replace the entire disc assembly.' }
    ],
    failureModes: [
      { mode: 'Seal Scoring', cause: 'Process particulates trapped between laminated seal and seat ring during closing.', prevention: 'Install flushing ports or avoid using in high-density slurry lines.' },
      { mode: 'Shaft Binding', cause: 'Excessive piping stress or misalignment deforms the valve body, locking bearings.', prevention: 'Install proper piping supports to isolate thermal expansion loads.' }
    ],
    comparison: {
      summary: 'Compared to Gate Valves, Triple Offset Butterfly Valves are much lighter and require less space but have higher pressure drops because the disc remains in the flow path.',
      metrics: [
        { parameter: 'Weight & Footprint', thisValveValue: 'Very Low (Wafer/Lug design)', alternativeValveName: 'Wedge Gate Valve', alternativeValveValue: 'Very High (Bolted Bonnet design)' },
        { parameter: 'Flow Interference', thisValveValue: 'Moderate (Disc sits in flow stream)', alternativeValveName: 'Wedge Gate Valve', alternativeValveValue: 'Zero (Wedge lifts completely clear)' },
        { parameter: 'Operating Torque', thisValveValue: 'Low (Balanced rotary design)', alternativeValveName: 'Wedge Gate Valve', alternativeValveValue: 'High (Friction-dominated sliding wedge)' }
      ]
    }
  },
  'ball-valve-floating': {
    id: 'ball-valve-floating',
    name: 'Floating Ball Valve',
    category: 'Isolation',
    subcategory: 'Ball',
    overview: 'A Floating Ball Valve is a quarter-turn rotary valve containing a spherical bore. The ball is suspended between two soft seat rings, utilizing upstream fluid pressure to float the ball downstream and establish a tight seal. Extremely popular for fast on-off isolation, full-port options match the pipe inside diameter, resulting in near-zero pressure drop.',
    workingPrinciple: 'A slot in the top of the ball engages with the stem. Turning the stem 90 degrees rotates the ball bore relative to the flow passage. In the closed position, fluid pressure pushes the ball slightly downstream. The ball slides into the downstream soft seat, compressing the polymer material to establish a bubble-tight, positive seal. Because the ball floats, operating torque increases proportionally with line pressure.',
    applications: [
      'Process chemical plant isolation and utility headers',
      'Gas pipeline distribution manifolds and metering skids',
      'Compressed air, nitrogen, and general water service lines',
      'Emergency shutdown (ESD) fast-acting block loops'
    ],
    advantages: [
      'Rapid quarter-turn open/close cycle simplifies actuation',
      'Straight-through full-port design offers exceptionally high flow coefficients (Cv)',
      'Self-cleaning seat mechanism wipes debris during rotation'
    ],
    limitations: [
      'Prone to seat deformation if left partially open (throttling triggers seat washout)',
      'Soft polymer seats limit operating temperatures to approximately 200°C (392°F)',
      'Traps process fluid inside the body cavity when closed, risking overpressure if heated'
    ],
    components: [
      { name: 'Floating Ball', function: 'Bored sphere that blocks or permits flow.', typicalMaterials: ['ASTM A351 CF8M', 'Carbon Steel with ENP (Electroless Nickel Plating)'] },
      { name: 'Seat Seals', function: 'Polymer rings that cradle the ball and seal under fluid pressure.', typicalMaterials: ['PTFE', 'RPTFE (Reinforced PTFE)', 'PEEK (for higher pressure/temp)'] },
      { name: 'Stem', function: 'Rotates the ball, designed with an internal shoulder to be blowout-proof.', typicalMaterials: ['ASTM A276 Type 316', 'Monel K500'] },
      { name: 'Body Gaskets', function: 'Static seals preventing leakage at body splits.', typicalMaterials: ['Flexible Graphite', 'Spiral Wound SS316 with Graphite'] }
    ],
    materials: {
      body: ['ASTM A216 WCB', 'ASTM A351 CF8M', 'ASTM A105 (Forged Steel)'],
      trim: ['SS316 Ball & Stem', 'PTFE Seats', 'Devlon'],
      seals: ['Viton O-Rings', 'HNBR', 'Flexible Graphite fire-safe packing']
    },
    standards: [
      'API 6D (Specification for Pipeline Valves)',
      'ISO 17292 (Metal Ball Valves for Petroleum, Petrochemical and Allied Industries)',
      'API 607 (Fire Test for Soft-Seated Quarter-Turn Valves)',
      'ASME B16.34 (Valves - Flanged, Threaded, and Welding End)'
    ],
    maintenance: [
      { interval: 'Quarterly', action: 'Cycle the valve fully open and closed.', rationale: 'Clears accumulated particulate sediment from soft seat crevices to prevent scoring.' },
      { interval: 'Annually', action: 'Inspect stem seal area and check for leaks using soap solution.', rationale: 'Detects packing degradation early to prevent environmental fugitive leaks.' },
      { interval: 'Major Shutdown', action: 'Disassemble, clean the body cavity, and replace seats and stem seals.', rationale: 'Restores the original sealing elasticity and torque profile of the valve.' }
    ],
    failureModes: [
      { mode: 'Seat Cutting / Tearing', cause: 'Fluid particulates score the soft polymer seats during opening/closing under high differential pressure.', prevention: 'Install metal-seated ball valves or filter process fluid upstream.' },
      { mode: 'Stem Leakage', cause: 'Repeated rotary cycles wear down the stem packing rings.', prevention: 'Adjust the packing gland or use live-loaded Belleville springs.' },
      { mode: 'Bonnet/Cavity Overpressure', cause: 'Liquid trapped in the ball cavity vaporizes due to external heating, expanding and blowing out seats.', prevention: 'Install a cavity relief valve or drill a vent hole on the upstream side of the ball.' }
    ],
    comparison: {
      summary: 'Compared to Gate Valves, Ball Valves offer much faster operational speeds and compact sizes but are more expensive in larger diameters and are temperature-restricted by polymer seats.',
      metrics: [
        { parameter: 'Operational Stroke', thisValveValue: 'Fast (90-degree rotary travel)', alternativeValveName: 'Wedge Gate Valve', alternativeValveValue: 'Slow (Multi-turn linear travel)' },
        { parameter: 'Temperature Boundary', thisValveValue: 'Medium (Up to 200°C with PTFE / 260°C with PEEK)', alternativeValveName: 'Wedge Gate Valve', alternativeValveValue: 'Very High (Up to 538°C with metal-to-metal seats)' },
        { parameter: 'Fluid Retention', thisValveValue: 'Traps fluid inside the body cavity', alternativeValveName: 'Standard Globe Valve', alternativeValveValue: 'Continuous flow, no cavity trapping' }
      ]
    }
  },
  'globe-valve-standard': {
    id: 'globe-valve-standard',
    name: 'Standard Globe Valve',
    category: 'Control',
    subcategory: 'Globe',
    overview: 'A Standard Globe Valve utilizes a spherical body cavity containing a Z-shaped flow path. Designed specifically for regulating, throttling, and controlling fluid flow rates. Unlike gate valves, the disc of a globe valve can be positioned at any point along its stroke to achieve precise flow characteristics. The tortuous Z-path forces the fluid to change direction twice, creating a high pressure drop and turbulence, which aids in stable control but increases energy losses.',
    workingPrinciple: 'A contoured plug or disc is mounted at the end of the stem. The stem drives the plug linearly perpendicular to a flat or tapered seat ring centered inside the flow cavity. As the plug moves closer to the seat ring, the annular flow area decreases, throttling flow. The linear distance between plug and seat directly determines the flow rate, allowing predictable control loops.',
    applications: [
      'Boiler feed water flow control and bypass loops',
      'High-pressure steam turbine bypass and pressure reduction stations',
      'Chemical reactor ingredient proportioning and dosing manifolds',
      'Auxiliary cooling water regulating lines'
    ],
    advantages: [
      'Exceptional flow throttling precision and rangeability',
      'Short stem stroke relative to gate valves reduces actuation time',
      'Easy inline maintenance and refurbishment of seat and plug'
    ],
    limitations: [
      'High inherent pressure drop (large head loss) across the body',
      'Requires substantial actuator stem load to seal against high differential pressure',
      'Highly susceptible to cavitation and erosion under high pressure drops'
    ],
    components: [
      { name: 'Contoured Plug', function: 'The linear regulating member that alters the flow orifice area.', typicalMaterials: ['ASTM A182 F316 with Stellite Overlay', 'CF8M'] },
      { name: 'Seat Ring', function: 'The stationary orifice insert that the plug seats into.', typicalMaterials: ['Carbon Steel with Stellite 6', 'Stainless Steel 316'] },
      { name: 'Stem', function: 'Transmits linear thrust and positioning force to the plug.', typicalMaterials: ['ASTM A276 Type 316', '17-4PH Stainless Steel'] },
      { name: 'Bonnet', function: 'Clamps to the body and houses the stuffing box and packing compression rings.', typicalMaterials: ['ASTM A216 WCB', 'ASTM A351 CF8M'] }
    ],
    materials: {
      body: ['ASTM A216 WCB (Carbon Steel)', 'ASTM A351 CF8M (316 Stainless Steel)', 'ASTM A217 WC6 (Chrome-Moly Steel for high-temp steam)'],
      trim: ['Stellite 6 faced Stainless Steel', 'CF8M', 'Hastelloy C'],
      seals: ['Flexible Graphite Packing', 'V-Ring PTFE', 'Kammprofile Gaskets']
    },
    standards: [
      'BS 1873 (Steel Globe Stop and Check Valves for Petroleum, Petrochemical and Allied Industries)',
      'ASME B16.34 (Valves - Flanged, Threaded, and Welding End)',
      'API 623 (Steel Globe Valves - Flanged and Butt-welding Ends, Bolted Bonnets)',
      'ISA 75.01 (Flow Equations for Sizing Control Valves)'
    ],
    maintenance: [
      { interval: 'Monthly', action: 'Inspect the stem packing area and check for leaks using a sniffer/visual inspect.', rationale: 'Detects early packing degradation to protect the stem and bonnet from erosion.' },
      { interval: 'Annually', action: 'Check actuator calibration and stroke limits, ensuring exact seat alignment.', rationale: 'Prevents seat crushing or leakage caused by misaligned actuator stroke settings.' },
      { interval: 'Overhaul Shutdown', action: 'Lap the plug and seat ring interfaces using a fine abrasive compound.', rationale: 'Restores the flat, metal-to-metal seating profile to ensure Class IV/V shutoff tightness.' }
    ],
    failureModes: [
      { mode: 'Seat Erosion (Cavitation)', cause: 'High velocity flow and cavitation bubbles collapse near the seat during throttling, eating the metal.', prevention: 'Install multi-stage anti-cavitation trim (cages).' },
      { mode: 'Stem Galling / Locking', cause: 'High operating torque and lack of lubrication binds stem threads inside the yoke nut.', prevention: 'Perform routine greasing and keep the stem protected with a dust boot.' },
      { mode: 'Flow Leakage at Seat', cause: 'Debris or scale gets trapped between the plug and seat ring, preventing full closure.', prevention: 'Install an upstream strainer or clean the trim.' }
    ],
    comparison: {
      summary: 'Compared to Ball Valves, Globe Valves offer much better throttling control but require significantly higher operating torque and cause a higher pressure drop.',
      metrics: [
        { parameter: 'Flow Regulation', thisValveValue: 'Excellent (Highly linear contoured trim)', alternativeValveName: 'Floating Ball Valve', alternativeValveValue: 'Poor (Throttling scours polymer seats)' },
        { parameter: 'Pressure Drop (Delta P)', thisValveValue: 'High (Fluid turns twice through Z-body)', alternativeValveName: 'Floating Ball Valve', alternativeValveValue: 'Near Zero (Straight full-port bore)' },
        { parameter: 'Operating Force', thisValveValue: 'High linear thrust required to seat against pressure', alternativeValveName: 'Floating Ball Valve', alternativeValveValue: 'Low rotary torque needed' }
      ]
    }
  },
  'check-valve-swing': {
    id: 'check-valve-swing',
    name: 'Swing Check Valve',
    category: 'Check',
    subcategory: 'Check',
    overview: 'A Swing Check Valve is an automatic, self-operating valve designed to prevent backflow in piping networks. It utilizes a pivoting flap (disc or clapper) suspended from a hinge pin near the top of the flow passage. In the forward flow direction, fluid velocity pushes the disc open, allowing flow. When flow stops or reverses, gravity and downstream pressure swing the disc back onto the seat, blocking the reverse flow immediately.',
    workingPrinciple: 'The valve operates strictly based on line pressure differential. Forward flow creates pressure that overcomes the weight of the disc, swinging it upward and out of the path. When forward flow slows down or pressure drops below the cracking pressure, the disc swings downward due to gravity. Any backward flow pushes the disc firmly against the body seat, utilizing the reverse fluid pressure to tighten the seal.',
    applications: [
      'Pump discharge pipelines (preventing back-spin on shutdown)',
      'Municipal wastewater and sewage lift systems',
      'Water treatment plant feed pipelines',
      'Fire protection piping distribution networks'
    ],
    advantages: [
      'Self-acting design requires no external power or control signals',
      'Low flow resistance compared to piston check valves',
      'Simple, durable mechanical construction with few moving parts'
    ],
    limitations: [
      'Prone to severe "water hammer" slamming if flow reverses rapidly',
      'Cannot be installed in vertical piping with downward flow',
      'Hinge pins and bushings are susceptible to wear in turbulent systems'
    ],
    components: [
      { name: 'Disc (Clapper)', function: 'The pivoting closure element that swings to block or allow flow.', typicalMaterials: ['ASTM A216 WCB', 'CF8M Stainless Steel'] },
      { name: 'Hinge Pin', function: 'The shaft from which the disc assembly is suspended.', typicalMaterials: ['ASTM A276 Type 410', 'SS316'] },
      { name: 'Hinge Arm', function: 'Connects the clapper to the hinge pin, enabling swing movement.', typicalMaterials: ['ASTM A216 WCB', 'SS316'] },
      { name: 'Body Seat Ring', function: 'The seating face where the clapper rests in the closed position.', typicalMaterials: ['Stellite 6 faced WCB', 'PTFE (for low-pressure soft seat)'] }
    ],
    materials: {
      body: ['ASTM A216 WCB', 'ASTM A351 CF8M', 'ASTM A48 Class 30 (Cast Iron for low pressure)'],
      trim: ['SS316 Disc & Pin', 'Stellite 6 Seats', '13% Chrome Steel'],
      seals: ['Flexible Graphite Bonnet Gasket', 'EPDM/Viton Soft Seat Inserts (optional)']
    },
    standards: [
      'BS 1868 (Steel Check Valves for Petroleum, Petrochemical and Allied Industries)',
      'API 594 (Thin-Plate, Wafer-Type, and Dual-Plate Check Valves)',
      'API 598 (Valve Testing)',
      'ASME B16.34 (Valves - Flanged, Threaded, and Welding End)'
    ],
    maintenance: [
      { interval: 'Annually', action: 'Inspect the hinge pin clearance and check for bushing wear.', rationale: 'Prevents hinge arm misalignment which causes seat leakage and disc sticking.' },
      { interval: 'Major Shutdown', action: 'Inspect clapper face for scoring, and check bonnet gasket integrity.', rationale: 'Ensures the valve continues to seal against backflow and prevents external leaks.' },
      { interval: 'As Required', action: 'Lap the seat ring and clapper face to restore flatness.', rationale: 'Restores metal-to-metal sealing and reduces reverse leakage rates.' }
    ],
    failureModes: [
      { mode: 'Valve Slamming (Water Hammer)', cause: 'Rapid flow reversal catches the disc in a fully open position, slamming it shut violently against the seat.', prevention: 'Install spring-assisted or damper-controlled swing checks.' },
      { mode: 'Hinge Pin Wear / Shearing', cause: 'Constant flow turbulence vibrates the clapper, causing friction wear on the hinge pin.', prevention: 'Limit flow velocities below standard limits (e.g. 3-4 m/s).' },
      { mode: 'Seat Leakage', cause: 'Debris caught between clapper and seat, or wear of sealing faces.', prevention: 'Install strainers upstream, or use soft-seated clappers in low-pressure services.' }
    ],
    comparison: {
      summary: 'Compared to Lift (Piston) Check Valves, Swing Check Valves offer much higher flow capacity and lower cracking pressure but are more prone to water hammer slamming.',
      metrics: [
        { parameter: 'Flow Capacity (Cv)', thisValveValue: 'High (Unobstructed swing path)', alternativeValveName: 'Lift Check Valve', alternativeValveValue: 'Medium (Tortuous piston path)' },
        { parameter: 'Water Hammer Risk', thisValveValue: 'High (Slow closure allows flow reverse build-up)', alternativeValveName: 'Nozzle Check Valve', alternativeValveValue: 'Extremely Low (Spring-assisted fast shutoff)' },
        { parameter: 'Installation Orientation', thisValveValue: 'Horizontal or Vertical upward flow', alternativeValveName: 'Lift Check Valve', alternativeValveValue: 'Strictly Horizontal only' }
      ]
    }
  },
  'diaphragm-valve': {
    id: 'diaphragm-valve',
    name: 'Weir Diaphragm Valve',
    category: 'Isolation',
    subcategory: 'Diaphragm',
    overview: 'A Diaphragm Valve uses a flexible elastomeric or PTFE membrane that is pressed down onto a raised weir cast into the body to throttle or shut off flow. Because the diaphragm completely isolates the working parts (stem, bonnet, compressor) from the process fluid, there are no leak paths to atmosphere and no crevices to trap product. This makes it the valve of choice for corrosive, abrasive, sanitary, and ultra-pure services where contamination or stem leakage cannot be tolerated.',
    workingPrinciple: 'The handwheel drives a non-wetted stem, which lowers a compressor saddle onto the back of the diaphragm. The diaphragm flexes downward until it seals against the weir, blocking the flow path. Because the seal is made by the flexible membrane rather than tight metal clearances, the valve tolerates suspended solids and offers good throttling for low-pressure service. The body is typically lined with rubber, glass, or PFA for chemical resistance.',
    applications: [
      'Pharmaceutical and biotech sterile process lines',
      'Corrosive acid and caustic chemical dosing',
      'Slurry, pulp and abrasive media handling',
      'Food, beverage and ultra-pure water systems'
    ],
    advantages: [
      'Complete isolation of fluid from stem and bonnet (zero fugitive emissions)',
      'Excellent for slurries, abrasives and corrosive media',
      'No crevices — fully drainable and easy to sterilise (CIP/SIP)'
    ],
    limitations: [
      'Limited to relatively low pressure and temperature (diaphragm-bound)',
      'Diaphragm is a wear item requiring periodic replacement',
      'Not bi-directional pressure rated like metal-seated valves'
    ],
    components: [
      { name: 'Flexible Diaphragm', function: 'Acts as both the closure member and the primary seal, flexing onto the weir.', typicalMaterials: ['EPDM', 'PTFE-faced EPDM', 'Butyl Rubber'] },
      { name: 'Weir', function: 'A raised dam in the body that the diaphragm seals against, reducing travel.', typicalMaterials: ['Rubber-lined Cast Iron', 'PFA-lined Steel', 'CF8M'] },
      { name: 'Compressor', function: 'Spreads stem thrust evenly across the diaphragm back.', typicalMaterials: ['Aluminium', 'Ductile Iron'] },
      { name: 'Stem', function: 'Non-wetted stem transmitting handwheel motion to the compressor.', typicalMaterials: ['SS304', 'SS316'] }
    ],
    materials: {
      body: ['Rubber-Lined Cast Iron', 'PFA/PTFE-Lined Carbon Steel', 'ASTM A351 CF8M', 'Glass-Lined Steel'],
      trim: ['EPDM Diaphragm', 'PTFE-faced Diaphragm', 'Aluminium Compressor'],
      seals: ['Integral Diaphragm Seal', 'EPDM Bonnet Gasket']
    },
    standards: [
      'BS EN 13397 (Metallic Diaphragm Valves)',
      'ASME BPE (Bioprocessing Equipment — sanitary service)',
      'API 598 (Valve Inspection and Testing)',
      'ISO 16138 (Industrial Valves — Diaphragm Valves)'
    ],
    maintenance: [
      { interval: 'Per Cycle Count', action: 'Replace the diaphragm at the manufacturer-rated cycle life.', rationale: 'Diaphragm fatigue is the primary failure mode; proactive replacement prevents rupture.' },
      { interval: 'Annually', action: 'Inspect the weir and body lining for wear or chemical attack.', rationale: 'A scored weir or damaged lining prevents tight shutoff and risks body corrosion.' },
      { interval: 'After Sterilisation Cycles', action: 'Verify diaphragm elasticity and torque settings.', rationale: 'Repeated SIP/CIP thermal cycling hardens elastomers, reducing seal integrity.' }
    ],
    failureModes: [
      { mode: 'Diaphragm Rupture', cause: 'Fatigue from cycling, over-tightening, or chemical/thermal degradation.', prevention: 'Replace on schedule, set correct closing torque, and select the right diaphragm compound.' },
      { mode: 'Weir Erosion', cause: 'Abrasive slurry gradually wears the sealing edge of the weir.', prevention: 'Use hard linings and limit flow velocity in abrasive service.' },
      { mode: 'Cold Flow / Creep (PTFE)', cause: 'PTFE diaphragms cold-flow under sustained load, losing seal.', prevention: 'Use backed PTFE diaphragms and re-torque after initial bedding-in.' }
    ],
    comparison: {
      summary: 'Compared to Ball Valves, Diaphragm Valves provide unmatched purity and corrosion isolation but are far more limited in pressure and temperature.',
      metrics: [
        { parameter: 'Fluid Purity / Containment', thisValveValue: 'Excellent (fully isolated, crevice-free)', alternativeValveName: 'Floating Ball Valve', alternativeValveValue: 'Moderate (body cavity traps fluid)' },
        { parameter: 'Pressure / Temp Rating', thisValveValue: 'Low (diaphragm-limited)', alternativeValveName: 'Wedge Gate Valve', alternativeValveValue: 'Very High (metal-to-metal)' },
        { parameter: 'Slurry / Abrasive Handling', thisValveValue: 'Excellent (no tight clearances)', alternativeValveName: 'Standard Globe Valve', alternativeValveValue: 'Poor (trim erosion)' }
      ]
    }
  },
  'plug-valve-lubricated': {
    id: 'plug-valve-lubricated',
    name: 'Lubricated Plug Valve',
    category: 'Isolation',
    subcategory: 'Plug',
    overview: 'A Lubricated Plug Valve is a quarter-turn rotary valve using a tapered (or cylindrical) plug with a through-port that rotates within a matching body bore. A sealant injected between the plug and body forms a hydraulic film that both seals and lubricates the large contact area, giving low operating torque and excellent shutoff. Plug valves are compact, fast-acting, and well suited to dirty, viscous, and gas service where their full contact sealing resists leakage.',
    workingPrinciple: 'A wrench or gear operator rotates the plug 90 degrees. When the through-port aligns with the body bore, fluid flows straight through; rotating the solid face of the plug across the bore shuts it off. Sealant injected through a fitting at the top is forced into grooves around the plug, lifting it slightly to reduce friction and renewing the seal film along the entire tapered contact surface.',
    applications: [
      'Natural gas gathering and distribution manifolds',
      'Refinery and petrochemical block service',
      'Viscous, tarry, or slurry hydrocarbon lines',
      'Pipeline diverting (multi-port) applications'
    ],
    advantages: [
      'Compact body with very fast quarter-turn operation',
      'Full plug-to-body contact gives excellent tight shutoff',
      'Sealant injection renews sealing and frees a stuck plug'
    ],
    limitations: [
      'Requires periodic sealant injection and maintenance',
      'Higher operating torque than ball valves in large sizes',
      'Sealant can contaminate process fluid if incompatible'
    ],
    components: [
      { name: 'Tapered Plug', function: 'Rotating closure with a through-port that aligns or blocks the bore.', typicalMaterials: ['Carbon Steel + ENP', 'CF8M', 'Nitrided Alloy'] },
      { name: 'Body', function: 'Houses the tapered seat bore and end connections.', typicalMaterials: ['ASTM A216 WCB', 'ASTM A105', 'CF8M'] },
      { name: 'Sealant System', function: 'Injects lubricant film between plug and body to seal and reduce torque.', typicalMaterials: ['Grease-based Sealant', 'PTFE Compound'] },
      { name: 'Bottom Cap / Adjuster', function: 'Retains the plug and sets plug-to-body clearance.', typicalMaterials: ['Forged Steel', 'Stainless Steel'] }
    ],
    materials: {
      body: ['ASTM A216 WCB', 'ASTM A105 (Forged)', 'ASTM A351 CF8M'],
      trim: ['ENP Carbon Steel Plug', 'Nitrided Plug', 'CF8M Plug'],
      seals: ['Injected Sealant Film', 'PTFE Sleeve (non-lubricated variant)', 'Viton O-Rings']
    },
    standards: [
      'API 599 (Metal Plug Valves — Flanged, Threaded and Welding Ends)',
      'API 6D (Pipeline Valves)',
      'ASME B16.34 (Valves — Flanged, Threaded, and Welding End)',
      'API 598 (Valve Inspection and Testing)'
    ],
    maintenance: [
      { interval: 'Monthly / Quarterly', action: 'Inject fresh sealant and operate the plug through a full cycle.', rationale: 'Maintains the sealing film and prevents the plug from seizing in the body.' },
      { interval: 'Annually', action: 'Check sealant system check-valves and fittings for blockage.', rationale: 'A blocked injection path prevents reseating the plug and renewing the seal.' },
      { interval: 'Overhaul Shutdown', action: 'Disassemble, clean old hardened sealant, and re-lap the plug taper.', rationale: 'Restores a uniform contact surface for low-torque, leak-tight operation.' }
    ],
    failureModes: [
      { mode: 'Plug Seizure', cause: 'Sealant dries out or is not replenished, galling the plug to the body taper.', prevention: 'Adhere to the sealant injection schedule and use the correct sealant grade.' },
      { mode: 'Seat Leakage', cause: 'Worn or scored plug taper, or loss of sealant film.', prevention: 'Re-inject sealant; re-lap or replace the plug at overhaul.' },
      { mode: 'Sealant Contamination', cause: 'Incompatible sealant migrates into the process stream.', prevention: 'Select process-compatible sealant or use a non-lubricated sleeved plug valve.' }
    ],
    comparison: {
      summary: 'Compared to Floating Ball Valves, Lubricated Plug Valves offer superior tight shutoff in dirty and gas service but demand ongoing sealant maintenance.',
      metrics: [
        { parameter: 'Shutoff in Dirty/Gas Service', thisValveValue: 'Excellent (full-contact sealing)', alternativeValveName: 'Floating Ball Valve', alternativeValveValue: 'Good (soft seats, but seat wear)' },
        { parameter: 'Maintenance Demand', thisValveValue: 'High (periodic sealant injection)', alternativeValveName: 'Floating Ball Valve', alternativeValveValue: 'Low (maintenance-free seats)' },
        { parameter: 'Operating Torque (large bore)', thisValveValue: 'Moderate–High', alternativeValveName: 'Triple Offset Butterfly Valve', alternativeValveValue: 'Low (balanced rotary)' }
      ]
    }
  },
  'needle-valve': {
    id: 'needle-valve',
    name: 'Needle Valve',
    category: 'Control',
    subcategory: 'Needle',
    overview: 'A Needle Valve is a precision throttling valve using a long, slender, sharply tapered plug (the "needle") that advances into a small matched seat orifice via a fine-pitch threaded stem. The many turns required for a tiny change in orifice area give exceptionally fine, repeatable flow control of low flow rates. Needle valves are the workhorse of instrumentation, sampling, calibration, and metering systems where precise adjustment of small flows or pressures is essential.',
    workingPrinciple: 'Rotating the knurled handle turns a fine-thread stem that drives the tapered needle linearly toward or away from the seat. Because the thread pitch is fine and the needle taper is gradual, a full handle turn changes the annular flow area only slightly, allowing micro-adjustment. Fully seated, the needle point closes the orifice for positive shutoff; backed off, it meters a precisely controlled trickle of flow.',
    applications: [
      'Instrument and gauge isolation / snubbing',
      'Sample and analyser take-off lines',
      'Calibration rigs and laboratory flow metering',
      'Hydraulic and pneumatic bleed / pilot lines'
    ],
    advantages: [
      'Very fine, repeatable control of small flow rates',
      'Compact forged construction rated for high pressure',
      'Positive tight shutoff plus metering in one device'
    ],
    limitations: [
      'Only suitable for low flow rates (small orifice)',
      'High pressure drop — not for bulk flow',
      'Needle tip and seat are easily damaged by particulates'
    ],
    components: [
      { name: 'Tapered Needle', function: 'Slender tapered plug that meters flow with high precision.', typicalMaterials: ['17-4PH Stainless', 'Hardened 316 SS'] },
      { name: 'Fine-Thread Stem', function: 'Converts many handle turns into small, precise needle travel.', typicalMaterials: ['SS316', 'Monel'] },
      { name: 'Seat Orifice', function: 'Small honed bore the needle closes against.', typicalMaterials: ['Hardened Stainless Steel', 'Stellite-faced'] },
      { name: 'Packing', function: 'Seals the stem penetration against high-pressure leakage.', typicalMaterials: ['PTFE', 'Grafoil'] }
    ],
    materials: {
      body: ['Forged 316 Stainless Steel', 'Monel 400', 'Hastelloy C-276', 'Brass (low pressure)'],
      trim: ['17-4PH Needle', 'Stellite-faced Seat', 'Hardened 316 SS'],
      seals: ['PTFE Packing', 'Grafoil Packing', 'Viton O-Rings']
    },
    standards: [
      'ASME B16.34 (Valves — Pressure-Temperature Ratings)',
      'API 598 (Valve Inspection and Testing)',
      'ISO 15848 (Fugitive Emissions)',
      'NACE MR0175 (Sour Service Materials)'
    ],
    maintenance: [
      { interval: 'Annually', action: 'Inspect needle tip and seat for wire-drawing or pitting.', rationale: 'A damaged needle/seat loses both metering precision and shutoff.' },
      { interval: 'As Required', action: 'Re-torque or replace stem packing on detection of seepage.', rationale: 'Fine-pitch stems leak readily under high pressure if packing relaxes.' },
      { interval: 'Per Service', action: 'Verify upstream filtration is intact.', rationale: 'Particulates are the dominant cause of needle/seat damage.' }
    ],
    failureModes: [
      { mode: 'Needle/Seat Wire-Drawing', cause: 'Throttling near closure lets high-velocity fluid erode fine channels in the tip and seat.', prevention: 'Avoid prolonged near-closed throttling; filter the fluid; replace worn trim.' },
      { mode: 'Galling of Fine Threads', cause: 'Lack of lubrication and over-torque on the fine stem thread.', prevention: 'Use anti-seize compatible lubricant and do not over-tighten at closure.' },
      { mode: 'Stem Packing Leakage', cause: 'High-pressure seepage past relaxed packing.', prevention: 'Use live-loaded packing and re-torque periodically.' }
    ],
    comparison: {
      summary: 'Compared to Globe Valves, Needle Valves give far finer low-flow metering but are restricted to very small flow rates and high pressure drops.',
      metrics: [
        { parameter: 'Low-Flow Metering Precision', thisValveValue: 'Excellent (fine thread + needle taper)', alternativeValveName: 'Standard Globe Valve', alternativeValveValue: 'Good (but coarser)' },
        { parameter: 'Flow Capacity', thisValveValue: 'Very Low (small orifice)', alternativeValveName: 'Standard Globe Valve', alternativeValveValue: 'Medium–High' },
        { parameter: 'Pressure Rating', thisValveValue: 'Very High (forged compact body)', alternativeValveName: 'Floating Ball Valve', alternativeValveValue: 'Medium (soft seats)' }
      ]
    }
  },
  'safety-valve-spring': {
    id: 'safety-valve-spring',
    name: 'Spring-Loaded Safety Valve',
    category: 'Safety',
    subcategory: 'Relief',
    overview: 'A Spring-Loaded Safety Valve is a self-acting overpressure protection device that automatically discharges fluid the instant system pressure exceeds a calibrated set point, preventing vessel or pipe rupture. A helical spring holds a disc closed against an inlet nozzle; when pressure overcomes the spring force the disc lifts. A "huddling chamber" momentarily captures additional disc area at first lift, producing the characteristic rapid "pop" to full open. The valve reseats once pressure falls below the reseating (blowdown) pressure.',
    workingPrinciple: 'System pressure acts on the disc area against the preset spring force. Below set pressure the spring keeps the valve bubble-tight. At set pressure the upward force just balances the spring; a small further rise exposes the larger huddling-chamber area, the net force jumps, and the disc pops fully open to relieve at rated capacity. As the overpressure is vented and pressure drops by the blowdown margin, the spring overcomes the reduced fluid force and snaps the disc shut.',
    applications: [
      'Steam boiler and superheater overpressure protection',
      'Pressure vessel and storage tank relief',
      'Compressor and pump discharge protection',
      'Process piping thermal-expansion relief'
    ],
    advantages: [
      'Fully self-acting — no external power or signal required',
      'Fast pop-action gives high relieving capacity instantly',
      'Field-adjustable set pressure via the spring adjuster'
    ],
    limitations: [
      'Set-pressure drifts over time and needs periodic re-certification',
      'Chattering and seat damage if oversized or with long inlet piping',
      'Spring force is back-pressure sensitive (may need a balanced bellows)'
    ],
    components: [
      { name: 'Helical Spring', function: 'Sets the relieving pressure by its calibrated preload.', typicalMaterials: ['Chrome-Vanadium Steel', 'Inconel X-750 (high temp)'] },
      { name: 'Disc & Huddling Chamber', function: 'Closure that pops open at set pressure and reseats after blowdown.', typicalMaterials: ['Stellite-faced Stainless', 'Nimonic'] },
      { name: 'Nozzle / Seat', function: 'Inlet orifice and primary seating surface; throat for relief flow.', typicalMaterials: ['Stellite-faced SS', '316 Stainless'] },
      { name: 'Adjusting Screw', function: 'Sets spring compression to dial in the set pressure.', typicalMaterials: ['Alloy Steel', 'Stainless Steel'] }
    ],
    materials: {
      body: ['ASTM A216 WCB', 'ASTM A351 CF8M', 'ASTM A352 LCB (low temp)', 'Bronze (utility)'],
      trim: ['Stellite-faced Nozzle & Disc', '316 Stainless', 'Nimonic Disc'],
      seals: ['Metal-to-Metal Seat', 'Soft O-Ring Seat (resilient seat option)', 'Spiral-Wound Body Gasket']
    },
    standards: [
      'ASME BPVC Section I & VIII (Boiler & Pressure Vessel Code)',
      'API 520 / API 526 (Sizing, Selection & Flanged Steel PRVs)',
      'API 527 (Seat Tightness of Pressure Relief Valves)',
      'ISO 4126 (Safety Devices for Protection Against Excessive Pressure)'
    ],
    maintenance: [
      { interval: 'Annually / Per Code', action: 'Bench-test and re-certify set pressure and seat tightness.', rationale: 'Regulatory requirement; spring relaxation and seat wear shift the set point.' },
      { interval: 'Per Lift Event', action: 'Inspect seat and disc after any relief discharge.', rationale: 'Pop-action and debris can score the seat, causing simmer/leakage.' },
      { interval: 'Periodically', action: 'Verify discharge piping is free-draining and unobstructed.', rationale: 'Built-up back-pressure and trapped condensate impair lift and reseating.' }
    ],
    failureModes: [
      { mode: 'Chatter', cause: 'Valve oversized or excessive inlet pressure loss (>3% rule) causing rapid open/close cycling.', prevention: 'Correctly size the valve and keep inlet line losses within code limits.' },
      { mode: 'Simmer / Seat Leakage', cause: 'Seat damage or operating too close to set pressure.', prevention: 'Maintain adequate operating margin below set; lap or replace the seat.' },
      { mode: 'Set-Point Drift', cause: 'Spring relaxation, corrosion, or fouling over time.', prevention: 'Scheduled bench testing and recertification; corrosion-resistant springs.' }
    ],
    comparison: {
      summary: 'Compared to a rupture disc, a Spring-Loaded Safety Valve recloses after relieving and is reusable, but it is more complex and can leak or chatter if misapplied.',
      metrics: [
        { parameter: 'Reclosing After Relief', thisValveValue: 'Yes (reseats after blowdown)', alternativeValveName: 'Rupture Disc', alternativeValveValue: 'No (one-shot, must be replaced)' },
        { parameter: 'Set-Point Accuracy', thisValveValue: 'High (adjustable spring)', alternativeValveName: 'Rupture Disc', alternativeValveValue: 'Moderate (burst tolerance band)' },
        { parameter: 'Leak Tightness Near Set', thisValveValue: 'Can simmer near set pressure', alternativeValveName: 'Rupture Disc', alternativeValveValue: 'Zero leakage until burst' }
      ]
    }
  },
  'air-release-valve': {
    id: 'air-release-valve',
    name: 'Automatic Air Release Valve',
    category: 'Air',
    subcategory: 'Air Release',
    overview: 'An Automatic Air Release Valve continuously vents the small pockets of air that come out of solution and accumulate at the high points of pressurised water pipelines. A buoyant float inside a chamber rides the water level; as air collects, the water level (and float) drops, opening a small orifice that exhausts the air to atmosphere. Once the air is expelled, water refills the chamber, the float rises, and the orifice reseals — all automatically under full line pressure.',
    workingPrinciple: 'Under normal operation the chamber is full of water and the float is buoyed up, pressing a lever-actuated seal against the small discharge orifice. As dissolved air separates and gathers at the top, it displaces water downward; the float follows the falling level until the lever lifts the seal off the orifice. The pressurised air escapes through the small orifice; water then rises again, lifting the float to reseal before water can be lost. The small orifice is deliberately sized to release air without venting the much denser water.',
    applications: [
      'High points along water transmission mains',
      'Peaks of long inclined pipelines',
      'Pump stations and treatment plant headers',
      'Irrigation and wastewater force mains'
    ],
    advantages: [
      'Operates automatically and continuously under full line pressure',
      'Prevents air-binding that throttles flow and wastes pump energy',
      'Compact, simple, self-cleaning float mechanism'
    ],
    limitations: [
      'Small orifice gives limited venting capacity (air-release only)',
      'Float seat can clog in dirty, sticky, or slurry fluids',
      'Single-function — cannot admit large volumes during draining (needs an air/vacuum valve)'
    ],
    components: [
      { name: 'Float Ball', function: 'Buoyant element that follows the liquid level to open/close the orifice.', typicalMaterials: ['Hollow Stainless Steel', 'Reinforced Polypropylene'] },
      { name: 'Discharge Orifice', function: 'Small calibrated port that vents accumulated air to atmosphere.', typicalMaterials: ['Stainless Steel', 'Brass'] },
      { name: 'Orifice Seat', function: 'Soft seat the float lever presses against to seal the orifice.', typicalMaterials: ['EPDM', 'Buna-N', 'Viton'] },
      { name: 'Lever Mechanism', function: 'Multiplies float buoyancy to seal against line pressure.', typicalMaterials: ['Stainless Steel', 'Acetal'] }
    ],
    materials: {
      body: ['Ductile Iron (epoxy coated)', 'Reinforced Nylon', 'ASTM A351 CF8M', 'Bronze'],
      trim: ['Stainless Steel Float & Lever', 'Brass Orifice', 'Acetal Guides'],
      seals: ['EPDM Orifice Seat', 'Buna-N O-Rings', 'Viton (chemical service)']
    },
    standards: [
      'AWWA C512 (Air-Release, Air/Vacuum and Combination Air Valves)',
      'EN 1074-4 (Valves for Water Supply — Air Valves)',
      'API 598 (Valve Inspection and Testing)',
      'ISO 9001 (Quality Management — manufacture)'
    ],
    maintenance: [
      { interval: 'Quarterly', action: 'Isolate, depressurise and flush the chamber and float.', rationale: 'Removes grit and biofilm that can stick the float and block the orifice.' },
      { interval: 'Annually', action: 'Inspect the orifice seat and float for wear or waterlogging.', rationale: 'A worn seat leaks water; a waterlogged float fails to reseal.' },
      { interval: 'As Required', action: 'Verify the isolating valve beneath the air valve operates freely.', rationale: 'Allows safe servicing without draining the main.' }
    ],
    failureModes: [
      { mode: 'Orifice Clogging', cause: 'Debris, slime, or slurry lodges on the float/seat preventing sealing or venting.', prevention: 'Regular flushing; select larger orifice or wastewater-pattern valves for dirty fluids.' },
      { mode: 'Continuous Water Spitting', cause: 'Worn or fouled seat lets water leak through the air orifice.', prevention: 'Replace the seat; clean the float and lever pivot.' },
      { mode: 'Float Waterlogging / Collapse', cause: 'Pressure surge collapses a hollow float or cracks it, flooding it.', prevention: 'Use surge-rated solid or reinforced floats; control transients.' }
    ],
    comparison: {
      summary: 'Compared to a large-orifice Air/Vacuum Valve, the Air Release Valve continuously vents small air pockets under pressure but cannot handle the bulk air flows during pipe filling or draining.',
      metrics: [
        { parameter: 'Venting Under Pressure', thisValveValue: 'Continuous (small orifice)', alternativeValveName: 'Air/Vacuum Valve', alternativeValveValue: 'Closes under pressure (no continuous vent)' },
        { parameter: 'Bulk Air Capacity (fill/drain)', thisValveValue: 'Low', alternativeValveName: 'Air/Vacuum Valve', alternativeValveValue: 'Very High (large orifice)' },
        { parameter: 'Function', thisValveValue: 'Releases accumulated air in service', alternativeValveName: 'Combination Air Valve', alternativeValveValue: 'Both functions in one body' }
      ]
    }
  }
};

