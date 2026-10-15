// Plant equipment shown in the Equipment Lab. Each model is a self-contained
// three.js viewer served from /public/viewers and embedded in an iframe.

export interface EquipmentStat {
  value: string;
  unit?: string;
  label: string;
}

export interface EquipmentFeature {
  title: string;
  text: string;
}

export interface EquipmentModel {
  id: string;
  name: string;
  category: string;
  tagline: string;
  summary: string;
  viewerSrc: string;
  stats: EquipmentStat[];
  features: EquipmentFeature[];
  learn: string[];
  note: string;
}

export const EQUIPMENT: Record<string, EquipmentModel> = {
  'vertical-turbine-pump': {
    id: 'vertical-turbine-pump',
    name: 'Vertical Turbine Pump',
    category: 'Pumps',
    tagline: 'A nine-stage raw water intake pump you can take apart, cut open and run.',
    summary:
      'A vertical turbine (VT) pump is a multistage centrifugal pump stood on end. The motor sits on the pump-house floor while the bowl assembly with its impellers hangs deep in the sump, joined by a long line shaft inside the column pipe. Every part of this model can be clicked, isolated and studied.',
    viewerSrc: '/viewers/vertical-turbine-pump.html',
    stats: [
      { value: '626', unit: 'm³/h', label: 'Rated capacity' },
      { value: '250', unit: 'm', label: 'Total dynamic head' },
      { value: '9', label: 'Stages' },
      { value: '650', unit: 'kW', label: 'Motor rating' },
      { value: '1482', unit: 'rpm', label: 'Speed' },
      { value: '15.77', unit: 'm', label: 'Floor to pump bottom' },
    ],
    features: [
      { title: 'Guided tour', text: 'An 11-step walkthrough from the motor down to the suction bell.' },
      { title: 'Section & X-ray', text: 'Cut away the front half or make casings see-through to look inside.' },
      { title: 'Exploded view', text: 'Slide the parts apart to see how the assemblies stack together.' },
      { title: 'Run mode', text: 'Spin the shaft and watch water rise through the bowls and column.' },
      { title: 'Water levels', text: 'Show maximum and minimum sump levels and the submergence they leave.' },
      { title: 'Parts & dimensions', text: 'Search the parts list, isolate any part and show key dimensions.' },
    ],
    learn: [
      'Motor, coupling and adjusting nut',
      'Thrust bearing housing',
      'Surface discharge head',
      'Packing box: sealing the shaft',
      'Flanged column joints',
      'Line shaft and water-lubricated bearings',
      'Bowl assembly and closed impellers',
      'Strainer, suction bell and submergence',
    ],
    note: 'Illustrative model of a typical raw water intake pump. Parts that are not dimensioned on a general arrangement drawing are drawn at typical proportions.',
  },
};

EQUIPMENT['raw-water-pumping-station'] = {
  id: 'raw-water-pumping-station',
  name: 'Raw Water Pumping Station',
  category: 'Pumping stations',
  tagline: 'River intake to pumping main — run the pumps, open the gates and valves, and watch the water move.',
  summary:
    'A complete river intake pumping station: an RCC intake well with multi-level ports, screens and sluice gates; two 800 mm Hume pipes carrying water by gravity to an 8 m jack well; three vertical turbine pumps (two working, one standby) with their reflux valves, butterfly valves and dismantling joints; a 600 mm header, outlet valves, surge relief valve and pumping main; plus the 7.5 t EOT crane, ladders, ventilation and local controls.',
  viewerSrc: '/viewers/pumping-station.html',
  stats: [
    { value: '1252', unit: 'm³/h', label: 'Station output' },
    { value: '250', unit: 'm', label: 'Pumping head' },
    { value: '3 × 650', unit: 'kW', label: 'VT pumps (2W + 1S)' },
    { value: '8.0', unit: 'm', label: 'Jack well diameter' },
    { value: '2 × 800', unit: 'mm', label: 'Gravity Hume pipes' },
    { value: '7.5', unit: 't', label: 'EOT crane' },
  ],
  features: [
    { title: 'Operate panel', text: 'Start, stop and emergency-stop each pump, open and close gates and valves, and change the river level.' },
    { title: 'Live simulation', text: 'Water levels, flows, pressures and gauges respond — including the low-level trip and the surge relief valve.' },
    { title: 'Guided tour', text: 'A 14-step walk from the river to the pumping main, including a crane lifting a motor out.' },
    { title: 'Section & X-ray', text: 'Cut the wells and pipes in half or see through concrete to follow the flow inside.' },
    { title: 'Every part explained', text: 'Click any of about 100 parts for what it does, how it works, key data, maintenance and safety.' },
    { title: 'Building views', text: 'Show the pump house complete, cut away or without walls.' },
  ],
  learn: [
    'Intake well, multi-level ports and bar screens',
    'Sluice gates and headstocks',
    'Gravity flow through Hume pipes',
    'Jack well and pump submergence',
    'Vertical turbine pumps and motors',
    'Bellows, reflux valves and butterfly valves',
    'Header, bypass, sluice valve and air valve',
    'Surge relief and the EOT crane',
  ],
  note: 'Illustrative model of a typical raw-water intake pumping station. Sizes follow the project documents where given; other parts are drawn at typical proportions.',
};

