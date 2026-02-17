<script lang="ts">
  import { Calculator, Heart, Info, ExternalLink, AlertTriangle } from 'lucide-svelte';
  import {
    calculateShockIndex,
    SHOCK_THRESHOLDS,
    PEDIATRIC_NORMALS,
    VALIDATION,
    type ShockIndexResult,
    type ShockSeverity
  } from '../data/shockIndexData.js';

  let heartRate = $state<number>(80);
  let systolicBP = $state<number>(120);
  let showPediatric = $state<boolean>(false);

  const result = $derived.by((): ShockIndexResult | null => {
    try {
      const hr = Number(heartRate);
      const sbp = Number(systolicBP);
      if (!hr || !sbp || hr <= 0 || sbp <= 0) return null;
      return calculateShockIndex(hr, sbp);
    } catch {
      return null;
    }
  });

  function getSeverityColor(severity: ShockSeverity): string {
    switch (severity) {
      case 'normal': return 'panel-green';
      case 'compensated': return 'panel-yellow';
      case 'mild': return 'panel-orange';
      case 'moderate': return 'panel-red';
      case 'severe': return 'panel-red';
      default: return 'theme-bg-tertiary';
    }
  }

  function getSeverityTextColor(severity: ShockSeverity): string {
    switch (severity) {
      case 'normal': return 'panel-green-heading';
      case 'compensated': return 'panel-yellow-heading';
      case 'mild': return 'panel-orange-heading';
      case 'moderate': return 'panel-red-heading';
      case 'severe': return 'panel-red-heading';
      default: return 'theme-text-muted';
    }
  }

  function resetCalculator(): void {
    heartRate = 80;
    systolicBP = 120;
  }
</script>

