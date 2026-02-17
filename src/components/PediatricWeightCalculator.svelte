<script lang="ts">
  import { Calculator, Info, ExternalLink, AlertTriangle } from 'lucide-svelte';
  import {
    estimateWeightByAge,
    findBroselowZone,
    BROSELOW_ZONES,
    VALIDATION,
    type APLSWeightResult,
    type BroselowZone
  } from '../data/pediatricWeightData.js';

  type Mode = 'age' | 'length';

  let mode = $state<Mode>('age');

  // Age-based inputs
  let ageYears = $state<number>(2);
  let ageMonths = $state<number>(0);

  // Length-based input
  let lengthCm = $state<number>(80);

  // Age-based result
  const ageResult = $derived.by((): APLSWeightResult | null => {
    try {
      if (mode !== 'age') return null;
      const totalMonths = ageYears * 12 + ageMonths;
      if (totalMonths < 0 || ageYears > VALIDATION.ageYears.max) return null;
      return estimateWeightByAge(ageYears, ageMonths);
    } catch {
      return null;
    }
  });

  // Length-based result
  const lengthResult = $derived.by((): BroselowZone | null => {
    try {
      if (mode !== 'length') return null;
      if (lengthCm < VALIDATION.lengthCm.min || lengthCm > VALIDATION.lengthCm.max) return null;
      return findBroselowZone(lengthCm);
    } catch {
      return null;
    }
  });

  function resetCalculator(): void {
    ageYears = 2;
    ageMonths = 0;
    lengthCm = 80;
  }
</script>