EQUIPMENT['raw-water-intake-site'] = {
  id: 'raw-water-intake-site',
  name: 'Raw Water Intake — Complete Site',
  category: 'Pumping stations',
  tagline: 'Walk through the whole intake compound, from the 33 kV line at the gate to the intake well in the river, by day or by night.',
  summary:
    'The complete permanent site around a river intake, laid out on a real plot shape of about 1800 m²: the intake well and footbridge in the river, the pump house over the jack well, a 33 kV overhead line and DP structure, HT metering, the 33 kV breaker, a 2500 kVA 33/6.6 kV transformer yard, the HT room with 6.6 kV switchboard and soft starters, the control room with LT panels, batteries, PLC and SCADA, a 20 m³ air vessel with two compressors, the buried 600 mm pumping main with five valve chambers, and the compound wall, gate, security room, road, drains, cable trench, lighting and earthing.',
  viewerSrc: '/viewers/intake-site.html',
  stats: [
    { value: '≈1800', unit: 'm²', label: 'Plot area' },
    { value: '1252', unit: 'm³/h', label: 'Station output' },
    { value: '2500', unit: 'kVA', label: '33/6.6 kV transformer' },
    { value: '3 × 650', unit: 'kW', label: 'VT pumps (2W + 1S)' },
    { value: '20', unit: 'm³', label: 'Air vessel' },
    { value: '5', label: 'Valve chambers' },
  ],
  features: [
    { title: 'Walk mode', text: 'Walk through the site at eye level with W A S D or the on-screen joystick, go up steps and into the rooms, or jump to any spot from the minimap.' },
    { title: 'Day and night', text: 'Change the time of day: the sun moves, shadows follow, and the street lights, flood lights and room lights come on at dusk.' },
    { title: 'Live SCADA screens', text: 'The SCADA desk, panel displays and flow meter show the running station live: levels, flows, pressures and pump status.' },
    { title: 'Everything running', text: 'Pumps turn, compressors cut in when the air vessel needs air, valves and panel lamps follow the simulation, and there is sound you can switch on.' },
    { title: 'Guided tour', text: 'A 16-step tour from the gate and 33 kV incoming, past the valve chambers, air vessel and transformer, into the control room and down to the river.' },
    { title: 'Every part explained', text: 'Click any of about 170 parts for what it is, how it works and its key data; X-ray the ground to see the buried main and chambers.' },
  ],
  learn: [
    '33 kV incoming, DP structure and metering',
    'Transformer yard, NGR and earthing',
    'HT switchboard, soft starters and LT panels',
    'PLC, SCADA and the control room',
    'Air vessel and compressors for surge protection',
    'Buried pumping main and valve chambers',
    'Flow meter, air valve, butterfly and scour valves',
    'Site layout: road, drains, cable trench and lighting',
  ],
  note: 'Illustrative model of a typical raw-water intake site. The plot outline follows a real plot shape; buildings and equipment are drawn at typical sizes and arrangements.',
};

export const EQUIPMENT_LIST = Object.values(EQUIPMENT);
