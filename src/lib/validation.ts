// Shared medical validation utilities
// Uses existing ValidationRule, ValidationResult, MedicalCalculationError types from types/medical.ts

import type { ValidationRule, ValidationResult, MedicalCalculationError } from '../types/medical.js';

/**
 * Validate a single input value against an array of validation rules.
 */
export function validateInput(value: unknown, rules: ValidationRule[]): ValidationResult {
  const errors: MedicalCalculationError[] = [];
  const warnings: string[] = [];

  for (const rule of rules) {
    switch (rule.type) {
      case 'required':
        if (value === undefined || value === null || value === '') {
          errors.push({ code: 'REQUIRED', message: rule.message, field: rule.field });
        }
        break;

      case 'range': {
        const num = Number(value);
        if (isNaN(num)) {
          errors.push({ code: 'INVALID_NUMBER', message: `${rule.field} must be a number`, field: rule.field, value });
        } else {
          if (rule.min !== undefined && num < rule.min) {
            errors.push({ code: 'BELOW_MIN', message: rule.message, field: rule.field, value });
          }
          if (rule.max !== undefined && num > rule.max) {
            errors.push({ code: 'ABOVE_MAX', message: rule.message, field: rule.field, value });
          }
        }
        break;
      }

      case 'format':
        if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
          errors.push({ code: 'FORMAT', message: rule.message, field: rule.field, value });
        }
        break;

      case 'custom':
        if (rule.validator && !rule.validator(value)) {
          errors.push({ code: 'CUSTOM', message: rule.message, field: rule.field, value });
        }
        break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// --- Rule Factories ---

export function required(field: string): ValidationRule {
  return { field, type: 'required', message: `${field} is required` };
}

export function range(field: string, min: number, max: number, unit?: string): ValidationRule {
  const unitStr = unit ? ` ${unit}` : '';
  return {
    field,
    type: 'range',
    min,
    max,
    message: `${field} must be between ${min} and ${max}${unitStr}`
  };
}

export function positiveNumber(field: string): ValidationRule {
  return {
    field,
    type: 'range',
    min: 0.001,
    message: `${field} must be a positive number`
  };
}

// --- Medical-Specific Validators ---

export function heartRate(): ValidationRule {
  return range('Heart Rate', 20, 300, 'bpm');
}

export function systolicBP(): ValidationRule {
  return range('Systolic BP', 30, 300, 'mmHg');
}

export function respiratoryRate(): ValidationRule {
  return range('Respiratory Rate', 0, 80, 'breaths/min');
}

export function spo2(): ValidationRule {
  return range('SpO2', 0, 100, '%');
}

export function temperature(): ValidationRule {
  return range('Temperature', 80, 115, 'F');
}

// --- Critical Value Detection ---

export interface CriticalThreshold {
  field: string;
  value: number;
  direction: 'low' | 'high';
  message: string;
  severity: 'warning' | 'critical';
}

const CRITICAL_THRESHOLDS: CriticalThreshold[] = [
  { field: 'heartRate', value: 40, direction: 'low', message: 'Severe bradycardia: HR < 40 bpm', severity: 'critical' },
  { field: 'heartRate', value: 150, direction: 'high', message: 'Severe tachycardia: HR > 150 bpm', severity: 'critical' },
  { field: 'systolicBP', value: 70, direction: 'low', message: 'Severe hypotension: SBP < 70 mmHg', severity: 'critical' },
  { field: 'systolicBP', value: 200, direction: 'high', message: 'Hypertensive crisis: SBP > 200 mmHg', severity: 'critical' },
  { field: 'spo2', value: 88, direction: 'low', message: 'Critical hypoxia: SpO2 < 88%', severity: 'critical' },
  { field: 'respiratoryRate', value: 8, direction: 'low', message: 'Respiratory depression: RR < 8', severity: 'critical' },
  { field: 'respiratoryRate', value: 40, direction: 'high', message: 'Severe tachypnea: RR > 40', severity: 'critical' },
];

/**
 * Check if a value triggers any critical thresholds.
 * Returns the matching threshold or null if the value is not critical.
 */
export function isCriticalValue(field: string, value: number): CriticalThreshold | null {
  for (const threshold of CRITICAL_THRESHOLDS) {
    if (threshold.field !== field) continue;
    if (threshold.direction === 'low' && value < threshold.value) return threshold;
    if (threshold.direction === 'high' && value > threshold.value) return threshold;
  }
  return null;
}
