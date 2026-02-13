// Tool and Reference Data Structure for EMT Calculator Tools
// This centralizes all tools and references for easy searching and organization

import type { Tool, ToolCategory, ToolStatus, EMTLevel } from '../types/medical.js';

// Current and planned calculators
export const CALCULATORS: Tool[] = [
  {
    id: 'o2-calculator',
    name: 'O2 Tank Duration Calculator',
    shortName: 'O2 Tank',
    description: 'Calculate how long an oxygen tank will last based on tank size, pressure, and flow rate.',
    category: 'calculator',
    subcategory: 'Respiratory',
    tags: ['oxygen', 'tank', 'duration', 'flow rate', 'respiratory'],
    level: 'All',
    status: 'active',
    url: '/o2-calculator',
    featured: true
  },
  {
    id: 'igel-calculator',
    name: 'i-gel Size Calculator',
    shortName: 'i-gel',
    description: 'Determine appropriate i-gel supraglottic airway size based on patient height and estimated ideal weight.',
    category: 'calculator',
    subcategory: 'Airway',
    tags: ['igel', 'airway', 'sizing', 'supraglottic', 'intubation'],
    level: 'EMT-A',
    status: 'active',
    url: '/igel-calculator',
    featured: true
  },
  {
    id: 'iv-drip-calculator',
    name: 'IV Drip Rate Calculator',
    shortName: 'IV Drip',
    description: 'Calculate IV drip rates and medication dosages.',
    category: 'calculator',
    subcategory: 'Medications',
    tags: ['iv', 'drip', 'rate', 'medication', 'dosage'],
    level: 'AEMT',
    status: 'coming-soon',
    featured: false
  },
  {
    id: 'vital-signs-calculator',
    name: 'Vital Signs Assessment',
    shortName: 'Vital Signs',
    description: 'Assess and interpret vital signs against age-appropriate normal ranges with clinical alerts.',
    category: 'calculator',
    subcategory: 'Assessment',
    tags: ['vital signs', 'heart rate', 'blood pressure', 'respiratory rate', 'assessment', 'pediatric'],
    level: 'All',
    status: 'active',
    url: '/vital-signs-calculator',
    featured: true
  },
  {
    id: 'apgar-calculator',
    name: 'APGAR Score Calculator',
    shortName: 'APGAR',
    description: 'Rapid newborn assessment for delivery calls. Score Appearance, Pulse, Grimace, Activity, and Respirations.',
    category: 'calculator',
    subcategory: 'Assessment',
    tags: ['apgar', 'newborn', 'delivery', 'assessment', 'neonatal', 'resuscitation'],
    level: 'All',
    status: 'active',
    url: '/apgar-calculator',
    featured: true
  },
  {
    id: 'gcs-calculator',
    name: 'Glasgow Coma Scale Calculator',
    shortName: 'GCS',
    description: 'Calculate Glasgow Coma Scale scores with automatic interpretation. Includes adult and pediatric scales.',
    category: 'calculator',
    subcategory: 'Assessment',
    tags: ['gcs', 'glasgow', 'coma', 'scale', 'neurological', 'brain injury', 'assessment'],
    level: 'All',
    status: 'active',
    url: '/gcs-calculator',
    featured: false
  },
  {
    id: 'stroke-assessment',
    name: 'Stroke Assessment Calculator',
    shortName: 'Stroke',
    description: 'Multi-scale stroke screening tool with FAST, BEFAST, Cincinnati, and NIHSS scales. Time-critical emergency assessment.',
    category: 'calculator',
    subcategory: 'Assessment',
    tags: ['stroke', 'fast', 'befast', 'cincinnati', 'nihss', 'neurological', 'emergency', 'assessment', 'time critical'],
    level: 'All',
    status: 'active',
    url: '/stroke-assessment',
    featured: true
  },
  {
    id: 'bmi-calculator',
    name: 'BMI Calculator',
    shortName: 'BMI',
    description: 'Calculate Body Mass Index and interpret results.',
    category: 'calculator',
    subcategory: 'Assessment',
    tags: ['bmi', 'body mass index', 'weight', 'height', 'obesity'],
    level: 'All',
    status: 'planned',
    featured: false
  },
  {
    id: 'medication-dosage',
    name: 'Medication Dosage Calculator',
    shortName: 'Med Dosage',
    description: 'Calculate medication dosages based on weight and protocols.',
    category: 'calculator',
    subcategory: 'Medications',
    tags: ['medication', 'dosage', 'weight', 'protocols', 'drugs'],
    level: 'Paramedic',
    status: 'planned',
    featured: false
  }
];

