<script lang="ts">
  import { Heart, Activity, TrendingUp, AlertTriangle, Info, ExternalLink } from 'lucide-svelte';
  import { getVitalSignsForAge, convertAgeToYears, VITAL_SIGNS_NOTES } from '../data/vitalSigns.js';
  import type { VitalSignsInput, VitalSignsAssessment, VitalSignsByAge } from '../types/medical.js';

  // State variables
  let age = $state<number>(25);
  let ageUnit = $state<'years' | 'months' | 'days'>('years');
  let heartRate = $state<number | undefined>(undefined);
  let respiratoryRate = $state<number | undefined>(undefined);
  let systolicBP = $state<number | undefined>(undefined);
  let diastolicBP = $state<number | undefined>(undefined);
  let temperature = $state<number | undefined>(undefined);
  let temperatureUnit = $state<'F' | 'C'>('F');

  // Calculate age in years for reference lookup
  const ageInYears = $derived(convertAgeToYears(age, ageUnit));

  // Get appropriate vital signs reference
  const vitalSignsReference = $derived(getVitalSignsForAge(ageInYears));

  // Perform assessment
  const assessment = $derived.by((): VitalSignsAssessment | null => {
    if (!vitalSignsReference) return null;

    const assessments: VitalSignsAssessment['assessments'] = {};
    const warnings: string[] = [];
    const clinicalNotes: string[] = [];

    // Temperature adjustment for heart rate
    let tempAdjustment = 0;
    if (temperature && temperatureUnit === 'F' && temperature > 98.6) {
      tempAdjustment = Math.round((temperature - 98.6) * 10 / 1.8); // ~10 bpm per °C
      clinicalNotes.push(`Fever increases expected HR by ~${tempAdjustment} bpm`);
    } else if (temperature && temperatureUnit === 'C' && temperature > 37) {
      tempAdjustment = Math.round((temperature - 37) * 10);
      clinicalNotes.push(`Fever increases expected HR by ~${tempAdjustment} bpm`);
    }

    // Heart Rate Assessment
    if (heartRate !== undefined) {
      const adjustedHRRange = {
        ...vitalSignsReference.heartRate,
        min: vitalSignsReference.heartRate.min + tempAdjustment,
        max: vitalSignsReference.heartRate.max + tempAdjustment
      };

      let status: 'normal' | 'low' | 'high' = 'normal';
      let severity: 'mild' | 'moderate' | 'severe' | undefined;

      if (heartRate < adjustedHRRange.min) {
        status = 'low';
        if (heartRate < adjustedHRRange.min - 20) severity = 'severe';
        else if (heartRate < adjustedHRRange.min - 10) severity = 'moderate';
        else severity = 'mild';
        warnings.push(`Bradycardia: HR ${heartRate} below normal range`);
      } else if (heartRate > adjustedHRRange.max) {
        status = 'high';
        if (heartRate > adjustedHRRange.max + 30) severity = 'severe';
        else if (heartRate > adjustedHRRange.max + 15) severity = 'moderate';
        else severity = 'mild';
        warnings.push(`Tachycardia: HR ${heartRate} above normal range`);
      }

      assessments.heartRate = {
        value: heartRate,
        range: adjustedHRRange,
        status,
        severity
      };
    }

    // Respiratory Rate Assessment
    if (respiratoryRate !== undefined) {
      let status: 'normal' | 'low' | 'high' = 'normal';
      let severity: 'mild' | 'moderate' | 'severe' | undefined;

      if (respiratoryRate < vitalSignsReference.respiratoryRate.min) {
        status = 'low';
        if (respiratoryRate < vitalSignsReference.respiratoryRate.min - 6) severity = 'severe';
        else if (respiratoryRate < vitalSignsReference.respiratoryRate.min - 3) severity = 'moderate';
        else severity = 'mild';
        warnings.push(`Bradypnea: RR ${respiratoryRate} below normal range`);
      } else if (respiratoryRate > vitalSignsReference.respiratoryRate.max) {
        status = 'high';
        if (respiratoryRate > vitalSignsReference.respiratoryRate.max + 10) severity = 'severe';
        else if (respiratoryRate > vitalSignsReference.respiratoryRate.max + 5) severity = 'moderate';
        else severity = 'mild';
        warnings.push(`Tachypnea: RR ${respiratoryRate} above normal range`);
      }

      assessments.respiratoryRate = {
        value: respiratoryRate,
        range: vitalSignsReference.respiratoryRate,
        status,
        severity
      };
    }

    // Systolic BP Assessment
    if (systolicBP !== undefined) {
      let status: 'normal' | 'low' | 'high' = 'normal';
      let severity: 'mild' | 'moderate' | 'severe' | undefined;

      if (systolicBP < vitalSignsReference.systolicBP.min) {
        status = 'low';
        if (systolicBP < 70 && ageInYears >= 18) severity = 'severe';
        else if (systolicBP < 80 && ageInYears >= 18) severity = 'moderate';
        else severity = 'mild';
        warnings.push(`Hypotension: SBP ${systolicBP} below normal range`);
      } else if (systolicBP > vitalSignsReference.systolicBP.max) {
        status = 'high';
        if (systolicBP > 180) severity = 'severe';
        else if (systolicBP > 160) severity = 'moderate';
        else severity = 'mild';
        warnings.push(`Hypertension: SBP ${systolicBP} above normal range`);
      }

      assessments.systolicBP = {
        value: systolicBP,
        range: vitalSignsReference.systolicBP,
        status,
        severity
      };
    }

    // Diastolic BP Assessment (if reference available)
    if (diastolicBP !== undefined && vitalSignsReference.diastolicBP) {
      let status: 'normal' | 'low' | 'high' = 'normal';
      let severity: 'mild' | 'moderate' | 'severe' | undefined;

      if (diastolicBP < vitalSignsReference.diastolicBP.min) {
        status = 'low';
        severity = 'mild';
        warnings.push(`Low DBP: ${diastolicBP} below normal range`);
      } else if (diastolicBP > vitalSignsReference.diastolicBP.max) {
        status = 'high';
        if (diastolicBP > 110) severity = 'severe';
        else if (diastolicBP > 100) severity = 'moderate';
        else severity = 'mild';
        warnings.push(`High DBP: ${diastolicBP} above normal range`);
      }

      assessments.diastolicBP = {
        value: diastolicBP,
        range: vitalSignsReference.diastolicBP,
        status,
        severity
      };
    }

    return {
      ageGroup: vitalSignsReference.ageGroup,
      ageRange: vitalSignsReference.ageRange,
      assessments,
      clinicalNotes,
      warnings
    };
  });

  // Get status color class
  function getStatusColor(status: 'normal' | 'low' | 'high'): string {
    switch (status) {
      case 'normal': return 'panel-green panel-green-heading';
      case 'low': return 'panel-blue panel-blue-heading';
      case 'high': return 'panel-red panel-red-heading';
      default: return 'theme-bg-tertiary theme-text-muted';
    }
  }

  // Get severity color
  function getSeverityColor(severity?: 'mild' | 'moderate' | 'severe'): string {
    switch (severity) {
      case 'mild': return 'text-yellow-400';
      case 'moderate': return 'text-orange-400';
      case 'severe': return 'text-red-400';
      default: return 'text-gray-400';
    }
  }

  // Reset all inputs
  function resetCalculator(): void {
    age = 25;
    ageUnit = 'years';
    heartRate = undefined;
    respiratoryRate = undefined;
    systolicBP = undefined;
    diastolicBP = undefined;
    temperature = undefined;
    temperatureUnit = 'F';
  }
