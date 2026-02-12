<script lang="ts">
  import { Menu, X } from 'lucide-svelte';

  let isOpen = $state(false);

  function toggleMenu() {
    isOpen = !isOpen;
  }

  function closeMenu() {
    isOpen = false;
  }

  // Close menu when clicking outside
  function handleOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.mobile-nav-container')) {
      closeMenu();
    }
  }

  // Handle escape key
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeMenu();
    }
  }
</script>

<svelte:window on:click={handleOutsideClick} on:keydown={handleKeydown} />

<div class="mobile-nav-container sm:hidden">
  <!-- Hamburger Button -->
  <button
    onclick={toggleMenu}
    class="p-2 theme-text-secondary hover:theme-accent-primary transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
    aria-label="Toggle mobile menu"
    aria-expanded={isOpen}
  >
    {#if isOpen}
      <X size={24} />
    {:else}
      <Menu size={24} />
    {/if}
  </button>

  <!-- Mobile Menu Overlay -->
  {#if isOpen}
    <div class="fixed inset-0 z-50 sm:hidden">
      <!-- Background Overlay -->
      <div class="fixed inset-0 bg-black/50" onclick={closeMenu}></div>

      <!-- Menu Panel -->
      <div class="fixed top-0 right-0 h-full w-64 theme-bg-secondary border-l theme-border-primary transform transition-transform duration-300 ease-in-out">
        <div class="flex flex-col h-full">
          <!-- Header -->
          <div class="flex items-center justify-between p-4 border-b theme-border-primary">
            <span class="font-semibold theme-text-primary">Menu</span>
            <button
              onclick={closeMenu}
              class="p-1 theme-text-secondary hover:theme-accent-primary transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <!-- Navigation Links -->
          <nav class="flex-1 px-4 py-6">
            <div class="space-y-4">
              <a
                href="/calculators"
                onclick={closeMenu}
                class="block py-3 px-2 text-base theme-text-secondary hover:theme-accent-primary hover:bg-gray-100/10 rounded transition-colors"
              >
                🧮 Calculators
              </a>
              <a
                href="/references"
                onclick={closeMenu}
                class="block py-3 px-2 text-base theme-text-secondary hover:theme-accent-primary hover:bg-gray-100/10 rounded transition-colors"
              >
                📚 References
              </a>
              <a
                href="/about"
                onclick={closeMenu}
                class="block py-3 px-2 text-base theme-text-secondary hover:theme-accent-primary hover:bg-gray-100/10 rounded transition-colors"
              >
                ℹ️ About
              </a>
            </div>

            <!-- Divider -->
            <div class="my-6 border-t theme-border-secondary"></div>

            <!-- Quick Tools -->
            <div class="space-y-3">
              <h3 class="text-sm font-medium theme-text-muted uppercase tracking-wider">Quick Tools</h3>
              <a
                href="/o2-calculator"
                onclick={closeMenu}
                class="block py-2 px-2 text-sm theme-text-secondary hover:theme-accent-primary hover:bg-gray-100/10 rounded transition-colors"
              >
                O₂ Tank Calculator
              </a>
              <a
                href="/vital-signs-calculator"
                onclick={closeMenu}
                class="block py-2 px-2 text-sm theme-text-secondary hover:theme-accent-primary hover:bg-gray-100/10 rounded transition-colors"
              >
                Vital Signs Assessment
              </a>
              <a
                href="/apgar-calculator"
                onclick={closeMenu}
                class="block py-2 px-2 text-sm theme-text-secondary hover:theme-accent-primary hover:bg-gray-100/10 rounded transition-colors"
              >
                APGAR Score
              </a>
              <a
                href="/gcs-calculator"
                onclick={closeMenu}
                class="block py-2 px-2 text-sm theme-text-secondary hover:theme-accent-primary hover:bg-gray-100/10 rounded transition-colors"
              >
                Glasgow Coma Scale
              </a>
              <a
                href="/igel-calculator"
                onclick={closeMenu}
                class="block py-2 px-2 text-sm theme-text-secondary hover:theme-accent-primary hover:bg-gray-100/10 rounded transition-colors"
              >
                i-gel Size Calculator
              </a>
            </div>
          </nav>

          <!-- Footer -->
          <div class="p-4 border-t theme-border-primary space-y-3">
            <div class="text-center">
              <a
                href="https://www.buymeacoffee.com/acole"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-block hover:opacity-80 transition-opacity"
              >
                <img
                  src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png"
                  alt="Buy Me A Coffee"
                  class="h-[40px] w-auto"
                />
              </a>
            </div>
            <p class="text-xs theme-text-muted text-center">
              EMT Calculator Tools<br>
              <span class="theme-accent-primary">Built by EMTs for EMTs</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>