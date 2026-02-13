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
      case 'normal': return 'panel-green panel-green-heading';
      case 'caution': return 'panel-yellow panel-yellow-heading';
      case 'critical': return 'panel-red panel-red-heading';
      default: return 'panel-blue panel-blue-heading';
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
              <span class="inline-block px-2 py-1 rounded panel-green panel-green-text">
                {formatRange(ageGroup.heartRate)}
              </span>
            </td>
            <td class="p-3 text-center theme-text-secondary border theme-border-secondary">
              <span class="inline-block px-2 py-1 rounded panel-blue panel-blue-text">
                {formatRange(ageGroup.respiratoryRate)}
              </span>
            </td>
            <td class="p-3 text-center theme-text-secondary border theme-border-secondary">
              <span class="inline-block px-2 py-1 rounded panel-purple panel-purple-text">
                {formatRange(ageGroup.systolicBP)}
              </span>
            </td>
            <td class="p-3 text-center theme-text-secondary border theme-border-secondary">
              {#if ageGroup.diastolicBP}
                <span class="inline-block px-2 py-1 rounded panel-orange panel-orange-text">
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
    <div class="panel-blue p-4 rounded border">
      <div class="flex items-start gap-2">
        <Info class="panel-blue-heading mt-0.5 flex-shrink-0" size={16} />
        <div class="text-sm panel-blue-text-strong">
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
      <div class="panel-red p-3 rounded border">
        <div class="text-sm panel-red-text">
          <strong class="panel-red-heading">Concerning Signs:</strong>
          <ul class="mt-1 space-y-0.5 text-xs">
            <li>• HR &gt;150 bpm (adult) or age-specific high</li>
            <li>• RR &gt;24 bpm (adult) or labored breathing</li>
            <li>• SBP &lt;90 mmHg (adult) or age-specific low</li>
            <li>• Altered mental status with vital changes</li>
          </ul>
        </div>
      </div>

      <div class="panel-green p-3 rounded border">
        <div class="text-sm panel-green-text">
          <strong class="panel-green-heading">Assessment Tips:</strong>
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