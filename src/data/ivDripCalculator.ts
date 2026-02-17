// IV Drip Rate Calculator Data & Logic
// Sources: Standard nursing/EMS pharmacology references

import type { DropFactor, IVDripResult } from '../types/medical.js';

export interface DropFactorPreset {
  factor: DropFactor;
  label: string;
  tubingType: string;
}

export const DROP_FACTOR_PRESETS: DropFactorPreset[] = [
  { factor: 10, label: '10 gtt/mL', tubingType: 'Macro drip' },
  { factor: 15, label: '15 gtt/mL', tubingType: 'Macro drip' },
  { factor: 20, label: '20 gtt/mL', tubingType: 'Macro drip' },
  { factor: 60, label: '60 gtt/mL', tubingType: 'Micro drip' }
];

// Validation limits
export const VALIDATION = {
  volume: { min: 1, max: 9999 },
  time: { min: 1, max: 1440 }
} as const;

export function calculateDripRate(
  volumeMl: number,
  timeMinutes: number,
  dropFactor: DropFactor
): IVDripResult | null {
  if (
    !Number.isFinite(volumeMl) ||
    !Number.isFinite(timeMinutes) ||
    volumeMl < VALIDATION.volume.min ||
    volumeMl > VALIDATION.volume.max ||
    timeMinutes < VALIDATION.time.min ||
    timeMinutes > VALIDATION.time.max
  ) {
    return null;
  }

  const gttsPerMin = (volumeMl * dropFactor) / timeMinutes;
  const mlPerHour = (volumeMl / timeMinutes) * 60;
  const warnings: string[] = [];

  if (gttsPerMin > 150) {
    warnings.push(
      dropFactor === 60
        ? 'Rate exceeds 150 gtt/min — difficult to count manually. Consider switching to macro drip tubing or using a pump.'
        : 'Rate exceeds 150 gtt/min — difficult to count manually. Consider using an IV pump for accuracy.'
    );
  }

  if (mlPerHour > 999) {
    warnings.push('Rate exceeds 999 mL/hr — verify order and clinical appropriateness.');
  }

  if (gttsPerMin < 1) {
    warnings.push('Very slow rate (< 1 gtt/min). Consider micro drip tubing (60 gtt/mL) for accuracy.');
  }

  if (mlPerHour > 250 && dropFactor === 60) {
    warnings.push('High rate with micro drip tubing — consider switching to macro drip tubing.');
  }

  return {
    gttsPerMin: Math.round(gttsPerMin * 10) / 10,
    mlPerHour: Math.round(mlPerHour * 10) / 10,
    totalTime: timeMinutes,
    warnings
  };
}
