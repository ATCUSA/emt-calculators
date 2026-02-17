// Medical Calculator Types for EMT Calculator Tools
// Comprehensive type definitions for medical calculations and assessments

// EMT Certification Levels
export type EMTLevel = 'EMT-B' | 'EMT-A' | 'AEMT' | 'Paramedic' | 'All';

// Tool Categories
export type ToolCategory = 'calculator' | 'reference';
export type ToolStatus = 'active' | 'coming-soon' | 'planned';

// Age Groups for Medical Assessments
export type AgeGroup = 'adult' | 'pediatric';

// Base Tool Interface
export interface Tool {
  id: string;
  name: string;
  shortName: string;
  description: string;
  category: ToolCategory;
  subcategory: string;
  tags: string[];
  level: EMTLevel;
  status: ToolStatus;
  url?: string;
  featured: boolean;
}

// O2 Calculator Types
export interface O2TankSpec {
  name: string;
  size: string;
  servicePressure: number; // PSI
  tankFactor: number;
}

export interface O2CalculationInput {
  tankSize: string;
  currentPressure: number; // PSI
  flowRate: number; // LPM
  safetyMargin: number; // percentage
  safetyReserve: number; // PSI - minimum pressure to maintain
}

export interface O2CalculationResult {
  usableDuration: number; // minutes (with safety reserve)
  totalDuration: number; // minutes (complete tank)
  reservePressure: number; // PSI remaining at end of usable duration
  warnings: string[];
  tankInfo: O2TankSpec;
  calculationDetails: {
    usablePressure: number; // PSI available for use
    totalPressure: number; // PSI total in tank
    flowRate: number; // LPM
    safetyReserve: number; // PSI
  };
}

// i-gel Calculator Types
export type HeightUnit = 'cm' | 'in' | 'ft';
export type Gender = 'male' | 'female' | '';

export interface IgelSizeInfo {
  weightRange: string;
  description: string;
  color: string;
}

export interface IgelCalculationInput {
  height: string;
  heightFeet: string;
  heightInches: string;
  heightUnit: HeightUnit;
  gender: Gender;
  ageGroup: AgeGroup;
}

export interface IgelCalculationResult {
  idealWeight: number;
  igelSize: string;
  sizeDescription: string;
  igelColor: string;
  warnings: string[];
}

export interface IgelSizingChart {
  [size: string]: IgelSizeInfo;
}

// GCS Calculator Types
export type GCSResponse = '1' | '2' | '3' | '4' | '5' | '6' | '';
export type GCSSeverity = 'mild' | 'moderate' | 'severe' | '';

export interface GCSResponseOption {
  [score: string]: string;
}

export interface GCSScale {
  eye: GCSResponseOption;
  verbal: GCSResponseOption;
  motor: GCSResponseOption;
}

export interface GCSCalculationInput {
  ageGroup: AgeGroup;
  eyeResponse: GCSResponse;
  verbalResponse: GCSResponse;
  motorResponse: GCSResponse;
}

export interface GCSCalculationResult {
  totalScore: number;
  interpretation: string;
  severity: GCSSeverity;
  clinicalNotes: string[];
}

// Vital Signs Types
export interface VitalSignsRange {
  min: number;
  max: number;
  unit: string;
}

export interface VitalSignsByAge {
  ageGroup: string;
  ageRange: string;
  heartRate: VitalSignsRange;
  respiratoryRate: VitalSignsRange;
  systolicBP: VitalSignsRange;
  diastolicBP?: VitalSignsRange; // Not all age groups have diastolic data
}

export interface VitalSignsReference {
  pediatric: VitalSignsByAge[];
  adult: VitalSignsByAge[];
}

export interface VitalSignsInput {
  age: number;
  ageUnit: 'years' | 'months' | 'days';
  heartRate?: number;
  respiratoryRate?: number;
  systolicBP?: number;
  diastolicBP?: number;
  temperature?: number;
  temperatureUnit?: 'F' | 'C';
}

export interface VitalSignsAssessment {
  ageGroup: string;
  ageRange: string;
  assessments: {
    heartRate?: {
      value: number;
      range: VitalSignsRange;
      status: 'normal' | 'low' | 'high';
      severity?: 'mild' | 'moderate' | 'severe';
    };
    respiratoryRate?: {
      value: number;
      range: VitalSignsRange;
      status: 'normal' | 'low' | 'high';
      severity?: 'mild' | 'moderate' | 'severe';
    };
    systolicBP?: {
      value: number;
      range: VitalSignsRange;
      status: 'normal' | 'low' | 'high';
      severity?: 'mild' | 'moderate' | 'severe';
    };
    diastolicBP?: {
      value: number;
      range: VitalSignsRange;
      status: 'normal' | 'low' | 'high';
      severity?: 'mild' | 'moderate' | 'severe';
    };
  };
  clinicalNotes: string[];
  warnings: string[];
}

// APGAR Score Types
export type APGARScore = 0 | 1 | 2;
export type APGARCategory = 'appearance' | 'pulse' | 'grimace' | 'activity' | 'respiration';
export type APGARInterpretation = 'normal' | 'moderate_depression' | 'severe_depression';

