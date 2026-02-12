<script lang="ts">
  import { Heart } from 'lucide-svelte';

  let {
    variant = 'subtle',
    showDismiss = true
  }: {
    variant?: 'subtle' | 'prominent';
    showDismiss?: boolean;
  } = $props();

  let isDismissed = $state(false);

  function dismissPrompt() {
    isDismissed = true;
    // Store dismissal in localStorage to remember for this session
    localStorage.setItem('supportPromptDismissed', 'true');
  }

  // Check if already dismissed this session
  function checkDismissed() {
    if (typeof localStorage !== 'undefined') {
      isDismissed = localStorage.getItem('supportPromptDismissed') === 'true';
    }
  }

  // Initialize dismissal state
  $effect(() => {
    checkDismissed();
  });
</script>

{#if !isDismissed}
  <div class="support-prompt {variant === 'prominent' ? 'prominent' : 'subtle'}">
    {#if variant === 'subtle'}
      <!-- Subtle inline version -->
      <div class="bg-blue-900/10 border border-blue-700/30 rounded-lg p-4 my-6">
        <div class="flex items-start gap-3">
          <Heart class="text-red-400 mt-1 flex-shrink-0" size={18} />
          <div class="flex-1">
            <p class="text-sm theme-text-secondary">
              <strong class="theme-text-primary">Find this helpful?</strong>
              Support keeps these tools free and updated for the EMS community.
            </p>
            <div class="mt-3 flex items-center gap-3">
              <a
                href="https://www.buymeacoffee.com/acole"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-block hover:opacity-80 transition-opacity"
              >
                <img
                  src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png"
                  alt="Buy Me A Coffee"
                  class="h-[32px] w-auto"
                />
              </a>
              {#if showDismiss}
                <button
                  onclick={dismissPrompt}
                  class="text-xs theme-text-muted hover:theme-text-secondary transition-colors"
                >
                  Maybe later
                </button>
              {/if}
            </div>
          </div>
        </div>
      </div>
    {:else}
      <!-- Prominent version -->
      <div class="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-600/50 rounded-lg p-6 my-8">
        <div class="text-center space-y-4">
          <div class="flex justify-center">
            <Heart class="text-red-400" size={24} />
          </div>
          <h3 class="text-lg font-semibold theme-text-primary">
            Built by EMTs, for EMTs
          </h3>
          <p class="theme-text-secondary max-w-md mx-auto">
            If these tools help you care for patients, your support helps keep them updated and free for everyone.
            All contributions go toward development and hosting — not corporate profit.
          </p>
          <div class="flex flex-col items-center gap-3">
            <a
              href="https://www.buymeacoffee.com/acole"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-block hover:opacity-80 transition-opacity"
            >
              <img
                src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png"
                alt="Buy Me A Coffee or Buy Me Trauma Shears"
                class="h-[45px] w-auto"
              />
            </a>
            {#if showDismiss}
              <button
                onclick={dismissPrompt}
                class="text-sm theme-text-muted hover:theme-text-secondary transition-colors"
              >
                Continue without supporting
              </button>
            {/if}
          </div>
        </div>
      </div>
    {/if}
  </div>
{/if}