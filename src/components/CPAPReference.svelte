<script lang="ts">
  import { Wind, AlertTriangle, Settings, Activity, Wrench, XCircle, Baby, Info } from 'lucide-svelte';
  import { CPAP_DATA, CPAP_SETUP_CHECKLIST } from '../data/cpapReference.js';

  type Tab = 'indications' | 'contraindications' | 'settings' | 'monitoring' | 'troubleshooting' | 'discontinuation' | 'pediatric';

  interface TabDef {
    id: Tab;
    label: string;
    icon: typeof Wind;
    panelClass: string;
  }

  const tabs: TabDef[] = [
    { id: 'indications', label: 'Indications', icon: Wind, panelClass: 'panel-green' },
    { id: 'contraindications', label: 'Contraindications', icon: AlertTriangle, panelClass: 'panel-red' },
    { id: 'settings', label: 'Setup & Settings', icon: Settings, panelClass: 'panel-blue' },
    { id: 'monitoring', label: 'Monitoring', icon: Activity, panelClass: 'panel-purple' },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: Wrench, panelClass: 'panel-yellow' },
    { id: 'discontinuation', label: 'Discontinuation', icon: XCircle, panelClass: 'panel-red' },
    { id: 'pediatric', label: 'Pediatric', icon: Baby, panelClass: 'panel-blue' }
  ];

  let activeTab = $state<Tab>('indications');

  const activeTabDef = $derived.by(() => {
    return tabs.find(t => t.id === activeTab) ?? tabs[0];
  });

  function getUrgencyClass(urgency: 'immediate' | 'urgent' | 'routine'): string {
    switch (urgency) {
      case 'immediate': return 'panel-red';
      case 'urgent': return 'panel-yellow';
      case 'routine': return 'panel-green';
    }
  }

  function getUrgencyLabel(urgency: 'immediate' | 'urgent' | 'routine'): string {
    switch (urgency) {
      case 'immediate': return 'IMMEDIATE';
      case 'urgent': return 'URGENT';
      case 'routine': return 'ROUTINE';
    }
  }
</script>