export interface APGARCriterion {
  score: APGARScore;
  description: string;
  clinicalSign: string;
}

export interface APGARCategoryData {
  name: string;
  fullName: string;
  criteria: APGARCriterion[];
}

export interface APGARInput {
  appearance: APGARScore;
  pulse: APGARScore;
  grimace: APGARScore;
  activity: APGARScore;
  respiration: APGARScore;
  timeOfAssessment: '1_minute' | '5_minute' | '10_minute' | 'other';
  assessmentTime?: string; // for custom time
}

export interface APGARResult {
  totalScore: number;
  interpretation: APGARInterpretation;
  categoryScores: {
    appearance: APGARScore;
    pulse: APGARScore;
    grimace: APGARScore;
    activity: APGARScore;
    respiration: APGARScore;
  };
  clinicalGuidance: string[];
  immediateActions: string[];
  timeOfAssessment: string;
}

// CPAP Reference Types
export type ContraindicationType = 'absolute' | 'relative';

export interface CPAPIndication {
  condition: string;
  description: string;
  notes?: string;
}

export interface CPAPContraindication {
  condition: string;
  type: ContraindicationType;
  description: string;
}

export interface CPAPSettings {
  condition: string;
  pressureRange: string;
  o2Flow: string;
  fio2?: string;
  notes?: string;
}

export interface CPAPMonitoring {
  parameter: string;
  target: string;
  frequency: string;
  actionIfAbnormal: string;
}

export interface CPAPTroubleshooting {
  problem: string;
  causes: string[];
  solutions: string[];
}

export interface CPAPDiscontinuation {
  criterion: string;
  action: string;
  urgency: 'immediate' | 'urgent' | 'routine';
}

export interface CPAPReference {
  indications: CPAPIndication[];
  contraindications: CPAPContraindication[];
  settings: CPAPSettings[];
  monitoring: CPAPMonitoring[];
  troubleshooting: CPAPTroubleshooting[];
  discontinuation: CPAPDiscontinuation[];
  pediatricConsiderations: string[];
  citations: string[];
}

// IV Catheter Reference Types
export interface IVCatheterSpec {
  gauge: number;
  color: string;
  outerDiameter: string;
  length: string;
  flowRate: string;
  flowRateValue: number;
  uses: string[];
}

export interface IVSelectionGuideline {
  scenario: string;
  recommendedGauge: string;
  rationale: string;
}

export interface IVComplication {
  complication: string;
  signs: string[];
  intervention: string;
}

export interface IVCatheterReference {
  catheters: IVCatheterSpec[];
  selectionGuidelines: IVSelectionGuideline[];
  complications: IVComplication[];
  siteSelection: string[];
  prehospitalTips: string[];
  citations: string[];
}

// IV Drip Rate Calculator Types
export type DropFactor = 10 | 15 | 20 | 60;

export interface IVDripInput {
  volume: number;
  time: number;
  dropFactor: DropFactor;
}

export interface IVDripResult {
  gttsPerMin: number;
  mlPerHour: number;
  totalTime: number;
  warnings: string[];
}

// Medical Calculation Base Types
export interface MedicalCalculation {
  input: Record<string, any>;
  result: Record<string, any>;
  warnings: string[];
  timestamp: Date;
}

// Component Props Types
export interface CalculatorComponentProps {
  title?: string;
  description?: string;
  showBackButton?: boolean;
}

// Search and Filter Types
export interface SearchFilters {
  category?: ToolCategory;
  level?: EMTLevel;
  status?: ToolStatus;
  query?: string;
}

export interface SearchResult extends Tool {
  matchScore?: number;
  matchedFields?: string[];
}

// Version and Configuration Types
export interface AppVersion {
  version: string;
  buildDate: string;
  features: string[];
  changelog: VersionChange[];
}

export interface VersionChange {
  version: string;
  date: string;
  changes: string[];
  type: 'major' | 'minor' | 'patch';
}

// Error Types for Medical Calculations
export interface MedicalCalculationError {
  code: string;
  message: string;
  field?: string;
  value?: any;
}

// PWA and Service Worker Types
export interface PWAUpdateInfo {
  available: boolean;
  version?: string;
  changelog?: VersionChange[];
}

// Theme and UI Types
export type ThemeMode = 'light' | 'dark' | 'auto';

export interface UIPreferences {
  theme: ThemeMode;
  disclaimerDismissed: boolean;
  preferredUnits: {
    height: HeightUnit;
    pressure: 'psi' | 'bar';
    flow: 'lpm' | 'cfm';
  };
}

// Medical Calculation Validation
export interface ValidationRule {
  field: string;
  type: 'required' | 'range' | 'format' | 'custom';
  min?: number;
  max?: number;
  pattern?: RegExp;
  message: string;
  validator?: (value: any) => boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: MedicalCalculationError[];
  warnings: string[];
}

// Export utility type helpers
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type PartialFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Medical calculation factory type
export type CalculationFunction<TInput, TResult> = (
  input: TInput
) => Promise<TResult> | TResult;