</script>

<div class="theme-bg-secondary p-6 rounded-lg border theme-border-primary max-w-2xl mx-auto">
  <div class="flex items-center gap-2 mb-6">
    <TrendingUp class="theme-accent-primary" size={24} />
    <h2 class="text-xl font-semibold theme-accent-primary">Vital Signs Assessment</h2>
  </div>

  <div class="space-y-4">
    <!-- Age Input -->
    <div class="grid grid-cols-2 gap-3">
      <div>
        <label for="age" class="block text-sm font-medium theme-text-secondary mb-2">
          Patient Age
        </label>
        <input
          id="age"
          type="number"
          bind:value={age}
          min="0"
          max="120"
          class="w-full p-3 theme-bg-tertiary border theme-border-secondary rounded focus:border-blue-500 focus:outline-none theme-text-primary"
          placeholder="Enter age"
        />
      </div>
      <div>
        <label for="ageUnit" class="block text-sm font-medium theme-text-secondary mb-2">
          Unit
        </label>
        <select
          id="ageUnit"
          bind:value={ageUnit}
          class="w-full p-3 theme-bg-tertiary border theme-border-secondary rounded focus:border-blue-500 focus:outline-none theme-text-primary"
        >
          <option value="years">Years</option>
          <option value="months">Months</option>
          <option value="days">Days</option>
        </select>
      </div>
    </div>

    <!-- Vital Signs Inputs -->
    <div class="grid grid-cols-2 gap-3">
      <div>
        <label for="heartRate" class="block text-sm font-medium theme-text-secondary mb-2">
          <div class="flex items-center gap-1">
            <Heart size={16} />
            Heart Rate (bpm)
          </div>
        </label>
        <input
          id="heartRate"
          type="number"
          bind:value={heartRate}
          min="0"
          max="300"
          class="w-full p-3 theme-bg-tertiary border theme-border-secondary rounded focus:border-blue-500 focus:outline-none theme-text-primary"
          placeholder="HR"
        />
      </div>

      <div>
        <label for="respiratoryRate" class="block text-sm font-medium theme-text-secondary mb-2">
          <div class="flex items-center gap-1">
            <Activity size={16} />
            Respiratory Rate (bpm)
          </div>
        </label>
        <input
          id="respiratoryRate"
          type="number"
          bind:value={respiratoryRate}
          min="0"
          max="100"
          class="w-full p-3 theme-bg-tertiary border theme-border-secondary rounded focus:border-blue-500 focus:outline-none theme-text-primary"
          placeholder="RR"
        />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div>
        <label for="systolicBP" class="block text-sm font-medium theme-text-secondary mb-2">
          Systolic BP (mmHg)
        </label>
        <input
          id="systolicBP"
          type="number"
          bind:value={systolicBP}
          min="0"
          max="300"
          class="w-full p-3 theme-bg-tertiary border theme-border-secondary rounded focus:border-blue-500 focus:outline-none theme-text-primary"
          placeholder="SBP"
        />
      </div>

      <div>
        <label for="diastolicBP" class="block text-sm font-medium theme-text-secondary mb-2">
          Diastolic BP (mmHg)
        </label>
        <input
          id="diastolicBP"
          type="number"
          bind:value={diastolicBP}
          min="0"
          max="200"
          class="w-full p-3 theme-bg-tertiary border theme-border-secondary rounded focus:border-blue-500 focus:outline-none theme-text-primary"
          placeholder="DBP"
        />
      </div>
    </div>

    <!-- Optional Temperature -->
    <div class="grid grid-cols-2 gap-3">
      <div>
        <label for="temperature" class="block text-sm font-medium theme-text-secondary mb-2">
          Temperature (optional)
        </label>
        <input
          id="temperature"
          type="number"
          bind:value={temperature}
          step="0.1"
          class="w-full p-3 theme-bg-tertiary border theme-border-secondary rounded focus:border-blue-500 focus:outline-none theme-text-primary"
          placeholder="Temp"
        />
      </div>
      <div>
        <label for="tempUnit" class="block text-sm font-medium theme-text-secondary mb-2">
          Unit
        </label>
        <select
          id="tempUnit"
          bind:value={temperatureUnit}
          class="w-full p-3 theme-bg-tertiary border theme-border-secondary rounded focus:border-blue-500 focus:outline-none theme-text-primary"
        >
          <option value="F">°F</option>
          <option value="C">°C</option>
        </select>
      </div>
    </div>

    <!-- Assessment Results -->
    {#if assessment && vitalSignsReference}
      <div class="mt-6 space-y-4">
        <!-- Age Group Reference -->
        <div class="theme-bg-primary p-3 rounded border theme-border-secondary">
          <div class="text-sm theme-text-secondary">
            <strong>Age Group:</strong> {assessment.ageRange}
          </div>
        </div>

        <!-- Individual Assessments -->
        {#if Object.keys(assessment.assessments).length > 0}
          <div class="space-y-3">
            {#each Object.entries(assessment.assessments) as [vitalType, vitalData], i (vitalType)}
              {#if vitalData}
                <div class="p-3 rounded border {getStatusColor(vitalData.status)}">
                  <div class="flex justify-between items-center">
                    <div>
                      <span class="font-medium capitalize">
                        {vitalType.replace(/([A-Z])/g, ' $1').replace(/bp/gi, 'BP')}:
                      </span>
                      <span class="ml-2 {getSeverityColor(vitalData.severity)}">
                        {vitalData.value} {vitalData.range.unit}
                      </span>
                    </div>
                    <div class="text-sm">
                      Normal: {vitalData.range.min}-{vitalData.range.max} {vitalData.range.unit}
                    </div>
                  </div>
                  {#if vitalData.severity}
                    <div class="text-xs mt-1 {getSeverityColor(vitalData.severity)}">
                      {vitalData.severity.charAt(0).toUpperCase() + vitalData.severity.slice(1)} abnormality
                    </div>
                  {/if}
                </div>
              {/if}
            {/each}
          </div>
        {/if}

        <!-- Warnings -->
        {#if assessment.warnings.length > 0}
          <div class="panel-yellow p-3 rounded border">
            <div class="flex items-start gap-2">
              <AlertTriangle class="panel-yellow-heading mt-0.5 flex-shrink-0" size={16} />
              <div class="text-sm panel-yellow-text">
                <strong>Clinical Alerts:</strong>
                <ul class="mt-1 space-y-0.5">
                  {#each assessment.warnings as warning, i (i)}
                    <li>• {warning}</li>
                  {/each}
                </ul>
              </div>
            </div>
          </div>
        {/if}

        <!-- Clinical Notes -->
        {#if assessment.clinicalNotes.length > 0}
          <div class="panel-blue p-3 rounded border">
            <div class="flex items-start gap-2">
              <Info class="panel-blue-heading mt-0.5 flex-shrink-0" size={16} />
              <div class="text-sm panel-blue-text">
                <strong>Clinical Notes:</strong>
                <ul class="mt-1 space-y-0.5">
                  {#each assessment.clinicalNotes as note, i (i)}
                    <li>• {note}</li>
                  {/each}
                </ul>
              </div>
            </div>
          </div>
        {/if}
      </div>
    {:else}
      <div class="theme-bg-primary p-4 rounded border theme-border-secondary text-center">
        <div class="theme-text-muted">
          Enter patient age and vital signs for assessment
        </div>
      </div>
    {/if}

    <!-- Reset Button -->
    <button
      onclick={resetCalculator}
      class="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded theme-text-primary transition-colors"
    >
      Reset Assessment
    </button>

    <!-- Reference Links -->
    <div class="panel-green p-3 rounded border">
      <div class="flex items-start gap-2">
        <ExternalLink class="panel-green-heading mt-0.5 flex-shrink-0" size={14} />
        <div class="text-xs panel-green-text">
          <strong>References:</strong>
          <a
            href="https://wikem.org/wiki/Vital_signs_(peds)"
            target="_blank"
            rel="noopener noreferrer"
            class="underline hover:opacity-80 block"
          >
            WikEM - Pediatric Vital Signs
          </a>
          <a
            href="https://kidshealthwa.com/calculators/EmergencyCalculator/EmergencyCalculator.htm"
            target="_blank"
            rel="noopener noreferrer"
            class="underline hover:opacity-80 block"
          >
            Kids Health WA - Emergency Calculator
          </a>
        </div>
      </div>
    </div>
  </div>
</div>