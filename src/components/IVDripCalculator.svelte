<script lang="ts">
  import { Calculator, Info, ExternalLink } from 'lucide-svelte';
  import type { DropFactor } from '../types/medical.js';
  import { DROP_FACTOR_PRESETS, calculateDripRate, VALIDATION } from '../data/ivDripCalculator.js';

  let volume = $state<number>(1000);
  let timeHours = $state<number>(1);
  let timeMinutes = $state<number>(0);
  let dropFactor = $state<DropFactor>(15);

  const totalMinutes = $derived.by(() => {
    const h = Number(timeHours) || 0;
    const m = Number(timeMinutes) || 0;
    return h * 60 + m;
  });

  const result = $derived.by(() => {
    const vol = Number(volume) || 0;
    const time = totalMinutes;
    if (vol <= 0 || time <= 0) return null;
    try {
      return calculateDripRate(vol, time, dropFactor);
    } catch {
      return null;
    }
  });

  const rateStatus = $derived.by((): 'normal' | 'caution' | 'critical' => {
    if (!result) return 'normal';
    if (result.gttsPerMin > 150 || result.mlPerHour > 999) return 'critical';
    if (result.gttsPerMin > 100 || result.gttsPerMin < 1) return 'caution';
    return 'normal';
  });

  function resetCalculator(): void {
    volume = 1000;
    timeHours = 1;
    timeMinutes = 0;
    dropFactor = 15;
  }
</script>

<div class="theme-bg-secondary p-6 rounded-lg border theme-border-primary max-w-md mx-auto">
  <div class="flex items-center gap-2 mb-6">
    <Calculator class="theme-accent-primary" size={24} />
    <h2 class="text-xl font-semibold theme-accent-primary">IV Drip Rate Calculator</h2>
  </div>

  <div class="space-y-4">
    <!-- Volume Input -->
    <div>
      <label for="volume" class="block text-sm font-medium theme-text-secondary mb-2">
        Volume to Infuse (mL)
      </label>
      <input
        id="volume"
        type="number"
        bind:value={volume}
        min={VALIDATION.volume.min}
        max={VALIDATION.volume.max}
        step="50"
        aria-label="Volume to infuse in milliliters"
        class="w-full p-3 theme-bg-tertiary border theme-border-secondary rounded focus:border-blue-500 focus:outline-none theme-text-primary"
        placeholder="Enter volume in mL"
      />
    </div>

    <!-- Time Input -->
    <div>
      <span class="block text-sm font-medium theme-text-secondary mb-2">
        Infusion Time
      </span>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label for="timeHours" class="block text-xs theme-text-muted mb-1">Hours</label>
          <input
            id="timeHours"
            type="number"
            bind:value={timeHours}
            min="0"
            max="24"
            step="1"
            aria-label="Infusion time hours"
            class="w-full p-3 theme-bg-tertiary border theme-border-secondary rounded focus:border-blue-500 focus:outline-none theme-text-primary"
          />
        </div>
        <div>
          <label for="timeMinutes" class="block text-xs theme-text-muted mb-1">Minutes</label>
          <input
            id="timeMinutes"
            type="number"
            bind:value={timeMinutes}
            min="0"
            max="59"
            step="5"
            aria-label="Infusion time minutes"
            class="w-full p-3 theme-bg-tertiary border theme-border-secondary rounded focus:border-blue-500 focus:outline-none theme-text-primary"
          />
        </div>
      </div>
      {#if totalMinutes > 0}
        <p class="text-xs theme-text-muted mt-1">Total: {totalMinutes} minutes</p>
      {/if}
    </div>

    <!-- Drop Factor Selection -->
    <div>
      <label for="dropFactor" class="block text-sm font-medium theme-text-secondary mb-2">
        Drop Factor (gtt/mL)
      </label>
      <select
        id="dropFactor"
        bind:value={dropFactor}
        aria-label="IV tubing drop factor"
        class="w-full p-3 theme-bg-tertiary border theme-border-secondary rounded focus:border-blue-500 focus:outline-none theme-text-primary"
      >
        {#each DROP_FACTOR_PRESETS as preset (preset.factor)}
          <option value={preset.factor}>{preset.label} — {preset.tubingType}</option>
        {/each}
      </select>
    </div>

    <!-- Result Display -->
    <div aria-live="polite" aria-atomic="true">
      {#if result}
        <div class="theme-bg-primary p-4 rounded border theme-border-secondary">
          <div class="text-center">
            <div class="text-3xl font-bold mb-1 {rateStatus === 'critical' ? 'text-red-500' : rateStatus === 'caution' ? 'text-yellow-500' : 'theme-accent-primary'}">
              {result.gttsPerMin} gtt/min
            </div>
            <div class="text-lg theme-text-secondary mb-1">
              {result.mlPerHour} mL/hr
            </div>
            <div class="text-xs theme-text-muted">
              {volume} mL over {totalMinutes} min | {dropFactor} gtt/mL tubing
            </div>
          </div>
        </div>

        <!-- Warnings -->
        {#if result.warnings.length > 0}
          <div class="panel-yellow p-3 rounded border mt-3">
            <div class="text-sm panel-yellow-text">
              {#each result.warnings as warning, i (i)}
                <div class="mb-1 last:mb-0">* {warning}</div>
              {/each}
            </div>
          </div>
        {/if}
      {:else}
        <div class="theme-bg-primary p-4 rounded border theme-border-secondary">
          <div class="text-center theme-text-muted">
            Enter values to calculate drip rate
          </div>
        </div>
      {/if}
    </div>

    <!-- Formula Information -->
    <div class="panel-blue p-4 rounded border">
      <div class="flex items-start gap-2">
        <Info class="panel-blue-heading mt-0.5 flex-shrink-0" size={16} />
        <div class="text-sm panel-blue-text-strong">
          <strong>Formula:</strong> gtt/min = (Volume x Drop Factor) / Time (min)
          {#if result}
            <br />
            <strong>Calculation:</strong> ({volume} x {dropFactor}) / {totalMinutes} = {result.gttsPerMin} gtt/min
            <br />
            <strong>mL/hr:</strong> ({volume} / {totalMinutes}) x 60 = {result.mlPerHour} mL/hr
          {/if}
        </div>
      </div>
    </div>

    <!-- Medical Citation -->
    <div class="panel-green p-3 rounded border">
      <div class="flex items-start gap-2">
        <ExternalLink class="panel-green-heading mt-0.5 flex-shrink-0" size={14} />
        <div class="text-xs panel-green-text">
          <strong>Reference:</strong> Standard IV drip rate formula used in EMS and nursing pharmacology education.
          gtt/min = (V x DF) / T. mL/hr = (V / T) x 60.
        </div>
      </div>
    </div>

    <!-- Reset Button -->
    <button
      onclick={resetCalculator}
      class="w-full py-3 min-h-[44px] bg-gray-700 hover:bg-gray-600 rounded theme-text-primary transition-colors"
    >
      Reset Calculator
    </button>
  </div>
</div>
