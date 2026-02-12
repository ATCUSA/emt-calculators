<script lang="ts">
  import { Heart, Activity, Info } from 'lucide-svelte';
  import { VITAL_SIGNS_DATA, VITAL_SIGNS_NOTES } from '../data/vitalSigns.js';
  import type { VitalSignsByAge } from '../types/medical.js';

  // State for filtering between pediatric and adult
  let selectedCategory = $state<'pediatric' | 'adult' | 'all'>('all');

  // Filter data based on selection
  const filteredData = $derived.by(() => {
    if (selectedCategory === 'all') {
      return [...VITAL_SIGNS_DATA.pediatric, ...VITAL_SIGNS_DATA.adult];
    }
    return VITAL_SIGNS_DATA[selectedCategory];
  });

  // Format range display
  function formatRange(range: { min: number; max: number; unit: string }): string {
    return `${range.min}-${range.max} ${range.unit}`;
  }

  // Get status color class for vital sign category
  function getStatusColor(status: 'normal' | 'caution' | 'critical'): string {
    switch (status) {
      case 'normal': return 'text-green-400 bg-green-900/20 border-green-700/50';
      case 'caution': return 'text-yellow-400 bg-yellow-900/20 border-yellow-700/50';
      case 'critical': return 'text-red-400 bg-red-900/20 border-red-700/50';
      default: return 'text-blue-400 bg-blue-900/20 border-blue-700/50';
    }
  }
</script>

<div class="theme-bg-secondary p-6 rounded-lg border theme-border-primary max-w-4xl mx-auto">
  <div class="flex items-center gap-2 mb-6">
    <Heart class="theme-accent-primary" size={24} />
    <h2 class="text-xl font-semibold theme-accent-primary">Vital Signs Reference</h2>
  </div>

  <!-- Category Filter -->
  <div class="mb-6 flex gap-2 flex-wrap">
    <button
      onclick={() => selectedCategory = 'all'}
      class="px-4 py-2 rounded transition-colors {selectedCategory === 'all'
        ? 'bg-blue-600 text-white'
        : 'theme-bg-tertiary theme-text-secondary hover:theme-bg-primary'}"
    >
      All Ages
    </button>
    <button
      onclick={() => selectedCategory = 'pediatric'}
      class="px-4 py-2 rounded transition-colors {selectedCategory === 'pediatric'
        ? 'bg-blue-600 text-white'
        : 'theme-bg-tertiary theme-text-secondary hover:theme-bg-primary'}"
    >
      Pediatric
    </button>
    <button
      onclick={() => selectedCategory = 'adult'}
      class="px-4 py-2 rounded transition-colors {selectedCategory === 'adult'
        ? 'bg-blue-600 text-white'
        : 'theme-bg-tertiary theme-text-secondary hover:theme-bg-primary'}"
    >
      Adult
    </button>
  </div>

  <!-- Vital Signs Table -->
  <div class="overflow-x-auto">
    <table class="w-full border-collapse">
      <thead>
        <tr class="theme-bg-tertiary">
          <th class="text-left p-3 theme-text-primary font-medium border theme-border-secondary">Age Range</th>
          <th class="text-center p-3 theme-text-primary font-medium border theme-border-secondary">
            <div class="flex items-center justify-center gap-1">
              <Heart size={16} />
              HR (bpm)
            </div>
          </th>
          <th class="text-center p-3 theme-text-primary font-medium border theme-border-secondary">
            <div class="flex items-center justify-center gap-1">
              <Activity size={16} />
              RR (bpm)
            </div>
          </th>
          <th class="text-center p-3 theme-text-primary font-medium border theme-border-secondary">
            SBP (mmHg)
          </th>
          <th class="text-center p-3 theme-text-primary font-medium border theme-border-secondary">
            DBP (mmHg)
          </th>
        </tr>
      </thead>
      <tbody>
        {#each filteredData as ageGroup, i (ageGroup.ageGroup)}
          <tr class="{i % 2 === 0 ? 'theme-bg-primary' : 'theme-bg-secondary'} hover:theme-bg-tertiary transition-colors">
            <td class="p-3 font-medium theme-text-primary border theme-border-secondary">
              {ageGroup.ageRange}
            </td>
            <td class="p-3 text-center theme-text-secondary border theme-border-secondary">
              <span class="inline-block px-2 py-1 rounded bg-green-900/20 text-green-200">
                {formatRange(ageGroup.heartRate)}
              </span>
            </td>
            <td class="p-3 text-center theme-text-secondary border theme-border-secondary">
              <span class="inline-block px-2 py-1 rounded bg-blue-900/20 text-blue-200">
                {formatRange(ageGroup.respiratoryRate)}
              </span>
            </td>
            <td class="p-3 text-center theme-text-secondary border theme-border-secondary">
              <span class="inline-block px-2 py-1 rounded bg-purple-900/20 text-purple-200">
                {formatRange(ageGroup.systolicBP)}
              </span>
            </td>
            <td class="p-3 text-center theme-text-secondary border theme-border-secondary">
              {#if ageGroup.diastolicBP}
                <span class="inline-block px-2 py-1 rounded bg-orange-900/20 text-orange-200">
                  {formatRange(ageGroup.diastolicBP)}
                </span>
              {:else}
                <span class="theme-text-muted text-sm">—</span>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <!-- Clinical Notes -->
  <div class="mt-6 space-y-3">
    <div class="bg-blue-900/20 p-4 rounded border border-blue-700/50">
      <div class="flex items-start gap-2">
        <Info class="text-blue-400 mt-0.5 flex-shrink-0" size={16} />
        <div class="text-sm text-blue-100">
          <strong>Clinical Notes:</strong>
          <ul class="mt-2 space-y-1 list-disc list-inside">
            <li>{VITAL_SIGNS_NOTES.fever}</li>
            <li>Normal ranges are guidelines - consider individual patient factors</li>
            <li>Trending is more important than single measurements</li>
            <li>Always assess in context of clinical presentation</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Quick Assessment Guidelines -->
    <div class="grid md:grid-cols-2 gap-3">
      <div class="bg-red-900/20 p-3 rounded border border-red-700/50">
        <div class="text-sm text-red-200">
          <strong class="text-red-300">Concerning Signs:</strong>
          <ul class="mt-1 space-y-0.5 text-xs">
            <li>• HR &gt;150 bpm (adult) or age-specific high</li>
            <li>• RR &gt;24 bpm (adult) or labored breathing</li>
            <li>• SBP &lt;90 mmHg (adult) or age-specific low</li>
            <li>• Altered mental status with vital changes</li>
          </ul>
        </div>
      </div>

      <div class="bg-green-900/20 p-3 rounded border border-green-700/50">
        <div class="text-sm text-green-200">
          <strong class="text-green-300">Assessment Tips:</strong>
          <ul class="mt-1 space-y-0.5 text-xs">
            <li>• Use appropriate cuff size for BP</li>
            <li>• Count respirations when patient unaware</li>
            <li>• Palpate pulse for quality and regularity</li>
            <li>• Consider environmental factors (temp, stress)</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- Data Sources -->
  <div class="mt-4 text-xs theme-text-muted">
    <strong>Sources:</strong> WikEM, Nelson Textbook of Pediatrics, Fleming S et al. (2011)
  </div>
</div>