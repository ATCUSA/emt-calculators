// Pediatric Weight Estimation — APLS age-based formulas and Broselow length-based zones

export interface APLSWeightResult {
  estimatedWeightKg: number;
  estimatedWeightLb: number;
  formula: string;
  ageCategory: string;
}

/**
 * APLS age-based weight estimation formulas.
 * - Infant 0-12 months: weight = (age_months + 9) / 2
 * - Child 1-5 years: weight = (age_years × 2) + 8
 * - Child 6-12 years: weight = (age_years × 3) + 7
 */
export function estimateWeightByAge(ageYears: number, ageMonths: number): APLSWeightResult {
  if (ageMonths < 0 || ageMonths > 11) {
    ageMonths = Math.max(0, Math.min(11, Math.round(ageMonths)));
  }
  const totalMonths = ageYears * 12 + ageMonths;
  let estimatedWeightKg: number;
  let formula: string;
  let ageCategory: string;

  if (totalMonths <= 12) {
    estimatedWeightKg = (totalMonths + 9) / 2;
    formula = `(${totalMonths} months + 9) / 2`;
    ageCategory = 'Infant (0-12 months)';
  } else if (ageYears <= 5) {
    const years = totalMonths / 12;
    estimatedWeightKg = (years * 2) + 8;
    formula = `(${years.toFixed(1)} years × 2) + 8`;
    ageCategory = 'Child (1-5 years)';
  } else {
    const years = totalMonths / 12;
    estimatedWeightKg = (years * 3) + 7;
    formula = `(${years.toFixed(1)} years × 3) + 7`;
    ageCategory = 'Child (6-12 years)';
  }

  estimatedWeightKg = Math.round(estimatedWeightKg * 10) / 10;

  return {
    estimatedWeightKg,
    estimatedWeightLb: Math.round(estimatedWeightKg * 2.20462 * 10) / 10,
    formula,
    ageCategory,
  };
}

// --- Broselow Length-Based Zones ---

export interface BroselowZone {
  color: string;
  colorHex: string;
  lengthMin: number; // cm
  lengthMax: number; // cm
  estimatedWeightKg: number;
}

export const BROSELOW_ZONES: BroselowZone[] = [
  { color: 'Gray',         colorHex: '#9ca3af', lengthMin: 46,  lengthMax: 55,  estimatedWeightKg: 3.5 },
  { color: 'Pink',         colorHex: '#f472b6', lengthMin: 55,  lengthMax: 67,  estimatedWeightKg: 6 },
  { color: 'Red',          colorHex: '#ef4444', lengthMin: 67,  lengthMax: 75,  estimatedWeightKg: 8 },
  { color: 'Purple',       colorHex: '#a855f7', lengthMin: 75,  lengthMax: 85,  estimatedWeightKg: 10 },
  { color: 'Yellow',       colorHex: '#eab308', lengthMin: 85,  lengthMax: 95,  estimatedWeightKg: 12 },
  { color: 'White',        colorHex: '#e5e7eb', lengthMin: 95,  lengthMax: 107, estimatedWeightKg: 15 },
  { color: 'Blue',         colorHex: '#3b82f6', lengthMin: 107, lengthMax: 115, estimatedWeightKg: 18 },
  { color: 'Orange',       colorHex: '#f97316', lengthMin: 115, lengthMax: 124, estimatedWeightKg: 22 },
  { color: 'Green',        colorHex: '#22c55e', lengthMin: 124, lengthMax: 137, estimatedWeightKg: 30 },
];

export const VALIDATION = {
  ageYears: { min: 0, max: 12 },
  ageMonths: { min: 0, max: 11 },
  lengthCm: { min: 46, max: 137 },
} as const;

/**
 * Find matching Broselow zone for a given length in cm.
 */
export function findBroselowZone(lengthCm: number): BroselowZone | null {
  return BROSELOW_ZONES.find(
    zone => lengthCm >= zone.lengthMin && lengthCm < zone.lengthMax
  ) ?? null;
}