<div class="theme-bg-secondary p-6 rounded-lg border theme-border-primary max-w-4xl mx-auto">
  <div class="flex items-center gap-2 mb-6">
    <Wind class="theme-accent-primary" size={24} />
    <h2 class="text-xl font-semibold theme-accent-primary">CPAP Quick Reference</h2>
  </div>

  <!-- Tab Navigation -->
  <div class="mb-6 flex gap-2 flex-wrap">
    {#each tabs as tab (tab.id)}
      <button
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

  <!-- Indications Tab -->
  {#if activeTab === 'indications'}
    <div class="space-y-3">
      <h3 class="text-lg font-semibold panel-green-heading flex items-center gap-2">
        <Wind size={18} />
        Indications for Prehospital CPAP
      </h3>
      {#each CPAP_DATA.indications as indication (indication.condition)}
        <div class="panel-green border rounded-lg p-4">
          <h4 class="panel-green-heading font-medium text-base">{indication.condition}</h4>
          <p class="panel-green-text text-sm mt-1">{indication.description}</p>
          {#if indication.notes}
            <p class="panel-green-text text-xs mt-2 italic">
              <strong>Note:</strong> {indication.notes}
            </p>
          {/if}
        </div>
      {/each}
    </div>

  <!-- Contraindications Tab -->
  {:else if activeTab === 'contraindications'}
    <div class="space-y-4">
      <h3 class="text-lg font-semibold panel-red-heading flex items-center gap-2">
        <AlertTriangle size={18} />
        Contraindications
      </h3>

      <div class="space-y-2">
        <h4 class="font-medium theme-text-primary">Absolute Contraindications</h4>
        {#each CPAP_DATA.contraindications.filter(c => c.type === 'absolute') as contra (contra.condition)}
          <div class="panel-red border rounded-lg p-3">
            <div class="flex items-start gap-2">
              <span class="bg-red-600 text-white text-xs px-2 py-0.5 rounded font-bold mt-0.5 flex-shrink-0">ABSOLUTE</span>
              <div>
                <h5 class="panel-red-heading font-medium">{contra.condition}</h5>
                <p class="panel-red-text text-sm mt-0.5">{contra.description}</p>
              </div>
            </div>
          </div>
        {/each}
      </div>

      <div class="space-y-2">
        <h4 class="font-medium theme-text-primary">Relative Contraindications</h4>
        {#each CPAP_DATA.contraindications.filter(c => c.type === 'relative') as contra (contra.condition)}
          <div class="panel-yellow border rounded-lg p-3">
            <div class="flex items-start gap-2">
              <span class="bg-yellow-600 text-white text-xs px-2 py-0.5 rounded font-bold mt-0.5 flex-shrink-0">RELATIVE</span>
              <div>
                <h5 class="panel-yellow-heading font-medium">{contra.condition}</h5>
                <p class="panel-yellow-text text-sm mt-0.5">{contra.description}</p>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>

  <!-- Settings Tab -->
  {:else if activeTab === 'settings'}
    <div class="space-y-4">
      <h3 class="text-lg font-semibold panel-blue-heading flex items-center gap-2">
        <Settings size={18} />
        Pressure & Flow Settings by Condition
      </h3>

      <!-- Settings Table -->
      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="theme-bg-tertiary">
              <th class="text-left p-3 theme-text-primary font-medium border theme-border-secondary">Condition</th>
              <th class="text-center p-3 theme-text-primary font-medium border theme-border-secondary">Pressure</th>
              <th class="text-center p-3 theme-text-primary font-medium border theme-border-secondary">O₂ Flow</th>
              <th class="text-center p-3 theme-text-primary font-medium border theme-border-secondary">FiO₂</th>
            </tr>
          </thead>
          <tbody>
            {#each CPAP_DATA.settings as setting, i (setting.condition)}
              <tr class="{i % 2 === 0 ? 'theme-bg-primary' : 'theme-bg-secondary'} hover:theme-bg-tertiary transition-colors">
                <td class="p-3 font-medium theme-text-primary border theme-border-secondary text-sm">{setting.condition}</td>
                <td class="p-3 text-center border theme-border-secondary">
                  <span class="inline-block px-2 py-1 rounded panel-blue panel-blue-text text-sm font-mono">{setting.pressureRange}</span>
                </td>
                <td class="p-3 text-center border theme-border-secondary">
                  <span class="inline-block px-2 py-1 rounded panel-green panel-green-text text-sm font-mono">{setting.o2Flow}</span>
                </td>
                <td class="p-3 text-center theme-text-secondary border theme-border-secondary text-sm">{setting.fio2 ?? '—'}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <!-- Notes per condition -->
      <div class="space-y-2">
        {#each CPAP_DATA.settings.filter(s => s.notes) as setting (setting.condition)}
          <div class="panel-blue border rounded p-3 text-sm">
            <strong class="panel-blue-heading">{setting.condition}:</strong>
            <span class="panel-blue-text"> {setting.notes}</span>
          </div>
        {/each}
      </div>

      <!-- Setup Checklist -->
      <div class="panel-purple border rounded-lg p-4 mt-4">
        <h4 class="panel-purple-heading font-medium mb-3 flex items-center gap-2">
          <Info size={16} />
          Application Checklist
        </h4>
        <ol class="space-y-1.5">
          {#each CPAP_SETUP_CHECKLIST as step, i (i)}
            <li class="panel-purple-text text-sm flex items-start gap-2">
              <span class="panel-purple-heading font-bold flex-shrink-0">{i + 1}.</span>
              {step}
            </li>
          {/each}
        </ol>
      </div>
    </div>

  <!-- Monitoring Tab -->
  {:else if activeTab === 'monitoring'}
    <div class="space-y-4">
      <h3 class="text-lg font-semibold panel-purple-heading flex items-center gap-2">
        <Activity size={18} />
        Monitoring Parameters
      </h3>

      <div class="space-y-3">
        {#each CPAP_DATA.monitoring as param (param.parameter)}
          <div class="theme-bg-primary border theme-border-primary rounded-lg p-4">
            <div class="flex flex-wrap items-center gap-2 mb-2">
              <h4 class="theme-text-primary font-medium">{param.parameter}</h4>
              <span class="panel-blue panel-blue-text text-xs px-2 py-0.5 rounded">{param.frequency}</span>
            </div>
            <div class="grid sm:grid-cols-2 gap-2 text-sm">
              <div>
                <span class="theme-text-muted text-xs uppercase tracking-wide">Target</span>
                <p class="panel-green-heading font-medium">{param.target}</p>
              </div>
              <div>
                <span class="theme-text-muted text-xs uppercase tracking-wide">If Abnormal</span>
                <p class="panel-red-text">{param.actionIfAbnormal}</p>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>

  <!-- Troubleshooting Tab -->
  {:else if activeTab === 'troubleshooting'}
    <div class="space-y-4">
      <h3 class="text-lg font-semibold panel-yellow-heading flex items-center gap-2">
        <Wrench size={18} />
        Troubleshooting Guide
      </h3>

      {#each CPAP_DATA.troubleshooting as item (item.problem)}
        <div class="panel-yellow border rounded-lg p-4">
          <h4 class="panel-yellow-heading font-medium text-base mb-2">{item.problem}</h4>
          <div class="grid sm:grid-cols-2 gap-3 text-sm">
            <div>
              <span class="panel-yellow-text font-medium text-xs uppercase tracking-wide">Common Causes</span>
              <ul class="mt-1 space-y-0.5">
                {#each item.causes as cause (cause)}
                  <li class="panel-yellow-text">• {cause}</li>
                {/each}
              </ul>
            </div>
            <div>
              <span class="panel-green-heading font-medium text-xs uppercase tracking-wide">Solutions</span>
              <ul class="mt-1 space-y-0.5">
                {#each item.solutions as solution (solution)}
                  <li class="panel-green-text text-sm">• {solution}</li>
                {/each}
              </ul>
            </div>
          </div>
        </div>
      {/each}
    </div>

  <!-- Discontinuation Tab -->
  {:else if activeTab === 'discontinuation'}
    <div class="space-y-4">
      <h3 class="text-lg font-semibold panel-red-heading flex items-center gap-2">
        <XCircle size={18} />
        Discontinuation Criteria
      </h3>

      <div class="panel-red border rounded-lg p-3 mb-2">
        <p class="panel-red-text text-sm">
          <strong class="panel-red-heading">Always have suction and BVM immediately accessible when discontinuing CPAP.</strong>
        </p>
      </div>

      <div class="space-y-3">
        {#each CPAP_DATA.discontinuation as item (item.criterion)}
          <div class="{getUrgencyClass(item.urgency)} border rounded-lg p-4">
            <div class="flex items-start gap-2">
              <span class="bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 text-xs px-2 py-0.5 rounded font-bold mt-0.5 flex-shrink-0">
                {getUrgencyLabel(item.urgency)}
              </span>
              <div>
                <h4 class="font-medium theme-text-primary">{item.criterion}</h4>
                <p class="theme-text-secondary text-sm mt-1">{item.action}</p>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>

  <!-- Pediatric Tab -->
  {:else if activeTab === 'pediatric'}
    <div class="space-y-4">
      <h3 class="text-lg font-semibold panel-blue-heading flex items-center gap-2">
        <Baby size={18} />
        Pediatric Considerations
      </h3>

      <div class="panel-yellow border rounded-lg p-3 mb-2">
        <p class="panel-yellow-text text-sm">
          <strong class="panel-yellow-heading">Prehospital CPAP in pediatric patients is less common.</strong> Most EMS protocols limit CPAP to patients ages 8+ who are cooperative. Neonatal/infant CPAP is a specialized hospital procedure.
        </p>
      </div>

      <div class="space-y-2">
        {#each CPAP_DATA.pediatricConsiderations as consideration (consideration)}
          <div class="panel-blue border rounded-lg p-3">
            <p class="panel-blue-text text-sm">• {consideration}</p>
          </div>
        {/each}
      </div>

      <!-- Pediatric Settings Quick Reference -->
      <div class="theme-bg-primary border theme-border-primary rounded-lg p-4 mt-4">
        <h4 class="theme-text-primary font-medium mb-2">Pediatric Settings Summary</h4>
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span class="theme-text-muted text-xs uppercase">Pressure</span>
            <p class="panel-blue-heading font-medium">5–8 cmH₂O</p>
          </div>
          <div>
            <span class="theme-text-muted text-xs uppercase">O₂ Flow</span>
            <p class="panel-green-heading font-medium">10–15 LPM</p>
          </div>
          <div>
            <span class="theme-text-muted text-xs uppercase">Minimum Age</span>
            <p class="theme-text-primary font-medium">~8 years (cooperative)</p>
          </div>
          <div>
            <span class="theme-text-muted text-xs uppercase">Mask</span>
            <p class="theme-text-primary font-medium">Pediatric sized</p>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- Citations -->
  <div class="mt-6 text-xs theme-text-muted">
    <strong>Sources:</strong>
    {#each CPAP_DATA.citations as citation, i (citation)}
      {citation}{i < CPAP_DATA.citations.length - 1 ? '; ' : ''}
    {/each}
  </div>
</div>
