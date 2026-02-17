<script lang="ts">
  import { Syringe, AlertTriangle, MapPin, BookOpen } from 'lucide-svelte';
  import { IV_CATHETER_DATA } from '../data/ivCatheterReference.js';

  type Tab = 'gauges' | 'selection' | 'complications' | 'sites';

  interface TabDef {
    id: Tab;
    label: string;
    icon: typeof Syringe;
    panelClass: string;
  }

  const tabs: TabDef[] = [
    { id: 'gauges', label: 'Gauge Chart', icon: Syringe, panelClass: 'panel-blue' },
    { id: 'selection', label: 'Selection Guide', icon: BookOpen, panelClass: 'panel-green' },
    { id: 'complications', label: 'Complications', icon: AlertTriangle, panelClass: 'panel-red' },
    { id: 'sites', label: 'Site Selection', icon: MapPin, panelClass: 'panel-purple' }
  ];

  let activeTab = $state<Tab>('gauges');

  function getGaugeColorClass(color: string): string {
    switch (color) {
      case 'Orange': return 'bg-orange-500';
      case 'Gray': return 'bg-gray-400';
      case 'Green': return 'bg-green-500';
      case 'Pink': return 'bg-pink-400';
      case 'Blue': return 'bg-blue-500';
      case 'Yellow': return 'bg-yellow-400';
      case 'Violet': return 'bg-violet-500';
      default: return 'bg-gray-400';
    }
  }
</script>

