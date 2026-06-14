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
  }
};

