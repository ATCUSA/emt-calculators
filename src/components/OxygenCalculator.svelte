<script lang="ts">
  import { Calculator, Info, ExternalLink } from 'lucide-svelte';
  import type { O2CalculationInput, O2CalculationResult, O2TankSpec } from '../types/medical.js';

  // Tank specifications with conversion factors (liters per PSI)
  const TANK_SPECS: Record<string, O2TankSpec> = {
    'D': { name: 'D Tank (415L)', size: 'D', servicePressure: 2015, tankFactor: 0.16 },
    'E': { name: 'E Tank (680L)', size: 'E', servicePressure: 2015, tankFactor: 0.28 },
    'M': { name: 'M Tank (3000L)', size: 'M', servicePressure: 2015, tankFactor: 1.56 },
    'H': { name: 'H Tank (6900L)', size: 'H', servicePressure: 2015, tankFactor: 3.14 }
  } as const;

  // State variables
  let tankSize = $state<string>('E');
  let currentPressure = $state<number>(2000);
  let flowRate = $state<number>(2);
  let safetyReserve = $state<number>(500); // PSI to keep in reserve
  let safetyMargin = $state<number>(10); // percentage buffer

  // Calculate durations based on inputs
  const calculations = $derived.by((): O2CalculationResult | null => {
    if (!tankSize || currentPressure <= 0 || flowRate <= 0) return null;

    const tankInfo = TANK_SPECS[tankSize];
    if (!tankInfo) return null;

    const totalPressure = currentPressure;
    const usablePressure = Math.max(0, currentPressure - safetyReserve);

    // Calculate total duration (using all pressure)
    const totalDuration = Math.round((totalPressure * tankInfo.tankFactor) / flowRate);

    // Calculate usable duration (accounting for safety reserve)
    const usableDuration = Math.round((usablePressure * tankInfo.tankFactor) / flowRate);

    // Calculate warnings
    const warnings: string[] = [];

    if (currentPressure < tankInfo.servicePressure * 0.5) {
      warnings.push('Tank pressure is below 50% of service pressure');
    }

    if (safetyReserve > currentPressure * 0.5) {
      warnings.push('Safety reserve is more than 50% of current pressure');
    }

    if (usableDuration < 30) {
      warnings.push('Less than 30 minutes of usable oxygen remaining');
    }

    if (flowRate > 15) {
      warnings.push('High flow rate - consider checking equipment and patient needs');
    }

    return {
      usableDuration,
      totalDuration,
      reservePressure: safetyReserve,
      warnings,
      tankInfo,
      calculationDetails: {
        usablePressure,
        totalPressure,
        flowRate,
        safetyReserve
      }
    };
  });

  // Format time display
  function formatTime(minutes: number): string {
    if (minutes === 0) return '0 minutes';

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) return `${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
    if (remainingMinutes === 0) return `${hours} hour${hours !== 1 ? 's' : ''}`;
    return `${hours}h ${remainingMinutes}m`;
  }

  // Reset all values to defaults
  function resetCalculator(): void {
    tankSize = 'E';
    currentPressure = 2000;
    flowRate = 2;
    safetyReserve = 500;
    safetyMargin = 10;
  }
</script>

<div class="theme-bg-secondary p-6 rounded-lg border theme-border-primary max-w-md mx-auto">
  <div class="flex items-center gap-2 mb-6">
    <Calculator class="theme-accent-primary" size={24} />
    <h2 class="text-xl font-semibold theme-accent-primary">O₂ Tank Duration Calculator</h2>
  </div>

  <div class="space-y-4">
    <!-- Tank Size Selection -->
    <div>
      <label for="tankSize" class="block text-sm font-medium theme-text-secondary mb-2">
        Tank Size
      </label>
      <select
        id="tankSize"
        bind:value={tankSize}
        class="w-full p-3 theme-bg-tertiary border theme-border-secondary rounded focus:border-blue-500 focus:outline-none theme-text-primary"
      >
        <option value="D">D Tank (0.16 L/PSI)</option>
        <option value="E">E Tank (0.28 L/PSI)</option>
        <option value="M">M Tank (1.56 L/PSI)</option>
        <option value="H">H Tank (3.14 L/PSI)</option>
      </select>
    </div>

    <!-- Pressure Input -->
    <div>
      <label for="pressure" class="block text-sm font-medium theme-text-secondary mb-2">
        Tank Pressure (PSI)
      </label>
      <input
        id="pressure"
        type="number"
        bind:value={currentPressure}
        min="0"
        max="3000"
        step="50"
        class="w-full p-3 theme-bg-tertiary border theme-border-secondary rounded focus:border-blue-500 focus:outline-none theme-text-primary"
        placeholder="Enter pressure in PSI"
      />
    </div>

    <!-- Safety Reserve Input -->
    <div>
      <label for="safetyReserve" class="block text-sm font-medium theme-text-secondary mb-2">
        Safety Reserve (PSI)
      </label>
      <input
        id="safetyReserve"
        type="number"
        bind:value={safetyReserve}
        min="0"
        max="1500"
        step="50"
        class="w-full p-3 theme-bg-tertiary border theme-border-secondary rounded focus:border-blue-500 focus:outline-none theme-text-primary"
        placeholder="PSI to keep in reserve"
      />
    </div>

    <!-- Flow Rate Input -->
    <div>
      <label for="flowRate" class="block text-sm font-medium theme-text-secondary mb-2">
        Flow Rate (L/min)
      </label>
      <input
        id="flowRate"
        type="number"
        bind:value={flowRate}
        min="0.5"
        max="25"
        step="0.5"
        class="w-full p-3 theme-bg-tertiary border theme-border-secondary rounded focus:border-blue-500 focus:outline-none theme-text-primary"
        placeholder="Enter flow rate in L/min"
      />
    </div>

    <!-- Result Display -->
    {#if calculations}
      <!-- Primary Result - Usable Duration with Safety Reserve -->
      <div class="theme-bg-primary p-4 rounded border theme-border-secondary">
        <div class="text-center">
          <div class="text-2xl font-bold theme-accent-primary mb-1">
            {formatTime(calculations.usableDuration)}
          </div>
          <div class="text-sm theme-text-muted mb-2">
            Usable Duration (with {safetyReserve} PSI reserve)
          </div>
          <div class="text-lg text-gray-400">
            {formatTime(calculations.totalDuration)} total
          </div>
        </div>
      </div>

      <!-- Warnings -->
      {#if calculations.warnings.length > 0}
        <div class="panel-yellow p-3 rounded border">
          <div class="text-sm panel-yellow-text">
            {#each calculations.warnings as warning, i (i)}
              <div class="mb-1">⚠️ {warning}</div>
            {/each}
          </div>
        </div>
      {/if}
    {:else}
      <div class="theme-bg-primary p-4 rounded border theme-border-secondary">
        <div class="text-center theme-text-muted">
          Enter values to calculate duration
        </div>
      </div>
    {/if}

    <!-- Formula Information -->
    <div class="panel-blue p-4 rounded border">
      <div class="flex items-start gap-2">
        <Info class="panel-blue-heading mt-0.5 flex-shrink-0" size={16} />
        <div class="text-sm panel-blue-text-strong">
          <strong>Formula:</strong> Duration = (Pressure × Tank Factor) ÷ Flow Rate
          {#if calculations}
            <br />
            <strong>Usable:</strong> ({currentPressure - safetyReserve} × {calculations.tankInfo.tankFactor}) ÷ {flowRate} = {calculations.usableDuration} min
            <br />
            <strong>Total:</strong> ({currentPressure} × {calculations.tankInfo.tankFactor}) ÷ {flowRate} = {calculations.totalDuration} min
          {/if}
        </div>
      </div>
    </div>

    <!-- Medical Citation -->
    <div class="panel-green p-3 rounded border">
      <div class="flex items-start gap-2">
        <ExternalLink class="panel-green-heading mt-0.5 flex-shrink-0" size={14} />
        <div class="text-xs panel-green-text">
          <strong>Reference:</strong>
          <a
            href="https://pulmonary.medicine.ufl.edu/files/2018/07/Calculating-tank-durations-for-HFNC-Systems-and-Bipap-V-60-Systems.pdf"
            target="_blank"
            rel="noopener noreferrer"
            class="underline hover:opacity-80"
          >
            UF Pulmonary Medicine - Tank Duration Calculations
          </a>
        </div>
      </div>
    </div>

    <!-- Reset Button -->
    <button
      onclick={resetCalculator}
      class="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded theme-text-primary transition-colors"
    >
      Reset Calculator
    </button>
  </div>
</div>