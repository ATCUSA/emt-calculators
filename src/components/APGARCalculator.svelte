<script lang="ts">
  import { Heart, Activity, Timer, AlertTriangle, Info, ExternalLink } from 'lucide-svelte';
  import { APGAR_CATEGORIES, calculateAPGAR, getAPGARColor, getAPGARInterpretationText, APGAR_CLINICAL_NOTES } from '../data/apgar.js';
  import type { APGARScore, APGARResult } from '../types/medical.js';

  // State variables for each APGAR category - start unselected
  let appearance = $state<APGARScore | null>(null);
  let pulse = $state<APGARScore | null>(null);
  let grimace = $state<APGARScore | null>(null);
  let activity = $state<APGARScore | null>(null);
  let respiration = $state<APGARScore | null>(null);
  let timeOfAssessment = $state<'1_minute' | '5_minute' | '10_minute' | 'other'>('1_minute');
  let customTime = $state<string>('');

  // Calculate APGAR result
  const apgarResult = $derived.by((): APGARResult | null => {
    // Only calculate if all scores are selected
    if (appearance === null || pulse === null || grimace === null ||
        activity === null || respiration === null) {
      return null;
    }

    const timeDisplay = timeOfAssessment === 'other' && customTime
      ? customTime
      : timeOfAssessment.replace('_', ' ');

    return calculateAPGAR(appearance, pulse, grimace, activity, respiration, timeDisplay);
  });

  // Get score color based on individual score
  function getScoreColor(score: APGARScore): string {
    switch (score) {
      case 0: return 'bg-red-600 text-white';
      case 1: return 'bg-yellow-600 text-white';
      case 2: return 'bg-green-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  }

  // Reset all scores to unselected
  function resetCalculator(): void {
    appearance = null;
    pulse = null;
    grimace = null;
    activity = null;
    respiration = null;
    timeOfAssessment = '1_minute';
    customTime = '';
  }

  // Quick preset for common scenarios
  function setScenario(scenario: 'healthy' | 'mild_distress' | 'severe_distress'): void {
    switch (scenario) {
      case 'healthy':
        appearance = 2; pulse = 2; grimace = 2; activity = 2; respiration = 2;
        break;
      case 'mild_distress':
        appearance = 1; pulse = 1; grimace = 1; activity = 1; respiration = 1;
        break;
      case 'severe_distress':
        appearance = 0; pulse = 0; grimace = 0; activity = 0; respiration = 0;
        break;
    }
  }
</script>

<div class="theme-bg-secondary p-6 rounded-lg border theme-border-primary max-w-4xl mx-auto">
  <div class="flex items-center gap-2 mb-6">
    <Heart class="theme-accent-primary" size={24} />
    <h2 class="text-xl font-semibold theme-accent-primary">APGAR Score Calculator</h2>
  </div>

  <!-- Quick Scenario Buttons -->
  <div class="mb-6 flex gap-2 flex-wrap">
    <button
      onclick={() => setScenario('healthy')}
      class="px-3 py-1 text-sm rounded bg-green-700 hover:bg-green-600 text-white transition-colors"
    >
      Healthy Newborn
    </button>
    <button
      onclick={() => setScenario('mild_distress')}
      class="px-3 py-1 text-sm rounded bg-yellow-700 hover:bg-yellow-600 text-white transition-colors"
    >
      Mild Distress
    </button>
    <button
      onclick={() => setScenario('severe_distress')}
      class="px-3 py-1 text-sm rounded bg-red-700 hover:bg-red-600 text-white transition-colors"
    >
      Severe Distress
    </button>
  </div>

  <div class="grid lg:grid-cols-2 gap-8">
    <!-- APGAR Scoring Section -->
    <div class="space-y-6">
      <!-- Time of Assessment -->
      <div>
        <label class="block text-sm font-medium theme-text-secondary mb-2">
          <div class="flex items-center gap-1">
            <Timer size={16} />
            Time of Assessment
          </div>
        </label>
        <div class="grid grid-cols-2 gap-2">
          <select
            bind:value={timeOfAssessment}
            class="w-full p-3 theme-bg-tertiary border theme-border-secondary rounded focus:border-blue-500 focus:outline-none theme-text-primary"
          >
            <option value="1_minute">1 minute</option>
            <option value="5_minute">5 minutes</option>
            <option value="10_minute">10 minutes</option>
            <option value="other">Other</option>
          </select>
          {#if timeOfAssessment === 'other'}
            <input
              type="text"
              bind:value={customTime}
              placeholder="e.g., 3 minutes"
              class="w-full p-3 theme-bg-tertiary border theme-border-secondary rounded focus:border-blue-500 focus:outline-none theme-text-primary"
            />
          {/if}
        </div>
      </div>

      <!-- APGAR Categories -->
      {#each Object.entries(APGAR_CATEGORIES) as [categoryKey, categoryData], i (categoryKey)}
        <div class="space-y-3">
          <h3 class="text-lg font-semibold theme-text-primary">
            {categoryData.name} ({categoryData.fullName})
          </h3>

          <div class="grid gap-2">
            {#each categoryData.criteria as criterion, j (j)}
              {@const isSelected = categoryKey === 'appearance' ? appearance === criterion.score :
                                  categoryKey === 'pulse' ? pulse === criterion.score :
                                  categoryKey === 'grimace' ? grimace === criterion.score :
                                  categoryKey === 'activity' ? activity === criterion.score :
                                  respiration === criterion.score}
              <button
                onclick={() => {
                  if (categoryKey === 'appearance') appearance = criterion.score;
                  else if (categoryKey === 'pulse') pulse = criterion.score;
                  else if (categoryKey === 'grimace') grimace = criterion.score;
                  else if (categoryKey === 'activity') activity = criterion.score;
                  else if (categoryKey === 'respiration') respiration = criterion.score;
                }}
                class="p-3 rounded border text-left transition-all {isSelected
                  ? getScoreColor(criterion.score) + ' border-white border-2'
                  : 'theme-bg-tertiary theme-border-secondary hover:theme-bg-primary theme-text-primary border'}"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <div class="font-medium">
                      {criterion.score} - {criterion.description}
                    </div>
                    <div class="text-sm {isSelected ? 'text-gray-200' : 'theme-text-muted'}">
                      {criterion.clinicalSign}
                    </div>
                  </div>
                  <div class="text-lg font-bold {isSelected ? 'text-white' : 'theme-text-secondary'}">
                    {criterion.score}
                  </div>
                </div>
              </button>
            {/each}
          </div>
        </div>
      {/each}
    </div>

    <!-- Results Section -->
    <div class="space-y-6">
      {#if apgarResult}
        <!-- Total Score Display -->
        <div class="p-6 rounded border {getAPGARColor(apgarResult.interpretation)}">
          <div class="text-center">
            <div class="text-4xl font-bold mb-2">
              {apgarResult.totalScore}/10
            </div>
            <div class="text-lg font-medium mb-2">
              APGAR Score
            </div>
            <div class="text-base">
              {getAPGARInterpretationText(apgarResult.interpretation)}
            </div>
            <div class="text-sm mt-1">
              at {apgarResult.timeOfAssessment}
            </div>
          </div>
        </div>
      {:else}
        <!-- Prompt to Select Scores -->
        <div class="p-6 rounded border theme-bg-primary theme-border-secondary">
          <div class="text-center">
            <div class="text-2xl font-bold mb-2 theme-text-muted">
              --/10
            </div>
            <div class="text-lg font-medium mb-2 theme-text-primary">
              APGAR Score
            </div>
            <div class="text-sm theme-text-muted">
              Select all categories to calculate score
            </div>
          </div>
        </div>
      {/if}

      <!-- Individual Scores Breakdown -->
      <div class="theme-bg-primary p-4 rounded border theme-border-secondary">
        <h4 class="font-medium mb-3 theme-text-primary">Category Scores</h4>
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <span class="theme-text-secondary">Appearance:</span>
            <span class="px-2 py-1 rounded {appearance !== null ? getScoreColor(appearance) : 'bg-gray-700 text-gray-400'} text-sm font-medium">
              {appearance !== null ? appearance : '--'}/2
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="theme-text-secondary">Pulse:</span>
            <span class="px-2 py-1 rounded {pulse !== null ? getScoreColor(pulse) : 'bg-gray-700 text-gray-400'} text-sm font-medium">
              {pulse !== null ? pulse : '--'}/2
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="theme-text-secondary">Grimace:</span>
            <span class="px-2 py-1 rounded {grimace !== null ? getScoreColor(grimace) : 'bg-gray-700 text-gray-400'} text-sm font-medium">
              {grimace !== null ? grimace : '--'}/2
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="theme-text-secondary">Activity:</span>
            <span class="px-2 py-1 rounded {activity !== null ? getScoreColor(activity) : 'bg-gray-700 text-gray-400'} text-sm font-medium">
              {activity !== null ? activity : '--'}/2
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="theme-text-secondary">Respiration:</span>
            <span class="px-2 py-1 rounded {respiration !== null ? getScoreColor(respiration) : 'bg-gray-700 text-gray-400'} text-sm font-medium">
              {respiration !== null ? respiration : '--'}/2
            </span>
          </div>
        </div>
      </div>

      <!-- Clinical Guidance -->
      {#if apgarResult && apgarResult.clinicalGuidance.length > 0}
        <div class="panel-blue p-4 rounded border">
          <div class="flex items-start gap-2">
            <Info class="panel-blue-heading mt-0.5 flex-shrink-0" size={16} />
            <div class="text-sm panel-blue-text">
              <strong>Clinical Guidance:</strong>
              <ul class="mt-2 space-y-1">
                {#each apgarResult.clinicalGuidance as guidance, i (i)}
                  <li>• {guidance}</li>
                {/each}
              </ul>
            </div>
          </div>
        </div>
      {/if}

      <!-- Immediate Actions -->
      {#if apgarResult && apgarResult.immediateActions.length > 0}
        <div class="panel-yellow p-4 rounded border">
          <div class="flex items-start gap-2">
            <AlertTriangle class="panel-yellow-heading mt-0.5 flex-shrink-0" size={16} />
            <div class="text-sm panel-yellow-text">
              <strong>Immediate Actions:</strong>
              <ul class="mt-2 space-y-1">
                {#each apgarResult.immediateActions as action, i (i)}
                  <li class="{action.includes('CRITICAL') ? 'text-red-300 font-medium' : ''}">
                    • {action}
                  </li>
                {/each}
              </ul>
            </div>
          </div>
        </div>
      {/if}

      <!-- Reset Button -->
      <button
        onclick={resetCalculator}
        class="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded theme-text-primary transition-colors"
      >
        Reset APGAR Assessment
      </button>
    </div>
  </div>

  <!-- Clinical Notes -->
  <div class="mt-8 space-y-4">
    <div class="panel-purple p-4 rounded border">
      <div class="flex items-start gap-2">
        <Info class="panel-purple-heading mt-0.5 flex-shrink-0" size={16} />
        <div class="text-sm panel-purple-text">
          <strong>Important Notes:</strong>
          <ul class="mt-2 space-y-1 list-disc list-inside">
            <li>{APGAR_CLINICAL_NOTES.timing}</li>
            <li>{APGAR_CLINICAL_NOTES.limitations}</li>
            <li>{APGAR_CLINICAL_NOTES.resuscitation}</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- References -->
    <div class="panel-green p-3 rounded border">
      <div class="flex items-start gap-2">
        <ExternalLink class="panel-green-heading mt-0.5 flex-shrink-0" size={14} />
        <div class="text-xs panel-green-text">
          <strong>References:</strong>
          <div class="mt-1 space-y-1">
            <div>Apgar V. A proposal for a new method of evaluation of the newborn infant. Curr Res Anesth Analg. 1953;32:260.</div>
            <div>ACOG Committee Opinion No. 333: The Apgar score. Obstet Gynecol. 2006;107:1209.</div>
            <div>Casey BM, et al. The continuing value of the Apgar score. N Engl J Med. 2001;344:467.</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>