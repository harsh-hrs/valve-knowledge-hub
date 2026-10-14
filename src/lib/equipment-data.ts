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

export const EQUIPMENT_LIST = Object.values(EQUIPMENT);
