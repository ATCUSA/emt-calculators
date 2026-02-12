<script lang="ts">
  import { Sun, Moon, Monitor } from 'lucide-svelte';
  import { onMount } from 'svelte';

  type Theme = 'light' | 'dark' | 'auto';

  let currentTheme = $state<Theme>('dark');
  let mounted = $state(false);

  onMount(() => {
    // Get saved theme or default to 'auto'
    const savedTheme = localStorage.getItem('theme') as Theme;
    currentTheme = savedTheme || 'auto';
    applyTheme(currentTheme);
    mounted = true;
  });

  function applyTheme(theme: Theme) {
    const html = document.documentElement;

    if (theme === 'auto') {
      html.removeAttribute('data-theme');
      html.setAttribute('data-theme', 'auto');
    } else {
      html.setAttribute('data-theme', theme);
    }

    localStorage.setItem('theme', theme);
    currentTheme = theme;
  }

  function toggleTheme() {
    const themes: Theme[] = ['dark', 'light', 'auto'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    applyTheme(nextTheme);
  }

  const themeConfig = {
    dark: { icon: Moon, label: 'Dark' },
    light: { icon: Sun, label: 'Light' },
    auto: { icon: Monitor, label: 'Auto' }
  };
</script>

{#if mounted}
  <button
    onclick={toggleTheme}
    class="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-gray-500 transition-colors text-sm"
    title="Toggle theme: {themeConfig[currentTheme].label}"
  >
    <svelte:component this={themeConfig[currentTheme].icon} size={16} class="text-gray-300" />
    <span class="text-gray-300 hidden sm:inline">{themeConfig[currentTheme].label}</span>
  </button>
{/if}

<style>
  /* Theme-aware styling for the toggle button */
  [data-theme="light"] button {
    @apply bg-gray-200 hover:bg-gray-300 border-gray-400 hover:border-gray-500;
  }

  [data-theme="light"] button :global(.text-gray-300) {
    @apply text-gray-700;
  }

  @media (prefers-color-scheme: light) {
    [data-theme="auto"] button {
      @apply bg-gray-200 hover:bg-gray-300 border-gray-400 hover:border-gray-500;
    }

    [data-theme="auto"] button :global(.text-gray-300) {
      @apply text-gray-700;
    }
  }
</style>