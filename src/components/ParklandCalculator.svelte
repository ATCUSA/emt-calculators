<script lang="ts">
  import { Calculator, Info, ExternalLink, AlertTriangle } from 'lucide-svelte';
  import {
    calculateParkland,
    lbToKg,
    RULE_OF_NINES,
    VALIDATION,
    type ParklandResult
  } from '../data/parklandCalculator.js';

  let weight = $state<number>(70);
  let weightUnit = $state<'kg' | 'lb'>('kg');
  let tbsaPercent = $state<number>(20);
  let burnTime = $state<string>('');
  let showRuleOfNines = $state<boolean>(false);

  const weightKg = $derived(weightUnit === 'lb' ? lbToKg(weight) : weight);

  const result = $derived.by((): ParklandResult | null => {
    try {
      if (weightKg < VALIDATION.weight.min || weightKg > VALIDATION.weight.max) return null;
      if (tbsaPercent < VALIDATION.tbsa.min || tbsaPercent > VALIDATION.tbsa.max) return null;
      return calculateParkland({ weightKg, tbsaPercent });
    } catch {
      return null;
    }
  });

  function resetCalculator(): void {
    weight = 70;
    weightUnit = 'kg';
    tbsaPercent = 20;
    burnTime = '';
  }
</script>

<div class="theme-bg-secondary p-6 rounded-lg border theme-border-primary max-w-2xl mx-auto">
  <div class="flex items-center gap-2 mb-6">
    <Calculator class="theme-accent-primary" size={24} />
    <h2 class="text-xl font-semibold theme-accent-primary">Parkland Burn Formula</h2>
  </div>

  <div class="space-y-4">
    <!-- Weight Input -->
    <div class="grid grid-cols-2 gap-3">
      <div>
        <label for="weight" class="block text-sm font-medium theme-text-secondary mb-2">
          Patient Weight
        </label>
        <input
          id="weight"
          type="number"
          bind:value={weight}
          min="1"
          max={weightUnit === 'kg' ? 300 : 660}
          step="0.1"
          class="w-full p-3 theme-bg-tertiary border theme-border-secondary rounded focus:border-blue-500 focus:outline-none theme-text-primary"
          placeholder="Weight"
        />
      </div>
      <div>
        <label for="weightUnit" class="block text-sm font-medium theme-text-secondary mb-2">
          Unit
        </label>
        <select
          id="weightUnit"
          bind:value={weightUnit}
          class="w-full p-3 theme-bg-tertiary border theme-border-secondary rounded focus:border-blue-500 focus:outline-none theme-text-primary"
        >
          <option value="kg">kg</option>
          <option value="lb">lb</option>
        </select>
      </div>
    </div>

    {#if weightUnit === 'lb'}
      <p class="text-xs theme-text-muted">Converted: {weightKg} kg</p>
    {/if}

    <!-- TBSA Input -->
    <div>
      <label for="tbsa" class="block text-sm font-medium theme-text-secondary mb-2">
        % Total Body Surface Area Burned (TBSA)
      </label>
      <input
        id="tbsa"
        type="number"
        bind:value={tbsaPercent}
        min="1"
        max="100"
        step="1"
        class="w-full p-3 theme-bg-tertiary border theme-border-secondary rounded focus:border-blue-500 focus:outline-none theme-text-primary"
        placeholder="% TBSA"
      />
    </div>

    <!-- Rule of Nines Toggle -->
    <button
      onclick={() => showRuleOfNines = !showRuleOfNines}
      class="w-full py-3 min-h-[44px] text-sm font-medium rounded border theme-border-secondary theme-bg-tertiary hover:theme-bg-primary theme-text-primary transition-colors"
    >
      {showRuleOfNines ? 'Hide' : 'Show'} Rule of Nines Reference
    </button>

    {#if showRuleOfNines}
      <div class="panel-blue p-4 rounded border">
        <h4 class="font-medium panel-blue-heading mb-3">Rule of Nines</h4>
        <div class="grid grid-cols-3 gap-1 text-sm">
          <div class="font-medium panel-blue-text-strong">Region</div>
          <div class="font-medium panel-blue-text-strong text-center">Adult</div>
          <div class="font-medium panel-blue-text-strong text-center">Infant</div>
          {#each RULE_OF_NINES as row (row.region)}
            <div class="panel-blue-text">{row.region}</div>
            <div class="panel-blue-text text-center">{row.adult}%</div>
            <div class="panel-blue-text text-center">{row.pediatric}%</div>
          {/each}
        </div>
        <p class="text-xs panel-blue-text mt-2">
          Palm of patient's hand (including fingers) ≈ 1% TBSA
        </p>
      </div>
    {/if}

    <!-- Burn Time (optional) -->
    <div>
      <label for="burnTime" class="block text-sm font-medium theme-text-secondary mb-2">
        Time of Burn (optional)
      </label>
      <input
        id="burnTime"
        type="time"
        bind:value={burnTime}
        class="w-full p-3 theme-bg-tertiary border theme-border-secondary rounded focus:border-blue-500 focus:outline-none theme-text-primary"
      />
      <p class="text-xs theme-text-muted mt-1">
        First 8-hour window starts from time of burn, not time of IV access
      </p>
    </div>

    <!-- Results -->
    <div aria-live="polite" aria-atomic="true">
      {#if result}
        <div class="theme-bg-primary p-4 rounded border theme-border-secondary space-y-3">
          <div class="text-center">
            <div class="text-sm theme-text-muted">Total 24-Hour Fluid</div>
            <div class="text-3xl font-bold theme-accent-primary">{result.totalFluid24hr.toLocaleString()} mL</div>
            <div class="text-xs theme-text-muted mt-1">
              4 x {weightKg} kg x {tbsaPercent}% = {result.totalFluid24hr.toLocaleString()} mL LR
            </div>
          </div>

          <hr class="theme-border-secondary" />

          <div class="grid grid-cols-2 gap-4 text-center">
            <div class="p-3 panel-orange rounded border">
              <div class="text-xs panel-orange-text">First 8 Hours</div>
              <div class="text-xl font-bold panel-orange-heading">{result.first8hrTotal.toLocaleString()} mL</div>
              <div class="text-sm font-medium panel-orange-text-strong">{result.first8hrRate} mL/hr</div>
            </div>
            <div class="p-3 panel-blue rounded border">
              <div class="text-xs panel-blue-text">Remaining 16 Hours</div>
              <div class="text-xl font-bold panel-blue-heading">{result.remaining16hrTotal.toLocaleString()} mL</div>
              <div class="text-sm font-medium panel-blue-text-strong">{result.remaining16hrRate} mL/hr</div>
            </div>
          </div>
        </div>

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
          <div class="theme-text-muted">Enter weight and TBSA% to calculate fluid requirements</div>
        </div>
      {/if}
    </div>

    <!-- Formula -->
    <div class="panel-blue p-4 rounded border">
      <div class="flex items-start gap-2">
        <Info class="panel-blue-heading mt-0.5 flex-shrink-0" size={16} />
        <div class="text-sm panel-blue-text-strong">
          <strong>Parkland Formula:</strong> Total fluid = 4 mL x weight (kg) x %TBSA
          <br />
          <strong>Fluid:</strong> Lactated Ringer's (LR)
          <br />
          <strong>Distribution:</strong> 50% in first 8 hours, 50% over remaining 16 hours
        </div>
      </div>
    </div>

    <!-- Medical Citation -->
    <div class="panel-green p-3 rounded border">
      <div class="flex items-start gap-2">
        <ExternalLink class="panel-green-heading mt-0.5 flex-shrink-0" size={14} />
        <div class="text-xs panel-green-text">
          <strong>References:</strong>
          <div class="mt-1 space-y-1">
            <div>Baxter CR, Shires T. Physiological response to crystalloid resuscitation of severe burns. Ann N Y Acad Sci. 1968;150:874-894.</div>
            <div>ATLS 10th Edition, Chapter 9: Thermal Injuries.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reset Button -->
    <button
      onclick={resetCalculator}
      class="w-full py-3 min-h-[44px] theme-bg-tertiary hover:theme-bg-primary rounded theme-text-primary transition-colors border theme-border-secondary"
    >
      Reset Calculator
    </button>
  </div>
</div>
