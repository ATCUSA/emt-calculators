// Parkland Burn Formula — fluid resuscitation calculation
// Formula: Total fluid (mL) = 4 × weight (kg) × %TBSA burned

export interface ParklandInput {
  weightKg: number;
  tbsaPercent: number;
  burnTime?: string; // HH:MM format
}

export interface ParklandResult {
  totalFluid24hr: number;     // mL total over 24 hours
  first8hrTotal: number;      // mL for first 8 hours (50%)
  first8hrRate: number;       // mL/hr for first 8 hours
  remaining16hrTotal: number; // mL for remaining 16 hours (50%)
  remaining16hrRate: number;  // mL/hr for remaining 16 hours
  warnings: string[];
}

export const VALIDATION = {
  weight: { min: 1, max: 300, unit: 'kg' },
  tbsa: { min: 1, max: 100, unit: '%' },
} as const;

/**
 * Calculate Parkland formula fluid resuscitation volumes.
 * Half given in first 8 hours from burn time, half over remaining 16 hours.
 */
export function calculateParkland(input: ParklandInput): ParklandResult {
  const { weightKg, tbsaPercent } = input;
  const warnings: string[] = [];

  const totalFluid24hr = Math.round(4 * weightKg * tbsaPercent);
  const first8hrTotal = Math.round(totalFluid24hr / 2);
  const remaining16hrTotal = totalFluid24hr - first8hrTotal;
  const first8hrRate = Math.round(first8hrTotal / 8);
  const remaining16hrRate = Math.round(remaining16hrTotal / 16);

  if (tbsaPercent > 50) {
    warnings.push('TBSA >50% — consider limiting initial fluids to avoid over-resuscitation');
  }
  if (totalFluid24hr > 10000) {
    warnings.push('High volume resuscitation — monitor for abdominal compartment syndrome');
  }
  if (tbsaPercent < 15 && weightKg >= 40) {
    warnings.push('Burns <15% TBSA in adults may not require IV resuscitation per Parkland');
  }
  if (tbsaPercent < 10 && weightKg < 40) {
    warnings.push('Pediatric burns <10% TBSA may not require IV resuscitation');
  }

  return {
    totalFluid24hr,
    first8hrTotal,
    first8hrRate,
    remaining16hrTotal,
    remaining16hrRate,
    warnings,
  };
}

/** Convert pounds to kilograms */
export function lbToKg(lb: number): number {
  return Math.round(lb * 0.453592 * 10) / 10;
}

/** Rule of Nines — body surface area percentages */
export interface RuleOfNinesRegion {
  region: string;
  adult: number;
  pediatric: number; // child <1 year
}

export const RULE_OF_NINES: RuleOfNinesRegion[] = [
  { region: 'Head & Neck', adult: 9, pediatric: 18 },
  { region: 'Anterior Trunk', adult: 18, pediatric: 18 },
  { region: 'Posterior Trunk', adult: 18, pediatric: 18 },
  { region: 'Each Arm', adult: 9, pediatric: 9 },
  { region: 'Each Leg', adult: 18, pediatric: 14 },
  { region: 'Perineum', adult: 1, pediatric: 1 },
];