<div class="theme-bg-secondary p-6 rounded-lg border theme-border-primary max-w-2xl mx-auto">
  <div class="flex items-center gap-2 mb-6">
    <Calculator class="theme-accent-primary" size={24} />
    <h2 class="text-xl font-semibold theme-accent-primary">Pediatric Weight Estimation</h2>
  </div>

  <!-- Mode Toggle -->
  <div class="flex gap-2 mb-6">
    <button
      onclick={() => mode = 'age'}
      class="flex-1 py-3 min-h-[44px] rounded font-medium transition-colors
        {mode === 'age'
          ? 'bg-blue-600 text-white'
          : 'theme-bg-tertiary theme-text-secondary border theme-border-secondary hover:theme-bg-primary'}"
    >
      Age-Based (APLS)
    </button>
    <button
      onclick={() => mode = 'length'}
      class="flex-1 py-3 min-h-[44px] rounded font-medium transition-colors
        {mode === 'length'
          ? 'bg-blue-600 text-white'
          : 'theme-bg-tertiary theme-text-secondary border theme-border-secondary hover:theme-bg-primary'}"
    >
      Length-Based (Broselow)
    </button>
  </div>

  <div class="space-y-4">
    {#if mode === 'age'}
      <!-- Age Inputs -->
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label for="ageYears" class="block text-sm font-medium theme-text-secondary mb-2">
            Age (Years)
          </label>
          <input
            id="ageYears"
            type="number"
            bind:value={ageYears}
            min="0"
            max="18"
            class="w-full p-3 theme-bg-tertiary border theme-border-secondary rounded focus:border-blue-500 focus:outline-none theme-text-primary"
            placeholder="Years"
          />
        </div>
        <div>
          <label for="ageMonths" class="block text-sm font-medium theme-text-secondary mb-2">
            Months
          </label>
          <input
            id="ageMonths"
            type="number"
            bind:value={ageMonths}
            min="0"
            max="11"
            class="w-full p-3 theme-bg-tertiary border theme-border-secondary rounded focus:border-blue-500 focus:outline-none theme-text-primary"
            placeholder="Months"
          />
        </div>
      </div>

      <!-- Age Result -->
      <div aria-live="polite" aria-atomic="true">
        {#if ageResult}
          <div class="theme-bg-primary p-4 rounded border theme-border-secondary text-center">
            <div class="text-sm theme-text-muted">{ageResult.ageCategory}</div>
            <div class="text-3xl font-bold theme-accent-primary mt-1">{ageResult.estimatedWeightKg} kg</div>
            <div class="text-lg theme-text-secondary">{ageResult.estimatedWeightLb} lb</div>
            <div class="text-xs theme-text-muted mt-2">
              Formula: {ageResult.formula} = {ageResult.estimatedWeightKg} kg
            </div>
          </div>
        {:else}
          <div class="theme-bg-primary p-4 rounded border theme-border-secondary text-center">
            <div class="theme-text-muted">Enter age to estimate weight</div>
          </div>
        {/if}
      </div>

    {:else}
      <!-- Length Input -->
      <div>
        <label for="lengthCm" class="block text-sm font-medium theme-text-secondary mb-2">
          Patient Length (cm)
        </label>
        <input
          id="lengthCm"
          type="number"
          bind:value={lengthCm}
          min={VALIDATION.lengthCm.min}
          max={VALIDATION.lengthCm.max}
          step="0.5"
          class="w-full p-3 theme-bg-tertiary border theme-border-secondary rounded focus:border-blue-500 focus:outline-none theme-text-primary"
          placeholder="Length in cm"
        />
        <p class="text-xs theme-text-muted mt-1">Broselow range: {VALIDATION.lengthCm.min}-{VALIDATION.lengthCm.max} cm</p>
      </div>

      <!-- Length Result -->
      <div aria-live="polite" aria-atomic="true">
        {#if lengthResult}
          <div class="theme-bg-primary p-4 rounded border theme-border-secondary text-center">
            <div class="flex items-center justify-center gap-2 mb-2">
              <div
                class="w-6 h-6 rounded border-2 border-gray-500"
                style="background-color: {lengthResult.colorHex}"
              ></div>
              <span class="text-sm font-medium theme-text-secondary">{lengthResult.color} Zone</span>
            </div>
            <div class="text-3xl font-bold theme-accent-primary">{lengthResult.estimatedWeightKg} kg</div>
            <div class="text-lg theme-text-secondary">{Math.round(lengthResult.estimatedWeightKg * 2.20462 * 10) / 10} lb</div>
            <div class="text-xs theme-text-muted mt-2">
              Length range: {lengthResult.lengthMin}-{lengthResult.lengthMax} cm
            </div>
          </div>
        {:else if lengthCm >= VALIDATION.lengthCm.min && lengthCm <= VALIDATION.lengthCm.max}
          <div class="panel-yellow p-4 rounded border text-center">
            <div class="panel-yellow-text text-sm">No Broselow zone matches this length</div>
          </div>
        {:else}
          <div class="theme-bg-primary p-4 rounded border theme-border-secondary text-center">
            <div class="theme-text-muted">Enter length to find Broselow zone</div>
          </div>
        {/if}
      </div>
    {/if}

    <!-- Broselow Zone Chart -->
    <div class="theme-bg-primary p-4 rounded border theme-border-secondary">
      <h4 class="font-medium theme-text-primary mb-3">Broselow Zone Reference</h4>
      <div class="space-y-1.5">
        {#each BROSELOW_ZONES as zone (zone.color)}
          <div class="flex items-center gap-3 text-sm p-1.5 rounded {mode === 'length' && lengthResult?.color === zone.color ? 'ring-2 ring-blue-500' : ''}">
            <div
              class="w-5 h-5 rounded border border-gray-500 flex-shrink-0"
              style="background-color: {zone.colorHex}"
            ></div>
            <span class="w-16 font-medium theme-text-primary">{zone.color}</span>
            <span class="theme-text-secondary">{zone.lengthMin}-{zone.lengthMax} cm</span>
            <span class="ml-auto font-medium theme-text-primary">{zone.estimatedWeightKg} kg</span>
          </div>
        {/each}
      </div>
    </div>

    <!-- Disclaimer -->
    <div class="panel-yellow p-3 rounded border">
      <div class="flex items-start gap-2">
        <AlertTriangle class="panel-yellow-heading mt-0.5 flex-shrink-0" size={16} />
        <div class="text-sm panel-yellow-text">
          <strong>Important:</strong> These are <strong>estimates only</strong>. Actual patient weight
          is always preferred. Use estimated weight only when actual weight cannot be obtained.
        </div>
      </div>
    </div>

    <!-- Formula Info -->
    <div class="panel-blue p-4 rounded border">
      <div class="flex items-start gap-2">
        <Info class="panel-blue-heading mt-0.5 flex-shrink-0" size={16} />
        <div class="text-sm panel-blue-text-strong">
          <strong>APLS Formulas:</strong>
          <ul class="mt-1 space-y-0.5">
            <li>Infant (0-12 mo): (months + 9) / 2</li>
            <li>Child (1-5 yr): (years x 2) + 8</li>
            <li>Child (6-12 yr): (years x 3) + 7</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Medical Citations -->
    <div class="panel-green p-3 rounded border">
      <div class="flex items-start gap-2">
        <ExternalLink class="panel-green-heading mt-0.5 flex-shrink-0" size={14} />
        <div class="text-xs panel-green-text">
          <strong>References:</strong>
          <div class="mt-1 space-y-1">
            <div>Advanced Paediatric Life Support (APLS), 6th Edition. BMJ Publishing Group.</div>
            <div>Lubitz DS, Seidel JS, Chameides L, et al. A rapid method for estimating weight and resuscitation drug dosages from length in the pediatric age group. Ann Emerg Med. 1988;17(6):576-581.</div>
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
