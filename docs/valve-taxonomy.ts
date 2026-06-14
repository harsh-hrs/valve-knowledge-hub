/**
 * TypeScript definitions for the Industrial Valve Knowledge Hub Taxonomy.
 * Designed for maintainability, type-safety, and validation.
 */

export type ValveCategory = 'Linear' | 'Rotary' | 'Self-Actuated' | 'Specialty';

export interface ValveComponent {
  /** The standard name of the component (e.g., "Stem", "Stuffing Box") */
  name: string;
  /** Purpose of the component within the valve assembly */
  functionality: string;
  /** Standard materials used for fabrication (e.g., "ASTM A216 WCB", "SS316", "PTFE") */
  typicalMaterials: string[];
}

export interface ValveDefinition {
  /** Unique string identifier (e.g., "ball-valve-floating") */
  id: string;
  /** Full technical name */
  name: string;
  /** Primary motion category */
  category: ValveCategory;
  /** Specific motion/construction subcategory (e.g., "Quarter-turn Floating", "Multi-turn Wedge") */
  subcategory: string;
  /** High-level overview of the valve's role */
  description: string;
  /** Mechanical and fluid flow mechanics detailing how flow is stopped or regulated */
  workingPrinciple: string;
  /** List of engineering advantages */
  advantages: string[];
  /** List of performance limits, pressure/temperature boundaries, or failures */
  limitations: string[];
  /** Industry sectors and service types where this valve is standard */
  typicalApplications: string[];
  /** Granular components for interactive exploded/cutaway model lookups */
  internalComponents: ValveComponent[];
  /** Governing design, testing, and dimension standards (ASME, API, ISO, etc.) */
  standards: string[];
}

export interface SubcategoryGroup {
  name: string;
  description: string;
  valves: ValveDefinition[];
}

export interface CategoryGroup {
  name: string;
  description: string;
  subcategories: {
    [subcategoryId: string]: SubcategoryGroup;
  };
}

export interface ValveTaxonomy {
  categories: {
    [categoryId: string]: CategoryGroup;
  };
}
