// Shock Index Calculator — SI = Heart Rate / Systolic BP

export interface ShockIndexResult {
  shockIndex: number;
  severity: ShockSeverity;
  interpretation: string;
  clinicalNotes: string[];
  warnings: string[];
}

export type ShockSeverity = 'normal' | 'compensated' | 'mild' | 'moderate' | 'severe';

export interface ShockThreshold {
  severity: ShockSeverity;
  min: number;
  max: number;
  label: string;
  interpretation: string;
  clinicalNotes: string[];
}

export const SHOCK_THRESHOLDS: ShockThreshold[] = [
  {
    severity: 'normal',
    min: 0.5,
    max: 0.7,
    label: 'Normal',
    interpretation: 'No hemodynamic compromise indicated',
    clinicalNotes: [
      'Vital signs within expected parameters',
      'Continue routine monitoring',
    ],
  },
  {
    severity: 'compensated',
    min: 0.7,
    max: 1.0,
    label: 'Compensated Shock',
    interpretation: 'Early hemodynamic changes — may indicate compensated shock',
    clinicalNotes: [
      'Patient may be compensating for volume loss',
      'Reassess frequently and trend values',
      'Consider fluid challenge if clinical picture supports',
    ],
  },
  {
    severity: 'mild',
    min: 1.0,
    max: 1.3,
    label: 'Mild Shock',
    interpretation: 'Elevated shock index — suggests hemodynamic instability',
    clinicalNotes: [
      'Estimated 20-30% blood volume loss possible',
      'Initiate IV access and fluid resuscitation',
      'Identify and treat underlying cause',
      'Prepare for transport to appropriate facility',
    ],
  },
  {
    severity: 'moderate',
    min: 1.3,
    max: 1.7,
    label: 'Moderate Shock',
    interpretation: 'Significantly elevated — indicates moderate hemodynamic compromise',
    clinicalNotes: [
      'Estimated 30-50% blood volume loss possible',
      'Aggressive fluid resuscitation indicated',
      'Consider vasopressors if fluids inadequate',
      'Rapid transport to trauma/critical care facility',
    ],
  },
  {
    severity: 'severe',
    min: 1.7,
    max: Infinity,
    label: 'Severe Shock',
    interpretation: 'Critical hemodynamic compromise — life-threatening',
    clinicalNotes: [
      'Estimated >50% blood volume loss possible',
      'Immediate aggressive resuscitation required',
      'ALS intercept if not already present',
      'Rapid transport to highest level of care',
      'Consider massive transfusion protocol activation',
    ],
  },
];

export const VALIDATION = {
  heartRate: { min: 20, max: 300, unit: 'bpm' },
  systolicBP: { min: 30, max: 300, unit: 'mmHg' },
} as const;

/** Pediatric age-adjusted normal SI values */
export const PEDIATRIC_NORMALS = [
  { ageRange: 'Newborn', normalSI: '< 1.6' },
  { ageRange: '1-12 months', normalSI: '< 1.5' },
  { ageRange: '1-5 years', normalSI: '< 1.2' },
  { ageRange: '6-12 years', normalSI: '< 1.0' },
  { ageRange: '> 12 years', normalSI: '< 0.9' },
] as const;

/**
 * Calculate Shock Index and determine severity.
 */
export function calculateShockIndex(heartRate: number, systolicBP: number): ShockIndexResult {
  const warnings: string[] = [];
  const shockIndex = Math.round((heartRate / systolicBP) * 100) / 100;

  if (heartRate < VALIDATION.heartRate.min || heartRate > VALIDATION.heartRate.max) {
    warnings.push(`Heart rate ${heartRate} is outside expected range (${VALIDATION.heartRate.min}-${VALIDATION.heartRate.max})`);
  }
  if (systolicBP < VALIDATION.systolicBP.min || systolicBP > VALIDATION.systolicBP.max) {
    warnings.push(`Systolic BP ${systolicBP} is outside expected range (${VALIDATION.systolicBP.min}-${VALIDATION.systolicBP.max})`);
  }

  // Find matching threshold (fallback to severe — last entry)
  const threshold = SHOCK_THRESHOLDS.find(
    t => shockIndex >= t.min && shockIndex < t.max
  ) ?? SHOCK_THRESHOLDS[SHOCK_THRESHOLDS.length - 1]!;

  // Below normal
  if (shockIndex < 0.5) {
    return {
      shockIndex,
      severity: 'normal',
      interpretation: 'Shock index below typical range — verify values',
      clinicalNotes: ['Very low SI may indicate relative bradycardia or hypertension'],
      warnings,
    };
  }

  return {
    shockIndex,
    severity: threshold.severity,
    interpretation: threshold.interpretation,
    clinicalNotes: threshold.clinicalNotes,
    warnings,
  };
}
