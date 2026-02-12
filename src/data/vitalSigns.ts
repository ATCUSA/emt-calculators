// Vital Signs Reference Data - Age-Based Normal Ranges
// Sources: WikEM, Nelson Textbook of Pediatrics, Fleming S et al.

import type { VitalSignsReference } from '../types/medical.js';

export const VITAL_SIGNS_DATA: VitalSignsReference = {
  pediatric: [
    {
      ageGroup: 'preterm',
      ageRange: 'Preterm < 1kg',
      heartRate: { min: 120, max: 160, unit: 'bpm' },
      respiratoryRate: { min: 30, max: 60, unit: 'bpm' },
      systolicBP: { min: 36, max: 58, unit: 'mmHg' }
    },
    {
      ageGroup: 'newborn',
      ageRange: 'Newborn (0-1 month)',
      heartRate: { min: 126, max: 160, unit: 'bpm' },
      respiratoryRate: { min: 30, max: 60, unit: 'bpm' },
      systolicBP: { min: 60, max: 70, unit: 'mmHg' }
    },
    {
      ageGroup: 'infant',
      ageRange: '1-12 months',
      heartRate: { min: 100, max: 140, unit: 'bpm' },
      respiratoryRate: { min: 30, max: 60, unit: 'bpm' },
      systolicBP: { min: 70, max: 80, unit: 'mmHg' }
    },
    {
      ageGroup: 'toddler',
      ageRange: '1-3 years',
      heartRate: { min: 100, max: 140, unit: 'bpm' },
      respiratoryRate: { min: 20, max: 40, unit: 'bpm' },
      systolicBP: { min: 76, max: 90, unit: 'mmHg' }
    },
    {
      ageGroup: 'preschool',
      ageRange: '4-6 years',
      heartRate: { min: 80, max: 120, unit: 'bpm' },
      respiratoryRate: { min: 20, max: 30, unit: 'bpm' },
      systolicBP: { min: 80, max: 100, unit: 'mmHg' }
    },
    {
      ageGroup: 'school_age_early',
      ageRange: '7-9 years',
      heartRate: { min: 80, max: 120, unit: 'bpm' },
      respiratoryRate: { min: 16, max: 24, unit: 'bpm' },
      systolicBP: { min: 84, max: 110, unit: 'mmHg' }
    },
    {
      ageGroup: 'school_age_late',
      ageRange: '10-12 years',
      heartRate: { min: 60, max: 100, unit: 'bpm' },
      respiratoryRate: { min: 16, max: 20, unit: 'bpm' },
      systolicBP: { min: 90, max: 120, unit: 'mmHg' }
    },
    {
      ageGroup: 'adolescent_early',
      ageRange: '13-14 years',
      heartRate: { min: 60, max: 90, unit: 'bpm' },
      respiratoryRate: { min: 16, max: 20, unit: 'bpm' },
      systolicBP: { min: 90, max: 120, unit: 'mmHg' }
    },
    {
      ageGroup: 'adolescent_late',
      ageRange: '15-18 years',
      heartRate: { min: 60, max: 90, unit: 'bpm' },
      respiratoryRate: { min: 14, max: 20, unit: 'bpm' },
      systolicBP: { min: 90, max: 130, unit: 'mmHg' }
    }
  ],
  adult: [
    {
      ageGroup: 'adult',
      ageRange: '18+ years',
      heartRate: { min: 60, max: 100, unit: 'bpm' },
      respiratoryRate: { min: 12, max: 20, unit: 'bpm' },
      systolicBP: { min: 90, max: 140, unit: 'mmHg' },
      diastolicBP: { min: 60, max: 90, unit: 'mmHg' }
    },
    {
      ageGroup: 'elderly',
      ageRange: '65+ years',
      heartRate: { min: 60, max: 100, unit: 'bpm' },
      respiratoryRate: { min: 12, max: 20, unit: 'bpm' },
      systolicBP: { min: 90, max: 150, unit: 'mmHg' },
      diastolicBP: { min: 60, max: 90, unit: 'mmHg' }
    }
  ]
} as const;

// Helper function to determine age group from age in years
export function getAgeGroup(ageInYears: number): string {
  if (ageInYears < 0.08) return 'newborn'; // < 1 month
  if (ageInYears < 1) return 'infant';
  if (ageInYears < 4) return 'toddler';
  if (ageInYears < 7) return 'preschool';
  if (ageInYears < 10) return 'school_age_early';
  if (ageInYears < 13) return 'school_age_late';
  if (ageInYears < 15) return 'adolescent_early';
  if (ageInYears < 18) return 'adolescent_late';
  if (ageInYears < 65) return 'adult';
  return 'elderly';
}

// Convert age from different units to years
export function convertAgeToYears(age: number, unit: 'years' | 'months' | 'days'): number {
  switch (unit) {
    case 'years':
      return age;
    case 'months':
      return age / 12;
    case 'days':
      return age / 365.25;
    default:
      return age;
  }
}

// Get vital signs reference for specific age
export function getVitalSignsForAge(ageInYears: number): import('../types/medical.js').VitalSignsByAge | null {
  const ageGroup = getAgeGroup(ageInYears);

  // Check pediatric ranges first
  const pediatricRange = VITAL_SIGNS_DATA.pediatric.find(range => range.ageGroup === ageGroup);
  if (pediatricRange) return pediatricRange;

  // Check adult ranges
  const adultRange = VITAL_SIGNS_DATA.adult.find(range => range.ageGroup === ageGroup);
  return adultRange || null;
}

// Clinical notes and warnings
export const VITAL_SIGNS_NOTES = {
  fever: 'Fever increases heart rate by ~10 bpm per degree Celsius',
  hypotension: 'Systolic BP < 90 mmHg in adults is considered hypotensive',
  bradycardia: 'Consider underlying causes: medications, cardiac conduction issues',
  tachycardia: 'Consider causes: pain, fever, dehydration, anxiety, cardiac issues',
  tachypnea: 'Consider respiratory distress, metabolic acidosis, pain',
  bradypnea: 'Consider CNS depression, opioids, respiratory muscle fatigue'
} as const;