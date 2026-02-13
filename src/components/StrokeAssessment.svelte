<!--
  @fileoverview Stroke Assessment Calculator - Unified tool for multiple stroke screening scales
  @description Provides FAST, BEFAST, Cincinnati, and NIHSS scales with dropdown selection
  @safety Critical emergency assessment - time-sensitive condition requiring immediate recognition
  @accessibility Keyboard navigation, screen reader support, emergency mode compatible
-->
<script lang="ts">
  import {
    STROKE_SCALES,
    STROKE_QUICK_REFERENCE,
    calculateStrokeProbability,
    type StrokeAssessmentScale
  } from '../data/strokeAssessment.js';
  import { Clock, AlertTriangle, CheckCircle, XCircle, Info, Phone } from 'lucide-svelte';

  // Reactive state management
  let selectedScaleId = $state<string>('fast');
  let responses = $state<Record<string, string>>({});
  let onsetTime = $state<string>('');
  let showQuickReference = $state<boolean>(false);
  let now = $state<number>(Date.now());

  // Update clock every minute for reactive time display
  $effect(() => {
    const interval = setInterval(() => { now = Date.now(); }, 60_000);
    return () => clearInterval(interval);
  });

  // Derived calculations
  const selectedScale = $derived.by(() =>
    STROKE_SCALES.find(scale => scale.id === selectedScaleId) || STROKE_SCALES[0]
  );

  const strokeAssessment = $derived.by(() =>
    calculateStrokeProbability(selectedScaleId, responses)
  );

  const isComplete = $derived.by(() =>
    selectedScale.components.every(component => responses[component.id])
  );

  const hasAbnormalFindings = $derived.by(() =>
    strokeAssessment.positiveFindings > 0
  );

  const urgencyLevel = $derived.by(() => {
    if (!isComplete) return 'incomplete';
    if (strokeAssessment.severity === 'critical') return 'critical';
    if (strokeAssessment.severity === 'high') return 'high';
    if (strokeAssessment.severity === 'moderate') return 'moderate';
    return 'low';
  });

  const urgencyColors = {
    incomplete: 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600',
    low: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 border-green-300 dark:border-green-600',
    moderate: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 border-yellow-500',
    high: 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 border-orange-500',
    critical: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 border-red-500'
  };

  const urgencyIcons = {
    incomplete: Info,
    low: CheckCircle,
    moderate: AlertTriangle,
    high: AlertTriangle,
    critical: XCircle
  };

  // Event handlers
  function handleScaleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    selectedScaleId = target.value;
    responses = {}; // Reset responses when changing scales
    onsetTime = '';
  }

  function handleResponseChange(componentId: string, optionId: string) {
    responses[componentId] = optionId;
  }

  function resetAssessment() {
    responses = {};
    onsetTime = '';
  }

  // Reactive derived time values that update with the `now` tick
  const currentTime = $derived(new Date(now).toTimeString().slice(0, 5));

  const timeFromOnset = $derived.by(() => {
    if (!onsetTime) return 'Unknown';

    const [hours, minutes] = onsetTime.split(':').map(Number);
    const onsetDate = new Date(now);
    onsetDate.setHours(hours ?? 0, minutes ?? 0, 0, 0);

    // If onset time is in the future, assume it was yesterday
    if (onsetDate.getTime() > now) {
      onsetDate.setDate(onsetDate.getDate() - 1);
    }

    const diffMs = now - onsetDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${diffHours}h ${diffMinutes}m ago`;
  });
</script>

<div class="max-w-4xl mx-auto p-6 space-y-6">
  <!-- Header -->
  <div class="text-center">
    <h2 class="text-3xl font-bold mb-2 theme-accent-primary">Stroke Assessment</h2>
    <p class="theme-text-secondary">
      Time-critical neurological emergency screening - Multiple validated scales
    </p>
  </div>

  <!-- Scale Selection -->
  <div class="theme-bg-secondary p-4 rounded-lg border theme-border-primary">
    <label for="scale-select" class="block text-sm font-medium mb-2 theme-text-primary">
      Select Assessment Scale:
    </label>
    <select
      id="scale-select"
      class="w-full p-3 rounded-md border theme-border-primary theme-bg-primary focus:ring-2 focus:ring-blue-500"
      value={selectedScaleId}
      onchange={handleScaleChange}
    >
      {#each STROKE_SCALES as scale (scale.id)}
        <option value={scale.id}>{scale.name} - {scale.description}</option>
      {/each}
    </select>

    <div class="mt-2 text-sm theme-text-secondary">
      <strong>Time Required:</strong> {selectedScale.timeWindow}
    </div>
  </div>

  <!-- Time Tracking -->
  <div class="grid md:grid-cols-2 gap-4">
    <div class="theme-bg-secondary p-4 rounded-lg border theme-border-primary">
      <label for="onset-time" class="block text-sm font-medium mb-2 theme-text-primary">
        <Clock class="inline w-4 h-4 mr-1" />
        Symptom Onset Time:
      </label>
      <input
        id="onset-time"
        type="time"
        bind:value={onsetTime}
        class="w-full p-2 rounded-md border theme-border-primary focus:ring-2 focus:ring-blue-500"
      />
      <div class="text-xs theme-text-secondary mt-1">
        Critical for treatment decisions - use last known normal if unsure
      </div>
    </div>

    <div class="theme-bg-secondary p-4 rounded-lg border theme-border-primary">
      <div class="text-sm font-medium theme-text-primary mb-2">
        <Clock class="inline w-4 h-4 mr-1" />
        Current Time: {currentTime}
      </div>
      {#if onsetTime}
        <div class="text-sm theme-text-secondary">
          Time from onset: <strong>{timeFromOnset}</strong>
        </div>
        <div class="text-xs text-orange-600 mt-1">
          Thrombolytic window: 4.5 hours | Endovascular: up to 24 hours
        </div>
      {/if}
    </div>
  </div>

  <!-- Assessment Components -->
  <div class="space-y-4">
    {#each selectedScale.components as component (component.id)}
      <div class="theme-bg-secondary p-4 rounded-lg border theme-border-primary">
        <h3 class="text-lg font-semibold mb-2 theme-text-primary">
          {component.name}
        </h3>
        <p class="text-sm theme-text-secondary mb-3">
          <strong>Instructions:</strong> {component.instructions}
        </p>

        <div class="space-y-2">
          {#each component.options as option (option.id)}
            <label class="flex items-start space-x-3 p-4 min-h-[60px] rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
              <input
                type="radio"
                name={component.id}
                value={option.id}
                checked={responses[component.id] === option.id}
                onchange={() => handleResponseChange(component.id, option.id)}
                class="mt-1 text-blue-600 focus:ring-blue-500"
              />
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2">
                  <span class="font-medium theme-text-primary">{option.label}</span>
                  {#if option.abnormal}
                    <span class="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-full">
                      ABNORMAL
                    </span>
                  {/if}
                  {#if option.points !== undefined}
                    <span class="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">
                      {option.points} pts
                    </span>
                  {/if}
                </div>
                <p class="text-sm theme-text-secondary mt-1">{option.description}</p>
              </div>
            </label>
          {/each}
        </div>
      </div>
    {/each}
  </div>

  <!-- Results -->
  {#if isComplete}
    <div class={`p-6 rounded-lg border-2 ${urgencyColors[urgencyLevel]}`} role="status" aria-live="polite">
      <div class="flex items-center space-x-3 mb-4">
        {#if urgencyLevel === 'incomplete'}
          <Info class="w-8 h-8" />
        {:else if urgencyLevel === 'low'}
          <CheckCircle class="w-8 h-8" />
        {:else if urgencyLevel === 'moderate' || urgencyLevel === 'high'}
          <AlertTriangle class="w-8 h-8" />
        {:else}
          <XCircle class="w-8 h-8" />
        {/if}
        <div>
          <h3 class="text-xl font-bold">Assessment Results</h3>
          <p class="text-sm opacity-90">
            {strokeAssessment.positiveFindings} of {strokeAssessment.totalFindings} positive findings
          </p>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 class="font-semibold mb-2">Stroke Probability:</h4>
          <div class="text-2xl font-bold mb-1">{strokeAssessment.probability}%</div>
          <div class="text-sm opacity-90 capitalize">
            {strokeAssessment.severity} probability
          </div>
        </div>

        <div>
          <h4 class="font-semibold mb-2">Clinical Interpretation:</h4>
          <p class="text-sm">
            {strokeAssessment.positiveFindings === 0
              ? selectedScale.interpretation.normal
              : strokeAssessment.severity === 'critical' && selectedScale.interpretation.critical
                ? selectedScale.interpretation.critical
                : selectedScale.interpretation.abnormal
            }
          </p>
        </div>
      </div>

      <div class="border-t pt-4">
        <h4 class="font-semibold mb-2">Recommended Actions:</h4>
        <p class="text-sm">
          {strokeAssessment.positiveFindings === 0
            ? selectedScale.interpretation.recommendations.normal
            : strokeAssessment.severity === 'critical' && selectedScale.interpretation.recommendations.critical
              ? selectedScale.interpretation.recommendations.critical
              : selectedScale.interpretation.recommendations.abnormal
          }
        </p>
      </div>

      <!-- Critical Alert -->
      {#if hasAbnormalFindings}
        <div class="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg">
          <div class="flex items-center space-x-2 text-red-800 dark:text-red-200">
            <Phone class="w-5 h-5" />
            <span class="font-bold">CRITICAL ACTION REQUIRED</span>
          </div>
          <p class="text-sm text-red-700 dark:text-red-300 mt-1">
            Positive stroke screen - IMMEDIATE transport to comprehensive stroke center.
            Contact receiving facility with ETA and assessment findings.
          </p>
        </div>
      {/if}
    </div>
  {/if}

  <!-- Action Buttons -->
  <div class="flex flex-col sm:flex-row gap-3">
    <button
      onclick={resetAssessment}
      aria-label="Reset stroke assessment"
      class="flex-1 px-4 py-5 min-h-[60px] bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
    >
      Reset Assessment
    </button>

    <button
      onclick={() => showQuickReference = !showQuickReference}
      aria-label={showQuickReference ? 'Hide quick reference' : 'Show quick reference'}
      class="flex-1 px-4 py-5 min-h-[60px] bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {showQuickReference ? 'Hide' : 'Show'} Quick Reference
    </button>
  </div>

  <!-- Quick Reference -->
  {#if showQuickReference}
    <div class="theme-bg-secondary p-6 rounded-lg border theme-border-primary">
      <h3 class="text-lg font-semibold mb-4 theme-text-primary">Stroke Quick Reference</h3>

      <div class="grid md:grid-cols-3 gap-6">
        <div>
          <h4 class="font-medium mb-2 text-blue-600">Treatment Windows</h4>
          <ul class="text-sm space-y-1 theme-text-secondary">
            <li><strong>Thrombolytics:</strong> {STROKE_QUICK_REFERENCE.timeWindows.thrombolytics}</li>
            <li><strong>Endovascular:</strong> {STROKE_QUICK_REFERENCE.timeWindows.endovascular}</li>
            <li><strong>Critical Period:</strong> {STROKE_QUICK_REFERENCE.timeWindows.neuroprotection}</li>
          </ul>
        </div>

        <div>
          <h4 class="font-medium mb-2 text-orange-600">Contraindications</h4>
          <ul class="text-sm space-y-1 theme-text-secondary">
            {#each STROKE_QUICK_REFERENCE.contraindications as contraindication, i (i)}
              <li>• {contraindication}</li>
            {/each}
          </ul>
        </div>

        <div>
          <h4 class="font-medium mb-2 text-red-600">Critical Actions</h4>
          <ul class="text-sm space-y-1 theme-text-secondary">
            {#each STROKE_QUICK_REFERENCE.criticalActions as action, i (i)}
              <li>• {action}</li>
            {/each}
          </ul>
        </div>
      </div>

      <div class="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
        <p class="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>Remember:</strong> "Time is Brain" - Every minute of delay reduces chances of good outcome.
          When in doubt, transport immediately to comprehensive stroke center.
        </p>
      </div>
    </div>
  {/if}
</div>

<!-- Screen reader announcements -->
{#if isComplete && hasAbnormalFindings}
  <div class="sr-only" aria-live="assertive">
    Critical stroke findings detected. Immediate transport to stroke center required.
  </div>
{/if}