<div class="theme-bg-secondary p-6 rounded-lg border theme-border-primary max-w-md mx-auto">
  <div class="flex items-center gap-2 mb-6">
    <Calculator class="theme-accent-primary" size={24} />
    <h2 class="text-xl font-semibold theme-accent-primary">Shock Index Calculator</h2>
  </div>

  <div class="space-y-4">
    <!-- Heart Rate Input -->
    <div>
      <label for="heartRate" class="block text-sm font-medium theme-text-secondary mb-2">
        <span class="flex items-center gap-1">
          <Heart size={16} />
          Heart Rate (bpm)
        </span>
      </label>
      <input
        id="heartRate"
        type="number"
        bind:value={heartRate}
        min={VALIDATION.heartRate.min}
        max={VALIDATION.heartRate.max}
        class="w-full p-3 theme-bg-tertiary border theme-border-secondary rounded focus:border-blue-500 focus:outline-none theme-text-primary"
        placeholder="Heart rate"
      />
    </div>

    <!-- Systolic BP Input -->
    <div>
      <label for="systolicBP" class="block text-sm font-medium theme-text-secondary mb-2">
        Systolic BP (mmHg)
      </label>
      <input
        id="systolicBP"
        type="number"
        bind:value={systolicBP}
        min={VALIDATION.systolicBP.min}
        max={VALIDATION.systolicBP.max}
        class="w-full p-3 theme-bg-tertiary border theme-border-secondary rounded focus:border-blue-500 focus:outline-none theme-text-primary"
        placeholder="Systolic BP"
      />
    </div>

    <!-- Result -->
    <div aria-live="polite" aria-atomic="true">
      {#if result}
        <div class="p-4 rounded border {getSeverityColor(result.severity)}">
          <div class="text-center">
            <div class="text-sm {getSeverityTextColor(result.severity)}">Shock Index</div>
            <div class="text-4xl font-bold {getSeverityTextColor(result.severity)} my-2">{result.shockIndex}</div>
            <div class="text-sm font-medium {getSeverityTextColor(result.severity)}">
              {SHOCK_THRESHOLDS.find(t => t.severity === result.severity)?.label ?? result.severity}
            </div>
          </div>
          <div class="mt-3 text-sm {getSeverityColor(result.severity).replace('panel-', 'panel-') + '-text'}">
            {result.interpretation}
          </div>
        </div>

        <!-- Clinical Notes -->
        {#if result.clinicalNotes.length > 0}
          <div class="panel-blue p-3 rounded border mt-3">
            <div class="flex items-start gap-2">
              <Info class="panel-blue-heading mt-0.5 flex-shrink-0" size={16} />
              <div class="text-sm panel-blue-text">
                <strong>Clinical Guidance:</strong>
                <ul class="mt-1 space-y-0.5">
                  {#each result.clinicalNotes as note, i (i)}
                    <li>• {note}</li>
                  {/each}
                </ul>
              </div>
            </div>
          </div>
        {/if}

        <!-- Warnings -->
        {#if result.warnings.length > 0}
          <div class="panel-yellow p-3 rounded border mt-3">
            <div class="flex items-start gap-2">
              <AlertTriangle class="panel-yellow-heading mt-0.5 flex-shrink-0" size={16} />
              <div class="text-sm panel-yellow-text">
                {#each result.warnings as warning, i (i)}
                  <div class="mb-1 last:mb-0">• {warning}</div>
                {/each}
              </div>
            </div>
          </div>
        {/if}
      {:else}
        <div class="theme-bg-primary p-4 rounded border theme-border-secondary text-center">
          <div class="theme-text-muted">Enter heart rate and systolic BP to calculate</div>
        </div>
      {/if}
    </div>

    <!-- Severity Scale Reference -->
    <div class="theme-bg-primary p-4 rounded border theme-border-secondary">
      <h4 class="font-medium theme-text-primary mb-3">Adult Shock Index Scale</h4>
      <div class="space-y-1.5">
        {#each SHOCK_THRESHOLDS as threshold (threshold.severity)}
          <div class="flex items-center justify-between text-sm p-1.5 rounded {result?.severity === threshold.severity ? 'ring-2 ring-blue-500' : ''}">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full {getSeverityColor(threshold.severity)}"></div>
              <span class="theme-text-primary">{threshold.label}</span>
            </div>
            <span class="theme-text-secondary font-mono text-xs">
              {threshold.max === Infinity ? `> ${threshold.min}` : `${threshold.min} - ${threshold.max}`}
            </span>
          </div>
        {/each}
      </div>
    </div>

    <!-- Pediatric Toggle -->
    <button
      onclick={() => showPediatric = !showPediatric}
      class="w-full py-3 min-h-[44px] text-sm font-medium rounded border theme-border-secondary theme-bg-tertiary hover:theme-bg-primary theme-text-primary transition-colors"
    >
      {showPediatric ? 'Hide' : 'Show'} Pediatric Normal Values
    </button>

    {#if showPediatric}
      <div class="panel-purple p-4 rounded border">
        <h4 class="font-medium panel-purple-heading mb-3">Pediatric Age-Adjusted Normals</h4>
        <div class="space-y-1 text-sm">
          {#each PEDIATRIC_NORMALS as row (row.ageRange)}
            <div class="flex justify-between panel-purple-text">
              <span>{row.ageRange}</span>
              <span class="font-mono">{row.normalSI}</span>
            </div>
          {/each}
        </div>
        <p class="text-xs panel-purple-text mt-2">
          Pediatric patients normally have higher SI values than adults.
        </p>
      </div>
    {/if}

    <!-- Formula -->
    <div class="panel-blue p-4 rounded border">
      <div class="flex items-start gap-2">
        <Info class="panel-blue-heading mt-0.5 flex-shrink-0" size={16} />
        <div class="text-sm panel-blue-text-strong">
          <strong>Formula:</strong> Shock Index = Heart Rate / Systolic BP
          {#if result}
            <br />
            <strong>Calculation:</strong> {heartRate} / {systolicBP} = {result.shockIndex}
          {/if}
        </div>
      </div>
    </div>

    <!-- Citations -->
    <div class="panel-green p-3 rounded border">
      <div class="flex items-start gap-2">
        <ExternalLink class="panel-green-heading mt-0.5 flex-shrink-0" size={14} />
        <div class="text-xs panel-green-text">
          <strong>References:</strong>
          <div class="mt-1 space-y-1">
            <div>Allgöwer M, Burri C. Shock index. Dtsch Med Wochenschr. 1967;92(43):1947-1950.</div>
            <div>Birkhahn RH, et al. Shock index in diagnosing early acute hypovolemia. Am J Emerg Med. 2005;23(3):323-326.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reset -->
    <button
      onclick={resetCalculator}
      class="w-full py-3 min-h-[44px] theme-bg-tertiary hover:theme-bg-primary rounded theme-text-primary transition-colors border theme-border-secondary"
    >
      Reset Calculator
    </button>
  </div>
</div>