<div class="theme-bg-secondary p-6 rounded-lg border theme-border-primary max-w-4xl mx-auto">
  <div class="flex items-center gap-2 mb-6">
    <Syringe class="theme-accent-primary" size={24} />
    <h2 class="text-xl font-semibold theme-accent-primary">IV Catheter Quick Reference</h2>
  </div>

  <!-- Tab Navigation -->
  <div class="mb-6 flex gap-2 flex-wrap" role="tablist" aria-label="IV catheter reference sections">
    {#each tabs as tab (tab.id)}
      <button
        role="tab"
        aria-selected={activeTab === tab.id}
        aria-controls="panel-{tab.id}"
        onclick={() => activeTab = tab.id}
        class="px-3 py-3 rounded text-sm transition-colors {activeTab === tab.id
          ? 'bg-blue-600 text-white'
          : 'theme-bg-tertiary theme-text-secondary hover:theme-bg-primary'}"
      >
        <span class="hidden sm:inline">{tab.label}</span>
        <span class="sm:hidden">{tab.label.split(' ')[0]}</span>
      </button>
    {/each}
  </div>

  <!-- Gauge Chart Tab -->
  {#if activeTab === 'gauges'}
    <div id="panel-gauges" role="tabpanel" class="space-y-4">
      <h3 class="text-lg font-semibold panel-blue-heading flex items-center gap-2">
        <Syringe size={18} />
        Peripheral IV Catheter Gauge Chart
      </h3>

      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="theme-bg-tertiary">
              <th class="text-left p-3 theme-text-primary font-medium border theme-border-secondary">Gauge</th>
              <th class="text-center p-3 theme-text-primary font-medium border theme-border-secondary">Color</th>
              <th class="text-center p-3 theme-text-primary font-medium border theme-border-secondary">OD</th>
              <th class="text-center p-3 theme-text-primary font-medium border theme-border-secondary">Length</th>
              <th class="text-center p-3 theme-text-primary font-medium border theme-border-secondary">Flow Rate</th>
            </tr>
          </thead>
          <tbody>
            {#each IV_CATHETER_DATA.catheters as cath, i (cath.gauge)}
              <tr class="{i % 2 === 0 ? 'theme-bg-primary' : 'theme-bg-secondary'} hover:theme-bg-tertiary transition-colors">
                <td class="p-3 font-bold theme-text-primary border theme-border-secondary text-lg">{cath.gauge}G</td>
                <td class="p-3 text-center border theme-border-secondary">
                  <span class="inline-flex items-center gap-2">
                    <span class="{getGaugeColorClass(cath.color)} w-4 h-4 rounded-full inline-block border border-gray-300 dark:border-gray-600"></span>
                    <span class="theme-text-secondary text-sm">{cath.color}</span>
                  </span>
                </td>
                <td class="p-3 text-center theme-text-secondary border theme-border-secondary text-sm font-mono">{cath.outerDiameter}</td>
                <td class="p-3 text-center theme-text-secondary border theme-border-secondary text-sm font-mono">{cath.length}</td>
                <td class="p-3 text-center border theme-border-secondary">
                  <span class="inline-block px-2 py-1 rounded panel-blue panel-blue-text text-sm font-mono">{cath.flowRate}</span>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <!-- Uses breakdown -->
      <div class="space-y-2 mt-4">
        <h4 class="font-medium theme-text-primary">Clinical Uses by Gauge</h4>
        {#each IV_CATHETER_DATA.catheters as cath (cath.gauge)}
          <div class="theme-bg-primary border theme-border-primary rounded p-3">
            <div class="flex items-center gap-2 mb-1">
              <span class="{getGaugeColorClass(cath.color)} w-3 h-3 rounded-full inline-block border border-gray-300 dark:border-gray-600"></span>
              <span class="font-medium theme-text-primary text-sm">{cath.gauge}G ({cath.color})</span>
            </div>
            <p class="theme-text-secondary text-xs">{cath.uses.join(' | ')}</p>
          </div>
        {/each}
      </div>
    </div>

  <!-- Selection Guide Tab -->
  {:else if activeTab === 'selection'}
    <div id="panel-selection" role="tabpanel" class="space-y-4">
      <h3 class="text-lg font-semibold panel-green-heading flex items-center gap-2">
        <BookOpen size={18} />
        Catheter Selection Guidelines
      </h3>

      <div class="space-y-3">
        {#each IV_CATHETER_DATA.selectionGuidelines as guideline (guideline.scenario)}
          <div class="panel-green border rounded-lg p-4">
            <div class="flex flex-wrap items-center gap-2 mb-2">
              <h4 class="panel-green-heading font-medium">{guideline.scenario}</h4>
              <span class="inline-block px-2 py-0.5 rounded panel-blue panel-blue-text text-xs font-bold">{guideline.recommendedGauge}</span>
            </div>
            <p class="panel-green-text text-sm">{guideline.rationale}</p>
          </div>
        {/each}
      </div>
    </div>

  <!-- Complications Tab -->
  {:else if activeTab === 'complications'}
    <div id="panel-complications" role="tabpanel" class="space-y-4">
      <h3 class="text-lg font-semibold panel-red-heading flex items-center gap-2">
        <AlertTriangle size={18} />
        IV Complications
      </h3>

      <div class="panel-red border rounded-lg p-3 mb-2">
        <p class="panel-red-text text-sm">
          <strong class="panel-red-heading">Recognize early and intervene immediately.</strong> Prehospital IV complications can rapidly worsen without intervention.
        </p>
      </div>

      <div class="space-y-4">
        {#each IV_CATHETER_DATA.complications as comp (comp.complication)}
          <div class="theme-bg-primary border theme-border-primary rounded-lg p-4">
            <h4 class="theme-text-primary font-medium text-base mb-3">{comp.complication}</h4>
            <div class="grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span class="panel-yellow-heading font-medium text-xs uppercase tracking-wide">Signs & Symptoms</span>
                <ul class="mt-1 space-y-0.5">
                  {#each comp.signs as sign (sign)}
                    <li class="panel-yellow-text text-sm">* {sign}</li>
                  {/each}
                </ul>
              </div>
              <div>
                <span class="panel-green-heading font-medium text-xs uppercase tracking-wide">Intervention</span>
                <p class="panel-green-text text-sm mt-1">{comp.intervention}</p>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>

  <!-- Site Selection Tab -->
  {:else if activeTab === 'sites'}
    <div id="panel-sites" role="tabpanel" class="space-y-4">
      <h3 class="text-lg font-semibold panel-purple-heading flex items-center gap-2">
        <MapPin size={18} />
        IV Site Selection — Prehospital
      </h3>

      <div class="space-y-3">
        {#each IV_CATHETER_DATA.siteSelection as site (site)}
          {@const parts = site.split(' — ')}
          <div class="panel-purple border rounded-lg p-4">
            {#if parts.length >= 2}
              <h4 class="panel-purple-heading font-medium mb-1">{parts[0]}</h4>
              <p class="panel-purple-text text-sm">{parts.slice(1).join(' — ')}</p>
            {:else}
              <p class="panel-purple-text text-sm">{site}</p>
            {/if}
          </div>
        {/each}
      </div>

      <div class="panel-yellow border rounded-lg p-4 mt-4">
        <h4 class="panel-yellow-heading font-medium mb-2">Prehospital IV Tips</h4>
        <ul class="panel-yellow-text text-sm space-y-1">
          <li>* Apply tourniquet 4-6 inches above intended site</li>
          <li>* Allow vein to fill for 30-60 seconds before attempt</li>
          <li>* Anchor vein by pulling skin taut distal to insertion point</li>
          <li>* Insert at 15-30 degree angle, bevel up</li>
          <li>* Advance catheter after flash, then remove needle</li>
          <li>* Secure catheter well — prehospital movement increases dislodgement risk</li>
        </ul>
      </div>
    </div>
  {/if}

  <!-- Citations -->
  <div class="mt-6 text-xs theme-text-muted">
    <strong>Sources:</strong>
    {#each IV_CATHETER_DATA.citations as citation, i (citation)}
      {citation}{i < IV_CATHETER_DATA.citations.length - 1 ? '; ' : ''}
    {/each}
  </div>
</div>
