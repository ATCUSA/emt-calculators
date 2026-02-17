<script lang="ts">
  import { Shield } from 'lucide-svelte';
  import { toggleEmergencyMode, getEmergencyMode, initEmergencyMode } from '../lib/emergencyMode.svelte.js';

  initEmergencyMode();

  const isActive = $derived(getEmergencyMode());
</script>

<button
  onclick={toggleEmergencyMode}
  aria-label={isActive ? 'Disable emergency mode' : 'Enable emergency mode'}
  aria-pressed={isActive}
  title={isActive ? 'Emergency mode ON — larger touch targets' : 'Emergency mode OFF'}
  class="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-sm font-medium transition-colors min-h-[44px]
    {isActive
      ? 'bg-red-600 text-white hover:bg-red-700'
      : 'theme-bg-tertiary theme-text-secondary hover:theme-bg-primary border theme-border-secondary'}"
>
  <Shield size={16} />
  <span class="hidden sm:inline">{isActive ? 'EM' : 'EM'}</span>
</button>