// Quick reference materials
export const REFERENCES: Tool[] = [
  {
    id: 'vital-signs-ranges',
    name: 'Vital Signs Reference',
    shortName: 'Vitals',
    description: 'Normal ranges for vital signs by age group from newborn to elderly. Based on WikEM and clinical guidelines.',
    category: 'reference',
    subcategory: 'Assessment',
    tags: ['vital signs', 'blood pressure', 'heart rate', 'respiratory', 'normal ranges', 'pediatric'],
    level: 'All',
    status: 'active',
    url: '/vital-signs-reference',
    featured: true
  },
  {
    id: 'medication-reference',
    name: 'Emergency Medications',
    shortName: 'Meds',
    description: 'Quick reference for common emergency medications and dosages.',
    category: 'reference',
    subcategory: 'Medications',
    tags: ['medications', 'drugs', 'dosages', 'emergency', 'protocols'],
    level: 'AEMT',
    status: 'planned',
    featured: false
  },
  {
    id: 'assessment-protocols',
    name: 'Assessment Protocols',
    shortName: 'Assessment',
    description: 'Step-by-step assessment protocols for common emergencies.',
    category: 'reference',
    subcategory: 'Protocols',
    tags: ['assessment', 'protocols', 'procedures', 'guidelines'],
    level: 'All',
    status: 'planned',
    featured: false
  },
  {
    id: 'trauma-reference',
    name: 'Trauma Assessment Guide',
    shortName: 'Trauma',
    description: 'Trauma assessment and management reference.',
    category: 'reference',
    subcategory: 'Trauma',
    tags: ['trauma', 'assessment', 'management', 'injuries'],
    level: 'All',
    status: 'planned',
    featured: false
  }
];

// Combined tools for searching
export const ALL_TOOLS = [...CALCULATORS, ...REFERENCES];

// Get tools by category
export const getCalculators = () => CALCULATORS;
export const getReferences = () => REFERENCES;
export const getFeaturedTools = () => ALL_TOOLS.filter(tool => tool.featured);
export const getActiveTools = () => ALL_TOOLS.filter(tool => tool.status === 'active');

// Search function with fuzzy matching
export function searchTools(query: string, category?: ToolCategory): Tool[] {
  if (!query.trim()) {
    return category ? ALL_TOOLS.filter(tool => tool.category === category) : ALL_TOOLS;
  }

  const searchTerm = query.toLowerCase();

  return ALL_TOOLS.filter(tool => {
    // Skip if category filter doesn't match
    if (category && tool.category !== category) return false;

    // Search in name, description, tags, and subcategory
    const searchableText = [
      tool.name,
      tool.shortName,
      tool.description,
      tool.subcategory,
      ...tool.tags
    ].join(' ').toLowerCase();

    // Simple fuzzy matching - check if search terms are found
    const searchTerms = searchTerm.split(' ').filter(term => term.length > 0);
    return searchTerms.every(term => searchableText.includes(term));
  });
}

// Get tools by status
export const getToolsByStatus = (status: ToolStatus): Tool[] =>
  ALL_TOOLS.filter(tool => tool.status === status);

// Get tools by level
export const getToolsByLevel = (level: EMTLevel): Tool[] =>
  ALL_TOOLS.filter(tool => tool.level === level || tool.level === 'All');